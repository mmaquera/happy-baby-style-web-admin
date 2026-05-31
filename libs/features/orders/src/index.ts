// DI / Context
export { OrderProvider, useOrderUseCases, OrderContext } from './di';
export type { OrderUseCases } from './di';

// Components
export { OrderCard } from './components/OrderCard';
export { OrderDetailModal } from './components/OrderDetailModal';
export { OrderFilters } from './components/OrderFilters';
export { OrderStatusBadge, STATUS_CONFIG } from './components/OrderStatusBadge';

// Hooks
export { useOrderActions } from './hooks/useOrderActions';
export {
  useOrders,
  useOrder,
  useCreateOrder,
  useUpdateOrder,
  useUpdateOrderStatus,
  useCancelOrder,
  useShipOrder,
  useDeliverOrder,
  useOrderStats,
  useOrdersByStatus,
  useRecentOrders,
} from './hooks/useOrdersGraphQL';

// Types (re-exported from domain for convenience)
export type {
  Order,
  OrderStatus,
  OrderAddress,
  OrderItem,
  OrderCustomer,
  OrderFilter,
  OrderPage,
} from '@happy-baby/domain-order';

// GraphQL input types
export type {
  OrderFilterInput,
  CreateOrderInput,
  UpdateOrderInput,
} from '@happy-baby/infrastructure-graphql';
