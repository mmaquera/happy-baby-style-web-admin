import { ProductEntity } from '@domain/entities/Product';
import { IProductRepository, ProductFilters } from '@domain/repositories/IProductRepository';

export interface GetProductsRequest {
  category?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export class GetProductsUseCase {
  constructor(
    private readonly productRepository: IProductRepository
  ) {}

  async execute(request: GetProductsRequest = {}): Promise<ProductEntity[]> {
    const filters: ProductFilters = {
      categoryId: request.category,
      isActive: request.isActive,
      minPrice: request.minPrice,
      maxPrice: request.maxPrice,
      inStock: request.inStock,
      search: request.search?.trim(),
      limit: request.limit || 50,
      offset: request.offset || 0
    };

    return await this.productRepository.findAll(filters);
  }
}