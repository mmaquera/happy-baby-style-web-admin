import type React from 'react';
import { memo } from 'react';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import XCircleIcon from 'lucide-react/dist/esm/icons/x-circle';
import PlusIcon from 'lucide-react/dist/esm/icons/plus';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import DownloadIcon from 'lucide-react/dist/esm/icons/download';
import UploadIcon from 'lucide-react/dist/esm/icons/upload';
import Grid3X3Icon from 'lucide-react/dist/esm/icons/grid-3x3';
import ListIcon from 'lucide-react/dist/esm/icons/list';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface ProductHeaderProps {
  title?: string;
  stats?: {
    totalProducts?: number;
    activeProducts?: number;
    lowStockProducts?: number;
    outOfStockProducts?: number;
  };
  viewMode?: 'grid' | 'list';
  onAddProduct?: () => void;
  onBulkActions?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  showActions?: boolean;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  change: string;
  isPositive: boolean;
}

const StatCard = memo<StatCardProps>(
  ({ icon, value, label, change, isPositive }) => (
    <div className='rounded-lg border border-border p-4 text-center transition-transform hover:-translate-y-0.5 hover:border-brand-purple'>
      <div className='mb-2 flex items-center justify-center'>{icon}</div>
      <div className='font-heading mb-1 text-2xl font-bold text-foreground'>
        {value.toLocaleString()}
      </div>
      <div className='text-sm font-medium text-muted-foreground'>{label}</div>
      <div
        className={cn(
          'mt-1 text-xs font-medium',
          isPositive ? 'text-green-600' : 'text-destructive'
        )}
      >
        {change}
      </div>
    </div>
  )
);
StatCard.displayName = 'StatCard';

export const ProductHeader: React.FC<ProductHeaderProps> = memo(
  ({
    title = 'Productos Happy Baby Style',
    stats,
    viewMode = 'list',
    onAddProduct,
    onBulkActions,
    onExport,
    onImport,
    showActions = true,
    onViewModeChange,
  }) => {
    const hasStats =
      stats != null && Object.values(stats).some(v => v !== undefined);

    return (
      <div className='mb-6'>
        {/* Title row */}
        <div className='mb-4 flex flex-wrap items-center justify-between gap-4 max-md:flex-col max-md:items-stretch max-md:gap-3'>
          <div className='flex items-center gap-3 max-md:justify-center'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple'>
              <PackageIcon size={24} />
            </div>
            <div className='flex flex-col gap-1'>
              <h1 className='font-heading m-0 text-3xl font-bold leading-tight text-foreground max-md:text-center max-md:text-2xl'>
                {title}
              </h1>
              <p className='m-0 text-base text-muted-foreground max-md:text-center'>
                Gestiona tu catálogo de productos para bebés
              </p>
            </div>
          </div>

          {showActions ? (
            <div className='flex flex-wrap items-center justify-end gap-3 max-md:justify-center max-md:gap-2'>
              {onViewModeChange ? (
                <div className='flex gap-1 rounded-md border border-border bg-muted p-1'>
                  <button
                    onClick={() => onViewModeChange('list')}
                    title='Vista de lista'
                    className={cn(
                      'flex min-w-[60px] items-center justify-center gap-1 rounded px-3 py-2 text-sm transition-all',
                      viewMode === 'list'
                        ? 'bg-brand-purple text-white'
                        : 'text-muted-foreground hover:bg-muted-foreground/10'
                    )}
                  >
                    <ListIcon size={16} />
                    Lista
                  </button>
                  <button
                    onClick={() => onViewModeChange('grid')}
                    title='Vista de cuadrícula'
                    className={cn(
                      'flex min-w-[60px] items-center justify-center gap-1 rounded px-3 py-2 text-sm transition-all',
                      viewMode === 'grid'
                        ? 'bg-brand-purple text-white'
                        : 'text-muted-foreground hover:bg-muted-foreground/10'
                    )}
                  >
                    <Grid3X3Icon size={16} />
                    Grid
                  </button>
                </div>
              ) : null}
              {onImport ? (
                <Button variant='ghost' size='medium' onClick={onImport}>
                  <UploadIcon size={16} />
                  Importar
                </Button>
              ) : null}
              {onExport ? (
                <Button variant='ghost' size='medium' onClick={onExport}>
                  <DownloadIcon size={16} />
                  Exportar
                </Button>
              ) : null}
              {onBulkActions ? (
                <Button
                  variant='secondary'
                  size='medium'
                  onClick={onBulkActions}
                >
                  <SettingsIcon size={16} />
                  Acciones Masivas
                </Button>
              ) : null}
              {onAddProduct ? (
                <Button variant='primary' size='medium' onClick={onAddProduct}>
                  <PlusIcon size={16} />
                  Nuevo Producto
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Stats grid */}
        {hasStats ? (
          <div className='mb-4 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] max-md:gap-3 max-md:[grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]'>
            {stats!.totalProducts !== undefined ? (
              <StatCard
                icon={<PackageIcon size={24} className='text-brand-purple' />}
                value={stats!.totalProducts}
                label='Total de Productos'
                change='+12% este mes'
                isPositive
              />
            ) : null}
            {stats!.activeProducts !== undefined ? (
              <StatCard
                icon={<CheckCircleIcon size={24} className='text-green-500' />}
                value={stats!.activeProducts}
                label='Productos Activos'
                change='+8% este mes'
                isPositive
              />
            ) : null}
            {stats!.lowStockProducts !== undefined ? (
              <StatCard
                icon={
                  <AlertTriangleIcon size={24} className='text-yellow-500' />
                }
                value={stats!.lowStockProducts}
                label='Stock Bajo'
                change='+3% este mes'
                isPositive={false}
              />
            ) : null}
            {stats!.outOfStockProducts !== undefined ? (
              <StatCard
                icon={<XCircleIcon size={24} className='text-destructive' />}
                value={stats!.outOfStockProducts}
                label='Sin Stock'
                change='+2% este mes'
                isPositive={false}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
);
ProductHeader.displayName = 'ProductHeader';
