import { 
  useGetOrdersQuery, 
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useShipOrderMutation,
  useDeliverOrderMutation,
  useGetOrderStatsQuery,
  GetOrdersDocument,
  OrderFilterInput,
  CreateOrderInput,
  UpdateOrderInput,
  OrderStatus,
  PaginationInput
} from '../generated/graphql';
import toast from 'react-hot-toast';

// Helper functions to map TypeScript types to GraphQL types
const mapToGraphQLFilter = (filter: OrderFilterInput | undefined): OrderFilterInput | null => {
  return filter || null;
};

const mapToGraphQLPagination = (limit: number, offset: number = 0): PaginationInput => {
  return { limit, offset };
};

const mapToGraphQLString = (value: string | undefined): string | null => {
  return value || null;
};

interface UseOrdersOptions {
  filter?: OrderFilterInput;
  limit?: number;
  skip?: boolean;
}

export const useOrders = (options: UseOrdersOptions = {}) => {
  const { filter, limit = 20, skip = false } = options;
  
  const { data, loading, error, fetchMore, refetch } = useGetOrdersQuery({
    variables: {
      filter: mapToGraphQLFilter(filter),
      pagination: mapToGraphQLPagination(limit, 0)
    },
    skip,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all'
  });

  const loadMore = () => {
    if (!data?.orders.hasMore) return;
    
    return fetchMore({
      variables: {
        pagination: {
          limit,
          offset: data.orders.orders.length
        }
      }
    });
  };

  return {
    orders: data?.orders.orders || [],
    total: data?.orders.total || 0,
    hasMore: data?.orders.hasMore || false,
    loading,
    error,
    loadMore,
    refetch
  };
};

export const useOrder = (id: string, skip = false) => {
  const { data, loading, error, refetch } = useGetOrderQuery({
    variables: { id },
    skip: skip || !id,
    errorPolicy: 'all'
  });

  return {
    order: data?.order,
    loading,
    error,
    refetch
  };
};

export const useCreateOrder = () => {
  const [createOrder, { loading, error }] = useCreateOrderMutation({
    refetchQueries: [GetOrdersDocument],
    onCompleted: (data) => {
      toast.success(`Pedido #${data.createOrder.orderNumber} creado exitosamente`);
    },
    onError: (error) => {
      toast.error(`Error al crear pedido: ${error.message}`);
    }
  });

  const create = (input: CreateOrderInput) => {
    return createOrder({ variables: { input } });
  };

  return { create, loading, error };
};

export const useUpdateOrder = () => {
  const [updateOrder, { loading, error }] = useUpdateOrderMutation({
    onCompleted: (data) => {
      toast.success(`Pedido #${data.updateOrder.orderNumber} actualizado exitosamente`);
    },
    onError: (error) => {
      toast.error(`Error al actualizar pedido: ${error.message}`);
    }
  });

  const update = (id: string, input: UpdateOrderInput) => {
    return updateOrder({ variables: { id, input } });
  };

  return { update, loading, error };
};

export const useUpdateOrderStatus = () => {
  const [updateOrderStatus, { loading, error }] = useUpdateOrderStatusMutation({
    refetchQueries: [GetOrdersDocument],
    onCompleted: (data) => {
      toast.success(`Estado del pedido #${data.updateOrderStatus.orderNumber} actualizado a ${data.updateOrderStatus.status}`);
    },
    onError: (error) => {
      toast.error(`Error al actualizar estado del pedido: ${error.message}`);
    }
  });

  const updateStatus = (id: string, status: OrderStatus) => {
    return updateOrderStatus({ variables: { id, status } });
  };

  return { updateStatus, loading, error };
};

export const useCancelOrder = () => {
  const [cancelOrder, { loading, error }] = useCancelOrderMutation({
    refetchQueries: [GetOrdersDocument],
    onCompleted: (data) => {
      toast.success(`Pedido #${data.cancelOrder.orderNumber} cancelado exitosamente`);
    },
    onError: (error) => {
      toast.error(`Error al cancelar pedido: ${error.message}`);
    }
  });

  const cancel = (id: string) => {
    return cancelOrder({ variables: { id } });
  };

  return { cancel, loading, error };
};

export const useShipOrder = () => {
  const [shipOrder, { loading, error }] = useShipOrderMutation({
    refetchQueries: [GetOrdersDocument],
    onCompleted: (data) => {
      toast.success(`Pedido #${data.shipOrder.orderNumber} enviado exitosamente`);
    },
    onError: (error) => {
      toast.error(`Error al enviar pedido: ${error.message}`);
    }
  });

  const ship = (id: string, trackingNumber?: string) => {
    return shipOrder({ 
      variables: { 
        id, 
        trackingNumber: mapToGraphQLString(trackingNumber) 
      } 
    });
  };

  return { ship, loading, error };
};

export const useDeliverOrder = () => {
  const [deliverOrder, { loading, error }] = useDeliverOrderMutation({
    refetchQueries: [GetOrdersDocument],
    onCompleted: (data) => {
      toast.success(`Pedido #${data.deliverOrder.orderNumber} entregado exitosamente`);
    },
    onError: (error) => {
      toast.error(`Error al entregar pedido: ${error.message}`);
    }
  });

  const deliver = (id: string) => {
    return deliverOrder({ variables: { id } });
  };

  return { deliver, loading, error };
};

export const useOrderStats = () => {
  const { data, loading, error, refetch } = useGetOrderStatsQuery({
    errorPolicy: 'all'
  });

  return {
    stats: data?.orderStats,
    loading,
    error,
    refetch
  };
};

// Orders by status
export const useOrdersByStatus = (status: OrderStatus) => {
  return useOrders({
    filter: { status },
    limit: 10
  });
};

// Recent orders
export const useRecentOrders = () => {
  return useOrders({
    limit: 5,
    filter: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
    }
  });
};