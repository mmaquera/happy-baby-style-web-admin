import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UserAddress } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { theme } from '@/styles/theme';


interface UserAddressEditFormProps {
  address?: UserAddress;
  userId: string;
  onSave: (input: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  isEditing?: boolean;
}

interface FormData {
  type: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

type FormErrors = Omit<FormData, 'isDefault'>;

// Styled Components
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
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

const FullWidthFormGroup = styled(FormGroup)`
  grid-column: 1 / -1;
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[4]};
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${theme.colors.primary};
`;

const CheckboxLabel = styled.label`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  cursor: pointer;
`;

export const UserAddressEditForm: React.FC<UserAddressEditFormProps> = ({
  address,
  userId,
  onSave,
  onCancel,
  loading = false,
  isEditing = false
}) => {
  // Helper function to get error message or empty string
  const getErrorMessage = (fieldName: keyof FormErrors): string => {
    return errors[fieldName] || '';
  };
  const [formData, setFormData] = useState<FormData>({
    type: address?.type || 'home',
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    company: address?.company || '',
    address1: address?.address1 || '',
    address2: address?.address2 || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'España',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false
  });

  const [errors, setErrors] = useState<Partial<FormErrors>>({});
  const [touched, setTouched] = useState<Partial<FormData>>({});

  // Reset form when address changes
  useEffect(() => {
    setFormData({
      type: address?.type || 'home',
      firstName: address?.firstName || '',
      lastName: address?.lastName || '',
      company: address?.company || '',
      address1: address?.address1 || '',
      address2: address?.address2 || '',
      city: address?.city || '',
      state: address?.state || '',
      postalCode: address?.postalCode || '',
      country: address?.country || 'España',
      phone: address?.phone || '',
      isDefault: address?.isDefault || false
    });
    setErrors({});
    setTouched({});
  }, [address]);

  const validateField = (name: keyof FormData, value: string | boolean): string => {
    switch (name) {
      case 'firstName':
        if (!value || typeof value !== 'string' || !value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
      
      case 'lastName':
        if (!value || typeof value !== 'string' || !value.trim()) return 'El apellido es requerido';
        if (value.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres';
        return '';
      
      case 'address1':
        if (!value || typeof value !== 'string' || !value.trim()) return 'La dirección es requerida';
        if (value.trim().length < 5) return 'La dirección debe tener al menos 5 caracteres';
        return '';
      
      case 'city':
        if (!value || typeof value !== 'string' || !value.trim()) return 'La ciudad es requerida';
        return '';
      
      case 'state':
        if (!value || typeof value !== 'string' || !value.trim()) return 'La provincia es requerida';
        return '';
      
      case 'postalCode':
        if (!value || typeof value !== 'string' || !value.trim()) return 'El código postal es requerido';
        if (!/^\d{5}$/.test(value.trim())) return 'El código postal debe tener 5 dígitos';
        return '';
      
      case 'country':
        if (!value || typeof value !== 'string' || !value.trim()) return 'El país es requerido';
        return '';
      
      case 'phone':
        if (value && typeof value === 'string' && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
          return 'El teléfono debe tener un formato válido';
        }
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (name: keyof FormData, value: string | boolean) => {
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
    const newErrors: Partial<FormErrors> = {};
    
    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof FormData;
      if (fieldName !== 'isDefault') {
        const error = validateField(fieldName, formData[fieldName]);
        if (error) {
          newErrors[fieldName] = error;
        }
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
        userId,
        type: formData.type,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        company: formData.company.trim() || undefined,
        address1: formData.address1.trim(),
        address2: formData.address2.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
        phone: formData.phone.trim() || undefined,
        isDefault: formData.isDefault
      };

      await onSave(input);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'home': return 'Casa';
      case 'work': return 'Trabajo';
      case 'billing': return 'Facturación';
      case 'shipping': return 'Envío';
      default: return type;
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow>
        <FormGroup>
          <Label>Tipo de Dirección</Label>
          <Select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="home">Casa</option>
            <option value="work">Trabajo</option>
            <option value="billing">Facturación</option>
            <option value="shipping">Envío</option>
          </Select>
        </FormGroup>

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
      </FormRow>

      <FormRow>
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

        <FormGroup>
          <Label>Empresa</Label>
          <Input
            type="text"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="Empresa (opcional)"
          />
        </FormGroup>
      </FormRow>

      <FullWidthFormGroup>
        <Label>Dirección <Required>*</Required></Label>
        <Input
          type="text"
          value={formData.address1}
          onChange={(e) => handleChange('address1', e.target.value)}
          onBlur={() => handleBlur('address1')}
          placeholder="Dirección principal"
                      error={getErrorMessage('address1')}
        />
        {errors.address1 && <ErrorMessage>{errors.address1}</ErrorMessage>}
      </FullWidthFormGroup>

      <FullWidthFormGroup>
        <Label>Dirección Adicional</Label>
        <Input
          type="text"
          value={formData.address2}
          onChange={(e) => handleChange('address2', e.target.value)}
          placeholder="Apartamento, suite, etc. (opcional)"
        />
      </FullWidthFormGroup>

      <FormRow>
        <FormGroup>
                  <Label>Ciudad <Required>*</Required></Label>
          <Input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            onBlur={() => handleBlur('city')}
            placeholder="Ciudad"
            error={getErrorMessage('city')}
          />
          {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
                  <Label>Provincia <Required>*</Required></Label>
          <Input
            type="text"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            onBlur={() => handleBlur('state')}
            placeholder="Provincia"
            error={getErrorMessage('state')}
          />
          {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
                  <Label>Código Postal <Required>*</Required></Label>
          <Input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            onBlur={() => handleBlur('postalCode')}
            placeholder="12345"
            error={getErrorMessage('postalCode')}
          />
          {errors.postalCode && <ErrorMessage>{errors.postalCode}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
                  <Label>País <Required>*</Required></Label>
          <Input
            type="text"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            onBlur={() => handleBlur('country')}
            placeholder="País"
            error={getErrorMessage('country')}
          />
          {errors.country && <ErrorMessage>{errors.country}</ErrorMessage>}
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
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => handleChange('isDefault', e.target.checked)}
            />
            <CheckboxLabel htmlFor="isDefault">
              Establecer como dirección predeterminada
            </CheckboxLabel>
          </CheckboxContainer>
        </FormGroup>
      </FormRow>

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
          {isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default UserAddressEditForm;
