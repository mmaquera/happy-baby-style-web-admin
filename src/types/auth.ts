// Unified Authentication Types - Following Clean Architecture
// Single source of truth for all authentication-related types

import { UserRole } from './unified';

// Core authentication interfaces
export interface IAuthToken {
  accessToken: string;
  refreshToken?: string | undefined;
  expiresAt: Date;
}

export interface IAuthUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string | undefined;
  profile?: {
    id: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
    birthDate?: string | undefined;
    avatar?: string | undefined;
  } | undefined;
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

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration credentials
export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Authentication state
export interface AuthState {
  user: IAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// Authentication actions
export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

// Role-based access control
export interface RoleAccess {
  hasAccess: boolean;
  user: IAuthUser | null;
  isAuthenticated: boolean;
}

// Token storage interface
export interface ITokenStorage {
  storeTokens(tokens: IAuthToken): Promise<void>;
  getStoredTokens(): IAuthToken | null;
  clearTokens(): Promise<void>;
  isTokenExpired(tokens: IAuthToken): boolean;
}

// GraphQL middleware configuration
export interface GraphQLMiddlewareConfig {
  uri: string;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

// Export all types
// Note: Types are already exported individually above
// No need for duplicate export statements
