import type React from 'react';
import { useState, useEffect } from 'react';
import { type UserRole } from '@/generated/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { logger } from '@/utils/logger';

interface ProfileLike {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  role?: UserRole | string | null;
}

interface ProfileSaveInput {
  firstName: string;
  lastName: string;
  phone?: string | undefined;
  dateOfBirth?: string | undefined;
  role?: UserRole | undefined;
}

interface UserProfileEditFormProps {
  profile: ProfileLike;
  onSave: (input: ProfileSaveInput) => Promise<void>;
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

type FormErrors = Partial<FormData>;

const formatDateOfBirth = (date: string | null | undefined): string => {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0] ?? '';
  } catch {
    return '';
  }
};

export const UserProfileEditForm: React.FC<UserProfileEditFormProps> = ({
  profile,
  onSave,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    phone: profile.phone ?? '',
    dateOfBirth: formatDateOfBirth(profile.dateOfBirth),
    role: profile.role ?? 'customer',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<FormData>>({});

  useEffect(() => {
    setFormData({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      phone: profile.phone ?? '',
      dateOfBirth: formatDateOfBirth(profile.dateOfBirth),
      role: profile.role ?? 'customer',
    });
    setErrors({});
    setTouched({});
  }, [profile]);

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 2)
          return 'El nombre debe tener al menos 2 caracteres';
        return '';
      case 'lastName':
        if (!value.trim()) return 'El apellido es requerido';
        if (value.trim().length < 2)
          return 'El apellido debe tener al menos 2 caracteres';
        return '';
      case 'phone':
        if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, '')))
          return 'El teléfono debe tener un formato válido';
        return '';
      case 'dateOfBirth':
        if (value) {
          const age = new Date().getFullYear() - new Date(value).getFullYear();
          if (age < 13 || age > 120)
            return 'La fecha de nacimiento debe ser válida';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formData[name]),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const input: ProfileSaveInput = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        ...(formData.phone.trim() ? { phone: formData.phone.trim() } : {}),
        ...(formData.dateOfBirth
          ? { dateOfBirth: new Date(formData.dateOfBirth).toISOString() }
          : {}),
        ...(formData.role ? { role: formData.role as UserRole } : {}),
      };
      await onSave(input);
    } catch (error) {
      logger.error('Error saving profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <div className='grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]'>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-muted-foreground'>
            Nombre <span className='ml-1 text-destructive'>*</span>
          </label>
          <Input
            type='text'
            value={formData.firstName}
            onChange={e => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            placeholder='Nombre'
            error={errors.firstName}
          />
          {errors.firstName ? (
            <div className='mt-1 text-sm text-destructive'>
              {errors.firstName}
            </div>
          ) : null}
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-muted-foreground'>
            Apellido <span className='ml-1 text-destructive'>*</span>
          </label>
          <Input
            type='text'
            value={formData.lastName}
            onChange={e => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            placeholder='Apellido'
            error={errors.lastName}
          />
          {errors.lastName ? (
            <div className='mt-1 text-sm text-destructive'>
              {errors.lastName}
            </div>
          ) : null}
        </div>
      </div>

      <div className='grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]'>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-muted-foreground'>
            Teléfono
          </label>
          <Input
            type='tel'
            value={formData.phone}
            onChange={e => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            placeholder='+1 234 567 890'
            error={errors.phone}
          />
          {errors.phone ? (
            <div className='mt-1 text-sm text-destructive'>{errors.phone}</div>
          ) : null}
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-muted-foreground'>
            Fecha de Nacimiento
          </label>
          <Input
            type='date'
            value={formData.dateOfBirth}
            onChange={e => handleChange('dateOfBirth', e.target.value)}
            onBlur={() => handleBlur('dateOfBirth')}
            error={errors.dateOfBirth}
          />
          {errors.dateOfBirth ? (
            <div className='mt-1 text-sm text-destructive'>
              {errors.dateOfBirth}
            </div>
          ) : null}
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium text-muted-foreground'>Rol</label>
        <select
          value={formData.role}
          onChange={e => handleChange('role', e.target.value)}
          className='cursor-pointer rounded-md border border-border bg-white px-3 py-2 text-base text-foreground outline-none transition-colors focus:border-brand-purple focus:shadow-[0_0_0_3px_rgba(107,70,193,0.2)]'
        >
          <option value='customer'>Cliente</option>
          <option value='staff'>Staff</option>
          <option value='admin'>Administrador</option>
        </select>
      </div>

      <div className='mt-6 flex justify-end gap-3'>
        <Button
          type='button'
          variant='ghost'
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type='submit'
          variant='primary'
          disabled={loading}
          isLoading={loading}
        >
          Guardar
        </Button>
      </div>
    </form>
  );
};

export default UserProfileEditForm;
