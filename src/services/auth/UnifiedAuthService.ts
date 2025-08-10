// UnifiedAuthService - Following Clean Architecture and SOLID principles
// Single Responsibility: Handles all authentication logic
// Open/Closed: Extensible for new auth providers
// Dependency Inversion: Depends on abstractions

import { ApolloClient, gql } from '@apollo/client';
import { 
  LoginUserDocument, 
  RefreshTokenDocument, 
  LogoutUserDocument, 
  GetCurrentUserDocument 
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
      refreshToken: refreshToken || undefined,
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
      const user = this.mapGraphQLUserToAuthUser(response.user);
      const tokens: IAuthToken = {
        accessToken: response.accessToken || '',
        refreshToken: response.refreshToken || undefined,
        expiresAt: new Date(Date.now() + 3600000) // 1 hour
      };

      await this.tokenStorage.storeTokens(tokens);

      return {
        success: true,
        user,
        tokens,
        message: response.message
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
    } catch (error) {
      console.warn('Logout server call failed:', error);
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
        accessToken: response.accessToken || '',
        refreshToken: response.refreshToken,
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
      lastLoginAt: graphqlUser.lastLoginAt || undefined,
      profile: graphqlUser.profile ? {
        id: graphqlUser.profile.id,
        firstName: graphqlUser.profile.firstName || undefined,
        lastName: graphqlUser.profile.lastName || undefined,
        phone: graphqlUser.profile.phone || undefined,
        birthDate: graphqlUser.profile.birthDate || undefined,
        avatar: graphqlUser.profile.avatar || undefined,
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
