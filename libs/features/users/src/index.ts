// DI / Context
export { UserProvider, useUserUseCases, UserContext } from './di';
export type { UserUseCases } from './di';

// Components
export { UserCard } from './components/UserCard';
export { UserFilters } from './components/UserFilters';
export { UserGridItem } from './components/UserGridItem';
export { UserStatsGrid } from './components/UserStatsGrid';
export { UserActionsMenu } from './components/UserActionsMenu';
export { EditUserModal } from './components/EditUserModal';
export type { EditUserSubmitData } from './components/EditUserModal';
export { CreateUserModal } from './components/CreateUserModal';
export { UserDetailModal } from './components/UserDetailModal';
export { UserAuthAccounts } from './components/UserAuthAccounts';
export { UserSessionsManager } from './components/UserSessionsManager';
export { PasswordManagementModal } from './components/PasswordManagementModal';
export { PasswordHistoryCard } from './components/PasswordHistoryCard';
export { AuthProviderDashboard } from './components/AuthProviderDashboard';
export { GoogleUserFeatures } from './components/GoogleUserFeatures';
export { UserProfileEditForm } from './components/UserProfileEditForm';
export { UserAddressEditForm } from './components/UserAddressEditForm';
export { UserAddressManager } from './components/UserAddressManager';

// Hooks
export { useUserActions } from './hooks/useUserActions';
export { useUserProfile } from './hooks/useUserProfile';
export {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useUpdateUserOptimized,
  useUserStats,
  useUsersByRole,
  useActiveUsers,
  useRecentUsers,
} from './hooks/useUsersGraphQL';

// Types (re-exported from domain)
export type {
  User,
  UserRole,
  UserAddress,
  UserProfile,
  CreateUserInput,
  UpdateUserInput,
  UserFilter,
  UserPage,
} from '@happy-baby/domain-user';

// GraphQL input types
export type {
  UserFilterInput,
  CreateUserProfileInput,
  UpdateUserProfileInput,
} from '@happy-baby/infrastructure-graphql';
