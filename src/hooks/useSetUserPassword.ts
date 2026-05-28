import { useState, useCallback } from 'react';
import { useSetUserPasswordMutation } from '@/generated/graphql';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface UseSetUserPasswordReturn {
  setUserPassword: (userId: string, newPassword: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Validates password strength according to security standards
 * @param password - Password to validate
 * @returns Array of validation error messages (empty if valid)
 */
const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (!password || password.trim().length === 0) {
    errors.push('La contraseña es requerida');
    return errors;
  }

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un símbolo');
  }

  return errors;
};

/**
 * Hook for setting user password (admin action)
 * Follows ERROR_HANDLING_STANDARDS.md patterns
 */
export const useSetUserPassword = (): UseSetUserPasswordReturn => {
  const [setUserPasswordMutation, { loading, error }] =
    useSetUserPasswordMutation();
  const [localError, setLocalError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const setUserPassword = useCallback(
    async (userId: string, newPassword: string): Promise<boolean> => {
      try {
        // ✅ PASO 1: Limpiar errores previos
        setLocalError(null);

        // ✅ PASO 1.5: Verificar autenticación
        if (!isAuthenticated) {
          const errorMessage =
            'Debes estar autenticado para realizar esta acción';
          setLocalError(errorMessage);
          toast.error(errorMessage);
          return false;
        }

        // ✅ PASO 2: Validación local
        const validationErrors = validatePassword(newPassword);
        if (validationErrors.length > 0) {
          const errorMessage = validationErrors.join('. ');
          setLocalError(errorMessage);
          toast.error(errorMessage);
          return false;
        }

        // ✅ PASO 3: Ejecutar mutación
        const result = await setUserPasswordMutation({
          variables: {
            userId,
            newPassword,
          },
        });

        // ✅ PASO 4: Validar respuesta del servidor
        const response = result.data?.setUserPassword;

        if (!response) {
          throw new Error('No se recibió respuesta del servidor');
        }

        if (!response.success) {
          const errorMessage =
            response.message || 'Error al establecer nueva contraseña';
          const errorCode = response.code || 'UNKNOWN_ERROR';

          setLocalError(`${errorMessage} (${errorCode})`);
          toast.error(errorMessage);
          return false;
        }

        // ✅ PASO 5: Éxito
        toast.success(
          response.message || 'Nueva contraseña establecida exitosamente'
        );
        return true;
      } catch (error) {
        // ✅ PASO 6: Manejo de errores
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Error inesperado al establecer contraseña';
        setLocalError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [setUserPasswordMutation, isAuthenticated]
  );

  // ✅ PASO 7: Combinar errores
  const combinedError = localError || error?.message || null;

  return {
    setUserPassword,
    loading,
    error: combinedError,
    clearError: () => {
      setLocalError(null);
    },
  };
};
