// Hooks Index - Following Clean Architecture
// Single entry point for all hooks

// Authentication hooks
export { 
  useUnifiedAuth,
  useRoleAccess,
  useAdminAccess,
  useStaffAccess
} from './useUnifiedAuth';

export { useLoginForm } from './useLoginForm';
export { useLogout } from './useLogout';
export { useAuthManagement } from './useAuthManagement';
export { useForgotPassword } from './useForgotPassword';
export { useRegisterUser } from './useRegisterUser';

// Category hooks
export { useCategories } from './useCategories';
export { useCategoriesGraphQL } from './useCategoriesGraphQL';
export { useCategoryActions } from './useCategoryActions';
export { useCategoryFilters } from './useCategoryFilters';
export { useCreateCategory } from './useCreateCategory';
export { useUpdateCategory } from './useUpdateCategory';

// User hooks
export { useUserProfile } from './useUserProfile';

// Sidebar hooks
export { useSidebarTooltip } from './useSidebarTooltip';
