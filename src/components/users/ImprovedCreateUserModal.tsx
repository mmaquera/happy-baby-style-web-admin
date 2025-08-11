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
  onSubmit: (userData: CreateUserProfileInput) => Promise<any>;
  isLoading: boolean;
  serverError?: string | undefined;
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

const ServerErrorBanner = styled.div`
  background: ${theme.colors.error}15;
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[4]};
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
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
  isLoading,
  serverError
}) => {
  const [formData, setFormData] = useState<CreateUserProfileInput>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: null,
    role: UserRole.customer,
    isActive: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  // Limpiar formulario cuando se abra el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        dateOfBirth: null,
        role: UserRole.customer,
        isActive: true
      });
      setErrors({});
      setServerErrors({});
      setShowPassword(false);
    }
  }, [isOpen]);

  // Procesar errores del servidor cuando cambien
  useEffect(() => {
    if (serverError) {
      processServerError(serverError);
    } else {
      setServerErrors({});
    }
  }, [serverError]);

  // Función para validar y formatear fecha
  const formatDateForAPI = (dateString: string): string | null => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      
      // Asegurar formato ISO para el backend
      return date.toISOString();
    } catch {
      return null;
    }
  };

  // Función para procesar errores del servidor y mapearlos a campos específicos
  const processServerError = (errorMessage: string): void => {
    const newServerErrors: Record<string, string> = {};
    
    // Mapear errores específicos del servidor a campos del formulario
    if (errorMessage.toLowerCase().includes('birth date') || errorMessage.toLowerCase().includes('fecha de nacimiento')) {
      newServerErrors['dateOfBirth'] = 'Fecha de nacimiento inválida';
    } else if (errorMessage.toLowerCase().includes('email')) {
      newServerErrors['email'] = 'Email inválido o ya existe';
    } else if (errorMessage.toLowerCase().includes('password')) {
      newServerErrors['password'] = 'Contraseña inválida';
    } else if (errorMessage.toLowerCase().includes('first name') || errorMessage.toLowerCase().includes('nombre')) {
      newServerErrors['firstName'] = 'Nombre inválido';
    } else if (errorMessage.toLowerCase().includes('last name') || errorMessage.toLowerCase().includes('apellido')) {
      newServerErrors['lastName'] = 'Apellido inválido';
    } else if (errorMessage.toLowerCase().includes('phone') || errorMessage.toLowerCase().includes('teléfono')) {
      newServerErrors['phone'] = 'Teléfono inválido';
    }
    
    setServerErrors(newServerErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors['email'] = 'Email es requerido';
    } else if (!isValidEmail(formData.email)) {
      newErrors['email'] = 'Email no válido';
    }

    if (!formData.password) {
      newErrors['password'] = 'Contraseña es requerida';
    } else if (calculatePasswordStrength(formData.password) < 50) {
      newErrors['password'] = 'Contraseña muy débil';
    }

    if (!formData.firstName) {
      newErrors['firstName'] = 'Nombre es requerido';
    }

    if (!formData.lastName) {
      newErrors['lastName'] = 'Apellido es requerido';
    }

    // Validar fecha de nacimiento
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      
      if (isNaN(birthDate.getTime())) {
        newErrors['dateOfBirth'] = 'Fecha de nacimiento no válida';
      } else if (birthDate > today) {
        newErrors['dateOfBirth'] = 'La fecha de nacimiento no puede ser futura';
      } else if (birthDate < new Date('1900-01-01')) {
        newErrors['dateOfBirth'] = 'Fecha de nacimiento demasiado antigua';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Limpiar errores del servidor antes de enviar
        setServerErrors({});
        
        // Formatear la fecha antes de enviar
        const formattedData = {
          ...formData,
          dateOfBirth: formData.dateOfBirth ? formatDateForAPI(formData.dateOfBirth as string) : null
        };
        
        await onSubmit(formattedData);
      } catch (error) {
        // Los errores se manejan en el hook, pero podemos mostrar errores específicos aquí si es necesario
        console.error('Error en el modal:', error);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: null,
      role: UserRole.customer,
      isActive: true
    });
    setErrors({});
    setServerErrors({});
    onClose();
  };

  const isFormValid = (): boolean => {
    const hasRequiredFields = !!(
      formData.email &&
      formData.password &&
      formData.firstName &&
      formData.lastName &&
      isValidEmail(formData.email) &&
      calculatePasswordStrength(formData.password) >= 50
    );
    
    // Solo validar que no haya errores de validación locales
    // Los errores del servidor no deberían impedir que el usuario pueda enviar el formulario
    const hasNoValidationErrors = Object.keys(errors).length === 0;
    
    return hasRequiredFields && hasNoValidationErrors;
  };

  const passwordStrength = calculatePasswordStrength(formData.password || '');

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
          {/* Server Error Banner */}
          {serverError && (
            <ServerErrorBanner>
              <Shield size={16} />
              {serverError}
            </ServerErrorBanner>
          )}
          
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }));
                    // Limpiar errores cuando el usuario empiece a corregir
                    if (errors['email'] || serverErrors['email']) {
                      setErrors(prev => ({ ...prev, email: '' }));
                      setServerErrors(prev => ({ ...prev, email: '' }));
                    }
                  }}
                  required
                  placeholder="ejemplo@correo.com"
                  error={errors['email'] || serverErrors['email'] || ''}
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
                  value={formData.password || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData(prev => ({ ...prev, password: e.target.value }));
                    // Limpiar errores cuando el usuario empiece a corregir
                    if (errors['password'] || serverErrors['password']) {
                      setErrors(prev => ({ ...prev, password: '' }));
                      setServerErrors(prev => ({ ...prev, password: '' }));
                    }
                  }}
                  required
                  placeholder="Mínimo 8 caracteres"
                  error={errors['password'] || serverErrors['password'] || ''}
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
                value={formData.firstName || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData(prev => ({
                    ...prev,
                    firstName: e.target.value
                  }));
                  // Limpiar errores cuando el usuario empiece a corregir
                  if (errors['firstName'] || serverErrors['firstName']) {
                    setErrors(prev => ({ ...prev, firstName: '' }));
                    setServerErrors(prev => ({ ...prev, firstName: '' }));
                  }
                }}
                required
                placeholder="Nombre del usuario"
                error={errors['firstName'] || serverErrors['firstName'] || ''}
              />
              
              <Input
                label="Apellido"
                value={formData.lastName || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData(prev => ({
                    ...prev,
                    lastName: e.target.value
                  }));
                  // Limpiar errores cuando el usuario empiece a corregir
                  if (errors['lastName'] || serverErrors['lastName']) {
                    setErrors(prev => ({ ...prev, lastName: '' }));
                    setServerErrors(prev => ({ ...prev, lastName: '' }));
                  }
                }}
                required
                placeholder="Apellido del usuario"
                error={errors['lastName'] || serverErrors['lastName'] || ''}
              />

              <FormField>
                <Input
                  label="Teléfono"
                  value={formData.phone || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData(prev => ({
                      ...prev,
                      phone: e.target.value
                    }));
                    // Limpiar errores cuando el usuario empiece a corregir
                    if (errors['phone'] || serverErrors['phone']) {
                      setErrors(prev => ({ ...prev, phone: '' }));
                      setServerErrors(prev => ({ ...prev, phone: '' }));
                    }
                  }}
                  placeholder="+34 600 000 000"
                  error={errors['phone'] || serverErrors['phone'] || ''}
                />
                <FieldHint>
                  <Phone size={12} />
                  Formato internacional recomendado
                </FieldHint>
              </FormField>

              <Input
                label="Fecha de Nacimiento"
                type="date"
                value={formData.dateOfBirth ? new Date(formData.dateOfBirth as string).toISOString().split('T')[0] : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const formattedDate = formatDateForAPI(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    dateOfBirth: formattedDate
                  }));
                  // Limpiar tanto errores de validación como errores del servidor
                  if (errors['dateOfBirth'] || serverErrors['dateOfBirth']) {
                    setErrors(prev => ({ ...prev, dateOfBirth: '' }));
                    setServerErrors(prev => ({ ...prev, dateOfBirth: '' }));
                  }
                }}
                error={errors['dateOfBirth'] || serverErrors['dateOfBirth'] || ''}
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