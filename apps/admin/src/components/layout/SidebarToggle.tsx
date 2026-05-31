import type React from 'react';
import ChevronLeftIcon from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRightIcon from 'lucide-react/dist/esm/icons/chevron-right';
import { useSidebarStore as useSidebar } from '@happy-baby/shared-stores';

export const SidebarToggle: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      className='fixed top-6 z-[9999] hidden h-8 w-8 items-center justify-center rounded-full border-2 border-brand-purple bg-white shadow-lg transition-all hover:scale-110 hover:bg-muted hover:shadow-xl active:scale-95 lg:flex'
      style={{ left: isCollapsed ? 64 : 264 }}
    >
      {isCollapsed ? (
        <ChevronRightIcon size={16} className='text-brand-purple' />
      ) : (
        <ChevronLeftIcon size={16} className='text-brand-purple' />
      )}
    </button>
  );
};
