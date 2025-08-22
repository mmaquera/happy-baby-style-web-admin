// UnifiedAuthService - Following Clean Architecture and SOLID principles
// Single Responsibility: Handles all authentication logic
// Open/Closed: Extensible for new auth providers
// Dependency Inversion: Depends on abstractions

import { ApolloClient, gql } from '@apollo/client';
import { 
  LoginUserDocument, 
  RefreshTokenDocument, 
  LogoutUserDocument, 
  GetCurrentUserDocument,
  RegisterUserDocument
} from '@/generated/graphql';
import { UserRole } from '@/types/unified';
import {
  IAuthToken,
  IAuthUser,
  IAuthResponse,
  IAuthError,
  ITokenStorage
} from '@/types/auth';

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
      ...(refreshToken && { refreshToken }),  // Solo incluir si existe
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 3600000)
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
    private client: ApolloClient<any>,
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
  async register(input: { email: string; password: string; role?: UserRole; firstName?: string; lastName?: string; phone?: string; dateOfBirth?: string | null }): Promise<IAuthResponse> {
    try {
      const { data } = await this.client.mutate({
        mutation: RegisterUserDocument,
        variables: { input }
      });

      if (!data?.registerUser?.success) {
        throw new AuthError('REGISTRATION_FAILED', data?.registerUser?.message || 'Registration failed');
      }

      const response = data.registerUser;
      const user = this.mapGraphQLUserToAuthUser(response.data?.user);
      const tokens: IAuthToken = {
        accessToken: response.data?.accessToken || '',
        ...(response.data?.refreshToken && { refreshToken: response.data.refreshToken }),
        expiresAt: new Date(Date.now() + 3600000) // 1 hour
      };

      await this.tokenStorage.storeTokens(tokens);

      return {
        success: true,
        user,
        tokens,
        message: response.message,
        code: response.code,
        timestamp: response.timestamp,
        metadata: response.metadata ? {
          ...(response.metadata.requestId && { requestId: response.metadata.requestId }),
          ...(response.metadata.traceId && { traceId: response.metadata.traceId }),
          ...(response.metadata.duration && { duration: response.metadata.duration }),
          timestamp: response.metadata.timestamp
        } : undefined
      };
    } catch (error: any) {
      throw new AuthError('REGISTRATION_FAILED', error.message || 'Registration failed');
    }
  }

  // Login user
  async login(credentials: { email: string; password: string }): Promise<IAuthResponse> {
    try {
      const { data } = await this.client.mutate({
        mutation: LoginUserDocument,
        variables: {
          email: credentials.email,
          password: credentials.password
        }
      });

      if (!data?.loginUser?.success) {
        throw new AuthError('LOGIN_FAILED', data?.loginUser?.message || 'Login failed');
      }

      const response = data.loginUser;
      const user = this.mapGraphQLUserToAuthUser(response.data?.user);
      const tokens: IAuthToken = {
        accessToken: response.data?.accessToken || '',
        ...(response.data?.refreshToken && { refreshToken: response.data.refreshToken }),  // Solo incluir si existe
        expiresAt: new Date(Date.now() + 3600000) // 1 hour
      };

      await this.tokenStorage.storeTokens(tokens);

      return {
        success: true,
        user,
        tokens,
        message: response.message,
        // New fields from backend schema
        code: response.code,
        timestamp: response.timestamp,
        metadata: response.metadata ? {
          ...(response.metadata.requestId && { requestId: response.metadata.requestId }),
          ...(response.metadata.traceId && { traceId: response.metadata.traceId }),
          ...(response.metadata.duration && { duration: response.metadata.duration }),
          timestamp: response.metadata.timestamp
        } : undefined
      };
    } catch (error: any) {
      throw new AuthError('LOGIN_FAILED', error.message || 'Login failed');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await this.client.mutate({
        mutation: LogoutUserDocument
      });
    } catch (error: any) {
      console.warn('Logout server call failed:', error);
      
      // Lanzar error específico para mejor manejo en capas superiores
      if (error?.graphQLErrors?.some((err: any) => err.extensions?.['code'] === 'UNAUTHENTICATED')) {
        throw new AuthError('UNAUTHENTICATED', 'Usuario no autenticado');
      } else if (error?.networkError) {
        throw new AuthError('NETWORK_ERROR', 'Error de conexión al cerrar sesión');
      } else {
        throw new AuthError('LOGOUT_FAILED', 'Error al cerrar sesión en el servidor');
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
        variables: { refreshToken }
      });

      if (!data?.refreshToken?.success) {
        throw new AuthError('REFRESH_FAILED', data?.refreshToken?.message || 'Token refresh failed');
      }

      const response = data.refreshToken;
      const tokens: IAuthToken = {
        accessToken: response.data?.accessToken || '',
        refreshToken: response.data?.refreshToken,
        expiresAt: new Date(Date.now() + 3600000)
      };

      await this.tokenStorage.storeTokens(tokens);
      return tokens;
    } catch (error: any) {
      throw new AuthError('REFRESH_FAILED', error.message || 'Token refresh failed');
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
            Authorization: `Bearer ${tokens.accessToken}`
          }
        }
      });

      return data.currentUser ? this.mapGraphQLUserToAuthUser(data.currentUser) : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
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
  private mapGraphQLUserToAuthUser(graphqlUser: any): IAuthUser {
    return {
      id: graphqlUser.id,
      email: graphqlUser.email,
      role: this.mapGraphQLRoleToUserRole(graphqlUser.role),
      isActive: graphqlUser.isActive,
      emailVerified: graphqlUser.emailVerified,
      ...(graphqlUser.lastLoginAt && { lastLoginAt: graphqlUser.lastLoginAt }),
      profile: graphqlUser.profile ? {
        id: graphqlUser.profile.id,
        ...(graphqlUser.profile.firstName && { firstName: graphqlUser.profile.firstName }),
        ...(graphqlUser.profile.lastName && { lastName: graphqlUser.profile.lastName }),
        ...(graphqlUser.profile.phone && { phone: graphqlUser.profile.phone }),
        ...(graphqlUser.profile.birthDate && { birthDate: graphqlUser.profile.birthDate }),
        ...(graphqlUser.profile.avatar && { avatar: graphqlUser.profile.avatar }),
      } : undefined
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
    public details?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Factory for creating auth service
export class AuthServiceFactory {
  static createUnifiedAuthService(
    client: ApolloClient<any>,
    tokenStorage?: ITokenStorage
  ): UnifiedAuthService {
    return new UnifiedAuthService(client, tokenStorage);
  }
}
