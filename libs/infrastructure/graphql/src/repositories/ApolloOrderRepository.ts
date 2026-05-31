import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import type { OrderRepository } from '@happy-baby/domain-order';
import type {
  Order,
  OrderFilter,
  OrderPage,
  OrderStatus,
} from '@happy-baby/domain-order';
import type { Result } from '@happy-baby/domain-shared';
import { ok, err } from '@happy-baby/domain-shared';
import { orderMapper } from '../mappers/orderMapper';
import { OrderStatus as GQLOrderStatus } from '../generated/graphql';
import {
  GetOrdersDocument,
  GetOrderDocument,
  UpdateOrderStatusDocument,
  CancelOrderDocument,
  type GetOrdersQuery,
  type GetOrdersQueryVariables,
  type GetOrderQuery,
  type GetOrderQueryVariables,
  type UpdateOrderStatusMutation,
  type UpdateOrderStatusMutationVariables,
  type CancelOrderMutation,
  type CancelOrderMutationVariables,
} from '../generated/graphql';

const domainStatusToGQL: Record<OrderStatus, GQLOrderStatus> = {
  pending: GQLOrderStatus.pending,
  confirmed: GQLOrderStatus.confirmed,
  processing: GQLOrderStatus.processing,
  shipped: GQLOrderStatus.shipped,
  delivered: GQLOrderStatus.delivered,
  cancelled: GQLOrderStatus.cancelled,
  refunded: GQLOrderStatus.refunded,
};

export class ApolloOrderRepository implements OrderRepository {
  constructor(private readonly client: ApolloClient<NormalizedCacheObject>) {}

  async findAll(
    filter?: OrderFilter,
    limit = 20,
    offset = 0
  ): Promise<Result<OrderPage>> {
    try {
      const variables: GetOrdersQueryVariables = {
        filter: filter?.status
          ? { status: domainStatusToGQL[filter.status] }
          : null,
        pagination: { limit, offset },
      };

      const { data } = await this.client.query<
        GetOrdersQuery,
        GetOrdersQueryVariables
      >({
        query: GetOrdersDocument,
        variables,
        fetchPolicy: 'network-only',
      });

      return ok({
        items: (data.orders.orders ?? []).map(o => orderMapper.toDomain(o)),
        total: data.orders.total,
        hasMore: data.orders.hasMore,
      });
    } catch (e) {
      return err(new Error('Error al listar órdenes'));
    }
  }

  async findById(id: string): Promise<Result<Order>> {
    try {
      const { data } = await this.client.query<
        GetOrderQuery,
        GetOrderQueryVariables
      >({
        query: GetOrderDocument,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      if (!data.order) {
        return err(new Error('Orden no encontrada'));
      }

      return ok(orderMapper.toDomain(data.order));
    } catch (e) {
      return err(new Error('Error al obtener orden'));
    }
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Result<Order>> {
    try {
      const { data } = await this.client.mutate<
        UpdateOrderStatusMutation,
        UpdateOrderStatusMutationVariables
      >({
        mutation: UpdateOrderStatusDocument,
        variables: { id, status: domainStatusToGQL[status] },
      });

      if (!data?.updateOrderStatus) {
        return err(new Error('Error al actualizar estado'));
      }

      // Mutation returns partial order — re-fetch full entity
      return this.findById(id);
    } catch (e) {
      return err(new Error('Error al actualizar estado de la orden'));
    }
  }

  async cancel(id: string): Promise<Result<Order>> {
    try {
      const { data } = await this.client.mutate<
        CancelOrderMutation,
        CancelOrderMutationVariables
      >({
        mutation: CancelOrderDocument,
        variables: { id },
      });

      if (!data?.cancelOrder) {
        return err(new Error('Error al cancelar orden'));
      }

      return this.findById(id);
    } catch (e) {
      return err(new Error('Error al cancelar la orden'));
    }
  }
}
