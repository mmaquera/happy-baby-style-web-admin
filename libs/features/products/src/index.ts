// DI / Context
export { ProductProvider, useProductUseCases, ProductContext } from './di';
export type { ProductUseCases } from './di';

// Components
export { ProductCard } from './components/ProductCard';
export { ProductFilters } from './components/ProductFilters';
export { ProductGrid } from './components/ProductGrid';
export { ProductHeader } from './components/ProductHeader';
export { ProductListView } from './components/ProductListView';
export { ProductDetailModal } from './components/ProductDetailModal';
export { CreateProductModal } from './components/CreateProductModal';
export { EditProductModal } from './components/EditProductModal';
export { ProductFormFields } from './components/ProductFormFields';
export { ImageUpload } from './components/ImageUpload';

// Hooks
export { useProductActions } from './hooks/useProductActions';
export { useProductForm } from './hooks/useProductForm';
export { useTags } from './hooks/useTags';
export { useImageUpload } from './hooks/useImageUpload';
export { useUploadNotifications } from './hooks/useUploadNotifications';
export {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUploadProductImage,
  useProductSearch,
} from './hooks/useProductsGraphQL';

// Form/Modal style primitives (for CreateProductModal / EditProductModal in admin)
export {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  ErrorMessage,
  SuccessMessage,
  LoadingOverlay,
  LoadingSpinner,
} from './components/ProductFormStyles';

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
  ProductImportResult,
  TagMetadata,
  TagWithMetadata,
  ProductWithTagMetadata,
  AvailableTag,
  ProductReview,
  InventoryTransaction,
  StockAlert,
  AppEvent,
} from './types/product';

export type {
  ImageUploadFormData,
  UploadProgress,
  UploadResult,
  ImageUploadProps,
  UseImageUploadReturn,
  UseUploadNotificationsReturn,
} from './types/upload';
