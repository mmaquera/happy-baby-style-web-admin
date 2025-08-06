import { 
  useGetOrdersQuery, 
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useGetOrderStatsQuery,
  GetOrdersDocument,
  OrderFilterInput,
  CreateOrderInput,
  UpdateOrderInput,
  OrderStatus
} from '../generated/graphql';
import toast from 'react-hot-toast';

interface UseOrdersOptions {
  filter?: OrderFilterInput;
  limit?: number;
  skip?: boolean;
}

export const useOrders = (options: UseOrdersOptions = {}) => {
  const { filter, limit = 20, skip = false } = options;
  
  const { data, loading, error, fetchMore, refetch } = useGetOrdersQuery({
    variables: {
      filter,
      pagination: { limit, offset: 0 }
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
    return updateOrder({ 
      variables: { id, input },
      // Optimistic update
      optimisticResponse: {
        updateOrder: {
          __typename: 'Order',
          id,
          ...input as any,
        }
      }
    });
  };

  return { update, loading, error };
};

export const useUpdateOrderStatus = () => {
  const [updateOrderStatus, { loading, error }] = useUpdateOrderStatusMutation({
    onCompleted: (data) => {
      const statusMessages = {
        [OrderStatus.pending]: 'Pedido marcado como pendiente',
        [OrderStatus.paid]: 'Pedido marcado como pagado',
        [OrderStatus.processing]: 'Pedido en procesamiento',
        [OrderStatus.shipped]: 'Pedido enviado',
        [OrderStatus.delivered]: 'Pedido entregado',
        [OrderStatus.cancelled]: 'Pedido cancelado',
        [OrderStatus.refunded]: 'Pedido reembolsado'
      };
      
      toast.success(statusMessages[data.updateOrderStatus.status as keyof typeof statusMessages] || 'Estado actualizado');
    },
    onError: (error) => {
      toast.error(`Error al actualizar estado: ${error.message}`);
    }
  });

  const updateStatus = (id: string, status: OrderStatus) => {
    return updateOrderStatus({ 
      variables: { id, status },
      // Optimistic update
      optimisticResponse: {
        updateOrderStatus: {
          __typename: 'Order',
          id,
          status,
          userId: '',
          orderNumber: '',
          subtotal: 0,
          taxAmount: 0,
          shippingCost: 0,
          discountAmount: 0,
          totalAmount: 0,
          notes: null,
          trackingNumber: null,
          shippedAt: null,
          deliveredAt: null,
          createdAt: '',
          updatedAt: new Date().toISOString()
        }
      }
    });
  };

  return { updateStatus, loading, error };
};

export const useOrderStats = () => {
  const { data, loading, error, refetch } = useGetOrderStatsQuery({
    errorPolicy: 'all',
    // Poll every 5 minutes for fresh stats
    pollInterval: 5 * 60 * 1000
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