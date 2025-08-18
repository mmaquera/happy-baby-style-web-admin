// RegisterModal Component - Following SOLID principles and Clean Architecture
// Single Responsibility: Renders registration modal only
// Open/Closed: Extensible for new modal features
// Liskov Substitution: Consistent modal behavior
// Interface Segregation: Specific props interface
// Dependency Inversion: Depends on component abstraction

import React from 'react';
import styled from 'styled-components';
import { X, UserPlus } from 'lucide-react';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { RegisterForm } from './RegisterForm';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Styled Components following Single Responsibility Principle
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing[4]};
`;

const ModalContent = styled.div`
  background: ${theme.colors.background.primary};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid ${theme.colors.border.light};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${theme.spacing[6]} ${theme.spacing[6]} ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

const ModalHeaderLeft = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  align-items: flex-start;
`;

const ModalTitle = styled.h2`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const ModalSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  margin: ${theme.spacing[1]} 0 0 0;
`;

const ModalBody = styled.div`
  padding: ${theme.spacing[6]};
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: flex-end;
  padding: ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.background.light};
  margin: ${theme.spacing[6]} -${theme.spacing[6]} -${theme.spacing[6]};
`;

// Component following Single Responsibility Principle
export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <ModalHeader>
          <ModalHeaderLeft>
            <UserPlus size={24} style={{ color: theme.colors.primary }} />
            <div>
              <ModalTitle>Crear Nueva Cuenta</ModalTitle>
              <ModalSubtitle>Regístrate para acceder al sistema</ModalSubtitle>
            </div>
          </ModalHeaderLeft>
          <Button
            variant="ghost"
            size="small"
            onClick={onClose}
            style={{ padding: theme.spacing[2] }}
          >
            <X size={18} />
          </Button>
        </ModalHeader>

        <ModalBody>
          <RegisterForm onSuccess={handleSuccess} />
        </ModalBody>

        <ModalActions>
          <Button
            variant="outline"
            onClick={onClose}
            size="large"
          >
            Cancelar
          </Button>
        </ModalActions>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
