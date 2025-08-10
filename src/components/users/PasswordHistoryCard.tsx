import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { 
  Key,
  RefreshCw,
  Lock,
  Clock,
  CheckCircle,
  AlertTriangle,
  Shield
} from 'lucide-react';

interface PasswordAction {
  id: string;
  type: 'reset' | 'temporary' | 'admin_set' | 'user_change';
  timestamp: Date;
  description: string;
  adminUser?: string;
  status: 'completed' | 'pending' | 'failed';
}

interface PasswordHistoryCardProps {
  actions: PasswordAction[];
}

// Styled Components
const Card = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`;

const Title = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const ActionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const ActionItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]};
  background: ${theme.colors.background.light};
  border-radius: ${theme.borderRadius.md};
  border-left: 3px solid ${theme.colors.primaryPurple};
`;

const ActionIcon = styled.div<{ type: PasswordAction['type'] }>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.type) {
      case 'reset': return `${theme.colors.warning}20`;
      case 'temporary': return `${theme.colors.info}20`;
      case 'admin_set': return `${theme.colors.error}20`;
      case 'user_change': return `${theme.colors.success}20`;
      default: return `${theme.colors.primaryPurple}20`;
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'reset': return theme.colors.warning;
      case 'temporary': return theme.colors.info;
      case 'admin_set': return theme.colors.error;
      case 'user_change': return theme.colors.success;
      default: return theme.colors.primaryPurple;
    }
  }};
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionDescription = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const ActionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
`;

const StatusBadge = styled.div<{ status: 'completed' | 'pending' | 'failed' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  background: ${props => {
    switch (props.status) {
      case 'completed': return `${theme.colors.success}20`;
      case 'pending': return `${theme.colors.warning}20`;
      case 'failed': return `${theme.colors.error}20`;
      default: return theme.colors.background.light;
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'failed': return theme.colors.error;
      default: return theme.colors.text.secondary;
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[6]};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
`;

// Helper Functions
const getActionIcon = (type: PasswordAction['type']) => {
  switch (type) {
    case 'reset':
      return <RefreshCw size={16} />;
    case 'temporary':
      return <Key size={16} />;
    case 'admin_set':
      return <Lock size={16} />;
    case 'user_change':
      return <Shield size={16} />;
    default:
      return <Key size={16} />;
  }
};

const getStatusIcon = (status: PasswordAction['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={12} />;
    case 'pending':
      return <Clock size={12} />;
    case 'failed':
      return <AlertTriangle size={12} />;
    default:
      return <Clock size={12} />;
  }
};

const formatTimestamp = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Component
export const PasswordHistoryCard: React.FC<PasswordHistoryCardProps> = ({
  actions
}) => {
  return (
    <Card>
      <Header>
        <Key size={20} />
        <Title>Historial de Contraseñas</Title>
      </Header>

      {actions.length > 0 ? (
        <ActionsList>
          {actions.map((action) => (
            <ActionItem key={action.id}>
              <ActionIcon type={action.type}>
                {getActionIcon(action.type)}
              </ActionIcon>
              
              <ActionContent>
                <ActionDescription>
                  {action.description}
                </ActionDescription>
                <ActionMeta>
                  <Clock size={12} />
                  {formatTimestamp(action.timestamp)}
                  {action.adminUser && (
                    <>
                      • Administrador: {action.adminUser}
                    </>
                  )}
                </ActionMeta>
              </ActionContent>

              <StatusBadge status={action.status}>
                {getStatusIcon(action.status)}
                {action.status === 'completed' ? 'Completado' :
                 action.status === 'pending' ? 'Pendiente' : 'Fallido'}
              </StatusBadge>
            </ActionItem>
          ))}
        </ActionsList>
      ) : (
        <EmptyState>
          No hay acciones de contraseña registradas para este usuario
        </EmptyState>
      )}
    </Card>
  );
};

export default PasswordHistoryCard;