// useRegisterUser Hook - Following SOLID principles and Clean Architecture
// Single Responsibility: Handles user registration logic only
// Open/Closed: Extensible for new validation rules
// Interface Segregation: Specific interface for registration
// Dependency Inversion: Depends on GraphQL abstraction

import { useState, useCallback } from 'react';
import { useRegisterUserMutation } from '@/generated/graphql';
import { CreateUserProfileInput } from '@/generated/graphql';
import toast from 'react-hot-toast';

// Types following Interface Segregation Principle
interface UseRegisterUserReturn {
  register: (input: CreateUserProfileInput) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

// Validation rules following Single Responsibility Principle
const validateRegistrationInput = (input: CreateUserProfileInput): string[] => {
  const errors: string[] = [];

  if (!input.email) {
    errors.push('Email es requerido');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.push('Email no válido');
  }

  if (!input.password) {
    errors.push('Contraseña es requerida');
  } else if (input.password.length < 8) {
    errors.push('Contraseña debe tener al menos 8 caracteres');
  }

  if (!input.firstName) {
    errors.push('Nombre es requerido');
  }

  if (!input.lastName) {
    errors.push('Apellido es requerido');
  }

  return errors;
};

export const useRegisterUser = (): UseRegisterUserReturn => {
  const [registerUserMutation, { loading, error }] = useRegisterUserMutation();
  const [customError, setCustomError] = useState<string | null>(null);

  // Handle user registration
  const register = useCallback(async (input: CreateUserProfileInput): Promise<boolean> => {
    try {
      // Clear previous errors
      setCustomError(null);

      // Validate input
      const validationErrors = validateRegistrationInput(input);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join(', ');
        setCustomError(errorMessage);
        toast.error(errorMessage);
        return false;
      }

      // Execute mutation
      const result = await registerUserMutation({
        variables: { input }
      });

      const response = result.data?.registerUser;

      if (!response) {
        const errorMessage = 'No se recibió respuesta del servidor';
        setCustomError(errorMessage);
        toast.error(errorMessage);
        return false;
      }

      if (!response.success) {
        // Handle server validation errors
        const errorMessage = response.message || 'Error al registrar usuario';
        const errorCode = response.code || 'UNKNOWN_ERROR';
        
        setCustomError(`${errorMessage} (${errorCode})`);
        toast.error(errorMessage);
        return false;
      }

      // Success
      toast.success('Usuario registrado exitosamente');
      return true;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrar usuario';
      setCustomError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, [registerUserMutation]);

  // Clear error function
  const clearError = useCallback(() => {
    setCustomError(null);
  }, []);

  // Combine GraphQL errors with custom validation errors
  const combinedError = customError || (error?.message || null);

  return {
    register,
    isLoading: loading,
    error: combinedError,
    clearError,
  };
};
