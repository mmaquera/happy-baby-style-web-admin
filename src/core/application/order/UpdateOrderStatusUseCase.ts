import type { OrderRepository } from '@/core/domain/order/OrderRepository';
import type { Order, OrderStatus } from '@/core/domain/order/Order';
import type { Result } from '@/core/shared/Result';
import { err, ValidationError } from '@/core/shared/Result';

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
