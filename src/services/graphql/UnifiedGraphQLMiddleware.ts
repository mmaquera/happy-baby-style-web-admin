// UnifiedGraphQLMiddleware - Following Clean Architecture and SOLID principles
// Single Responsibility: Handles GraphQL authentication middleware
// Dependency Inversion: Depends on UnifiedAuthService abstraction

import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  from,
  createHttpLink,
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import {
  UnifiedAuthService,
  AuthServiceFactory,
  LocalTokenStorage,
} from '../auth/UnifiedAuthService';
import { GraphQLMiddlewareConfig, ITokenStorage } from '../../types/auth';
import { logger } from '../../utils/logger';

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

        if (tokens) {
          if (!this.tokenStorage.isTokenExpired(tokens)) {
            const newHeaders = {
              ...headers,
              Authorization: `Bearer ${tokens.accessToken}`,
            };
            logger.debug(
              '✅ AuthLink: Token válido, agregando header Authorization'
            );
            return { headers: newHeaders };
          } else {
            logger.warn(
              '⚠️ AuthLink: Token expirado, no se agrega header Authorization'
            );
            logger.warn(
              'Token expires at:',
              tokens.expiresAt,
              'Current time:',
              new Date()
            );
          }
        } else {
          logger.warn(
            '⚠️ AuthLink: No hay tokens almacenados, no se agrega header Authorization'
          );
        }
      } catch (error) {
        logger.error('❌ AuthLink: Error al obtener tokens:', error);
      }

      return { headers };
    });
  }

  // Create error link that handles authentication errors - Following SOLID principles
  private createErrorLink(): ApolloLink {
    return onError(({ graphQLErrors, networkError, operation, forward }) => {
      // Handle GraphQL errors following development standards
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, extensions, locations, path }) => {
          // Enhanced logging for debugging
          logger.error('GraphQL Error:', {
            message,
            code: extensions?.['code'],
            locations,
            path,
            operation: operation.operationName,
          });

          // Handle authentication errors specifically
          if (extensions?.['code'] === 'UNAUTHENTICATED') {
            logger.warn('Authentication error detected:', message);
            // Don't clear tokens immediately - let the auth context handle it
            return;
          }

          // Handle authorization errors
          if (extensions?.['code'] === 'FORBIDDEN') {
            logger.warn('Authorization error detected:', message);
            return;
          }

          // Handle validation errors
          if (extensions?.['code'] === 'VALIDATION_ERROR') {
            logger.warn('Validation error detected:', message);
            return;
          }
        });
      }

      // Handle network errors following development standards
      if (networkError) {
        logger.error('Network Error:', {
          message: networkError.message,
          statusCode:
            'statusCode' in networkError ? networkError.statusCode : undefined,
          operation: operation.operationName,
        });

        // Don't clear tokens for network errors
        if ('statusCode' in networkError && networkError.statusCode === 401) {
          logger.warn('Unauthorized network error - may need token refresh');
        }
      }
    });
  }

  // Create CORS-aware link for handling cross-origin requests
  private createCorsLink(): ApolloLink {
    return new ApolloLink((operation, forward) => {
      const context = operation.getContext();
      const isLocalhost =
        context['uri']?.includes('localhost') ||
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
        logger.debug('🔍 UploadLink - isExtractableFile:', {
          value,
          isFile,
          type: typeof value,
        });
        return isFile;
      },
      // ✅ Logs de debug para FormData
      formDataAppendFile: (
        formData: FormData,
        fieldName: string,
        file: any
      ) => {
        logger.debug('🔍 UploadLink - formDataAppendFile:', {
          fieldName,
          file,
          formDataEntries: Array.from(formData.entries()),
        });
        if (file instanceof File || file instanceof Blob) {
          formData.append(
            fieldName,
            file,
            file instanceof File ? file.name : 'blob'
          );
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
        jitter: true,
      },
      attempts: {
        max: 3,
        retryIf: (error, _operation) => {
          // Don't retry authentication operations to prevent infinite loops
          if (
            _operation.operationName === 'LoginUser' ||
            _operation.operationName === 'RefreshToken' ||
            _operation.operationName === 'LogoutUser'
          ) {
            return false;
          }

          // Don't retry on authentication errors
          if (
            error?.graphQLErrors?.some(
              (err: any) => err.extensions?.['code'] === 'UNAUTHENTICATED'
            )
          ) {
            return false;
          }

          // Don't retry on network errors that might be auth-related
          if (
            error?.networkError &&
            'statusCode' in error.networkError &&
            error.networkError.statusCode === 401
          ) {
            return false;
          }

          return true;
        },
      },
    });

    return retryLink;
  }

  // Handle authentication errors
  private handleAuthError(): void {
    // Don't clear tokens immediately - let the auth system handle token validation
    // Only clear tokens if they are definitely invalid after refresh attempt
    logger.warn('Authentication error detected - tokens may need refresh');

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

    // Set the link chain - authLink primero para agregar headers de autenticación
    // Orden: authLink → errorLink → retryLink → uploadLink
    client.setLink(from([authLink, errorLink, retryLink, uploadLink]));

    return client;
  }
}

// Factory function for creating Apollo Client with unified middleware
export const createApolloClientWithUnifiedMiddleware = (
  config: GraphQLMiddlewareConfig
): ApolloClient<any> => {
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
    'image/jpg', // ✅ JPG (alias de JPEG)
    'image/png', // ✅ PNG
    'image/webp', // ✅ WebP
  ],
};
