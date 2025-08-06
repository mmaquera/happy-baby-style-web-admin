import React from 'react';
import styled from 'styled-components';
import { UserAccount, AuthProvider } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { theme } from '@/styles/theme';
import { useAccountManagement, useProviderUtils } from '@/hooks/useAuthManagement';
import { 
  Unlink,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface UserAuthAccountsProps {
  accounts: UserAccount[];
  onAccountUnlinked?: () => void;
}

// Styled Components
const AccountsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const AccountCard = styled(Card)<{ provider: AuthProvider }>`
  padding: ${theme.spacing[4]};
  border-left: 4px solid ${props => getProviderBorderColor(props.provider)};
  transition: all ${theme.transitions.base};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }
`;

const AccountHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${theme.spacing[3]};
`;

const ProviderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const ProviderIcon = styled.div<{ provider: AuthProvider }>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.md};
  background-color: ${props => getProviderBorderColor(props.provider)}20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.lg};
`;

const ProviderName = styled.div`
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
`;

const AccountDetails = styled.div`
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
`;

const StatusBadge = styled.span<{ isExpired: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ isExpired }) => {
    if (isExpired) {
      return `
        background: ${theme.colors.error}20;
        color: ${theme.colors.error};
      `;
    } else {
      return `
        background: ${theme.colors.success}20;
        color: ${theme.colors.success};
      `;
    }
  }}
`;

const AccountActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing[2]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.text.secondary};
`;

// Helper function
const getProviderBorderColor = (provider: AuthProvider) => {
  switch (provider) {
    case AuthProvider.GOOGLE:
      return '#4285f4';
    case AuthProvider.FACEBOOK:
      return '#1877f2';
    case AuthProvider.APPLE:
      return '#000000';
    case AuthProvider.EMAIL:
      return theme.colors.primaryPurple;
    default:
      return theme.colors.border.light;
  }
};

export const UserAuthAccounts: React.FC<UserAuthAccountsProps> = ({ 
  accounts, 
  onAccountUnlinked 
}) => {
  const { loading, unlinkAccount } = useAccountManagement();
  const { getProviderLabel, getProviderIcon } = useProviderUtils();

  const handleUnlinkAccount = async (account: UserAccount) => {
    const result = await unlinkAccount(account.id, getProviderLabel(account.provider));
    if (result?.success && onAccountUnlinked) {
      onAccountUnlinked();
    }
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

  const isTokenExpired = (expiresAt?: Date) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  if (accounts.length === 0) {
    return (
      <EmptyState>
        <Shield size={48} color={theme.colors.text.secondary} />
        <h3>Sin cuentas vinculadas</h3>
        <p>Este usuario no tiene cuentas de redes sociales vinculadas</p>
      </EmptyState>
    );
  }

  return (
    <AccountsContainer>
      {accounts.map((account) => (
        <AccountCard key={account.id} provider={account.provider}>
          <AccountHeader>
            <ProviderInfo>
              <ProviderIcon provider={account.provider}>
                {getProviderIcon(account.provider)}
              </ProviderIcon>
              <div>
                <ProviderName>{getProviderLabel(account.provider)}</ProviderName>
                <DetailValue>ID: {account.providerAccountId}</DetailValue>
              </div>
            </ProviderInfo>
            
            <AccountActions>
              {account.provider !== AuthProvider.EMAIL && (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleUnlinkAccount(account)}
                  disabled={loading}
                  icon={<Unlink size={14} />}
                >
                  Desvincular
                </Button>
              )}
            </AccountActions>
          </AccountHeader>

          <AccountDetails>
            <DetailItem>
              <DetailLabel>Estado del Token</DetailLabel>
              <DetailValue>
                <StatusBadge isExpired={isTokenExpired(account.expiresAt)}>
                  {isTokenExpired(account.expiresAt) ? (
                    <>
                      <XCircle size={12} />
                      Expirado
                    </>
                  ) : (
                    <>
                      <CheckCircle size={12} />
                      Válido
                    </>
                  )}
                </StatusBadge>
              </DetailValue>
            </DetailItem>

            <DetailItem>
              <DetailLabel>Fecha de Vinculación</DetailLabel>
              <DetailValue>{formatDate(account.createdAt)}</DetailValue>
            </DetailItem>

            {account.expiresAt && (
              <DetailItem>
                <DetailLabel>Expira</DetailLabel>
                <DetailValue>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[1] }}>
                    <Clock size={12} />
                    {formatDate(account.expiresAt)}
                  </div>
                </DetailValue>
              </DetailItem>
            )}

            <DetailItem>
              <DetailLabel>Tipo de Token</DetailLabel>
              <DetailValue>{account.tokenType || 'Bearer'}</DetailValue>
            </DetailItem>
          </AccountDetails>

          {account.scope && (
            <DetailItem>
              <DetailLabel>Permisos</DetailLabel>
              <DetailValue>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: theme.spacing[1],
                  marginTop: theme.spacing[1]
                }}>
                  {account.scope.split(' ').map((scope, index) => (
                    <span
                      key={index}
                      style={{
                        background: theme.colors.background.light,
                        padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                        borderRadius: theme.borderRadius.sm,
                        fontSize: theme.fontSizes.xs,
                        color: theme.colors.text.secondary
                      }}
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </DetailValue>
            </DetailItem>
          )}

          {isTokenExpired(account.expiresAt) && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: theme.spacing[2],
              padding: theme.spacing[2],
              background: theme.colors.warning + '20',
              borderRadius: theme.borderRadius.md,
              marginTop: theme.spacing[2]
            }}>
              <AlertTriangle size={16} color={theme.colors.warning} />
              <span style={{ 
                fontSize: theme.fontSizes.sm, 
                color: theme.colors.warning 
              }}>
                El token de acceso ha expirado. El usuario necesitará re-autenticarse.
              </span>
            </div>
          )}
        </AccountCard>
      ))}
    </AccountsContainer>
  );
};

export default UserAuthAccounts;