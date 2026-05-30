import type React from 'react';
import { useState, useCallback } from 'react';
import ArrowLeftIcon from 'lucide-react/dist/esm/icons/arrow-left';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import XCircleIcon from 'lucide-react/dist/esm/icons/x-circle';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import StarIcon from 'lucide-react/dist/esm/icons/star';
import EditIcon from 'lucide-react/dist/esm/icons/edit';
import Trash2Icon from 'lucide-react/dist/esm/icons/trash-2';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import DownloadIcon from 'lucide-react/dist/esm/icons/download';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useParams, useNavigate } from 'react-router-dom';
import { logger } from '@/utils/logger';

const mockProduct = {
  id: '1',
  name: 'Body Orgánico para Recién Nacido',
  description:
    'Body 100% algodón orgánico, suave y transpirable para la piel sensible del bebé. Diseñado con costuras planas para evitar irritaciones y etiquetas removibles para mayor comodidad.',
  price: 25.99,
  salePrice: 19.99,
  sku: 'BODY-ORG-001',
  images: [
    'https://via.placeholder.com/400x400/FFB6C1/000000?text=Body+Bebe+1',
    'https://via.placeholder.com/400x400/FFB6C1/000000?text=Body+Bebe+2',
    'https://via.placeholder.com/400x400/FFB6C1/000000?text=Body+Bebe+3',
  ],
  stockQuantity: 45,
  isActive: true,
  rating: 4.8,
  reviewCount: 127,
  tags: ['orgánico', 'recién nacido', 'algodón', 'hipoalergénico'],
  category: { name: 'Ropa para Bebés', slug: 'ropa-bebes' },
  attributes: {
    material: '100% Algodón Orgánico',
    talla: '0-3 meses',
    peso: '80g',
    lavado: 'Lavable a máquina 30°C',
    certificaciones: 'GOTS, OEKO-TEX',
  },
  variants: [
    {
      id: '1',
      name: 'Blanco',
      price: 19.99,
      stockQuantity: 20,
      isActive: true,
    },
    {
      id: '2',
      name: 'Azul Claro',
      price: 19.99,
      stockQuantity: 15,
      isActive: true,
    },
    {
      id: '3',
      name: 'Rosa Suave',
      price: 19.99,
      stockQuantity: 10,
      isActive: true,
    },
  ],
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z',
};

export const ProductDetail: React.FC = () => {
  const { id: _id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const product = mockProduct;

  const handleBack = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  const handleEdit = useCallback(() => {
    logger.debug('Edit product:', product.id);
  }, [product.id]);

  const handleDelete = useCallback(() => {
    if (
      window.confirm('¿Estás seguro de que quieres eliminar este producto?')
    ) {
      logger.debug('Delete product:', product.id);
      navigate('/products');
    }
  }, [product.id, navigate]);

  const handleToggleStatus = useCallback(() => {
    logger.debug('Toggle status:', product.id, !product.isActive);
  }, [product.id, product.isActive]);

  const isLowStock = product.stockQuantity <= 10 && product.stockQuantity > 0;
  const isOutOfStock = product.stockQuantity === 0;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const stockClass = isOutOfStock
    ? 'bg-destructive/20 text-destructive'
    : isLowStock
      ? 'bg-yellow-500/20 text-yellow-600'
      : 'bg-green-500/20 text-green-600';

  return (
    <div className='mx-auto max-w-[1400px] px-6 py-6 max-md:px-4'>
      <Button variant='ghost' onClick={handleBack} className='mb-4'>
        <ArrowLeftIcon size={16} />
        Volver a Productos
      </Button>

      {/* Product Header */}
      <div className='mb-6 flex flex-wrap items-start justify-between gap-4'>
        <div className='flex-1'>
          <h1 className='m-0 mb-2 font-heading text-3xl font-bold leading-[1.2] text-foreground'>
            {product.name}
          </h1>
          <p className='mb-3 mt-0 text-lg text-muted-foreground'>
            {product.description}
          </p>
          <div className='flex flex-wrap gap-4'>
            {[
              ['SKU', product.sku],
              ['Categoría', product.category.name],
            ].map(([label, val]) => (
              <div
                key={label}
                className='flex items-center gap-2 text-sm text-muted-foreground'
              >
                <span>{label}:</span>
                <strong className='text-foreground'>{val}</strong>
              </div>
            ))}
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <span>Estado:</span>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                  product.isActive
                    ? 'bg-green-500/20 text-green-600'
                    : 'bg-yellow-500/20 text-yellow-600'
                )}
              >
                {product.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-3'>
          <Button variant='outline' onClick={handleToggleStatus}>
            {product.isActive ? 'Desactivar' : 'Activar'}
          </Button>
          <Button variant='secondary' onClick={handleEdit}>
            <EditIcon size={16} />
            Editar
          </Button>
          <Button variant='danger' onClick={handleDelete}>
            <Trash2Icon size={16} />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='mb-8 grid gap-8 max-lg:grid-cols-1 lg:grid-cols-2'>
        {/* Image Section */}
        <div className='sticky top-6'>
          <div className='mb-4 h-[400px] w-full overflow-hidden rounded-xl bg-muted'>
            <img
              src={product.images[selectedImage]}
              alt={`${product.name} - Imagen ${selectedImage + 1}`}
              className='h-full w-full object-cover'
            />
          </div>
          <div className='grid grid-cols-4 gap-2'>
            {product.images.map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  'h-20 w-full cursor-pointer overflow-hidden rounded-lg border-2 transition-all hover:scale-105',
                  index === selectedImage
                    ? 'border-brand-purple'
                    : 'border-border'
                )}
              >
                <img
                  src={image}
                  alt={`${product.name} - Thumbnail ${index + 1}`}
                  className='h-full w-full object-cover'
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className='flex flex-col gap-6'>
          {/* Price */}
          <div className='mb-4 flex items-center gap-4'>
            <div className='text-3xl font-bold text-brand-purple'>
              S/ {product.salePrice ?? product.price}
            </div>
            {hasDiscount ? (
              <>
                <div className='text-xl text-muted-foreground line-through'>
                  S/ {product.price}
                </div>
                <div className='rounded-full bg-[#FF7B5A] px-3 py-1 text-sm font-medium text-white'>
                  -{discountPercentage}%
                </div>
              </>
            ) : null}
          </div>

          {/* Stock status */}
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
              stockClass
            )}
          >
            {isOutOfStock ? (
              <XCircleIcon size={16} />
            ) : isLowStock ? (
              <AlertTriangleIcon size={16} />
            ) : (
              <CheckCircleIcon size={16} />
            )}
            {isOutOfStock
              ? 'Sin stock'
              : isLowStock
                ? 'Stock bajo'
                : 'En stock'}
            <span>({product.stockQuantity} unidades)</span>
          </span>

          {/* Rating */}
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex items-center gap-0.5'>
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon
                  key={i}
                  size={20}
                  className='text-yellow-500'
                  fill={i < Math.floor(product.rating) ? '#eab308' : 'none'}
                />
              ))}
            </div>
            <span className='text-muted-foreground'>
              {product.rating} ({product.reviewCount} reseñas)
            </span>
          </div>

          {/* Tags */}
          <div className='mb-4 flex flex-wrap gap-2'>
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className='rounded-full bg-brand-purple/10 px-2 py-1 text-sm text-muted-foreground'
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Attributes */}
          <div className='mb-4'>
            <h3 className='mb-3 mt-0 text-base font-semibold text-foreground'>
              Especificaciones
            </h3>
            <div className='grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]'>
              {Object.entries(product.attributes).map(([key, value]) => (
                <div
                  key={key}
                  className='flex justify-between rounded-lg bg-muted px-3 py-2 text-sm'
                >
                  <span className='font-medium text-muted-foreground'>
                    {key}:
                  </span>
                  <span className='text-foreground'>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Variants */}
          {product.variants.length > 0 ? (
            <div className='mb-4'>
              <h3 className='mb-3 mt-0 text-base font-semibold text-foreground'>
                Variantes Disponibles
              </h3>
              <div className='grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]'>
                {product.variants.map(variant => (
                  <Card
                    key={variant.id}
                    className={cn(
                      'cursor-pointer border-2 p-3 text-center transition-all hover:-translate-y-0.5',
                      variant.isActive ? 'border-brand-purple' : 'border-border'
                    )}
                  >
                    <div className='mb-1 font-medium text-foreground'>
                      {variant.name}
                    </div>
                    <div className='text-sm font-medium text-brand-purple'>
                      S/ {variant.price}
                    </div>
                    <div className='mt-1 text-xs text-muted-foreground'>
                      Stock: {variant.stockQuantity}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Additional Info */}
      <div className='mb-8 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]'>
        {[
          {
            icon: <PackageIcon size={20} />,
            title: 'Información del Producto',
            content: [
              [
                'Fecha de creación',
                new Date(product.createdAt).toLocaleDateString('es-ES'),
              ],
              [
                'Última actualización',
                new Date(product.updatedAt).toLocaleDateString('es-ES'),
              ],
              ['Total de variantes', String(product.variants.length)],
              [
                'Estado del producto',
                product.isActive ? 'Activo en el catálogo' : 'Inactivo',
              ],
            ],
          },
          {
            icon: <SettingsIcon size={20} />,
            title: 'Categorización',
            content: [
              ['Categoría principal', product.category.name],
              ['Etiquetas', product.tags.join(', ')],
              ['SKU', product.sku],
              ['Tipo', 'Producto físico'],
            ],
          },
          {
            icon: <DownloadIcon size={20} />,
            title: 'Información de Precios',
            content: [
              ['Precio base', `S/ ${product.price}`],
              ...(hasDiscount
                ? [
                    ['Precio de oferta', `S/ ${product.salePrice}`] as [
                      string,
                      string,
                    ],
                  ]
                : []),
              [
                'Descuento',
                hasDiscount ? `${discountPercentage}%` : 'Sin descuento',
              ],
              ['Margen estimado', '35%'],
            ],
          },
        ].map(section => (
          <Card key={section.title} className='h-fit'>
            <h3 className='mb-3 mt-0 flex items-center gap-2 font-heading text-lg font-semibold text-foreground'>
              {section.icon}
              {section.title}
            </h3>
            <div className='flex flex-col gap-1 text-sm text-muted-foreground'>
              {section.content.map(([label, value]) => (
                <p key={label} className='m-0'>
                  <strong className='text-foreground'>{label}:</strong> {value}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
