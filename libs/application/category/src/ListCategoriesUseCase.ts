import type { CategoryRepository } from '@happy-baby/domain-category';
import type { CategoryFilter, CategoryPage } from '@happy-baby/domain-category';
import type { Result } from '@happy-baby/domain-shared';

export interface ListCategoriesParams {
  filter?: CategoryFilter;
  limit?: number;
  offset?: number;
}

export class ListCategoriesUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  execute(params: ListCategoriesParams = {}): Promise<Result<CategoryPage>> {
    const { filter, limit = 20, offset = 0 } = params;
    return this.repository.findAll(filter, limit, offset);
  }
}
