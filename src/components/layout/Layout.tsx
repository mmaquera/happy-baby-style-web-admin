import type React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SidebarToggle } from './SidebarToggle';
import { useSidebar } from '@/contexts/SidebarContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? 80 : 280;

  return (
    <div className='flex min-h-screen overflow-x-hidden bg-background'>
      <Sidebar />
      <SidebarToggle />
      <Header />
      <div
        className='flex min-w-0 flex-1 flex-col overflow-x-hidden transition-[margin-left] duration-200 lg:ml-0'
        style={{ marginLeft: sidebarWidth }}
      >
        <main className='mt-20 min-w-0 max-w-full flex-1 overflow-x-hidden p-6 md:mt-[70px] sm:mt-[60px] md:p-4 sm:p-3'>
          {children}
        </main>
      </div>
    </div>
  );
};
