// useForgotPassword Hook - Following SOLID principles and Clean Architecture
// Single Responsibility: Manages forgot password logic only
// Open/Closed: Extensible for new features
// Liskov Substitution: Consistent hook behavior
// Interface Segregation: Specific return interface
// Dependency Inversion: Depends on abstraction

import { useState, useCallback } from 'react';

// Interface following Interface Segregation Principle
interface ForgotPasswordState {
  email: string;
  isLoading: boolean;
  isSuccess: boolean;
  error: string;
}

interface ForgotPasswordActions {
  setEmail: (email: string) => void;
  submitForm: (email: string) => Promise<void>;
  resetState: () => void;
  clearError: () => void;
}

interface UseForgotPasswordReturn extends ForgotPasswordState, ForgotPasswordActions {}

// Hook following Single Responsibility Principle
export const useForgotPassword = (): UseForgotPasswordReturn => {
  const [state, setState] = useState<ForgotPasswordState>({
    email: '',
    isLoading: false,
    isSuccess: false,
    error: '',
  });

  // Set email following Single Responsibility Principle
  const setEmail = useCallback((email: string) => {
    setState(prev => ({ ...prev, email, error: '' }));
  }, []);

  // Clear error following Single Responsibility Principle
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: '' }));
  }, []);

  // Reset state following Single Responsibility Principle
  const resetState = useCallback(() => {
    setState({
      email: '',
      isLoading: false,
      isSuccess: false,
      error: '',
    });
  }, []);

  // Submit form following Single Responsibility Principle
  const submitForm = useCallback(async (email: string) => {
    // Validation logic
    if (!email.trim()) {
      setState(prev => ({ 
        ...prev, 
        error: 'Por favor ingresa tu correo electrónico' 
      }));
      return;
    }

    // Email format validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      setState(prev => ({ 
        ...prev, 
        error: 'Por favor ingresa un correo electrónico válido' 
      }));
      return;
    }

    // Set loading state
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: '' 
    }));

    try {
      // TODO: Replace with actual API call
      // This is a simulation - implement actual password reset logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setState(prev => ({ 
        ...prev, 
        isSuccess: true, 
        isLoading: false 
      }));
    } catch (error) {
      // Handle error
      setState(prev => ({ 
        ...prev, 
        error: 'Ocurrió un error al enviar el correo. Por favor intenta nuevamente.',
        isLoading: false 
      }));
    }
  }, []);

  return {
    ...state,
    setEmail,
    submitForm,
    resetState,
    clearError,
  };
};

export default useForgotPassword;

