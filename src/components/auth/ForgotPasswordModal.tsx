// ForgotPasswordModal Component - Following SOLID principles and Clean Architecture
// Single Responsibility: Renders forgot password form only
// Open/Closed: Extensible for new form features
// Liskov Substitution: Consistent modal behavior
// Interface Segregation: Specific props interface
// Dependency Inversion: Depends on hook abstraction

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForgotPassword } from '@/hooks/useForgotPassword';

// Styled Components following Single Responsibility Principle
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  padding: ${theme.spacing[4]};
`;

const ModalContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[6]} ${theme.spacing[6]} ${theme.spacing[4]} ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

const ModalTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.warmGray};
  cursor: pointer;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.primaryPurple};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing[6]};
`;

const ModalFooter = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[6]} ${theme.spacing[6]} ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.border.light};
  display: flex;
  gap: ${theme.spacing[3]};
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const FormDescription = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0 0 ${theme.spacing[4]} 0;
`;

const SuccessMessage = styled.div`
  background: ${theme.colors.success}10;
  border: 1px solid ${theme.colors.success}30;
  color: ${theme.colors.success};
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  font-size: ${theme.fontSizes.base};
  text-align: center;
`;

const ErrorMessage = styled.div`
  background: ${theme.colors.error}10;
  border: 1px solid ${theme.colors.error}30;
  color: ${theme.colors.error};
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  font-size: ${theme.fontSizes.base};
  text-align: center;
`;

// Interface following Interface Segregation Principle
interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Component following Single Responsibility Principle
export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    email,
    isLoading,
    isSuccess,
    error,
    setEmail,
    submitForm,
    resetState,
    clearError,
  } = useForgotPassword();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(email);
  };

  // Handle modal close
  const handleClose = () => {
    if (!isLoading) {
      resetState();
      onClose();
    }
  };

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
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
  }, [isOpen]);

  // Clear error when component mounts
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Recuperar Contraseña</ModalTitle>
          <CloseButton onClick={handleClose} aria-label="Cerrar modal">
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {isSuccess ? (
            <SuccessMessage>
              <CheckCircle size={24} />
              <div>
                <strong>¡Correo enviado!</strong><br />
                Hemos enviado las instrucciones para recuperar tu contraseña a tu correo electrónico.
              </div>
            </SuccessMessage>
          ) : (
            <>
              <FormDescription>
                Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar tu contraseña.
              </FormDescription>

              <FormContainer onSubmit={handleSubmit}>
                <Input
                  label="Correo Electrónico"
                  type="email"
                  placeholder="admin@happybabystyle.com"
                  leftIcon={<Mail size={18} />}
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />

                {error && (
                  <ErrorMessage>
                    <AlertCircle size={20} />
                    {error}
                  </ErrorMessage>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                </Button>
              </FormContainer>
            </>
          )}
        </ModalBody>

        {isSuccess && (
          <ModalFooter>
            <Button
              variant="outline"
              size="medium"
              fullWidth
              onClick={handleClose}
            >
              Cerrar
            </Button>
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ForgotPasswordModal;
