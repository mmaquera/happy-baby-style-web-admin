import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { theme } from '@/styles/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Styled Components
const UnauthorizedContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${theme.colors.softPurple} 0%, ${theme.colors.background.secondary} 100%);
  padding: ${theme.spacing[4]};
`;

const UnauthorizedCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  text-align: center;
  position: relative;
  overflow: visible;
`;

const IconContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${theme.colors.warning}20, ${theme.colors.error}20);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing[6]} auto;
  border: 3px solid ${theme.colors.warning};
  
  svg {
    width: 60px;
    height: 60px;
    color: ${theme.colors.warning};
  }
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  font-weight: ${theme.fontWeights.light};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[3]} 0;
`;

const Subtitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.warning};
  margin: 0 0 ${theme.spacing[4]} 0;
`;

const Description = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing[6]} 0;
  line-height: 1.6;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const ErrorCode = styled.div`
  background: ${theme.colors.background.accent};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]};
  margin-top: ${theme.spacing[6]};
  border: 1px solid ${theme.colors.border.accent}20;
`;

const ErrorCodeTitle = styled.h4`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const ErrorCodeText = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  margin: 0;
  font-family: 'Courier New', monospace;
  background: ${theme.colors.white};
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border.light};
`;

// Component
export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <UnauthorizedContainer>
      <UnauthorizedCard shadow="large" padding="large">
        <IconContainer>
          <Shield />
        </IconContainer>

        <Title>403</Title>
        <Subtitle>Acceso Denegado</Subtitle>
        
        <Description>
          No tienes permisos para acceder a esta página. 
          Si crees que esto es un error, contacta al administrador del sistema.
        </Description>

        <ActionsContainer>
          <Button
            variant="outline"
            size="medium"
            icon={<ArrowLeft size={18} />}
            onClick={handleGoBack}
          >
            Volver
          </Button>
          
          <Button
            variant="primary"
            size="medium"
            icon={<Home size={18} />}
            onClick={handleGoHome}
          >
            Ir al Inicio
          </Button>
        </ActionsContainer>

        <ErrorCode>
          <ErrorCodeTitle>Información del Error</ErrorCodeTitle>
          <ErrorCodeText>
            Error: 403 Forbidden<br />
            Timestamp: {new Date().toISOString()}<br />
            Path: {window.location.pathname}
          </ErrorCodeText>
        </ErrorCode>
      </UnauthorizedCard>
    </UnauthorizedContainer>
  );
};

export default Unauthorized; 