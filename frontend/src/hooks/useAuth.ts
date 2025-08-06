import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthGraphQL } from './useAuthGraphQL';

// Types
export interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  profile?: {
    id: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    birthDate?: string;
    avatarUrl?: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Storage keys
const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_DATA_KEY = 'user';

// Storage utilities
const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

const getStoredUser = (): User | null => {
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
};

const getStoredRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting stored refresh token:', error);
    return null;
  }
};

const setStoredAuth = (accessToken: string, refreshToken: string, user: User): void => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error setting stored auth:', error);
  }
};

const clearStoredAuth = (): void => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error clearing stored auth:', error);
  }
};

// Hook
export const useAuth = () => {
  const navigate = useNavigate();
  const { loginUser: graphQLLogin, logoutUser: graphQLLogout } = useAuthGraphQL();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = () => {
      const token = getStoredToken();
      const user = getStoredUser();

      // Validate token format (basic check)
      if (token && user) {
        try {
          // Check if token is a valid JWT format (has 3 parts separated by dots)
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            setAuthState({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Invalid token format, clear storage
            clearStoredAuth();
            setAuthState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          // Token validation failed, clear storage
          clearStoredAuth();
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await graphQLLogin(credentials);

      if (response.success && response.user && response.accessToken && response.refreshToken) {
        const { accessToken, refreshToken, user } = response;
        
        setStoredAuth(accessToken, refreshToken, user);
        setAuthState({
          user,
          token: accessToken,
          isAuthenticated: true,
          isLoading: false,
        });

        toast.success('¡Bienvenido de vuelta!');
        return true;
      } else {
        toast.error(response.message || 'Error al iniciar sesión');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error al conectar con el servidor');
      return false;
    }
  }, [graphQLLogin]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await graphQLLogout();
    } catch (error) {
      console.warn('Error during logout call:', error);
    } finally {
      clearStoredAuth();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      toast.success('Sesión cerrada exitosamente');
      navigate('/login');
    }
  }, [navigate, graphQLLogout]);

  // Check if user has specific role
  const hasRole = useCallback((role: string): boolean => {
    return authState.user?.role === role;
  }, [authState.user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return roles.includes(authState.user?.role || '');
  }, [authState.user]);

  // Get current user
  const getCurrentUser = useCallback((): User | null => {
    return authState.user;
  }, [authState.user]);

  // Check if user is admin
  const isAdmin = useCallback((): boolean => {
    return hasRole('admin');
  }, [hasRole]);

  return {
    // State
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,

    // Actions
    login,
    logout,
    
    // Utilities
    hasRole,
    hasAnyRole,
    getCurrentUser,
    isAdmin,
  };
}; 