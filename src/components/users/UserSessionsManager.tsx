import React, { useMemo } from 'react';
import styled from 'styled-components';
import { UserSession } from '@/types/unified';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { theme } from '@/styles/theme';
import { useSessionManagement } from '@/hooks/useAuthManagement';
import { 
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  MapPin,
  Shield,
  LogOut,
  AlertCircle,
  CheckCircle,
  X,
  Globe,
  Activity,
  AlertTriangle,
  Info
} from 'lucide-react';

interface UserSessionsManagerProps {
  userId: string;
  sessions: UserSession[];
  onSessionRevoked?: () => void;
}

// Styled Components
const SessionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const SessionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[5]};
  padding-bottom: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

const HeaderTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const SessionCard = styled(Card)<{ isActive: boolean }>`
  padding: ${theme.spacing[5]};
  border-left: 3px solid ${props => props.isActive ? theme.colors.success : theme.colors.text.secondary};
  opacity: ${props => props.isActive ? 1 : 0.8};
  transition: ${theme.transitions.base};
  margin-bottom: ${theme.spacing[3]};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
    border-left-color: ${props => props.isActive ? theme.colors.success : theme.colors.primaryPurple};
  }
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing[3]};
`;

const SessionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const DeviceIcon = styled.div<{ isActive: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background-color: ${props => props.isActive ? theme.colors.background.accent : theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isActive ? theme.colors.primaryPurple : theme.colors.text.secondary};
  border: 2px solid ${props => props.isActive ? theme.colors.primaryPurple : theme.colors.border.light};
  transition: ${theme.transitions.base};

  &:hover {
    border-color: ${theme.colors.primaryPurple};
    background-color: ${theme.colors.background.accent};
  }
`;

const SessionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[4]};
  padding-top: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.border.light};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const DetailLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.fontWeights.medium};
`;

const DetailValue = styled.span`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const StatusBadge = styled.span<{ isActive: boolean; isExpired?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  border: 1px solid;
  
  ${({ isActive, isExpired }) => {
    if (isExpired) {
      return `
        background: ${theme.colors.warning}10;
        color: ${theme.colors.warning};
        border-color: ${theme.colors.warning}30;
      `;
    } else if (isActive) {
      return `
        background: ${theme.colors.success}10;
        color: ${theme.colors.success};
        border-color: ${theme.colors.success}30;
      `;
    } else {
      return `
        background: ${theme.colors.text.secondary}10;
        color: ${theme.colors.text.secondary};
        border-color: ${theme.colors.text.secondary}30;
      `;
    }
  }}
`;

const SessionActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[12]};
  color: ${theme.colors.text.secondary};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.xl};
  border: 2px dashed ${theme.colors.border.light};
`;

const SecuritySummary = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[6]};
  border: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.sm};
`;

const SecurityHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[5]};
`;

const SecurityTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const SecurityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${theme.spacing[4]};
`;

const SecurityItem = styled.div`
  text-align: center;
  padding: ${theme.spacing[3]};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  transition: ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.background.hover};
    border-color: ${theme.colors.border.accent};
  }
`;

const SecurityValue = styled.div`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[2]};
`;

const SecurityLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.fontWeights.medium};
`;

const SecurityAlert = styled.div<{ type: 'warning' | 'info' | 'success' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  margin-top: ${theme.spacing[4]};
  font-size: ${theme.fontSizes.sm};
  border: 1px solid;
  
  ${({ type }) => {
    switch (type) {
      case 'warning':
        return `
          background: ${theme.colors.warning}10;
          color: ${theme.colors.warning};
          border-color: ${theme.colors.warning}30;
        `;
      case 'info':
        return `
          background: ${theme.colors.info}10;
          color: ${theme.colors.info};
          border-color: ${theme.colors.info}30;
        `;
      case 'success':
        return `
          background: ${theme.colors.success}10;
          color: ${theme.colors.success};
          border-color: ${theme.colors.success}30;
        `;
    }
  }}
`;

export const UserSessionsManager: React.FC<UserSessionsManagerProps> = ({ 
  userId, 
  sessions, 
  onSessionRevoked 
}) => {
  const { loading, revokeSession, revokeAllSessions } = useSessionManagement();

  // Función auxiliar para verificar si una sesión ha expirado
  const isSessionExpired = (expiresAt: Date | string | null | undefined) => {
    if (!expiresAt || expiresAt === null) return false;
    return new Date() > new Date(expiresAt);
  };

  // Análisis de seguridad de sesiones
  const securityAnalysis = useMemo(() => {
    const activeSessions = sessions.filter(session => session.isActive);
    const inactiveSessions = sessions.filter(session => !session.isActive);
    const expiredSessions = sessions.filter(session => 
      session.expiresAt ? isSessionExpired(session.expiresAt) : false
    );
    
    // Detectar sesiones sospechosas
    const suspiciousSessions = activeSessions.filter(session => {
      // Sesiones con IPs diferentes o user agents inusuales
      const hasUnusualIP = session.ipAddress && 
        !session.ipAddress.match(/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/);
      const hasUnusualUserAgent = session.userAgent && 
        (session.userAgent.includes('bot') || session.userAgent.includes('crawler'));
      
      return hasUnusualIP || hasUnusualUserAgent;
    });

    // Análisis de ubicaciones
    const uniqueIPs = new Set(activeSessions.map(s => s.ipAddress).filter(Boolean));
    const multipleLocations = uniqueIPs.size > 1;

    return {
      totalSessions: sessions.length,
      activeSessions: activeSessions.length,
      inactiveSessions: inactiveSessions.length,
      expiredSessions: expiredSessions.length,
      suspiciousSessions: suspiciousSessions.length,
      multipleLocations,
      uniqueIPs: uniqueIPs.size,
      hasSecurityIssues: suspiciousSessions.length > 0 || multipleLocations
    };
  }, [sessions]);

  const handleRevokeSession = async (session: UserSession) => {
    const result = await revokeSession(session.id, userId);
    if (result?.success && onSessionRevoked) {
      onSessionRevoked();
    }
  };

  const handleRevokeAllSessions = async () => {
    const result = await revokeAllSessions(userId);
    if (result?.success && onSessionRevoked) {
      onSessionRevoked();
    }
  };

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <Monitor size={20} />;
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone size={20} />;
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Tablet size={20} />;
    } else {
      return <Monitor size={20} />;
    }
  };

  const getDeviceInfo = (userAgent?: string) => {
    if (!userAgent) return 'Dispositivo desconocido';
    
    const ua = userAgent.toLowerCase();
    let device = 'Escritorio';
    let browser = 'Desconocido';
    
    // Detectar dispositivo
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      device = 'Móvil';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      device = 'Tablet';
    }
    
    // Detectar navegador
    if (ua.includes('chrome')) {
      browser = 'Chrome';
    } else if (ua.includes('firefox')) {
      browser = 'Firefox';
    } else if (ua.includes('safari')) {
      browser = 'Safari';
    } else if (ua.includes('edge')) {
      browser = 'Edge';
    }
    
    return `${device} • ${browser}`;
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date || date === null) return 'N/A';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeSessions = sessions.filter(session => session.isActive);
  const inactiveSessions = sessions.filter(session => !session.isActive);

  if (sessions.length === 0) {
    return (
      <EmptyState>
        <Shield size={64} color={theme.colors.text.secondary} />
        <h3 style={{ 
          margin: `${theme.spacing[4]} 0 ${theme.spacing[2]} 0`,
          color: theme.colors.text.primary,
          fontFamily: theme.fonts.heading,
          fontSize: theme.fontSizes.xl
        }}>
          Sin sesiones activas
        </h3>
        <p style={{ 
          margin: 0,
          fontSize: theme.fontSizes.base,
          color: theme.colors.text.secondary
        }}>
          Este usuario no tiene sesiones registradas
        </p>
      </EmptyState>
    );
  }

  return (
    <SessionsContainer>
      {/* Resumen de Seguridad */}
      <SecuritySummary>
        <SecurityHeader>
          <Shield size={24} color={theme.colors.primaryPurple} />
          <SecurityTitle>Resumen de Seguridad</SecurityTitle>
        </SecurityHeader>
        
        <SecurityGrid>
          <SecurityItem>
            <SecurityValue>{securityAnalysis.totalSessions}</SecurityValue>
            <SecurityLabel>Total Sesiones</SecurityLabel>
          </SecurityItem>
          <SecurityItem>
            <SecurityValue style={{ color: theme.colors.success }}>
              {securityAnalysis.activeSessions}
            </SecurityValue>
            <SecurityLabel>Activas</SecurityLabel>
          </SecurityItem>
          <SecurityItem>
            <SecurityValue style={{ color: theme.colors.warning }}>
              {securityAnalysis.expiredSessions}
            </SecurityValue>
            <SecurityLabel>Expiradas</SecurityLabel>
          </SecurityItem>
          <SecurityItem>
            <SecurityValue style={{ color: theme.colors.error }}>
              {securityAnalysis.suspiciousSessions}
            </SecurityValue>
            <SecurityLabel>Sospechosas</SecurityLabel>
          </SecurityItem>
        </SecurityGrid>

        {/* Alertas de Seguridad */}
        {securityAnalysis.hasSecurityIssues && (
          <SecurityAlert type="warning">
            <AlertTriangle size={16} />
            <div>
              <strong>⚠️ Alertas de Seguridad:</strong>
              {securityAnalysis.suspiciousSessions > 0 && 
                ` ${securityAnalysis.suspiciousSessions} sesión(es) sospechosa(s) detectada(s)`
              }
              {securityAnalysis.multipleLocations && 
                ` • Múltiples ubicaciones detectadas (${securityAnalysis.uniqueIPs} IPs únicas)`
              }
            </div>
          </SecurityAlert>
        )}

        {securityAnalysis.multipleLocations && (
          <SecurityAlert type="info">
            <Globe size={16} />
            <div>
              <strong>🌍 Múltiples Ubicaciones:</strong>
              El usuario tiene sesiones activas desde {securityAnalysis.uniqueIPs} ubicación(es) diferente(s).
              {securityAnalysis.uniqueIPs > 3 && ' Esto podría indicar un uso compartido de la cuenta.'}
            </div>
          </SecurityAlert>
        )}

        {!securityAnalysis.hasSecurityIssues && securityAnalysis.activeSessions > 0 && (
          <SecurityAlert type="success">
            <CheckCircle size={16} />
            <div>
              <strong>✅ Estado de Seguridad Óptimo:</strong>
              Todas las sesiones activas parecen ser legítimas y seguras.
            </div>
          </SecurityAlert>
        )}
      </SecuritySummary>

      <SessionsHeader>
        <HeaderTitle>
          Sesiones del Usuario ({activeSessions.length} activas)
        </HeaderTitle>
        {activeSessions.length > 0 && (
          <Button
            variant="outline"
            size="small"
            onClick={handleRevokeAllSessions}
            disabled={loading}
            icon={<LogOut size={14} />}
          >
            Cerrar Todas
          </Button>
        )}
      </SessionsHeader>

      {/* Sesiones Activas */}
      {activeSessions.length > 0 && (
        <div>
          <h4 style={{ 
            margin: `0 0 ${theme.spacing[4]} 0`,
            color: theme.colors.success,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.medium,
            fontFamily: theme.fonts.heading
          }}>
            Sesiones Activas ({activeSessions.length})
          </h4>
          {activeSessions.map((session) => (
            <SessionCard key={session.id} isActive={true}>
              <SessionHeader>
                <SessionInfo>
                  <DeviceIcon isActive={true}>
                    {getDeviceIcon(session.userAgent || '')}
                  </DeviceIcon>
                  <div>
                    <div style={{ 
                      fontWeight: theme.fontWeights.semibold,
                      color: theme.colors.text.primary 
                    }}>
                      {getDeviceInfo(session.userAgent || '')}
                    </div>
                    <div style={{ 
                      fontSize: theme.fontSizes.sm,
                      color: theme.colors.text.secondary 
                    }}>
                      Sesión activa
                      {securityAnalysis.suspiciousSessions > 0 && 
                        sessions.find(s => s.id === session.id) && 
                        (sessions.find(s => s.id === session.id)?.ipAddress && 
                         !sessions.find(s => s.id === session.id)?.ipAddress?.match(/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/) ||
                         sessions.find(s => s.id === session.id)?.userAgent?.includes('bot') ||
                         sessions.find(s => s.id === session.id)?.userAgent?.includes('crawler')) && (
                        <span style={{ 
                          color: theme.colors.warning, 
                          marginLeft: theme.spacing[1],
                          fontWeight: theme.fontWeights.medium
                        }}>
                          ⚠️ Sospechosa
                        </span>
                      )}
                    </div>
                  </div>
                </SessionInfo>
                
                <SessionActions>
                  {securityAnalysis.suspiciousSessions > 0 && 
                    sessions.find(s => s.id === session.id) && 
                    (sessions.find(s => s.id === session.id)?.ipAddress && 
                     !sessions.find(s => s.id === session.id)?.ipAddress?.match(/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/) ||
                     sessions.find(s => s.id === session.id)?.userAgent?.includes('bot') ||
                     sessions.find(s => s.id === session.id)?.userAgent?.includes('crawler')) && (
                    <Button
                      variant="ghost"
                      size="small"
                      icon={<Info size={14} />}
                      style={{ 
                        color: theme.colors.warning,
                        border: `1px solid ${theme.colors.warning}40`
                      }}
                    >
                      Info
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleRevokeSession(session)}
                    disabled={loading}
                    icon={<X size={14} />}
                  >
                    Cerrar
                  </Button>
                </SessionActions>
              </SessionHeader>

              <SessionDetails>
                <DetailItem>
                  <DetailLabel>Estado</DetailLabel>
                  <DetailValue>
                    <StatusBadge isActive={true}>
                      <CheckCircle size={12} />
                      Activa
                    </StatusBadge>
                  </DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Dirección IP</DetailLabel>
                  <DetailValue>
                    <MapPin size={12} />
                    {session.ipAddress || 'No disponible'}
                    {session.ipAddress && !session.ipAddress.match(/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/) && (
                      <span style={{ 
                        color: theme.colors.warning, 
                        fontSize: theme.fontSizes.xs,
                        marginLeft: theme.spacing[1]
                      }}>
                        (Externa)
                      </span>
                    )}
                  </DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Dispositivo</DetailLabel>
                  <DetailValue>
                    {getDeviceIcon(session.userAgent || '')}
                    {getDeviceInfo(session.userAgent || '')}
                  </DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Iniciada</DetailLabel>
                  <DetailValue>
                    <Clock size={12} />
                    {formatDate(session.createdAt as string | undefined)}
                  </DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Expira</DetailLabel>
                  <DetailValue>
                    <Clock size={12} />
                    {session.expiresAt ? formatDate(session.expiresAt as string) : 'N/A'}
                  </DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Duración</DetailLabel>
                  <DetailValue>
                    <Activity size={12} />
                    {session.createdAt && session.expiresAt ? 
                      `${Math.ceil((new Date(session.expiresAt).getTime() - new Date(session.createdAt).getTime()) / (1000 * 60 * 60))}h` : 
                      'N/A'
                    }
                  </DetailValue>
                </DetailItem>
              </SessionDetails>
            </SessionCard>
          ))}
        </div>
      )}

      {/* Sesiones Inactivas/Expiradas */}
      {inactiveSessions.length > 0 && (
        <div style={{ marginTop: theme.spacing[6] }}>
          <h4 style={{ 
            margin: `0 0 ${theme.spacing[4]} 0`,
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.medium,
            fontFamily: theme.fonts.heading
          }}>
            Sesiones Cerradas/Expiradas ({inactiveSessions.length})
          </h4>
          {inactiveSessions.map((session) => {
            const expired = session.expiresAt ? isSessionExpired(session.expiresAt) : false;
            return (
              <SessionCard key={session.id} isActive={false}>
                <SessionHeader>
                  <SessionInfo>
                    <DeviceIcon isActive={false}>
                      {getDeviceIcon(session.userAgent || '')}
                    </DeviceIcon>
                    <div>
                      <div style={{ 
                        fontWeight: theme.fontWeights.semibold,
                        color: theme.colors.text.primary 
                      }}>
                        {getDeviceInfo(session.userAgent || '')}
                      </div>
                      <div style={{ 
                        fontSize: theme.fontSizes.sm,
                        color: theme.colors.text.secondary 
                      }}>
                        {expired ? 'Sesión expirada' : 'Sesión cerrada'}
                      </div>
                    </div>
                  </SessionInfo>
                </SessionHeader>

                <SessionDetails>
                  <DetailItem>
                    <DetailLabel>Estado</DetailLabel>
                    <DetailValue>
                      <StatusBadge isActive={false} isExpired={expired}>
                        <AlertCircle size={12} />
                        {expired ? 'Expirada' : 'Cerrada'}
                      </StatusBadge>
                    </DetailValue>
                  </DetailItem>

                                  <DetailItem>
                  <DetailLabel>Dirección IP</DetailLabel>
                  <DetailValue>
                    <MapPin size={12} />
                    {session.ipAddress || 'No disponible'}
                    {session.ipAddress && !session.ipAddress.match(/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/) && (
                      <span style={{ 
                        color: theme.colors.warning, 
                        fontSize: theme.fontSizes.xs,
                        marginLeft: theme.spacing[1]
                      }}>
                        (Externa)
                      </span>
                    )}
                  </DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Dispositivo</DetailLabel>
                  <DetailValue>
                    {getDeviceIcon(session.userAgent || '')}
                    {getDeviceInfo(session.userAgent || '')}
                  </DetailValue>
                </DetailItem>

                  <DetailItem>
                    <DetailLabel>Iniciada</DetailLabel>
                    <DetailValue>
                      <Clock size={12} />
                      {formatDate(session.createdAt)}
                    </DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Terminada</DetailLabel>
                    <DetailValue>
                      <Clock size={12} />
                      {formatDate(session.updatedAt)}
                    </DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Duración</DetailLabel>
                    <DetailValue>
                      <Activity size={12} />
                      {session.createdAt && session.updatedAt ? 
                        `${Math.ceil((new Date(session.updatedAt).getTime() - new Date(session.createdAt).getTime()) / (1000 * 60 * 60))}h` : 
                        'N/A'
                      }
                    </DetailValue>
                  </DetailItem>
                </SessionDetails>
              </SessionCard>
            );
          })}
        </div>
      )}
    </SessionsContainer>
  );
};

export default UserSessionsManager;