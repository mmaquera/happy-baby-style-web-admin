import { memo } from 'react';
import XIcon from 'lucide-react/dist/esm/icons/x';
import EyeIcon from 'lucide-react/dist/esm/icons/eye';
import HashIcon from 'lucide-react/dist/esm/icons/hash';
import ImageIcon from 'lucide-react/dist/esm/icons/image';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import SortAscIcon from 'lucide-react/dist/esm/icons/sort-asc';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import XCircleIcon from 'lucide-react/dist/esm/icons/x-circle';
import LinkIcon from 'lucide-react/dist/esm/icons/link';
import Edit3Icon from 'lucide-react/dist/esm/icons/edit-3';
import { cn } from '@happy-baby/shared-utils';
import { Card } from '@happy-baby/shared-ui';
import { Button } from '@happy-baby/shared-ui';
import type { Category } from '../types/category';

interface CategoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onEdit: (category: Category) => void;
}

const formatDate = (dateString: string | Date) =>
  new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const InfoCard = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className='rounded-md border border-border bg-muted/30 p-4'>
    <div className='mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
      {label}
    </div>
    <div className='text-base font-medium text-foreground'>{children}</div>
  </div>
);

const SectionTitle = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <h3 className='font-heading mb-4 flex items-center gap-2 border-b border-border pb-2 text-lg font-medium text-foreground'>
    {icon}
    {children}
  </h3>
);

export const CategoryDetailModal = memo<CategoryDetailModalProps>(
  ({ isOpen, onClose, category, onEdit }) => {
    if (!isOpen || !category) return null;

    return (
      <div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
        onClick={onClose}
      >
        <Card
          className='max-h-[90vh] w-full max-w-3xl overflow-y-auto p-0 shadow-2xl'
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className='sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4'>
            <h2 className='font-heading flex items-center gap-2 text-xl font-semibold text-foreground'>
              <EyeIcon size={24} />
              Detalle de Categoría
            </h2>
            <button
              onClick={onClose}
              className='rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
            >
              <XIcon size={20} />
            </button>
          </div>

          <div className='p-6'>
            {/* System info */}
            <section className='mb-6'>
              <SectionTitle icon={<SettingsIcon size={20} />}>
                Información del Sistema
              </SectionTitle>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <InfoCard label='ID de Categoría'>{category.id}</InfoCard>
                <InfoCard label='Estado'>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                      category.isActive
                        ? 'border-green-300 bg-green-50 text-green-700'
                        : 'border-red-300 bg-red-50 text-red-700'
                    )}
                  >
                    {category.isActive ? (
                      <>
                        <CheckCircleIcon size={14} />
                        Activa
                      </>
                    ) : (
                      <>
                        <XCircleIcon size={14} />
                        Inactiva
                      </>
                    )}
                  </span>
                </InfoCard>
                <InfoCard label='Fecha de Creación'>
                  {formatDate(category.createdAt)}
                </InfoCard>
                <InfoCard label='Última Actualización'>
                  {formatDate(category.updatedAt)}
                </InfoCard>
              </div>
            </section>

            {/* Basic info */}
            <section className='mb-6'>
              <SectionTitle icon={<HashIcon size={20} />}>
                Información Básica
              </SectionTitle>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <InfoCard label='Nombre'>{category.name}</InfoCard>
                <InfoCard label='Slug'>
                  <span className='flex items-center gap-1'>
                    <LinkIcon size={14} />
                    {category.slug}
                  </span>
                </InfoCard>
                <InfoCard label='Descripción'>
                  {category.description ? (
                    category.description
                  ) : (
                    <span className='italic text-muted-foreground'>
                      Sin descripción
                    </span>
                  )}
                </InfoCard>
                <InfoCard label='Orden de Clasificación'>
                  <span className='flex items-center gap-1'>
                    <SortAscIcon size={14} />
                    {category.sortOrder}
                  </span>
                </InfoCard>
              </div>
            </section>

            {/* Image */}
            <section className='mb-6'>
              <SectionTitle icon={<ImageIcon size={20} />}>Imagen</SectionTitle>
              <div className='flex items-center gap-4'>
                {category.image ? (
                  <>
                    <img
                      src={category.image}
                      alt={category.name}
                      className='h-16 w-16 rounded-md border-2 border-border object-cover'
                    />
                    <div>
                      <p className='mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                        URL de Imagen
                      </p>
                      <p className='break-all text-sm text-foreground'>
                        {category.image}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='flex h-16 w-16 items-center justify-center rounded-md border-2 border-dashed border-border bg-muted text-muted-foreground'>
                      <ImageIcon size={24} />
                    </div>
                    <p className='text-sm italic text-muted-foreground'>
                      No se ha configurado imagen
                    </p>
                  </>
                )}
              </div>
            </section>

            {/* Products */}
            <section className='mb-6'>
              <SectionTitle icon={<PackageIcon size={20} />}>
                Productos en esta Categoría
              </SectionTitle>
              {category.productCount > 0 ? (
                <InfoCard label='Total de productos'>
                  {category.productCount}
                </InfoCard>
              ) : (
                <div className='py-8 text-center text-muted-foreground'>
                  <PackageIcon size={48} className='mx-auto mb-2 opacity-50' />
                  <p>No hay productos en esta categoría</p>
                  <p className='mt-1 text-xs'>
                    Los productos aparecerán aquí cuando sean agregados
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-between border-t border-border bg-muted/30 px-6 py-4'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <span>ID: {category.id}</span>
              <span>•</span>
              <span>Slug: {category.slug}</span>
            </div>
            <div className='flex gap-3'>
              <Button variant='outline' onClick={() => onEdit(category)}>
                <Edit3Icon size={16} className='mr-1.5' />
                Editar
              </Button>
              <Button variant='outline' onClick={onClose}>
                Cerrar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
);
CategoryDetailModal.displayName = 'CategoryDetailModal';
