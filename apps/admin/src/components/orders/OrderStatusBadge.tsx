import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@happy-baby/domain-order';
import ClockIcon from 'lucide-react/dist/esm/icons/clock';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import TruckIcon from 'lucide-react/dist/esm/icons/truck';
import XCircleIcon from 'lucide-react/dist/esm/icons/x-circle';

const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    icon: ClockIcon,
    className: 'bg-amber-100 text-amber-700',
  },
  confirmed: {
    label: 'Confirmado',
    icon: CheckCircleIcon,
    className: 'bg-blue-100 text-blue-700',
  },
  processing: {
    label: 'En Proceso',
    icon: PackageIcon,
    className: 'bg-purple-100 text-brand-purple',
  },
  shipped: {
    label: 'Enviado',
    icon: TruckIcon,
    className: 'bg-teal-100 text-teal-700',
  },
  delivered: {
    label: 'Entregado',
    icon: CheckCircleIcon,
    className: 'bg-green-100 text-green-700',
  },
  cancelled: {
    label: 'Cancelado',
    icon: XCircleIcon,
    className: 'bg-destructive/10 text-destructive',
  },
  refunded: {
    label: 'Reembolsado',
    icon: XCircleIcon,
    className: 'bg-muted text-muted-foreground',
  },
} as const;

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const OrderStatusBadge = memo<OrderStatusBadgeProps>(
  ({ status, className }) => {
    const config =
      STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ??
      STATUS_CONFIG.pending;
    const Icon = config.icon;
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
          config.className,
          className
        )}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  }
);
OrderStatusBadge.displayName = 'OrderStatusBadge';

export { STATUS_CONFIG };
