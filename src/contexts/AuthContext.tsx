// AuthContext - Following SOLID principles and Clean Architecture
// Single Responsibility: Manages authentication state only
// Open/Closed: Extensible for new auth providers
// Liskov Substitution: Consistent interface implementation
// Interface Segregation: Specific interfaces for different concerns
// Dependency Inversion: Depends on abstractions

import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { 
  UnifiedAuthService, 
  AuthError,
  AuthServiceFactory 
} from '../services/auth/UnifiedAuthService';
import { IAuthUser } from '../types/auth';
import { UserRole } from '../types/unified';

// Types following Interface Segregation Principle
interface AuthState {
  user: IAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

// Action types for reducer
type AuthAction =
  | { type: 'AUTH_INIT_START' }
  | { type: 'AUTH_INIT_SUCCESS'; payload: { user: IAuthUser | null; isAuthenticated: boolean } }
  | { type: 'AUTH_INIT_FAILURE'; payload: string }
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: IAuthUser } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT_SUCCESS' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isInitialized: false,
};

// Reducer function following Single Responsibility Principle
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_INIT_START':
      return { ...state, isLoading: true, error: null };
    
    case 'AUTH_INIT_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        isLoading: false,
        error: null,
        isInitialized: true,
      };
    
    case 'AUTH_INIT_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        isInitialized: true,
      };
    
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider component following Dependency Inversion Principle
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = useApolloClient();
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Memoized auth service instance
  const authService = useMemo(() => {
    return AuthServiceFactory.createUnifiedAuthService(client);
  }, [client]);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: 'AUTH_INIT_START' });
        
        // First check if we have stored tokens and if they need refresh
        if (authService.isAuthenticated()) {
          // Tokens exist and are valid, try to get current user
          try {
            const user = await authService.getCurrentUser();
            if (user) {
              dispatch({
                type: 'AUTH_INIT_SUCCESS',
                payload: { user, isAuthenticated: true }
              });
              return;
            }
          } catch (error) {
            console.log('Failed to get current user, trying token refresh...');
          }
          
          // If getCurrentUser failed, try to refresh the token
          const tokens = authService.getStoredTokens();
          if (tokens?.refreshToken) {
            try {
              await authService.refreshToken(tokens.refreshToken);
              const user = await authService.getCurrentUser();
              if (user) {
                dispatch({
                  type: 'AUTH_INIT_SUCCESS',
                  payload: { user, isAuthenticated: true }
                });
                return;
              }
            } catch (refreshError) {
              console.log('Token refresh failed, clearing tokens');
              // Use the logout method which handles token clearing
              await authService.logout();
            }
          }
        }
        
        // If we reach here, no valid authentication
        dispatch({
          type: 'AUTH_INIT_SUCCESS',
          payload: { user: null, isAuthenticated: false }
        });
      } catch (error) {
        console.error('Auth initialization failed:', error);
        dispatch({
          type: 'AUTH_INIT_FAILURE',
          payload: error instanceof Error ? error.message : 'Authentication failed'
        });
      }
    };

    initializeAuth();
  }, [authService]);



  // Login function
  const login = useCallback(async (credentials: { email: string; password: string }): Promise<boolean> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await authService.login(credentials);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.user }
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'Login failed';
      
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return false;
    }
  }, [authService]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await authService.logout();
      
      dispatch({ type: 'LOGOUT_SUCCESS' });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if server logout fails
      dispatch({ type: 'LOGOUT_SUCCESS' });
    }
  }, [authService]);

  // Register function - TODO: Implement when backend supports it
  const register = useCallback(async (credentials: { email: string; password: string; firstName?: string; lastName?: string }): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // TODO: Implement register mutation
      // For now, just login after registration
      const success = await login({ email: credentials.email, password: credentials.password });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return success;
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'Registration failed';
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, [login]);

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
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: user! }
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await logout();
    }
  }, [authService, logout]);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Auto-refresh token effect
  useEffect(() => {
    if (!state.isAuthenticated || !state.user) return;

    const checkTokenExpiry = async () => {
      try {
        if (authService.shouldRefreshToken()) {
          const tokens = authService.getStoredTokens();
          if (tokens?.refreshToken) {
            await authService.refreshToken(tokens.refreshToken);
            console.log('Token refreshed automatically');
          }
        }
      } catch (error) {
        console.error('Auto token refresh failed:', error);
        // If refresh fails, logout the user
        await logout();
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);
    
    // Also check immediately
    checkTokenExpiry();

    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.user, authService, logout]);

  // Role checking utilities
  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return state.user ? roles.includes(state.user.role) : false;
  }, [state.user]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextValue>(() => ({
    ...state,
    login,
    logout,
    register,
    refreshToken,
    clearError,
    hasRole,
    hasAnyRole,
  }), [
    state,
    login,
    logout,
    register,
    refreshToken,
    clearError,
    hasRole,
    hasAnyRole,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
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
  return useRoleAccess([UserRole.admin]);
};

// Custom hook for staff access
export const useStaffAccess = () => {
  return useRoleAccess([UserRole.admin, UserRole.staff]);
};
