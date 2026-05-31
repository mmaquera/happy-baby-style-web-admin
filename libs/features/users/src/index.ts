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
