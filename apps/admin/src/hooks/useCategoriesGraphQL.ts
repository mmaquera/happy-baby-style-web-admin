import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  GetCategoriesDocument,
  GetCategoryDocument,
  GetCategoryBySlugDocument,
  CreateCategoryDocument,
  UpdateCategoryDocument,
  DeleteCategoryDocument,
  type CreateCategoryInput,
  type UpdateCategoryInput,
  type CategoryFilterInput,
  type PaginationInput,
  type Category,
} from '@/generated/graphql';
import { toast } from 'react-hot-toast';

export interface UseCategoriesGraphQLReturn {
  // Data
  categories: Category[];
  category: Category | null;
  loading: boolean;
  error: string | null;

  // Pagination
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
  };

  // Actions
  fetchCategories: (
    filters?: CategoryFilterInput,
    pagination?: PaginationInput
  ) => Promise<void>;
  fetchCategory: (id: string) => Promise<void>;
  fetchCategoryBySlug: (slug: string) => Promise<void>;
  createCategory: (
    input: CreateCategoryInput,
    currentFilters?: CategoryFilterInput,
    currentPagination?: PaginationInput
  ) => Promise<Category | null>;
  updateCategory: (
    id: string,
    input: UpdateCategoryInput,
    currentFilters?: CategoryFilterInput,
    currentPagination?: PaginationInput
  ) => Promise<Category | null>;
  deleteCategory: (
    id: string,
    currentFilters?: CategoryFilterInput,
    currentPagination?: PaginationInput
  ) => Promise<boolean>;

  // Utilities
  refetchCategories: () => Promise<void>;
  clearError: () => void;
}

export const useCategoriesGraphQL = (): UseCategoriesGraphQLReturn => {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false,
    currentPage: 1,
    totalPages: 0,
  });

  // Queries
  const [getCategoriesQuery] = useLazyQuery(GetCategoriesDocument);
  const [getCategoryQuery] = useLazyQuery(GetCategoryDocument);
  const [getCategoryBySlugQuery] = useLazyQuery(GetCategoryBySlugDocument);

  // Mutations
  const [createCategoryMutation] = useMutation(CreateCategoryDocument);
  const [updateCategoryMutation] = useMutation(UpdateCategoryDocument);
  const [deleteCategoryMutation] = useMutation(DeleteCategoryDocument);

  // Clear error utility
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch categories with filters and pagination
  const fetchCategories = useCallback(
    async (
      filters?: CategoryFilterInput,
      paginationInput?: PaginationInput
    ) => {
      try {
        setLoading(true);
        setError(null);

        const result = await getCategoriesQuery({
          variables: {
            filters: filters || {},
            pagination: paginationInput || { limit: 10, offset: 0 },
          },
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        const response = result.data?.categories;

        if (!response?.success) {
          throw new Error(response?.message || 'Error al obtener categorías');
        }

        const data = response.data;
        setCategories(data.items || []);

        if (data.pagination) {
          setPagination({
            total: data.pagination.total || 0,
            limit: data.pagination.limit || 10,
            offset: data.pagination.offset || 0,
            hasMore: data.pagination.hasMore || false,
            currentPage: data.pagination.currentPage || 1,
            totalPages: data.pagination.totalPages || 0,
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        toast.error(`Error al cargar categorías: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    },
    [getCategoriesQuery]
  );

  // Fetch single category by ID
  const fetchCategory = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const result = await getCategoryQuery({
          variables: { id },
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        const response = result.data?.category;

        if (!response?.success) {
          throw new Error(response?.message || 'Error al obtener categoría');
        }

        setCategory(response.data?.entity || null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        toast.error(`Error al cargar categoría: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    },
    [getCategoryQuery]
  );

  // Fetch category by slug
  const fetchCategoryBySlug = useCallback(
    async (slug: string) => {
      try {
        setLoading(true);
        setError(null);

        const result = await getCategoryBySlugQuery({
          variables: { slug },
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        const response = result.data?.categoryBySlug;

        if (!response?.success) {
          throw new Error(response?.message || 'Error al obtener categoría');
        }

        setCategory(response.data?.entity || null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        toast.error(`Error al cargar categoría: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    },
    [getCategoryBySlugQuery]
  );

  // Create category
  const createCategory = useCallback(
    async (
      input: CreateCategoryInput,
      currentFilters?: CategoryFilterInput,
      currentPagination?: PaginationInput
    ) => {
      try {
        setLoading(true);
        setError(null);

        const result = await createCategoryMutation({
          variables: { input },
          // Removed refetchQueries to avoid duplicate refetch
        });

        if (result.errors && result.errors.length > 0) {
          throw new Error(result.errors[0]?.message || 'Error desconocido');
        }

        const response = result.data?.createCategory;

        if (!response?.success) {
          throw new Error(response?.message || 'Error al crear categoría');
        }

        toast.success('Categoría creada exitosamente');

        // Refresh categories list preserving current filters and pagination
        await fetchCategories(currentFilters, currentPagination);

        return response.data?.entity;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        toast.error(`Error al crear categoría: ${errorMessage}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [createCategoryMutation, fetchCategories]
  );

  // Update category
  const updateCategory = useCallback(
    async (
      id: string,
      input: UpdateCategoryInput,
      currentFilters?: CategoryFilterInput,
      currentPagination?: PaginationInput
    ) => {
      try {
        setLoading(true);
        setError(null);

        const result = await updateCategoryMutation({
          variables: { id, input },
          // Removed refetchQueries to avoid duplicate refetch
        });

        if (result.errors && result.errors.length > 0) {
          throw new Error(result.errors[0]?.message || 'Error desconocido');
        }

        const response = result.data?.updateCategory;

        if (!response?.success) {
          throw new Error(response?.message || 'Error al actualizar categoría');
        }

        toast.success('Categoría actualizada exitosamente');

        // Refresh data preserving current filters and pagination
        await fetchCategories(currentFilters, currentPagination);
        if (category?.id === id) {
          await fetchCategory(id);
        }

        return response.data?.entity;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        toast.error(`Error al actualizar categoría: ${errorMessage}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateCategoryMutation, fetchCategories, fetchCategory, category]
  );

  // Delete category
  const deleteCategory = useCallback(
    async (
      id: string,
      currentFilters?: CategoryFilterInput,
      currentPagination?: PaginationInput
    ) => {
      try {
        setLoading(true);
        setError(null);

        const result = await deleteCategoryMutation({
          variables: { id },
          // Removed refetchQueries to avoid duplicate refetch
        });

        if (result.errors && result.errors.length > 0) {
          throw new Error(result.errors[0]?.message || 'Error desconocido');
        }

        const response = result.data?.deleteCategory;

        if (!response?.success) {
          throw new Error(response?.message || 'Error al eliminar categoría');
        }

        toast.success('Categoría eliminada exitosamente');

        // Refresh categories list preserving current filters and pagination
        await fetchCategories(currentFilters, currentPagination);

        // Clear current category if it was deleted
        if (category?.id === id) {
          setCategory(null);
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        toast.error(`Error al eliminar categoría: ${errorMessage}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [deleteCategoryMutation, fetchCategories, category]
  );

  // Refetch categories
  const refetchCategories = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  return {
    // Data
    categories,
    category,
    loading,
    error,

    // Pagination
    pagination,

    // Actions
    fetchCategories,
    fetchCategory,
    fetchCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,

    // Utilities
    refetchCategories,
    clearError,
  };
};
