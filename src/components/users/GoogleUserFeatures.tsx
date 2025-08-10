import React from 'react';
import styled from 'styled-components';
import { User, AuthProvider } from '@/types/unified';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { theme } from '@/styles/theme';
import { useAccountManagement, useUserImpersonation } from '@/hooks/useAuthManagement';
import { 
  AlertTriangle,
  CheckCircle,
  Shield,
  XCircle,
  Calendar,
  Globe,
  Eye,
  Lock,
  Unlock,
  Users
} from 'lucide-react';

interface GoogleUserFeaturesProps {
  user: User;
  onUserUpdated?: () => void;
}

// Styled Components
const FeaturesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const FeatureCard = styled(Card)`
  padding: ${theme.spacing[4]};
  border-left: 4px solid #4285f4;
`;

const FeatureHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[3]};
`;

const FeatureTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const FeatureContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[3]};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`;

const InfoLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  font-weight: ${theme.fontWeights.medium};
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const StatusBadge = styled.span<{ status: 'success' | 'warning' | 'error' }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ status }) => {
    switch (status) {
      case 'success':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'warning':
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      case 'error':
        return `
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
    }
  }}
`;

const ActionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[3]};
`;

const GoogleIcon = styled.div`
  width: 24px;
  height: 24px;
  background: linear-gradient(45deg, #4285f4, #34a853, #fbbc05, #ea4335);
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: ${theme.fontSizes.xs};
`;

const PrivacyFeatures = styled.div`
  background: ${theme.colors.background.light};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]};
  margin-top: ${theme.spacing[3]};
`;

const PrivacyTitle = styled.h4`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const PrivacyList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PrivacyItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[1]} 0;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

export const GoogleUserFeatures: React.FC<GoogleUserFeaturesProps> = ({ 
  user
}) => {
  const { forcePasswordReset } = useAccountManagement();
  const { impersonateUser } = useUserImpersonation();

  // Encontrar cuenta de Google del usuario
  const googleAccount = user.accounts?.find(account => account.provider === AuthProvider.GOOGLE);
  
  if (!googleAccount) {
    return (
      <FeaturesContainer>
        <FeatureCard>
          <FeatureTitle>
            <GoogleIcon>G</GoogleIcon>
            Usuario sin Autenticación Google
          </FeatureTitle>
          <p style={{ color: theme.colors.text.secondary, margin: 0 }}>
            Este usuario no tiene una cuenta de Google vinculada.
          </p>
        </FeatureCard>
      </FeaturesContainer>
    );
  }

  const handleForcePasswordReset = () => {
    forcePasswordReset(user.id, user.email);
  };

  const handleImpersonateUser = () => {
    impersonateUser(user.id, user.email);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isTokenExpired = (expiresAt?: number) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  const getGoogleSyncStatus = () => {
    if (!googleAccount.expiresAt) {
      return { status: 'success' as const, text: 'Sin expiración', icon: <CheckCircle size={12} /> };
    }
    
    if (isTokenExpired(googleAccount.expiresAt)) {
      return { status: 'error' as const, text: 'Token expirado', icon: <XCircle size={12} /> };
    }
    
    const hoursUntilExpiry = Math.floor((new Date(googleAccount.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60));
    if (hoursUntilExpiry < 24) {
      return { status: 'warning' as const, text: `Expira en ${hoursUntilExpiry}h`, icon: <AlertTriangle size={12} /> };
    }
    
    return { status: 'success' as const, text: 'Sincronizado', icon: <CheckCircle size={12} /> };
  };

  const syncStatus = getGoogleSyncStatus();

  return (
    <FeaturesContainer>
      {/* Estado de Autenticación Google */}
      <FeatureCard>
        <FeatureHeader>
          <FeatureTitle>
            <GoogleIcon>G</GoogleIcon>
            Autenticación Google
          </FeatureTitle>
          <StatusBadge status={syncStatus.status}>
            {syncStatus.icon}
            {syncStatus.text}
          </StatusBadge>
        </FeatureHeader>

        <FeatureContent>
          <InfoItem>
            <InfoLabel>ID de Cuenta Google</InfoLabel>
            <InfoValue>{googleAccount.providerAccountId}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Email Verificado</InfoLabel>
            <InfoValue>
              {user.emailVerified ? (
                <StatusBadge status="success">
                  <CheckCircle size={12} />
                  Verificado por Google
                </StatusBadge>
              ) : (
                <StatusBadge status="error">
                  <XCircle size={12} />
                  No verificado
                </StatusBadge>
              )}
            </InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Fecha de Vinculación</InfoLabel>
            <InfoValue>
              <Calendar size={12} />
              {formatDate(googleAccount.createdAt)}
            </InfoValue>
          </InfoItem>

          {googleAccount.expiresAt && (
            <InfoItem>
              <InfoLabel>Expiración del Token</InfoLabel>
              <InfoValue>
                <Calendar size={12} />
                {formatDate(new Date(googleAccount.expiresAt))}
              </InfoValue>
            </InfoItem>
          )}

          <InfoItem>
            <InfoLabel>Tipo de Token</InfoLabel>
            <InfoValue>
              <Shield size={12} />
              {googleAccount.tokenType || 'Bearer'}
            </InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Permisos Otorgados</InfoLabel>
            <InfoValue>
              <Globe size={12} />
              {googleAccount.scope?.split(' ').length || 0} permisos
            </InfoValue>
          </InfoItem>
        </FeatureContent>

        {/* Acciones Específicas para Usuarios Google */}
        <ActionsList>
          <Button
            variant="outline"
            size="small"
            onClick={handleImpersonateUser}
            icon={<Eye size={14} />}
          >
            Impersonar Usuario
          </Button>
          
          <Button
            variant="outline"
            size="small"
            onClick={handleForcePasswordReset}
            icon={<Lock size={14} />}
          >
            Forzar Reset Contraseña
          </Button>
        </ActionsList>
      </FeatureCard>

      {/* Información de Privacidad y Seguridad */}
      <FeatureCard>
        <FeatureTitle>
          <Shield size={20} />
          Privacidad y Seguridad Google
        </FeatureTitle>

        <PrivacyFeatures>
          <PrivacyTitle>
            <Shield size={16} />
            Características de Seguridad
          </PrivacyTitle>
          <PrivacyList>
            <PrivacyItem>
              <CheckCircle size={16} color={theme.colors.success} />
              Autenticación de dos factores disponible
            </PrivacyItem>
            <PrivacyItem>
              <CheckCircle size={16} color={theme.colors.success} />
              Verificación de email automática
            </PrivacyItem>
            <PrivacyItem>
              <CheckCircle size={16} color={theme.colors.success} />
              Detección de actividad sospechosa
            </PrivacyItem>
            <PrivacyItem>
              <CheckCircle size={16} color={theme.colors.success} />
              Gestión de sesiones centralizada
            </PrivacyItem>
          </PrivacyList>
        </PrivacyFeatures>

        <PrivacyFeatures>
          <PrivacyTitle>
            <Users size={16} />
            Datos Sincronizados
          </PrivacyTitle>
          <PrivacyList>
            <PrivacyItem>
              <Globe size={16} color={theme.colors.primaryPurple} />
              Información básica del perfil
            </PrivacyItem>
            <PrivacyItem>
              <Globe size={16} color={theme.colors.primaryPurple} />
              Dirección de email principal
            </PrivacyItem>
            <PrivacyItem>
              <Globe size={16} color={theme.colors.primaryPurple} />
              Foto de perfil (si está disponible)
            </PrivacyItem>
            <PrivacyItem>
              <Globe size={16} color={theme.colors.primaryPurple} />
              Configuración de idioma/región
            </PrivacyItem>
          </PrivacyList>
        </PrivacyFeatures>

        {/* Información de Permisos Detallada */}
        {googleAccount.scope && (
          <PrivacyFeatures>
            <PrivacyTitle>
              <Lock size={16} />
              Permisos Otorgados
            </PrivacyTitle>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: theme.spacing[1],
              marginTop: theme.spacing[2]
            }}>
              {googleAccount.scope.split(' ').map((scope, index) => (
                <span
                  key={index}
                  style={{
                    background: '#4285f4' + '20',
                    color: '#4285f4',
                    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                    borderRadius: theme.borderRadius.sm,
                    fontSize: theme.fontSizes.xs,
                    fontWeight: theme.fontWeights.medium
                  }}
                >
                  {scope}
                </span>
              ))}
            </div>
          </PrivacyFeatures>
        )}
      </FeatureCard>

      {/* Recomendaciones de Seguridad */}
      {googleAccount.expiresAt && isTokenExpired(googleAccount.expiresAt) && (
        <FeatureCard>
          <FeatureTitle>
            <AlertTriangle size={20} color={theme.colors.warning} />
            Acción Requerida
          </FeatureTitle>
          <div style={{ 
            background: theme.colors.warning + '20',
            padding: theme.spacing[3],
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing[3]
          }}>
            <p style={{ 
              margin: 0, 
              color: theme.colors.warning,
              fontWeight: theme.fontWeights.medium 
            }}>
              El token de acceso de Google ha expirado. El usuario necesitará re-autenticarse.
            </p>
          </div>
          <ActionsList>
            <Button
              variant="primary"
              size="small"
              onClick={() => {
                // En una implementación real, esto redirigiría al usuario al flujo de OAuth
                alert('Redirigir al usuario al flujo de autenticación de Google');
              }}
              icon={<Unlock size={14} />}
            >
              Solicitar Re-autenticación
            </Button>
          </ActionsList>
        </FeatureCard>
      )}
    </FeaturesContainer>
  );
};

export default GoogleUserFeatures;