import React, { useState } from 'react';
import styled from 'styled-components';
import { UserRole } from '@/generated/graphql';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCreateUser } from '@/hooks/useUsersGraphQL';

import { 
  UserPlus, 
  X, 
  Mail, 
  Shield, 
  Users, 
  Phone,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  User as UserIcon
} from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserInput) => void;
  isLoading: boolean;
}

// Styled Components
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
  z-index: 1000;
  padding: 16px;
  overflow-y: auto;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 650px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(32px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const HeaderIcon = styled.div`
  padding: ${theme.spacing[2]};
  background: ${theme.colors.background.accent};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.primaryPurple};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const HeaderText = styled.div`
  flex: 1;
`;

const ModalTitle = styled.h2`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[1]} 0;
  line-height: 1.4;
  font-family: ${theme.fonts.heading};
`;

const ModalSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
  font-family: ${theme.fonts.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.base};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.background.hover};
    color: ${theme.colors.text.primary};
  }
`;

const StepsIndicator = styled.div`
  position: sticky;
  top: 88px;
  background: ${theme.colors.background.light};
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  opacity: ${props => props.active || props.completed ? 1 : 0.5};
`;

const StepNumber = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => 
    props.completed ? theme.colors.success :
    props.active ? theme.colors.primaryPurple : 
    theme.colors.border.medium};
  color: ${props => 
    props.completed || props.active ? theme.colors.white : theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  border: 2px solid ${props => 
    props.completed ? theme.colors.success :
    props.active ? theme.colors.primaryPurple : 
    theme.colors.border.medium};
  transition: all ${theme.transitions.fast};
`;

const StepLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  font-family: ${theme.fonts.primary};
`;

const StepLine = styled.div`
  width: 32px;
  height: 2px;
  background: ${theme.colors.border.medium};
  margin: 0 ${theme.spacing[3]};
`;

const ModalContent = styled.div`
  padding: ${theme.spacing[6]};
  padding-top: ${theme.spacing[4]};
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing[8]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
  font-family: ${theme.fonts.heading};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const FieldHint = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  font-family: ${theme.fonts.primary};
`;



const PasswordStrength = styled.div`
  margin-top: ${theme.spacing[2]};
`;

const StrengthBar = styled.div`
  height: 3px;
  background: ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  overflow: hidden;
  margin-bottom: ${theme.spacing[1]};
`;

const StrengthFill = styled.div<{ strength: number }>`
  height: 100%;
  width: ${props => props.strength}%;
  background: ${props => 
    props.strength < 30 ? theme.colors.error :
    props.strength < 70 ? theme.colors.warning :
    theme.colors.success};
  transition: all ${theme.transitions.base};
`;

const StrengthText = styled.span<{ strength: number }>`
  font-size: ${theme.fontSizes.xs};
  color: ${props => 
    props.strength < 30 ? theme.colors.error :
    props.strength < 70 ? theme.colors.warning :
    theme.colors.success};
  font-weight: ${theme.fontWeights.medium};
  font-family: ${theme.fonts.primary};
`;

const RoleSelector = styled.div`
  margin-bottom: ${theme.spacing[5]};
`;

const RoleLabel = styled.label`
  display: block;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[3]};
  font-family: ${theme.fonts.primary};
`;

const RoleHint = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing[2]};
  font-style: italic;
`;

const RoleOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const RoleOption = styled.div<{ selected: boolean }>`
  padding: ${theme.spacing[4]};
  border: 2px solid ${props => props.selected ? theme.colors.primaryPurple : theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  background: ${props => props.selected ? theme.colors.background.accent : theme.colors.white};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  user-select: none;
  position: relative;

  &:hover {
    border-color: ${theme.colors.primaryPurple};
    background: ${props => props.selected ? theme.colors.background.accent : theme.colors.background.hover};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${theme.shadows.sm};
  }

  ${props => props.selected && `
    &::before {
      content: "✓";
      position: absolute;
      top: 8px;
      right: 12px;
      color: ${theme.colors.primaryPurple};
      font-weight: bold;
      font-size: 16px;
    }
  `}
`;

const RoleIconContainer = styled.div<{ selected?: boolean }>`
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.base};
  background: ${props => props.selected ? theme.colors.primaryPurple : theme.colors.background.light};
  color: ${props => props.selected ? theme.colors.white : theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.fast};
  flex-shrink: 0;
`;

const RoleInfo = styled.div`
  flex: 1;
`;

const RoleName = styled.div`
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
  font-family: ${theme.fonts.heading};
`;

const RoleDescription = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  font-family: ${theme.fonts.primary};
`;

const ActiveUserCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background.light};
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.primaryPurple};
    background: ${theme.colors.background.hover};
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${theme.colors.primaryPurple};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  flex: 1;
  font-family: ${theme.fonts.primary};
`;

const ModalFooter = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: flex-end;
  padding: ${theme.spacing[5]} ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.background.light};
`;

// Utility functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^A-Za-z0-9]/.test(password)) strength += 10;
  return Math.min(strength, 100);
};

const getPasswordStrengthText = (strength: number): string => {
  if (strength < 30) return 'Débil';
  if (strength < 70) return 'Media';
  return 'Fuerte';
};

// Component
export const ImprovedCreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<CreateUserInput>({
    email: '',
    password: '',
    role: UserRole.customer,
    isActive: true,
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      birthDate: undefined
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email es requerido';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email no válido';
    }

    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida';
    } else if (calculatePasswordStrength(formData.password) < 50) {
      newErrors.password = 'Contraseña muy débil';
    }

    if (!formData.profile?.firstName) {
      newErrors.firstName = 'Nombre es requerido';
    }

    if (!formData.profile?.lastName) {
      newErrors.lastName = 'Apellido es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      password: '',
      role: UserRole.customer,
      isActive: true,
      profile: {
        firstName: '',
        lastName: '',
        phone: '',
        birthDate: undefined
      }
    });
    setErrors({});
    onClose();
  };

  const isFormValid = (): boolean => {
    return !!(
      formData.email &&
      formData.password &&
      formData.profile?.firstName &&
      formData.profile?.lastName &&
      isValidEmail(formData.email) &&
      calculatePasswordStrength(formData.password) >= 50
    );
  };

  const passwordStrength = calculatePasswordStrength(formData.password);



  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderLeft>
            <HeaderIcon>
              <UserPlus size={20} />
            </HeaderIcon>
            <HeaderText>
              <ModalTitle>Crear Nuevo Usuario</ModalTitle>
              <ModalSubtitle>Completa la información para crear una nueva cuenta de usuario</ModalSubtitle>
            </HeaderText>
          </HeaderLeft>
          <CloseButton onClick={handleClose}>
            <X size={18} />
          </CloseButton>
        </ModalHeader>

        <StepsIndicator>
          <Step active={true} completed={isFormValid()}>
            <StepNumber active={true} completed={isFormValid()}>1</StepNumber>
            <StepLabel>Datos Básicos</StepLabel>
          </Step>
          <StepLine />
          <Step active={isFormValid()} completed={false}>
            <StepNumber active={isFormValid()}>2</StepNumber>
            <StepLabel>Configuración</StepLabel>
          </Step>
        </StepsIndicator>

        <ModalContent>
          {/* Account Information Section */}
          <Section>
            <SectionHeader>
              <Mail size={16} style={{ color: theme.colors.primaryPurple }} />
              <SectionTitle>Información de Cuenta</SectionTitle>
            </SectionHeader>
            
            <FormGrid>
              <FormField>
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="ejemplo@correo.com"
                  error={errors.email}
                />
                <FieldHint>
                  <Mail size={12} />
                  Este será el email de acceso al sistema
                </FieldHint>
              </FormField>

              <FormField>
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  placeholder="Mínimo 8 caracteres"
                  error={errors.password}
                  rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  rightIconClickable={true}
                  rightIconAriaLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                />
                {formData.password && (
                  <PasswordStrength>
                    <StrengthBar>
                      <StrengthFill strength={passwordStrength} />
                    </StrengthBar>
                    <StrengthText strength={passwordStrength}>
                      Contraseña {getPasswordStrengthText(passwordStrength)}
                    </StrengthText>
                  </PasswordStrength>
                )}
                <FieldHint>
                  <Lock size={12} />
                  Debe contener mayúsculas, minúsculas, números y símbolos
                </FieldHint>
              </FormField>
            </FormGrid>
          </Section>

          {/* Personal Information Section */}
          <Section>
            <SectionHeader>
              <UserIcon size={16} style={{ color: theme.colors.primaryPurple }} />
              <SectionTitle>Información Personal</SectionTitle>
            </SectionHeader>
            
            <FormGrid>
              <Input
                label="Nombre"
                value={formData.profile?.firstName || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, firstName: e.target.value }
                }))}
                required
                placeholder="Nombre del usuario"
                error={errors.firstName}
              />
              
              <Input
                label="Apellido"
                value={formData.profile?.lastName || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, lastName: e.target.value }
                }))}
                required
                placeholder="Apellido del usuario"
                error={errors.lastName}
              />

              <FormField>
                <Input
                  label="Teléfono"
                  value={formData.profile?.phone || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                    ...prev,
                    profile: { ...prev.profile!, phone: e.target.value }
                  }))}
                  placeholder="+34 600 000 000"
                />
                <FieldHint>
                  <Phone size={12} />
                  Formato internacional recomendado
                </FieldHint>
              </FormField>

              <Input
                label="Fecha de Nacimiento"
                type="date"
                value={formData.profile?.birthDate ? new Date(formData.profile.birthDate).toISOString().split('T')[0] : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, birthDate: e.target.value ? e.target.value : undefined }
                }))}
              />
            </FormGrid>
          </Section>

          {/* Settings Section */}
          <Section>
            <SectionHeader>
              <Shield size={16} style={{ color: theme.colors.primaryPurple }} />
              <SectionTitle>Configuración</SectionTitle>
            </SectionHeader>

            <RoleSelector>
              <RoleLabel>Rol del Usuario</RoleLabel>
              <RoleHint>Haz clic en una opción para seleccionarla</RoleHint>
              <RoleOptions>
                <RoleOption 
                  selected={formData.role === UserRole.customer}
                  onClick={() => setFormData(prev => ({ ...prev, role: UserRole.customer }))}
                >
                  <RoleIconContainer selected={formData.role === UserRole.customer}>
                    <Users size={16} />
                  </RoleIconContainer>
                  <RoleInfo>
                    <RoleName>Cliente</RoleName>
                    <RoleDescription>Acceso a funciones básicas de cliente</RoleDescription>
                  </RoleInfo>
                </RoleOption>

                <RoleOption 
                  selected={formData.role === UserRole.staff}
                  onClick={() => setFormData(prev => ({ ...prev, role: UserRole.staff }))}
                >
                  <RoleIconContainer selected={formData.role === UserRole.staff}>
                    <UserPlus size={16} />
                  </RoleIconContainer>
                  <RoleInfo>
                    <RoleName>Staff</RoleName>
                    <RoleDescription>Acceso a gestión de contenido y soporte</RoleDescription>
                  </RoleInfo>
                </RoleOption>

                <RoleOption 
                  selected={formData.role === UserRole.admin}
                  onClick={() => setFormData(prev => ({ ...prev, role: UserRole.admin }))}
                >
                  <RoleIconContainer selected={formData.role === UserRole.admin}>
                    <Shield size={16} />
                  </RoleIconContainer>
                  <RoleInfo>
                    <RoleName>Administrador</RoleName>
                    <RoleDescription>Acceso completo al sistema</RoleDescription>
                  </RoleInfo>
                </RoleOption>
              </RoleOptions>
            </RoleSelector>

            <ActiveUserCheckbox>
              <Checkbox
                type="checkbox"
                id="isActiveCreate"
                checked={formData.isActive || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ 
                  ...prev, 
                  isActive: e.target.checked 
                }))}
              />
              <CheckboxLabel htmlFor="isActiveCreate">
                <CheckCircle size={14} />
                Usuario activo (puede acceder al sistema)
              </CheckboxLabel>
            </ActiveUserCheckbox>
          </Section>
        </ModalContent>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            size="large"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!isFormValid()}
            size="large"
            icon={<UserPlus size={14} />}
          >
            {isLoading ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};