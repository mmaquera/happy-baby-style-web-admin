import type { Result } from '@/core/shared/Result';
import type {
  Order,
  OrderFilter,
  OrderPage,
  OrderStatus,
} from './Order';

export interface OrderRepository {
  findAll(
    filter?: OrderFilter,
    limit?: number,
    offset?: number
  ): Promise<Result<OrderPage>>;
  findById(id: string): Promise<Result<Order>>;
  updateStatus(id: string, status: OrderStatus): Promise<Result<Order>>;
  cancel(id: string): Promise<Result<Order>>;
}
