// Moved to @happy-baby/feature-products
export {
  ProductCard,
  ProductFilters,
  ProductGrid,
  ProductHeader,
  ProductListView,
  ProductDetailModal,
  ProductFormFields,
  ImageUpload,
  useProductActions,
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUploadProductImage,
  useProductSearch,
} from '@happy-baby/feature-products';
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
  ProductImportResult,
} from '@happy-baby/feature-products';

// Stays in admin (cross-feature: uses useCategories)
export { CreateProductModal } from './CreateProductModal';
export { EditProductModal } from './EditProductModal';
