import type { ProductRepository } from '@happy-baby/domain-product';
import type { ProductFilter, ProductPage } from '@happy-baby/domain-product';
import type { Result } from '@happy-baby/domain-shared';

export interface ListProductsParams {
  filter?: ProductFilter;
  limit?: number;
  offset?: number;
}

export class ListProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(params: ListProductsParams = {}): Promise<Result<ProductPage>> {
    const { filter, limit = 20, offset = 0 } = params;
    return this.repository.findAll(filter, limit, offset);
  }
}
