import { useUpdateCategoryMutation } from '@/generated/graphql';
import { UpdateCategoryInput } from '@/generated/graphql';
import { toast } from 'react-hot-toast';

export const useUpdateCategory = () => {
  const [updateCategoryMutation, { loading, error }] = useUpdateCategoryMutation({
    refetchQueries: ['GetCategories'],
    onCompleted: (data) => {
      if (data?.updateCategory?.success) {
        toast.success('Categoría actualizada exitosamente');
      } else {
        const errorMessage = data?.updateCategory?.message || 'Error al actualizar categoría';
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      toast.error(`Error al actualizar categoría: ${error.message}`);
    }
  });

  const update = async (id: string, input: UpdateCategoryInput) => {
    try {
      const result = await updateCategoryMutation({
        variables: { id, input }
      });
      
      const response = result.data?.updateCategory;
      
      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }
      
      if (!response.success) {
        const errorMessage = response.message || 'Error al actualizar categoría';
        const errorCode = response.code || 'UNKNOWN_ERROR';
        
        throw new Error(`${errorMessage} (${errorCode})`);
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar categoría';
      toast.error(errorMessage);
      throw error;
    }
  };

  return { update, loading, error };
};
