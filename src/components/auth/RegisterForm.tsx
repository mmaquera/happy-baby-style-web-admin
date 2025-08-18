// RegisterForm Component - Following SOLID principles and Clean Architecture
// Single Responsibility: Renders registration form only
// Open/Closed: Extensible for new form fields
// Liskov Substitution: Consistent form behavior
// Interface Segregation: Specific props interface
// Dependency Inversion: Depends on hook abstraction

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Eye, EyeOff, Lock, Mail, User, Phone, Calendar, Users, Shield } from 'lucide-react';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRegisterUser } from '@/hooks/useRegisterUser';
import { CreateUserProfileInput, UserRole } from '@/generated/graphql';

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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[4]};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

const RoleSelector = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

const RoleLabel = styled.label`
  display: block;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[3]};
`;

const RoleGrid = styled.div`
  display: grid;
  gap: ${theme.spacing[3]};
`;

const RoleOption = styled.div<{ selected: boolean }>`
  padding: ${theme.spacing[4]};
  border: 2px solid ${props => props.selected ? theme.colors.primary : theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  background: ${props => props.selected ? theme.colors.background.accent : theme.colors.background.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};

  &:hover {
    border-color: ${theme.colors.primary};
    background: ${props => props.selected ? theme.colors.background.accent : theme.colors.background.hover};
  }
`;

const RoleIcon = styled.div<{ selected?: boolean }>`
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  background: ${props => props.selected ? theme.colors.primary : theme.colors.background.light};
  color: ${props => props.selected ? 'white' : theme.colors.text.secondary};
`;

const RoleInfo = styled.div`
  flex: 1;
`;

const RoleName = styled.div`
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const RoleDescription = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]};
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background.light};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  cursor: pointer;
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

const SuccessMessage = styled.div`
  background: ${theme.colors.success}10;
  border: 1px solid ${theme.colors.success}30;
  color: ${theme.colors.success};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
`;

// Component following Single Responsibility Principle
export const RegisterForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { register, isLoading, error, clearError } = useRegisterUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<CreateUserProfileInput>({
    email: '',
    password: '',
    role: UserRole.customer,
    isActive: true,
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: null
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Clear error when component mounts or error changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [success]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors['email'] = 'Email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors['email'] = 'Email no válido';
    }

    if (!formData.password) {
      newErrors['password'] = 'Contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors['password'] = 'Contraseña debe tener al menos 8 caracteres';
    }

    if (!confirmPassword) {
      newErrors['confirmPassword'] = 'Confirmar contraseña es requerida';
    } else if (formData.password !== confirmPassword) {
      newErrors['confirmPassword'] = 'Las contraseñas no coinciden';
    }

    if (!formData.firstName) {
      newErrors['firstName'] = 'Nombre es requerido';
    }

    if (!formData.lastName) {
      newErrors['lastName'] = 'Apellido es requerido';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
          if (validateForm()) {
        const success = await register(formData);
        if (success) {
          setSuccess(true);
          // Reset form
          setFormData({
            email: '',
            password: '',
            role: UserRole.customer,
            isActive: true,
            firstName: '',
            lastName: '',
            phone: '',
            dateOfBirth: null
          });
          setConfirmPassword('');
          setFormErrors({});
          
          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess();
          }
        }
      }
  };

  const isFormValid = (): boolean => {
    return !!(
      formData.email &&
      formData.password &&
      confirmPassword &&
      formData.firstName &&
      formData.lastName &&
      formData.password === confirmPassword &&
      formData.password.length >= 8
    );
  };

  return (
    <>
      <FormTitle>Crear Nueva Cuenta</FormTitle>
      <FormSubtitle>
        Completa la información para crear tu cuenta de usuario
      </FormSubtitle>

      {success && (
        <SuccessMessage>
          ¡Usuario registrado exitosamente! Ya puedes iniciar sesión.
        </SuccessMessage>
      )}

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      <FormContainer onSubmit={handleSubmit}>
        {/* Account Information Section */}
        <FormGrid>
          <FullWidthField>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              placeholder="ejemplo@correo.com"
              leftIcon={<Mail size={18} />}
              error={formErrors['email'] || ''}
            />
          </FullWidthField>

          <Input
            label="Nombre"
            value={formData.firstName || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
              ...prev,
              firstName: e.target.value
            }))}
            required
            placeholder="Nombre del usuario"
            leftIcon={<User size={18} />}
            error={formErrors['firstName'] || ''}
          />
          
          <Input
            label="Apellido"
            value={formData.lastName || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
              ...prev,
              lastName: e.target.value
            }))}
            required
            placeholder="Apellido del usuario"
            leftIcon={<User size={18} />}
            error={formErrors['lastName'] || ''}
          />

          <Input
            label="Teléfono"
            value={formData.phone || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
              ...prev,
              phone: e.target.value
            }))}
            placeholder="+34 600 000 000"
            leftIcon={<Phone size={18} />}
          />

          <Input
            label="Fecha de Nacimiento"
            type="date"
            value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
              ...prev,
              dateOfBirth: e.target.value || null
            }))}
            placeholder="dd/mm/yyyy"
            leftIcon={<Calendar size={18} />}
          />
        </FormGrid>

        {/* Password Section */}
        <FormGrid>
          <PasswordInputWrapper>
            <Input
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={formData.password || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              placeholder="Mínimo 8 caracteres"
              leftIcon={<Lock size={18} />}
              error={formErrors['password'] || ''}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </PasswordToggle>
          </PasswordInputWrapper>

          <PasswordInputWrapper>
            <Input
              label="Confirmar Contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repite tu contraseña"
              leftIcon={<Lock size={18} />}
              error={formErrors['confirmPassword'] || ''}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </PasswordToggle>
          </PasswordInputWrapper>
        </FormGrid>

        {/* Role Selection */}
        <RoleSelector>
          <RoleLabel>Rol del Usuario</RoleLabel>
          <RoleGrid>
            <RoleOption 
              selected={formData.role === UserRole.customer}
              onClick={() => setFormData(prev => ({ ...prev, role: UserRole.customer }))}
            >
              <RoleIcon selected={formData.role === UserRole.customer}><Users size={20} /></RoleIcon>
              <RoleInfo>
                <RoleName>Cliente</RoleName>
                <RoleDescription>Acceso a funciones básicas de cliente</RoleDescription>
              </RoleInfo>
            </RoleOption>

            <RoleOption 
              selected={formData.role === UserRole.staff}
              onClick={() => setFormData(prev => ({ ...prev, role: UserRole.staff }))}
            >
              <RoleIcon selected={formData.role === UserRole.staff}><Shield size={20} /></RoleIcon>
              <RoleInfo>
                <RoleName>Staff</RoleName>
                <RoleDescription>Acceso a gestión de contenido y soporte</RoleDescription>
              </RoleInfo>
            </RoleOption>
          </RoleGrid>
        </RoleSelector>

        {/* Active Status */}
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="isActiveRegister"
            checked={formData.isActive || false}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ 
              ...prev, 
              isActive: e.target.checked 
            }))}
          />
          <CheckboxLabel htmlFor="isActiveRegister">
            Usuario activo (puede acceder al sistema)
          </CheckboxLabel>
        </CheckboxContainer>

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          isLoading={isLoading}
          disabled={!isFormValid()}
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>
      </FormContainer>
    </>
  );
};

export default RegisterForm;
