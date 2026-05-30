import type { OrderRepository } from '@happy-baby/domain-order';
import type { Order, OrderStatus } from '@happy-baby/domain-order';
import type { Result } from '@happy-baby/domain-shared';
import { err, ValidationError } from '@happy-baby/domain-shared';

export class UpdateOrderStatusUseCase {
  constructor(private readonly repository: OrderRepository) {}

  async execute(id: string, status: OrderStatus): Promise<Result<Order>> {
    if (!id?.trim()) {
      return err(
        new ValidationError('ID de pedido requerido', { id: ['Requerido'] })
      );
    }
    if (!status) {
      return err(
        new ValidationError('Estado de pedido requerido', {
          status: ['Requerido'],
        })
      );
    }
    return this.repository.updateStatus(id, status);
  }
}
