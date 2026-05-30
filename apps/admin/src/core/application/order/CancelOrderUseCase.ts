import type { OrderRepository } from '@/core/domain/order/OrderRepository';
import type { Order } from '@/core/domain/order/Order';
import type { Result } from '@/core/shared/Result';
import { err, ValidationError } from '@/core/shared/Result';

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
