import type { ProductRepository } from '@/core/domain/product/ProductRepository';
import type { Result } from '@/core/shared/Result';
import { err, ValidationError } from '@/core/shared/Result';

export class DeleteProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: string): Promise<Result<boolean>> {
    if (!id?.trim()) {
      return err(
        new ValidationError('ID de producto requerido', { id: ['Requerido'] })
      );
    }
    return this.repository.delete(id);
  }
}
