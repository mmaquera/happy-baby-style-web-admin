import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import XIcon from 'lucide-react/dist/esm/icons/x';
import KeyIcon from 'lucide-react/dist/esm/icons/key';
import EyeIcon from 'lucide-react/dist/esm/icons/eye';
import EyeOffIcon from 'lucide-react/dist/esm/icons/eye-off';
import ShieldIcon from 'lucide-react/dist/esm/icons/shield';
import RefreshCwIcon from 'lucide-react/dist/esm/icons/refresh-cw';
import CopyIcon from 'lucide-react/dist/esm/icons/copy';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import ClockIcon from 'lucide-react/dist/esm/icons/clock';
import LockIcon from 'lucide-react/dist/esm/icons/lock';
import AlertCircleIcon from 'lucide-react/dist/esm/icons/alert-circle';
import { cn } from '@/lib/utils';
import type { User } from '@/core/domain/user/User';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAccountManagement } from '@/hooks/useAuthManagement';
import { useSetUserPassword } from '@/hooks/useSetUserPassword';
import { usePasswordHistory } from '@/hooks/usePasswordHistory';
import { PasswordHistoryCard } from './PasswordHistoryCard';
import toast from 'react-hot-toast';
import { logger } from '@/utils/logger';

interface PasswordManagementModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const ACTION_ICON_CLASS: Record<'primary' | 'warning' | 'danger', string> = {
  primary: 'bg-brand-purple/15 text-brand-purple',
  warning: 'bg-yellow-500/20 text-yellow-600',
  danger: 'bg-destructive/20 text-destructive',
};

const STATUS_CLASS: Record<'success' | 'warning' | 'info', string> = {
  success: 'bg-green-500/20 text-green-600',
  warning: 'bg-yellow-500/20 text-yellow-600',
  info: 'bg-blue-500/20 text-blue-600',
};

const ActionCard = ({ children }: { children: React.ReactNode }) => (
  <div className='group relative mb-4 overflow-hidden rounded-lg border border-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-purple/40 hover:shadow-[0_8px_25px_rgba(162,133,209,0.15)]'>
    <div className='absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-purple to-teal-400 opacity-0 transition-opacity group-hover:opacity-100' />
    {children}
  </div>
);

export const PasswordManagementModal: React.FC<
  PasswordManagementModalProps
> = ({ user, isOpen, onClose }) => {
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const { forcePasswordReset } = useAccountManagement();
  const {
    setUserPassword,
    loading: isSetting,
    error: setPasswordError,
    clearError: clearSetPasswordError,
  } = useSetUserPassword();
  const {
    passwordHistory,
    loading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = usePasswordHistory(user.id);

  const generateTempPassword = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lower = 'abcdefghijklmnopqrstuvwxyz';
      const nums = '0123456789';
      const syms = '!@#$%&*';
      let result =
        (upper[Math.floor(Math.random() * upper.length)] ?? '') +
        (lower[Math.floor(Math.random() * lower.length)] ?? '') +
        (nums[Math.floor(Math.random() * nums.length)] ?? '') +
        (syms[Math.floor(Math.random() * syms.length)] ?? '');
      const all = upper + lower + nums + syms;
      for (let i = 4; i < 12; i++)
        result += all[Math.floor(Math.random() * all.length)] ?? '';
      result = result
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
      setTempPassword(result);
      setShowTempPassword(true);
      setIsGenerating(false);
      toast.success('Contraseña temporal generada exitosamente', {
        duration: 4000,
        icon: '🔑',
      });
    }, 800);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Contraseña copiada al portapapeles');
    } catch {
      toast.error('Error al copiar contraseña');
    }
  };

  const handleForceReset = async () => {
    try {
      await forcePasswordReset(user.id, user.email);
      refetchHistory();
    } catch (error) {
      logger.error('Error al forzar reset:', error);
    }
  };

  const processServerError = useCallback((errorMessage: string) => {
    const msg = errorMessage.toLowerCase();
    const text =
      msg.includes('password') || msg.includes('contraseña')
        ? 'Error con la contraseña. Verifica que cumpla con los requisitos.'
        : msg.includes('user') || msg.includes('usuario')
          ? 'Error al procesar la solicitud. Usuario no encontrado.'
          : errorMessage;
    setServerErrors({ password: text });
  }, []);

  useEffect(() => {
    if (setPasswordError) processServerError(setPasswordError);
    else setServerErrors({});
  }, [setPasswordError, processServerError]);

  const handleSetNewPassword = async () => {
    setLocalErrors({});
    setServerErrors({});
    clearSetPasswordError();
    if (!newPassword.trim()) {
      setLocalErrors({ password: 'Ingrese una nueva contraseña' });
      toast.error('Ingrese una nueva contraseña');
      return;
    }
    const success = await setUserPassword(user.id, newPassword);
    if (success) {
      setNewPassword('');
      setLocalErrors({});
      setServerErrors({});
      refetchHistory();
    }
  };

  const handlePasswordChange = useCallback(
    (value: string) => {
      setNewPassword(value);
      if (localErrors['password'])
        setLocalErrors(prev => ({ ...prev, password: '' }));
      if (serverErrors['password']) {
        setServerErrors(prev => ({ ...prev, password: '' }));
        clearSetPasswordError();
      }
    },
    [localErrors, serverErrors, clearSetPasswordError]
  );

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/50'
      onClick={onClose}
    >
      <Card
        className='relative max-h-[85vh] w-[95%] max-w-[700px] overflow-y-auto p-6'
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='mb-6 flex items-center justify-between border-b border-border pb-4'>
          <h2 className='flex items-center gap-3 text-2xl font-semibold text-foreground'>
            <KeyIcon size={24} />
            Gestión de Contraseñas
          </h2>
          <Button variant='ghost' size='small' onClick={onClose}>
            <XIcon size={18} />
          </Button>
        </div>

        {/* User info */}
        <div className='mb-6 rounded-lg bg-muted p-4'>
          <div className='text-lg font-semibold text-foreground'>
            {user.profile?.firstName} {user.profile?.lastName}
          </div>
          <div className='text-sm text-muted-foreground'>{user.email}</div>
        </div>

        {/* Security Actions */}
        <div className='mb-6'>
          <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-foreground'>
            <ShieldIcon size={20} />
            Acciones de Seguridad
          </h3>

          {/* Force Reset */}
          <ActionCard>
            <div className='mb-3 flex items-center gap-3'>
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full',
                  ACTION_ICON_CLASS.warning
                )}
              >
                <RefreshCwIcon size={20} />
              </div>
              <div>
                <div className='text-base font-semibold text-foreground'>
                  Forzar Reset de Contraseña
                </div>
                <div className='mt-1 text-sm text-muted-foreground'>
                  Envía un email al usuario para que restablezca su contraseña
                </div>
              </div>
            </div>
            <div className='my-4'>
              <span
                className={cn(
                  'mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.5px]',
                  STATUS_CLASS.info
                )}
              >
                <ClockIcon size={12} /> Email automático
              </span>
            </div>
            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={handleForceReset}>
                <RefreshCwIcon size={16} />
                Enviar Reset
              </Button>
            </div>
          </ActionCard>

          {/* Generate Temp Password */}
          <ActionCard>
            <div className='mb-3 flex items-center gap-3'>
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full',
                  ACTION_ICON_CLASS.primary
                )}
              >
                <KeyIcon size={20} />
              </div>
              <div>
                <div className='text-base font-semibold text-foreground'>
                  Generar Contraseña Temporal
                </div>
                <div className='mt-1 text-sm text-muted-foreground'>
                  Crea una contraseña temporal para acceso inmediato del usuario
                </div>
              </div>
            </div>
            <div className='my-4'>
              <span
                className={cn(
                  'mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.5px]',
                  STATUS_CLASS.warning
                )}
              >
                <AlertTriangleIcon size={12} /> Cambio requerido en primer login
              </span>
            </div>

            {showTempPassword ? (
              <div className='relative my-4 overflow-hidden rounded-lg border-2 border-brand-purple/30 bg-gradient-to-br from-brand-purple/5 to-white p-5'>
                <div className='absolute inset-x-0 top-0 h-[3px] rounded-t-lg bg-gradient-to-r from-brand-purple to-teal-400' />
                <div className='mb-3 flex items-center gap-2 font-semibold text-brand-purple'>
                  <CheckCircleIcon size={16} />
                  Contraseña Temporal Generada
                </div>
                <div className='mt-3 flex items-center gap-3 rounded-md border-2 border-brand-purple/20 bg-white p-4 transition-all hover:border-brand-purple/40'>
                  <code className='flex-1 font-mono text-base text-foreground'>
                    {tempPassword}
                  </code>
                  <Button
                    variant='ghost'
                    size='small'
                    onClick={() => copyToClipboard(tempPassword)}
                  >
                    <CopyIcon size={16} />
                  </Button>
                </div>
              </div>
            ) : null}

            <div className='flex justify-end gap-2'>
              <Button
                variant='primary'
                onClick={generateTempPassword}
                isLoading={isGenerating}
              >
                {isGenerating ? 'Generando...' : 'Generar Contraseña Temporal'}
              </Button>
            </div>
          </ActionCard>

          {/* Set New Password */}
          <ActionCard>
            <div className='mb-3 flex items-center gap-3'>
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full',
                  ACTION_ICON_CLASS.danger
                )}
              >
                <LockIcon size={20} />
              </div>
              <div>
                <div className='text-base font-semibold text-foreground'>
                  Establecer Nueva Contraseña
                </div>
                <div className='mt-1 text-sm text-muted-foreground'>
                  Define directamente una nueva contraseña para el usuario
                </div>
              </div>
            </div>
            <div className='my-4'>
              {setPasswordError ? (
                <div className='mb-3 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/15 p-3 text-sm font-medium text-destructive'>
                  <AlertCircleIcon size={16} />
                  {setPasswordError}
                </div>
              ) : null}

              <Input
                label='Nueva Contraseña'
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handlePasswordChange(e.target.value)
                }
                placeholder='Ingrese nueva contraseña segura'
                error={
                  localErrors['password'] ?? serverErrors['password'] ?? ''
                }
                rightIcon={
                  showNewPassword ? (
                    <EyeOffIcon size={16} />
                  ) : (
                    <EyeIcon size={16} />
                  )
                }
                onRightIconClick={() => setShowNewPassword(!showNewPassword)}
                rightIconClickable={true}
                rightIconAriaLabel={
                  showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
              />

              <span
                className={cn(
                  'mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.5px]',
                  STATUS_CLASS.warning
                )}
              >
                <AlertTriangleIcon size={12} /> Acción administrativa
              </span>
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => {
                  setNewPassword('');
                  setLocalErrors({});
                  setServerErrors({});
                  clearSetPasswordError();
                }}
                disabled={!newPassword.trim() || isSetting}
              >
                Limpiar
              </Button>
              <Button
                variant='primary'
                onClick={handleSetNewPassword}
                isLoading={isSetting}
                disabled={
                  !newPassword.trim() ||
                  isSetting ||
                  Object.keys(localErrors).length > 0
                }
              >
                <LockIcon size={16} />
                Establecer Contraseña
              </Button>
            </div>
          </ActionCard>
        </div>

        {/* Password History */}
        <div className='mb-6'>
          {historyLoading && passwordHistory.length === 0 ? (
            <div className='p-4 text-center text-muted-foreground'>
              Cargando historial de contraseñas...
            </div>
          ) : null}

          {historyError && !historyLoading ? (
            <div className='mb-4 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/15 p-4 text-destructive'>
              <AlertCircleIcon size={16} />
              Error al cargar historial: {historyError}
            </div>
          ) : null}

          <PasswordHistoryCard actions={passwordHistory} />
        </div>
      </Card>
    </div>
  );
};

export default PasswordManagementModal;
