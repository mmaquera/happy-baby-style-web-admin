import type React from 'react';
import { memo } from 'react';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import XCircleIcon from 'lucide-react/dist/esm/icons/x-circle';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import StarIcon from 'lucide-react/dist/esm/icons/star';
import EyeIcon from 'lucide-react/dist/esm/icons/eye';
import EditIcon from 'lucide-react/dist/esm/icons/edit';
import Trash2Icon from 'lucide-react/dist/esm/icons/trash-2';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  product: {
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
    category?: {
      name: string;
      slug: string;
    } | null;
  };
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string) => void;
  onToggleStatus?: (productId: string, isActive: boolean) => void;
  onViewDetails?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = memo(
  ({ product, onEdit, onDelete, onToggleStatus, onViewDetails }) => {
    const hasDiscount =
      product.salePrice != null && product.salePrice < product.price;
    const discountPercentage = hasDiscount
      ? Math.round(
          ((product.price - product.salePrice!) / product.price) * 100
        )
      : 0;

    const isLowStock =
      product.stockQuantity <= 5 && product.stockQuantity > 0;
    const isOutOfStock = product.stockQuantity === 0;
    const currentPrice =
      typeof product.salePrice === 'number'
        ? product.salePrice
        : product.price;

    return (
      <Card hover clickable shadow='medium' padding='small'>
        {/* Image */}
        <div className='relative h-[200px] w-full overflow-hidden rounded-t-lg bg-muted'>
          {product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className='h-full w-full object-cover transition-transform duration-200'
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
              <PackageIcon size={24} data-testid='placeholder-icon' />
            </div>
          )}

          {/* Status badge */}
          <span
            className={cn(
              'absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white',
              product.isActive ? 'bg-green-500' : 'bg-yellow-500'
            )}
          >
            {product.isActive ? (
              <CheckCircleIcon size={12} />
            ) : (
              <XCircleIcon size={12} />
            )}
            {product.isActive ? 'Activo' : 'Inactivo'}
          </span>

          {/* Stock badge */}
          <span
            className={cn(
              'absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white',
              isOutOfStock
                ? 'bg-destructive'
                : isLowStock
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
            )}
          >
            {isOutOfStock ? (
              <XCircleIcon size={12} />
            ) : isLowStock ? (
              <AlertTriangleIcon size={12} />
            ) : (
              <CheckCircleIcon size={12} />
            )}
            {isOutOfStock
              ? 'Sin stock'
              : isLowStock
                ? 'Stock bajo'
                : 'En stock'}
          </span>
        </div>

        {/* Content */}
        <div className='p-4'>
          {product.category ? (
            <span className='mb-2 inline-block rounded-full bg-brand-purple/10 px-2 py-0.5 text-xs font-medium text-brand-purple'>
              {product.category.name}
            </span>
          ) : null}

          <h3 className='font-heading mb-2 line-clamp-2 text-lg font-semibold leading-snug text-foreground'>
            {product.name}
          </h3>

          {product.description ? (
            <p className='mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground'>
              {product.description}
            </p>
          ) : null}

          {/* Price */}
          <div className='mb-3 flex items-center gap-2'>
            <span className='text-xl font-bold text-brand-purple'>
              S/ {currentPrice.toFixed(2)}
            </span>
            {hasDiscount ? (
              <>
                <span className='text-base text-muted-foreground line-through'>
                  S/ {product.price.toFixed(2)}
                </span>
                <span className='rounded-full bg-[#FF6B6B] px-2 py-0.5 text-xs font-medium text-white'>
                  -{discountPercentage}%
                </span>
              </>
            ) : null}
          </div>

          {/* Rating + stock */}
          <div className='mb-3 flex items-center justify-between text-sm text-muted-foreground'>
            <div className='flex items-center gap-1'>
              <StarIcon size={16} className='text-yellow-400' />
              <span>{product.rating?.toFixed(1) ?? 'N/A'}</span>
              <span>({product.reviewCount})</span>
            </div>
            <span>Stock: {product.stockQuantity}</span>
          </div>

          {/* Tags */}
          {product.tags.length > 0 ? (
            <div className='mb-3 flex flex-wrap gap-1'>
              {product.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className='rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground'
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 3 ? (
                <span className='rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground'>
                  +{product.tags.length - 3}
                </span>
              ) : null}
            </div>
          ) : null}

          {/* Actions */}
          <div className='flex flex-wrap gap-2'>
            {onViewDetails ? (
              <Button
                variant='primary'
                size='small'
                onClick={() => onViewDetails(product.id)}
                fullWidth
                aria-label='Ver detalles del producto'
              >
                <EyeIcon size={14} />
                Ver Detalles
              </Button>
            ) : null}
            {onEdit ? (
              <Button
                variant='outline'
                size='small'
                onClick={() => onEdit(product.id)}
                aria-label='Editar producto'
              >
                <EditIcon size={14} />
                Editar
              </Button>
            ) : null}
            {onToggleStatus ? (
              <Button
                variant={product.isActive ? 'ghost' : 'secondary'}
                size='small'
                onClick={() => onToggleStatus(product.id, !product.isActive)}
                aria-label='Cambiar estado del producto'
              >
                {product.isActive ? 'Desactivar' : 'Activar'}
              </Button>
            ) : null}
            {onDelete ? (
              <Button
                variant='danger'
                size='small'
                onClick={() => onDelete(product.id)}
                aria-label='Eliminar producto'
              >
                <Trash2Icon size={14} />
                Eliminar
              </Button>
            ) : null}
          </div>
        </div>
      </Card>
    );
  }
);
ProductCard.displayName = 'ProductCard';
