import type React from 'react';
import { useEffect, useState } from 'react';
import EyeIcon from 'lucide-react/dist/esm/icons/eye';
import EyeOffIcon from 'lucide-react/dist/esm/icons/eye-off';
import LockIcon from 'lucide-react/dist/esm/icons/lock';
import MailIcon from 'lucide-react/dist/esm/icons/mail';
import AlertCircleIcon from 'lucide-react/dist/esm/icons/alert-circle';
import RefreshCwIcon from 'lucide-react/dist/esm/icons/refresh-cw';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLoginForm } from '@/hooks/useLoginForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginForm: React.FC = () => {
  const {
    form,
    isLoading,
    error,
    showPassword,
    onSubmit,
    togglePasswordVisibility,
    clearError,
  } = useLoginForm();

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (error && (form.watch('email') || form.watch('password'))) {
      const timer = setTimeout(() => {
        clearError();
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [error, clearError, form]);

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsForgotPasswordOpen(true);
  };

  return (
    <>
      <h2 className='font-heading mb-2 text-2xl font-medium text-foreground'>
        Iniciar Sesión
      </h2>
      <p className='mb-4 text-base text-muted-foreground'>
        Ingresa tus credenciales para acceder al panel de administración
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mb-6 flex flex-col gap-4'
      >
        <Input
          label='Correo Electrónico'
          type='email'
          placeholder='admin@happybabystyle.com'
          leftIcon={<MailIcon size={18} />}
          fullWidth
          {...register('email', {
            required: 'El correo electrónico es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Ingresa un correo electrónico válido',
            },
          })}
          error={errors.email?.message ?? ''}
        />

        <Input
          label='Contraseña'
          type={showPassword ? 'text' : 'password'}
          placeholder='••••••••'
          leftIcon={<LockIcon size={18} />}
          rightIcon={
            showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />
          }
          rightIconClickable
          onRightIconClick={togglePasswordVisibility}
          rightIconAriaLabel={
            showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
          }
          fullWidth
          {...register('password', {
            required: 'La contraseña es requerida',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres',
            },
          })}
          error={errors.password?.message ?? ''}
        />

        <button
          type='button'
          onClick={handleForgotPassword}
          aria-label='¿Olvidaste tu contraseña?'
          className='-mt-2 self-end rounded px-1 py-0.5 text-sm font-medium text-brand-purple transition-colors hover:bg-muted hover:text-[#FF6B6B] hover:underline active:scale-[0.98]'
        >
          ¿Olvidaste tu contraseña?
        </button>

        {error ? (
          <div
            role='alert'
            aria-live='polite'
            className='mt-3 animate-[slideIn_0.3s_ease-out] rounded-md border border-destructive/30 bg-destructive/10 p-4 text-center text-sm text-destructive'
          >
            <div className='mb-2 flex items-center justify-center'>
              <AlertCircleIcon size={20} />
            </div>
            <div className='mb-1 font-medium'>Error de autenticación</div>
            <div className='mb-3 text-sm opacity-90'>{error}</div>
            <div className='flex flex-wrap justify-center gap-2'>
              <Button
                type='button'
                variant='outline'
                size='small'
                onClick={clearError}
              >
                <RefreshCwIcon size={14} />
                Reintentar
              </Button>
              <Button
                type='button'
                variant='outline'
                size='small'
                onClick={() => setIsForgotPasswordOpen(true)}
              >
                Recuperar contraseña
              </Button>
            </div>
          </div>
        ) : null}

        <Button
          type='submit'
          variant='primary'
          size='large'
          fullWidth
          isLoading={isLoading}
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? 'Verificando credenciales...' : 'Iniciar Sesión'}
        </Button>
      </form>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </>
  );
};

export default LoginForm;
