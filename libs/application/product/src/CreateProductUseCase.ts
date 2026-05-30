import type { ZodIssue } from 'zod';
import type { ProductRepository } from '@happy-baby/domain-product';
import type { Product, CreateProductInput } from '@happy-baby/domain-product';
import type { Result } from '@happy-baby/domain-shared';
import { err, ValidationError } from '@happy-baby/domain-shared';
import { productSchema } from '@happy-baby/domain-shared';

export class CreateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<Result<Product>> {
    const parsed = productSchema.safeParse(input);
    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      parsed.error.issues.forEach((e: ZodIssue) => {
        const key = e.path.join('.');
        if (!fields[key]) fields[key] = [];
        fields[key].push(e.message);
      });
      return err(new ValidationError('Datos del producto inválidos', fields));
    }
    return this.repository.create(parsed.data as CreateProductInput);
  }
}
