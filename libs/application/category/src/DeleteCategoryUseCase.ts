import type { CategoryRepository } from '@happy-baby/domain-category';
import type { Result } from '@happy-baby/domain-shared';
import { err, ValidationError } from '@happy-baby/domain-shared';

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
