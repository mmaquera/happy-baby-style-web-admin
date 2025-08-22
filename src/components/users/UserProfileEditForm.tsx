import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { theme } from '@/styles/theme';
import { 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Shield
} from 'lucide-react';

interface UserProfileEditFormProps {
  profile: UserProfile;
  onSave: (input: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  role: string;
}

type FormErrors = FormData;

// Styled Components
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing[1]};
`;

const Required = styled.span`
  color: ${theme.colors.error};
  margin-left: ${theme.spacing[1]};
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  margin-top: ${theme.spacing[1]};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: flex-end;
  margin-top: ${theme.spacing[6]};
`;

const Select = styled.select`
  padding: ${theme.spacing[3]};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.base};
  font-size: ${theme.fontSizes.base};
  background: ${theme.colors.white};
  color: ${theme.colors.text.primary};
  transition: border-color ${theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

export const UserProfileEditForm: React.FC<UserProfileEditFormProps> = ({
  profile,
  onSave,
  onCancel,
  loading = false
}) => {
  // Helper function to get error message or empty string
  const getErrorMessage = (fieldName: keyof FormErrors): string => {
    return errors[fieldName] || '';
  };

  // Helper function to format dateOfBirth
  const formatDateOfBirth = (date: string | null | undefined): string => {
    if (!date) return '';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '';
      return dateObj.toISOString().split('T')[0] || '';
    } catch {
      return '';
    }
  };
  const [formData, setFormData] = useState<FormData>({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    phone: profile.phone || '',
    dateOfBirth: formatDateOfBirth(profile.dateOfBirth),
    role: profile.role || 'customer'
  });

  const [errors, setErrors] = useState<Partial<FormErrors>>({});
  const [touched, setTouched] = useState<Partial<FormData>>({});

  // Reset form when profile changes
  useEffect(() => {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phone: profile.phone || '',
      dateOfBirth: formatDateOfBirth(profile.dateOfBirth),
      role: profile.role || 'customer'
    });
    setErrors({});
    setTouched({});
  }, [profile]);

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
      
      case 'lastName':
        if (!value.trim()) return 'El apellido es requerido';
        if (value.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres';
        return '';
      
      case 'phone':
        if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
          return 'El teléfono debe tener un formato válido';
        }
        return '';
      
      case 'dateOfBirth':
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 13 || age > 120) return 'La fecha de nacimiento debe ser válida';
        }
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field on change if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof FormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const input = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim() || undefined,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
        role: formData.role as any
      };

      await onSave(input);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'staff': return 'Personal';
      case 'customer': return 'Cliente';
      default: return role;
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow>
        <FormGroup>
          <Label>Nombre <Required>*</Required></Label>
          <Input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            placeholder="Nombre"
            error={getErrorMessage('firstName')}
          />
          {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Apellido <Required>*</Required></Label>
          <Input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            placeholder="Apellido"
            error={getErrorMessage('lastName')}
          />
          {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Teléfono</Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            placeholder="+1 234 567 890"
            error={getErrorMessage('phone')}
          />
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Fecha de Nacimiento</Label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            onBlur={() => handleBlur('dateOfBirth')}
            error={getErrorMessage('dateOfBirth')}
          />
          {errors.dateOfBirth && <ErrorMessage>{errors.dateOfBirth}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormGroup>
        <Label>Rol</Label>
        <Select
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
        >
          <option value="customer">Cliente</option>
          <option value="staff">Staff</option>
          <option value="admin">Administrador</option>
        </Select>
      </FormGroup>

      <ButtonGroup>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          isLoading={loading}
        >
          Guardar
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default UserProfileEditForm;
