import { useEffect } from 'react';
import type React from 'react';
import LogOutIcon from 'lucide-react/dist/esm/icons/log-out';
import XIcon from 'lucide-react/dist/esm/icons/x';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import { Button } from '@/components/ui/Button';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const handleClose = () => {
    if (!isLoading) onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[4px]'
      onClick={handleClose}
    >
      <div
        className='w-full max-w-[400px] overflow-hidden rounded-xl bg-white shadow-xl'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex items-center justify-between border-b border-border px-6 py-6'>
          <h2 className='font-heading flex items-center gap-3 text-2xl font-medium text-foreground'>
            <LogOutIcon size={24} />
            Cerrar Sesión
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className='rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-brand-purple'
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className='px-6 py-6'>
          <div className='mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-yellow-400 bg-yellow-400/20'>
            <AlertTriangleIcon size={30} className='text-yellow-500' />
          </div>

          <p className='mb-4 text-center text-lg leading-relaxed text-muted-foreground'>
            ¿Estás seguro de que quieres cerrar tu sesión? Tendrás que volver a
            iniciar sesión para acceder al panel de administración.
          </p>

          <div className='flex flex-col gap-3 border-t border-border pt-4 sm:flex-row'>
            <Button
              variant='outline'
              size='medium'
              onClick={handleClose}
              disabled={isLoading}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              variant='danger'
              size='medium'
              onClick={onConfirm}
              isLoading={isLoading}
              icon={<LogOutIcon size={18} />}
              fullWidth
            >
              {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
