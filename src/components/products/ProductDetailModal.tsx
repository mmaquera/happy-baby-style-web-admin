import { useState } from 'react';
import type React from 'react';
import XIcon from 'lucide-react/dist/esm/icons/x';
import EyeIcon from 'lucide-react/dist/esm/icons/eye';
import Edit3Icon from 'lucide-react/dist/esm/icons/edit-3';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import TagIcon from 'lucide-react/dist/esm/icons/tag';
import HashIcon from 'lucide-react/dist/esm/icons/hash';
import FileTextIcon from 'lucide-react/dist/esm/icons/file-text';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import StarIcon from 'lucide-react/dist/esm/icons/star';
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar';
import BarChart3Icon from 'lucide-react/dist/esm/icons/bar-chart-3';
import MessageSquareIcon from 'lucide-react/dist/esm/icons/message-square';
import TrendingUpIcon from 'lucide-react/dist/esm/icons/trending-up';
import MapPinIcon from 'lucide-react/dist/esm/icons/map-pin';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import ActivityIcon from 'lucide-react/dist/esm/icons/activity';
import AlertCircleIcon from 'lucide-react/dist/esm/icons/alert-circle';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import ThumbsUpIcon from 'lucide-react/dist/esm/icons/thumbs-up';
import DatabaseIcon from 'lucide-react/dist/esm/icons/database';
import ShoppingBagIcon from 'lucide-react/dist/esm/icons/shopping-bag';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type {
  Product,
  ProductReview,
  InventoryTransaction,
  StockAlert,
  AppEvent,
} from './types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
}

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className='rounded-lg border border-border bg-muted p-4'>
    <h3 className='font-heading mb-3 flex items-center gap-2 text-lg font-semibold text-foreground'>
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <StarIcon
      key={i}
      size={16}
      className={
        i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-border'
      }
    />
  ));

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onEdit,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const currentPrice = parseFloat(product.currentPrice?.toString() ?? '0');
  const originalPrice = parseFloat(product.price?.toString() ?? '0');
  const isLowStock =
    product.stockQuantity > 0 && product.stockQuantity <= 10;

  const handleEdit = () => {
    onEdit(product);
    onClose();
  };

  return (
    <div className='fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[8px]'>
      <div className='relative z-[501] flex max-h-[90vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]'>
        {/* Sticky header */}
        <div className='sticky top-0 z-[502] flex items-center justify-between border-b border-border bg-white px-6 py-6'>
          <h2 className='font-heading flex items-center gap-2 text-xl font-semibold text-foreground'>
            <EyeIcon size={24} />
            Detalles del Producto
          </h2>
          <button
            onClick={onClose}
            className='flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className='overflow-y-auto px-6 py-6'>
          {/* Product hero */}
          <div className='mb-6 grid gap-6 max-md:grid-cols-1 md:grid-cols-[300px_1fr]'>
            {/* Images */}
            <div className='flex flex-col gap-3'>
              <div className='h-[300px] w-full overflow-hidden rounded-lg border-2 border-border'>
                <img
                  src={
                    product.images[selectedImageIndex] ??
                    'https://via.placeholder.com/300x300'
                  }
                  alt={product.name}
                  className='h-full w-full object-cover'
                />
              </div>
              {product.images.length > 1 ? (
                <div className='grid grid-cols-4 gap-2'>
                  {product.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={cn(
                        'h-[60px] w-full cursor-pointer overflow-hidden rounded-md border-2 transition-all',
                        idx === selectedImageIndex
                          ? 'border-brand-purple'
                          : 'border-border hover:border-brand-purple'
                      )}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className='h-full w-full object-cover'
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Info */}
            <div className='flex flex-col gap-4'>
              <div>
                <h1 className='font-heading text-2xl font-bold text-foreground'>
                  {product.name}
                </h1>
                <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                  <HashIcon size={16} />
                  SKU: {product.sku}
                </div>
              </div>

              {/* Price */}
              <div className='flex items-baseline gap-3'>
                <span className='font-heading text-2xl font-bold text-brand-purple'>
                  S/ {currentPrice.toFixed(2)}
                </span>
                {product.hasDiscount ? (
                  <>
                    <span className='text-lg text-muted-foreground line-through'>
                      S/ {originalPrice.toFixed(2)}
                    </span>
                    <span className='rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white'>
                      -{product.discountPercentage}%
                    </span>
                  </>
                ) : null}
              </div>

              {/* Badges */}
              <div className='flex gap-2'>
                <span
                  className={cn(
                    'self-start rounded-full px-2 py-0.5 text-xs font-medium text-white',
                    product.isActive ? 'bg-green-500' : 'bg-destructive'
                  )}
                >
                  {product.isActive ? 'Activo' : 'Inactivo'}
                </span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium text-white',
                    !product.isInStock
                      ? 'bg-destructive'
                      : isLowStock
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  )}
                >
                  {!product.isInStock
                    ? 'Sin Stock'
                    : isLowStock
                      ? 'Stock Bajo'
                      : 'En Stock'}
                </span>
              </div>

              <div className='flex items-center gap-2 text-sm text-foreground'>
                <PackageIcon size={16} />
                Stock disponible: {product.stockQuantity} unidades
              </div>

              {product.rating ? (
                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-0.5'>
                    {renderStars(
                      Math.round(parseFloat(product.rating.toString()))
                    )}
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    ({product.reviewCount} reseñas)
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Content grid */}
          <div className='grid gap-6 max-md:grid-cols-1 md:grid-cols-[2fr_1fr]'>
            {/* Main content */}
            <div className='flex flex-col gap-6'>
              <Section title='Descripción' icon={<FileTextIcon size={20} />}>
                <p className='m-0 text-base leading-relaxed text-muted-foreground'>
                  {product.description ??
                    'No hay descripción disponible para este producto.'}
                </p>
              </Section>

              {product.tags.length > 0 ? (
                <Section title='Etiquetas' icon={<TagIcon size={20} />}>
                  <div className='flex flex-wrap gap-2'>
                    {product.tags.map(tag => (
                      <span
                        key={tag}
                        className='rounded-full bg-brand-purple px-2 py-0.5 text-xs font-medium text-white'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Section>
              ) : null}

              {product.variants.length > 0 ? (
                <Section
                  title={`Variantes (${product.variants.length})`}
                  icon={<PackageIcon size={20} />}
                >
                  <div className='grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]'>
                    {product.variants.map(v => (
                      <div
                        key={v.id}
                        className={cn(
                          'rounded-md border p-3',
                          v.isActive
                            ? 'border-brand-purple bg-white'
                            : 'border-border bg-white opacity-70'
                        )}
                      >
                        <div className='mb-2 text-sm font-medium text-foreground'>
                          {v.name}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          S/ {parseFloat(v.price.toString()).toFixed(2)}
                        </div>
                        <div className='mt-1 text-xs text-muted-foreground'>
                          Stock: {v.stockQuantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}

              {product.attributes &&
              Object.keys(product.attributes).length > 0 ? (
                <Section
                  title='Atributos'
                  icon={<SettingsIcon size={20} />}
                >
                  <div className='grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]'>
                    {Object.entries(product.attributes).map(([k, v]) => (
                      <div
                        key={k}
                        className='rounded-md bg-white p-2 text-sm'
                      >
                        <strong>{k}:</strong> {String(v)}
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}

              {product.reviews && product.reviews.length > 0 ? (
                <Section
                  title={`Reseñas (${product.reviews.length})`}
                  icon={<MessageSquareIcon size={20} />}
                >
                  <div className='flex flex-col gap-3'>
                    {product.reviews
                      .slice(0, 5)
                      .map((review: ProductReview) => (
                        <div
                          key={review.id}
                          className='rounded-md border border-border bg-white p-3'
                        >
                          <div className='mb-2 flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <UserIcon size={16} />
                              <span className='font-medium'>
                                {review.user?.firstName ?? 'Usuario'}{' '}
                                {review.user?.lastName ?? ''}
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <div className='flex gap-0.5'>
                                {renderStars(review.rating)}
                              </div>
                              <span className='text-sm text-muted-foreground'>
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {review.title ? (
                            <div className='mb-1 font-medium'>
                              {review.title}
                            </div>
                          ) : null}
                          {review.comment ? (
                            <div className='leading-snug text-muted-foreground'>
                              {review.comment}
                            </div>
                          ) : null}
                          <div className='mt-2 flex items-center gap-2 text-sm'>
                            <span className='flex items-center gap-1'>
                              <ThumbsUpIcon size={14} />
                              {review.helpfulCount} útil
                            </span>
                            {review.isVerified ? (
                              <span className='flex items-center gap-1 text-green-600'>
                                <CheckCircleIcon size={14} />
                                Verificado
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    {product.reviews.length > 5 ? (
                      <p className='p-2 text-center text-sm text-muted-foreground'>
                        Mostrando 5 de {product.reviews.length} reseñas
                      </p>
                    ) : null}
                  </div>
                </Section>
              ) : null}

              {product.inventoryTransactions &&
              product.inventoryTransactions.length > 0 ? (
                <Section
                  title={`Transacciones de Inventario (${product.inventoryTransactions.length})`}
                  icon={<ActivityIcon size={20} />}
                >
                  <div className='flex flex-col gap-2'>
                    {product.inventoryTransactions
                      .slice(0, 10)
                      .map((t: InventoryTransaction) => (
                        <div
                          key={t.id}
                          className='flex items-center justify-between rounded-md border border-border bg-white p-2'
                        >
                          <div className='flex items-center gap-2'>
                            <DatabaseIcon size={16} />
                            <div>
                              <div className='font-medium'>{t.type}</div>
                              <div className='text-sm text-muted-foreground'>
                                {t.quantity} unidades
                              </div>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='text-sm text-muted-foreground'>
                              {new Date(t.createdAt).toLocaleDateString()}
                            </div>
                            {t.reference ? (
                              <div className='text-xs text-muted-foreground'>
                                Ref: {t.reference}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    {product.inventoryTransactions.length > 10 ? (
                      <p className='p-2 text-center text-sm text-muted-foreground'>
                        Mostrando 10 de{' '}
                        {product.inventoryTransactions.length} transacciones
                      </p>
                    ) : null}
                  </div>
                </Section>
              ) : null}

              {product.stockAlerts && product.stockAlerts.length > 0 ? (
                <Section
                  title={`Alertas de Stock (${product.stockAlerts.length})`}
                  icon={<AlertCircleIcon size={20} />}
                >
                  <div className='flex flex-col gap-2'>
                    {product.stockAlerts.map((alert: StockAlert) => (
                      <div
                        key={alert.id}
                        className={cn(
                          'rounded-md border p-3',
                          alert.isActive
                            ? 'border-yellow-400/40 bg-yellow-400/20'
                            : 'border-border bg-muted'
                        )}
                      >
                        <div className='mb-1 flex items-center justify-between'>
                          <span className='font-medium text-yellow-600'>
                            {alert.type === 'low_stock'
                              ? 'Stock Bajo'
                              : alert.type === 'out_of_stock'
                                ? 'Sin Stock'
                                : alert.type === 'overstock'
                                  ? 'Sobre Stock'
                                  : alert.type}
                          </span>
                          <span
                            className={cn(
                              'rounded px-1.5 py-0.5 text-xs',
                              alert.isActive
                                ? 'bg-yellow-500 text-white'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {alert.isActive ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          Umbral: {alert.threshold} | Stock actual:{' '}
                          {alert.currentStock}
                        </p>
                        <p className='mt-1 text-xs text-muted-foreground'>
                          Creada:{' '}
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}

              {product.appEvents && product.appEvents.length > 0 ? (
                <Section
                  title={`Actividad Reciente (${product.appEvents.length})`}
                  icon={<TrendingUpIcon size={20} />}
                >
                  <div className='flex flex-col gap-2'>
                    {product.appEvents.slice(0, 5).map((ev: AppEvent) => (
                      <div
                        key={ev.id}
                        className='rounded-md border border-border bg-white p-2'
                      >
                        <div className='flex items-center justify-between'>
                          <span className='flex items-center gap-2 font-medium'>
                            <ActivityIcon size={16} />
                            {ev.eventType}
                          </span>
                          <span className='text-sm text-muted-foreground'>
                            {new Date(ev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {Boolean(ev.eventData) ? (
                          <p className='mt-1 text-sm text-muted-foreground'>
                            {JSON.stringify(ev.eventData)}
                          </p>
                        ) : null}
                      </div>
                    ))}
                    {product.appEvents.length > 5 ? (
                      <p className='p-2 text-center text-sm text-muted-foreground'>
                        Mostrando 5 de {product.appEvents.length} eventos
                      </p>
                    ) : null}
                  </div>
                </Section>
              ) : null}
            </div>

            {/* Sidebar */}
            <div className='flex flex-col gap-4'>
              {product.category ? (
                <Section title='Categoría' icon={<MapPinIcon size={20} />}>
                  <div className='rounded-md bg-white p-2 text-sm'>
                    {product.category.name}
                  </div>
                </Section>
              ) : null}

              <Section title='Uso del Producto' icon={<BarChart3Icon size={20} />}>
                <div className='grid grid-cols-2 gap-3'>
                  {[
                    { value: product.reviewCount, label: 'Reseñas' },
                    { value: product.totalStock, label: 'Stock Total' },
                    { value: product.variants.length, label: 'Variantes' },
                    {
                      value: product.favorites?.length ?? 0,
                      label: 'Favoritos',
                    },
                    {
                      value: product.cartItems?.length ?? 0,
                      label: 'En Carrito',
                    },
                    {
                      value: product.orderItems?.length ?? 0,
                      label: 'Pedidos',
                    },
                  ].map(({ value, label }) => (
                    <div
                      key={label}
                      className='rounded-md border border-border bg-white p-3 text-center'
                    >
                      <div className='font-heading text-xl font-bold text-brand-purple'>
                        {value}
                      </div>
                      <div className='text-xs uppercase tracking-wide text-muted-foreground'>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section
                title='Resumen de Inventario'
                icon={<ShoppingBagIcon size={20} />}
              >
                <div className='flex flex-col gap-2'>
                  {[
                    { label: 'Stock Principal:', value: product.stockQuantity },
                    { label: 'Stock Total:', value: product.totalStock },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className='flex items-center justify-between rounded-md bg-white p-2 text-sm'
                    >
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                  <div className='flex items-center justify-between rounded-md bg-white p-2 text-sm'>
                    <span>Estado:</span>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-xs',
                        product.isInStock
                          ? 'bg-green-500/20 text-green-700'
                          : 'bg-destructive/20 text-destructive'
                      )}
                    >
                      {product.isInStock ? 'Disponible' : 'Agotado'}
                    </span>
                  </div>
                </div>
              </Section>

              <Section title='Fechas' icon={<CalendarIcon size={20} />}>
                <div className='flex flex-col gap-2 text-sm'>
                  <div>
                    <strong>Creado:</strong>{' '}
                    {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Actualizado:</strong>{' '}
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className='sticky bottom-0 z-[502] flex justify-end gap-3 border-t border-border bg-muted px-6 py-6'>
          <Button type='button' variant='outline' onClick={onClose}>
            Cerrar
          </Button>
          <Button type='button' variant='primary' onClick={handleEdit}>
            <Edit3Icon size={16} />
            Editar Producto
          </Button>
        </div>
      </div>
    </div>
  );
};
