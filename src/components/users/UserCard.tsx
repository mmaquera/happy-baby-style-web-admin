import React from 'react';
import styled from 'styled-components';
import { Card } from '@/components/ui/Card';
import { theme } from '@/styles/theme';

const StyledCard = styled(Card)`
  padding: ${theme.spacing[4]};
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid ${theme.colors.border.light};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

interface UserCardProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ children, onClick }) => {
  return (
    <StyledCard onClick={onClick}>
      {children}
    </StyledCard>
  );
};
