import type { ZodIssue } from 'zod';
import type { CategoryRepository } from '@/core/domain/category/CategoryRepository';
import type {
  Category,
  CreateCategoryInput,
} from '@/core/domain/category/Category';
import type { Result } from '@/core/shared/Result';
import { err, ValidationError } from '@/core/shared/Result';
import { categorySchema } from '@/core/shared/validation/categorySchema';

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
