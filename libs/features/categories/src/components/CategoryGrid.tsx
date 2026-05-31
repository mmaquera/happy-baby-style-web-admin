import { memo } from 'react';
import FolderIcon from 'lucide-react/dist/esm/icons/folder';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import { CategoryCard } from './CategoryCard';
import type { Category } from '../types/category';

interface CategoryGridProps {
  categories: Category[];
  loading?: boolean;
  error?: string | null;
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onToggleStatus: (categoryId: string, isActive: boolean) => void;
  onViewDetails: (categoryId: string) => void;
  emptyMessage?: string;
}

export const CategoryGrid = memo<CategoryGridProps>(
  ({
    categories,
    loading = false,
    error = null,
    onEdit,
    onDelete,
    onToggleStatus,
    onViewDetails,
    emptyMessage = 'No se encontraron categorías',
  }) => {
    if (loading) {
      return (
        <div className='py-12 text-center text-muted-foreground'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary' />
          <p>Cargando categorías...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className='py-12 text-center'>
          <AlertTriangleIcon
            size={48}
            className='mx-auto mb-4 text-destructive'
          />
          <p className='font-heading text-xl font-semibold text-foreground'>
            Error al cargar categorías
          </p>
          <p className='text-sm text-muted-foreground'>{error}</p>
        </div>
      );
    }

    if (categories.length === 0) {
      return (
        <div className='py-12 text-center text-muted-foreground'>
          <FolderIcon size={48} className='mx-auto mb-4 opacity-40' />
          <p className='font-heading text-xl font-semibold text-foreground'>
            No hay categorías
          </p>
          <p className='text-sm'>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className='grid grid-cols-1 gap-6 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    );
  }
);
CategoryGrid.displayName = 'CategoryGrid';
