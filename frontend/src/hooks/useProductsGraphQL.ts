import { useState } from 'react';
import { 
  useGetProductsQuery, 
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImageMutation,
  GetProductsDocument,
  GetProductDocument,
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
    onCompleted: (data) => {
      toast.success(`Producto "${data.createProduct.name}" creado exitosamente`);
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
    onCompleted: (data) => {
      toast.success(`Producto "${data.updateProduct.name}" actualizado exitosamente`);
    },
    onError: (error) => {
      toast.error(`Error al actualizar producto: ${error.message}`);
    }
  });

  const update = (id: string, input: UpdateProductInput) => {
    return updateProduct({ 
      variables: { id, input },
      // Optimistic update
      optimisticResponse: {
        updateProduct: {
          __typename: 'Product',
          id,
          ...input as any,
        }
      }
    });
  };

  return { update, loading, error };
};

export const useDeleteProduct = () => {
  const [deleteProduct, { loading, error }] = useDeleteProductMutation({
    onCompleted: () => {
      toast.success('Producto eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al eliminar producto: ${error.message}`);
    }
  });

  const remove = (id: string) => {
    return deleteProduct({ 
      variables: { id },
      refetchQueries: [GetProductsDocument],
      // Remove from cache immediately
      update: (cache) => {
        cache.evict({ 
          id: cache.identify({ __typename: 'Product', id }) 
        });
        cache.gc();
      }
    });
  };

  return { remove, loading, error };
};

export const useUploadProductImage = () => {
  const [uploadImage, { loading, error }] = useUploadImageMutation({
    onCompleted: (data) => {
      if (data.uploadImage.success) {
        toast.success('Imagen subida exitosamente');
      } else {
        toast.error(data.uploadImage.message);
      }
    },
    onError: (error) => {
      toast.error(`Error al subir imagen: ${error.message}`);
    }
  });

  const upload = (file: File, productId: string) => {
    return uploadImage({
      variables: {
        file,
        entityType: 'product',
        entityId: productId
      },
      // Refetch product after upload
      refetchQueries: [
        { query: GetProductDocument, variables: { id: productId } }
      ]
    });
  };

  return { upload, loading, error };
};

// Search hook with debounce
export const useProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // Simple debounce implementation
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  });

  const { products, loading, error } = useProducts({
    filter: debouncedTerm ? { search: debouncedTerm, isActive: true } : undefined,
    skip: !debouncedTerm
  });

  return {
    searchTerm,
    setSearchTerm,
    results: products,
    loading,
    error,
    hasResults: products.length > 0
  };
};