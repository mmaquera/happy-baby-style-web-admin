import { IOrderRepository, OrderFilters } from '@domain/repositories/IOrderRepository';
import { Order } from '@domain/entities/Order';

export class GetOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(filters?: OrderFilters): Promise<Order[]> {
    try {
      return await this.orderRepository.findAll(filters);
    } catch (error) {
      throw new Error(`Failed to get orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 