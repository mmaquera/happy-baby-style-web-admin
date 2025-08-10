// Hooks Index - Following Clean Architecture
// Single entry point for all authentication-related hooks

export { 
  useUnifiedAuth,
  useRoleAccess,
  useAdminAccess,
  useStaffAccess
} from './useUnifiedAuth';

export { useLoginForm } from './useLoginForm';
export { useLogout } from './useLogout';
export { useAuthManagement } from './useAuthManagement';
export { useUsersGraphQL } from './useUsersGraphQL';
export { useProductsGraphQL } from './useProductsGraphQL';
export { useOrdersGraphQL } from './useOrdersGraphQL';
