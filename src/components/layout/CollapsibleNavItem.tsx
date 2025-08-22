import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { theme } from '@/styles/theme';
import { Tooltip } from '@/components/ui/Tooltip';
import { useSidebarTooltip } from '@/hooks/useSidebarTooltip';

interface CollapsibleNavItemProps {
  to: string;
  end?: boolean;
  isCollapsed: boolean;
  icon: React.ReactNode;
  children: string;
}

const StyledNavItem = styled(NavLink)<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.isCollapsed ? 0 : theme.spacing[3]};
  padding: ${props => props.isCollapsed ? theme.spacing[4] : theme.spacing[3]} ${props => props.isCollapsed ? theme.spacing[2] : theme.spacing[6]};
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  transition: all ${theme.transitions.base};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.normal};
  border-right: 3px solid transparent;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  position: relative;
  min-height: 48px;

  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.primaryPurple};
  }

  &.active {
    background: ${theme.colors.softPurple};
    color: ${theme.colors.primaryPurple};
    border-right-color: ${theme.colors.primaryPurple};
    font-weight: ${theme.fontWeights.medium};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  span {
    opacity: ${props => props.isCollapsed ? 0 : 1};
    transition: opacity ${theme.transitions.base};
    white-space: nowrap;
    overflow: hidden;
    width: ${props => props.isCollapsed ? 0 : 'auto'};
  }
`;

export const CollapsibleNavItem: React.FC<CollapsibleNavItemProps> = ({
  to,
  end,
  isCollapsed,
  icon,
  children
}) => {
  const { isVisible, showTooltip, hideTooltip } = useSidebarTooltip(300);

  return (
    <StyledNavItem
      to={to}
      end={end || false}
      isCollapsed={isCollapsed}
      onMouseEnter={isCollapsed ? showTooltip : undefined}
      onMouseLeave={isCollapsed ? hideTooltip : undefined}
    >
      {icon}
      <span>{children}</span>
      {isCollapsed && (
        <Tooltip isVisible={isVisible} position="right">
          {children}
        </Tooltip>
      )}
    </StyledNavItem>
  );
};
