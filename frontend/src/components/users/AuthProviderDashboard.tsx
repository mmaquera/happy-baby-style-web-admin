import React from 'react';
import styled from 'styled-components';
import { AuthProvider } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { theme } from '@/styles/theme';
import { useAuthProviderStats, useProviderUtils } from '@/hooks/useAuthManagement';
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
  gap: ${theme.spacing[6]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[4]};
`;

const StatsCard = styled(Card)`
  padding: ${theme.spacing[4]};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatsIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background-color: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  margin-bottom: ${theme.spacing[3]};
`;

const StatsNumber = styled.div`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const StatsLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: ${theme.fontWeights.medium};
`;

const ProvidersSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[6]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[4]};
`;

const ProviderCard = styled(Card)<{ color: string }>`
  padding: ${theme.spacing[4]};
  border-left: 4px solid ${props => props.color};
  transition: all ${theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const ProviderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[3]};
`;

const ProviderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const ProviderIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.md};
  background-color: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.lg};
  color: ${props => props.color};
`;

const ProviderStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
`;

const ProviderMetric = styled.div`
  text-align: center;
`;

const MetricNumber = styled.div<{ color: string }>`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${props => props.color};
`;

const MetricLabel = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PercentageBar = styled.div<{ percentage: number; color: string }>`
  width: 100%;
  height: 8px;
  background-color: ${theme.colors.background.light};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin-top: ${theme.spacing[2]};
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.percentage}%;
    height: 100%;
    background-color: ${props => props.color};
    transition: width ${theme.transitions.base};
  }
`;

const RecentActivitySection = styled.div`
  background: ${theme.colors.background.light};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.base};

  &:hover {
    transform: translateX(4px);
    box-shadow: ${theme.shadows.sm};
  }
`;

const ActivityIcon = styled.div<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  background-color: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityUser = styled.div`
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const ActivityDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.text.secondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.error};
`;

export const AuthProviderDashboard: React.FC = () => {
  const { stats, loading, error, refetch } = useAuthProviderStats();
  const { getProviderLabel, getProviderIcon, getProviderColor } = useProviderUtils();

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

  return (
    <DashboardContainer>
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
      </StatsGrid>

      <ProvidersSection>
        {/* Distribución por Proveedor */}
        <div>
          <SectionTitle>Distribución por Proveedor</SectionTitle>
          {stats.usersByProvider.map((provider) => {
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
              {stats.recentLogins.slice(0, 5).map((login, index) => {
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
                        {login.ipAddress && (
                          <>
                            <MapPin size={12} />
                            <span>{login.ipAddress}</span>
                          </>
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
                  No hay actividad reciente
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