import type React from 'react';
import LogOutIcon from 'lucide-react/dist/esm/icons/log-out';
import { cn } from '@/lib/utils';
import { useSidebarTooltip } from '@happy-baby/shared-hooks';

interface LogoutButtonWithTooltipProps {
  onClick: () => void;
  isCollapsed: boolean;
}

export const LogoutButtonWithTooltip: React.FC<
  LogoutButtonWithTooltipProps
> = ({ onClick, isCollapsed }) => {
  const { isVisible, showTooltip, hideTooltip } = useSidebarTooltip(300);

  return (
    <button
      onClick={onClick}
      onMouseEnter={isCollapsed ? showTooltip : undefined}
      onMouseLeave={isCollapsed ? hideTooltip : undefined}
      className={cn(
        'relative mb-3 flex min-h-12 w-full items-center rounded-md border border-border text-sm text-destructive transition-all hover:border-destructive hover:bg-destructive/10',
        isCollapsed
          ? 'justify-center gap-0 px-2 py-4'
          : 'justify-start gap-3 px-4 py-3'
      )}
    >
      <LogOutIcon size={18} />
      <span
        className={cn(
          'overflow-hidden whitespace-nowrap transition-all',
          isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
        )}
      >
        Cerrar Sesión
      </span>
      {isCollapsed && isVisible ? (
        <span className='pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background'>
          Cerrar Sesión
        </span>
      ) : null}
    </button>
  );
};
