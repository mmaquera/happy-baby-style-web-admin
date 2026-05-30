import type { ZodIssue } from 'zod';
import type { CategoryRepository } from '@happy-baby/domain-category';
import type {
  Category,
  CreateCategoryInput,
} from '@happy-baby/domain-category';
import type { Result } from '@happy-baby/domain-shared';
import { err, ValidationError } from '@happy-baby/domain-shared';
import { categorySchema } from '@happy-baby/domain-shared';

export class CreateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<Result<Category>> {
    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      parsed.error.issues.forEach((e: ZodIssue) => {
        const key = e.path.join('.');
        if (!fields[key]) fields[key] = [];
        fields[key].push(e.message);
      });
      return err(new ValidationError('Datos de categoría inválidos', fields));
    }
    return this.repository.create(parsed.data as CreateCategoryInput);
  }
}
