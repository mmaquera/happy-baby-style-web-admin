import type { ReactNode, FC } from 'react';
import { useSidebarStore } from '@happy-baby/shared-stores';

export const useSidebar = useSidebarStore;

export const SidebarProvider: FC<{ children: ReactNode }> = ({ children }) =>
  children as JSX.Element;
