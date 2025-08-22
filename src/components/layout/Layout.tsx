import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SidebarToggle } from './SidebarToggle';
import { useSidebar } from '@/contexts/SidebarContext';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${theme.colors.background.secondary};
  overflow-x: hidden;
`;

const MainContainer = styled.div<{ sidebarWidth: number }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.sidebarWidth}px;
  transition: margin-left ${theme.transitions.base};
  min-width: 0;
  overflow-x: hidden;
  width: calc(100vw - ${props => props.sidebarWidth}px);
  box-sizing: border-box;

  @media (max-width: ${theme.breakpoints.lg}) {
    margin-left: 0;
    width: 100vw;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: ${theme.spacing[6]};
  margin-top: 80px; // Header height
  overflow-x: hidden;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[4]};
    margin-top: 70px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[3]};
    margin-top: 60px;
  }
`;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? 80 : 280;

  return (
    <LayoutContainer>
      <Sidebar />
      <SidebarToggle />
      <Header />
      <MainContainer sidebarWidth={sidebarWidth}>
        <Content>
          {children}
        </Content>
      </MainContainer>
    </LayoutContainer>
  );
};