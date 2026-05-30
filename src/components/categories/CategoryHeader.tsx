import { memo } from 'react';
import FolderIcon from 'lucide-react/dist/esm/icons/folder';
import PlusIcon from 'lucide-react/dist/esm/icons/plus';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import DownloadIcon from 'lucide-react/dist/esm/icons/download';
import UploadIcon from 'lucide-react/dist/esm/icons/upload';
import PrinterIcon from 'lucide-react/dist/esm/icons/printer';
import Grid3X3Icon from 'lucide-react/dist/esm/icons/grid-3x3';
import ListIcon from 'lucide-react/dist/esm/icons/list';
import { Button } from '@/components/ui/Button';

interface CategoryHeaderStats {
  totalCategories?: number;
  activeCategories?: number;
  inactiveCategories?: number;
}

interface CategoryHeaderProps {
  title?: string;
  stats?: CategoryHeaderStats;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onAddCategory?: () => void;
  onBulkActions?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  showActions?: boolean;
}

const StatCard = memo<{
  label: string;
  value: number;
  colorClass: string;
}>(({ label, value, colorClass }) => (
  <div className='rounded-lg border border-border bg-card p-4 text-center transition-transform hover:-translate-y-0.5'>
    <div className={`mb-3 flex justify-center ${colorClass}`}>
      <FolderIcon size={24} />
    </div>
    <div className='font-heading mb-1 text-4xl font-bold text-foreground'>
      {value.toLocaleString()}
    </div>
    <div className='text-sm text-muted-foreground'>{label}</div>
  </div>
));
StatCard.displayName = 'StatCard';

export const CategoryHeader = memo<CategoryHeaderProps>(
  ({
    title = 'Categorías Happy Baby Style',
    stats,
    viewMode = 'list',
    onViewModeChange,
    onAddCategory,
    onBulkActions,
    onExport,
    onImport,
    showActions = true,
  }) => {
    const hasStats =
      stats && Object.values(stats).some(value => value !== undefined);

    return (
      <div className='mb-6'>
        {/* Main header row */}
        <div className='mb-4 flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple'>
              <FolderIcon size={24} />
            </div>
            <div>
              <h1 className='font-heading text-3xl font-bold text-foreground'>
                {title}
              </h1>
              <p className='text-base text-muted-foreground'>
                Organiza tu catálogo de productos por categorías
              </p>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-3'>
            {onViewModeChange ? (
              <div className='flex gap-2'>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size='sm'
                  onClick={() => onViewModeChange('list')}
                >
                  <ListIcon size={16} className='mr-1' />
                  Lista
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size='sm'
                  onClick={() => onViewModeChange('grid')}
                >
                  <Grid3X3Icon size={16} className='mr-1' />
                  Grid
                </Button>
              </div>
            ) : null}

            {onImport ? (
              <Button variant='ghost' size='sm' onClick={onImport}>
                <UploadIcon size={16} className='mr-1' />
                Importar
              </Button>
            ) : null}

            {onExport ? (
              <Button variant='ghost' size='sm' onClick={onExport}>
                <DownloadIcon size={16} className='mr-1' />
                Exportar
              </Button>
            ) : null}

            {onBulkActions ? (
              <Button variant='outline' size='sm' onClick={onBulkActions}>
                <SettingsIcon size={16} className='mr-1' />
                Acciones Masivas
              </Button>
            ) : null}

            {onAddCategory ? (
              <Button variant='primary' size='sm' onClick={onAddCategory}>
                <PlusIcon size={16} className='mr-1' />
                Nueva Categoría
              </Button>
            ) : null}
          </div>
        </div>

        {/* Stats grid */}
        {hasStats ? (
          <div className='mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3'>
            {stats.totalCategories !== undefined ? (
              <StatCard
                label='Total de Categorías'
                value={stats.totalCategories}
                colorClass='text-brand-purple'
              />
            ) : null}
            {stats.activeCategories !== undefined ? (
              <StatCard
                label='Categorías Activas'
                value={stats.activeCategories}
                colorClass='text-green-600'
              />
            ) : null}
            {stats.inactiveCategories !== undefined ? (
              <StatCard
                label='Categorías Inactivas'
                value={stats.inactiveCategories}
                colorClass='text-amber-600'
              />
            ) : null}
          </div>
        ) : null}

        {/* Quick actions bar */}
        {showActions ? (
          <div className='flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4'>
            <span className='text-sm font-medium text-muted-foreground'>
              Acciones rápidas:
            </span>

            {onAddCategory ? (
              <Button variant='outline' size='sm' onClick={onAddCategory}>
                <PlusIcon size={14} className='mr-1' />
                Agregar Categoría
              </Button>
            ) : null}

            {onBulkActions ? (
              <Button variant='outline' size='sm' onClick={onBulkActions}>
                <SettingsIcon size={14} className='mr-1' />
                Acciones Masivas
              </Button>
            ) : null}

            {onExport ? (
              <Button variant='ghost' size='sm' onClick={onExport}>
                <DownloadIcon size={14} className='mr-1' />
                Exportar Lista
              </Button>
            ) : null}

            <Button variant='ghost' size='sm' onClick={() => window.print()}>
              <PrinterIcon size={14} className='mr-1' />
              Imprimir
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
);
CategoryHeader.displayName = 'CategoryHeader';
