import type { ZodIssue } from 'zod';
import type { ProductRepository } from '@/core/domain/product/ProductRepository';
import type {
  Product,
  CreateProductInput,
} from '@/core/domain/product/Product';
import type { Result } from '@/core/shared/Result';
import { err, ValidationError } from '@/core/shared/Result';
import { productSchema } from '@/core/shared/validation/productSchema';

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
