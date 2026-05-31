import { memo } from 'react';
import FolderIcon from 'lucide-react/dist/esm/icons/folder';
import EditIcon from 'lucide-react/dist/esm/icons/edit';
import Trash2Icon from 'lucide-react/dist/esm/icons/trash-2';
import EyeIcon from 'lucide-react/dist/esm/icons/eye';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import XCircleIcon from 'lucide-react/dist/esm/icons/x-circle';
import { cn } from '@happy-baby/shared-utils';
import { Card } from '@happy-baby/shared-ui';
import type { Category } from '../types/category';

interface CategoryCardProps {
  category: Category;
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onViewDetails: (categoryId: string) => void;
  onToggleStatus: (categoryId: string, isActive: boolean) => void;
}

export const CategoryCard = memo<CategoryCardProps>(
  ({ category, onEdit, onDelete, onViewDetails, onToggleStatus }) => (
    <Card className='flex h-full flex-col transition-all hover:-translate-y-1 hover:shadow-lg'>
      {/* Image */}
      <div className='flex h-40 w-full items-center justify-center overflow-hidden rounded-t-lg bg-muted'>
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className='h-full w-full object-cover'
          />
        ) : (
          <FolderIcon size={48} className='text-muted-foreground/40' />
        )}
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col p-4'>
        <h3 className='font-heading mb-2 text-lg font-semibold leading-snug text-foreground'>
          {category.name}
        </h3>

        {category.description ? (
          <p className='mb-3 flex-1 text-sm leading-relaxed text-muted-foreground'>
            {category.description}
          </p>
        ) : null}

        {/* Meta */}
        <div className='mb-4 flex items-center justify-between'>
          <span className='rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground'>
            {category.slug}
          </span>
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
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
        </div>

        {/* Actions */}
        <div className='flex justify-end gap-2 border-t border-border pt-3'>
          <button
            onClick={() => onViewDetails(category.id)}
            title='Ver detalles'
            className='rounded p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <EyeIcon size={16} />
          </button>
          <button
            onClick={() => onEdit(category.id)}
            title='Editar'
            className='rounded p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <EditIcon size={16} />
          </button>
          <button
            onClick={() => onToggleStatus(category.id, !category.isActive)}
            title='Cambiar estado'
            className='rounded p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            {category.isActive ? (
              <XCircleIcon size={16} />
            ) : (
              <CheckCircleIcon size={16} />
            )}
          </button>
          <button
            onClick={() => onDelete(category.id)}
            title='Eliminar'
            className='rounded p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'
          >
            <Trash2Icon size={16} />
          </button>
        </div>
      </div>
    </Card>
  )
);
CategoryCard.displayName = 'CategoryCard';
