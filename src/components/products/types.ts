export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  sku: string;
  categoryId: string;
  stockQuantity: number;
  tags: string[];
  isActive: boolean;
  images: string[];
  attributes: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  sku: string;
  categoryId: string;
  stockQuantity: number;
  tags: string[];
  isActive: boolean;
  images: string[];
  attributes: Record<string, string>;
}

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
  attributes: Record<string, string>;
}

export interface ProductFilterInput {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
}

export interface ProductSortInput {
  field: 'name' | 'price' | 'createdAt' | 'stockQuantity';
  direction: 'asc' | 'desc';
}
