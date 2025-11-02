// =====================================================
// SVG UPLOAD HOOK - Categories Module
// =====================================================
// Following Clean Architecture principles and custom hooks best practices
// Specific hook for SVG upload functionality in categories

import { useState, useCallback } from 'react';
import { useUploadSvgMutation } from '@/generated/graphql';
import { 
  UseSVGUploadReturn, 
  SVGUploadResult, 
  SVGUploadProgress, 
  SVGUploadError, 
  SVGValidationResult,
  SVG_VALIDATION_RULES 
} from '@/components/categories/SVGUpload/SVGUpload.types';

export const useSVGUpload = (): UseSVGUploadReturn => {
  // GraphQL mutation for SVG upload
  const [uploadSvgMutation] = useUploadSvgMutation();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<SVGUploadProgress | null>(null);
  const [error, setError] = useState<SVGUploadError | null>(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset function
  const reset = useCallback(() => {
    setLoading(false);
    setProgress(null);
    setError(null);
  }, []);

  // SVG validation function
  const validateSVG = useCallback((file: File): SVGValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check file extension first (most reliable for SVG)
    const hasValidExtension = SVG_VALIDATION_RULES.allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExtension) {
      errors.push(`Extensión de archivo no válida. Solo se permiten archivos .svg`);
    }
    
    // Check MIME type (some browsers may not set this correctly for SVG)
    const hasValidMimeType = SVG_VALIDATION_RULES.allowedTypes.includes(file.type as any) || 
                            file.type === '' || // Some browsers don't set MIME type for SVG
                            file.type === 'application/octet-stream'; // Fallback MIME type
    
    if (!hasValidMimeType) {
      warnings.push(`Tipo MIME inesperado: ${file.type}. Verificando contenido del archivo...`);
    }
    
    // Check file size
    if (file.size > SVG_VALIDATION_RULES.maxSize) {
      errors.push(`El archivo es demasiado grande. Máximo ${SVG_VALIDATION_RULES.maxSize / 1000}KB.`);
    }
    
    if (file.size < SVG_VALIDATION_RULES.minSize) {
      errors.push(`El archivo es demasiado pequeño. Mínimo ${SVG_VALIDATION_RULES.minSize} bytes.`);
    }
    
    // Additional SVG-specific validations
    if (file.size > 1000000) { // 1MB
      warnings.push('Archivo SVG grande detectado. Se recomienda optimizar el archivo.');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fileInfo: {
        size: file.size,
        type: file.type,
        name: file.name,
      },
    };
  }, []);

  // SVG content validation function
  const validateSVGContent = useCallback(async (file: File): Promise<{ isValid: boolean; errors: string[] }> => {
    try {
      const content = await file.text();
      const errors: string[] = [];
      
      // Check if it's a valid SVG
      if (!content.includes('<svg')) {
        errors.push('El archivo no contiene un elemento SVG válido');
      }
      
      // Check for forbidden elements
      SVG_VALIDATION_RULES.forbiddenElements.forEach(element => {
        if (content.includes(`<${element}`)) {
          errors.push(`Elemento prohibido detectado: ${element}`);
        }
      });
      
      // Check for required elements
      if (!content.includes('<svg')) {
        errors.push('Elemento SVG requerido no encontrado');
      }
      
      // Check for potential security issues
      if (content.includes('javascript:') || content.includes('data:text/html')) {
        errors.push('Contenido potencialmente inseguro detectado');
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (err) {
      return {
        isValid: false,
        errors: ['Error al leer el contenido del archivo SVG']
      };
    }
  }, []);

  // SVG optimization function
  const optimizeSVG = useCallback((svgContent: string): string => {
    try {
      // Basic SVG optimization
      let optimized = svgContent;
      
      // Remove comments
      optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
      
      // Remove unnecessary whitespace
      optimized = optimized.replace(/\s+/g, ' ');
      
      // Remove empty lines
      optimized = optimized.replace(/\n\s*\n/g, '\n');
      
      // Remove empty attributes
      optimized = optimized.replace(/\s+=\s*""/g, '');
      
      // Trim whitespace
      optimized = optimized.trim();
      
      return optimized;
    } catch (err) {
      console.warn('Error optimizing SVG:', err);
      return svgContent;
    }
  }, []);

  // Main upload function
  const uploadSVG = useCallback(async (file: File): Promise<SVGUploadResult> => {
    try {
      setLoading(true);
      setError(null);
      setProgress({ loaded: 0, total: file.size, percentage: 0, filename: file.name });

      // Validate file
      const validation = validateSVG(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        console.warn('SVG Upload Warnings:', validation.warnings);
      }

      // Validate SVG content
      const contentValidation = await validateSVGContent(file);
      if (!contentValidation.isValid) {
        throw new Error(`Contenido SVG inválido: ${contentValidation.errors.join(', ')}`);
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', 'category');
      formData.append('entityId', 'temp'); // Will be updated when category is created

      // Upload with progress tracking
      const result = await uploadSvgMutation({
        variables: {
          file: file,
          entityType: 'category',
          entityId: 'temp',
          optimize: true, // ✅ Optimizar el SVG
          sanitize: true, // ✅ Sanitizar el contenido
        },
        context: {
          // Add progress tracking if supported by Apollo
          onUploadProgress: (progressEvent: any) => {
            if (progressEvent.lengthComputable) {
              const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress({
                loaded: progressEvent.loaded,
                total: progressEvent.total,
                percentage,
                filename: file.name,
              });
            }
          },
        },
      });

      if (result.data?.uploadSvg?.success && result.data.uploadSvg.data) {
        const uploadData = result.data.uploadSvg.data;
        
        const uploadResult: SVGUploadResult = {
          url: uploadData.url,
          filename: uploadData.filename,
          size: file.size,
          categoryId: 'temp', // Will be updated when category is created
          optimized: uploadData.optimized,
          uploadedAt: new Date().toISOString(),
        };

        setProgress(null);
        return uploadResult;
      } else {
        // Handle specific SVG upload errors
        const errorMessage = result.data?.uploadSvg?.message || 'Error desconocido en la subida';
        
        if (errorMessage.includes('Invalid file type') || errorMessage.includes('Only JPEG, PNG and WEBP')) {
          throw new Error('El backend no acepta archivos SVG. Por favor contacta al administrador para habilitar el soporte de SVG.');
        }
        
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      const uploadError: SVGUploadError = {
        code: 'UPLOAD_ERROR',
        message: err.message || 'Error al subir el archivo SVG',
        filename: file.name,
        details: err,
      };
      
      setError(uploadError);
      throw uploadError;
    } finally {
      setLoading(false);
    }
  }, [uploadSvgMutation, validateSVG]);

  return {
    uploadSVG,
    validateSVG,
    optimizeSVG,
    loading,
    progress,
    error,
    clearError,
    reset,
  };
};
