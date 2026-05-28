export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  salePrice: number | null;
  images: string[];
  tags: string[];
  attributes: Record<string, unknown>;
  isActive: boolean;
  stockQuantity: number;
  categoryId: string | null;
  rating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const currentPrice = (product: Product): number =>
  product.salePrice !== null && product.salePrice < product.price
    ? product.salePrice
    : product.price;

export const hasDiscount = (product: Product): boolean =>
  product.salePrice !== null && product.salePrice < product.price;

export const discountPercentage = (product: Product): number => {
  if (!hasDiscount(product) || product.salePrice === null) return 0;
  return Math.round(
    ((product.price - product.salePrice) / product.price) * 100
  );
};

export const isInStock = (product: Product): boolean =>
  product.stockQuantity > 0;

export interface CreateProductInput {
  name: string;
  description?: string | null;
  sku: string;
  price: number;
  salePrice?: number | null;
  images?: string[];
  tags?: string[];
  attributes?: Record<string, unknown>;
  isActive?: boolean;
  stockQuantity?: number;
  categoryId?: string | null;
}

export interface UpdateProductInput {
  name?: string;
  description?: string | null;
  sku?: string;
  price?: number;
  salePrice?: number | null;
  images?: string[];
  tags?: string[];
  attributes?: Record<string, unknown>;
  isActive?: boolean;
  stockQuantity?: number;
  categoryId?: string | null;
}

export interface ProductFilter {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
}

export interface ProductPage {
  items: Product[];
  total: number;
  hasMore: boolean;
}
