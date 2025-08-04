import React from 'react';
import styled from 'styled-components';
import { Clock, User, Shield } from 'lucide-react';
import { theme } from '@/styles/theme';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Types
interface SessionInfoProps {
  className?: string;
}

// Styled Components
const SessionInfoContainer = styled.div`
  background: ${theme.colors.background.accent};
  border: 1px solid ${theme.colors.border.accent}20;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
`;

const SessionTitle = styled.h4`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[3]} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const SessionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const SessionItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const SessionLabel = styled.span`
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  min-width: 80px;
`;

const SessionValue = styled.span`
  color: ${theme.colors.text.secondary};
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
          background: ${theme.colors.primaryPurple}20;
          color: ${theme.colors.primaryPurple};
          border: 1px solid ${theme.colors.primaryPurple}30;
        `;
      case 'manager':
        return `
          background: ${theme.colors.turquoise}20;
          color: ${theme.colors.turquoise};
          border: 1px solid ${theme.colors.turquoise}30;
        `;
      default:
        return `
          background: ${theme.colors.warmGray}20;
          color: ${theme.colors.warmGray};
          border: 1px solid ${theme.colors.warmGray}30;
        `;
    }
  }}
`;

// Component
export const SessionInfo: React.FC<SessionInfoProps> = ({ className }) => {
  const { user } = useAuth();
  const [sessionStart] = React.useState(new Date());

  if (!user) {
    return null;
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      case 'editor':
        return 'Editor';
      default:
        return 'Usuario';
    }
  };

  return (
    <SessionInfoContainer className={className}>
      <SessionTitle>
        <Shield size={20} />
        Información de Sesión
      </SessionTitle>
      
      <SessionDetails>
        <SessionItem>
          <User size={16} />
          <SessionLabel>Usuario:</SessionLabel>
          <SessionValue>{user.name}</SessionValue>
        </SessionItem>
        
        <SessionItem>
          <SessionLabel>Email:</SessionLabel>
          <SessionValue>{user.email}</SessionValue>
        </SessionItem>
        
        <SessionItem>
          <SessionLabel>Rol:</SessionLabel>
          <RoleBadge role={user.role}>
            <Shield size={12} />
            {getRoleLabel(user.role)}
          </RoleBadge>
        </SessionItem>
        
        <SessionItem>
          <Clock size={16} />
          <SessionLabel>Sesión:</SessionLabel>
          <SessionValue>
            {formatDistanceToNow(sessionStart, { 
              addSuffix: true, 
              locale: es 
            })}
          </SessionValue>
        </SessionItem>
      </SessionDetails>
    </SessionInfoContainer>
  );
};

export default SessionInfo; 