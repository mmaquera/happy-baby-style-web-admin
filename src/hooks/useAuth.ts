// useAuth Hook - Following React best practices and Clean Architecture
// Uses the AuthService for authentication logic

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useApolloClient } from '@apollo/client';
import { 
  AuthServiceFactory, 
  LoginCredentials, 
  RegisterCredentials,
  IAuthUser,
  AuthError 
} from '../services/auth/AuthService';
import { UserRole } from '../types/unified';

interface AuthState {
  user: IAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

interface UseAuthReturn extends AuthState, AuthActions {
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const client = useApolloClient();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Memoize auth service instance
  const authService = useMemo(() => {
    return AuthServiceFactory.createGraphQLAuthService(client);
  }, [client]);

  // Initialize auth state
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
            error: null
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication failed'
        });
      }
    };

    initializeAuth();
  }, [authService]);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authService.login(credentials);
      
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'Login failed';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      
      throw error;
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
        error: null
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if server logout fails
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  }, [authService]);

  // Register function
  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // TODO: Implement register mutation
      // const response = await authService.register(credentials);
      
      // For now, just login after registration
      await login({ email: credentials.email, password: credentials.password });
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'Registration failed';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      
      throw error;
    }
  }, [authService, login]);

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
        isAuthenticated: !!user
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
    register,
    refreshToken,
    clearError,
    hasRole,
    hasAnyRole
  };
};

// Custom hook for role-based access control
export const useRoleAccess = (requiredRoles: UserRole[]) => {
  const { user, isAuthenticated, hasAnyRole } = useAuth();
  
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
  return useRoleAccess([UserRole.ADMIN]);
};

// Custom hook for staff access
export const useStaffAccess = () => {
  return useRoleAccess([UserRole.ADMIN, UserRole.STAFF]);
}; 