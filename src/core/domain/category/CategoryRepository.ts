import type { Result } from '@/core/shared/Result';
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryFilter,
  CategoryPage,
} from './Category';

export interface CategoryRepository {
  findById(id: string): Promise<Result<Category>>;
  findAll(
    filter?: CategoryFilter,
    limit?: number,
    offset?: number
  ): Promise<Result<CategoryPage>>;
  create(input: CreateCategoryInput): Promise<Result<Category>>;
  update(id: string, input: UpdateCategoryInput): Promise<Result<Category>>;
  delete(id: string): Promise<Result<boolean>>;
}
