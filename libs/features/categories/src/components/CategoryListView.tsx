import { memo } from 'react';
import EyeIcon from 'lucide-react/dist/esm/icons/eye';
import EditIcon from 'lucide-react/dist/esm/icons/edit';
import Trash2Icon from 'lucide-react/dist/esm/icons/trash-2';
import FolderIcon from 'lucide-react/dist/esm/icons/folder';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import XCircleIcon from 'lucide-react/dist/esm/icons/x-circle';
import { cn } from '@/lib/utils';
import type { Category } from '../types/category';

interface CategoryListViewProps {
  categories: Category[];
  loading?: boolean;
  error?: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onToggleStatus: (categoryId: string, isActive: boolean) => void;
  onViewDetails: (categoryId: string) => void;
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
  className?: string;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      'flex items-center justify-center rounded p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
      className
    )}
  >
    {children}
  </button>
);

export const CategoryListView = memo<CategoryListViewProps>(
  ({
    categories,
    loading = false,
    error = null,
    total,
    currentPage,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
    onToggleStatus,
    onViewDetails,
  }) => {
    if (loading) {
      return (
        <div className='overflow-hidden rounded-lg border border-border bg-card'>
          <div className='py-12 text-center'>
            <div className='text-2xl'>⏳</div>
            <h3 className='mt-4 font-medium text-foreground'>
              Cargando categorías...
            </h3>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className='overflow-hidden rounded-lg border border-border bg-card'>
          <div className='py-12 text-center'>
            <div className='text-2xl'>❌</div>
            <h3 className='mt-4 font-medium text-foreground'>
              Error al cargar categorías
            </h3>
            <p className='text-sm text-muted-foreground'>{error}</p>
          </div>
        </div>
      );
    }

    if (categories.length === 0) {
      return (
        <div className='overflow-hidden rounded-lg border border-border bg-card'>
          <div className='py-12 text-center'>
            <div className='text-2xl'>📁</div>
            <h3 className='mt-4 font-medium text-foreground'>
              No hay categorías
            </h3>
            <p className='text-sm text-muted-foreground'>
              No se encontraron categorías para mostrar
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className='overflow-hidden rounded-lg border border-border bg-card'>
        {/* Header */}
        <div className='flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3'>
          <p className='text-sm text-muted-foreground'>
            Mostrando {categories.length} de {total} categorías
          </p>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-border bg-muted/20 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                <th className='px-4 py-3 text-left'>Imagen</th>
                <th className='px-4 py-3 text-left'>Información</th>
                <th className='px-4 py-3 text-left'>Slug</th>
                <th className='px-4 py-3 text-center'>Estado</th>
                <th className='px-4 py-3 text-center'>Orden</th>
                <th className='px-4 py-3 text-center'>Creado</th>
                <th className='px-4 py-3 text-center'>Actualizado</th>
                <th className='px-4 py-3 text-center'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr
                  key={category.id}
                  className='border-b border-border/50 transition-colors hover:bg-muted/20'
                >
                  <td className='px-4 py-3'>
                    <div className='flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-muted'>
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <FolderIcon
                          size={20}
                          className='text-muted-foreground/50'
                        />
                      )}
                    </div>
                  </td>

                  <td className='px-4 py-3'>
                    <p className='font-medium text-foreground'>
                      {category.name}
                    </p>
                    {category.description ? (
                      <p className='mt-0.5 max-w-xs truncate text-xs text-muted-foreground'>
                        {category.description}
                      </p>
                    ) : null}
                  </td>

                  <td className='px-4 py-3'>
                    <span className='rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground'>
                      {category.slug}
                    </span>
                  </td>

                  <td className='px-4 py-3'>
                    <span
                      className={cn(
                        'flex items-center justify-center gap-1 text-xs font-medium',
                        category.isActive ? 'text-green-600' : 'text-amber-600'
                      )}
                    >
                      {category.isActive ? (
                        <CheckCircleIcon size={14} />
                      ) : (
                        <XCircleIcon size={14} />
                      )}
                      {category.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>

                  <td className='px-4 py-3 text-center text-muted-foreground'>
                    {category.sortOrder}
                  </td>

                  <td className='px-4 py-3 text-center text-muted-foreground'>
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>

                  <td className='px-4 py-3 text-center text-muted-foreground'>
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </td>

                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-center gap-1'>
                      <ActionBtn
                        onClick={() => onViewDetails(category.id)}
                        title='Ver detalles'
                      >
                        <EyeIcon size={16} />
                      </ActionBtn>
                      <ActionBtn
                        onClick={() => onEdit(category.id)}
                        title='Editar'
                      >
                        <EditIcon size={16} />
                      </ActionBtn>
                      <ActionBtn
                        onClick={() =>
                          onToggleStatus(category.id, !category.isActive)
                        }
                        title='Cambiar estado'
                      >
                        {category.isActive ? (
                          <XCircleIcon size={16} />
                        ) : (
                          <CheckCircleIcon size={16} />
                        )}
                      </ActionBtn>
                      <ActionBtn
                        onClick={() => onDelete(category.id)}
                        title='Eliminar'
                        className='hover:bg-destructive/10 hover:text-destructive'
                      >
                        <Trash2Icon size={16} />
                      </ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 ? (
          <div className='flex items-center justify-center gap-2 border-t border-border bg-muted/30 p-4'>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='rounded border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50'
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  'rounded border px-3 py-1.5 text-sm transition-colors',
                  page === currentPage
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary hover:bg-muted'
                )}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='rounded border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50'
            >
              Siguiente
            </button>
          </div>
        ) : null}
      </div>
    );
  }
);
CategoryListView.displayName = 'CategoryListView';
