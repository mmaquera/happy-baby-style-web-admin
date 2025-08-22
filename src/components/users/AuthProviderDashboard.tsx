import React from 'react';
import styled from 'styled-components';
import { AuthProvider } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { theme } from '@/styles/theme';
import { useAuthProviderStats, useProviderUtils, AuthProviderStats } from '@/hooks/useAuthManagement';
import { 
  TrendingUp,
  Users,
  Activity,
  Globe,
  Clock,
  MapPin,
  RefreshCw
} from 'lucide-react';

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[8]};
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[6]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing[4]};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const StatsCard = styled(Card)`
  padding: ${theme.spacing[6]};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.sm};
  transition: all ${theme.transitions.base};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
    border-color: ${theme.colors.border.accent};
  }
`;

const StatsIcon = styled.div<{ color: string }>`
  width: 56px;
  height: 56px;
  border-radius: ${theme.borderRadius.xl};
  background: linear-gradient(135deg, ${props => props.color}15, ${props => props.color}25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  margin-bottom: ${theme.spacing[4]};
  transition: all ${theme.transitions.base};
  
  ${StatsCard}:hover & {
    transform: scale(1.05);
    background: linear-gradient(135deg, ${props => props.color}20, ${props => props.color}30);
  }
`;

const StatsNumber = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[2]};
  line-height: 1;
`;

const StatsLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.fontWeights.medium};
  text-transform: none;
  letter-spacing: 0;
`;

const ProvidersSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[8]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[6]};
  }
`;

const SectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[6]};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -${theme.spacing[2]};
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, ${theme.colors.primaryPurple}, ${theme.colors.turquoise});
    border-radius: ${theme.borderRadius.full};
  }
`;

const ProviderCard = styled(Card)<{ color: string }>`
  padding: ${theme.spacing[6]};
  border: 1px solid ${theme.colors.border.light};
  border-left: 4px solid ${props => props.color};
  background: ${theme.colors.white};
  box-shadow: ${theme.shadows.sm};
  transition: all ${theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
    border-color: ${props => props.color}40;
  }
`;

const ProviderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[4]};
`;

const ProviderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
`;

const ProviderIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${props => props.color}15, ${props => props.color}25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  font-size: ${theme.fontSizes.xl};
  transition: all ${theme.transitions.base};
  
  ${ProviderCard}:hover & {
    transform: scale(1.1);
  }
`;

const ProviderStats = styled.div`
  display: flex;
  gap: ${theme.spacing[6]};
`;

const ProviderMetric = styled.div`
  text-align: center;
`;

const MetricNumber = styled.div<{ color: string }>`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${props => props.color};
  margin-bottom: ${theme.spacing[1]};
  line-height: 1;
`;

const MetricLabel = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.fontWeights.medium};
  text-transform: none;
  letter-spacing: 0;
`;

const PercentageBar = styled.div<{ percentage: number; color: string }>`
  width: 100%;
  height: 6px;
  background-color: ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  position: relative;
  margin-top: ${theme.spacing[3]};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.percentage}%;
    background: linear-gradient(90deg, ${props => props.color}, ${props => props.color}80);
    transition: width ${theme.transitions.base};
    border-radius: ${theme.borderRadius.full};
  }
`;

const RecentActivitySection = styled.div`
  margin-top: ${theme.spacing[4]};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]};
  background-color: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.base};

  &:hover {
    background-color: ${theme.colors.background.hover};
    transform: translateX(4px);
    border-color: ${theme.colors.border.accent};
  }
`;

const ActivityIcon = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${props => props.color}15, ${props => props.color}25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  font-size: ${theme.fontSizes.base};
  transition: all ${theme.transitions.base};
  
  ${ActivityItem}:hover & {
    transform: scale(1.1);
  }
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityUser = styled.div`
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
`;

const ActivityDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  flex-wrap: wrap;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[16]};
  color: ${theme.colors.text.secondary};
  gap: ${theme.spacing[6]};
  min-height: 400px;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[16]};
  color: ${theme.colors.error};
  gap: ${theme.spacing[4]};
  min-height: 400px;
`;

export const AuthProviderDashboard: React.FC = () => {
  const { stats, loading, error, refetch } = useAuthProviderStats();
  const { getProviderLabel, getProviderIcon, getProviderColor } = useProviderUtils();

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Error al refrescar estadísticas:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <LoadingState>
        <RefreshCw className="animate-spin" size={32} />
        <p>Cargando estadísticas de autenticación...</p>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState>
        <p>Error al cargar estadísticas</p>
        <Button variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </ErrorState>
    );
  }

  if (!stats) {
    return (
      <ErrorState>
        <p>No hay datos disponibles</p>
      </ErrorState>
    );
  }

  // Verificar si estamos usando datos de fallback (todos en 0)
  const isUsingFallbackData = stats.totalUsers === 0 && 
                              stats.activeSessionsCount === 0 && 
                              stats.usersByProvider.every(p => p.count === 0) && 
                              stats.recentLogins.length === 0;

  return (
    <DashboardContainer>
      {/* Header con botón de refresh */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: theme.spacing[4]
      }}>
        <h2 style={{ 
          fontSize: theme.fontSizes.xl,
          fontWeight: theme.fontWeights.semibold,
          color: theme.colors.text.primary
        }}>
          Dashboard de Autenticación
        </h2>
        <Button
          variant="outline"
          size="small"
          onClick={handleRefresh}
          disabled={loading}
          icon={<RefreshCw size={16} />}
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      {/* Banner informativo minimalista cuando se usan datos de fallback */}
      {isUsingFallbackData && (
        <div style={{
          backgroundColor: theme.colors.background.accent,
          border: `1px solid ${theme.colors.border.accent}`,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[5],
          marginBottom: theme.spacing[6],
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[4]
        }}>
          <div style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.colors.primaryPurple}, ${theme.colors.turquoise})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: theme.fontWeights.bold
          }}>
            i
          </div>
          <div>
            <div style={{
              fontFamily: theme.fonts.heading,
              fontWeight: theme.fontWeights.semibold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[1],
              fontSize: theme.fontSizes.sm
            }}>
              Modo Demostración
            </div>
            <div style={{
              fontSize: theme.fontSizes.xs,
              color: theme.colors.text.secondary,
              lineHeight: '1.4'
            }}>
              Mostrando datos de ejemplo hasta la conexión con el backend
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas Generales */}
      <StatsGrid>
        <StatsCard>
          <StatsIcon color={theme.colors.primaryPurple}>
            <Users size={24} />
          </StatsIcon>
          <StatsNumber>{stats.totalUsers}</StatsNumber>
          <StatsLabel>Total Usuarios</StatsLabel>
        </StatsCard>

        <StatsCard>
          <StatsIcon color={theme.colors.success}>
            <Activity size={24} />
          </StatsIcon>
          <StatsNumber>{stats.activeSessionsCount}</StatsNumber>
          <StatsLabel>Sesiones Activas</StatsLabel>
        </StatsCard>

        <StatsCard>
          <StatsIcon color={theme.colors.coralAccent}>
            <Globe size={24} />
          </StatsIcon>
          <StatsNumber>{stats.usersByProvider.length}</StatsNumber>
          <StatsLabel>Proveedores Activos</StatsLabel>
        </StatsCard>

        <StatsCard>
          <StatsIcon color={theme.colors.warning}>
            <TrendingUp size={24} />
          </StatsIcon>
          <StatsNumber>{stats.recentLogins.length}</StatsNumber>
          <StatsLabel>Logins Recientes</StatsLabel>
        </StatsCard>

        <StatsCard>
          <StatsIcon color={theme.colors.info}>
            <Globe size={24} />
          </StatsIcon>
          <StatsNumber>{stats.usersByProvider.length}</StatsNumber>
          <StatsLabel>Proveedores Activos</StatsLabel>
        </StatsCard>
      </StatsGrid>

      <ProvidersSection>
        {/* Distribución por Proveedor */}
        <div>
          <SectionTitle>Distribución por Proveedor</SectionTitle>
          {stats.usersByProvider.map((provider: AuthProviderStats['usersByProvider'][0]) => {
            const color = getProviderColor(provider.provider);
            return (
              <ProviderCard key={provider.provider} color={color}>
                <ProviderHeader>
                  <ProviderInfo>
                    <ProviderIcon color={color}>
                      {getProviderIcon(provider.provider)}
                    </ProviderIcon>
                    <div>
                      <div style={{ 
                        fontWeight: theme.fontWeights.semibold,
                        color: theme.colors.text.primary 
                      }}>
                        {getProviderLabel(provider.provider)}
                      </div>
                    </div>
                  </ProviderInfo>
                  
                  <ProviderStats>
                    <ProviderMetric>
                      <MetricNumber color={color}>{provider.count}</MetricNumber>
                      <MetricLabel>Usuarios</MetricLabel>
                    </ProviderMetric>
                    <ProviderMetric>
                      <MetricNumber color={color}>
                        {provider.percentage.toFixed(1)}%
                      </MetricNumber>
                      <MetricLabel>Porcentaje</MetricLabel>
                    </ProviderMetric>
                  </ProviderStats>
                </ProviderHeader>
                
                <PercentageBar percentage={provider.percentage} color={color} />
              </ProviderCard>
            );
          })}
        </div>

        {/* Actividad Reciente */}
        <div>
          <SectionTitle>Actividad Reciente</SectionTitle>
          <RecentActivitySection>
            <ActivityList>
              {stats.recentLogins.slice(0, 5).map((login: AuthProviderStats['recentLogins'][0], index: number) => {
                const color = getProviderColor(login.provider);
                return (
                  <ActivityItem key={`${login.userId}-${index}`}>
                    <ActivityIcon color={color}>
                      {getProviderIcon(login.provider)}
                    </ActivityIcon>
                    <ActivityInfo>
                      <ActivityUser>{login.email}</ActivityUser>
                      <ActivityDetails>
                        <span>{getProviderLabel(login.provider)}</span>
                        <Clock size={12} />
                        <span>{formatDate(login.loginAt)}</span>
                        {login.ipAddress && login.ipAddress !== 'N/A' && (
                          <>
                            <MapPin size={12} />
                            <span>{login.ipAddress}</span>
                          </>
                        )}
                        {login.userAgent && login.userAgent !== 'N/A' && (
                          <span style={{ fontSize: '11px', opacity: 0.7 }}>
                            {login.userAgent.length > 30 ? 
                              `${login.userAgent.substring(0, 30)}...` : 
                              login.userAgent
                            }
                          </span>
                        )}
                      </ActivityDetails>
                    </ActivityInfo>
                  </ActivityItem>
                );
              })}
              
              {stats.recentLogins.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  color: theme.colors.text.secondary,
                  padding: theme.spacing[4]
                }}>
                  {isUsingFallbackData ? (
                    <div>
                      <div style={{ marginBottom: theme.spacing[2] }}>
                        📊 Sin actividad reciente
                      </div>
                      <div style={{ fontSize: theme.fontSizes.sm, opacity: 0.7 }}>
                        Los logins recientes aparecerán aquí cuando haya usuarios activos
                      </div>
                    </div>
                  ) : (
                    'No hay actividad reciente'
                  )}
                </div>
              )}
            </ActivityList>
          </RecentActivitySection>
        </div>
      </ProvidersSection>
    </DashboardContainer>
  );
};

export default AuthProviderDashboard;