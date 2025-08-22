import { useState, useCallback } from 'react';
import { useUploadImageMutation } from '@/generated/graphql';
import type { UseImageUploadReturn, UploadProgress, UploadResult } from '@/types/upload';

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploadImage] = useUploadImageMutation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({ current: 0, total: 0, percentage: 0 });
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const upload = useCallback(async (files: FileList, entityId?: string, entityType?: string): Promise<UploadResult> => {
    setLoading(true);
    setError(null);
    setProgress({ current: 0, total: files.length, percentage: 0 });

    try {
      const results: UploadResult[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        
        if (!file) continue;
        
        // Usar entityId proporcionado o generar uno temporal como fallback
        const finalEntityId = entityId || `temp-${Date.now()}-${i}`;
        const finalEntityType = entityType || 'product';
        
        console.log(`🔗 useImageUpload - Archivo ${i + 1}/${totalFiles}:`, {
          fileName: file.name,
          entityId: finalEntityId,
          entityType: finalEntityType,
          isGrouped: !!entityId
        });
        
        // Actualizar progreso
        setProgress(prev => ({
          ...prev,
          current: i + 1,
          percentage: Math.round(((i + 1) / totalFiles) * 100)
        }));

        try {
          // ✅ Llamar a la mutación CON el archivo (apollo-upload-client lo enviará como multipart/form-data)
          const result = await uploadImage({
            variables: {
              file,
              entityId: finalEntityId,
              entityType: finalEntityType
            }
          });

          console.log('🔍 useImageUpload - Respuesta del servidor:', result);

          if (result.data?.uploadImage?.success && result.data.uploadImage.data) {
            results.push({
              success: true,
              url: result.data.uploadImage.data.url,
              filename: result.data.uploadImage.data.filename,
              imageId: result.data.uploadImage.data.imageId,
              message: result.data.uploadImage.message
            });
          } else {
            results.push({
              success: false,
              error: result.data?.uploadImage?.message || 'Error desconocido en el upload'
            });
          }
        } catch (fileError: any) {
          results.push({
            success: false,
            error: `Error al subir ${file?.name || 'archivo'}: ${fileError.message}`
          });
        }
      }

      // Verificar si todos los uploads fueron exitosos
      const successfulUploads = results.filter(r => r.success);
      const failedUploads = results.filter(r => !r.success);

      if (successfulUploads.length === totalFiles) {
        // Todos exitosos
        const firstUpload = successfulUploads[0];
        return {
          success: true,
          url: firstUpload?.url || '',
          filename: firstUpload?.filename || '',
          imageId: firstUpload?.imageId || '',
          message: `${successfulUploads.length} imagen(es) subida(s) exitosamente`
        };
      } else if (successfulUploads.length > 0) {
        // Algunos exitosos, algunos fallidos
        return {
          success: false,
          error: `${successfulUploads.length} de ${totalFiles} imágenes se subieron exitosamente. Errores: ${failedUploads.map(r => r.error).join(', ')}`
        };
      } else {
        // Todos fallidos
        throw new Error(`Ninguna imagen se pudo subir: ${failedUploads.map(r => r.error).join(', ')}`);
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Error desconocido en el upload';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
      setProgress({ current: 0, total: 0, percentage: 0 });
    }
  }, [uploadImage]);

  return {
    upload,
    loading,
    progress,
    error,
    clearError
  };
};
