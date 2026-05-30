import type { OrderRepository } from '@happy-baby/domain-order';
import type { Order } from '@happy-baby/domain-order';
import type { Result } from '@happy-baby/domain-shared';
import { err, ValidationError } from '@happy-baby/domain-shared';

export class CancelOrderUseCase {
  constructor(private readonly repository: OrderRepository) {}

  async execute(id: string): Promise<Result<Order>> {
    if (!id?.trim()) {
      return err(
        new ValidationError('ID de pedido requerido', { id: ['Requerido'] })
      );
    }
    return this.repository.cancel(id);
  }
}
