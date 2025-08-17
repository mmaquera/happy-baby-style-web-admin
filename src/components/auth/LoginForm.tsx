// LoginForm Component - Following SOLID principles and Clean Architecture
// Single Responsibility: Renders login form only
// Open/Closed: Extensible for new form fields
// Liskov Substitution: Consistent form behavior
// Interface Segregation: Specific props interface
// Dependency Inversion: Depends on hook abstraction

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLoginForm } from '@/hooks/useLoginForm';

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

const ForgotPasswordLink = styled.a`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.primaryPurple};
  text-decoration: none;
  font-weight: ${theme.fontWeights.medium};
  transition: color ${theme.transitions.fast};
  align-self: flex-end;
  margin-top: -${theme.spacing[2]};

  &:hover {
    color: ${theme.colors.coralAccent};
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: ${theme.colors.error}10;
  border: 1px solid ${theme.colors.error}30;
  color: ${theme.colors.error};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
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

  const { register, handleSubmit, formState: { errors } } = form;

  // Clear error when component mounts or error changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

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

        <ForgotPasswordLink href="#" onClick={(e) => e.preventDefault()}>
          ¿Olvidaste tu contraseña?
        </ForgotPasswordLink>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          isLoading={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </FormContainer>
    </>
  );
};

export default LoginForm;
