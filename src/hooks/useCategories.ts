import { useCallback, useEffect } from 'react';
import { useCategoriesGraphQL } from './useCategoriesGraphQL';
import { useCategoryActions } from './useCategoryActions';
import { useCategoryFilters } from './useCategoryFilters';
import { CategoryFilterInput, PaginationInput } from '@/generated/graphql';

export interface UseCategoriesReturn {
  // Data
  categories: any[];
  category: any | null;
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
  filters: {
    isActive?: boolean;
    search?: string;
  };
  sortConfig: {
    field: string;
    direction: 'asc' | 'desc';
  };
  
  // Actions
  createCategory: (input: any) => Promise<any>;
  updateCategory: (id: string, input: any) => Promise<any>;
  deleteCategory: (id: string) => Promise<boolean>;
  toggleStatus: (categoryId: string, isActive: boolean) => Promise<boolean>;
  bulkDelete: (categoryIds: string[]) => Promise<boolean>;
  bulkToggleStatus: (categoryIds: string[], isActive: boolean) => Promise<boolean>;
  
  // Filter actions
  setFilters: (filters: CategoryFilterInput) => void;
  updateFilter: (key: string, value: any) => void;
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
  // Helper function to map GraphQL filters to local filters
  const mapGraphQLFiltersToLocal = useCallback((graphqlFilters: CategoryFilterInput) => {
    const localFilters: any = {};
    
    // Only add properties that are not null or undefined
    if (graphqlFilters.isActive !== null && graphqlFilters.isActive !== undefined) {
      localFilters.isActive = graphqlFilters.isActive;
    }
    
    if (graphqlFilters.search !== null && graphqlFilters.search !== undefined) {
      localFilters.search = graphqlFilters.search;
    }
    
    return localFilters;
  }, []);

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
    clearError
  } = useCategoriesGraphQL();

  // Actions
  const {
    handleDeleteCategory,
    handleToggleStatus,
    handleBulkDelete,
    handleBulkToggleStatus,
    selectedCategories,
    selectCategory,
    deselectCategory,
    selectAllCategories,
    clearSelection,
    isCategorySelected
  } = useCategoryActions();

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
    resetToDefaults
  } = useCategoryFilters(pagination.total);

  // Load categories on mount and when filters/pagination change
  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories(filters, localPagination);
    };
    
    loadCategories();
  }, [fetchCategories, filters, localPagination]);

  // Wrapper for create category
  const createCategory = useCallback(async (input: any) => {
    try {
      const result = await createCategoryGraphQL(input);
      await refetchCategories();
      return result;
    } catch (error) {
      throw error;
    }
  }, [createCategoryGraphQL, refetchCategories]);

  // Wrapper for update category
  const updateCategory = useCallback(async (id: string, input: any) => {
    try {
      const result = await updateCategoryGraphQL(id, input);
      await refetchCategories();
      return result;
    } catch (error) {
      throw error;
    }
  }, [updateCategoryGraphQL, refetchCategories]);

  // Wrapper for delete category
  const deleteCategory = useCallback(async (id: string) => {
    try {
      const result = await handleDeleteCategory(id);
      await refetchCategories();
      return result;
    } catch (error) {
      throw error;
    }
  }, [handleDeleteCategory, refetchCategories]);

  // Wrapper for toggle status
  const toggleStatus = useCallback(async (categoryId: string, isActive: boolean) => {
    try {
      const result = await handleToggleStatus(categoryId, isActive);
      await refetchCategories();
      return result;
    } catch (error) {
      throw error;
    }
  }, [handleToggleStatus, refetchCategories]);

  // Wrapper for bulk delete
  const bulkDelete = useCallback(async (categoryIds: string[]) => {
    try {
      const result = await handleBulkDelete(categoryIds);
      await refetchCategories();
      return result;
    } catch (error) {
      throw error;
    }
  }, [handleBulkDelete, refetchCategories]);

  // Wrapper for bulk toggle status
  const bulkToggleStatus = useCallback(async (categoryIds: string[], isActive: boolean) => {
    try {
      const result = await handleBulkToggleStatus(categoryIds, isActive);
      await refetchCategories();
      return result;
    } catch (error) {
      throw error;
    }
  }, [handleBulkToggleStatus, refetchCategories]);

  // Wrapper for set filters
  const setFilters = useCallback((newFilters: CategoryFilterInput) => {
    const localFilters = mapGraphQLFiltersToLocal(newFilters);
    setFiltersLocal(localFilters);
  }, [setFiltersLocal, mapGraphQLFiltersToLocal]);

  // Wrapper for update filter
  const updateFilter = useCallback((key: string, value: any) => {
    updateFilterLocal(key as any, value);
  }, [updateFilterLocal]);

  // Wrapper for clear filters
  const clearFilters = useCallback(() => {
    clearFiltersLocal();
  }, [clearFiltersLocal]);

  // Wrapper for handle sort
  const handleSort = useCallback((field: string) => {
    handleSortLocal(field);
  }, [handleSortLocal]);

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
    resetToDefaults
  };
};
