// Authentication Services Index - Following Clean Architecture
// Single entry point for all authentication-related services

export { 
  UnifiedAuthService,
  AuthServiceFactory,
  AuthError,
  LocalTokenStorage
} from './UnifiedAuthService';

export type {
  IAuthToken,
  IAuthUser,
  IAuthResponse,
  IAuthError,
  ITokenStorage
} from '../../types/auth';
