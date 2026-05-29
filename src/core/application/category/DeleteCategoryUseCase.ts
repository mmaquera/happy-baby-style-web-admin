import type { CategoryRepository } from '@/core/domain/category/CategoryRepository';
import type { Result } from '@/core/shared/Result';
import { err, ValidationError } from '@/core/shared/Result';

export class DeleteCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(id: string): Promise<Result<boolean>> {
    if (!id?.trim()) {
      return err(
        new ValidationError('ID de categoría requerido', { id: ['Requerido'] })
      );
    }
    return this.repository.delete(id);
  }
}
