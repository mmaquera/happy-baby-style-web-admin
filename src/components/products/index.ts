// Export all product components
export { ProductCard } from './ProductCard';
export { ProductFilters } from './ProductFilters';
export { ProductGrid } from './ProductGrid';
export { ProductHeader } from './ProductHeader';
export { CreateProductModal } from './CreateProductModal';
export { ProductListView } from './ProductListView';

// Export types from the centralized types file
export type { 
  Product, 
  Category, 
  CreateProductInput, 
  ProductFormData, 
  ProductFilterInput, 
  ProductSortInput 
} from './types';
