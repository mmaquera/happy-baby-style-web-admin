// =====================================================
// PRODUCTS MODULE EXPORTS
// =====================================================
// Following Clean Architecture principles and module organization

// Core Components
export { ProductCard } from './ProductCard';
export { ProductFilters } from './ProductFilters';
export { ProductGrid } from './ProductGrid';
export { ProductHeader } from './ProductHeader';
export { ProductListView } from './ProductListView';

// Modal Components
export { CreateProductModal } from './CreateProductModal';
export { EditProductModal } from './EditProductModal';
export { ProductDetailModal } from './ProductDetailModal';

// Types
export type {
  Product,
  ProductVariant,
  Category,
  CreateProductInput,
  UpdateProductInput,
  ProductFormData,
  ProductFilterInput,
  ProductSortInput,
  PaginationInput,
  ProductPaginationInfo,
  GetProductsData,
  GetProductsResponse,
  ProductViewMode,
  ProductSelectionState,
  ProductValidationErrors,
  BulkProductOperation,
  ProductExportOptions,
  ProductImportResult
} from './types';

// Hooks
export { useProductActions } from '@/hooks/useProductActions';
export { useProducts, useProduct, useCreateProduct, useUpdateProduct, useDeleteProduct, useUploadProductImage, useProductSearch } from '@/hooks/useProductsGraphQL';
