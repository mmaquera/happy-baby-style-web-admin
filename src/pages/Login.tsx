// Login Page - Following SOLID principles and Clean Architecture
// Single Responsibility: Orchestrates login components only
// Open/Closed: Extensible for new login features
// Liskov Substitution: Consistent page behavior
// Interface Segregation: No props interface needed
// Dependency Inversion: Depends on component abstractions

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from '@/components/ui/Card';
import { LoginLogo } from '@/components/auth/LoginLogo';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

// Styled Components following Single Responsibility Principle
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${theme.colors.softPurple} 0%, ${theme.colors.background.secondary} 100%);
  padding: ${theme.spacing[4]};
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;
  overflow: visible;
`;

const FooterText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
  text-align: center;
`;

// Component following Single Responsibility Principle
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isInitialized, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isInitialized, navigate, location]);

  // Clean invalid tokens on login page load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          // Invalid JWT format, clear all auth data
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          console.log('Cleared invalid tokens');
        }
      } catch (error) {
        // Error parsing token, clear all auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        console.log('Cleared malformed tokens');
      }
    }
  }, []);

  // Show loading state while initializing, but still render the form
  if (isLoading && !isInitialized) {
    return (
      <LoginContainer>
        <LoginCard shadow="large" padding="large">
          <LoginLogo />
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Inicializando...</p>
          </div>
        </LoginCard>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginCard shadow="large" padding="large">
        <LoginLogo />
        <LoginForm />
        <FooterText>
          © 2024 Happy Baby Style. Todos los derechos reservados.
        </FooterText>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 