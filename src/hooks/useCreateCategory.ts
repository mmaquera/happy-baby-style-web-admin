import { useCreateCategoryMutation } from '@/generated/graphql';
import { CreateCategoryInput } from '@/generated/graphql';
import { toast } from 'react-hot-toast';

export const useCreateCategory = () => {
  const [createCategoryMutation, { loading, error }] = useCreateCategoryMutation({
    refetchQueries: ['GetCategories'],
    onCompleted: (data) => {
      if (data?.createCategory?.success) {
        toast.success('Categoría creada exitosamente');
      } else {
        const errorMessage = data?.createCategory?.message || 'Error al crear categoría';
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      toast.error(`Error al crear categoría: ${error.message}`);
    }
  });

  const create = async (input: CreateCategoryInput) => {
    try {
      const result = await createCategoryMutation({
        variables: { input }
      });
      
      const response = result.data?.createCategory;
      
      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }
      
      if (!response.success) {
        const errorMessage = response.message || 'Error al crear categoría';
        const errorCode = response.code || 'UNKNOWN_ERROR';
        
        throw new Error(`${errorMessage} (${errorCode})`);
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear categoría';
      toast.error(errorMessage);
      throw error;
    }
  };

  return { create, loading, error };
};
