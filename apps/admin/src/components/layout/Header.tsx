import type React from 'react';
import { useState, useCallback, useEffect } from 'react';
import SearchIcon from 'lucide-react/dist/esm/icons/search';
import BellIcon from 'lucide-react/dist/esm/icons/bell';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import LogOutIcon from 'lucide-react/dist/esm/icons/log-out';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';
import { cn } from '@happy-baby/shared-utils';
import { useAuth } from '@happy-baby/feature-auth';
import { useLogout } from '@/hooks/useLogout';
import { LogoutConfirmModal } from '@happy-baby/feature-auth';
import { useSidebarStore as useSidebar } from '@happy-baby/shared-stores';

const getUserInitials = (name: string) => {
  if (!name) return 'U';
  if (name.includes('@')) {
    const emailUser = name.split('@')[0];
    if (emailUser) return emailUser.charAt(0).toUpperCase();
  }
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { isCollapsed } = useSidebar();
  const {
    isLogoutModalOpen,
    isLoggingOut,
    openLogoutModal,
    closeLogoutModal,
    handleLogout,
  } = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sidebarWidth = isCollapsed ? 80 : 280;

  const handleUserClick = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const handleLogoutClick = useCallback(() => {
    setIsDropdownOpen(false);
    openLogoutModal();
  }, [openLogoutModal]);

  useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const displayName =
    user?.profile?.firstName && user?.profile?.lastName
      ? `${user.profile.firstName} ${user.profile.lastName}`
      : (user?.email ?? 'Usuario');

  return (
    <header
      className='fixed right-0 top-0 z-[100] flex h-20 items-center justify-between border-b border-border bg-white/95 px-6 backdrop-blur-[10px] transition-[left] duration-200 max-lg:left-0 max-lg:px-4 md:h-[70px] sm:h-[60px] sm:px-3'
      style={{ left: sidebarWidth }}
    >
      {/* Mobile menu placeholder */}
      <button className='hidden rounded-md p-2 text-muted-foreground transition-all hover:bg-muted hover:text-brand-purple max-lg:block'>
        <SettingsIcon size={24} />
      </button>

      {/* Search */}
      <div
        className={cn(
          'relative mr-6 flex-1 transition-[max-width] duration-200 max-md:mr-4 max-md:max-w-[300px] max-sm:hidden',
          isCollapsed ? 'max-w-[500px]' : 'max-w-[400px]'
        )}
      >
        <SearchIcon
          size={20}
          className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
        />
        <input
          type='search'
          placeholder='Buscar productos, pedidos...'
          className='w-full rounded-lg border-2 border-border bg-white py-3 pl-10 pr-4 text-base outline-none transition-all placeholder:text-muted-foreground focus:border-brand-purple focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand-purple)_20%,transparent)]'
        />
      </div>

      {/* Actions */}
      <div className='flex items-center gap-3'>
        {/* Notification bell */}
        <button className='relative rounded-md p-2 text-muted-foreground transition-all hover:bg-muted hover:text-brand-purple'>
          <BellIcon size={20} />
          <span className='absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive' />
        </button>

        {/* User dropdown */}
        <div className='relative'>
          <div
            onClick={handleUserClick}
            className='flex cursor-pointer items-center gap-3 rounded-md p-2 transition-all hover:bg-muted max-sm:gap-2'
          >
            {/* Avatar */}
            <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-[#FF6B6B] font-medium text-white max-sm:h-8 max-sm:w-8 max-sm:text-sm'>
              {user ? getUserInitials(displayName) : 'U'}
            </div>

            {/* User info */}
            <div className='flex flex-col max-sm:hidden'>
              <span className='text-sm font-medium leading-tight text-foreground'>
                {displayName}
              </span>
              <span className='text-xs leading-tight text-muted-foreground'>
                {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
              </span>
            </div>

            <ChevronDownIcon
              size={16}
              className={cn(
                'text-muted-foreground transition-transform duration-200',
                isDropdownOpen && 'rotate-180'
              )}
            />
          </div>

          {/* Dropdown menu */}
          <div
            className={cn(
              'absolute right-0 top-full z-[200] mt-2 min-w-[200px] overflow-hidden rounded-lg border border-border bg-white shadow-lg transition-all duration-200',
              isDropdownOpen
                ? 'visible translate-y-0 opacity-100'
                : 'invisible -translate-y-2 opacity-0'
            )}
          >
            <button className='flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted hover:text-brand-purple'>
              <UserIcon size={16} />
              Mi Perfil
            </button>
            <button className='flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted hover:text-brand-purple'>
              <SettingsIcon size={16} />
              Configuración
            </button>
            <button
              onClick={handleLogoutClick}
              className='flex w-full items-center gap-3 border-t border-border px-4 py-3 text-left text-sm text-destructive transition-colors hover:bg-destructive/10'
            >
              <LogOutIcon size={16} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </header>
  );
};
