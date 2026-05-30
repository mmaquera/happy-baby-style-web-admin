import { useCallback, useEffect, useState } from 'react';
import { useCategoriesGraphQL } from './useCategoriesGraphQL';
import { useCategoryFilters } from './useCategoryFilters';
import {
  type Category,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from '@/generated/graphql';
import { type CategoryFilters } from '@/components/categories/types';

export interface UseCategoriesReturn {
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

  // Filters and sorting
  filters: CategoryFilters;
  sortConfig: {
    field: string;
    direction: 'asc' | 'desc';
  };

  // Actions
  createCategory: (input: CreateCategoryInput) => Promise<Category | null>;
  updateCategory: (
    id: string,
    input: UpdateCategoryInput
  ) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  toggleStatus: (categoryId: string, isActive: boolean) => Promise<boolean>;
  bulkDelete: (categoryIds: string[]) => Promise<boolean>;
  bulkToggleStatus: (
    categoryIds: string[],
    isActive: boolean
  ) => Promise<boolean>;

  // Filter actions
  setFilters: (filters: CategoryFilters) => void;
  updateFilter: (
    key: keyof CategoryFilters,
    value: CategoryFilters[keyof CategoryFilters]
  ) => void;
  clearFilters: () => void;

  // Sorting actions
  handleSort: (field: string) => void;

  // Pagination actions
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  // Selection actions
  selectCategory: (categoryId: string) => void;
  deselectCategory: (categoryId: string) => void;
  selectAllCategories: (categoryIds: string[]) => void;
  clearSelection: () => void;
  isCategorySelected: (categoryId: string) => boolean;

  // Utilities
  refetchCategories: () => Promise<void>;
  clearError: () => void;
  resetToDefaults: () => void;
}

export const useCategories = (): UseCategoriesReturn => {
  // Core GraphQL operations
  const {
    categories,
    category,
    loading,
    error,
    pagination,
    fetchCategories,
    createCategory: createCategoryGraphQL,
    updateCategory: updateCategoryGraphQL,
    deleteCategory: deleteCategoryGraphQL,
    refetchCategories,
    clearError,
  } = useCategoriesGraphQL();

  // Selection state (local — not in domain layer)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const selectCategory = useCallback(
    (id: string) => setSelectedCategories(prev => [...new Set([...prev, id])]),
    []
  );
  const deselectCategory = useCallback(
    (id: string) => setSelectedCategories(prev => prev.filter(s => s !== id)),
    []
  );
  const selectAllCategories = useCallback(
    (ids: string[]) => setSelectedCategories(ids),
    []
  );
  const clearSelection = useCallback(() => setSelectedCategories([]), []);
  const isCategorySelected = useCallback(
    (id: string) => selectedCategories.includes(id),
    [selectedCategories]
  );

  // Filters and pagination
  const {
    filters,
    setFilters: setFiltersLocal,
    updateFilter: updateFilterLocal,
    clearFilters: clearFiltersLocal,
    sortConfig,
    handleSort: handleSortLocal,
    pagination: localPagination,
    goToPage,
    nextPage,
    prevPage,
    resetToDefaults,
    mapFiltersToGraphQL,
  } = useCategoryFilters(pagination.total);

  // Load categories on mount and when filters/pagination change
  useEffect(() => {
    const loadCategories = async () => {
      // Convert local filters to GraphQL format
      const graphqlFilters = mapFiltersToGraphQL(filters);
      await fetchCategories(graphqlFilters, localPagination);
    };

    loadCategories();
  }, [fetchCategories, filters, localPagination, mapFiltersToGraphQL]);

  // Wrapper for create category
  const createCategory = useCallback(
    async (input: CreateCategoryInput) => {
      try {
        // Convert local filters to GraphQL format
        const graphqlFilters = mapFiltersToGraphQL(filters);
        const result = await createCategoryGraphQL(
          input,
          graphqlFilters,
          localPagination
        );
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createCategoryGraphQL, mapFiltersToGraphQL, filters, localPagination]
  );

  // Wrapper for update category
  const updateCategory = useCallback(
    async (id: string, input: UpdateCategoryInput) => {
      try {
        // Convert local filters to GraphQL format
        const graphqlFilters = mapFiltersToGraphQL(filters);
        const result = await updateCategoryGraphQL(
          id,
          input,
          graphqlFilters,
          localPagination
        );
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateCategoryGraphQL, mapFiltersToGraphQL, filters, localPagination]
  );

  // Wrapper for delete category
  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        // Convert local filters to GraphQL format
        const graphqlFilters = mapFiltersToGraphQL(filters);
        const result = await deleteCategoryGraphQL(
          id,
          graphqlFilters,
          localPagination
        );
        return result;
      } catch (error) {
        throw error;
      }
    },
    [deleteCategoryGraphQL, mapFiltersToGraphQL, filters, localPagination]
  );

  // Wrapper for toggle status
  const toggleStatus = useCallback(
    async (categoryId: string, isActive: boolean) => {
      try {
        const graphqlFilters = mapFiltersToGraphQL(filters);
        const result = await updateCategoryGraphQL(
          categoryId,
          { isActive },
          graphqlFilters,
          localPagination
        );
        await fetchCategories(graphqlFilters, localPagination);
        return result !== null;
      } catch (error) {
        throw error;
      }
    },
    [
      updateCategoryGraphQL,
      fetchCategories,
      mapFiltersToGraphQL,
      filters,
      localPagination,
    ]
  );

  // Wrapper for bulk delete
  const bulkDelete = useCallback(
    async (categoryIds: string[]) => {
      try {
        const graphqlFilters = mapFiltersToGraphQL(filters);
        const results = await Promise.all(
          categoryIds.map(id =>
            deleteCategoryGraphQL(id, graphqlFilters, localPagination)
          )
        );
        await fetchCategories(graphqlFilters, localPagination);
        return results.every(Boolean);
      } catch (error) {
        throw error;
      }
    },
    [
      deleteCategoryGraphQL,
      fetchCategories,
      mapFiltersToGraphQL,
      filters,
      localPagination,
    ]
  );

  // Wrapper for bulk toggle status
  const bulkToggleStatus = useCallback(
    async (categoryIds: string[], isActive: boolean) => {
      try {
        const graphqlFilters = mapFiltersToGraphQL(filters);
        const results = await Promise.all(
          categoryIds.map(id =>
            updateCategoryGraphQL(
              id,
              { isActive },
              graphqlFilters,
              localPagination
            )
          )
        );
        await fetchCategories(graphqlFilters, localPagination);
        return results.every(r => r !== null);
      } catch (error) {
        throw error;
      }
    },
    [
      updateCategoryGraphQL,
      fetchCategories,
      mapFiltersToGraphQL,
      filters,
      localPagination,
    ]
  );

  // Wrapper for set filters
  const setFilters = useCallback(
    (newFilters: CategoryFilters) => {
      setFiltersLocal(newFilters);
    },
    [setFiltersLocal]
  );

  // Wrapper for update filter
  const updateFilter = useCallback(
    (
      key: keyof CategoryFilters,
      value: CategoryFilters[keyof CategoryFilters]
    ) => {
      updateFilterLocal(key, value);
    },
    [updateFilterLocal]
  );

  // Wrapper for clear filters
  const clearFilters = useCallback(() => {
    clearFiltersLocal();
  }, [clearFiltersLocal]);

  // Wrapper for handle sort
  const handleSort = useCallback(
    (field: string) => {
      handleSortLocal(field);
    },
    [handleSortLocal]
  );

  return {
    // Data
    categories,
    category,
    loading,
    error,

    // Pagination
    pagination,

    // Filters and sorting
    filters,
    sortConfig,

    // Actions
    createCategory,
    updateCategory,
    deleteCategory,
    toggleStatus,
    bulkDelete,
    bulkToggleStatus,

    // Filter actions
    setFilters,
    updateFilter,
    clearFilters,

    // Sorting actions
    handleSort,

    // Pagination actions
    goToPage,
    nextPage,
    prevPage,

    // Selection actions
    selectCategory,
    deselectCategory,
    selectAllCategories,
    clearSelection,
    isCategorySelected,

    // Utilities
    refetchCategories,
    clearError,
    resetToDefaults,
  };
};
