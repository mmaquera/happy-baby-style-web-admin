import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiService } from '@/services/api';
import { Product, CreateProductForm, ProductFilters } from '@/types';
import toast from 'react-hot-toast';

// Query keys
export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
  list: (filters: ProductFilters) => [...PRODUCT_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PRODUCT_QUERY_KEYS.details(), id] as const,
};

// Get products hook
export const useProducts = (filters?: ProductFilters) => {
  return useQuery(
    PRODUCT_QUERY_KEYS.list(filters || {}),
    () => apiService.getProducts(filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Error al cargar productos');
      },
    }
  );
};

// Get single product hook
export const useProduct = (id: string) => {
  return useQuery(
    PRODUCT_QUERY_KEYS.detail(id),
    () => apiService.getProduct(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Error al cargar producto');
      },
    }
  );
};

// Create product hook
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: CreateProductForm) => apiService.createProduct(data),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(PRODUCT_QUERY_KEYS.lists());
        toast.success(response.message || 'Producto creado exitosamente');
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al crear producto';
        toast.error(message);
      },
    }
  );
};

// Update product hook
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, data }: { id: string; data: Partial<CreateProductForm> }) =>
      apiService.updateProduct(id, data),
    {
      onSuccess: (response, { id }) => {
        queryClient.invalidateQueries(PRODUCT_QUERY_KEYS.lists());
        queryClient.invalidateQueries(PRODUCT_QUERY_KEYS.detail(id));
        toast.success(response.message || 'Producto actualizado exitosamente');
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al actualizar producto';
        toast.error(message);
      },
    }
  );
};

// Delete product hook
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) => apiService.deleteProduct(id),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(PRODUCT_QUERY_KEYS.lists());
        toast.success(response.message || 'Producto eliminado exitosamente');
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al eliminar producto';
        toast.error(message);
      },
    }
  );
};