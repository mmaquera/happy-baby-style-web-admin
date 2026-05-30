import { memo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Order } from '@happy-baby/domain-order';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OrderStatusBadge } from './OrderStatusBadge';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
});

const formatCurrency = (amount: number) => currencyFormatter.format(amount);

const formatDate = (date: Date | string) =>
  format(typeof date === 'string' ? new Date(date) : date, 'dd/MM/yyyy HH:mm', {
    locale: es,
  });

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderDetailModal = memo<OrderDetailModalProps>(
  ({ order, onClose }) => (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-8'
      onClick={onClose}
    >
      <Card
        className='max-h-[80vh] w-full max-w-xl overflow-auto p-6'
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='mb-6 flex items-center justify-between border-b border-border pb-4'>
          <div className='flex items-center gap-3'>
            <h2 className='font-heading text-xl font-medium'>
              Pedido #{order.orderNumber}
            </h2>
            <OrderStatusBadge
              status={
                order.status as Parameters<typeof OrderStatusBadge>[0]['status']
              }
            />
          </div>
          <Button variant='outline' size='sm' onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Customer info */}
        <section className='mb-6'>
          <h3 className='mb-3 font-heading text-base font-medium'>
            Información del Cliente
          </h3>
          <dl className='space-y-1 text-sm'>
            <div className='flex gap-2'>
              <dt className='font-medium'>Nombre:</dt>
              <dd className='text-muted-foreground'>
                {order.customer?.firstName} {order.customer?.lastName}
              </dd>
            </div>
            {order.customer?.email ? (
              <div className='flex gap-2'>
                <dt className='font-medium'>Email:</dt>
                <dd className='text-muted-foreground'>
                  {order.customer.email}
                </dd>
              </div>
            ) : null}
            {order.customer?.phone ? (
              <div className='flex gap-2'>
                <dt className='font-medium'>Teléfono:</dt>
                <dd className='text-muted-foreground'>
                  {order.customer.phone}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        {/* Shipping address */}
        {order.shippingAddress ? (
          <section className='mb-6'>
            <h3 className='mb-3 font-heading text-base font-medium'>
              Dirección de Envío
            </h3>
            <address className='not-italic text-sm text-muted-foreground space-y-0.5'>
              <p>{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 ? (
                <p>{order.shippingAddress.address2}</p>
              ) : null}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p>
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
            </address>
          </section>
        ) : null}

        {/* Items */}
        {order.items.length > 0 ? (
          <section className='mb-6'>
            <h3 className='mb-3 font-heading text-base font-medium'>
              Productos
            </h3>
            <ul className='space-y-2'>
              {order.items.map(item => (
                <li
                  key={item.id}
                  className='flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm'
                >
                  <div>
                    <p className='font-medium'>
                      {item.product?.name ?? `Producto ${item.id.slice(0, 8)}`}
                    </p>
                    <p className='text-muted-foreground'>
                      Cant: {item.quantity} · Precio:{' '}
                      {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className='font-medium'>
                    {formatCurrency(item.totalPrice)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Footer */}
        <div className='flex items-center justify-between border-t border-border pt-4'>
          <div>
            <p className='text-base font-bold'>
              Total: {formatCurrency(order.totalAmount)}
            </p>
            <p className='text-sm text-muted-foreground'>
              Creado: {formatDate(order.createdAt)}
            </p>
          </div>
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  )
);
OrderDetailModal.displayName = 'OrderDetailModal';
