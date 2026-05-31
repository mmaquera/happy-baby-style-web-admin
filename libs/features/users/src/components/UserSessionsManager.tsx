import type React from 'react';
import { useMemo } from 'react';
import MonitorIcon from 'lucide-react/dist/esm/icons/monitor';
import SmartphoneIcon from 'lucide-react/dist/esm/icons/smartphone';
import TabletIcon from 'lucide-react/dist/esm/icons/tablet';
import ClockIcon from 'lucide-react/dist/esm/icons/clock';
import MapPinIcon from 'lucide-react/dist/esm/icons/map-pin';
import ShieldIcon from 'lucide-react/dist/esm/icons/shield';
import LogOutIcon from 'lucide-react/dist/esm/icons/log-out';
import AlertCircleIcon from 'lucide-react/dist/esm/icons/alert-circle';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import XIcon from 'lucide-react/dist/esm/icons/x';
import GlobeIcon from 'lucide-react/dist/esm/icons/globe';
import ActivityIcon from 'lucide-react/dist/esm/icons/activity';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import InfoIcon from 'lucide-react/dist/esm/icons/info';
import { cn } from '@happy-baby/shared-utils';
import type { UserSession } from '@happy-baby/infrastructure-graphql';
import { Card } from '@happy-baby/shared-ui';
import { Button } from '@happy-baby/shared-ui';
import { useSessionManagement } from '@happy-baby/feature-auth';

interface UserSessionsManagerProps {
  userId: string;
  sessions: UserSession[];
  onSessionRevoked?: () => void;
}

const PRIVATE_IP_RE = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/;

const isSessionExpired = (expiresAt: Date | string | null | undefined) =>
  expiresAt ? new Date() > new Date(expiresAt) : false;

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getDeviceIcon = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone'))
    return <SmartphoneIcon size={20} />;
  if (ua.includes('tablet') || ua.includes('ipad'))
    return <TabletIcon size={20} />;
  return <MonitorIcon size={20} />;
};

const getDeviceInfo = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  let device = 'Escritorio';
  let browser = 'Desconocido';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone'))
    device = 'Móvil';
  else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  return `${device} • ${browser}`;
};

const isSuspicious = (session: UserSession) =>
  (!!session.ipAddress && !session.ipAddress.match(PRIVATE_IP_RE)) ||
  (!!session.userAgent &&
    (session.userAgent.includes('bot') ||
      session.userAgent.includes('crawler')));

const ALERT_CLASS: Record<'warning' | 'info' | 'success', string> = {
  warning: 'border border-yellow-500/30 bg-yellow-500/10 text-yellow-600',
  info: 'border border-blue-500/30 bg-blue-500/10 text-blue-600',
  success: 'border border-green-500/30 bg-green-500/10 text-green-600',
};

const SecurityAlert = ({
  type,
  icon,
  children,
}: {
  type: 'warning' | 'info' | 'success';
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      'mt-4 flex items-center gap-3 rounded-lg p-4 text-sm',
      ALERT_CLASS[type]
    )}
  >
    {icon}
    <div>{children}</div>
  </div>
);

const DetailItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className='flex flex-col gap-2'>
    <span className='text-sm font-medium text-muted-foreground'>{label}</span>
    <span className='flex items-center gap-2 text-base font-medium text-foreground'>
      {children}
    </span>
  </div>
);

export const UserSessionsManager: React.FC<UserSessionsManagerProps> = ({
  userId,
  sessions,
  onSessionRevoked,
}) => {
  const { loading, revokeSession, revokeAllSessions } = useSessionManagement();

  const securityAnalysis = useMemo(() => {
    const activeSessions = sessions.filter(s => s.isActive);
    const expiredSessions = sessions.filter(s => isSessionExpired(s.expiresAt));
    const suspiciousSessions = activeSessions.filter(isSuspicious);
    const uniqueIPs = new Set(
      activeSessions.map(s => s.ipAddress).filter(Boolean)
    );
    return {
      totalSessions: sessions.length,
      activeSessions: activeSessions.length,
      inactiveSessions: sessions.filter(s => !s.isActive).length,
      expiredSessions: expiredSessions.length,
      suspiciousSessions: suspiciousSessions.length,
      multipleLocations: uniqueIPs.size > 1,
      uniqueIPs: uniqueIPs.size,
      hasSecurityIssues: suspiciousSessions.length > 0 || uniqueIPs.size > 1,
    };
  }, [sessions]);

  const handleRevokeSession = async (session: UserSession) => {
    const result = await revokeSession(session.id, userId);
    if (result?.success && onSessionRevoked) onSessionRevoked();
  };

  const handleRevokeAllSessions = async () => {
    const result = await revokeAllSessions(userId);
    if (result?.success && onSessionRevoked) onSessionRevoked();
  };

  const activeSessions = sessions.filter(s => s.isActive);
  const inactiveSessions = sessions.filter(s => !s.isActive);

  if (sessions.length === 0) {
    return (
      <div className='rounded-xl border-2 border-dashed border-border bg-muted py-12 text-center text-muted-foreground'>
        <ShieldIcon size={64} className='mx-auto opacity-40' />
        <h3 className='mt-4 mb-2 font-heading text-xl text-foreground'>
          Sin sesiones activas
        </h3>
        <p className='text-base text-muted-foreground'>
          Este usuario no tiene sesiones registradas
        </p>
      </div>
    );
  }

  const SessionCard = ({
    session,
    isActive,
  }: {
    session: UserSession;
    isActive: boolean;
  }) => {
    const expired = !isActive && isSessionExpired(session.expiresAt);
    const suspicious = isActive && isSuspicious(session);
    const borderColor = isActive ? '#22c55e' : 'var(--color-muted-foreground)';

    const duration =
      session.createdAt && (isActive ? session.expiresAt : session.updatedAt)
        ? `${Math.ceil((new Date(isActive ? session.expiresAt! : session.updatedAt).getTime() - new Date(session.createdAt).getTime()) / 3_600_000)}h`
        : 'N/A';

    return (
      <Card
        className={cn(
          'mb-3 border-l-[3px] p-5 transition-all hover:-translate-y-0.5 hover:shadow-md',
          !isActive && 'opacity-80'
        )}
        style={{ borderLeftColor: borderColor }}
      >
        {/* Card header */}
        <div className='mb-3 flex items-start justify-between'>
          <div className='flex items-center gap-3'>
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-lg border-2 transition-colors',
                isActive
                  ? 'border-brand-purple bg-brand-purple/10 text-brand-purple'
                  : 'border-border bg-muted text-muted-foreground'
              )}
            >
              {getDeviceIcon(session.userAgent ?? '')}
            </div>
            <div>
              <div className='font-semibold text-foreground'>
                {getDeviceInfo(session.userAgent ?? '')}
              </div>
              <div className='text-sm text-muted-foreground'>
                {isActive ? (
                  <>
                    Sesión activa
                    {suspicious ? (
                      <span className='ml-1 font-medium text-yellow-600'>
                        ⚠️ Sospechosa
                      </span>
                    ) : null}
                  </>
                ) : expired ? (
                  'Sesión expirada'
                ) : (
                  'Sesión cerrada'
                )}
              </div>
            </div>
          </div>

          {isActive ? (
            <div className='flex gap-2'>
              {suspicious ? (
                <Button
                  variant='ghost'
                  size='small'
                  icon={<InfoIcon size={14} />}
                  className='border border-yellow-500/40 text-yellow-600'
                >
                  Info
                </Button>
              ) : null}
              <Button
                variant='outline'
                size='small'
                onClick={() => handleRevokeSession(session)}
                disabled={loading}
                icon={<XIcon size={14} />}
              >
                Cerrar
              </Button>
            </div>
          ) : null}
        </div>

        {/* Details */}
        <div className='mt-4 grid gap-4 border-t border-border pt-4 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]'>
          <DetailItem label='Estado'>
            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium',
                expired
                  ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600'
                  : isActive
                    ? 'border-green-500/30 bg-green-500/10 text-green-600'
                    : 'border-muted-foreground/30 bg-muted text-muted-foreground'
              )}
            >
              {isActive ? (
                <CheckCircleIcon size={12} />
              ) : (
                <AlertCircleIcon size={12} />
              )}
              {expired ? 'Expirada' : isActive ? 'Activa' : 'Cerrada'}
            </span>
          </DetailItem>

          <DetailItem label='Dirección IP'>
            <MapPinIcon size={12} />
            {session.ipAddress ?? 'No disponible'}
            {session.ipAddress && !session.ipAddress.match(PRIVATE_IP_RE) ? (
              <span className='ml-1 text-xs text-yellow-600'>(Externa)</span>
            ) : null}
          </DetailItem>

          <DetailItem label='Dispositivo'>
            {getDeviceIcon(session.userAgent ?? '')}
            {getDeviceInfo(session.userAgent ?? '')}
          </DetailItem>

          <DetailItem label='Iniciada'>
            <ClockIcon size={12} />
            {formatDate(session.createdAt as string | undefined)}
          </DetailItem>

          <DetailItem label={isActive ? 'Expira' : 'Terminada'}>
            <ClockIcon size={12} />
            {isActive
              ? session.expiresAt
                ? formatDate(session.expiresAt as string)
                : 'N/A'
              : formatDate(session.updatedAt)}
          </DetailItem>

          <DetailItem label='Duración'>
            <ActivityIcon size={12} />
            {duration}
          </DetailItem>
        </div>
      </Card>
    );
  };

  return (
    <div className='flex flex-col gap-3'>
      {/* Security Summary */}
      <div className='mb-6 rounded-xl border border-border bg-white p-6 shadow-sm'>
        <div className='mb-5 flex items-center gap-3'>
          <ShieldIcon size={24} className='text-brand-purple' />
          <h3 className='m-0 font-heading text-lg font-medium text-foreground'>
            Resumen de Seguridad
          </h3>
        </div>

        <div className='grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(120px,1fr))]'>
          {[
            {
              value: securityAnalysis.totalSessions,
              label: 'Total Sesiones',
              color: '',
            },
            {
              value: securityAnalysis.activeSessions,
              label: 'Activas',
              color: 'text-green-600',
            },
            {
              value: securityAnalysis.expiredSessions,
              label: 'Expiradas',
              color: 'text-yellow-600',
            },
            {
              value: securityAnalysis.suspiciousSessions,
              label: 'Sospechosas',
              color: 'text-destructive',
            },
          ].map(({ value, label, color }) => (
            <div
              key={label}
              className='rounded-lg border border-border bg-muted p-3 text-center transition-colors hover:bg-card'
            >
              <div
                className={cn('mb-2 text-2xl font-bold text-foreground', color)}
              >
                {value}
              </div>
              <div className='text-sm font-medium text-muted-foreground'>
                {label}
              </div>
            </div>
          ))}
        </div>

        {securityAnalysis.hasSecurityIssues ? (
          <SecurityAlert type='warning' icon={<AlertTriangleIcon size={16} />}>
            <strong>⚠️ Alertas de Seguridad:</strong>
            {securityAnalysis.suspiciousSessions > 0 &&
              ` ${securityAnalysis.suspiciousSessions} sesión(es) sospechosa(s) detectada(s)`}
            {securityAnalysis.multipleLocations
              ? ` • Múltiples ubicaciones detectadas (${securityAnalysis.uniqueIPs} IPs únicas)`
              : null}
          </SecurityAlert>
        ) : null}

        {securityAnalysis.multipleLocations ? (
          <SecurityAlert type='info' icon={<GlobeIcon size={16} />}>
            <strong>🌍 Múltiples Ubicaciones:</strong> El usuario tiene sesiones
            activas desde {securityAnalysis.uniqueIPs} ubicación(es)
            diferente(s).
            {securityAnalysis.uniqueIPs > 3
              ? ' Esto podría indicar un uso compartido de la cuenta.'
              : null}
          </SecurityAlert>
        ) : null}

        {!securityAnalysis.hasSecurityIssues &&
        securityAnalysis.activeSessions > 0 ? (
          <SecurityAlert type='success' icon={<CheckCircleIcon size={16} />}>
            <strong>✅ Estado de Seguridad Óptimo:</strong> Todas las sesiones
            activas parecen ser legítimas y seguras.
          </SecurityAlert>
        ) : null}
      </div>

      {/* Header */}
      <div className='mb-5 flex items-center justify-between border-b border-border pb-4'>
        <h3 className='m-0 font-heading text-xl font-medium text-foreground'>
          Sesiones del Usuario ({activeSessions.length} activas)
        </h3>
        {activeSessions.length > 0 ? (
          <Button
            variant='outline'
            size='small'
            onClick={handleRevokeAllSessions}
            disabled={loading}
            icon={<LogOutIcon size={14} />}
          >
            Cerrar Todas
          </Button>
        ) : null}
      </div>

      {/* Active */}
      {activeSessions.length > 0 ? (
        <div>
          <h4 className='mb-4 mt-0 font-heading text-lg font-medium text-green-600'>
            Sesiones Activas ({activeSessions.length})
          </h4>
          {activeSessions.map(s => (
            <SessionCard key={s.id} session={s} isActive={true} />
          ))}
        </div>
      ) : null}

      {/* Inactive */}
      {inactiveSessions.length > 0 ? (
        <div className='mt-6'>
          <h4 className='mb-4 mt-0 font-heading text-lg font-medium text-muted-foreground'>
            Sesiones Cerradas/Expiradas ({inactiveSessions.length})
          </h4>
          {inactiveSessions.map(s => (
            <SessionCard key={s.id} session={s} isActive={false} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default UserSessionsManager;
