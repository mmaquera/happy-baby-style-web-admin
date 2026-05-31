import type React from 'react';
import XIcon from 'lucide-react/dist/esm/icons/x';
import UserPlusIcon from 'lucide-react/dist/esm/icons/user-plus';
import { Button } from '@happy-baby/shared-ui';
import { RegisterForm } from './RegisterForm';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div
      className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[8px]'
      onClick={onClose}
    >
      <div
        className='max-h-[90vh] w-full max-w-[700px] overflow-y-auto rounded-lg border border-border bg-background shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]'
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className='flex items-start justify-between border-b border-border px-6 pb-4 pt-6'>
          <div className='flex items-start gap-3'>
            <UserPlusIcon size={24} className='text-brand-purple' />
            <div>
              <h2 className='m-0 text-xl font-bold text-foreground'>
                Crear Nueva Cuenta
              </h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                Regístrate para acceder al sistema
              </p>
            </div>
          </div>
          <Button variant='ghost' size='small' onClick={onClose}>
            <XIcon size={18} />
          </Button>
        </div>

        <div className='px-6 py-6'>
          <RegisterForm onSuccess={handleSuccess} />
        </div>

        <div className='flex justify-end gap-3 border-t border-border bg-muted px-6 py-6'>
          <Button variant='outline' onClick={onClose} size='large'>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
