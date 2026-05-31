// Types
export type { UserAccount, UserSession } from './types/auth';
export type {
  IAuthToken,
  IAuthUser,
  IAuthResponse,
  IAuthError,
  LoginCredentials,
  RegisterCredentials,
  AuthState,
  AuthActions,
  ITokenStorage,
  GraphQLMiddlewareConfig,
} from './types/auth';

// Context
export { AuthContext, AuthProvider, useAuth } from './context/AuthContext';
export {
  useRoleAccess,
  useAdminAccess,
  useStaffAccess,
} from './context/AuthContext';

// Services
export {
  LocalTokenStorage,
  UnifiedAuthService,
  AuthError,
  AuthServiceFactory,
} from './services/UnifiedAuthService';
export { BaseAuthService } from './services/AuthService';

// Hooks
export { useAuthManagement } from './hooks/useAuthManagement';
export type { AuthProviderStats } from './hooks/useAuthManagement';
export {
  useUsersByProvider,
  useUserSessions,
  useActiveSessions,
  useSessionManagement,
  useAccountManagement,
  useUserImpersonation,
  useAuthProviderStats,
  useProviderUtils,
} from './hooks/useAuthManagement';
export { useLoginForm } from './hooks/useLoginForm';
export { useForgotPassword } from './hooks/useForgotPassword';
export { useRegisterForm } from './hooks/useRegisterForm';
export { useRegisterUser } from './hooks/useRegisterUser';
export { useSetUserPassword } from './hooks/useSetUserPassword';
export { usePasswordHistory } from './hooks/usePasswordHistory';
export type { PasswordAction } from './hooks/usePasswordHistory';
export { useAuthGraphQL } from './hooks/useAuthGraphQL';

// Components
export { LoginForm } from './components/LoginForm';
export { LoginLogo } from './components/LoginLogo';
export { ForgotPasswordModal } from './components/ForgotPasswordModal';
export { RegisterForm } from './components/RegisterForm';
export { RegisterModal } from './components/RegisterModal';
export { SessionInfo } from './components/SessionInfo';
export { LogoutConfirmModal } from './components/LogoutConfirmModal';
export { ProtectedRoute } from './components/ProtectedRoute';
