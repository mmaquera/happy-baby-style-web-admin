import type React from 'react';
import { memo } from 'react';
import SearchIcon from 'lucide-react/dist/esm/icons/search';
import FilterIcon from 'lucide-react/dist/esm/icons/filter';
import XIcon from 'lucide-react/dist/esm/icons/x';
import TagIcon from 'lucide-react/dist/esm/icons/tag';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ProductFiltersProps {
  filters: {
    search?: string;
    categoryId?: string;
    isActive?: boolean;
    inStock?: boolean;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
  };
  categories: Array<{ id: string; name: string; slug: string }>;
  availableTags: string[];
  onFilterChange: (filters: Partial<ProductFiltersProps['filters']>) => void;
  onClearFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = memo(
  ({ filters, categories, availableTags, onFilterChange, onClearFilters }) => {
    const handleChange = (
      field: keyof ProductFiltersProps['filters'],
      value: ProductFiltersProps['filters'][typeof field]
    ) => {
      onFilterChange({ [field]: value });
    };

    const handleTagToggle = (tag: string) => {
      const current = filters.tags ?? [];
      const next = current.includes(tag)
        ? current.filter(t => t !== tag)
        : [...current, tag];
      onFilterChange({ tags: next });
    };

    const hasActiveFilters =
      !!filters.search ||
      !!filters.categoryId ||
      filters.isActive !== undefined ||
      filters.inStock !== undefined ||
      !!filters.minPrice ||
      !!filters.maxPrice ||
      (filters.tags?.length ?? 0) > 0;

    return (
      <div className='mb-6 rounded-lg border border-border bg-card p-4'>
        {/* Header */}
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='font-heading flex items-center gap-2 text-lg font-semibold text-foreground'>
            <FilterIcon size={16} />
            Filtros de Productos
          </h3>
          {hasActiveFilters ? (
            <Button variant='ghost' size='small' onClick={onClearFilters}>
              <XIcon size={14} />
              Limpiar Filtros
            </Button>
          ) : null}
        </div>

        {/* Filters grid */}
        <div className='mb-4 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]'>
          {/* Search */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-foreground'>
              Buscar Productos
            </label>
            <Input
              placeholder='Nombre, descripción o SKU...'
              value={filters.search ?? ''}
              onChange={e => handleChange('search', e.target.value)}
              leftIcon={<SearchIcon size={16} />}
            />
          </div>

          {/* Category */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-foreground'>
              Categoría
            </label>
            <select
              className='rounded-md border-2 border-border bg-white px-4 py-3 text-base outline-none transition-all hover:border-border/80 focus:border-brand-purple focus:shadow-[0_0_0_3px_rgba(107,70,193,0.2)]'
              value={filters.categoryId ?? ''}
              onChange={e => {
                const { search: _s, categoryId: _c, ...rest } = filters;
                onFilterChange(
                  e.target.value
                    ? { ...rest, categoryId: e.target.value }
                    : rest
                );
              }}
            >
              <option value=''>Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-foreground'>
              Estado
            </label>
            <div className='flex cursor-pointer items-center gap-2'>
              <input
                type='checkbox'
                id='isActive'
                className='h-[18px] w-[18px] cursor-pointer accent-brand-purple'
                checked={filters.isActive !== false}
                onChange={e => handleChange('isActive', e.target.checked)}
              />
              <label
                htmlFor='isActive'
                className='cursor-pointer text-sm text-muted-foreground'
              >
                Solo productos activos
              </label>
            </div>
            <div className='flex cursor-pointer items-center gap-2'>
              <input
                type='checkbox'
                id='inStock'
                className='h-[18px] w-[18px] cursor-pointer accent-brand-purple'
                checked={filters.inStock !== false}
                onChange={e => handleChange('inStock', e.target.checked)}
              />
              <label
                htmlFor='inStock'
                className='cursor-pointer text-sm text-muted-foreground'
              >
                Solo en stock
              </label>
            </div>
          </div>

          {/* Price range */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-foreground'>
              Rango de Precios
            </label>
            <div className='flex items-center gap-2'>
              <Input
                type='number'
                placeholder='Mínimo'
                value={filters.minPrice ?? ''}
                onChange={e => {
                  const { minPrice: _m, ...rest } = filters;
                  onFilterChange(
                    e.target.value
                      ? { ...rest, minPrice: Number(e.target.value) }
                      : rest
                  );
                }}
                min='0'
                step='0.01'
                className='flex-1'
              />
              <span className='text-sm text-muted-foreground'>-</span>
              <Input
                type='number'
                placeholder='Máximo'
                value={filters.maxPrice ?? ''}
                onChange={e => {
                  const { maxPrice: _m, ...rest } = filters;
                  onFilterChange(
                    e.target.value
                      ? { ...rest, maxPrice: Number(e.target.value) }
                      : rest
                  );
                }}
                min='0'
                step='0.01'
                className='flex-1'
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        {availableTags.length > 0 ? (
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-foreground'>
              Etiquetas
            </label>
            <div className='flex flex-wrap gap-2'>
              {availableTags.map(tag => {
                const selected = filters.tags?.includes(tag) ?? false;
                return (
                  <div
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      'flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-all hover:-translate-y-px',
                      selected
                        ? 'border-brand-purple bg-brand-purple text-white'
                        : 'border-border bg-muted text-muted-foreground hover:bg-brand-purple/10'
                    )}
                  >
                    <TagIcon size={12} />
                    {tag}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Active filters */}
        {hasActiveFilters ? (
          <div className='mt-4 flex flex-wrap gap-2 rounded-md bg-muted p-3'>
            <span className='text-sm text-muted-foreground'>
              Filtros activos:
            </span>
            {filters.search ? (
              <span className='flex items-center gap-1 rounded-full bg-brand-purple px-2 py-0.5 text-xs text-white'>
                Búsqueda: &ldquo;{filters.search}&rdquo;
                <button
                  className='flex h-4 w-4 items-center justify-center rounded-full hover:bg-white/20'
                  onClick={() => handleChange('search', '')}
                >
                  <XIcon size={12} />
                </button>
              </span>
            ) : null}
            {filters.categoryId ? (
              <span className='flex items-center gap-1 rounded-full bg-brand-purple px-2 py-0.5 text-xs text-white'>
                Categoría:{' '}
                {categories.find(c => c.id === filters.categoryId)?.name}
                <button
                  className='flex h-4 w-4 items-center justify-center rounded-full hover:bg-white/20'
                  onClick={() => {
                    const { categoryId: _c, ...rest } = filters;
                    onFilterChange(rest);
                  }}
                >
                  <XIcon size={12} />
                </button>
              </span>
            ) : null}
            {filters.minPrice ? (
              <span className='flex items-center gap-1 rounded-full bg-brand-purple px-2 py-0.5 text-xs text-white'>
                Precio mínimo: S/ {filters.minPrice}
                <button
                  className='flex h-4 w-4 items-center justify-center rounded-full hover:bg-white/20'
                  onClick={() => {
                    const { minPrice: _m, ...rest } = filters;
                    onFilterChange(rest);
                  }}
                >
                  <XIcon size={12} />
                </button>
              </span>
            ) : null}
            {filters.maxPrice ? (
              <span className='flex items-center gap-1 rounded-full bg-brand-purple px-2 py-0.5 text-xs text-white'>
                Precio máximo: S/ {filters.maxPrice}
                <button
                  className='flex h-4 w-4 items-center justify-center rounded-full hover:bg-white/20'
                  onClick={() => {
                    const { maxPrice: _m, ...rest } = filters;
                    onFilterChange(rest);
                  }}
                >
                  <XIcon size={12} />
                </button>
              </span>
            ) : null}
            {filters.tags?.map(tag => (
              <span
                key={tag}
                className='flex items-center gap-1 rounded-full bg-brand-purple px-2 py-0.5 text-xs text-white'
              >
                Etiqueta: {tag}
                <button
                  className='flex h-4 w-4 items-center justify-center rounded-full hover:bg-white/20'
                  onClick={() => handleTagToggle(tag)}
                >
                  <XIcon size={12} />
                </button>
              </span>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);
ProductFilters.displayName = 'ProductFilters';
