import { memo, useState, useCallback, useEffect } from 'react';
import SearchIcon from 'lucide-react/dist/esm/icons/search';
import FilterIcon from 'lucide-react/dist/esm/icons/filter';
import XIcon from 'lucide-react/dist/esm/icons/x';
import RefreshCwIcon from 'lucide-react/dist/esm/icons/refresh-cw';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import XCircleIcon from 'lucide-react/dist/esm/icons/x-circle';
import ImageIcon from 'lucide-react/dist/esm/icons/image';
import FileTextIcon from 'lucide-react/dist/esm/icons/file-text';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUpIcon from 'lucide-react/dist/esm/icons/chevron-up';
import { cn } from '@/lib/utils';
import { Button } from '@happy-baby/shared-ui';
import { Input } from '@happy-baby/shared-ui';
import { Card } from '@happy-baby/shared-ui';
import type { CategoryFilters as CategoryFiltersType } from '../types/category';

interface CategoryFiltersProps {
  filters: CategoryFiltersType;
  onFiltersChange: (filters: CategoryFiltersType) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

export const CategoryFilters = memo<CategoryFiltersProps>(
  ({ filters, onFiltersChange, onClearFilters, loading = false }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [searchValue, setSearchValue] = useState(filters.search ?? '');

    useEffect(() => {
      const id = setTimeout(() => {
        if (searchValue !== filters.search) {
          const { search: _s, ...rest } = filters;
          onFiltersChange(
            searchValue ? { ...rest, search: searchValue } : rest
          );
        }
      }, 300);
      return () => clearTimeout(id);
    }, [searchValue]);

    useEffect(() => {
      setSearchValue(filters.search ?? '');
    }, [filters.search]);

    const handleChange = useCallback(
      (
        key: keyof CategoryFiltersType,
        value: CategoryFiltersType[typeof key]
      ) => {
        onFiltersChange({ ...filters, [key]: value });
      },
      [filters, onFiltersChange]
    );

    const handleRemove = useCallback(
      (key: keyof CategoryFiltersType) => {
        const { [key]: _removed, ...rest } = filters;
        onFiltersChange(rest as CategoryFiltersType);
      },
      [filters, onFiltersChange]
    );

    const activeCount = Object.keys(filters).filter(k => {
      const v = filters[k as keyof CategoryFiltersType];
      return v !== undefined && v !== '' && v !== null;
    }).length;

    return (
      <Card className='mb-6 p-4'>
        {/* Header */}
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='font-heading flex items-center gap-2 text-lg font-semibold text-foreground'>
            <FilterIcon size={20} />
            Filtros de Categorías
          </h3>
          <div className='flex gap-2'>
            {activeCount > 0 ? (
              <Button
                variant='ghost'
                size='sm'
                onClick={onClearFilters}
                disabled={loading}
              >
                <XIcon size={16} className='mr-1' />
                Limpiar Todo
              </Button>
            ) : null}
            <Button
              variant='outline'
              size='sm'
              onClick={onClearFilters}
              disabled={loading}
            >
              <RefreshCwIcon size={16} className='mr-1' />
              Restablecer
            </Button>
          </div>
        </div>

        {/* Main filters */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {/* Search */}
          <div>
            <label className='mb-1.5 block text-sm font-medium text-foreground'>
              Buscar categorías
            </label>
            <Input
              id='search'
              type='text'
              placeholder='Buscar por nombre, descripción o slug...'
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              disabled={loading}
              icon={<SearchIcon size={16} />}
            />
          </div>

          {/* Status */}
          <div>
            <label className='mb-1.5 block text-sm font-medium text-foreground'>
              Estado de la categoría
            </label>
            <div className='flex gap-2'>
              <button
                onClick={() =>
                  handleChange(
                    'isActive',
                    filters.isActive === true ? undefined : true
                  )
                }
                disabled={loading}
                className={cn(
                  'flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                  filters.isActive === true
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-border bg-background text-muted-foreground hover:border-green-400 hover:text-green-600'
                )}
              >
                <CheckCircleIcon size={16} />
                Activas
              </button>
              <button
                onClick={() =>
                  handleChange(
                    'isActive',
                    filters.isActive === false ? undefined : false
                  )
                }
                disabled={loading}
                className={cn(
                  'flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                  filters.isActive === false
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-border bg-background text-muted-foreground hover:border-amber-400 hover:text-amber-600'
                )}
              >
                <XCircleIcon size={16} />
                Inactivas
              </button>
            </div>
          </div>

          {/* Content checkboxes */}
          <div>
            <label className='mb-1.5 block text-sm font-medium text-foreground'>
              Contenido
            </label>
            <div className='flex flex-col gap-2'>
              <label className='flex items-center gap-2 text-sm text-muted-foreground'>
                <input
                  type='checkbox'
                  checked={filters.hasImage === true}
                  onChange={e =>
                    handleChange(
                      'hasImage',
                      e.target.checked ? true : undefined
                    )
                  }
                  disabled={loading}
                  className='rounded border-border'
                />
                <ImageIcon size={14} />
                Con imagen
              </label>
              <label className='flex items-center gap-2 text-sm text-muted-foreground'>
                <input
                  type='checkbox'
                  checked={filters.hasDescription === true}
                  onChange={e =>
                    handleChange(
                      'hasDescription',
                      e.target.checked ? true : undefined
                    )
                  }
                  disabled={loading}
                  className='rounded border-border'
                />
                <FileTextIcon size={14} />
                Con descripción
              </label>
            </div>
          </div>
        </div>

        {/* Advanced filters toggle */}
        <div className='mt-4'>
          <button
            onClick={() => setShowAdvanced(v => !v)}
            className='flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
          >
            {showAdvanced ? (
              <ChevronUpIcon size={16} />
            ) : (
              <ChevronDownIcon size={16} />
            )}
            Filtros Avanzados
          </button>

          {showAdvanced ? (
            <div className='mt-4 grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3'>
              {/* Products */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-foreground'>
                  Productos
                </label>
                <div className='flex flex-col gap-2'>
                  <label className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <input
                      type='checkbox'
                      checked={filters.hasProducts === true}
                      onChange={e =>
                        handleChange(
                          'hasProducts',
                          e.target.checked ? true : undefined
                        )
                      }
                      disabled={loading}
                      className='rounded border-border'
                    />
                    <PackageIcon size={14} />
                    Con productos
                  </label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='number'
                      placeholder='Mín.'
                      value={filters.minProducts ?? ''}
                      onChange={e =>
                        handleChange(
                          'minProducts',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      min='0'
                      disabled={loading}
                      className='w-20 rounded border border-border bg-background px-2 py-1.5 text-sm'
                    />
                    <span className='text-muted-foreground'>—</span>
                    <input
                      type='number'
                      placeholder='Máx.'
                      value={filters.maxProducts ?? ''}
                      onChange={e =>
                        handleChange(
                          'maxProducts',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      min='0'
                      disabled={loading}
                      className='w-20 rounded border border-border bg-background px-2 py-1.5 text-sm'
                    />
                  </div>
                </div>
              </div>

              {/* Created date range */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-foreground'>
                  Fecha de Creación
                </label>
                <div className='flex items-center gap-2'>
                  <input
                    type='date'
                    value={filters.createdAfter ?? ''}
                    onChange={e =>
                      handleChange('createdAfter', e.target.value || undefined)
                    }
                    disabled={loading}
                    className='rounded border border-border bg-background px-2 py-1.5 text-sm'
                  />
                  <span className='text-muted-foreground'>—</span>
                  <input
                    type='date'
                    value={filters.createdBefore ?? ''}
                    onChange={e =>
                      handleChange('createdBefore', e.target.value || undefined)
                    }
                    disabled={loading}
                    className='rounded border border-border bg-background px-2 py-1.5 text-sm'
                  />
                </div>
              </div>

              {/* Updated date range */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-foreground'>
                  Fecha de Actualización
                </label>
                <div className='flex items-center gap-2'>
                  <input
                    type='date'
                    value={filters.updatedAfter ?? ''}
                    onChange={e =>
                      handleChange('updatedAfter', e.target.value || undefined)
                    }
                    disabled={loading}
                    className='rounded border border-border bg-background px-2 py-1.5 text-sm'
                  />
                  <span className='text-muted-foreground'>—</span>
                  <input
                    type='date'
                    value={filters.updatedBefore ?? ''}
                    onChange={e =>
                      handleChange('updatedBefore', e.target.value || undefined)
                    }
                    disabled={loading}
                    className='rounded border border-border bg-background px-2 py-1.5 text-sm'
                  />
                </div>
              </div>

              {/* Sort order */}
              <div>
                <label
                  htmlFor='sortOrder'
                  className='mb-1.5 block text-sm font-medium text-foreground'
                >
                  Orden de Clasificación
                </label>
                <Input
                  id='sortOrder'
                  type='number'
                  placeholder='Orden específico'
                  value={filters.sortOrder ?? ''}
                  onChange={e =>
                    handleChange(
                      'sortOrder',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  disabled={loading}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Active filter tags */}
        {activeCount > 0 ? (
          <div className='mt-4 flex flex-wrap gap-2 border-t border-border pt-4'>
            {filters.search ? (
              <span className='flex items-center gap-1.5 rounded border border-brand-purple/30 bg-brand-purple/10 px-2 py-1 text-sm text-brand-purple'>
                Búsqueda: &ldquo;{filters.search}&rdquo;
                <button
                  onClick={() => handleRemove('search')}
                  className='ml-0.5 hover:opacity-70'
                >
                  <XIcon size={14} />
                </button>
              </span>
            ) : null}
            {filters.isActive === true ? (
              <span className='flex items-center gap-1.5 rounded border border-brand-purple/30 bg-brand-purple/10 px-2 py-1 text-sm text-brand-purple'>
                Solo activas
                <button
                  onClick={() => handleRemove('isActive')}
                  className='ml-0.5 hover:opacity-70'
                >
                  <XIcon size={14} />
                </button>
              </span>
            ) : null}
            {filters.isActive === false ? (
              <span className='flex items-center gap-1.5 rounded border border-brand-purple/30 bg-brand-purple/10 px-2 py-1 text-sm text-brand-purple'>
                Solo inactivas
                <button
                  onClick={() => handleRemove('isActive')}
                  className='ml-0.5 hover:opacity-70'
                >
                  <XIcon size={14} />
                </button>
              </span>
            ) : null}
            {filters.hasImage ? (
              <span className='flex items-center gap-1.5 rounded border border-brand-purple/30 bg-brand-purple/10 px-2 py-1 text-sm text-brand-purple'>
                Con imagen
                <button
                  onClick={() => handleRemove('hasImage')}
                  className='ml-0.5 hover:opacity-70'
                >
                  <XIcon size={14} />
                </button>
              </span>
            ) : null}
            {filters.hasDescription ? (
              <span className='flex items-center gap-1.5 rounded border border-brand-purple/30 bg-brand-purple/10 px-2 py-1 text-sm text-brand-purple'>
                Con descripción
                <button
                  onClick={() => handleRemove('hasDescription')}
                  className='ml-0.5 hover:opacity-70'
                >
                  <XIcon size={14} />
                </button>
              </span>
            ) : null}
            {filters.hasProducts ? (
              <span className='flex items-center gap-1.5 rounded border border-brand-purple/30 bg-brand-purple/10 px-2 py-1 text-sm text-brand-purple'>
                Con productos
                <button
                  onClick={() => handleRemove('hasProducts')}
                  className='ml-0.5 hover:opacity-70'
                >
                  <XIcon size={14} />
                </button>
              </span>
            ) : null}
            {filters.minProducts ? (
              <span className='flex items-center gap-1.5 rounded border border-brand-purple/30 bg-brand-purple/10 px-2 py-1 text-sm text-brand-purple'>
                Min. productos: {filters.minProducts}
                <button
                  onClick={() => handleRemove('minProducts')}
                  className='ml-0.5 hover:opacity-70'
                >
                  <XIcon size={14} />
                </button>
              </span>
            ) : null}
            {filters.maxProducts ? (
              <span className='flex items-center gap-1.5 rounded border border-brand-purple/30 bg-brand-purple/10 px-2 py-1 text-sm text-brand-purple'>
                Max. productos: {filters.maxProducts}
                <button
                  onClick={() => handleRemove('maxProducts')}
                  className='ml-0.5 hover:opacity-70'
                >
                  <XIcon size={14} />
                </button>
              </span>
            ) : null}
          </div>
        ) : null}
      </Card>
    );
  }
);
CategoryFilters.displayName = 'CategoryFilters';
