import { memo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import EyeIcon from 'lucide-react/dist/esm/icons/eye';
import type { Order, OrderStatus } from '@happy-baby/domain-order';
import { Card } from '@happy-baby/shared-ui';
import { Button } from '@happy-baby/shared-ui';
import { OrderStatusBadge, STATUS_CONFIG } from './OrderStatusBadge';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
});

const formatCurrency = (amount: number) => currencyFormatter.format(amount);

const formatDate = (date: Date | string) =>
  format(typeof date === 'string' ? new Date(date) : date, 'dd/MM/yyyy HH:mm', {
    locale: es,
  });

const TERMINAL_STATUSES = new Set<OrderStatus>(['delivered', 'cancelled']);

const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(
  ([value, { label }]) => ({ value, label })
);

interface OrderCardProps {
  order: Order;
  onView: (order: Order) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

export const OrderCard = memo<OrderCardProps>(
  ({ order, onView, onStatusChange }) => {
    const isTerminal = TERMINAL_STATUSES.has(order.status as OrderStatus);

    return (
      <Card className='p-6'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex-1'>
            <div className='mb-3 flex items-center gap-3'>
              <OrderStatusBadge status={order.status as OrderStatus} />
              <span className='text-sm text-muted-foreground'>
                #{order.orderNumber}
              </span>
            </div>
            <h3 className='mb-1 text-base font-medium'>
              {order.customer?.firstName} {order.customer?.lastName}
            </h3>
            {order.customer?.email ? (
              <p className='mb-1 text-sm text-muted-foreground'>
                {order.customer.email}
              </p>
            ) : null}
            <p className='text-sm text-muted-foreground'>
              📅 {formatDate(order.createdAt)}
            </p>
          </div>

          <div className='flex flex-col items-end gap-3'>
            <div className='text-right'>
              <p className='text-xl font-bold'>
                {formatCurrency(order.totalAmount)}
              </p>
              <p className='text-sm text-muted-foreground'>
                {order.items.length} producto
                {order.items.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' onClick={() => onView(order)}>
                <EyeIcon size={14} className='mr-1' />
                Ver
              </Button>
              {!isTerminal && (
                <select
                  value={order.status}
                  onChange={e =>
                    onStatusChange(order.id, e.target.value as OrderStatus)
                  }
                  className='cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground'
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }
);
OrderCard.displayName = 'OrderCard';
