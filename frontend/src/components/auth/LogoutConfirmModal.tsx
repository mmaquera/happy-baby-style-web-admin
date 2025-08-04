import React from 'react';
import styled from 'styled-components';
import { LogOut, X, AlertTriangle } from 'lucide-react';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';

// Types
interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

// Styled Components
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transition: all ${theme.transitions.base};
  padding: ${theme.spacing[4]};
`;

const ModalContent = styled.div<{ isOpen: boolean }>`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.xl};
  max-width: 400px;
  width: 100%;
  transform: ${({ isOpen }) => isOpen ? 'scale(1)' : 'scale(0.9)'};
  transition: all ${theme.transitions.base};
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

const ModalTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.warmGray};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.primaryPurple};
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing[6]};
`;

const WarningIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.warning}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing[4]} auto;
  border: 2px solid ${theme.colors.warning};
  
  svg {
    width: 30px;
    height: 30px;
    color: ${theme.colors.warning};
  }
`;

const ModalMessage = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin: 0 0 ${theme.spacing[4]} 0;
  line-height: 1.6;
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: center;
  padding-top: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.border.light};

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

// Component
export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleClose}>
      <ModalContent isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <LogOut size={24} />
            Cerrar Sesión
          </ModalTitle>
          <CloseButton onClick={handleClose} disabled={isLoading}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <WarningIcon>
            <AlertTriangle />
          </WarningIcon>
          
          <ModalMessage>
            ¿Estás seguro de que quieres cerrar tu sesión? 
            Tendrás que volver a iniciar sesión para acceder al panel de administración.
          </ModalMessage>

          <ModalActions>
            <Button
              variant="outline"
              size="medium"
              onClick={handleClose}
              disabled={isLoading}
              fullWidth
            >
              Cancelar
            </Button>
            
            <Button
              variant="danger"
              size="medium"
              onClick={handleConfirm}
              isLoading={isLoading}
              icon={<LogOut size={18} />}
              fullWidth
            >
              {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
            </Button>
          </ModalActions>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LogoutConfirmModal; 