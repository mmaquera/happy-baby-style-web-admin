import { useState } from 'react';
import type React from 'react';
import ClockIcon from 'lucide-react/dist/esm/icons/clock';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import ShieldIcon from 'lucide-react/dist/esm/icons/shield';
import { cn } from '@happy-baby/shared-utils';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface SessionInfoProps {
  className?: string;
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'manager':
      return 'Gerente';
    case 'editor':
      return 'Editor';
    default:
      return 'Usuario';
  }
};

const roleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30';
    case 'manager':
      return 'bg-teal-500/20 text-teal-600 border border-teal-500/30';
    default:
      return 'bg-muted-foreground/20 text-muted-foreground border border-muted-foreground/30';
  }
};

export const SessionInfo: React.FC<SessionInfoProps> = ({ className }) => {
  const { user } = useAuth();
  const [sessionStart] = useState(new Date());

  if (!user) return null;

  return (
    <div
      className={cn(
        'mb-4 rounded-lg border border-border/20 bg-muted p-4',
        className
      )}
    >
      <h4 className='mb-3 flex items-center gap-2 font-heading text-lg font-medium text-foreground'>
        <ShieldIcon size={20} />
        Información de Sesión
      </h4>

      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <UserIcon size={16} />
          <span className='min-w-[80px] font-medium text-foreground'>
            Usuario:
          </span>
          <span>
            {user.profile?.firstName && user.profile?.lastName
              ? `${user.profile.firstName} ${user.profile.lastName}`
              : user.email}
          </span>
        </div>

        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <span className='min-w-[80px] font-medium text-foreground'>
            Email:
          </span>
          <span>{user.email}</span>
        </div>

        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <span className='min-w-[80px] font-medium text-foreground'>Rol:</span>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wide',
              roleBadgeClass(user.role)
            )}
          >
            <ShieldIcon size={12} />
            {getRoleLabel(user.role)}
          </span>
        </div>

        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <ClockIcon size={16} />
          <span className='min-w-[80px] font-medium text-foreground'>
            Sesión:
          </span>
          <span>
            {formatDistanceToNow(sessionStart, { addSuffix: true, locale: es })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SessionInfo;
