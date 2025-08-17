import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { User, UserRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { theme } from '@/styles/theme';
import { 
  MoreVertical,
  Edit,
  Eye,
  UserCheck,
  UserX,
  Trash2,
  Key,
  Shield,
  ShieldOff
} from 'lucide-react';

interface UserActionsMenuProps {
  user: User;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onActivate?: (user: User) => void;
  onDeactivate?: (user: User) => void;
  onDelete?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onPromoteToAdmin?: (user: User) => void;
  onDemoteFromAdmin?: (user: User) => void;
  disabled?: boolean;
}

// Styled Components
const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
  z-index: 1;
`;

const MenuButton = styled.button`
  padding: ${theme.spacing[1]};
  border-radius: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  color: ${theme.colors.warmGray};

  &:hover {
    background-color: ${theme.colors.background.hover};
    color: ${theme.colors.darkGray};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MenuDropdown = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isOpen', 'top', 'left'].includes(prop),
})<{ isOpen: boolean; top: number; left: number }>`
  position: fixed !important;
  top: ${props => props.top}px !important;
  left: ${props => props.left}px !important;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 999999 !important;
  min-width: 200px;
  max-width: 250px;
  width: 200px;
  max-height: calc(100vh - 32px) !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  transform-origin: top right;
  
  /* Force it to be above everything */
  contain: layout style paint;
  isolation: isolate;
  
  /* Ensure scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.background.light};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border.medium};
    border-radius: 3px;
    
    &:hover {
      background: ${theme.colors.border.dark};
    }
  }
`;

const MenuSection = styled.div`
  padding: ${theme.spacing[2]} 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.border.light};
  }
`;

const MenuItem = styled.button<{ variant?: 'default' | 'success' | 'warning' | 'danger' }>`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  text-align: left;
  border: none;
  background: none;
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  transition: background-color ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.background.light};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ variant }) => {
    switch (variant) {
      case 'success':
        return `color: ${theme.colors.success};`;
      case 'warning':
        return `color: ${theme.colors.warning};`;
      case 'danger':
        return `color: ${theme.colors.error};`;
      default:
        return `color: ${theme.colors.text.primary};`;
    }
  }}
`;

const MenuLabel = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  font-weight: ${theme.fontWeights.semibold};
  letter-spacing: 0.5px;
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
`;

export const UserActionsMenu: React.FC<UserActionsMenuProps> = ({
  user,
  isOpen,
  onToggle,
  onClose,
  onEdit,
  onView,
  onActivate,
  onDeactivate,
  onDelete,
  onResetPassword,
  onPromoteToAdmin,
  onDemoteFromAdmin,
  disabled = false
}) => {
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const calculateMenuPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const menuWidth = 200;
      const padding = 16;
      
      // Try to get actual menu height if available
      let menuHeight = 350; // Default estimate
      if (menuRef.current) {
        // If menu is already rendered, use its actual height
        const menuRect = menuRef.current.getBoundingClientRect();
        if (menuRect.height > 0) {
          menuHeight = menuRect.height;
        }
      }
      
      // Position relative to viewport (since we're using position: fixed)
      let top = rect.bottom + 8;
      let left = rect.left - menuWidth + rect.width; // Align right edge of menu with right edge of button
      
      // Adjust if menu would go off-screen vertically
      if (top + menuHeight > viewportHeight - padding) {
        // Try positioning above the button
        const topAbove = rect.top - menuHeight - 8;
        if (topAbove >= padding) {
          top = topAbove;
        } else {
          // If it doesn't fit above either, position it to fit in viewport
          top = viewportHeight - menuHeight - padding;
        }
      }
      
      // Ensure top is not negative
      top = Math.max(padding, top);
      
      // Adjust if menu would go off-screen horizontally  
      if (left + menuWidth > viewportWidth - padding) {
        left = viewportWidth - menuWidth - padding;
      }
      if (left < padding) {
        left = padding;
      }
      
      setMenuPosition({ top, left });
      
      
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Siempre calcular posición cuando se abre el menú
    if (!isOpen) {
      calculateMenuPosition();
    }
    onToggle();
  };

  const handleItemClick = (action: () => void) => {
    action();
    onClose();
  };

  const handleClickOutside = () => {
    onClose();
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
    return undefined;
  }, [isOpen]);

  // Recalculate position on scroll or resize
  useEffect(() => {
    if (isOpen) {
      const handleReposition = () => {
        calculateMenuPosition();
      };
      
      window.addEventListener('scroll', handleReposition, true);
      window.addEventListener('resize', handleReposition);
      
      return () => {
        window.removeEventListener('scroll', handleReposition, true);
        window.removeEventListener('resize', handleReposition);
      };
    }
    return undefined;
  }, [isOpen]);

  // Recalculate position after menu is rendered
  useEffect(() => {
    if (isOpen && menuRef.current) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        calculateMenuPosition();
      }, 10);
      
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen]);



  return (
    <>
      <MenuContainer>
        <MenuButton
          ref={buttonRef}
          onClick={handleMenuClick}
          disabled={disabled}

        >
          <MoreVertical size={16} />
        </MenuButton>
      </MenuContainer>
      
      {/* Render menu as portal to bypass parent container constraints */}
      {createPortal(
        <MenuDropdown 
          ref={menuRef}
          isOpen={isOpen}
          top={menuPosition.top}
          left={menuPosition.left}

        >
          {/* Basic Actions */}
          <MenuSection>
            <MenuLabel>Acciones Básicas</MenuLabel>
            <MenuItem onClick={() => handleItemClick(() => onView(user))}>
              <Eye size={16} />
              Ver Detalles
            </MenuItem>
            <MenuItem onClick={() => handleItemClick(() => onEdit(user))}>
              <Edit size={16} />
              Editar Usuario
            </MenuItem>
          </MenuSection>

          {/* Status Actions */}
          <MenuSection>
            <MenuLabel>Estado</MenuLabel>
            {user.isActive ? (
              onDeactivate && (
                <MenuItem 
                  variant="warning" 
                  onClick={() => handleItemClick(() => onDeactivate(user))}
                >
                  <UserX size={16} />
                  Desactivar Usuario
                </MenuItem>
              )
            ) : (
              onActivate && (
                <MenuItem 
                  variant="success" 
                  onClick={() => handleItemClick(() => onActivate(user))}
                >
                  <UserCheck size={16} />
                  Activar Usuario
                </MenuItem>
              )
            )}
          </MenuSection>

          {/* Security Actions */}
          <MenuSection>
            <MenuLabel>Seguridad</MenuLabel>
            {onResetPassword && (
              <MenuItem onClick={() => handleItemClick(() => onResetPassword(user))}>
                <Key size={16} />
                Restablecer Contraseña
              </MenuItem>
            )}
            
            {user.role !== UserRole.admin ? (
              onPromoteToAdmin && (
                <MenuItem 
                  variant="warning"
                  onClick={() => handleItemClick(() => onPromoteToAdmin(user))}
                >
                  <Shield size={16} />
                  Promover a Admin
                </MenuItem>
              )
            ) : (
              onDemoteFromAdmin && (
                <MenuItem 
                  variant="warning"
                  onClick={() => handleItemClick(() => onDemoteFromAdmin(user))}
                >
                  <ShieldOff size={16} />
                  Remover Admin
                </MenuItem>
              )
            )}
          </MenuSection>

          {/* Danger Actions */}
          {onDelete && (
            <MenuSection>
              <MenuLabel>Zona Peligrosa</MenuLabel>
              <MenuItem 
                variant="danger" 
                onClick={() => handleItemClick(() => onDelete(user))}
              >
                <Trash2 size={16} />
                Eliminar Usuario
              </MenuItem>
            </MenuSection>
          )}
        </MenuDropdown>,
        document.body // Render directly to body to bypass any container overflow issues
      )}
    </>
  );
};

export default UserActionsMenu;