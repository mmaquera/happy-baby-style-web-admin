import type React from 'react';
import {
  lazy,
  Suspense,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar';
import { Button } from '@happy-baby/shared-ui';
import {
  useOrderActions,
  OrderCard,
  OrderFilters,
} from '@happy-baby/feature-orders';
import type { Order, OrderStatus } from '@happy-baby/feature-orders';

const OrderDetailModal = lazy(() =>
  import('@happy-baby/feature-orders').then(m => ({
    default: m.OrderDetailModal,
  }))
);

export const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const {
    orders,
    loading: isLoading,
    error,
    loadOrders,
    updateStatus,
  } = useOrderActions();

  useEffect(() => {
    void loadOrders(statusFilter ? { status: statusFilter } : undefined);
  }, [loadOrders, statusFilter]);

  const filteredOrders = useMemo(
    () =>
      orders.filter(order => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          (order.customer?.firstName ?? '').toLowerCase().includes(term) ||
          (order.customer?.lastName ?? '').toLowerCase().includes(term) ||
          order.id.toLowerCase().includes(term) ||
          order.orderNumber.toLowerCase().includes(term)
        );
      }),
    [orders, searchTerm]
  );

  const handleStatusChange = useCallback(
    async (orderId: string, newStatus: string) => {
      await updateStatus(orderId, newStatus as OrderStatus);
    },
    [updateStatus]
  );

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('');
  }, []);

  if (isLoading && orders.length === 0) {
    return (
      <div className='p-8 text-center text-muted-foreground'>
        Cargando pedidos...
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-8 text-center'>
        <p className='mb-4 text-destructive'>Error al cargar los pedidos</p>
        <Button
          onClick={() =>
            loadOrders(statusFilter ? { status: statusFilter } : undefined)
          }
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='font-heading text-3xl font-light text-foreground'>
            Pedidos
          </h1>
          <p className='mt-1 text-lg text-muted-foreground'>
            Gestiona todos los pedidos de Happy Baby Style
          </p>
        </div>
        <div className='flex gap-3'>
          <Button variant='outline'>
            <CalendarIcon size={16} className='mr-1.5' />
            Exportar
          </Button>
          <Button>
            <PackageIcon size={16} className='mr-1.5' />
            Nuevo Pedido
          </Button>
        </div>
      </div>

      {/* Filters */}
      <OrderFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onClear={handleClearFilters}
      />

      {/* Orders list */}
      <div className='grid gap-4'>
        {filteredOrders.length === 0 ? (
          <div className='rounded-lg border border-border bg-card p-12 text-center text-muted-foreground'>
            <div className='mb-4 text-5xl'>📦</div>
            <h3 className='mb-2 font-heading text-xl text-foreground'>
              No se encontraron pedidos
            </h3>
            <p className='text-sm'>
              No hay pedidos que coincidan con los filtros aplicados
            </p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onView={setSelectedOrder}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder ? (
        <Suspense fallback={null}>
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        </Suspense>
      ) : null}
    </div>
  );
};
