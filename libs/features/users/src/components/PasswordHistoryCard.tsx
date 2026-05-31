import type React from 'react';
import KeyIcon from 'lucide-react/dist/esm/icons/key';
import RefreshCwIcon from 'lucide-react/dist/esm/icons/refresh-cw';
import LockIcon from 'lucide-react/dist/esm/icons/lock';
import ClockIcon from 'lucide-react/dist/esm/icons/clock';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import ShieldIcon from 'lucide-react/dist/esm/icons/shield';
import { cn } from '@happy-baby/shared-utils';
import { type PasswordAction } from '@happy-baby/feature-auth';

interface PasswordHistoryCardProps {
  actions: PasswordAction[];
}

const formatTimestamp = (date: Date) =>
  new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

const ACTION_ICON_CLASS: Record<PasswordAction['type'], string> = {
  reset: 'bg-yellow-500/20 text-yellow-600',
  temporary: 'bg-blue-500/20 text-blue-600',
  admin_set: 'bg-destructive/20 text-destructive',
  user_change: 'bg-green-500/20 text-green-600',
};

const getActionIcon = (type: PasswordAction['type']) => {
  switch (type) {
    case 'reset':
      return <RefreshCwIcon size={16} />;
    case 'temporary':
      return <KeyIcon size={16} />;
    case 'admin_set':
      return <LockIcon size={16} />;
    case 'user_change':
      return <ShieldIcon size={16} />;
    default:
      return <KeyIcon size={16} />;
  }
};

const STATUS_CONFIG: Record<
  PasswordAction['status'],
  { label: string; className: string; icon: React.ReactNode }
> = {
  completed: {
    label: 'Completado',
    className: 'bg-green-500/20 text-green-600',
    icon: <CheckCircleIcon size={12} />,
  },
  pending: {
    label: 'Pendiente',
    className: 'bg-yellow-500/20 text-yellow-600',
    icon: <ClockIcon size={12} />,
  },
  failed: {
    label: 'Fallido',
    className: 'bg-destructive/20 text-destructive',
    icon: <AlertTriangleIcon size={12} />,
  },
};

export const PasswordHistoryCard: React.FC<PasswordHistoryCardProps> = ({
  actions,
}) => (
  <div className='rounded-lg border border-border bg-white p-4'>
    <div className='mb-4 flex items-center gap-2'>
      <KeyIcon size={20} />
      <h3 className='m-0 text-lg font-semibold text-foreground'>
        Historial de Contraseñas
      </h3>
    </div>

    {actions.length > 0 ? (
      <div className='flex flex-col gap-3'>
        {actions.map(action => {
          const status = STATUS_CONFIG[action.status];
          return (
            <div
              key={action.id}
              className='flex items-center gap-3 rounded-md border-l-[3px] border-l-brand-purple bg-muted p-3'
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  ACTION_ICON_CLASS[action.type] ??
                    'bg-brand-purple/20 text-brand-purple'
                )}
              >
                {getActionIcon(action.type)}
              </div>

              <div className='flex-1'>
                <div className='mb-1 text-sm text-foreground'>
                  {action.description}
                </div>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <ClockIcon size={12} />
                  {formatTimestamp(action.timestamp)}
                  {action.adminUser ? (
                    <>• Administrador: {action.adminUser}</>
                  ) : null}
                </div>
              </div>

              <div
                className={cn(
                  'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                  status.className
                )}
              >
                {status.icon}
                {status.label}
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className='py-6 text-center text-sm text-muted-foreground'>
        No hay acciones de contraseña registradas para este usuario
      </div>
    )}
  </div>
);

export default PasswordHistoryCard;
