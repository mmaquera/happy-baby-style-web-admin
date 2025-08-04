import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  items?: OrderItem[];
  shippingAddress?: ShippingAddress;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

export interface ShippingAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateOrderRequest {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  items: {
    productId: string;
    quantity: number;
    size: string;
    color: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
}

export interface UpdateOrderRequest {
  status?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  deliveredAt?: string;
}

export interface OrderFilters {
  status?: string;
  customerEmail?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export const useOrders = (filters?: OrderFilters) => {
  const queryClient = useQueryClient();

  // Fetch orders
  const {
    data: orders = [],
    isLoading,
    error,
    refetch
  } = useQuery<Order[]>(
    ['orders', filters],
    async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.customerEmail) params.append('customerEmail', filters.customerEmail);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const response = await api.get(`/orders?${params.toString()}`);
      return response.data.data;
    },
    {
      retry: 1,
      onError: (error) => {
        toast.error('Error al cargar los pedidos');
        console.error('Error fetching orders:', error);
      }
    }
  );

  // Fetch single order
  const useOrder = (id: string) => {
    return useQuery<Order>(
      ['order', id],
      async () => {
        const response = await api.get(`/orders/${id}`);
        return response.data.data;
      },
      {
        enabled: !!id,
        retry: 1,
        onError: (error) => {
          toast.error('Error al cargar el pedido');
          console.error('Error fetching order:', error);
        }
      }
    );
  };

  // Create order mutation
  const createOrderMutation = useMutation(
    async (orderData: CreateOrderRequest) => {
      const response = await api.post('/orders', orderData);
      return response.data.data;
    },
    {
      onSuccess: () => {
        toast.success('Pedido creado exitosamente');
        queryClient.invalidateQueries(['orders']);
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al crear el pedido';
        toast.error(message);
        console.error('Error creating order:', error);
      }
    }
  );

  // Update order mutation
  const updateOrderMutation = useMutation(
    async ({ id, data }: { id: string; data: UpdateOrderRequest }) => {
      const response = await api.put(`/orders/${id}`, data);
      return response.data.data;
    },
    {
      onSuccess: () => {
        toast.success('Pedido actualizado exitosamente');
        queryClient.invalidateQueries(['orders']);
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al actualizar el pedido';
        toast.error(message);
        console.error('Error updating order:', error);
      }
    }
  );

  // Update order status mutation
  const updateOrderStatusMutation = useMutation(
    async ({ id, status }: { id: string; status: string }) => {
      const response = await api.put(`/orders/${id}`, { status });
      return response.data.data;
    },
    {
      onSuccess: () => {
        toast.success('Estado del pedido actualizado');
        queryClient.invalidateQueries(['orders']);
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al actualizar el estado del pedido';
        toast.error(message);
        console.error('Error updating order status:', error);
      }
    }
  );

  // Delete order mutation
  const deleteOrderMutation = useMutation(
    async (id: string) => {
      await api.delete(`/orders/${id}`);
    },
    {
      onSuccess: () => {
        toast.success('Pedido eliminado exitosamente');
        queryClient.invalidateQueries(['orders']);
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al eliminar el pedido';
        toast.error(message);
        console.error('Error deleting order:', error);
      }
    }
  );

  return {
    orders,
    isLoading,
    error,
    refetch,
    useOrder,
    createOrder: createOrderMutation.mutateAsync,
    updateOrder: updateOrderMutation.mutateAsync,
    updateOrderStatus: updateOrderStatusMutation.mutateAsync,
    deleteOrder: deleteOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isLoading,
    isUpdating: updateOrderMutation.isLoading,
    isUpdatingStatus: updateOrderStatusMutation.isLoading,
    isDeleting: deleteOrderMutation.isLoading
  };
}; 