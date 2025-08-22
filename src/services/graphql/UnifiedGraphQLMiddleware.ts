// UnifiedGraphQLMiddleware - Following Clean Architecture and SOLID principles
// Single Responsibility: Handles GraphQL authentication middleware
// Dependency Inversion: Depends on UnifiedAuthService abstraction

import { ApolloClient, ApolloLink, InMemoryCache, from, createHttpLink } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { UnifiedAuthService, AuthServiceFactory, LocalTokenStorage } from '../auth/UnifiedAuthService';
import { GraphQLMiddlewareConfig, ITokenStorage } from '../../types/auth';

// Configuration interface is now imported from types

export class UnifiedGraphQLMiddleware {
  private tokenStorage: ITokenStorage;

  constructor() {
    // Use only token storage to avoid circular dependency
    // The middleware doesn't need the full auth service, just token management
    this.tokenStorage = new LocalTokenStorage();
  }

  // Create auth link that adds Authorization header
  private createAuthLink(): ApolloLink {
    return setContext(async (_operation, { headers }) => {
      try {
        const tokens = this.tokenStorage.getStoredTokens();
        
        if (tokens && !this.tokenStorage.isTokenExpired(tokens)) {
          const newHeaders = {
            ...headers,
            Authorization: `Bearer ${tokens.accessToken}`,
          };
          return { headers: newHeaders };
        }
      } catch (error) {
        // Silent error handling
      }
      
      return { headers };
    });
  }

  // Create error link that handles authentication errors
  private createErrorLink(): ApolloLink {
    return onError(({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, extensions }) => {
          // Handle authentication errors - but don't clear tokens immediately
          if (extensions?.['code'] === 'UNAUTHENTICATED') {
            // Only log the error, don't handle it here
            // Let the auth context handle token refresh
            console.warn('GraphQL authentication error:', message);
            return;
          }
          
          // Handle authorization errors
          if (extensions?.['code'] === 'FORBIDDEN') {
            // Don't clear tokens for authorization errors
            console.warn('GraphQL authorization error:', message);
          }
        });
      }

      if (networkError) {
        // Don't clear tokens for network errors
        console.warn('GraphQL network error:', networkError);
      }
    });
  }

  // Create CORS-aware link for handling cross-origin requests
  private createCorsLink(): ApolloLink {
    return new ApolloLink((operation, forward) => {
      const context = operation.getContext();
      const isLocalhost = context['uri']?.includes('localhost') || 
                         context['uri']?.includes('127.0.0.1');
      
      operation.setContext({
        ...context,
        fetchOptions: {
          mode: 'cors',
          credentials: isLocalhost ? 'include' : 'same-origin',
        },
      });
      
      return forward(operation);
    });
  }

  // Create upload link using apollo-upload-client (configuración estándar)
  private createUploadLink(config: GraphQLMiddlewareConfig): ApolloLink {
    return createUploadLink({
      uri: config.uri,
      // ✅ Configuración estándar para multipart/form-data
      fetchOptions: {
        mode: 'cors',
        credentials: 'include',
      },
      // ✅ Logs de debug para verificar el envío
      isExtractableFile: (value: any) => {
        const isFile = value instanceof File || value instanceof Blob;
        console.log('🔍 UploadLink - isExtractableFile:', { value, isFile, type: typeof value });
        return isFile;
      },
      // ✅ Logs de debug para FormData
      formDataAppendFile: (formData: FormData, fieldName: string, file: any) => {
        console.log('🔍 UploadLink - formDataAppendFile:', { fieldName, file, formDataEntries: Array.from(formData.entries()) });
        if (file instanceof File || file instanceof Blob) {
          formData.append(fieldName, file, file instanceof File ? file.name : 'blob');
        }
      },
    });
  }

  // ✅ CSRF Link eliminado - servidor tiene csrfPrevention: false

  // Create retry link with authentication-aware retry logic
  private createRetryLink(config: GraphQLMiddlewareConfig): ApolloLink {
    const retryLink = new RetryLink({
      delay: {
        initial: 300,
        max: 3000,
        jitter: true
      },
      attempts: {
        max: 3,
        retryIf: (error, _operation) => {
          // Don't retry authentication operations to prevent infinite loops
          if (_operation.operationName === 'LoginUser' || 
              _operation.operationName === 'RefreshToken' ||
              _operation.operationName === 'LogoutUser') {
            return false;
          }
          
          // Don't retry on authentication errors
          if (error?.graphQLErrors?.some((err: any) => err.extensions?.['code'] === 'UNAUTHENTICATED')) {
            return false;
          }
          
          // Don't retry on network errors that might be auth-related
          if (error?.networkError && 'statusCode' in error.networkError && error.networkError.statusCode === 401) {
            return false;
          }
          
          return true;
        }
      }
    });
    
    return retryLink;
  }

  // Handle authentication errors
  private handleAuthError(): void {
    // Don't clear tokens immediately - let the auth system handle token validation
    // Only clear tokens if they are definitely invalid after refresh attempt
    console.warn('Authentication error detected - tokens may need refresh');
    
    // Don't redirect automatically - let the auth context handle it
  }

  // Static method to clear stored tokens (can be called before creating the client)
  static clearStoredTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
  }

  // Instance method to clear tokens
  clearTokens(): void {
    this.tokenStorage.clearTokens();
  }

  // Check if there are stored tokens
  hasStoredTokens(): boolean {
    const tokens = this.tokenStorage.getStoredTokens();
    return tokens !== null;
  }

  // Create the complete Apollo Client with unified middleware
  static createClient(config: GraphQLMiddlewareConfig): ApolloClient<any> {
    // Don't clear stored tokens automatically - let the auth system handle token validation
    


    const client = new ApolloClient({
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

    // Create middleware with the client
    const middleware = new UnifiedGraphQLMiddleware();
    
    const authLink = middleware.createAuthLink();
    const errorLink = middleware.createErrorLink();
    const retryLink = middleware.createRetryLink(config);
    const uploadLink = middleware.createUploadLink(config);

    // Set the link chain with upload link primero para evitar interferencias
    client.setLink(from([uploadLink, retryLink, errorLink, authLink]));

    return client;
  }
}

// Factory function for creating Apollo Client with unified middleware
export const createApolloClientWithUnifiedMiddleware = (config: GraphQLMiddlewareConfig): ApolloClient<any> => {
  return UnifiedGraphQLMiddleware.createClient(config);
};

// Default configuration
export const defaultGraphQLConfig: GraphQLMiddlewareConfig = {
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3001/graphql',
  enableRetry: true,
  maxRetries: 3,
  retryDelay: 300,
  enableUploads: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: [
    'image/jpeg', // ✅ JPEG
    'image/jpg',  // ✅ JPG (alias de JPEG)
    'image/png',  // ✅ PNG
    'image/webp'  // ✅ WebP
  ],
};
