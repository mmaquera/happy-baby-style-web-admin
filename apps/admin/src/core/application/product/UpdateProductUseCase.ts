import type { ZodIssue } from 'zod';
import type { ProductRepository } from '@/core/domain/product/ProductRepository';
import type {
  Product,
  UpdateProductInput,
} from '@/core/domain/product/Product';
import type { Result } from '@/core/shared/Result';
import { err, ValidationError } from '@/core/shared/Result';
import { updateProductSchema } from '@/core/shared/validation/productSchema';

export class UpdateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(
    id: string,
    input: UpdateProductInput
  ): Promise<Result<Product>> {
    if (!id?.trim()) {
      return err(
        new ValidationError('ID de producto requerido', { id: ['Requerido'] })
      );
    }
    const parsed = updateProductSchema.safeParse(input);
    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      parsed.error.issues.forEach((e: ZodIssue) => {
        const key = e.path.join('.');
        if (!fields[key]) fields[key] = [];
        fields[key].push(e.message);
      });
      return err(new ValidationError('Datos del producto inválidos', fields));
    }
    return this.repository.update(id, parsed.data as UpdateProductInput);
  }
}
