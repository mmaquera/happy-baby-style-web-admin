// AuthService - Following SOLID principles and Clean Architecture
// Single Responsibility: Handles authentication only
// Open/Closed: Extensible for new auth providers
// Dependency Inversion: Depends on abstractions

import { ApolloClient, gql } from '@apollo/client';
import { LoginUserDocument, RefreshTokenDocument, LogoutUserDocument, GetCurrentUserDocument } from '@/generated/graphql';
import { UserRole } from '../../types/unified';

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
  details?: any;
}

// Abstract base class following Template Method pattern
export abstract class BaseAuthService {
  protected abstract client: ApolloClient<any>;
  
  abstract login(credentials: LoginCredentials): Promise<IAuthResponse>;
  abstract logout(): Promise<void>;
  abstract refreshToken(refreshToken: string): Promise<IAuthToken>;
  abstract getCurrentUser(): Promise<IAuthUser | null>;
  abstract isAuthenticated(): boolean;
  
  // Template method for common auth flow
  protected async handleAuthResponse(response: any): Promise<IAuthResponse> {
    if (!response.success) {
      throw new Error(response.message || 'Authentication failed');
    }
    
    const tokens: IAuthToken = {
      accessToken: response.accessToken || response.token,
      refreshToken: response.refreshToken,
      expiresAt: response.expiresAt ? new Date(response.expiresAt) : new Date(Date.now() + 3600000)
    };
    
    // Store tokens securely
    await this.storeTokens(tokens);
    
    return {
      success: true,
      user: response.user,
      tokens,
      message: response.message
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
      ...(refreshToken && { refreshToken }),  // Solo incluir si existe
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 3600000)
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
  constructor(protected client: ApolloClient<any>) {
    super();
  }
  
  async login(credentials: LoginCredentials): Promise<IAuthResponse> {
    try {
      const { data } = await this.client.mutate({
        mutation: LoginUserDocument,
        variables: {
          email: credentials.email,
          password: credentials.password
        }
      });
      
      return this.handleAuthResponse(data.loginUser);
    } catch (error: any) {
      throw new AuthError('LOGIN_FAILED', error.message || 'Login failed');
    }
  }
  
  async logout(): Promise<void> {
    try {
      await this.client.mutate({
        mutation: LogoutUserDocument
      });
    } catch (error) {
      // Continue with logout even if server call fails
      console.warn('Logout server call failed:', error);
    } finally {
      await this.clearTokens();
    }
  }
  
  async refreshToken(refreshToken: string): Promise<IAuthToken> {
    try {
      const { data } = await this.client.mutate({
        mutation: RefreshTokenDocument,
        variables: { refreshToken }
      });
      
      if (!data.refreshToken.success) {
        throw new AuthError('REFRESH_FAILED', data.refreshToken.message);
      }
      
      const tokens: IAuthToken = {
        accessToken: data.refreshToken.accessToken,
        refreshToken: data.refreshToken.refreshToken,
        expiresAt: new Date(Date.now() + 3600000)
      };
      
      await this.storeTokens(tokens);
      return tokens;
    } catch (error: any) {
      throw new AuthError('REFRESH_FAILED', error.message || 'Token refresh failed');
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
            Authorization: `Bearer ${tokens.accessToken}`
          }
        }
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
    public details?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Factory for creating auth services
export class AuthServiceFactory {
  static createGraphQLAuthService(client: ApolloClient<any>): GraphQLAuthService {
    return new GraphQLAuthService(client);
  }
}

// Singleton instance (optional - can be injected via DI)
let authServiceInstance: GraphQLAuthService | null = null;

export const getAuthService = (client?: ApolloClient<any>): GraphQLAuthService => {
  if (!authServiceInstance && client) {
    authServiceInstance = AuthServiceFactory.createGraphQLAuthService(client);
  }
  
  if (!authServiceInstance) {
    throw new Error('AuthService not initialized. Please provide Apollo Client.');
  }
  
  return authServiceInstance;
};
