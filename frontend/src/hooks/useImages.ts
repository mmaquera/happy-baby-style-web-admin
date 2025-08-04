import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiService } from '@/services/api';
import { Image, ImageEntityType } from '@/types';
import toast from 'react-hot-toast';

// Query keys
export const IMAGE_QUERY_KEYS = {
  all: ['images'] as const,
  byEntity: (entityType: ImageEntityType, entityId: string) => 
    [...IMAGE_QUERY_KEYS.all, 'entity', entityType, entityId] as const,
};

// Get images by entity hook
export const useImagesByEntity = (entityType: ImageEntityType, entityId: string) => {
  return useQuery(
    IMAGE_QUERY_KEYS.byEntity(entityType, entityId),
    () => apiService.getImagesByEntity(entityType, entityId),
    {
      enabled: !!entityType && !!entityId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Error al cargar imágenes');
      },
    }
  );
};

// Upload image hook
export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ file, entityType, entityId }: { 
      file: File; 
      entityType: ImageEntityType; 
      entityId: string; 
    }) => apiService.uploadImage(file, entityType, entityId),
    {
      onSuccess: (response, { entityType, entityId }) => {
        queryClient.invalidateQueries(IMAGE_QUERY_KEYS.byEntity(entityType, entityId));
        toast.success(response.message || 'Imagen subida exitosamente');
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al subir imagen';
        toast.error(message);
      },
    }
  );
};

// Delete image hook
export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) => apiService.deleteImage(id),
    {
      onSuccess: (response) => {
        // Invalidate all image queries to refresh the lists
        queryClient.invalidateQueries(IMAGE_QUERY_KEYS.all);
        toast.success(response.message || 'Imagen eliminada exitosamente');
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al eliminar imagen';
        toast.error(message);
      },
    }
  );
};