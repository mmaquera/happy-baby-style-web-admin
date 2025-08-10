// useLoginForm Hook - Following SOLID principles and Clean Architecture
// Single Responsibility: Handles login form logic only
// Open/Closed: Extensible for new validation rules
// Interface Segregation: Specific interface for login form
// Dependency Inversion: Depends on auth context abstraction

import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Types following Interface Segregation Principle
interface LoginFormData {
  email: string;
  password: string;
}

interface UseLoginFormReturn {
  form: ReturnType<typeof useForm<LoginFormData>>;
  isLoading: boolean;
  error: string | null;
  showPassword: boolean;
  onSubmit: (data: LoginFormData) => Promise<void>;
  togglePasswordVisibility: () => void;
  clearError: () => void;
}

// Validation rules following Single Responsibility Principle
const validationRules = {
  email: {
    required: 'El correo electrónico es requerido',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Ingresa un correo electrónico válido',
    },
  },
  password: {
    required: 'La contraseña es requerida',
    minLength: {
      value: 6,
      message: 'La contraseña debe tener al menos 6 caracteres',
    },
  },
};

// Default values for the form
const defaultValues: LoginFormData = {
  email: '',
  password: '',
};

export const useLoginForm = (): UseLoginFormReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError: clearAuthError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Form configuration with memoized validation rules
  const form = useForm<LoginFormData>({
    defaultValues,
    mode: 'onBlur', // Validate on blur for better UX
  });

  // Memoized redirect path
  const redirectPath = useMemo(() => {
    return (location.state as any)?.from?.pathname || '/';
  }, [location.state]);

  // Handle form submission
  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      const success = await login(data);
      
      if (success) {
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled by the auth context
    }
  }, [login, navigate, redirectPath]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Clear error from both form and auth context
  const clearError = useCallback(() => {
    form.clearErrors();
    clearAuthError();
  }, [form, clearAuthError]);

  return {
    form,
    isLoading,
    error,
    showPassword,
    onSubmit,
    togglePasswordVisibility,
    clearError,
  };
};
