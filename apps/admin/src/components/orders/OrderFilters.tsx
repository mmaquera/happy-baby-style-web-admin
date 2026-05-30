import { memo } from 'react';
import FilterIcon from 'lucide-react/dist/esm/icons/filter';
import SearchIcon from 'lucide-react/dist/esm/icons/search';
import type { OrderStatus } from '@happy-baby/domain-order';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { STATUS_CONFIG } from './OrderStatusBadge';

const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(
  ([value, { label }]) => ({
    value: value as OrderStatus,
    label,
  })
);

interface OrderFiltersProps {
  searchTerm: string;
  statusFilter: OrderStatus | '';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: OrderStatus | '') => void;
  onClear: () => void;
}

export const OrderFilters = memo<OrderFiltersProps>(
  ({ searchTerm, statusFilter, onSearchChange, onStatusChange, onClear }) => (
    <div className='mb-8 rounded-lg border border-border bg-card p-4 shadow-sm'>
      <div className='flex flex-wrap items-center gap-3'>
        <div className='min-w-72 flex-1'>
          <Input
            placeholder='Buscar por cliente, número de pedido o ID...'
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            icon={<SearchIcon size={16} />}
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => onStatusChange(e.target.value as OrderStatus | '')}
          className='min-w-36 cursor-pointer rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground'
        >
          <option value=''>Todos los estados</option>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <Button variant='outline' onClick={onClear}>
          <FilterIcon size={16} className='mr-1.5' />
          Limpiar
        </Button>
      </div>
    </div>
  )
);
OrderFilters.displayName = 'OrderFilters';
