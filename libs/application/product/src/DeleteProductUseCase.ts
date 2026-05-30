import type { ProductRepository } from '@happy-baby/domain-product';
import type { Result } from '@happy-baby/domain-shared';
import { err, ValidationError } from '@happy-baby/domain-shared';

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
