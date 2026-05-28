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
  UpdateProductInput,
  PaginationInput,
} from '../generated/graphql';
import toast from 'react-hot-toast';
import { logger } from '@/utils/logger';

// Helper functions to map TypeScript types to GraphQL types
const mapToGraphQLFilter = (
  filter: ProductFilterInput | undefined
): ProductFilterInput | null => {
  return filter || null;
};

const mapToGraphQLPagination = (
  limit: number,
  offset: number = 0
): PaginationInput => {
  return { limit, offset };
};

interface UseProductsOptions {
  filter?: ProductFilterInput;
  limit?: number;
  skip?: boolean;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { filter, limit = 20, skip = false } = options;

  const { data, loading, error, fetchMore, refetch } = useGetProductsQuery({
    variables: {
      filter: mapToGraphQLFilter(filter),
      pagination: mapToGraphQLPagination(limit, 0),
    },
    skip,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  });

  const loadMore = () => {
    if (!data?.products?.data?.pagination?.hasMore) return;

    return fetchMore({
      variables: {
        pagination: {
          limit,
          offset: data.products?.data?.items?.length || 0,
        },
      },
    });
  };

  return {
    products: data?.products?.data?.items || [],
    total: data?.products?.data?.pagination?.total || 0,
    hasMore: data?.products?.data?.pagination?.hasMore || false,
    loading,
    error,
    loadMore,
    refetch,
  };
};

export const useProduct = (id: string, skip = false) => {
  const { data, loading, error, refetch } = useGetProductQuery({
    variables: { id },
    skip: skip || !id,
    errorPolicy: 'all',
  });

  return {
    product: data?.product?.data?.entity,
    loading,
    error,
    refetch,
  };
};

export const useCreateProduct = () => {
  const [createProduct, { loading, error }] = useCreateProductMutation({
    refetchQueries: [GetProductsDocument],
    // ✅ Restaurado onCompleted con lógica condicional para evitar toasts duplicados
    onCompleted: data => {
      // Solo mostrar toast si realmente fue exitoso según el servidor
      if (data?.createProduct?.success === true) {
        toast.success('Producto creado exitosamente');
      }
      // Si success: false, no mostrar toast - useProductActions maneja el error
    },
    onError: error => {
      // ❌ Solo se ejecuta en caso de error de red/GraphQL, no errores de negocio
      logger.debug(
        '🚨 useCreateProduct - Error de GraphQL/Red:',
        error.message
      );
      // No mostrar toast aquí - useProductActions maneja todos los casos
    },
  });

  const create = (input: CreateProductInput) => {
    // Note: The backend should handle both absolute URLs and relative paths for images
    // The frontend components convert absolute URLs to relative paths before calling this function
    return createProduct({ variables: { input } });
  };

  return { create, loading, error };
};

export const useUpdateProduct = () => {
  const [updateProduct, { loading, error }] = useUpdateProductMutation({
    // ✅ Restaurado onCompleted con lógica condicional para evitar toasts duplicados
    onCompleted: data => {
      // Solo mostrar toast si realmente fue exitoso según el servidor
      if (data?.updateProduct?.success === true) {
        toast.success('Producto actualizado exitosamente');
      }
      // Si success: false, no mostrar toast - useProductActions maneja el error
    },
    onError: error => {
      // ❌ Solo se ejecuta en caso de error de red/GraphQL, no errores de negocio
      logger.debug(
        '🚨 useUpdateProduct - Error de GraphQL/Red:',
        error.message
      );
      // No mostrar toast aquí - useProductActions maneja todos los casos
    },
  });

  const update = (id: string, input: UpdateProductInput) => {
    // Note: The backend should handle both absolute URLs and relative paths for images
    // The frontend components convert absolute URLs to relative paths before calling this function
    return updateProduct({ variables: { id, input } });
  };

  return { update, loading, error };
};

export const useDeleteProduct = () => {
  const [deleteProduct, { loading, error }] = useDeleteProductMutation({
    refetchQueries: [GetProductsDocument],
    // ✅ Restaurado onCompleted con lógica condicional para evitar toasts duplicados
    onCompleted: data => {
      // Solo mostrar toast si realmente fue exitoso según el servidor
      if (data?.deleteProduct?.success === true) {
        toast.success('Producto eliminado exitosamente');
      }
      // Si success: false, no mostrar toast - useProductActions maneja el error
    },
    onError: error => {
      // ❌ Solo se ejecuta en caso de error de red/GraphQL, no errores de negocio
      logger.debug(
        '🚨 useDeleteProduct - Error de GraphQL/Red:',
        error.message
      );
      // No mostrar toast aquí - useProductActions maneja todos los casos
    },
  });

  const remove = (id: string) => {
    return deleteProduct({ variables: { id } });
  };

  return { remove, loading, error };
};

export const useUploadProductImage = () => {
  const [uploadImage, { loading, error }] = useUploadImageMutation({
    // ✅ Removidos los toasts automáticos para evitar duplicación
    // Los mensajes se manejan centralmente en useProductActions
  });

  const upload = (file: File, productId: string) => {
    // ✅ VERIFICACIÓN: Logs para diagnosticar el problema
    logger.debug('📁 useUploadProductImage - Archivo recibido:', file);
    logger.debug('📁 useUploadProductImage - ProductId recibido:', productId);
    logger.debug('📁 useUploadProductImage - Variables a enviar:', {
      file,
      entityId: productId,
      entityType: 'product',
    });

    return uploadImage({
      variables: {
        file,
        entityId: productId,
        entityType: 'product',
      },
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
      logger.error('Search error:', error);
      toast.error('Error al buscar productos');
    } finally {
      setSearchLoading(false);
    }
  };

  return {
    searchQuery,
    searchResults,
    searchLoading,
    search,
  };
};
