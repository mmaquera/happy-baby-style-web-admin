// Authentication Configuration - Following Clean Architecture
// Centralized configuration for all authentication-related settings

import { GraphQLMiddlewareConfig } from '../types/auth';
import { getCurrentGraphQLEndpoint } from './endpoints';

// Environment detection - Using VITE directly
export const isDevelopment = import.meta.env.VITE_MODE === 'development';
export const isProduction = import.meta.env.VITE_MODE === 'production';
export const isTest = import.meta.env.VITE_MODE === 'test';

// GraphQL endpoint configuration - Using centralized endpoints
export const GRAPHQL_ENDPOINTS = {
  development: getCurrentGraphQLEndpoint(),
  production: getCurrentGraphQLEndpoint(),
  test: getCurrentGraphQLEndpoint(),
} as const;

// Default GraphQL middleware configuration
export const defaultGraphQLConfig: GraphQLMiddlewareConfig = {
  uri: isDevelopment ? GRAPHQL_ENDPOINTS.development : GRAPHQL_ENDPOINTS.production,
  enableRetry: true,
  maxRetries: isProduction ? 2 : 3,
  retryDelay: isProduction ? 500 : 300,
};

// Token configuration
export const TOKEN_CONFIG = {
  accessTokenExpiry: 60 * 60 * 1000, // 1 hour in milliseconds
  refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
} as const;

// Authentication routes
export const AUTH_ROUTES = {
  login: '/login',
  logout: '/logout',
  unauthorized: '/unauthorized',
  dashboard: '/dashboard',
} as const;

// Role-based access control configuration
export const ROLE_CONFIG = {
  admin: ['admin'],
  staff: ['admin', 'staff'],
  customer: ['admin', 'staff', 'customer'],
} as const;

// Feature flags for authentication
export const AUTH_FEATURES = {
  enableGoogleOAuth: isDevelopment || isProduction,
  enablePasswordReset: true,
  enableEmailVerification: true,
  enableRememberMe: true,
  enableMultiFactorAuth: false, // Future feature
} as const;
