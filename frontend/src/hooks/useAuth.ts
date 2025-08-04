import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
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

export interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    user: User;
  };
  message: string;
}

// Storage keys
const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'user';

// Mock API function (reemplazar con la implementación real)
const mockLoginAPI = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validar credenciales de demo
  if (credentials.email === 'admin@happybabystyle.com' && credentials.password === 'admin123') {
    return {
      success: true,
      data: {
        token: 'mock-jwt-token-12345',
        user: {
          id: '1',
          email: 'admin@happybabystyle.com',
          name: 'Administrador',
          role: 'admin',
        },
      },
      message: 'Login exitoso',
    };
  }

  // Credenciales incorrectas
  return {
    success: false,
    message: 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.',
  };
};

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

const setStoredAuth = (token: string, user: User): void => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error setting stored auth:', error);
  }
};

const clearStoredAuth = (): void => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error clearing stored auth:', error);
  }
};

// Hook
export const useAuth = () => {
  const navigate = useNavigate();
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

      if (token && user) {
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
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
      const response = await mockLoginAPI(credentials);

      if (response.success && response.data) {
        const { token, user } = response.data;
        
        setStoredAuth(token, user);
        setAuthState({
          user,
          token,
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
  }, []);

  // Logout function
  const logout = useCallback(() => {
    clearStoredAuth();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    toast.success('Sesión cerrada exitosamente');
    navigate('/login');
  }, [navigate]);

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