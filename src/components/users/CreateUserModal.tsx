import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CreateUserProfileInput, UserRole } from '@/generated/graphql';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
  onSubmit: (userData: CreateUserProfileInput) => void;
  isLoading: boolean;
}

// Styled Components
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
  max-width: 600px;
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

const FormSteps = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  background: ${theme.colors.background.light};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

const FormStep = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  opacity: ${props => props.active || props.completed ? 1 : 0.5};
`;

const StepNumber = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => 
    props.completed ? theme.colors.success :
    props.active ? theme.colors.primary : 
    theme.colors.background.primary};
  color: ${props => 
    props.completed || props.active ? 'white' : theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  border: 2px solid ${props => 
    props.completed ? theme.colors.success :
    props.active ? theme.colors.primary : 
    theme.colors.border.medium};
`;

const StepLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
`;

const StepConnector = styled.div`
  width: 40px;
  height: 2px;
  background: ${theme.colors.border.medium};
  margin: 0 ${theme.spacing[3]};
`;

const FormContent = styled.div`
  padding: ${theme.spacing[6]};
`;

const FormSection = styled.div`
  margin-bottom: ${theme.spacing[6]};

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

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const InputHint = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
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

const PasswordStrengthContainer = styled.div`
  margin-top: ${theme.spacing[2]};
`;

const PasswordStrengthBar = styled.div`
  height: 4px;
  background: ${theme.colors.border.light};
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: ${theme.spacing[1]};
`;

const PasswordStrengthFill = styled.div<{ strength: number }>`
  height: 100%;
  width: ${props => props.strength}%;
  background: ${props => 
    props.strength < 30 ? theme.colors.error :
    props.strength < 70 ? theme.colors.warning :
    theme.colors.success};
  transition: all 0.3s ease;
`;

const PasswordStrengthText = styled.span<{ strength: number }>`
  font-size: ${theme.fontSizes.xs};
  color: ${props => 
    props.strength < 30 ? theme.colors.error :
    props.strength < 70 ? theme.colors.warning :
    theme.colors.success};
  font-weight: ${theme.fontWeights.medium};
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

const FormActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: flex-end;
  padding: ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.background.light};
  margin: ${theme.spacing[6]} -${theme.spacing[6]} -${theme.spacing[6]};
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  margin-top: ${theme.spacing[1]};
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

const getPasswordErrors = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Mínimo 8 caracteres');
  if (!/[a-z]/.test(password)) errors.push('Al menos una minúscula');
  if (!/[A-Z]/.test(password)) errors.push('Al menos una mayúscula');
  if (!/[0-9]/.test(password)) errors.push('Al menos un número');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Al menos un símbolo');
  return errors;
};

// Component
const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const strength = calculatePasswordStrength(password);
  const strengthText = getPasswordStrengthText(strength);

  if (!password) return null;

  return (
    <PasswordStrengthContainer>
      <PasswordStrengthBar>
        <PasswordStrengthFill strength={strength} />
      </PasswordStrengthBar>
      <PasswordStrengthText strength={strength}>
        Contraseña {strengthText}
      </PasswordStrengthText>
    </PasswordStrengthContainer>
  );
};

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
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

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Limpiar formulario cuando se abra el modal
  useEffect(() => {
    if (isOpen) {
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
      setErrors({});
      setShowPassword(false);
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors['email'] = 'Email es requerido';
    } else if (!isValidEmail(formData.email)) {
      newErrors['email'] = 'Email no válido';
    }

    if (!formData.password) {
      newErrors['password'] = 'Contraseña es requerida';
    } else if (calculatePasswordStrength(formData.password || '') < 50) {
      newErrors['password'] = 'Contraseña muy débil';
    }

    if (!formData.firstName) {
      newErrors['firstName'] = 'Nombre es requerido';
    }

    if (!formData.lastName) {
      newErrors['lastName'] = 'Apellido es requerido';
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
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: null
    });
    setErrors({});
    onClose();
  };

  const isFormValid = (): boolean => {
    return !!(
      formData.email &&
      formData.password &&
      formData.firstName &&
      formData.lastName &&
      isValidEmail(formData.email) &&
      calculatePasswordStrength(formData.password || '') >= 50
    );
  };

  if (!isOpen) return null;

  return (
    <Modal onClick={handleClose}>
      <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <ModalHeader>
          <ModalHeaderLeft>
            <UserPlus size={24} style={{ color: theme.colors.primary }} />
            <div>
              <ModalTitle>Crear Nuevo Usuario</ModalTitle>
              <ModalSubtitle>Completa la información para crear una nueva cuenta de usuario</ModalSubtitle>
            </div>
          </ModalHeaderLeft>
          <Button
            variant="ghost"
            size="small"
            onClick={handleClose}
            style={{ padding: theme.spacing[2] }}
          >
            <X size={18} />
          </Button>
        </ModalHeader>

        <FormSteps>
          <FormStep active={true} completed={isFormValid()}>
            <StepNumber active={true}>1</StepNumber>
            <StepLabel>Datos Básicos</StepLabel>
          </FormStep>
          <StepConnector />
          <FormStep active={isFormValid()} completed={false}>
            <StepNumber active={isFormValid()}>2</StepNumber>
            <StepLabel>Configuración</StepLabel>
          </FormStep>
        </FormSteps>

        <FormContent>
          {/* Account Information Section */}
          <FormSection>
            <SectionHeader>
              <Mail size={18} style={{ color: theme.colors.primary }} />
              <SectionTitle>Información de Cuenta</SectionTitle>
            </SectionHeader>
            
            <FormGrid>
              <InputWrapper>
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="ejemplo@correo.com"
                  error={errors['email'] || ''}
                />
                <InputHint>
                  <Mail size={12} />
                  Este será el email de acceso al sistema
                </InputHint>
              </InputWrapper>

              <InputWrapper>
                <PasswordInputWrapper>
                  <Input
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    placeholder="Mínimo 8 caracteres"
                    error={errors['password'] || ''}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </PasswordToggle>
                </PasswordInputWrapper>
                <PasswordStrength password={formData.password || ''} />
                <InputHint>
                  <Lock size={12} />
                  Debe contener mayúsculas, minúsculas, números y símbolos
                </InputHint>
              </InputWrapper>
            </FormGrid>
          </FormSection>

          {/* Personal Information Section */}
          <FormSection>
            <SectionHeader>
              <Users size={18} style={{ color: theme.colors.primary }} />
              <SectionTitle>Información Personal</SectionTitle>
            </SectionHeader>
            
            <FormGrid>
              <Input
                label="Nombre"
                value={formData.firstName || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                  ...prev,
                  firstName: e.target.value
                }))}
                required
                placeholder="Nombre del usuario"
                error={errors['firstName'] || ''}
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
                error={errors['lastName'] || ''}
              />

              <InputWrapper>
                <Input
                  label="Teléfono"
                  value={formData.phone || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))}
                  placeholder="+34 600 000 000"
                />
                <InputHint>
                  <Phone size={12} />
                  Formato internacional recomendado
                </InputHint>
              </InputWrapper>

              <Input
                label="Fecha de Nacimiento"
                type="date"
                value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                  ...prev,
                  dateOfBirth: e.target.value || null
                }))}
                placeholder="dd/mm/yyyy"
              />
            </FormGrid>
          </FormSection>

          {/* Settings Section */}
          <FormSection>
            <SectionHeader>
              <Shield size={18} style={{ color: theme.colors.primary }} />
              <SectionTitle>Configuración</SectionTitle>
            </SectionHeader>

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
                  <RoleIcon selected={formData.role === UserRole.staff}><UserPlus size={20} /></RoleIcon>
                  <RoleInfo>
                    <RoleName>Staff</RoleName>
                    <RoleDescription>Acceso a gestión de contenido y soporte</RoleDescription>
                  </RoleInfo>
                </RoleOption>

                <RoleOption 
                  selected={formData.role === UserRole.admin}
                  onClick={() => setFormData(prev => ({ ...prev, role: UserRole.admin }))}
                >
                  <RoleIcon selected={formData.role === UserRole.admin}><Shield size={20} /></RoleIcon>
                  <RoleInfo>
                    <RoleName>Administrador</RoleName>
                    <RoleDescription>Acceso completo al sistema</RoleDescription>
                  </RoleInfo>
                </RoleOption>
              </RoleGrid>
            </RoleSelector>

            <CheckboxContainer>
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
                <CheckCircle size={16} />
                Usuario activo (puede acceder al sistema)
              </CheckboxLabel>
            </CheckboxContainer>
          </FormSection>
        </FormContent>

        <FormActions>
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
            icon={<UserPlus size={16} />}
          >
            {isLoading ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </FormActions>
      </ModalContent>
    </Modal>
  );
};