import type { ZodIssue } from 'zod';
import type { ProductRepository } from '@happy-baby/domain-product';
import type { Product, UpdateProductInput } from '@happy-baby/domain-product';
import type { Result } from '@happy-baby/domain-shared';
import { err, ValidationError } from '@happy-baby/domain-shared';
import { updateProductSchema } from '@happy-baby/domain-shared';

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
