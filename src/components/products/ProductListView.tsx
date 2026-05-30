import type React from 'react';
import { memo, useState, useCallback } from 'react';
import ListIcon from 'lucide-react/dist/esm/icons/list';
import EyeIcon from 'lucide-react/dist/esm/icons/eye';
import EditIcon from 'lucide-react/dist/esm/icons/edit';
import Trash2Icon from 'lucide-react/dist/esm/icons/trash-2';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import XCircleIcon from 'lucide-react/dist/esm/icons/x-circle';
import StarIcon from 'lucide-react/dist/esm/icons/star';
import SortAscIcon from 'lucide-react/dist/esm/icons/sort-asc';
import SortDescIcon from 'lucide-react/dist/esm/icons/sort-desc';
import { cn } from '@/lib/utils';
import { CURRENCY_SYMBOL } from '@/config/currency';

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  sku: string;
  images: string[];
  attributes: Record<string, unknown>;
  isActive: boolean;
  stockQuantity: number;
  tags: string[];
  rating?: number | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  currentPrice: number;
  hasDiscount: boolean;
  discountPercentage: number;
  totalStock: number;
  isInStock: boolean;
  category?: { id: string; name: string; slug: string; image?: string | null } | null;
  variants: Array<{
    id: string;
    name: string;
    price: number;
    sku: string;
    stockQuantity: number;
    attributes: Record<string, unknown>;
    isActive: boolean;
    isInStock: boolean;
  }>;
}

interface ProductListViewProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
  onToggleStatus: (productId: string, isActive: boolean) => void;
  onViewDetails: (productId: string) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  onFilter: (filters: Record<string, unknown>) => void;
}

const ActionBtn = ({
  onClick,
  title,
  className,
  children,
}: {
  onClick: () => void;
  title: string;
  className: string;
  children: React.ReactNode;
}) => (
  <div className='group relative'>
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-md border transition-all hover:-translate-y-px hover:shadow-sm',
        className
      )}
    >
      {children}
    </button>
    <span className='pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-0.5 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100'>
      {title}
    </span>
  </div>
);

export const ProductListView: React.FC<ProductListViewProps> = memo(
  ({
    products,
    loading = false,
    error = null,
    total,
    currentPage,
    totalPages,
    hasMore,
    onPageChange,
    onEdit,
    onDelete,
    onToggleStatus,
    onViewDetails,
    onSort,
    onFilter: _onFilter,
  }) => {
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = useCallback(
      (field: string) => {
        const dir =
          sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(dir);
        onSort(field, dir);
      },
      [sortField, sortDirection, onSort]
    );

    const SortIndicator = ({ field }: { field: string }) =>
      sortField === field ? (
        <span className='text-brand-purple opacity-80'>
          {sortDirection === 'asc' ? (
            <SortAscIcon size={14} />
          ) : (
            <SortDescIcon size={14} />
          )}
        </span>
      ) : null;

    if (loading) {
      return (
        <div className='flex flex-col items-center justify-center rounded-lg border border-border p-12 shadow-sm'>
          <div className='mb-4 h-12 w-12 animate-spin rounded-full border-[3px] border-muted border-t-brand-purple' />
          <p className='m-0 text-lg font-medium text-muted-foreground'>
            Cargando productos...
          </p>
          <p className='text-muted-foreground'>
            Por favor espera mientras se cargan los datos
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className='rounded-lg border border-destructive/30 p-8 text-center shadow-sm'>
          <div className='mb-4 flex items-center justify-center text-destructive opacity-80'>
            <AlertTriangleIcon size={48} />
          </div>
          <h3 className='font-heading mb-2 text-xl font-semibold text-destructive'>
            Error al cargar productos
          </h3>
          <p className='text-muted-foreground'>{error}</p>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className='rounded-lg border border-border p-12 text-center shadow-sm'>
          <div className='mb-4 flex items-center justify-center text-muted-foreground opacity-60'>
            <PackageIcon size={48} />
          </div>
          <h3 className='font-heading mb-2 text-xl font-semibold text-foreground'>
            No hay productos
          </h3>
          <p className='text-muted-foreground'>
            No se encontraron productos que coincidan con los criterios de
            búsqueda
          </p>
        </div>
      );
    }

    return (
      <div className='flex flex-col gap-4'>
        {/* Header bar */}
        <div className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-white p-4 shadow-sm max-md:flex-col'>
          <div className='flex items-center gap-4 max-md:justify-center max-md:gap-2'>
            <span className='flex items-center gap-2 rounded-md bg-brand-purple px-3 py-2 text-sm font-medium text-white shadow-sm'>
              <ListIcon size={16} />
              Vista de Lista
            </span>
            <span className='text-sm font-medium text-muted-foreground'>
              Mostrando {products.length} de {total} productos
            </span>
          </div>
        </div>

        {/* Table */}
        <div className='overflow-hidden rounded-lg border border-border bg-white shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='sticky top-0 z-10 border-b border-border bg-muted font-medium text-foreground'>
                <tr>
                  <th className='w-[60px] px-4 py-4 text-left'>Imagen</th>
                  <th
                    className='cursor-pointer select-none px-4 py-4 text-left hover:text-brand-purple'
                    onClick={() => handleSort('name')}
                  >
                    <span className='flex items-center gap-1'>
                      Producto <SortIndicator field='name' />
                    </span>
                  </th>
                  <th
                    className='cursor-pointer select-none px-4 py-4 text-left hover:text-brand-purple'
                    onClick={() => handleSort('category')}
                  >
                    <span className='flex items-center gap-1'>
                      Categoría <SortIndicator field='category' />
                    </span>
                  </th>
                  <th
                    className='cursor-pointer select-none px-4 py-4 text-left hover:text-brand-purple'
                    onClick={() => handleSort('price')}
                  >
                    <span className='flex items-center gap-1'>
                      Precio <SortIndicator field='price' />
                    </span>
                  </th>
                  <th
                    className='cursor-pointer select-none px-4 py-4 text-left hover:text-brand-purple'
                    onClick={() => handleSort('stockQuantity')}
                  >
                    <span className='flex items-center gap-1'>
                      Stock <SortIndicator field='stockQuantity' />
                    </span>
                  </th>
                  <th
                    className='cursor-pointer select-none px-4 py-4 text-left hover:text-brand-purple'
                    onClick={() => handleSort('rating')}
                  >
                    <span className='flex items-center gap-1'>
                      Rating <SortIndicator field='rating' />
                    </span>
                  </th>
                  <th
                    className='cursor-pointer select-none px-4 py-4 text-left hover:text-brand-purple'
                    onClick={() => handleSort('createdAt')}
                  >
                    <span className='flex items-center gap-1'>
                      Creado <SortIndicator field='createdAt' />
                    </span>
                  </th>
                  <th
                    className='cursor-pointer select-none px-4 py-4 text-left hover:text-brand-purple'
                    onClick={() => handleSort('isActive')}
                  >
                    <span className='flex items-center gap-1'>
                      Estado <SortIndicator field='isActive' />
                    </span>
                  </th>
                  <th className='px-4 py-4 text-left'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => {
                  const isLowStock =
                    product.stockQuantity <= 10 && product.stockQuantity > 0;
                  const isOutOfStock = product.stockQuantity === 0;
                  return (
                    <tr
                      key={product.id}
                      tabIndex={0}
                      className={cn(
                        'border-b border-border transition-all last:border-0 hover:-translate-y-px hover:bg-muted focus-within:bg-muted',
                        i % 2 === 0 ? 'bg-white' : 'bg-muted/40'
                      )}
                    >
                      {/* Image */}
                      <td className='px-4 py-4'>
                        <div className='flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-md border border-border bg-muted'>
                          {product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className='h-full w-full object-cover'
                            />
                          ) : (
                            <PackageIcon size={24} className='text-muted-foreground' />
                          )}
                        </div>
                      </td>

                      {/* Name + SKU */}
                      <td className='px-4 py-4'>
                        <div className='flex flex-col gap-1'>
                          <span className='font-medium leading-snug text-foreground'>
                            {product.name}
                          </span>
                          <span className='font-mono text-xs text-muted-foreground'>
                            {product.sku}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className='px-4 py-4 text-muted-foreground'>
                        {product.category?.name ?? 'Sin categoría'}
                      </td>

                      {/* Price */}
                      <td className='px-4 py-4'>
                        <div className='flex flex-col gap-1'>
                          <span className='font-semibold text-brand-purple'>
                            {CURRENCY_SYMBOL} {product.currentPrice}
                          </span>
                          {product.hasDiscount ? (
                            <>
                              <span className='text-xs text-muted-foreground line-through'>
                                {CURRENCY_SYMBOL} {product.price}
                              </span>
                              <span className='inline-block rounded-full bg-[#FF6B6B] px-2 py-0.5 text-center text-xs font-medium text-white shadow-sm'>
                                -{product.discountPercentage}%
                              </span>
                            </>
                          ) : null}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className='px-4 py-4'>
                        <span
                          className={cn(
                            'flex items-center gap-1 font-medium',
                            isOutOfStock
                              ? 'text-destructive'
                              : isLowStock
                                ? 'text-yellow-500'
                                : 'text-green-500'
                          )}
                        >
                          {isOutOfStock ? (
                            <XCircleIcon size={14} />
                          ) : isLowStock ? (
                            <AlertTriangleIcon size={14} />
                          ) : (
                            <CheckCircleIcon size={14} />
                          )}
                          {product.stockQuantity}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className='px-4 py-4'>
                        <span className='flex items-center gap-1'>
                          <StarIcon size={14} className='text-yellow-400' />
                          <span>{product.rating?.toFixed(1) ?? 'N/A'}</span>
                          <span className='text-muted-foreground'>
                            ({product.reviewCount})
                          </span>
                        </span>
                      </td>

                      {/* Created */}
                      <td className='px-4 py-4 text-muted-foreground'>
                        {new Date(product.createdAt).toLocaleDateString('es-ES')}
                      </td>

                      {/* Status */}
                      <td className='px-4 py-4'>
                        <span
                          className={cn(
                            'inline-block rounded-full border px-2 py-0.5 text-center text-xs font-medium',
                            product.isActive
                              ? 'border-green-500/30 bg-green-500/15 text-green-600'
                              : 'border-yellow-500/30 bg-yellow-500/15 text-yellow-600'
                          )}
                        >
                          {product.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className='px-4 py-4'>
                        <div className='flex gap-1'>
                          <ActionBtn
                            onClick={() => onViewDetails(product.id)}
                            title='Ver detalles'
                            className='border-border bg-muted text-blue-500 hover:border-blue-500 hover:bg-blue-500/10'
                          >
                            <EyeIcon size={16} />
                          </ActionBtn>
                          <ActionBtn
                            onClick={() => onEdit(product.id)}
                            title='Editar'
                            className='border-border bg-muted text-brand-purple hover:border-brand-purple hover:bg-brand-purple/10'
                          >
                            <EditIcon size={16} />
                          </ActionBtn>
                          <ActionBtn
                            onClick={() =>
                              onToggleStatus(product.id, !product.isActive)
                            }
                            title={product.isActive ? 'Desactivar' : 'Activar'}
                            className='border-border bg-muted text-yellow-500 hover:border-yellow-500 hover:bg-yellow-500/10'
                          >
                            {product.isActive ? (
                              <XCircleIcon size={16} />
                            ) : (
                              <CheckCircleIcon size={16} />
                            )}
                          </ActionBtn>
                          <ActionBtn
                            onClick={() => onDelete(product.id)}
                            title='Eliminar'
                            className='border-border bg-muted text-destructive hover:border-destructive hover:bg-destructive/10'
                          >
                            <Trash2Icon size={16} />
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 ? (
          <div className='flex flex-wrap items-center justify-center gap-3 rounded-lg border border-border bg-white p-4 shadow-sm max-md:gap-2'>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='rounded-md border border-border bg-muted px-3 py-2 text-sm transition-all hover:-translate-y-px hover:border-brand-purple hover:bg-brand-purple/10 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50'
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={cn(
                  'rounded-md border px-3 py-2 text-sm transition-all',
                  page === currentPage
                    ? 'border-brand-purple bg-brand-purple text-white'
                    : 'border-border bg-muted text-foreground hover:-translate-y-px hover:border-brand-purple hover:bg-brand-purple/10 hover:shadow-sm'
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasMore}
              className='rounded-md border border-border bg-muted px-3 py-2 text-sm transition-all hover:-translate-y-px hover:border-brand-purple hover:bg-brand-purple/10 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50'
            >
              Siguiente
            </button>
          </div>
        ) : null}
      </div>
    );
  }
);
ProductListView.displayName = 'ProductListView';
