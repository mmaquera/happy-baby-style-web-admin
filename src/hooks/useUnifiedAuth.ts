// useUnifiedAuth Hook - Following Clean Architecture and SOLID principles
// Single Responsibility: Provides authentication state and actions
// Dependency Inversion: Depends on UnifiedAuthService abstraction

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useApolloClient } from '@apollo/client';
import { 
  UnifiedAuthService, 
  AuthServiceFactory,
  AuthError
} from '../services/auth/UnifiedAuthService';
import { UserRole } from '../types/unified';
import {
  IAuthUser,
  IAuthError
} from '../types/auth';

// Hook state interface
interface AuthState {
  user: IAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// Hook actions interface
interface AuthActions {
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

// Hook return interface
interface UseUnifiedAuthReturn extends AuthState, AuthActions {
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export const useUnifiedAuth = (): UseUnifiedAuthReturn => {
  const client = useApolloClient();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    isInitialized: false,
  });

  // Memoized auth service instance
  const authService = useMemo(() => {
    return AuthServiceFactory.createUnifiedAuthService(client);
  }, [client]);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        if (authService.isAuthenticated()) {
          const user = await authService.getCurrentUser();
          setState({
            user,
            isAuthenticated: !!user,
            isLoading: false,
            error: null,
            isInitialized: true,
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            isInitialized: true,
          });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication failed',
          isInitialized: true,
        });
      }
    };

    initializeAuth();
  }, [authService]);

  // Login function
  const login = useCallback(async (credentials: { email: string; password: string }): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authService.login(credentials);
      
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isInitialized: true,
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'Login failed';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      return false;
    }
  }, [authService]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await authService.logout();
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if server logout fails
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isInitialized: true,
      });
    }
  }, [authService]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const tokens = authService.getStoredTokens();
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }
      
      await authService.refreshToken(tokens.refreshToken);
      
      // Re-fetch current user
      const user = await authService.getCurrentUser();
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: !!user,
      }));
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await logout();
    }
  }, [authService, logout]);

  // Clear error function
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Role checking utilities
  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return state.user ? roles.includes(state.user.role) : false;
  }, [state.user]);

  return {
    ...state,
    login,
    logout,
    refreshToken,
    clearError,
    hasRole,
    hasAnyRole,
  };
};

// Custom hook for role-based access control
export const useRoleAccess = (requiredRoles: UserRole[]) => {
  const { user, isAuthenticated, hasAnyRole } = useUnifiedAuth();
  
  const hasAccess = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    return hasAnyRole(requiredRoles);
  }, [isAuthenticated, user, hasAnyRole, requiredRoles]);
  
  return {
    hasAccess,
    user,
    isAuthenticated
  };
};

// Custom hook for admin access
export const useAdminAccess = () => {
  return useRoleAccess([UserRole.admin]);
};

// Custom hook for staff access
export const useStaffAccess = () => {
  return useRoleAccess([UserRole.admin, UserRole.staff]);
};
