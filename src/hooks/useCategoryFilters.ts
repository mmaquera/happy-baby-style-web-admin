import { useCallback, useState, useMemo } from 'react';
import { CategoryFilterInput, PaginationInput } from '@/generated/graphql';

// Local types for internal state management
export interface LocalPaginationInput {
  limit: number;
  offset: number;
}

export interface CategoryFilters {
  isActive?: boolean;
  search?: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface UseCategoryFiltersReturn {
  // Filters
  filters: CategoryFilters;
  setFilters: (filters: CategoryFilters) => void;
  updateFilter: (key: keyof CategoryFilters, value: any) => void;
  clearFilters: () => void;
  
  // Sorting
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  handleSort: (field: string) => void;
  
  // Pagination
  pagination: LocalPaginationInput;
  setPagination: (pagination: LocalPaginationInput) => void;
  setPaginationFromGraphQL: (pagination: PaginationInput) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  
  // Computed values
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  
  // Utilities
  resetToDefaults: () => void;
  getFilteredAndSortedCategories: (categories: any[]) => any[];
}

const DEFAULT_FILTERS: CategoryFilters = {
  search: ''
};

const DEFAULT_SORT: SortConfig = {
  field: 'sortOrder',
  direction: 'asc'
};

const DEFAULT_PAGINATION: LocalPaginationInput = {
  limit: 10,
  offset: 0
};

export const useCategoryFilters = (totalItems: number = 0) => {
  // Helper function to map GraphQL pagination to local pagination
  const mapGraphQLPaginationToLocal = useCallback((graphqlPagination: PaginationInput): LocalPaginationInput => {
    return {
      limit: graphqlPagination.limit ?? 10,
      offset: graphqlPagination.offset ?? 0,
    };
  }, []);

  // Filters state
  const [filters, setFilters] = useState<CategoryFilters>(DEFAULT_FILTERS);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>(DEFAULT_SORT);
  
  // Pagination state
  const [pagination, setPagination] = useState<LocalPaginationInput>(DEFAULT_PAGINATION);

  // Set pagination from GraphQL input
  const setPaginationFromGraphQL = useCallback((graphqlPagination: PaginationInput) => {
    const localPagination = mapGraphQLPaginationToLocal(graphqlPagination);
    setPagination(localPagination);
  }, [mapGraphQLPaginationToLocal]);

  // Update specific filter
  const updateFilter = useCallback((key: keyof CategoryFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, offset: 0 }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPagination(prev => ({ ...prev, offset: 0 }));
  }, []);

  // Handle sorting
  const handleSort = useCallback((field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Pagination helpers
  const currentPage = useMemo(() => {
    return Math.floor(pagination.offset / pagination.limit) + 1;
  }, [pagination.offset, pagination.limit]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pagination.limit);
  }, [totalItems, pagination.limit]);

  const hasNextPage = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const hasPrevPage = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  // Go to specific page
  const goToPage = useCallback((page: number) => {
    const newOffset = (page - 1) * pagination.limit;
    setPagination(prev => ({ ...prev, offset: newOffset }));
  }, [pagination.limit]);

  // Next page
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  }, [hasNextPage, currentPage, goToPage]);

  // Previous page
  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      goToPage(currentPage - 1);
    }
  }, [hasPrevPage, currentPage, goToPage]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSortConfig(DEFAULT_SORT);
    setPagination(DEFAULT_PAGINATION);
  }, []);

  // Filter and sort categories (for client-side operations)
  const getFilteredAndSortedCategories = useCallback((categories: any[]) => {
    let filtered = [...categories];

    // Apply filters
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(cat => cat.isActive === filters.isActive);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(cat => 
        cat.name.toLowerCase().includes(searchLower) ||
        (cat.description && cat.description.toLowerCase().includes(searchLower)) ||
        cat.slug.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [filters, sortConfig]);

  return {
    // Filters
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    
    // Sorting
    sortConfig,
    setSortConfig,
    handleSort,
    
    // Pagination
    pagination,
    setPagination,
    setPaginationFromGraphQL,
    goToPage,
    nextPage,
    prevPage,
    
    // Computed values
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    
    // Utilities
    resetToDefaults,
    getFilteredAndSortedCategories
  };
};
