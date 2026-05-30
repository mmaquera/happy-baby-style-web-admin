import type React from 'react';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import ShoppingCartIcon from 'lucide-react/dist/esm/icons/shopping-cart';
import UsersIcon from 'lucide-react/dist/esm/icons/users';
import BarChart3Icon from 'lucide-react/dist/esm/icons/bar-chart-3';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import ImageIcon from 'lucide-react/dist/esm/icons/image';
import HomeIcon from 'lucide-react/dist/esm/icons/home';
import BabyIcon from 'lucide-react/dist/esm/icons/baby';
import FolderIcon from 'lucide-react/dist/esm/icons/folder';
import { cn } from '@/lib/utils';
import { useLogout } from '@/hooks/useLogout';
import { LogoutConfirmModal } from '@/components/auth/LogoutConfirmModal';
import { useSidebar } from '@/contexts/SidebarContext';
import { CollapsibleNavItem } from './CollapsibleNavItem';
import { LogoutButtonWithTooltip } from './LogoutButtonWithTooltip';

export const Sidebar: React.FC = () => {
  const {
    isLogoutModalOpen,
    isLoggingOut,
    openLogoutModal,
    closeLogoutModal,
    handleLogout,
  } = useLogout();

  const { isCollapsed } = useSidebar();

  return (
    <aside
      className='fixed left-0 top-0 z-[101] flex h-screen flex-shrink-0 flex-col overflow-visible border-r border-border bg-card transition-[width] duration-200 max-lg:-translate-x-full'
      style={{ width: isCollapsed ? 80 : 280 }}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex min-h-20 items-center border-b border-border transition-all',
          isCollapsed ? 'justify-center gap-0 px-4' : 'justify-start gap-3 px-6'
        )}
      >
        <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple to-[#FF6B6B] text-white'>
          <BabyIcon size={24} />
        </div>
        <div
          className={cn(
            'flex flex-col overflow-hidden transition-opacity',
            isCollapsed ? 'hidden opacity-0' : 'opacity-100'
          )}
        >
          <h1 className='font-heading text-lg font-medium leading-tight text-foreground'>
            Happy Baby Style
          </h1>
          <span className='text-xs leading-tight text-muted-foreground'>
            Panel de Administración
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 overflow-y-auto py-4'>
        <div className='mb-6'>
          <h3
            className={cn(
              'mb-3 overflow-hidden whitespace-nowrap text-xs font-medium uppercase tracking-wide text-muted-foreground transition-all',
              isCollapsed
                ? 'h-0 px-2 text-center opacity-0'
                : 'h-auto px-6 text-left opacity-100'
            )}
          >
            Principal
          </h3>
          <CollapsibleNavItem
            to='/'
            end
            isCollapsed={isCollapsed}
            icon={<HomeIcon size={20} />}
          >
            Dashboard
          </CollapsibleNavItem>
        </div>

        <div className='mb-6'>
          <h3
            className={cn(
              'mb-3 overflow-hidden whitespace-nowrap text-xs font-medium uppercase tracking-wide text-muted-foreground transition-all',
              isCollapsed
                ? 'h-0 px-2 text-center opacity-0'
                : 'h-auto px-6 text-left opacity-100'
            )}
          >
            Gestión
          </h3>
          <CollapsibleNavItem
            to='/products'
            isCollapsed={isCollapsed}
            icon={<PackageIcon size={20} />}
          >
            Productos
          </CollapsibleNavItem>
          <CollapsibleNavItem
            to='/categories'
            isCollapsed={isCollapsed}
            icon={<FolderIcon size={20} />}
          >
            Categorías
          </CollapsibleNavItem>
          <CollapsibleNavItem
            to='/orders'
            isCollapsed={isCollapsed}
            icon={<ShoppingCartIcon size={20} />}
          >
            Pedidos
          </CollapsibleNavItem>
          <CollapsibleNavItem
            to='/users'
            isCollapsed={isCollapsed}
            icon={<UsersIcon size={20} />}
          >
            Usuarios
          </CollapsibleNavItem>
          <CollapsibleNavItem
            to='/images'
            isCollapsed={isCollapsed}
            icon={<ImageIcon size={20} />}
          >
            Imágenes
          </CollapsibleNavItem>
        </div>

        <div className='mb-6'>
          <h3
            className={cn(
              'mb-3 overflow-hidden whitespace-nowrap text-xs font-medium uppercase tracking-wide text-muted-foreground transition-all',
              isCollapsed
                ? 'h-0 px-2 text-center opacity-0'
                : 'h-auto px-6 text-left opacity-100'
            )}
          >
            Análisis
          </h3>
          <CollapsibleNavItem
            to='/analytics'
            isCollapsed={isCollapsed}
            icon={<BarChart3Icon size={20} />}
          >
            Estadísticas
          </CollapsibleNavItem>
        </div>

        <div className='mb-6'>
          <h3
            className={cn(
              'mb-3 overflow-hidden whitespace-nowrap text-xs font-medium uppercase tracking-wide text-muted-foreground transition-all',
              isCollapsed
                ? 'h-0 px-2 text-center opacity-0'
                : 'h-auto px-6 text-left opacity-100'
            )}
          >
            Configuración
          </h3>
          <CollapsibleNavItem
            to='/settings'
            isCollapsed={isCollapsed}
            icon={<SettingsIcon size={20} />}
          >
            Ajustes
          </CollapsibleNavItem>
        </div>
      </nav>

      {/* Footer */}
      <div
        className={cn(
          'border-t border-border transition-all',
          isCollapsed ? 'px-2 py-4' : 'px-6 py-4'
        )}
      >
        <LogoutButtonWithTooltip
          onClick={openLogoutModal}
          isCollapsed={isCollapsed}
        />
        <p
          className={cn(
            'overflow-hidden whitespace-nowrap text-center text-xs leading-snug text-muted-foreground transition-all',
            isCollapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'
          )}
        >
          © 2025{' '}
          <span className='font-medium text-brand-purple'>
            Happy Baby Style
          </span>
          <br />
          Hecho con amor para tu bebé
        </p>
      </div>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </aside>
  );
};
