import type { Result } from '@/core/shared/Result';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilter,
  ProductPage,
} from './Product';

export interface ProductRepository {
  findById(id: string): Promise<Result<Product>>;
  findAll(
    filter?: ProductFilter,
    limit?: number,
    offset?: number
  ): Promise<Result<ProductPage>>;
  create(input: CreateProductInput): Promise<Result<Product>>;
  update(id: string, input: UpdateProductInput): Promise<Result<Product>>;
  delete(id: string): Promise<Result<boolean>>;
  uploadImage(file: File, productId: string): Promise<Result<string>>;
}
