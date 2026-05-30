import type React from 'react';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import ShieldIcon from 'lucide-react/dist/esm/icons/shield';
import XCircleIcon from 'lucide-react/dist/esm/icons/x-circle';
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar';
import GlobeIcon from 'lucide-react/dist/esm/icons/globe';
import EyeIcon from 'lucide-react/dist/esm/icons/eye';
import LockIcon from 'lucide-react/dist/esm/icons/lock';
import UnlockIcon from 'lucide-react/dist/esm/icons/unlock';
import UsersIcon from 'lucide-react/dist/esm/icons/users';
import { cn } from '@/lib/utils';
import { type User, AuthProvider } from '@/types/unified';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  useAccountManagement,
  useUserImpersonation,
} from '@/hooks/useAuthManagement';

interface GoogleUserFeaturesProps {
  user: User;
  onUserUpdated?: () => void;
}

const STATUS_CLASS: Record<'success' | 'warning' | 'error', string> = {
  success: 'bg-green-500/20 text-green-600',
  warning: 'bg-yellow-500/20 text-yellow-600',
  error: 'bg-destructive/20 text-destructive',
};

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const isTokenExpired = (expiresAt?: string) =>
  expiresAt ? new Date() > new Date(expiresAt) : false;

const GoogleIcon = () => (
  <div className='flex h-6 w-6 items-center justify-center rounded-sm bg-gradient-to-br from-[#4285f4] via-[#34a853] to-[#ea4335] text-xs font-bold text-white'>
    G
  </div>
);

const InfoRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className='flex flex-col gap-1'>
    <span className='text-xs font-medium uppercase tracking-[0.5px] text-muted-foreground'>
      {label}
    </span>
    <span className='flex items-center gap-1 text-sm font-medium text-foreground'>
      {children}
    </span>
  </div>
);

export const GoogleUserFeatures: React.FC<GoogleUserFeaturesProps> = ({
  user,
}) => {
  const { forcePasswordReset } = useAccountManagement();
  const { impersonateUser } = useUserImpersonation();

  const googleAccount = user.accounts?.find(
    a => a.provider === AuthProvider.google
  );

  if (!googleAccount) {
    return (
      <div className='flex flex-col gap-4'>
        <Card className='border-l-4 p-4' style={{ borderLeftColor: '#4285f4' }}>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-foreground'>
            <GoogleIcon />
            Usuario sin Autenticación Google
          </h3>
          <p className='m-0 text-muted-foreground'>
            Este usuario no tiene una cuenta de Google vinculada.
          </p>
        </Card>
      </div>
    );
  }

  const getGoogleSyncStatus = (): {
    status: 'success' | 'warning' | 'error';
    text: string;
    icon: React.ReactNode;
  } => {
    if (!googleAccount.expiresAt)
      return {
        status: 'success',
        text: 'Sin expiración',
        icon: <CheckCircleIcon size={12} />,
      };
    if (isTokenExpired(googleAccount.expiresAt))
      return {
        status: 'error',
        text: 'Token expirado',
        icon: <XCircleIcon size={12} />,
      };
    const hours = Math.floor(
      (new Date(googleAccount.expiresAt).getTime() - Date.now()) / 3_600_000
    );
    if (hours < 24)
      return {
        status: 'warning',
        text: `Expira en ${hours}h`,
        icon: <AlertTriangleIcon size={12} />,
      };
    return {
      status: 'success',
      text: 'Sincronizado',
      icon: <CheckCircleIcon size={12} />,
    };
  };

  const syncStatus = getGoogleSyncStatus();

  const SECURITY_FEATURES = [
    'Autenticación de dos factores disponible',
    'Verificación de email automática',
    'Detección de actividad sospechosa',
    'Gestión de sesiones centralizada',
  ];

  const SYNCED_DATA = [
    'Información básica del perfil',
    'Dirección de email principal',
    'Foto de perfil (si está disponible)',
    'Configuración de idioma/región',
  ];

  return (
    <div className='flex flex-col gap-4'>
      {/* Auth status card */}
      <Card className='border-l-4 p-4' style={{ borderLeftColor: '#4285f4' }}>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-foreground'>
            <GoogleIcon />
            Autenticación Google
          </h3>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium uppercase tracking-[0.5px]',
              STATUS_CLASS[syncStatus.status]
            )}
          >
            {syncStatus.icon}
            {syncStatus.text}
          </span>
        </div>

        <div className='mb-3 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]'>
          <InfoRow label='ID de Cuenta Google'>
            {googleAccount.providerAccountId}
          </InfoRow>

          <InfoRow label='Email Verificado'>
            {user.emailVerified ? (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium uppercase tracking-[0.5px]',
                  STATUS_CLASS.success
                )}
              >
                <CheckCircleIcon size={12} /> Verificado por Google
              </span>
            ) : (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium uppercase tracking-[0.5px]',
                  STATUS_CLASS.error
                )}
              >
                <XCircleIcon size={12} /> No verificado
              </span>
            )}
          </InfoRow>

          <InfoRow label='Fecha de Vinculación'>
            <CalendarIcon size={12} />
            {formatDate(googleAccount.createdAt)}
          </InfoRow>

          {googleAccount.expiresAt ? (
            <InfoRow label='Expiración del Token'>
              <CalendarIcon size={12} />
              {formatDate(new Date(googleAccount.expiresAt))}
            </InfoRow>
          ) : null}

          <InfoRow label='Tipo de Token'>
            <ShieldIcon size={12} />
            {googleAccount.tokenType ?? 'Bearer'}
          </InfoRow>

          <InfoRow label='Permisos Otorgados'>
            <GlobeIcon size={12} />
            {googleAccount.scope?.split(' ').length ?? 0} permisos
          </InfoRow>
        </div>

        <div className='mt-3 flex flex-wrap gap-2'>
          <Button
            variant='outline'
            size='small'
            onClick={() => impersonateUser(user.id, user.email)}
            icon={<EyeIcon size={14} />}
          >
            Impersonar Usuario
          </Button>
          <Button
            variant='outline'
            size='small'
            onClick={() => forcePasswordReset(user.id, user.email)}
            icon={<LockIcon size={14} />}
          >
            Forzar Reset Contraseña
          </Button>
        </div>
      </Card>

      {/* Privacy & Security card */}
      <Card className='border-l-4 p-4' style={{ borderLeftColor: '#4285f4' }}>
        <h3 className='mb-3 flex items-center gap-2 text-lg font-semibold text-foreground'>
          <ShieldIcon size={20} />
          Privacidad y Seguridad Google
        </h3>

        <div className='mb-3 rounded-md bg-muted p-3'>
          <h4 className='mb-2 flex items-center gap-2 text-base font-semibold text-foreground'>
            <ShieldIcon size={16} />
            Características de Seguridad
          </h4>
          <ul className='m-0 list-none p-0'>
            {SECURITY_FEATURES.map(f => (
              <li
                key={f}
                className='flex items-center gap-2 py-1 text-sm text-muted-foreground'
              >
                <CheckCircleIcon size={16} className='text-green-600' />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className='mb-3 rounded-md bg-muted p-3'>
          <h4 className='mb-2 flex items-center gap-2 text-base font-semibold text-foreground'>
            <UsersIcon size={16} />
            Datos Sincronizados
          </h4>
          <ul className='m-0 list-none p-0'>
            {SYNCED_DATA.map(d => (
              <li
                key={d}
                className='flex items-center gap-2 py-1 text-sm text-muted-foreground'
              >
                <GlobeIcon size={16} className='text-brand-purple' />
                {d}
              </li>
            ))}
          </ul>
        </div>

        {googleAccount.scope ? (
          <div className='rounded-md bg-muted p-3'>
            <h4 className='mb-2 flex items-center gap-2 text-base font-semibold text-foreground'>
              <LockIcon size={16} />
              Permisos Otorgados
            </h4>
            <div className='mt-2 flex flex-wrap gap-1'>
              {googleAccount.scope.split(' ').map((scope, i) => (
                <span
                  key={i}
                  className='rounded-sm px-2 py-1 text-xs font-medium'
                  style={{ background: '#4285f420', color: '#4285f4' }}
                >
                  {scope}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </Card>

      {/* Expired token action card */}
      {googleAccount.expiresAt && isTokenExpired(googleAccount.expiresAt) ? (
        <Card className='border-l-4 p-4' style={{ borderLeftColor: '#4285f4' }}>
          <h3 className='mb-3 flex items-center gap-2 text-lg font-semibold text-foreground'>
            <AlertTriangleIcon size={20} className='text-yellow-600' />
            Acción Requerida
          </h3>
          <div className='mb-3 rounded-md bg-yellow-500/20 p-3'>
            <p className='m-0 font-medium text-yellow-600'>
              El token de acceso de Google ha expirado. El usuario necesitará
              re-autenticarse.
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button
              variant='primary'
              size='small'
              onClick={() =>
                alert(
                  'Redirigir al usuario al flujo de autenticación de Google'
                )
              }
              icon={<UnlockIcon size={14} />}
            >
              Solicitar Re-autenticación
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export default GoogleUserFeatures;
