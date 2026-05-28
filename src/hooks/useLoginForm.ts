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
  const [localError, setLocalError] = useState<string | null>(null);

  // Form configuration with memoized validation rules
  const form = useForm<LoginFormData>({
    defaultValues,
    mode: 'onBlur', // Validate on blur for better UX
  });

  // Memoized redirect path
  const redirectPath = useMemo(() => {
    return (location.state as any)?.from?.pathname || '/';
  }, [location.state]);

  // ✅ PASO 1: Función para procesar errores del servidor
  const processLoginError = useCallback((errorMessage: string): string => {
    const errorLower = errorMessage.toLowerCase();

    if (
      errorLower.includes('invalid email') ||
      errorLower.includes('invalid password')
    ) {
      return 'Credenciales incorrectas. Verifica tu email y contraseña.';
    }

    if (errorLower.includes('network') || errorLower.includes('connection')) {
      return 'Error de conexión. Verifica tu internet e intenta nuevamente.';
    }

    if (errorLower.includes('server') || errorLower.includes('internal')) {
      return 'Error del servidor. Intenta nuevamente en unos momentos.';
    }

    if (errorLower.includes('timeout')) {
      return 'La solicitud tardó demasiado. Intenta nuevamente.';
    }

    return 'Error al iniciar sesión. Intenta nuevamente.';
  }, []);

  // ✅ PASO 2: Handle form submission siguiendo estándares
  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        // ✅ PASO 1: Limpiar errores previos
        setLocalError(null);
        clearAuthError();

        // ✅ PASO 2: Validación local (ya manejada por react-hook-form)
        // Los errores de validación se muestran automáticamente en los campos

        // ✅ PASO 3: Ejecutar login
        const success = await login(data);

        // ✅ PASO 4: Validar respuesta del servidor
        if (success) {
          // ✅ PASO 5: Éxito - El contexto ya maneja el toast de éxito
          navigate(redirectPath, { replace: true });
        } else {
          // ✅ Manejar caso de fallo sin excepción - El contexto ya maneja el toast de error
          const errorMessage =
            'Credenciales incorrectas. Verifica tu email y contraseña.';
          setLocalError(errorMessage);
        }
      } catch (error) {
        // ✅ PASO 6: Manejo de errores - El contexto ya maneja el toast de error
        const errorMessage =
          error instanceof Error ? error.message : 'Error al iniciar sesión';
        const processedError = processLoginError(errorMessage);

        setLocalError(processedError);
      }
    },
    [login, navigate, redirectPath, clearAuthError, processLoginError]
  );

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // ✅ PASO 7: Combinar errores locales y del contexto
  const combinedError = localError || error;

  // Clear error from both form and auth context
  const clearError = useCallback(() => {
    form.clearErrors();
    clearAuthError();
    setLocalError(null); // ✅ Limpiar error local
  }, [form, clearAuthError]);

  return {
    form,
    isLoading,
    error: combinedError, // ✅ Error combinado
    showPassword,
    onSubmit,
    togglePasswordVisibility,
    clearError,
  };
};
