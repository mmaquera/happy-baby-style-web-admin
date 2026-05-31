// UnifiedAuthService - Following Clean Architecture and SOLID principles
// Single Responsibility: Handles all authentication logic
// Open/Closed: Extensible for new auth providers
// Dependency Inversion: Depends on abstractions

import { type ApolloClient, type NormalizedCacheObject } from '@apollo/client';
import {
  LoginUserDocument,
  RefreshTokenDocument,
  LogoutUserDocument,
  GetCurrentUserDocument,
  RegisterUserDocument,
} from '@happy-baby/infrastructure-graphql';
import { UserRole } from '@happy-baby/infrastructure-graphql';
import {
  type IAuthToken,
  type IAuthUser,
  type IAuthResponse,
  type IAuthError,
  type ITokenStorage,
} from '../types/auth';
import { logger } from '@happy-baby/infrastructure-monitoring';

// Local storage implementation
export class LocalTokenStorage implements ITokenStorage {
  async storeTokens(tokens: IAuthToken): Promise<void> {
    localStorage.setItem('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
    localStorage.setItem('tokenExpiresAt', tokens.expiresAt.toISOString());
  }

  getStoredTokens(): IAuthToken | null {
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

  async clearTokens(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
  }

  isTokenExpired(tokens: IAuthToken): boolean {
    return tokens.expiresAt < new Date();
  }
}

// Main authentication service
export class UnifiedAuthService {
  private tokenStorage: ITokenStorage;

  constructor(
    private client: ApolloClient<NormalizedCacheObject>,
    tokenStorage?: ITokenStorage
  ) {
    this.tokenStorage = tokenStorage || new LocalTokenStorage();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const tokens = this.tokenStorage.getStoredTokens();
    return tokens !== null && !this.tokenStorage.isTokenExpired(tokens);
  }

  // Register user
  async register(input: {
    email: string;
    password: string;
    role?: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string | null;
  }): Promise<IAuthResponse> {
    try {
      const { data } = await this.client.mutate({
        mutation: RegisterUserDocument,
        variables: { input },
      });

      if (!data?.registerUser?.success) {
        throw new AuthError(
          'REGISTRATION_FAILED',
          data?.registerUser?.message || 'Registration failed'
        );
      }

      const response = data.registerUser;
      const user = this.mapGraphQLUserToAuthUser(response.data?.user);
      const tokens: IAuthToken = {
        accessToken: response.data?.accessToken || '',
        ...(response.data?.refreshToken && {
          refreshToken: response.data.refreshToken,
        }),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
      };

      await this.tokenStorage.storeTokens(tokens);

      return {
        success: true,
        user,
        tokens,
        message: response.message,
        code: response.code,
        timestamp: response.timestamp,
        metadata: response.metadata
          ? {
              ...(response.metadata.requestId && {
                requestId: response.metadata.requestId,
              }),
              ...(response.metadata.traceId && {
                traceId: response.metadata.traceId,
              }),
              ...(response.metadata.duration && {
                duration: response.metadata.duration,
              }),
              timestamp: response.metadata.timestamp,
            }
          : undefined,
      };
    } catch (error: unknown) {
      if (error instanceof AuthError) throw error;
      const msg =
        error instanceof Error ? error.message : 'Registration failed';
      throw new AuthError('REGISTRATION_FAILED', msg);
    }
  }

  // Login user - Following Clean Architecture and SOLID principles
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<IAuthResponse> {
    try {
      const { data } = await this.client.mutate({
        mutation: LoginUserDocument,
        variables: {
          email: credentials.email,
          password: credentials.password,
        },
      });

      // Handle GraphQL errors first
      if (data?.loginUser?.errors) {
        const errorMessage =
          data.loginUser.errors[0]?.message || 'Login failed';
        throw new AuthError('LOGIN_FAILED', errorMessage);
      }

      // Check if login was successful according to backend response
      if (!data?.loginUser?.success) {
        const errorMessage =
          data?.loginUser?.message || 'Invalid email or password';
        throw new AuthError('LOGIN_FAILED', errorMessage);
      }

      const response = data.loginUser;

      // Validate that we have the required data
      if (!response.data?.user || !response.data?.accessToken) {
        throw new AuthError('LOGIN_FAILED', 'Invalid response from server');
      }

      // Map GraphQL user to internal user format
      const user = this.mapGraphQLUserToAuthUser(response.data.user);

      // Create token object with proper structure
      const tokens: IAuthToken = {
        accessToken: response.data.accessToken,
        ...(response.data.refreshToken && {
          refreshToken: response.data.refreshToken,
        }),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
      };

      // Store tokens securely
      await this.tokenStorage.storeTokens(tokens);

      // Return structured response following backend schema
      return {
        success: true,
        user,
        tokens,
        message: response.message,
        code: response.code,
        timestamp: response.timestamp,
        metadata: response.metadata
          ? {
              ...(response.metadata.requestId && {
                requestId: response.metadata.requestId,
              }),
              ...(response.metadata.traceId && {
                traceId: response.metadata.traceId,
              }),
              ...(response.metadata.duration && {
                duration: response.metadata.duration,
              }),
              timestamp: response.metadata.timestamp,
            }
          : undefined,
      };
    } catch (error: unknown) {
      if (error instanceof AuthError) throw error;
      const gqlError = error as {
        graphQLErrors?: { message?: string; extensions?: { code?: string } }[];
        networkError?: unknown;
        message?: string;
      };
      if (gqlError.graphQLErrors?.length) {
        const e = gqlError.graphQLErrors[0];
        throw new AuthError(
          e?.extensions?.code ?? 'LOGIN_FAILED',
          e?.message ?? 'Login failed'
        );
      }
      if (gqlError.networkError) {
        throw new AuthError(
          'NETWORK_ERROR',
          'Unable to connect to server. Please check your internet connection.'
        );
      }
      const msg =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during login';
      throw new AuthError('LOGIN_FAILED', msg);
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await this.client.mutate({
        mutation: LogoutUserDocument,
      });
    } catch (error: unknown) {
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
      await this.tokenStorage.clearTokens();
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<IAuthToken> {
    try {
      const { data } = await this.client.mutate({
        mutation: RefreshTokenDocument,
        variables: { refreshToken },
      });

      if (!data?.refreshToken?.success) {
        throw new AuthError(
          'REFRESH_FAILED',
          data?.refreshToken?.message || 'Token refresh failed'
        );
      }

      const response = data.refreshToken;
      const tokens: IAuthToken = {
        accessToken: response.data?.accessToken || '',
        refreshToken: response.data?.refreshToken,
        expiresAt: new Date(Date.now() + 3600000),
      };

      await this.tokenStorage.storeTokens(tokens);
      return tokens;
    } catch (error: unknown) {
      if (error instanceof AuthError) throw error;
      const msg =
        error instanceof Error ? error.message : 'Token refresh failed';
      throw new AuthError('REFRESH_FAILED', msg);
    }
  }

  // Get current authenticated user
  async getCurrentUser(): Promise<IAuthUser | null> {
    try {
      const tokens = this.tokenStorage.getStoredTokens();
      if (!tokens || this.tokenStorage.isTokenExpired(tokens)) {
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

      return data.currentUser
        ? this.mapGraphQLUserToAuthUser(data.currentUser)
        : null;
    } catch (error) {
      logger.error('Failed to get current user:', error);
      return null;
    }
  }

  // Get stored tokens
  getStoredTokens(): IAuthToken | null {
    return this.tokenStorage.getStoredTokens();
  }

  // Check if tokens need refresh
  shouldRefreshToken(): boolean {
    const tokens = this.tokenStorage.getStoredTokens();
    if (!tokens) return false;

    // Refresh if token expires in less than 5 minutes
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return tokens.expiresAt < fiveMinutesFromNow;
  }

  // Check if tokens are expired
  isTokenExpired(): boolean {
    const tokens = this.tokenStorage.getStoredTokens();
    if (!tokens) return true;
    return this.tokenStorage.isTokenExpired(tokens);
  }

  // Auto-refresh token if needed
  async ensureValidToken(): Promise<string | null> {
    const tokens = this.tokenStorage.getStoredTokens();
    if (!tokens) return null;

    if (this.tokenStorage.isTokenExpired(tokens)) {
      if (tokens.refreshToken) {
        try {
          const newTokens = await this.refreshToken(tokens.refreshToken);
          return newTokens.accessToken;
        } catch (error) {
          await this.tokenStorage.clearTokens();
          return null;
        }
      } else {
        await this.tokenStorage.clearTokens();
        return null;
      }
    }

    return tokens.accessToken;
  }

  // Map GraphQL user to internal user format
  private mapGraphQLUserToAuthUser(
    graphqlUser: Record<string, unknown> & {
      profile?: Record<string, unknown> | null;
    }
  ): IAuthUser {
    return {
      id: graphqlUser['id'] as string,
      email: graphqlUser['email'] as string,
      role: this.mapGraphQLRoleToUserRole(graphqlUser['role'] as string),
      isActive: graphqlUser['isActive'] as boolean,
      emailVerified: graphqlUser['emailVerified'] as boolean,
      ...(typeof graphqlUser['lastLoginAt'] === 'string'
        ? { lastLoginAt: graphqlUser['lastLoginAt'] }
        : {}),
      profile: graphqlUser.profile
        ? {
            id: graphqlUser.profile['id'] as string,
            ...(typeof graphqlUser.profile['firstName'] === 'string'
              ? { firstName: graphqlUser.profile['firstName'] }
              : {}),
            ...(typeof graphqlUser.profile['lastName'] === 'string'
              ? { lastName: graphqlUser.profile['lastName'] }
              : {}),
            ...(typeof graphqlUser.profile['phone'] === 'string'
              ? { phone: graphqlUser.profile['phone'] }
              : {}),
            ...(typeof graphqlUser.profile['birthDate'] === 'string'
              ? { birthDate: graphqlUser.profile['birthDate'] }
              : {}),
            ...(typeof graphqlUser.profile['avatar'] === 'string'
              ? { avatar: graphqlUser.profile['avatar'] }
              : {}),
          }
        : undefined,
    };
  }

  // Map GraphQL role to internal role
  private mapGraphQLRoleToUserRole(graphqlRole: string): UserRole {
    switch (graphqlRole) {
      case 'admin':
        return UserRole.admin;
      case 'staff':
        return UserRole.staff;
      case 'customer':
        return UserRole.customer;
      default:
        return UserRole.customer;
    }
  }
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

// Factory for creating auth service
export class AuthServiceFactory {
  static createUnifiedAuthService(
    client: ApolloClient<NormalizedCacheObject>,
    tokenStorage?: ITokenStorage
  ): UnifiedAuthService {
    return new UnifiedAuthService(client, tokenStorage);
  }
}
