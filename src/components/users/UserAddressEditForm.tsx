import type React from 'react';
import { useState, useEffect } from 'react';
import { type UserAddress } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { logger } from '@/utils/logger';

interface AddressSaveInput {
  userId: string;
  type: string;
  firstName: string;
  lastName: string;
  company?: string | undefined;
  address1: string;
  address2?: string | undefined;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | undefined;
  isDefault: boolean;
}

interface UserAddressEditFormProps {
  address?: UserAddress;
  userId: string;
  onSave: (input: AddressSaveInput) => Promise<void>;
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

type FormErrors = Partial<Omit<FormData, 'isDefault'>>;

const selectClass =
  'cursor-pointer rounded-md border border-border bg-white px-3 py-2 text-base text-foreground outline-none transition-colors focus:border-brand-purple focus:shadow-[0_0_0_3px_rgba(107,70,193,0.2)]';

export const UserAddressEditForm: React.FC<UserAddressEditFormProps> = ({
  address,
  userId,
  onSave,
  onCancel,
  loading = false,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    type: address?.type ?? 'home',
    firstName: address?.firstName ?? '',
    lastName: address?.lastName ?? '',
    company: address?.company ?? '',
    address1: address?.address1 ?? '',
    address2: address?.address2 ?? '',
    city: address?.city ?? '',
    state: address?.state ?? '',
    postalCode: address?.postalCode ?? '',
    country: address?.country ?? 'España',
    phone: address?.phone ?? '',
    isDefault: address?.isDefault ?? false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<FormData>>({});

  useEffect(() => {
    setFormData({
      type: address?.type ?? 'home',
      firstName: address?.firstName ?? '',
      lastName: address?.lastName ?? '',
      company: address?.company ?? '',
      address1: address?.address1 ?? '',
      address2: address?.address2 ?? '',
      city: address?.city ?? '',
      state: address?.state ?? '',
      postalCode: address?.postalCode ?? '',
      country: address?.country ?? 'España',
      phone: address?.phone ?? '',
      isDefault: address?.isDefault ?? false,
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
        if (value && typeof value === 'string' && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, '')))
          return 'El teléfono debe tener un formato válido';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (name: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name]) }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach(key => {
      if (key !== 'isDefault') {
        const err = validateField(key, formData[key]);
        if (err) newErrors[key as keyof FormErrors] = err;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await onSave({
        userId,
        type: formData.type,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        ...(formData.company.trim() ? { company: formData.company.trim() } : {}),
        address1: formData.address1.trim(),
        ...(formData.address2.trim() ? { address2: formData.address2.trim() } : {}),
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
        ...(formData.phone.trim() ? { phone: formData.phone.trim() } : {}),
        isDefault: formData.isDefault,
      });
    } catch (error) {
      logger.error('Error saving address:', error);
    }
  };

  const Field = ({
    label,
    required,
    error,
    children,
    fullWidth,
  }: {
    label: string;
    required?: boolean;
    error?: string | undefined;
    children: React.ReactNode;
    fullWidth?: boolean;
  }) => (
    <div className={`flex flex-col gap-2${fullWidth ? ' col-span-full' : ''}`}>
      <label className='text-sm font-medium text-muted-foreground'>
        {label}
        {required ? <span className='ml-1 text-destructive'>*</span> : null}
      </label>
      {children}
      {error ? <div className='mt-1 text-sm text-destructive'>{error}</div> : null}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div className='grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]'>
        <Field label='Tipo de Dirección'>
          <select
            value={formData.type}
            onChange={e => handleChange('type', e.target.value)}
            className={selectClass}
          >
            <option value='home'>Casa</option>
            <option value='work'>Trabajo</option>
            <option value='billing'>Facturación</option>
            <option value='shipping'>Envío</option>
          </select>
        </Field>

        <Field label='Nombre' required error={errors.firstName}>
          <Input
            type='text'
            value={formData.firstName}
            onChange={e => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            placeholder='Nombre'
            error={errors.firstName}
          />
        </Field>
      </div>

      <div className='grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]'>
        <Field label='Apellido' required error={errors.lastName}>
          <Input
            type='text'
            value={formData.lastName}
            onChange={e => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            placeholder='Apellido'
            error={errors.lastName}
          />
        </Field>
        <Field label='Empresa'>
          <Input
            type='text'
            value={formData.company}
            onChange={e => handleChange('company', e.target.value)}
            placeholder='Empresa (opcional)'
          />
        </Field>
      </div>

      <div className='grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]'>
        <Field label='Dirección' required error={errors.address1} fullWidth>
          <Input
            type='text'
            value={formData.address1}
            onChange={e => handleChange('address1', e.target.value)}
            onBlur={() => handleBlur('address1')}
            placeholder='Dirección principal'
            error={errors.address1}
          />
        </Field>
        <Field label='Dirección Adicional' fullWidth>
          <Input
            type='text'
            value={formData.address2}
            onChange={e => handleChange('address2', e.target.value)}
            placeholder='Apartamento, suite, etc. (opcional)'
          />
        </Field>
      </div>

      <div className='grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]'>
        <Field label='Ciudad' required error={errors.city}>
          <Input
            type='text'
            value={formData.city}
            onChange={e => handleChange('city', e.target.value)}
            onBlur={() => handleBlur('city')}
            placeholder='Ciudad'
            error={errors.city}
          />
        </Field>
        <Field label='Provincia' required error={errors.state}>
          <Input
            type='text'
            value={formData.state}
            onChange={e => handleChange('state', e.target.value)}
            onBlur={() => handleBlur('state')}
            placeholder='Provincia'
            error={errors.state}
          />
        </Field>
      </div>

      <div className='grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]'>
        <Field label='Código Postal' required error={errors.postalCode}>
          <Input
            type='text'
            value={formData.postalCode}
            onChange={e => handleChange('postalCode', e.target.value)}
            onBlur={() => handleBlur('postalCode')}
            placeholder='12345'
            error={errors.postalCode}
          />
        </Field>
        <Field label='País' required error={errors.country}>
          <Input
            type='text'
            value={formData.country}
            onChange={e => handleChange('country', e.target.value)}
            onBlur={() => handleBlur('country')}
            placeholder='País'
            error={errors.country}
          />
        </Field>
      </div>

      <div className='grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]'>
        <Field label='Teléfono' error={errors.phone}>
          <Input
            type='tel'
            value={formData.phone}
            onChange={e => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            placeholder='+1 234 567 890'
            error={errors.phone}
          />
        </Field>
        <div className='mt-4 flex items-center gap-2'>
          <input
            type='checkbox'
            id='isDefault'
            checked={formData.isDefault}
            onChange={e => handleChange('isDefault', e.target.checked)}
            className='h-4 w-4 cursor-pointer accent-brand-purple'
          />
          <label
            htmlFor='isDefault'
            className='cursor-pointer text-sm text-foreground'
          >
            Establecer como dirección predeterminada
          </label>
        </div>
      </div>

      <div className='mt-6 flex justify-end gap-3'>
        <Button type='button' variant='ghost' onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type='submit' variant='primary' disabled={loading} isLoading={loading}>
          {isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default UserAddressEditForm;
