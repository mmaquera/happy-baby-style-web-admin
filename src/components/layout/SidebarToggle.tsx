import React from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { theme } from '@/styles/theme';
import { useSidebar } from '@/contexts/SidebarContext';

const ToggleButton = styled.button<{ isCollapsed: boolean }>`
  position: fixed;
  top: ${theme.spacing[6]};
  left: ${props => props.isCollapsed ? '64px' : '264px'};
  width: 32px;
  height: 32px;
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.primaryPurple};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.base};
  z-index: 9999;
  box-shadow: ${theme.shadows.lg};

  &:hover {
    background: ${theme.colors.background.accent};
    border-color: ${theme.colors.primaryPurple};
    transform: scale(1.1);
    box-shadow: ${theme.shadows.xl};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${theme.colors.primaryPurple};
    transition: transform ${theme.transitions.base};
  }

  &:hover svg {
    transform: scale(1.2);
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

export const SidebarToggle: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <ToggleButton 
      isCollapsed={isCollapsed} 
      onClick={toggleSidebar}
      aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
    >
      {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
    </ToggleButton>
  );
};
