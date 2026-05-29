import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useApolloClient } from '@apollo/client';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ApolloOrderRepository } from '@/infrastructure/graphql/repositories/ApolloOrderRepository';
import { ListOrdersUseCase } from '@/core/application/order/ListOrdersUseCase';
import { GetOrderUseCase } from '@/core/application/order/GetOrderUseCase';
import { UpdateOrderStatusUseCase } from '@/core/application/order/UpdateOrderStatusUseCase';
import { CancelOrderUseCase } from '@/core/application/order/CancelOrderUseCase';

export interface OrderUseCases {
  list: ListOrdersUseCase;
  get: GetOrderUseCase;
  updateStatus: UpdateOrderStatusUseCase;
  cancel: CancelOrderUseCase;
}

const OrderContext = createContext<OrderUseCases | null>(null);

function buildOrderUseCases(
  client: ApolloClient<NormalizedCacheObject>
): OrderUseCases {
  const repository = new ApolloOrderRepository(client);
  return {
    list: new ListOrdersUseCase(repository),
    get: new GetOrderUseCase(repository),
    updateStatus: new UpdateOrderStatusUseCase(repository),
    cancel: new CancelOrderUseCase(repository),
  };
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const useCases = useMemo(() => buildOrderUseCases(client), [client]);
  return (
    <OrderContext.Provider value={useCases}>{children}</OrderContext.Provider>
  );
}

export function useOrderUseCases(): OrderUseCases {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error('useOrderUseCases must be used within <OrderProvider>');
  }
  return ctx;
}
