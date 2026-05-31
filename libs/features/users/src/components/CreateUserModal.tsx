import type React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import UserPlusIcon from 'lucide-react/dist/esm/icons/user-plus';
import XIcon from 'lucide-react/dist/esm/icons/x';
import MailIcon from 'lucide-react/dist/esm/icons/mail';
import ShieldIcon from 'lucide-react/dist/esm/icons/shield';
import UsersIcon from 'lucide-react/dist/esm/icons/users';
import PhoneIcon from 'lucide-react/dist/esm/icons/phone';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import EyeIcon from 'lucide-react/dist/esm/icons/eye';
import EyeOffIcon from 'lucide-react/dist/esm/icons/eye-off';
import LockIcon from 'lucide-react/dist/esm/icons/lock';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import { cn } from '@happy-baby/shared-utils';
import {
  type CreateUserProfileInput,
  UserRole,
} from '@happy-baby/infrastructure-graphql';
import { Button } from '@happy-baby/shared-ui';
import { Input } from '@happy-baby/shared-ui';
import {
  createUserFormSchema,
  type CreateUserFormValues,
} from '@happy-baby/domain-shared';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserProfileInput) => Promise<void>;
  isLoading: boolean;
  serverError?: string | undefined;
}

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

const strengthColor = (strength: number) =>
  strength < 30
    ? 'bg-destructive'
    : strength < 70
      ? 'bg-yellow-500'
      : 'bg-green-500';
const strengthTextColor = (strength: number) =>
  strength < 30
    ? 'text-destructive'
    : strength < 70
      ? 'text-yellow-600'
      : 'text-green-600';

const ROLES: {
  value: 'customer' | 'staff' | 'admin';
  name: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'customer',
    name: 'Cliente',
    description: 'Acceso a funciones básicas de cliente',
    icon: <UsersIcon size={16} />,
  },
  {
    value: 'staff',
    name: 'Staff',
    description: 'Acceso a gestión de contenido y soporte',
    icon: <UserPlusIcon size={16} />,
  },
  {
    value: 'admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    icon: <ShieldIcon size={16} />,
  },
];

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  serverError,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: null,
      role: 'customer',
      isActive: true,
    },
    mode: 'onSubmit',
  });

  const [showPasswordVisible, setShowPasswordVisible] = useState(false);

  const passwordValue = watch('password');
  const roleValue = watch('role');
  const isActiveValue = watch('isActive');

  useEffect(() => {
    if (isOpen) {
      reset();
      setShowPasswordVisible(false);
    }
  }, [isOpen, reset]);

  const passwordStrength = calculatePasswordStrength(passwordValue ?? '');

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: CreateUserFormValues) => {
    const payload: CreateUserProfileInput = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone ?? null,
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString()
        : null,
      role: data.role as unknown as (typeof UserRole)[keyof typeof UserRole],
      isActive: data.isActive,
    };
    await onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/50 p-4'
      onClick={handleClose}
    >
      <div
        className='w-full max-w-[650px] max-h-[95vh] overflow-y-auto rounded-xl border border-border bg-white shadow-2xl'
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='sticky top-0 z-10 flex items-start justify-between border-b border-border bg-white px-6 pb-4 pt-6'>
          <div className='flex items-start gap-3'>
            <div className='flex shrink-0 items-center justify-center rounded-lg bg-brand-purple/10 p-2 text-brand-purple'>
              <UserPlusIcon size={20} />
            </div>
            <div className='flex-1'>
              <h2 className='m-0 mb-1 font-heading text-xl font-bold leading-snug text-foreground'>
                Crear Nuevo Usuario
              </h2>
              <p className='m-0 text-sm leading-snug text-muted-foreground'>
                Completa la información para crear una nueva cuenta de usuario
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className='rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Steps indicator */}
        <div className='sticky top-[88px] z-[9] flex items-center justify-center border-b border-border bg-muted px-6 py-4'>
          <div
            className={cn('flex items-center gap-2', !isValid && 'opacity-100')}
          >
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all',
                isValid
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-brand-purple bg-brand-purple text-white'
              )}
            >
              1
            </div>
            <span className='text-sm font-medium text-foreground'>
              Datos Básicos
            </span>
          </div>
          <div className='mx-3 h-0.5 w-8 bg-border' />
          <div
            className={cn('flex items-center gap-2', !isValid && 'opacity-50')}
          >
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all',
                isValid
                  ? 'border-brand-purple bg-brand-purple text-white'
                  : 'border-border bg-transparent text-muted-foreground'
              )}
            >
              2
            </div>
            <span className='text-sm font-medium text-foreground'>
              Configuración
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <div className='p-6 pt-4'>
            {serverError ? (
              <div className='mb-4 flex items-center gap-2 rounded-lg border border-destructive bg-destructive/15 p-3 text-sm font-medium text-destructive'>
                <ShieldIcon size={16} />
                {serverError}
              </div>
            ) : null}

            {/* Account Information */}
            <div className='mb-8'>
              <div className='mb-4 flex items-center gap-2'>
                <MailIcon size={16} className='text-brand-purple' />
                <h3 className='m-0 font-heading text-lg font-semibold text-foreground'>
                  Información de Cuenta
                </h3>
              </div>

              <div className='mb-4 grid gap-4 max-md:grid-cols-1 md:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Input
                    label='Email'
                    type='email'
                    placeholder='ejemplo@correo.com'
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                    <MailIcon size={12} />
                    Este será el email de acceso al sistema
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <Input
                    label='Contraseña'
                    type={showPasswordVisible ? 'text' : 'password'}
                    placeholder='Mínimo 8 caracteres'
                    error={errors.password?.message}
                    rightIcon={
                      showPasswordVisible ? (
                        <EyeOffIcon size={16} />
                      ) : (
                        <EyeIcon size={16} />
                      )
                    }
                    onRightIconClick={() => setShowPasswordVisible(v => !v)}
                    rightIconClickable={true}
                    rightIconAriaLabel={
                      showPasswordVisible
                        ? 'Ocultar contraseña'
                        : 'Mostrar contraseña'
                    }
                    {...register('password')}
                  />
                  {passwordValue ? (
                    <div className='mt-1'>
                      <div className='mb-1 h-[3px] overflow-hidden rounded-sm bg-border'>
                        <div
                          className={cn(
                            'h-full rounded-sm transition-all',
                            strengthColor(passwordStrength)
                          )}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-xs font-medium',
                          strengthTextColor(passwordStrength)
                        )}
                      >
                        Contraseña {getPasswordStrengthText(passwordStrength)}
                      </span>
                    </div>
                  ) : null}
                  <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                    <LockIcon size={12} />
                    Debe contener mayúsculas, minúsculas, números y símbolos
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className='mb-8'>
              <div className='mb-4 flex items-center gap-2'>
                <UserIcon size={16} className='text-brand-purple' />
                <h3 className='m-0 font-heading text-lg font-semibold text-foreground'>
                  Información Personal
                </h3>
              </div>

              <div className='mb-4 grid gap-4 max-md:grid-cols-1 md:grid-cols-2'>
                <Input
                  label='Nombre'
                  placeholder='Nombre del usuario'
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />

                <Input
                  label='Apellido'
                  placeholder='Apellido del usuario'
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />

                <div className='flex flex-col gap-2'>
                  <Input
                    label='Teléfono'
                    placeholder='+34 600 000 000'
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                    <PhoneIcon size={12} />
                    Formato internacional recomendado
                  </div>
                </div>

                <Input
                  label='Fecha de Nacimiento'
                  type='date'
                  error={errors.dateOfBirth?.message}
                  {...register('dateOfBirth')}
                />
              </div>
            </div>

            {/* Settings */}
            <div className='mb-8'>
              <div className='mb-4 flex items-center gap-2'>
                <ShieldIcon size={16} className='text-brand-purple' />
                <h3 className='m-0 font-heading text-lg font-semibold text-foreground'>
                  Configuración
                </h3>
              </div>

              {/* Role selector */}
              <div className='mb-5'>
                <label className='mb-3 block text-sm font-medium text-foreground'>
                  Rol del Usuario
                </label>
                <div className='mb-2 text-xs italic text-muted-foreground'>
                  Haz clic en una opción para seleccionarla
                </div>
                <div className='flex flex-col gap-2'>
                  {ROLES.map(role => {
                    const selected = roleValue === role.value;
                    return (
                      <div
                        key={role.value}
                        onClick={() => setValue('role', role.value)}
                        className={cn(
                          'relative flex cursor-pointer select-none items-center gap-3 rounded-lg border-2 p-4 transition-all hover:-translate-y-0.5 hover:border-brand-purple hover:shadow-md active:translate-y-0 active:shadow-sm',
                          selected
                            ? 'border-brand-purple bg-brand-purple/10'
                            : 'border-border bg-white hover:bg-muted/50'
                        )}
                      >
                        {selected ? (
                          <span className='absolute right-3 top-2 text-base font-bold text-brand-purple'>
                            ✓
                          </span>
                        ) : null}
                        <div
                          className={cn(
                            'flex shrink-0 items-center justify-center rounded-md p-2 transition-all',
                            selected
                              ? 'bg-brand-purple text-white'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {role.icon}
                        </div>
                        <div className='flex-1'>
                          <div className='mb-1 font-heading font-semibold text-foreground'>
                            {role.name}
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            {role.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active checkbox */}
              <div className='flex items-center gap-3 rounded-lg border border-border bg-muted p-4 transition-all hover:border-brand-purple hover:bg-accent'>
                <input
                  type='checkbox'
                  id='isActiveCreate'
                  checked={isActiveValue}
                  onChange={e => setValue('isActive', e.target.checked)}
                  className='h-[18px] w-[18px] cursor-pointer accent-[var(--color-brand-purple)]'
                />
                <label
                  htmlFor='isActiveCreate'
                  className='flex flex-1 cursor-pointer items-center gap-2 text-sm font-medium text-foreground'
                >
                  <CheckCircleIcon size={14} />
                  Usuario activo (puede acceder al sistema)
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='flex justify-end gap-3 border-t border-border bg-muted px-6 py-5'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              size='large'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              variant='primary'
              isLoading={isLoading}
              size='large'
              icon={<UserPlusIcon size={14} />}
            >
              {isLoading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
