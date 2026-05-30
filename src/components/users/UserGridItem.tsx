import { memo } from 'react';
import PhoneIcon from 'lucide-react/dist/esm/icons/phone';
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar';
import { cn } from '@/lib/utils';
import type { User, UserRole } from '@/core/domain/user/User';
import { Card } from '@/components/ui/Card';
import { UserActionsMenu } from '@/components/users/UserActionsMenu';

const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Administrador',
  staff: 'Personal',
  customer: 'Cliente',
};

const ROLE_CLASS: Record<UserRole, string> = {
  admin: 'bg-destructive/10 text-destructive',
  staff: 'bg-orange-100 text-orange-600',
  customer: 'bg-purple-100 text-brand-purple',
};

interface UserGridItemActions {
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
  onActivate?: (user: User) => void;
  onDeactivate?: (user: User) => void;
  onPromoteToAdmin?: (user: User) => void;
  onDemoteFromAdmin?: (user: User) => void;
}

interface UserGridItemProps extends UserGridItemActions {
  user: User;
  providerIcon?: React.ReactNode;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}

export const UserGridItem = memo<UserGridItemProps>(
  ({
    user,
    providerIcon,
    isMenuOpen,
    onMenuToggle,
    onMenuClose,
    onEdit,
    onView,
    onDelete,
    onResetPassword,
    onActivate,
    onDeactivate,
    onPromoteToAdmin,
    onDemoteFromAdmin,
  }) => {
    const initials =
      `${user.profile?.firstName?.[0] ?? ''}${user.profile?.lastName?.[0] ?? 'U'}`.toUpperCase();

    return (
      <Card
        className='relative flex cursor-pointer items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg'
        onClick={() => onEdit(user)}
      >
        {/* Auth provider indicator */}
        {providerIcon !== undefined && (
          <div className='absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted text-xs text-muted-foreground'>
            {providerIcon}
          </div>
        )}

        {/* Avatar */}
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-purple/10 text-lg font-semibold text-brand-purple'>
          {initials}
        </div>

        {/* Info */}
        <div className='min-w-0 flex-1'>
          <h3 className='mb-0.5 truncate text-base font-semibold text-foreground'>
            {user.profile?.firstName} {user.profile?.lastName}
          </h3>
          <p className='mb-2 truncate text-sm text-muted-foreground'>
            {user.email}
          </p>

          <div className='mb-2 flex flex-wrap items-center gap-1.5'>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wide',
                ROLE_CLASS[user.role] ?? ROLE_CLASS.customer
              )}
            >
              {ROLE_LABEL[user.role]}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wide',
                user.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-destructive/10 text-destructive'
              )}
            >
              {user.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          {user.profile?.phone ? (
            <p className='flex items-center gap-1 text-sm text-muted-foreground'>
              <PhoneIcon size={12} />
              {user.profile.phone}
            </p>
          ) : null}
          {user.profile?.dateOfBirth ? (
            <p className='flex items-center gap-1 text-sm text-muted-foreground'>
              <CalendarIcon size={12} />
              {new Date(user.profile.dateOfBirth).toLocaleDateString()}
            </p>
          ) : null}
        </div>

        {/* Actions menu */}
        <div onClick={e => e.stopPropagation()}>
          <UserActionsMenu
            user={user}
            isOpen={isMenuOpen}
            onToggle={onMenuToggle}
            onClose={onMenuClose}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            onResetPassword={onResetPassword}
            {...(onActivate ? { onActivate } : {})}
            {...(onDeactivate ? { onDeactivate } : {})}
            {...(onPromoteToAdmin ? { onPromoteToAdmin } : {})}
            {...(onDemoteFromAdmin ? { onDemoteFromAdmin } : {})}
          />
        </div>
      </Card>
    );
  }
);
UserGridItem.displayName = 'UserGridItem';
