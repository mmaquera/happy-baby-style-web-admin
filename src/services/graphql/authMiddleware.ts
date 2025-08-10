// AuthMiddleware - Apollo Client middleware for authentication
// Following SOLID principles and Clean Architecture

import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { AuthServiceFactory, GraphQLAuthService } from '../auth/AuthService';

export interface AuthMiddlewareConfig {
  uri: string;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export class AuthMiddleware {
  private authService: GraphQLAuthService;
  private client: ApolloClient<any>;

  constructor(client: ApolloClient<any>) {
    this.client = client;
    this.authService = AuthServiceFactory.createGraphQLAuthService(client);
  }

  // Create auth link that adds Authorization header
  private createAuthLink(): ApolloLink {
    return setContext(async (_operation, { headers }) => {
      const tokens = this.getStoredTokens();
      
      if (tokens && !this.isTokenExpired(tokens)) {
        return {
          headers: {
            ...headers,
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        };
      }
      
      // Try to refresh token if expired
      if (tokens?.refreshToken) {
        try {
          const newTokens = await this.authService.refreshToken(tokens.refreshToken);
          return {
            headers: {
              ...headers,
              Authorization: `Bearer ${newTokens.accessToken}`,
            },
          };
        } catch (error) {
          // Refresh failed, clear tokens and continue without auth
          this.clearTokens();
        }
      }
      
      return { headers };
    });
  }

  // Create error link for handling auth errors
  private createErrorLink(): ApolloLink {
    return onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        for (const err of graphQLErrors) {
          // Handle authentication errors
          if (err.extensions?.code === 'UNAUTHENTICATED' || err.message.includes('jwt')) {
            console.warn('Authentication error detected:', err.message);
            
            // Clear tokens and redirect to login
            this.clearTokens();
            this.redirectToLogin();
            return;
          }
          
          // Handle authorization errors
          if (err.extensions?.code === 'FORBIDDEN') {
            console.warn('Authorization error detected:', err.message);
            // Could redirect to unauthorized page or show error
            return;
          }
        }
      }
      
      if (networkError) {
        console.error('Network error:', networkError);
        
        // Handle network errors that might be auth-related
        if ('statusCode' in networkError && networkError.statusCode === 401) {
          this.clearTokens();
          this.redirectToLogin();
        }
      }
    });
  }

  // Create retry link for failed requests
  private createRetryLink(config: AuthMiddlewareConfig): ApolloLink {
    if (!config.enableRetry) {
      return new ApolloLink((operation, forward) => forward(operation));
    }

    return new RetryLink({
      delay: {
        initial: config.retryDelay || 300,
        max: Infinity,
        jitter: true,
      },
      attempts: {
        max: config.maxRetries || 3,
        retryIf: (error, _operation) => {
          // Don't retry auth errors
          if (error?.extensions?.code === 'UNAUTHENTICATED') {
            return false;
          }
          
          // Retry network errors and server errors
          return !!error;
        },
      },
    });
  }

  // Create the complete Apollo Client with auth middleware
  static createClient(config: AuthMiddlewareConfig): ApolloClient<any> {
    const httpLink = createHttpLink({
      uri: config.uri,
    });

    const authMiddleware = new AuthMiddleware({} as ApolloClient<any>);
    
    const authLink = authMiddleware.createAuthLink();
    const errorLink = authMiddleware.createErrorLink();
    const retryLink = authMiddleware.createRetryLink(config);

    const client = new ApolloClient({
      link: from([retryLink, errorLink, authLink, httpLink]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all',
        },
        query: {
          errorPolicy: 'all',
        },
      },
    });

    // Update the auth middleware with the created client
    authMiddleware.client = client;
    authMiddleware.authService = AuthServiceFactory.createGraphQLAuthService(client);

    return client;
  }

  // Utility methods
  private getStoredTokens() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    
    if (!accessToken) return null;
    
    return {
      accessToken,
      refreshToken: refreshToken || undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 3600000)
    };
  }

  private isTokenExpired(tokens: any): boolean {
    return tokens.expiresAt < new Date();
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
  }

  private redirectToLogin(): void {
    // Use window.location for now, but could be injected via DI
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
}

// Factory function for creating Apollo Client with auth
export const createApolloClientWithAuth = (config: AuthMiddlewareConfig): ApolloClient<any> => {
  return AuthMiddleware.createClient(config);
};

// Default configuration
export const defaultAuthConfig: AuthMiddlewareConfig = {
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3001/graphql',
  enableRetry: true,
  maxRetries: 3,
  retryDelay: 300,
};
