// AuthService - Following SOLID principles and Clean Architecture
// Single Responsibility: Handles authentication only
// Open/Closed: Extensible for new auth providers
// Dependency Inversion: Depends on abstractions

import { type ApolloClient, type NormalizedCacheObject } from '@apollo/client';
import {
  LoginUserDocument,
  RefreshTokenDocument,
  LogoutUserDocument,
  GetCurrentUserDocument,
} from '@/generated/graphql';
import { type UserRole } from '../../types/unified';
import { logger } from '@/utils/logger';

// Interfaces following Interface Segregation Principle
export interface IAuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
}

export interface IAuthUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  };
}

export interface IAuthResponse {
  success: boolean;
  user: IAuthUser;
  tokens: IAuthToken;
  message: string;
}

export interface IAuthError {
  code: string;
  message: string;
  details?: unknown;
}

// Abstract base class following Template Method pattern
export abstract class BaseAuthService {
  protected abstract client: ApolloClient<NormalizedCacheObject>;

  abstract login(credentials: LoginCredentials): Promise<IAuthResponse>;
  abstract logout(): Promise<void>;
  abstract refreshToken(refreshToken: string): Promise<IAuthToken>;
  abstract getCurrentUser(): Promise<IAuthUser | null>;
  abstract isAuthenticated(): boolean;

  // Template method for common auth flow
  protected async handleAuthResponse(response: {
    success?: unknown;
    message?: unknown;
    accessToken?: unknown;
    token?: unknown;
    refreshToken?: unknown;
    expiresAt?: unknown;
    user?: unknown;
  }): Promise<IAuthResponse> {
    if (!response.success) {
      throw new Error(
        typeof response.message === 'string'
          ? response.message
          : 'Authentication failed'
      );
    }

    const rawExpiresAt = response.expiresAt;
    const tokens: IAuthToken = {
      accessToken: String(response.accessToken ?? response.token ?? ''),
      ...(typeof response.refreshToken === 'string'
        ? { refreshToken: response.refreshToken }
        : {}),
      expiresAt: rawExpiresAt
        ? new Date(rawExpiresAt as string | number)
        : new Date(Date.now() + 3600000),
    };

    // Store tokens securely
    await this.storeTokens(tokens);

    return {
      success: true,
      user: response.user as IAuthUser,
      tokens,
      message:
        typeof response.message === 'string'
          ? response.message
          : 'Authentication successful',
    };
  }

  protected async storeTokens(tokens: IAuthToken): Promise<void> {
    // Store in localStorage for now, but should use secure storage in production
    localStorage.setItem('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
    localStorage.setItem('tokenExpiresAt', tokens.expiresAt.toISOString());
  }

  protected async clearTokens(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
  }

  protected getStoredTokens(): IAuthToken | null {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expiresAt = localStorage.getItem('tokenExpiresAt');

    if (!accessToken) return null;

    return {
      accessToken,
      ...(refreshToken && { refreshToken }), // Solo incluir si existe
      expiresAt: expiresAt
        ? new Date(expiresAt)
        : new Date(Date.now() + 3600000),
    };
  }

  // Public method to get refresh token for external use
  public getRefreshToken(): string | null {
    const tokens = this.getStoredTokens();
    return tokens?.refreshToken || null;
  }

  protected isTokenExpired(tokens: IAuthToken): boolean {
    return tokens.expiresAt < new Date();
  }
}

// Concrete implementation for GraphQL authentication
export class GraphQLAuthService extends BaseAuthService {
  constructor(protected client: ApolloClient<NormalizedCacheObject>) {
    super();
  }

  async login(credentials: LoginCredentials): Promise<IAuthResponse> {
    try {
      const { data } = await this.client.mutate({
        mutation: LoginUserDocument,
        variables: {
          email: credentials.email,
          password: credentials.password,
        },
      });

      return this.handleAuthResponse(data.loginUser);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Login failed';
      throw new AuthError('LOGIN_FAILED', msg);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.mutate({
        mutation: LogoutUserDocument,
      });
    } catch (error: unknown) {
      // Continue with logout even if server call fails
      logger.warn('Logout server call failed:', error);
      const gqlError = error as {
        graphQLErrors?: { extensions?: { code?: string } }[];
        networkError?: unknown;
      };
      if (
        gqlError.graphQLErrors?.some(
          e => e.extensions?.code === 'UNAUTHENTICATED'
        )
      ) {
        throw new AuthError('UNAUTHENTICATED', 'Usuario no autenticado');
      } else if (gqlError.networkError) {
        throw new AuthError(
          'NETWORK_ERROR',
          'Error de conexión al cerrar sesión'
        );
      } else {
        throw new AuthError(
          'LOGOUT_FAILED',
          'Error al cerrar sesión en el servidor'
        );
      }
    } finally {
      await this.clearTokens();
    }
  }

  async refreshToken(refreshToken: string): Promise<IAuthToken> {
    try {
      const { data } = await this.client.mutate({
        mutation: RefreshTokenDocument,
        variables: { refreshToken },
      });

      if (!data.refreshToken.success) {
        throw new AuthError('REFRESH_FAILED', data.refreshToken.message);
      }

      const tokens: IAuthToken = {
        accessToken: data.refreshToken.accessToken,
        refreshToken: data.refreshToken.refreshToken,
        expiresAt: new Date(Date.now() + 3600000),
      };

      await this.storeTokens(tokens);
      return tokens;
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Token refresh failed';
      throw new AuthError('REFRESH_FAILED', msg);
    }
  }

  async getCurrentUser(): Promise<IAuthUser | null> {
    try {
      const tokens = this.getStoredTokens();
      if (!tokens || this.isTokenExpired(tokens)) {
        return null;
      }

      const { data } = await this.client.query({
        query: GetCurrentUserDocument,
        context: {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        },
      });

      return data.currentUser;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens();
    return tokens !== null && !this.isTokenExpired(tokens);
  }
}

// DTOs for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  role?: UserRole;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

// Custom error class
export class AuthError extends Error implements IAuthError {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Factory for creating auth services
export class AuthServiceFactory {
  static createGraphQLAuthService(
    client: ApolloClient<NormalizedCacheObject>
  ): GraphQLAuthService {
    return new GraphQLAuthService(client);
  }
}

// Singleton instance (optional - can be injected via DI)
let authServiceInstance: GraphQLAuthService | null = null;

export const getAuthService = (
  client?: ApolloClient<NormalizedCacheObject>
): GraphQLAuthService => {
  if (!authServiceInstance && client) {
    authServiceInstance = AuthServiceFactory.createGraphQLAuthService(client);
  }

  if (!authServiceInstance) {
    throw new Error(
      'AuthService not initialized. Please provide Apollo Client.'
    );
  }

  return authServiceInstance;
};
