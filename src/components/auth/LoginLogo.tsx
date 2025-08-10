// LoginLogo Component - Following SOLID principles and Clean Architecture
// Single Responsibility: Renders login logo and branding only
// Open/Closed: Extensible for new logo variations
// Liskov Substitution: Consistent logo behavior
// Interface Segregation: No props interface needed
// Dependency Inversion: Self-contained component

import React from 'react';
import styled from 'styled-components';
import { Baby } from 'lucide-react';
import { theme } from '@/styles/theme';

// Styled Components following Single Responsibility Principle
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing[6]};
`;

const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${theme.colors.primaryPurple}, ${theme.colors.coralAccent});
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing[4]};
  box-shadow: ${theme.shadows.accent};
  
  svg {
    width: 40px;
    height: 40px;
    color: ${theme.colors.white};
  }
`;

const BrandTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.light};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[1]} 0;
`;

const BrandSubtitle = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
  font-weight: ${theme.fontWeights.normal};
`;

// Component following Single Responsibility Principle
export const LoginLogo: React.FC = () => {
  return (
    <LogoContainer>
      <div>
        <LogoIcon>
          <Baby />
        </LogoIcon>
        <BrandTitle>Happy Baby Style</BrandTitle>
        <BrandSubtitle>Panel de Administración</BrandSubtitle>
      </div>
    </LogoContainer>
  );
};

export default LoginLogo;
