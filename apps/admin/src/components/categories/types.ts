export type { Category } from '@happy-baby/domain-category';

// Enhanced filter types following development standards
export interface CategoryFilterInput {
  isActive?: boolean | null;
  search?: string | null;
  hasImage?: boolean | null;
  hasDescription?: boolean | null;
  hasProducts?: boolean | null;
  minProducts?: number | null;
  maxProducts?: number | null;
  createdAfter?: string | null;
  createdBefore?: string | null;
  updatedAfter?: string | null;
  updatedBefore?: string | null;
  sortOrder?: number | null;
}

export interface CategorySortInput {
  field: 'name' | 'createdAt' | 'updatedAt' | 'sortOrder' | 'productsCount';
  direction: 'asc' | 'desc';
}

export interface CategoryFilters {
  isActive?: boolean;
  search?: string;
  hasImage?: boolean;
  hasDescription?: boolean;
  hasProducts?: boolean;
  minProducts?: number;
  maxProducts?: number;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  sortOrder?: number;
}
