import type { CategoryRepository } from '@/core/domain/category/CategoryRepository';
import type {
  CategoryFilter,
  CategoryPage,
} from '@/core/domain/category/Category';
import type { Result } from '@/core/shared/Result';

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
