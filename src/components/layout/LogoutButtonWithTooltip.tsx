import React from 'react';
import styled from 'styled-components';
import { LogOut } from 'lucide-react';
import { theme } from '@/styles/theme';
import { Tooltip } from '@/components/ui/Tooltip';
import { useSidebarTooltip } from '@/hooks/useSidebarTooltip';

interface LogoutButtonWithTooltipProps {
  onClick: () => void;
  isCollapsed: boolean;
}

const StyledLogoutButton = styled.button<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.isCollapsed ? 0 : theme.spacing[3]};
  width: 100%;
  padding: ${props => props.isCollapsed ? theme.spacing[4] : theme.spacing[3]} ${props => props.isCollapsed ? theme.spacing[2] : theme.spacing[4]};
  background: none;
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  margin-bottom: ${theme.spacing[3]};
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  min-height: 48px;
  position: relative;

  &:hover {
    background: ${theme.colors.error}10;
    border-color: ${theme.colors.error};
    color: ${theme.colors.error};
  }

  svg {
    width: 18px;
    height: 18px;
  }

  span {
    opacity: ${props => props.isCollapsed ? 0 : 1};
    transition: opacity ${theme.transitions.base};
    white-space: nowrap;
    overflow: hidden;
    width: ${props => props.isCollapsed ? 0 : 'auto'};
  }
`;

export const LogoutButtonWithTooltip: React.FC<LogoutButtonWithTooltipProps> = ({
  onClick,
  isCollapsed
}) => {
  const { isVisible, showTooltip, hideTooltip } = useSidebarTooltip(300);

  return (
    <StyledLogoutButton
      onClick={onClick}
      isCollapsed={isCollapsed}
      onMouseEnter={isCollapsed ? showTooltip : undefined}
      onMouseLeave={isCollapsed ? hideTooltip : undefined}
    >
      <LogOut />
      <span>Cerrar Sesión</span>
      {isCollapsed && (
        <Tooltip isVisible={isVisible} position="right">
          Cerrar Sesión
        </Tooltip>
      )}
    </StyledLogoutButton>
  );
};
