import {
  useCreateCategoryMutation,
  useUploadSvgMutation,
} from '@/generated/graphql';
import { type CreateCategoryInput } from '@/generated/graphql';
import { toast } from 'react-hot-toast';
import { useState, useCallback } from 'react';

interface UseCreateCategoryReturn {
  create: (input: CreateCategoryInput) => Promise<unknown>;
  uploadSVG: (file: File, categoryId?: string) => Promise<string | null>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  validateCategoryInput: (input: CreateCategoryInput) => string[];
}

export const useCreateCategory = (): UseCreateCategoryReturn => {
  const [createCategoryMutation, { loading: creating, error: createError }] =
    useCreateCategoryMutation({
      // Removed refetchQueries to avoid duplicate refetch - handled by parent hook
    });

  const [uploadSvgMutation, { loading: uploading }] = useUploadSvgMutation();

  const [localError, setLocalError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setLocalError(null);
  }, []);

  const validateCategoryInput = useCallback(
    (input: CreateCategoryInput): string[] => {
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
    async (file: File, categoryId?: string): Promise<string | null> => {
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
            file,
            entityType: 'category',
            entityId: categoryId || 'temp',
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

  const create = useCallback(
    async (input: CreateCategoryInput) => {
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
        const result = await createCategoryMutation({
          variables: { input },
        });

        // ✅ PASO 4: Validar respuesta del servidor
        const response = result.data?.createCategory;

        if (!response) {
          throw new Error('No se recibió respuesta del servidor');
        }

        if (!response.success) {
          const errorMessage = response.message || 'Error al crear categoría';
          const errorCode = response.code || 'UNKNOWN_ERROR';

          setLocalError(`${errorMessage} (${errorCode})`);
          toast.error(errorMessage);
          return false;
        }

        // ✅ PASO 5: Éxito
        toast.success('Categoría creada exitosamente');
        return response;
      } catch (error) {
        // ✅ PASO 6: Manejo de errores
        const errorMessage =
          error instanceof Error ? error.message : 'Error al crear categoría';
        setLocalError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [createCategoryMutation, validateCategoryInput]
  );

  // ✅ PASO 7: Combinar errores
  const combinedError = localError || createError?.message || null;
  const loading = creating || uploading;

  return {
    create,
    uploadSVG,
    loading,
    error: combinedError,
    clearError,
    validateCategoryInput,
  };
};

// ✅ Función de validación específica para SVG
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
