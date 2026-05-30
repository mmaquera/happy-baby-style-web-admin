import type React from 'react';
import { useEffect } from 'react';
import XIcon from 'lucide-react/dist/esm/icons/x';
import MailIcon from 'lucide-react/dist/esm/icons/mail';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import AlertCircleIcon from 'lucide-react/dist/esm/icons/alert-circle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForgotPassword } from '@/hooks/useForgotPassword';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    email,
    isLoading,
    isSuccess,
    error,
    setEmail,
    submitForm,
    resetState,
    clearError,
  } = useForgotPassword();

  const handleClose = () => {
    if (!isLoading) {
      resetState();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(email);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (error) clearError();
  }, [error, clearError]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4'
      onClick={handleClose}
    >
      <div
        className='w-full max-w-[450px] overflow-hidden rounded-xl bg-white shadow-xl'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex items-center justify-between border-b border-border px-6 pb-4 pt-6'>
          <h2 className='font-heading text-2xl font-semibold text-foreground'>
            Recuperar Contraseña
          </h2>
          <button
            onClick={handleClose}
            aria-label='Cerrar modal'
            className='flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-brand-purple active:scale-95'
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className='px-6 py-6'>
          {isSuccess ? (
            <div className='flex items-center gap-3 rounded-md border border-green-300/30 bg-green-500/10 p-4 text-center text-base text-green-700'>
              <CheckCircleIcon size={24} />
              <div>
                <strong>¡Correo enviado!</strong>
                <br />
                Hemos enviado las instrucciones para recuperar tu contraseña a
                tu correo electrónico.
              </div>
            </div>
          ) : (
            <>
              <p className='mb-4 text-base leading-relaxed text-muted-foreground'>
                Ingresa tu correo electrónico y te enviaremos las instrucciones
                para recuperar tu contraseña.
              </p>

              <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <Input
                  label='Correo Electrónico'
                  type='email'
                  placeholder='admin@happybabystyle.com'
                  leftIcon={<MailIcon size={18} />}
                  fullWidth
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                />

                {error ? (
                  <div className='flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-base text-destructive'>
                    <AlertCircleIcon size={20} />
                    {error}
                  </div>
                ) : null}

                <Button
                  type='submit'
                  variant='primary'
                  size='large'
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                </Button>
              </form>
            </>
          )}
        </div>

        {isSuccess ? (
          <div className='border-t border-border px-6 pb-6 pt-4'>
            <Button
              variant='outline'
              size='medium'
              fullWidth
              onClick={handleClose}
            >
              Cerrar
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
