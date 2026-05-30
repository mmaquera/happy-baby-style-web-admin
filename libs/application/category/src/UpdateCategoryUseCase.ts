import type { ZodIssue } from 'zod';
import type { CategoryRepository } from '@happy-baby/domain-category';
import type {
  Category,
  UpdateCategoryInput,
} from '@happy-baby/domain-category';
import type { Result } from '@happy-baby/domain-shared';
import { err, ValidationError } from '@happy-baby/domain-shared';
import { updateCategorySchema } from '@happy-baby/domain-shared';

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
