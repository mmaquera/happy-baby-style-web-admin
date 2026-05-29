import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import type { User } from '@/core/domain/user/User';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAccountManagement } from '@/hooks/useAuthManagement';
import { useSetUserPassword } from '@/hooks/useSetUserPassword';
import { usePasswordHistory } from '@/hooks/usePasswordHistory';
import { PasswordHistoryCard } from './PasswordHistoryCard';
import { theme } from '@/styles/theme';
import {
  X,
  Key,
  Eye,
  EyeOff,
  Shield,
  RefreshCw,
  Copy,
  CheckCircle,
  AlertTriangle,
  Clock,
  Lock,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logger } from '@/utils/logger';

interface PasswordManagementModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

// Styled Components
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(Card)`
  max-width: 700px;
  width: 95%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  padding: ${theme.spacing[6]};

  /* Mejorar scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.background.light};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border.medium};
    border-radius: 3px;

    &:hover {
      background: ${theme.colors.border.accent};
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[6]};
  padding-bottom: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const UserInfo = styled.div`
  background: ${theme.colors.background.light};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const UserName = styled.div`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const UserEmail = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const ActionCard = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[5]};
  margin-bottom: ${theme.spacing[4]};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${theme.colors.primaryPurple},
      ${theme.colors.turquoise}
    );
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover {
    border-color: ${theme.colors.primaryPurple}40;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(162, 133, 209, 0.15);

    &::before {
      opacity: 1;
    }
  }
`;

const ActionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[3]};
`;

const ActionIcon = styled.div<{ variant?: 'primary' | 'warning' | 'danger' }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.variant) {
      case 'warning':
        return `${theme.colors.warning}20`;
      case 'danger':
        return `${theme.colors.error}20`;
      default:
        return `${theme.colors.primaryPurple}15`;
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'warning':
        return theme.colors.warning;
      case 'danger':
        return theme.colors.error;
      default:
        return theme.colors.primaryPurple;
    }
  }};
`;

const ActionTitle = styled.div`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
`;

const ActionDescription = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing[1]};
`;

const ActionContent = styled.div`
  margin: ${theme.spacing[4]} 0;

  /* Mejorar espaciado de inputs */
  .input-group {
    margin-bottom: ${theme.spacing[3]};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  justify-content: flex-end;
`;

const TempPasswordCard = styled.div`
  background: linear-gradient(
    135deg,
    ${theme.colors.background.accent},
    ${theme.colors.white}
  );
  border: 2px solid ${theme.colors.primaryPurple}30;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[5]};
  margin: ${theme.spacing[4]} 0;
  position: relative;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${theme.colors.primaryPurple},
      ${theme.colors.turquoise}
    );
    border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;
  }
`;

const TempPasswordHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
  color: ${theme.colors.primaryPurple};
  font-weight: ${theme.fontWeights.semibold};
`;

const PasswordDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[4]};
  border: 2px solid ${theme.colors.primaryPurple}20;
  margin-top: ${theme.spacing[3]};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primaryPurple}40;
    box-shadow: 0 2px 8px rgba(162, 133, 209, 0.1);
  }
`;

const PasswordText = styled.code`
  flex: 1;
  font-size: ${theme.fontSizes.base};
  font-family: monospace;
  color: ${theme.colors.text.primary};
  background: none;
  border: none;
  outline: none;
`;

const StatusBadge = styled.div<{ variant: 'success' | 'warning' | 'info' }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: ${theme.spacing[2]};
  background: ${props => {
    switch (props.variant) {
      case 'success':
        return `${theme.colors.success}20`;
      case 'warning':
        return `${theme.colors.warning}20`;
      default:
        return `${theme.colors.info}20`;
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      default:
        return theme.colors.info;
    }
  }};
`;

const ServerErrorBanner = styled.div`
  background: ${theme.colors.error}15;
  border: 1px solid ${theme.colors.error}30;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[3]};
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Component
export const PasswordManagementModal: React.FC<
  PasswordManagementModalProps
> = ({ user, isOpen, onClose }) => {
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  // ✅ Estados separados para errores locales y del servidor
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const { forcePasswordReset } = useAccountManagement();
  const {
    setUserPassword,
    loading: isSetting,
    error: setPasswordError,
    clearError: clearSetPasswordError,
  } = useSetUserPassword();

  // ✅ Fetch password history from backend
  const {
    passwordHistory,
    loading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = usePasswordHistory(user.id);

  const generateTempPassword = () => {
    setIsGenerating(true);

    // Simular generación de contraseña temporal más segura
    setTimeout(() => {
      // Generar contraseña más robusta
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercase = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      const symbols = '!@#$%&*';

      let result = '';
      // Asegurar al menos un carácter de cada tipo
      result += uppercase[Math.floor(Math.random() * uppercase.length)];
      result += lowercase[Math.floor(Math.random() * lowercase.length)];
      result += numbers[Math.floor(Math.random() * numbers.length)];
      result += symbols[Math.floor(Math.random() * symbols.length)];

      // Completar hasta 12 caracteres
      const allChars = uppercase + lowercase + numbers + symbols;
      for (let i = 4; i < 12; i++) {
        result += allChars[Math.floor(Math.random() * allChars.length)];
      }

      // Mezclar los caracteres
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
    } catch (error) {
      toast.error('Error al copiar contraseña');
    }
  };

  const handleForceReset = async () => {
    try {
      await forcePasswordReset(user.id, user.email);
      // ✅ Refrescar historial después de forzar reset (si no hay error, fue exitoso)
      refetchHistory();
    } catch (error) {
      // Error ya manejado por forcePasswordReset
      logger.error('Error al forzar reset:', error);
    }
  };

  // ✅ Función para procesar errores del servidor
  const processServerError = useCallback((errorMessage: string): void => {
    const newServerErrors: Record<string, string> = {};

    // ✅ Mapeo inteligente de errores
    if (
      errorMessage.toLowerCase().includes('password') ||
      errorMessage.toLowerCase().includes('contraseña')
    ) {
      newServerErrors['password'] =
        'Error con la contraseña. Verifica que cumpla con los requisitos.';
    } else if (
      errorMessage.toLowerCase().includes('user') ||
      errorMessage.toLowerCase().includes('usuario')
    ) {
      newServerErrors['password'] =
        'Error al procesar la solicitud. Usuario no encontrado.';
    } else {
      newServerErrors['password'] = errorMessage;
    }

    setServerErrors(newServerErrors);
  }, []);

  // ✅ useEffect para manejar cambios en errores del servidor
  useEffect(() => {
    if (setPasswordError) {
      processServerError(setPasswordError);
    } else {
      setServerErrors({});
    }
  }, [setPasswordError, processServerError]);

  const handleSetNewPassword = async () => {
    // ✅ Limpiar errores previos
    setLocalErrors({});
    setServerErrors({});
    clearSetPasswordError();

    // ✅ Validación local básica (la validación completa está en el hook)
    if (!newPassword.trim()) {
      setLocalErrors({ password: 'Ingrese una nueva contraseña' });
      toast.error('Ingrese una nueva contraseña');
      return;
    }

    // ✅ Ejecutar mutación usando el hook
    const success = await setUserPassword(user.id, newPassword);

    if (success) {
      // ✅ Limpiar el campo en caso de éxito
      setNewPassword('');
      setLocalErrors({});
      setServerErrors({});

      // ✅ Refrescar historial de contraseñas después de establecer nueva contraseña
      refetchHistory();
    }
  };

  // ✅ Limpieza automática de errores cuando el usuario modifica el campo
  const handlePasswordChange = useCallback(
    (value: string) => {
      setNewPassword(value);

      // Limpiar errores locales y del servidor
      if (localErrors['password']) {
        setLocalErrors(prev => ({ ...prev, password: '' }));
      }
      if (serverErrors['password']) {
        setServerErrors(prev => ({ ...prev, password: '' }));
        clearSetPasswordError();
      }
    },
    [localErrors, serverErrors, clearSetPasswordError]
  );

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <Key size={24} />
            Gestión de Contraseñas
          </ModalTitle>
          <Button
            variant='ghost'
            size='small'
            onClick={onClose}
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              padding: '0',
              transition: 'all 0.2s ease',
            }}
          >
            <X size={18} />
          </Button>
        </ModalHeader>

        <UserInfo>
          <UserName>
            {user.profile?.firstName} {user.profile?.lastName}
          </UserName>
          <UserEmail>{user.email}</UserEmail>
        </UserInfo>

        <Section>
          <SectionTitle>
            <Shield size={20} />
            Acciones de Seguridad
          </SectionTitle>

          <ActionCard>
            <ActionHeader>
              <ActionIcon variant='warning'>
                <RefreshCw size={20} />
              </ActionIcon>
              <div>
                <ActionTitle>Forzar Reset de Contraseña</ActionTitle>
                <ActionDescription>
                  Envía un email al usuario para que restablezca su contraseña
                </ActionDescription>
              </div>
            </ActionHeader>
            <ActionContent>
              <StatusBadge variant='info'>
                <Clock size={12} />
                Email automático
              </StatusBadge>
            </ActionContent>
            <ActionButtons>
              <Button variant='outline' onClick={handleForceReset}>
                <RefreshCw size={16} />
                Enviar Reset
              </Button>
            </ActionButtons>
          </ActionCard>

          <ActionCard>
            <ActionHeader>
              <ActionIcon>
                <Key size={20} />
              </ActionIcon>
              <div>
                <ActionTitle>Generar Contraseña Temporal</ActionTitle>
                <ActionDescription>
                  Crea una contraseña temporal para acceso inmediato del usuario
                </ActionDescription>
              </div>
            </ActionHeader>
            <ActionContent>
              <StatusBadge variant='warning'>
                <AlertTriangle size={12} />
                Cambio requerido en primer login
              </StatusBadge>
            </ActionContent>
            {showTempPassword ? (
              <TempPasswordCard>
                <TempPasswordHeader>
                  <CheckCircle size={16} />
                  Contraseña Temporal Generada
                </TempPasswordHeader>
                <PasswordDisplay>
                  <PasswordText>{tempPassword}</PasswordText>
                  <Button
                    variant='ghost'
                    size='small'
                    onClick={() => copyToClipboard(tempPassword)}
                  >
                    <Copy size={16} />
                  </Button>
                </PasswordDisplay>
              </TempPasswordCard>
            ) : null}
            <ActionButtons>
              <Button
                variant='primary'
                onClick={generateTempPassword}
                isLoading={isGenerating}
              >
                {isGenerating ? 'Generando...' : 'Generar Contraseña Temporal'}
              </Button>
            </ActionButtons>
          </ActionCard>

          <ActionCard>
            <ActionHeader>
              <ActionIcon variant='danger'>
                <Lock size={20} />
              </ActionIcon>
              <div>
                <ActionTitle>Establecer Nueva Contraseña</ActionTitle>
                <ActionDescription>
                  Define directamente una nueva contraseña para el usuario
                </ActionDescription>
              </div>
            </ActionHeader>
            <ActionContent>
              {/* ✅ Banner de error del servidor */}
              {setPasswordError ? (
                <ServerErrorBanner>
                  <AlertCircle size={16} />
                  {setPasswordError}
                </ServerErrorBanner>
              ) : null}

              <div className='input-group'>
                <Input
                  label='Nueva Contraseña'
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handlePasswordChange(e.target.value)
                  }
                  placeholder='Ingrese nueva contraseña segura'
                  error={
                    localErrors['password'] || serverErrors['password'] || ''
                  }
                  rightIcon={
                    showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />
                  }
                  onRightIconClick={() => setShowNewPassword(!showNewPassword)}
                  rightIconClickable={true}
                  rightIconAriaLabel={
                    showNewPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                />
              </div>
              <StatusBadge variant='warning'>
                <AlertTriangle size={12} />
                Acción administrativa
              </StatusBadge>
            </ActionContent>
            <ActionButtons>
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
                <Lock size={16} />
                Establecer Contraseña
              </Button>
            </ActionButtons>
          </ActionCard>
        </Section>

        <Section>
          {/* ✅ Display loading state */}
          {historyLoading && passwordHistory.length === 0 ? (
            <div
              style={{
                padding: theme.spacing[4],
                textAlign: 'center',
                color: theme.colors.text.secondary,
              }}
            >
              Cargando historial de contraseñas...
            </div>
          ) : null}

          {/* ✅ Display error state */}
          {historyError && !historyLoading ? (
            <div
              style={{
                padding: theme.spacing[4],
                background: `${theme.colors.error}15`,
                border: `1px solid ${theme.colors.error}30`,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.error,
                marginBottom: theme.spacing[4],
              }}
            >
              <AlertCircle
                size={16}
                style={{
                  marginRight: theme.spacing[2],
                  display: 'inline-block',
                }}
              />
              Error al cargar historial: {historyError}
            </div>
          ) : null}

          {/* ✅ Display password history */}
          <PasswordHistoryCard actions={passwordHistory} />
        </Section>
      </ModalContent>
    </Modal>
  );
};

export default PasswordManagementModal;
