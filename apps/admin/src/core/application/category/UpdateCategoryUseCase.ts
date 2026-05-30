import type { ZodIssue } from 'zod';
import type { CategoryRepository } from '@/core/domain/category/CategoryRepository';
import type {
  Category,
  UpdateCategoryInput,
} from '@/core/domain/category/Category';
import type { Result } from '@/core/shared/Result';
import { err, ValidationError } from '@/core/shared/Result';
import { updateCategorySchema } from '@/core/shared/validation/categorySchema';

export class UpdateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(
    id: string,
    input: UpdateCategoryInput
  ): Promise<Result<Category>> {
    if (!id?.trim()) {
      return err(
        new ValidationError('ID de categoría requerido', { id: ['Requerido'] })
      );
    }
    const parsed = updateCategorySchema.safeParse(input);
    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      parsed.error.issues.forEach((e: ZodIssue) => {
        const key = e.path.join('.');
        if (!fields[key]) fields[key] = [];
        fields[key].push(e.message);
      });
      return err(new ValidationError('Datos de categoría inválidos', fields));
    }
    return this.repository.update(id, parsed.data as UpdateCategoryInput);
  }
}
