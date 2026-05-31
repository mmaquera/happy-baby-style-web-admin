import type React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebarTooltip } from '@happy-baby/shared-hooks';

interface CollapsibleNavItemProps {
  to: string;
  end?: boolean;
  isCollapsed: boolean;
  icon: React.ReactNode;
  children: string;
}

export const CollapsibleNavItem: React.FC<CollapsibleNavItemProps> = ({
  to,
  end,
  isCollapsed,
  icon,
  children,
}) => {
  const { isVisible, showTooltip, hideTooltip } = useSidebarTooltip(300);

  return (
    <NavLink
      to={to}
      end={end ?? false}
      onMouseEnter={isCollapsed ? showTooltip : undefined}
      onMouseLeave={isCollapsed ? hideTooltip : undefined}
      className={({ isActive }) =>
        cn(
          'relative flex min-h-12 items-center border-r-[3px] text-base transition-all',
          isCollapsed
            ? 'justify-center gap-0 px-2 py-4'
            : 'justify-start gap-3 px-6 py-3',
          isActive
            ? 'border-r-brand-purple bg-brand-purple/10 font-medium text-brand-purple'
            : 'border-r-transparent text-muted-foreground hover:bg-muted hover:text-brand-purple'
        )
      }
    >
      {icon}
      <span
        className={cn(
          'overflow-hidden whitespace-nowrap transition-all',
          isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
        )}
      >
        {children}
      </span>
      {isCollapsed && isVisible ? (
        <span className='pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background'>
          {children}
        </span>
      ) : null}
    </NavLink>
  );
};
