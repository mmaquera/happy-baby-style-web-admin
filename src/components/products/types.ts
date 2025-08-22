// =====================================================
// PRODUCT TYPES - Aligned with GraphQL Schema
// =====================================================
// Following Clean Architecture principles and TypeScript best practices

// Base Product interface matching GraphQL schema
export interface Product {
  id: string;
  categoryId?: string | null;
  name: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  sku: string;
  images: string[];
  attributes: Record<string, any>;
  isActive: boolean;
  stockQuantity: number;
  tags: string[];
  rating?: number | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  // Computed fields from GraphQL
  currentPrice: number;
  hasDiscount: boolean;
  discountPercentage: number;
  totalStock: number;
  isInStock: boolean;
  // Relations
  category?: Category | null;
  variants: ProductVariant[];
  cartItems: any[];
  favorites: any[];
  orderItems: any[];
  reviews: any[];
  appEvents: any[];
  inventoryTransactions: any[];
  stockAlerts: any[];
}

// Product Variant interface
export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  sku: string;
  stockQuantity: number;
  attributes: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isInStock: boolean;
  product: Product;
}

// Category interface
export interface Category {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  image?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}

// Tag types for enhanced tag management
export interface TagMetadata {
  color: string;
  description: string;
  category: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface TagWithMetadata {
  [tagName: string]: TagMetadata;
}

// Enhanced Product interface with tag metadata
export interface ProductWithTagMetadata extends Product {
  attributes: {
    tags?: TagWithMetadata;
    [key: string]: any;
  };
}

// Input types for mutations
export interface CreateProductInput {
  categoryId?: string | null;
  name: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  sku: string;
  images?: string[] | null;
  attributes?: Record<string, any> | null;
  isActive?: boolean | null;
  stockQuantity?: number | null;
  tags?: string[] | null;
}

export interface UpdateProductInput {
  categoryId?: string | null;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  salePrice?: number | null;
  sku?: string | null;
  images?: string[] | null;
  attributes?: Record<string, any> | null;
  isActive?: boolean | null;
  stockQuantity?: number | null;
  tags?: string[] | null;
}

// Tag metadata types
export interface TagMetadata {
  color: string;
  description: string;
  category: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface AvailableTag {
  name: string;
  metadata: TagMetadata;
}

// Form data types for UI components
export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  salePrice: string;
  sku: string;
  categoryId: string;
  stockQuantity: string;
  tags: string[];
  isActive: boolean;
  images: string[];
  attributes: {
    tags?: Record<string, TagMetadata>;
    [key: string]: any;
  };
}

// Filter and search types
export interface ProductFilterInput {
  categoryId?: string | null;
  isActive?: boolean | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  inStock?: boolean | null;
  search?: string | null;
  tags?: string[] | null;
  rating?: number | null;
}

export interface ProductSortInput {
  field: 'name' | 'price' | 'createdAt' | 'stockQuantity' | 'rating' | 'reviewCount';
  direction: 'asc' | 'desc';
}

// Pagination types
export interface PaginationInput {
  limit?: number | null;
  offset?: number | null;
}

export interface ProductPaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

// Response types
export interface GetProductsData {
  items: Product[];
  pagination: ProductPaginationInfo;
}

export interface GetProductsResponse {
  success: boolean;
  message: string;
  code: string;
  timestamp: string;
  data: GetProductsData;
  metadata: any;
}

// UI State types
export interface ProductViewMode {
  type: 'grid' | 'list' | 'table';
  columns?: number;
}

export interface ProductSelectionState {
  selectedIds: string[];
  isAllSelected: boolean;
  hasSelection: boolean;
}

// Validation types
export interface ProductValidationErrors {
  name?: string;
  description?: string;
  price?: string;
  salePrice?: string;
  sku?: string;
  categoryId?: string;
  stockQuantity?: string;
  images?: string;
  attributes?: string;
}

// Bulk operation types
export interface BulkProductOperation {
  ids: string[];
  operation: 'activate' | 'deactivate' | 'delete' | 'updateCategory' | 'updateStock';
  data?: Record<string, any>;
}

// Export/Import types
export interface ProductExportOptions {
  format: 'csv' | 'excel' | 'json';
  fields: string[];
  filters?: ProductFilterInput;
}

export interface ProductImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; field: string; message: string }>;
}
