import React, { useState } from 'react';
import styled from 'styled-components';
import { User } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserAuthAccounts } from './UserAuthAccounts';
import { UserSessionsManager } from './UserSessionsManager';
import { GoogleUserFeatures } from './GoogleUserFeatures';
import { useUserSessions } from '@/hooks/useAuthManagement';
import { AuthProvider } from '@/types';
import { theme } from '@/styles/theme';
import { 
  X,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User as UserIcon,
  Shield,
  CheckCircle,
  XCircle,
  Key,
  Activity,
  AtSign
} from 'lucide-react';

interface UserDetailModalProps {
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
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
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

const UserAvatar = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${theme.colors.primaryPurple}10;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primaryPurple};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[6]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: ${theme.colors.background.light};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
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

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[3]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoIcon = styled.div`
  color: ${theme.colors.text.secondary};
  min-width: 20px;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing[1]};
`;

const InfoValue = styled.div`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.fontWeights.medium};
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' | 'verified' | 'unverified' }>`
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
      case 'active':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'inactive':
        return `
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      case 'verified':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'unverified':
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      default:
        return `
          background: ${theme.colors.text.secondary}20;
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const RoleBadge = styled.span<{ role: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ role }) => {
    switch (role) {
      case 'admin':
        return `
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      case 'staff':
        return `
          background: ${theme.colors.coralAccent}20;
          color: ${theme.colors.coralAccent};
        `;
      default:
        return `
          background: ${theme.colors.primaryPurple}20;
          color: ${theme.colors.primaryPurple};
        `;
    }
  }}
`;

const AddressList = styled.div`
  margin-top: ${theme.spacing[3]};
`;

const AddressItem = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[2]};
  border-left: 3px solid ${theme.colors.primaryPurple};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const AddressTitle = styled.div`
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const AddressText = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.4;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.border.light};
  margin-bottom: ${theme.spacing[4]};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: none;
  background: none;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  
  ${({ active }) => active ? `
    color: ${theme.colors.primaryPurple};
    border-bottom: 2px solid ${theme.colors.primaryPurple};
  ` : `
    color: ${theme.colors.text.secondary};
    
    &:hover {
      color: ${theme.colors.text.primary};
    }
  `}
`;

const TabContent = styled.div`
  min-height: 200px;
`;

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'auth' | 'sessions' | 'google-features'>('general');
  const { sessions, loading: sessionsLoading, refetch: refetchSessions } = useUserSessions(user.id);
  
  // Verificar si el usuario tiene cuenta de Google
  const hasGoogleAccount = user.accounts?.some(account => account.provider === AuthProvider.GOOGLE);
  
  if (!isOpen) return null;

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'staff': return 'Personal';
      case 'customer': return 'Cliente';
      default: return role;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <UserAvatar>
              {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}
            </UserAvatar>
            Detalles del Usuario
          </ModalTitle>
          <Button
            variant="ghost"
            size="small"
            onClick={onClose}
            icon={<X size={20} />}
          >
          </Button>
        </ModalHeader>

        {/* Tabs Navigation */}
        <TabsContainer>
          <Tab 
            active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')}
          >
            <UserIcon size={16} />
            Información General
          </Tab>
          <Tab 
            active={activeTab === 'auth'} 
            onClick={() => setActiveTab('auth')}
          >
            <Key size={16} />
            Autenticación
          </Tab>
          <Tab 
            active={activeTab === 'sessions'} 
            onClick={() => setActiveTab('sessions')}
          >
            <Activity size={16} />
            Sesiones
          </Tab>
          {hasGoogleAccount && (
            <Tab 
              active={activeTab === 'google-features'} 
              onClick={() => setActiveTab('google-features')}
            >
              🔍
              Google
            </Tab>
          )}
        </TabsContainer>

        {/* Tab Content */}
        <TabContent>
          {activeTab === 'general' && (
            <>
              <ContentGrid>
                {/* User Information */}
                <Section>
                  <SectionTitle>
                    <UserIcon size={20} />
                    Información Personal
                  </SectionTitle>
                  
                  <InfoItem>
                    <InfoIcon>
                      <UserIcon size={16} />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Nombre Completo</InfoLabel>
                      <InfoValue>
                        {user.profile?.firstName && user.profile?.lastName 
                          ? `${user.profile.firstName} ${user.profile.lastName}`
                          : 'No especificado'
                        }
                      </InfoValue>
                    </InfoContent>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <AtSign size={16} />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Email</InfoLabel>
                      <InfoValue>{user.email}</InfoValue>
                    </InfoContent>
                  </InfoItem>

                  {user.profile?.phone && (
                    <InfoItem>
                      <InfoIcon>
                        <Phone size={16} />
                      </InfoIcon>
                      <InfoContent>
                        <InfoLabel>Teléfono</InfoLabel>
                        <InfoValue>{user.profile.phone}</InfoValue>
                      </InfoContent>
                    </InfoItem>
                  )}

                  {user.profile?.birthDate && (
                    <InfoItem>
                      <InfoIcon>
                        <Calendar size={16} />
                      </InfoIcon>
                      <InfoContent>
                        <InfoLabel>Fecha de Nacimiento</InfoLabel>
                        <InfoValue>{formatDate(user.profile.birthDate)}</InfoValue>
                      </InfoContent>
                    </InfoItem>
                  )}

                  <InfoItem>
                    <InfoIcon>
                      <Calendar size={16} />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Fecha de Registro</InfoLabel>
                      <InfoValue>{formatDate(user.createdAt)}</InfoValue>
                    </InfoContent>
                  </InfoItem>

                  {user.lastLoginAt && (
                    <InfoItem>
                      <InfoIcon>
                        <Activity size={16} />
                      </InfoIcon>
                      <InfoContent>
                        <InfoLabel>Último Acceso</InfoLabel>
                        <InfoValue>{formatDate(user.lastLoginAt)}</InfoValue>
                      </InfoContent>
                    </InfoItem>
                  )}
                </Section>

                {/* Account Status */}
                <Section>
                  <SectionTitle>
                    <Shield size={20} />
                    Estado de la Cuenta
                  </SectionTitle>
                  
                  <InfoItem>
                    <InfoIcon>
                      <Shield size={16} />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Rol</InfoLabel>
                      <InfoValue>
                        <RoleBadge role={user.role}>
                          {getRoleLabel(user.role)}
                        </RoleBadge>
                      </InfoValue>
                    </InfoContent>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      {user.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Estado</InfoLabel>
                      <InfoValue>
                        <StatusBadge status={user.isActive ? 'active' : 'inactive'}>
                          {user.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </StatusBadge>
                      </InfoValue>
                    </InfoContent>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      {user.emailVerified ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Email Verificado</InfoLabel>
                      <InfoValue>
                        <StatusBadge status={user.emailVerified ? 'verified' : 'unverified'}>
                          {user.emailVerified ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {user.emailVerified ? 'Verificado' : 'No Verificado'}
                        </StatusBadge>
                      </InfoValue>
                    </InfoContent>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <Calendar size={16} />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Última Actualización</InfoLabel>
                      <InfoValue>{formatDate(user.updatedAt)}</InfoValue>
                    </InfoContent>
                  </InfoItem>
                </Section>
              </ContentGrid>

              {/* Addresses */}
              {user.addresses && user.addresses.length > 0 && (
                <Section>
                  <SectionTitle>
                    <MapPin size={20} />
                    Direcciones ({user.addresses.length})
                  </SectionTitle>
                  
                  <AddressList>
                    {user.addresses.map((address) => (
                      <AddressItem key={address.id}>
                        <AddressTitle>
                          {address.title}
                          {address.isDefault && (
                            <StatusBadge status="active" style={{ marginLeft: theme.spacing[2] }}>
                              Predeterminada
                            </StatusBadge>
                          )}
                        </AddressTitle>
                        <AddressText>
                          {address.firstName} {address.lastName}<br />
                          {address.addressLine1}<br />
                          {address.addressLine2 && <>{address.addressLine2}<br /></>}
                          {address.city}, {address.state} {address.postalCode}<br />
                          {address.country}
                        </AddressText>
                      </AddressItem>
                    ))}
                  </AddressList>
                </Section>
              )}
            </>
          )}

          {activeTab === 'auth' && (
            <Section>
              <SectionTitle>
                <Key size={20} />
                Cuentas de Autenticación
              </SectionTitle>
              <UserAuthAccounts 
                accounts={user.accounts || []} 
                onAccountUnlinked={() => {
                  // Refresh user data when account is unlinked
                }} 
              />
            </Section>
          )}

          {activeTab === 'sessions' && (
            <Section>
              <SectionTitle>
                <Activity size={20} />
                Gestión de Sesiones
              </SectionTitle>
              <UserSessionsManager 
                userId={user.id}
                sessions={sessions}
                onSessionRevoked={refetchSessions}
              />
            </Section>
          )}

          {activeTab === 'google-features' && hasGoogleAccount && (
            <GoogleUserFeatures 
              user={user}
              onUserUpdated={() => {
                // Refresh user data when needed
              }}
            />
          )}
        </TabContent>
      </ModalContent>
    </Modal>
  );
};

export default UserDetailModal;