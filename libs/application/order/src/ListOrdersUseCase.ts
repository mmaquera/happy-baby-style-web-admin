import type { OrderRepository } from '@happy-baby/domain-order';
import type { OrderFilter, OrderPage } from '@happy-baby/domain-order';
import type { Result } from '@happy-baby/domain-shared';

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
