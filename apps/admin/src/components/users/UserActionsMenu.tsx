import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import MoreVerticalIcon from 'lucide-react/dist/esm/icons/more-vertical';
import EditIcon from 'lucide-react/dist/esm/icons/edit';
import EyeIcon from 'lucide-react/dist/esm/icons/eye';
import UserCheckIcon from 'lucide-react/dist/esm/icons/user-check';
import UserXIcon from 'lucide-react/dist/esm/icons/user-x';
import Trash2Icon from 'lucide-react/dist/esm/icons/trash-2';
import KeyIcon from 'lucide-react/dist/esm/icons/key';
import ShieldIcon from 'lucide-react/dist/esm/icons/shield';
import ShieldOffIcon from 'lucide-react/dist/esm/icons/shield-off';
import { cn } from '@/lib/utils';
import type { User } from '@happy-baby/domain-user';

interface UserActionsMenuProps {
  user: User;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onActivate?: (user: User) => void;
  onDeactivate?: (user: User) => void;
  onDelete?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onPromoteToAdmin?: (user: User) => void;
  onDemoteFromAdmin?: (user: User) => void;
  disabled?: boolean;
}

export const UserActionsMenu: React.FC<UserActionsMenuProps> = ({
  user,
  isOpen,
  onToggle,
  onClose,
  onEdit,
  onView,
  onActivate,
  onDeactivate,
  onDelete,
  onResetPassword,
  onPromoteToAdmin,
  onDemoteFromAdmin,
  disabled = false,
}) => {
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const calculateMenuPosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const menuWidth = 200;
    const padding = 16;

    let menuHeight = 350;
    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      if (menuRect.height > 0) menuHeight = menuRect.height;
    }

    let top = rect.bottom + 8;
    let left = rect.left - menuWidth + rect.width;

    if (top + menuHeight > viewportHeight - padding) {
      const topAbove = rect.top - menuHeight - 8;
      top =
        topAbove >= padding ? topAbove : viewportHeight - menuHeight - padding;
    }

    top = Math.max(padding, top);
    if (left + menuWidth > viewportWidth - padding)
      left = viewportWidth - menuWidth - padding;
    if (left < padding) left = padding;

    setMenuPosition({ top, left });
  }, []);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) calculateMenuPosition();
    onToggle();
  };

  const handleItemClick = (action: () => void) => {
    action();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = () => onClose();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('scroll', calculateMenuPosition, true);
    window.addEventListener('resize', calculateMenuPosition);
    return () => {
      window.removeEventListener('scroll', calculateMenuPosition, true);
      window.removeEventListener('resize', calculateMenuPosition);
    };
  }, [isOpen, calculateMenuPosition]);

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const timer = setTimeout(calculateMenuPosition, 10);
    return () => clearTimeout(timer);
  }, [isOpen, calculateMenuPosition]);

  return (
    <>
      <div className='relative z-[1] inline-block'>
        <button
          ref={buttonRef}
          onClick={handleMenuClick}
          disabled={disabled}
          className='flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50'
        >
          <MoreVerticalIcon size={16} />
        </button>
      </div>

      {createPortal(
        <div
          ref={menuRef}
          className={cn(
            'fixed z-[999999] min-w-[200px] max-w-[250px] overflow-x-hidden overflow-y-auto rounded-md border border-border bg-white shadow-[0_20px_40px_rgba(0,0,0,0.15),0_8px_16px_rgba(0,0,0,0.1)] transition-all duration-150',
            isOpen
              ? 'visible scale-100 opacity-100'
              : 'invisible scale-95 opacity-0 pointer-events-none -translate-y-2.5'
          )}
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
            transformOrigin: 'top right',
          }}
        >
          {/* Basic Actions */}
          <div className='border-b border-border py-2'>
            <div className='px-3 py-1 text-xs font-semibold uppercase tracking-[0.5px] text-muted-foreground'>
              Acciones Básicas
            </div>
            <button
              className='flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted'
              onClick={() => handleItemClick(() => onView(user))}
            >
              <EyeIcon size={16} /> Ver Detalles
            </button>
            <button
              className='flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted'
              onClick={() => handleItemClick(() => onEdit(user))}
            >
              <EditIcon size={16} /> Editar Usuario
            </button>
          </div>

          {/* Status */}
          <div className='border-b border-border py-2'>
            <div className='px-3 py-1 text-xs font-semibold uppercase tracking-[0.5px] text-muted-foreground'>
              Estado
            </div>
            {user.isActive
              ? onDeactivate && (
                  <button
                    className='flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-yellow-600 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50'
                    onClick={() => handleItemClick(() => onDeactivate(user))}
                  >
                    <UserXIcon size={16} /> Desactivar Usuario
                  </button>
                )
              : onActivate && (
                  <button
                    className='flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-green-600 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50'
                    onClick={() => handleItemClick(() => onActivate(user))}
                  >
                    <UserCheckIcon size={16} /> Activar Usuario
                  </button>
                )}
          </div>

          {/* Security */}
          <div className={cn('py-2', onDelete ? 'border-b border-border' : '')}>
            <div className='px-3 py-1 text-xs font-semibold uppercase tracking-[0.5px] text-muted-foreground'>
              Seguridad
            </div>
            {onResetPassword ? (
              <button
                className='flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted'
                onClick={() => handleItemClick(() => onResetPassword(user))}
              >
                <KeyIcon size={16} /> Restablecer Contraseña
              </button>
            ) : null}
            {user.role !== 'admin'
              ? onPromoteToAdmin && (
                  <button
                    className='flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-yellow-600 transition-colors hover:bg-muted'
                    onClick={() =>
                      handleItemClick(() => onPromoteToAdmin(user))
                    }
                  >
                    <ShieldIcon size={16} /> Promover a Admin
                  </button>
                )
              : onDemoteFromAdmin && (
                  <button
                    className='flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-yellow-600 transition-colors hover:bg-muted'
                    onClick={() =>
                      handleItemClick(() => onDemoteFromAdmin(user))
                    }
                  >
                    <ShieldOffIcon size={16} /> Remover Admin
                  </button>
                )}
          </div>

          {/* Danger */}
          {onDelete ? (
            <div className='py-2'>
              <div className='px-3 py-1 text-xs font-semibold uppercase tracking-[0.5px] text-muted-foreground'>
                Zona Peligrosa
              </div>
              <button
                className='flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-muted'
                onClick={() => handleItemClick(() => onDelete(user))}
              >
                <Trash2Icon size={16} /> Eliminar Usuario
              </button>
            </div>
          ) : null}
        </div>,
        document.body
      )}
    </>
  );
};

export default UserActionsMenu;
