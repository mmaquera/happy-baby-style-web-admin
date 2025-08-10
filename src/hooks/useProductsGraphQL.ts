import { useState } from 'react';
import { 
  useGetProductsQuery, 
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImageMutation,
  GetProductsDocument,
  ProductFilterInput,
  CreateProductInput,
  UpdateProductInput
} from '../generated/graphql';
import toast from 'react-hot-toast';

interface UseProductsOptions {
  filter?: ProductFilterInput;
  limit?: number;
  skip?: boolean;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { filter, limit = 20, skip = false } = options;
  
  const { data, loading, error, fetchMore, refetch } = useGetProductsQuery({
    variables: {
      filter: filter || undefined,
      pagination: { limit, offset: 0 }
    },
    skip,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all'
  });

  const loadMore = () => {
    if (!data?.products.hasMore) return;
    
    return fetchMore({
      variables: {
        pagination: {
          limit,
          offset: data.products.products.length
        }
      }
    });
  };

  return {
    products: data?.products.products || [],
    total: data?.products.total || 0,
    hasMore: data?.products.hasMore || false,
    loading,
    error,
    loadMore,
    refetch
  };
};

export const useProduct = (id: string, skip = false) => {
  const { data, loading, error, refetch } = useGetProductQuery({
    variables: { id },
    skip: skip || !id,
    errorPolicy: 'all'
  });

  return {
    product: data?.product,
    loading,
    error,
    refetch
  };
};

export const useCreateProduct = () => {
  const [createProduct, { loading, error }] = useCreateProductMutation({
    refetchQueries: [GetProductsDocument],
    onCompleted: () => {
      toast.success('Producto creado exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al crear producto: ${error.message}`);
    }
  });

  const create = (input: CreateProductInput) => {
    return createProduct({ variables: { input } });
  };

  return { create, loading, error };
};

export const useUpdateProduct = () => {
  const [updateProduct, { loading, error }] = useUpdateProductMutation({
    onCompleted: () => {
      toast.success('Producto actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al actualizar producto: ${error.message}`);
    }
  });

  const update = (id: string, input: UpdateProductInput) => {
    return updateProduct({ variables: { id, input } });
  };

  return { update, loading, error };
};

export const useDeleteProduct = () => {
  const [deleteProduct, { loading, error }] = useDeleteProductMutation({
    refetchQueries: [GetProductsDocument],
    onCompleted: (data) => {
      toast.success('Producto eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al eliminar producto: ${error.message}`);
    }
  });

  const remove = (id: string) => {
    return deleteProduct({ variables: { id } });
  };

  return { remove, loading, error };
};

export const useUploadProductImage = () => {
  const [uploadImage, { loading, error }] = useUploadImageMutation({
    onCompleted: (data) => {
      toast.success('Imagen subida exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al subir imagen: ${error.message}`);
    }
  });

  const upload = (file: File, productId: string) => {
    return uploadImage({ 
      variables: { 
        file, 
        entityId: productId, 
        entityType: 'product' 
      } 
    });
  };

  return { upload, loading, error };
};

export const useProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const search = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      // Implement search functionality using the SearchProducts query
      // This would need to be implemented based on your search requirements
      setSearchQuery(query);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error al buscar productos');
    } finally {
      setSearchLoading(false);
    }
  };

  return {
    searchQuery,
    searchResults,
    searchLoading,
    search
  };
};