import type { ReactNode, FC } from 'react';
import { useSidebarStore } from '@/stores/sidebarStore';

export const useSidebar = useSidebarStore;

export const SidebarProvider: FC<{ children: ReactNode }> = ({ children }) =>
  children as JSX.Element;
