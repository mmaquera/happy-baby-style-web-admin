import React from 'react';
import styled from 'styled-components';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  Calendar,
  Users,
  Shield,
} from 'lucide-react';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserRole } from '@/generated/graphql';
import { useRegisterForm } from '@/hooks/useRegisterForm';

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
  border: 2px solid
    ${props =>
      props.selected ? theme.colors.primary : theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  background: ${props =>
    props.selected
      ? theme.colors.background.accent
      : theme.colors.background.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};

  &:hover {
    border-color: ${theme.colors.primary};
    background: ${props =>
      props.selected
        ? theme.colors.background.accent
        : theme.colors.background.hover};
  }
`;

const RoleIcon = styled.div<{ selected?: boolean }>`
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  background: ${props =>
    props.selected ? theme.colors.primary : theme.colors.background.light};
  color: ${props => (props.selected ? 'white' : theme.colors.text.secondary)};
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

export const RegisterForm: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const {
    form,
    isLoading,
    error,
    success,
    showPassword,
    showConfirmPassword,
    role,
    isActive,
    dateOfBirth,
    onSubmit,
    togglePassword,
    toggleConfirmPassword,
    setRole,
    setIsActive,
    setDateOfBirth,
  } = useRegisterForm(onSuccess);

  const {
    register,
    formState: { errors },
  } = form;

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

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <FormContainer onSubmit={onSubmit} noValidate>
        <FormGrid>
          <FullWidthField>
            <Input
              id='email'
              label='Email'
              type='email'
              placeholder='ejemplo@correo.com'
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />
          </FullWidthField>

          <Input
            id='firstName'
            label='Nombre'
            placeholder='Nombre del usuario'
            leftIcon={<User size={18} />}
            error={errors.firstName?.message}
            {...register('firstName')}
          />

          <Input
            id='lastName'
            label='Apellido'
            placeholder='Apellido del usuario'
            leftIcon={<User size={18} />}
            error={errors.lastName?.message}
            {...register('lastName')}
          />

          <Input
            id='phone'
            label='Teléfono'
            placeholder='+34 600 000 000'
            leftIcon={<Phone size={18} />}
            {...register('phone')}
          />

          <Input
            id='dateOfBirth'
            label='Fecha de Nacimiento'
            type='date'
            value={dateOfBirth}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDateOfBirth(e.target.value)
            }
            placeholder='dd/mm/yyyy'
            leftIcon={<Calendar size={18} />}
          />
        </FormGrid>

        <FormGrid>
          <PasswordInputWrapper>
            <Input
              id='password'
              label='Contraseña'
              type={showPassword ? 'text' : 'password'}
              placeholder='Mínimo 8 caracteres'
              leftIcon={<Lock size={18} />}
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordToggle type='button' onClick={togglePassword}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </PasswordToggle>
          </PasswordInputWrapper>

          <PasswordInputWrapper>
            <Input
              id='confirmPassword'
              label='Confirmar Contraseña'
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Repite tu contraseña'
              leftIcon={<Lock size={18} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <PasswordToggle type='button' onClick={toggleConfirmPassword}>
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </PasswordToggle>
          </PasswordInputWrapper>
        </FormGrid>

        <RoleSelector>
          <RoleLabel>Rol del Usuario</RoleLabel>
          <RoleGrid>
            <RoleOption
              selected={role === UserRole.customer}
              onClick={() => setRole(UserRole.customer)}
            >
              <RoleIcon selected={role === UserRole.customer}>
                <Users size={20} />
              </RoleIcon>
              <RoleInfo>
                <RoleName>Cliente</RoleName>
                <RoleDescription>
                  Acceso a funciones básicas de cliente
                </RoleDescription>
              </RoleInfo>
            </RoleOption>

            <RoleOption
              selected={role === UserRole.staff}
              onClick={() => setRole(UserRole.staff)}
            >
              <RoleIcon selected={role === UserRole.staff}>
                <Shield size={20} />
              </RoleIcon>
              <RoleInfo>
                <RoleName>Staff</RoleName>
                <RoleDescription>
                  Acceso a gestión de contenido y soporte
                </RoleDescription>
              </RoleInfo>
            </RoleOption>
          </RoleGrid>
        </RoleSelector>

        <CheckboxContainer>
          <Checkbox
            type='checkbox'
            id='isActiveRegister'
            checked={isActive}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIsActive(e.target.checked)
            }
          />
          <CheckboxLabel htmlFor='isActiveRegister'>
            Usuario activo (puede acceder al sistema)
          </CheckboxLabel>
        </CheckboxContainer>

        <Button
          type='submit'
          variant='primary'
          size='large'
          fullWidth
          isLoading={isLoading}
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>
      </FormContainer>
    </>
  );
};

export default RegisterForm;
