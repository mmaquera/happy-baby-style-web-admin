// LoginForm Component - Following SOLID principles and Clean Architecture
// Single Responsibility: Renders login form only
// Open/Closed: Extensible for new form fields
// Liskov Substitution: Consistent form behavior
// Interface Segregation: Specific props interface
// Dependency Inversion: Depends on hook abstraction

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Eye, EyeOff, Lock, Mail, AlertCircle, RefreshCw } from 'lucide-react';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLoginForm } from '@/hooks/useLoginForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';

// Styled Components following Single Responsibility Principle
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const FormTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const FormSubtitle = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing[4]} 0;
`;

const ForgotPasswordLink = styled.button`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.primaryPurple};
  text-decoration: none;
  font-weight: ${theme.fontWeights.medium};
  transition: color ${theme.transitions.fast};
  align-self: flex-end;
  margin-top: -${theme.spacing[2]};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing[1]};
  border-radius: ${theme.borderRadius.sm};

  &:hover {
    color: ${theme.colors.coralAccent};
    text-decoration: underline;
    background: ${theme.colors.background.accent};
  }

  &:active {
    transform: scale(0.98);
  }
`;

// ✅ Banner de error mejorado siguiendo estándares
const EnhancedErrorMessage = styled.div`
  background: ${theme.colors.error}15;
  border: 1px solid ${theme.colors.error}30;
  color: ${theme.colors.error};
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  margin-top: ${theme.spacing[3]};
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ErrorIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing[2]};
  color: ${theme.colors.error};
`;

const ErrorTitle = styled.div`
  font-weight: ${theme.fontWeights.medium};
  margin-bottom: ${theme.spacing[1]};
`;

const ErrorDescription = styled.div`
  font-size: ${theme.fontSizes.sm};
  opacity: 0.9;
  margin-bottom: ${theme.spacing[3]};
`;

// ✅ Acciones de error siguiendo estándares
const ErrorActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  justify-content: center;
  flex-wrap: wrap;
`;


// Component following Single Responsibility Principle
export const LoginForm: React.FC = () => {
  const {
    form,
    isLoading,
    error,
    showPassword,
    onSubmit,
    togglePasswordVisibility,
    clearError,
  } = useLoginForm();

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const { register, handleSubmit, formState: { errors } } = form;

  // Enhanced error handling following development standards
  useEffect(() => {
    // Clear error when user starts typing (better UX)
    if (error && (form.watch('email') || form.watch('password'))) {
      const timer = setTimeout(() => {
        clearError();
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined; // ✅ Fix linting error
  }, [error, clearError, form]);

  // Handle forgot password modal
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsForgotPasswordOpen(true);
  };

  const closeForgotPassword = () => {
    setIsForgotPasswordOpen(false);
  };

  return (
    <>
      <FormTitle>Iniciar Sesión</FormTitle>
      <FormSubtitle>
        Ingresa tus credenciales para acceder al panel de administración
      </FormSubtitle>

      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="admin@happybabystyle.com"
          leftIcon={<Mail size={18} />}
          fullWidth
          {...register('email', {
            required: 'El correo electrónico es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Ingresa un correo electrónico válido',
            },
          })}
          error={errors.email?.message || ''}
        />

        <Input
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          leftIcon={<Lock size={18} />}
          rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          rightIconClickable={true}
          onRightIconClick={togglePasswordVisibility}
          rightIconAriaLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          fullWidth
          {...register('password', {
            required: 'La contraseña es requerida',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres',
            },
          })}
          error={errors.password?.message || ''}
        />

        <ForgotPasswordLink 
          type="button"
          onClick={handleForgotPassword}
          aria-label="¿Olvidaste tu contraseña?"
        >
          ¿Olvidaste tu contraseña?
        </ForgotPasswordLink>

        {/* ✅ Banner de error mejorado siguiendo estándares */}
        {error && (
          <EnhancedErrorMessage role="alert" aria-live="polite">
            <ErrorIcon>
              <AlertCircle size={20} />
            </ErrorIcon>
            <ErrorTitle>Error de autenticación</ErrorTitle>
            <ErrorDescription>{error}</ErrorDescription>
            
            <ErrorActions>
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={clearError}
              >
                <RefreshCw size={14} />
                Reintentar
              </Button>
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => setIsForgotPasswordOpen(true)}
              >
                Recuperar contraseña
              </Button>
            </ErrorActions>
          </EnhancedErrorMessage>
        )}

        {/* ✅ Botón con estados mejorados siguiendo estándares */}
        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? 'Verificando credenciales...' : 'Iniciar Sesión'}
        </Button>
      </FormContainer>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={closeForgotPassword}
      />
    </>
  );
};

export default LoginForm;
