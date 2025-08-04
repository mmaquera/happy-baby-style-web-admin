import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${theme.colors.background.secondary};
`;

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 280px; // Sidebar width

  @media (max-width: ${theme.breakpoints.lg}) {
    margin-left: 0;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: ${theme.spacing[6]};
  margin-top: 80px; // Header height

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
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContainer>
        <Header />
        <Content>
          {children}
        </Content>
      </MainContainer>
    </LayoutContainer>
  );
};