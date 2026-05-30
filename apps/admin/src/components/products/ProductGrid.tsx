import type React from 'react';
import { memo } from 'react';
import Grid3X3Icon from 'lucide-react/dist/esm/icons/grid-3x3';
import ListIcon from 'lucide-react/dist/esm/icons/list';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import { cn } from '@/lib/utils';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/Button';

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  images: string[];
  stockQuantity: number;
  isActive: boolean;
  rating?: number | null;
  reviewCount: number;
  tags: string[];
  category?: { name: string; slug: string } | null;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string) => void;
  onToggleStatus?: (productId: string, isActive: boolean) => void;
  onViewDetails?: (productId: string) => void;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = memo(
  ({
    products,
    loading = false,
    error = null,
    hasMore = false,
    onLoadMore,
    onEdit,
    onDelete,
    onToggleStatus,
    onViewDetails,
    emptyMessage = 'No se encontraron productos que coincidan con los filtros aplicados.',
  }) => {
    if (loading && products.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center py-16 text-center'>
          <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-brand-purple' />
          <p className='m-0 text-lg text-muted-foreground'>
            Cargando productos...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className='my-6 rounded-lg border border-border p-8 text-center'>
          <div className='mb-4 flex items-center justify-center text-destructive'>
            <AlertTriangleIcon size={48} />
          </div>
          <h3 className='font-heading mb-2 text-xl font-semibold text-destructive'>
            Error al cargar productos
          </h3>
          <p className='mb-4 text-base text-muted-foreground'>{error}</p>
          <Button variant='primary' onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className='my-6 rounded-lg border border-border p-12 text-center'>
          <div className='mb-4 flex items-center justify-center text-muted-foreground opacity-50'>
            <PackageIcon size={48} />
          </div>
          <h3 className='font-heading mb-2 text-xl font-semibold text-foreground'>
            No hay productos
          </h3>
          <p className='mb-4 text-base text-muted-foreground'>{emptyMessage}</p>
          <Button variant='outline' onClick={() => window.location.reload()}>
            Recargar
          </Button>
        </div>
      );
    }

    return (
      <>
        {/* Stats bar */}
        <div className='mb-4 flex items-center justify-between rounded-md border border-border bg-muted px-4 py-3'>
          <span className='text-sm text-muted-foreground'>
            Mostrando{' '}
            <span className='font-medium text-foreground'>
              {products.length}
            </span>{' '}
            productos
          </span>
          <div className='flex gap-2'>
            <button
              className={cn(
                'flex items-center gap-1 rounded-md border px-3 py-2 text-sm transition-all',
                'border-brand-purple bg-brand-purple text-white'
              )}
            >
              <Grid3X3Icon size={14} />
              Grid
            </button>
            <button className='flex items-center gap-1 rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground transition-all hover:border-brand-purple hover:bg-brand-purple/10'>
              <ListIcon size={14} />
              Lista
            </button>
          </div>
        </div>

        <div className='mb-8 grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] max-md:gap-4 max-md:[grid-template-columns:repeat(auto-fill,minmax(280px,1fr))] max-sm:grid-cols-1'>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              {...(onEdit && { onEdit })}
              {...(onDelete && { onDelete })}
              {...(onToggleStatus && { onToggleStatus })}
              {...(onViewDetails && { onViewDetails })}
            />
          ))}
        </div>

        {hasMore && onLoadMore ? (
          <div className='mt-8 flex justify-center'>
            <Button
              variant='outline'
              size='large'
              onClick={onLoadMore}
              isLoading={loading}
              className='min-w-[200px]'
            >
              {loading ? 'Cargando...' : 'Cargar Más Productos'}
            </Button>
          </div>
        ) : null}
      </>
    );
  }
);
ProductGrid.displayName = 'ProductGrid';
