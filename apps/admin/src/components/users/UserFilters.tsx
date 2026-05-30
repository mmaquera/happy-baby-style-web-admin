import { memo } from 'react';
import SearchIcon from 'lucide-react/dist/esm/icons/search';
import type { UserRole } from '@happy-baby/domain-user';
import { Input } from '@/components/ui/Input';

interface UserFiltersProps {
  searchTerm: string;
  roleFilter: UserRole | '';
  isActiveFilter: boolean | null;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: UserRole | '') => void;
  onActiveChange: (value: boolean | null) => void;
}

export const UserFilters = memo<UserFiltersProps>(
  ({
    searchTerm,
    roleFilter,
    isActiveFilter,
    onSearchChange,
    onRoleChange,
    onActiveChange,
  }) => (
    <div className='mb-6 rounded-lg border border-border bg-card p-4 shadow-sm'>
      <div className='flex flex-wrap items-center gap-3'>
        <div className='min-w-64 flex-1'>
          <Input
            placeholder='Buscar usuarios...'
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            icon={<SearchIcon size={16} />}
          />
        </div>

        <select
          value={roleFilter}
          onChange={e => onRoleChange(e.target.value as UserRole | '')}
          className='cursor-pointer rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground'
        >
          <option value=''>Todos los roles</option>
          <option value='admin'>Administrador</option>
          <option value='customer'>Cliente</option>
          <option value='staff'>Staff</option>
        </select>

        <select
          value={
            isActiveFilter === null ? '' : isActiveFilter ? 'true' : 'false'
          }
          onChange={e =>
            onActiveChange(
              e.target.value === '' ? null : e.target.value === 'true'
            )
          }
          className='cursor-pointer rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground'
        >
          <option value=''>Todos los estados</option>
          <option value='true'>Activo</option>
          <option value='false'>Inactivo</option>
        </select>
      </div>
    </div>
  )
);
UserFilters.displayName = 'UserFilters';
