import type React from 'react';
import EyeIcon from 'lucide-react/dist/esm/icons/eye';
import EyeOffIcon from 'lucide-react/dist/esm/icons/eye-off';
import LockIcon from 'lucide-react/dist/esm/icons/lock';
import MailIcon from 'lucide-react/dist/esm/icons/mail';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import PhoneIcon from 'lucide-react/dist/esm/icons/phone';
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar';
import UsersIcon from 'lucide-react/dist/esm/icons/users';
import ShieldIcon from 'lucide-react/dist/esm/icons/shield';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserRole } from '@/generated/graphql';
import { useRegisterForm } from '@/hooks/useRegisterForm';

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
      <h2 className='font-heading mb-2 text-2xl font-medium text-foreground'>
        Crear Nueva Cuenta
      </h2>
      <p className='mb-4 text-base text-muted-foreground'>
        Completa la información para crear tu cuenta de usuario
      </p>

      {success ? (
        <div className='mb-4 rounded-md border border-green-300/30 bg-green-500/10 p-3 text-center text-sm text-green-700'>
          ¡Usuario registrado exitosamente! Ya puedes iniciar sesión.
        </div>
      ) : null}

      {error ? (
        <div className='mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-center text-sm text-destructive'>
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} noValidate className='mb-6 flex flex-col gap-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='sm:col-span-2'>
            <Input
              id='email'
              label='Email'
              type='email'
              placeholder='ejemplo@correo.com'
              leftIcon={<MailIcon size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <Input
            id='firstName'
            label='Nombre'
            placeholder='Nombre del usuario'
            leftIcon={<UserIcon size={18} />}
            error={errors.firstName?.message}
            {...register('firstName')}
          />

          <Input
            id='lastName'
            label='Apellido'
            placeholder='Apellido del usuario'
            leftIcon={<UserIcon size={18} />}
            error={errors.lastName?.message}
            {...register('lastName')}
          />

          <Input
            id='phone'
            label='Teléfono'
            placeholder='+34 600 000 000'
            leftIcon={<PhoneIcon size={18} />}
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
            leftIcon={<CalendarIcon size={18} />}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Input
            id='password'
            label='Contraseña'
            type={showPassword ? 'text' : 'password'}
            placeholder='Mínimo 8 caracteres'
            leftIcon={<LockIcon size={18} />}
            rightIcon={
              showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />
            }
            rightIconClickable
            onRightIconClick={togglePassword}
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            id='confirmPassword'
            label='Confirmar Contraseña'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Repite tu contraseña'
            leftIcon={<LockIcon size={18} />}
            rightIcon={
              showConfirmPassword ? (
                <EyeOffIcon size={16} />
              ) : (
                <EyeIcon size={16} />
              )
            }
            rightIconClickable
            onRightIconClick={toggleConfirmPassword}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        {/* Role selector */}
        <div className='mb-4'>
          <label className='mb-3 block text-sm font-medium text-foreground'>
            Rol del Usuario
          </label>
          <div className='flex flex-col gap-3'>
            <div
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-md border-2 p-4 transition-all',
                role === UserRole.customer
                  ? 'border-brand-purple bg-brand-purple/10'
                  : 'border-border bg-background hover:border-brand-purple hover:bg-muted'
              )}
              onClick={() => setRole(UserRole.customer)}
            >
              <div
                className={cn(
                  'rounded-md p-2',
                  role === UserRole.customer
                    ? 'bg-brand-purple text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <UsersIcon size={20} />
              </div>
              <div className='flex-1'>
                <div className='mb-1 font-semibold text-foreground'>
                  Cliente
                </div>
                <div className='text-sm text-muted-foreground'>
                  Acceso a funciones básicas de cliente
                </div>
              </div>
            </div>

            <div
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-md border-2 p-4 transition-all',
                role === UserRole.staff
                  ? 'border-brand-purple bg-brand-purple/10'
                  : 'border-border bg-background hover:border-brand-purple hover:bg-muted'
              )}
              onClick={() => setRole(UserRole.staff)}
            >
              <div
                className={cn(
                  'rounded-md p-2',
                  role === UserRole.staff
                    ? 'bg-brand-purple text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <ShieldIcon size={20} />
              </div>
              <div className='flex-1'>
                <div className='mb-1 font-semibold text-foreground'>Staff</div>
                <div className='text-sm text-muted-foreground'>
                  Acceso a gestión de contenido y soporte
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3 rounded-md border border-border bg-muted p-3'>
          <input
            type='checkbox'
            id='isActiveRegister'
            className='h-[18px] w-[18px] cursor-pointer'
            checked={isActive}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIsActive(e.target.checked)
            }
          />
          <label
            htmlFor='isActiveRegister'
            className='flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground'
          >
            Usuario activo (puede acceder al sistema)
          </label>
        </div>

        <Button
          type='submit'
          variant='primary'
          size='large'
          fullWidth
          isLoading={isLoading}
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>
      </form>
    </>
  );
};

export default RegisterForm;
