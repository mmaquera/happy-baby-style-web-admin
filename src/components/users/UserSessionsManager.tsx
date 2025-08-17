import React from 'react';
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
  X
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
  margin-bottom: ${theme.spacing[4]};
`;

const HeaderTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const SessionCard = styled(Card)<{ isActive: boolean }>`
  padding: ${theme.spacing[4]};
  border-left: 4px solid ${props => props.isActive ? theme.colors.success : theme.colors.error};
  opacity: ${props => props.isActive ? 1 : 0.7};
  transition: all ${theme.transitions.base};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
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
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.md};
  background-color: ${props => props.isActive ? theme.colors.success : theme.colors.error}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isActive ? theme.colors.success : theme.colors.error};
`;

const SessionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[3]};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`;

const DetailLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  font-weight: ${theme.fontWeights.medium};
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const StatusBadge = styled.span<{ isActive: boolean; isExpired?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ isActive, isExpired }) => {
    if (isExpired) {
      return `
        background: ${theme.colors.warning}20;
        color: ${theme.colors.warning};
      `;
    } else if (isActive) {
      return `
        background: ${theme.colors.success}20;
        color: ${theme.colors.success};
      `;
    } else {
      return `
        background: ${theme.colors.error}20;
        color: ${theme.colors.error};
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
  padding: ${theme.spacing[8]};
  color: ${theme.colors.text.secondary};
`;

export const UserSessionsManager: React.FC<UserSessionsManagerProps> = ({ 
  userId, 
  sessions, 
  onSessionRevoked 
}) => {
  const { loading, revokeSession, revokeAllSessions } = useSessionManagement();

  const handleRevokeSession = async (session: UserSession) => {
    const result = await revokeSession(session.id);
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

  const isSessionExpired = (expiresAt: Date | string | null | undefined) => {
    if (!expiresAt || expiresAt === null) return false;
    return new Date() > new Date(expiresAt);
  };

  const activeSessions = sessions.filter(session => session.isActive);
  const inactiveSessions = sessions.filter(session => !session.isActive);

  if (sessions.length === 0) {
    return (
      <EmptyState>
        <Shield size={48} color={theme.colors.text.secondary} />
        <h3>Sin sesiones activas</h3>
        <p>Este usuario no tiene sesiones registradas</p>
      </EmptyState>
    );
  }

  return (
    <SessionsContainer>
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
            margin: `0 0 ${theme.spacing[3]} 0`,
            color: theme.colors.success,
            fontSize: theme.fontSizes.base,
            fontWeight: theme.fontWeights.medium
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
                    </div>
                  </div>
                </SessionInfo>
                
                <SessionActions>
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
              </SessionDetails>
            </SessionCard>
          ))}
        </div>
      )}

      {/* Sesiones Inactivas/Expiradas */}
      {inactiveSessions.length > 0 && (
        <div style={{ marginTop: theme.spacing[6] }}>
          <h4 style={{ 
            margin: `0 0 ${theme.spacing[3]} 0`,
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            fontWeight: theme.fontWeights.medium
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