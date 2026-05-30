import {
  ApolloClient,
  type ApolloLink,
  InMemoryCache,
  type NormalizedCacheObject,
  type TypePolicies,
  from,
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { LocalTokenStorage } from '@/services/auth/UnifiedAuthService';
import {
  type GraphQLMiddlewareConfig,
  type ITokenStorage,
} from '@/types/auth';
import { logger } from '@/utils/logger';

export class UnifiedGraphQLMiddleware {
  private tokenStorage: ITokenStorage;

  constructor() {
    this.tokenStorage = new LocalTokenStorage();
  }

  private createAuthLink(): ApolloLink {
    return setContext(async (_operation, { headers }) => {
      try {
        const tokens = this.tokenStorage.getStoredTokens();

        if (tokens) {
          if (!this.tokenStorage.isTokenExpired(tokens)) {
            return {
              headers: {
                ...headers,
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            };
          } else {
            logger.warn('AuthLink: Token expirado, no se agrega Authorization');
          }
        }
      } catch (error) {
        logger.error('AuthLink: Error al obtener tokens:', error);
      }

      return { headers };
    });
  }

  private createErrorLink(): ApolloLink {
    return onError(
      ({ graphQLErrors, networkError, operation, forward: _forward }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, extensions, locations, path }) => {
            logger.error('GraphQL Error:', {
              message,
              code: extensions?.['code'],
              locations,
              path,
              operation: operation.operationName,
            });

            const code = extensions?.['code'];
            if (
              code === 'UNAUTHENTICATED' ||
              code === 'FORBIDDEN' ||
              code === 'VALIDATION_ERROR'
            ) {
              logger.warn(`${code} error:`, message);
            }
          });
        }

        if (networkError) {
          logger.error('Network Error:', {
            message: networkError.message,
            statusCode:
              'statusCode' in networkError
                ? networkError.statusCode
                : undefined,
            operation: operation.operationName,
          });
        }
      }
    );
  }

  private createUploadLink(config: GraphQLMiddlewareConfig): ApolloLink {
    return createUploadLink({
      uri: config.uri,
      fetchOptions: { mode: 'cors', credentials: 'include' },
      isExtractableFile: (value: unknown) =>
        value instanceof File || value instanceof Blob,
      formDataAppendFile: (
        formData: FormData,
        fieldName: string,
        file: File | Blob
      ) => {
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

  private createRetryLink(_config: GraphQLMiddlewareConfig): ApolloLink {
    return new RetryLink({
      delay: { initial: 300, max: 3000, jitter: true },
      attempts: {
        max: 3,
        retryIf: (error, _operation) => {
          const noRetryOps = ['LoginUser', 'RefreshToken', 'LogoutUser'];
          if (noRetryOps.includes(_operation.operationName)) return false;

          if (
            error?.graphQLErrors?.some(
              (err: { extensions?: { code?: string } }) =>
                err.extensions?.['code'] === 'UNAUTHENTICATED'
            )
          ) {
            return false;
          }

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
  }

  static clearStoredTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
  }

  clearTokens(): void {
    this.tokenStorage.clearTokens();
  }

  hasStoredTokens(): boolean {
    return this.tokenStorage.getStoredTokens() !== null;
  }

  static createClient(
    config: GraphQLMiddlewareConfig,
    cacheTypePolicies?: TypePolicies
  ): ApolloClient<NormalizedCacheObject> {
    const client = new ApolloClient({
      cache: new InMemoryCache(
        ...(cacheTypePolicies ? [{ typePolicies: cacheTypePolicies }] : [])
      ),
      defaultOptions: {
        watchQuery: { errorPolicy: 'all' },
        query: { errorPolicy: 'all' },
      },
    });

    const middleware = new UnifiedGraphQLMiddleware();
    client.setLink(
      from([
        middleware.createAuthLink(),
        middleware.createErrorLink(),
        middleware.createRetryLink(config),
        middleware.createUploadLink(config),
      ])
    );

    return client;
  }
}

export const createApolloClientWithUnifiedMiddleware = (
  config: GraphQLMiddlewareConfig,
  cacheTypePolicies?: TypePolicies
): ApolloClient<NormalizedCacheObject> =>
  UnifiedGraphQLMiddleware.createClient(config, cacheTypePolicies);
