import {
  useUpdateCategoryMutation,
  useUploadSvgMutation,
} from '@/generated/graphql';
import { UpdateCategoryInput } from '@/generated/graphql';
import { toast } from 'react-hot-toast';
import { useState, useCallback } from 'react';

interface UseUpdateCategoryReturn {
  update: (id: string, input: UpdateCategoryInput) => Promise<any>;
  uploadSVG: (file: File, categoryId: string) => Promise<string | null>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  validateCategoryInput: (input: UpdateCategoryInput) => string[];
}

export const useUpdateCategory = (): UseUpdateCategoryReturn => {
  const [updateCategoryMutation, { loading: updating, error: updateError }] =
    useUpdateCategoryMutation({
      // Removed refetchQueries to avoid duplicate refetch - handled by parent hook
    });

  const [uploadSvgMutation, { loading: uploading }] = useUploadSvgMutation();

  const [localError, setLocalError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setLocalError(null);
  }, []);

  const validateCategoryInput = useCallback(
    (input: UpdateCategoryInput): string[] => {
      const errors: string[] = [];

      // Required fields validation
      if (!input.name?.trim()) {
        errors.push('El nombre de la categoría es requerido');
      }

      if (!input.slug?.trim()) {
        errors.push('El slug es requerido');
      } else if (!/^[a-z0-9-]+$/.test(input.slug)) {
        errors.push(
          'El slug solo puede contener letras minúsculas, números y guiones'
        );
      }

      // Optional validations
      if (input.sortOrder && input.sortOrder < 0) {
        errors.push('El orden no puede ser negativo');
      }

      return errors;
    },
    []
  );

  const uploadSVG = useCallback(
    async (file: File, categoryId: string): Promise<string | null> => {
      try {
        // ✅ PASO 1: Limpiar errores previos
        setLocalError(null);

        // ✅ PASO 2: Validación local específica para SVG
        const validationErrors = validateSVGFile(file);
        if (validationErrors.length > 0) {
          const errorMessage = validationErrors.join(', ');
          setLocalError(errorMessage);
          toast.error(errorMessage);
          return null;
        }

        // ✅ PASO 3: Ejecutar mutación de upload SVG
        const result = await uploadSvgMutation({
          variables: {
            file: file,
            entityType: 'category',
            entityId: categoryId,
            optimize: true, // ✅ Optimizar el SVG
            sanitize: true, // ✅ Sanitizar el contenido
          },
        });

        // ✅ PASO 4: Validar respuesta del servidor
        const response = result.data?.uploadSvg;

        if (!response) {
          throw new Error('No se recibió respuesta del servidor');
        }

        if (!response.success) {
          const errorMessage =
            response.message || 'Error al subir el archivo SVG';
          const errorCode = response.code || 'UPLOAD_ERROR';

          // ✅ Manejo específico para errores de tipo de archivo
          if (
            errorMessage.includes('Invalid file type') ||
            errorMessage.includes('Only JPEG, PNG and WEBP')
          ) {
            const specificError =
              'El backend no acepta archivos SVG. Por favor contacta al administrador para habilitar el soporte de SVG.';
            setLocalError(specificError);
            toast.error(specificError);
            return null;
          }

          setLocalError(`${errorMessage} (${errorCode})`);
          toast.error(errorMessage);
          return null;
        }

        // ✅ PASO 5: Éxito
        toast.success('Archivo SVG subido exitosamente');
        return response.data?.url || null;
      } catch (error) {
        // ✅ PASO 6: Manejo de errores
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Error inesperado al subir SVG';
        setLocalError(errorMessage);
        toast.error(errorMessage);
        return null;
      }
    },
    [uploadSvgMutation]
  );

  const update = useCallback(
    async (id: string, input: UpdateCategoryInput) => {
      try {
        // ✅ PASO 1: Limpiar errores previos
        setLocalError(null);

        // ✅ PASO 2: Validación local
        const validationErrors = validateCategoryInput(input);
        if (validationErrors.length > 0) {
          const errorMessage = validationErrors.join(', ');
          setLocalError(errorMessage);
          toast.error(errorMessage);
          return false;
        }

        // ✅ PASO 3: Ejecutar mutación
        const result = await updateCategoryMutation({
          variables: { id, input },
        });

        // ✅ PASO 4: Validar respuesta del servidor
        const response = result.data?.updateCategory;

        if (!response) {
          throw new Error('No se recibió respuesta del servidor');
        }

        if (!response.success) {
          const errorMessage =
            response.message || 'Error al actualizar categoría';
          const errorCode = response.code || 'UNKNOWN_ERROR';

          setLocalError(`${errorMessage} (${errorCode})`);
          toast.error(errorMessage);
          return false;
        }

        // ✅ PASO 5: Éxito
        toast.success('Categoría actualizada exitosamente');
        return response;
      } catch (error) {
        // ✅ PASO 6: Manejo de errores
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Error al actualizar categoría';
        setLocalError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [updateCategoryMutation, validateCategoryInput]
  );

  // ✅ PASO 7: Combinar errores
  const combinedError = localError || updateError?.message || null;
  const loading = updating || uploading;

  return {
    update,
    uploadSVG,
    loading,
    error: combinedError,
    clearError,
    validateCategoryInput,
  };
};

// ✅ Función de validación específica para SVG (reutilizada de useCreateCategory)
const validateSVGFile = (file: File): string[] => {
  const errors: string[] = [];

  if (!file) {
    errors.push('No se seleccionó ningún archivo');
    return errors;
  }

  // Validación de tipo de archivo
  const hasValidExtension = file.name.toLowerCase().endsWith('.svg');
  if (!hasValidExtension) {
    errors.push('Solo se permiten archivos SVG (.svg)');
  }

  // Validación de MIME type (flexible para SVG)
  const hasValidMimeType = [
    'image/svg+xml',
    'image/svg',
    'application/xml',
    'text/xml',
    '', // Algunos navegadores no establecen MIME type para SVG
    'application/octet-stream', // Fallback MIME type
  ].includes(file.type);

  if (!hasValidMimeType) {
    errors.push(
      `Tipo MIME inesperado: ${file.type}. Verificando contenido del archivo...`
    );
  }

  // Validación de tamaño
  const maxSize = 500000; // 500KB
  if (file.size > maxSize) {
    errors.push(`El archivo es demasiado grande. Máximo ${maxSize / 1000}KB`);
  }

  const minSize = 100; // 100 bytes
  if (file.size < minSize) {
    errors.push(`El archivo es demasiado pequeño. Mínimo ${minSize} bytes`);
  }

  return errors;
};
