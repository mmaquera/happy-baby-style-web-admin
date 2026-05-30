import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useOrderUseCases } from '@/app/di/orders';
import type { Order, OrderFilter, OrderStatus } from '@happy-baby/domain-order';
import { isErr } from '@happy-baby/domain-shared';

export const useOrderActions = () => {
  const useCases = useOrderUseCases();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const loadOrders = useCallback(
    async (filter?: OrderFilter, limit = 20, offset = 0) => {
      setLoading(true);
      setError(null);
      try {
        const result = await useCases.list.execute({
          ...(filter ? { filter } : {}),
          limit,
          offset,
        });
        if (isErr(result)) {
          setError(result.error.message ?? 'Error al cargar pedidos');
          return;
        }
        setOrders(result.value.items);
        setTotal(result.value.total);
        setHasMore(result.value.hasMore);
      } finally {
        setLoading(false);
      }
    },
    [useCases.list]
  );

  const updateStatus = useCallback(
    async (id: string, status: OrderStatus): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await useCases.updateStatus.execute(id, status);
        if (isErr(result)) {
          toast.error(result.error.message ?? 'Error al actualizar estado');
          return false;
        }
        setOrders(prev => prev.map(o => (o.id === id ? result.value : o)));
        toast.success('Estado del pedido actualizado');
        return true;
      } finally {
        setLoading(false);
      }
    },
    [useCases.updateStatus]
  );

  const cancelOrder = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await useCases.cancel.execute(id);
        if (isErr(result)) {
          toast.error(result.error.message ?? 'Error al cancelar pedido');
          return false;
        }
        setOrders(prev => prev.map(o => (o.id === id ? result.value : o)));
        toast.success('Pedido cancelado exitosamente');
        return true;
      } finally {
        setLoading(false);
      }
    },
    [useCases.cancel]
  );

  return {
    orders,
    total,
    hasMore,
    loading,
    error,
    clearError,
    loadOrders,
    updateStatus,
    cancelOrder,
  };
};
