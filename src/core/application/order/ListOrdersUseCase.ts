import type { OrderRepository } from '@/core/domain/order/OrderRepository';
import type { OrderFilter, OrderPage } from '@/core/domain/order/Order';
import type { Result } from '@/core/shared/Result';

export interface ListOrdersParams {
  filter?: OrderFilter;
  limit?: number;
  offset?: number;
}

export class ListOrdersUseCase {
  constructor(private readonly repository: OrderRepository) {}

  execute(params: ListOrdersParams = {}): Promise<Result<OrderPage>> {
    const { filter, limit = 20, offset = 0 } = params;
    return this.repository.findAll(filter, limit, offset);
  }
}
