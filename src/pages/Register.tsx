// Register Page - Following SOLID principles and Clean Architecture
// Single Responsibility: Orchestrates registration components only
// Open/Closed: Extensible for new registration features
// Liskov Substitution: Consistent page behavior
// Interface Segregation: No props interface needed
// Dependency Inversion: Depends on component abstractions

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from '@/components/ui/Card';
import { LoginLogo } from '@/components/auth/LoginLogo';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';

// Styled Components following Single Responsibility Principle
const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${theme.colors.softPurple} 0%, ${theme.colors.background.secondary} 100%);
  padding: ${theme.spacing[4]};
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 700px;
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

const LoginLink = styled.button`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.primary};
  text-decoration: none;
  font-weight: ${theme.fontWeights.medium};
  transition: color ${theme.transitions.fast};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  margin-top: ${theme.spacing[4]};

  &:hover {
    color: ${theme.colors.coralAccent};
    text-decoration: underline;
    background: ${theme.colors.background.accent};
  }

  &:active {
    transform: scale(0.98);
  }
`;

// Component following Single Responsibility Principle
export const Register: React.FC = () => {
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

  // Clean invalid tokens on register page load
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
      <RegisterContainer>
        <RegisterCard shadow="large" padding="large">
          <LoginLogo />
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Inicializando...</p>
          </div>
        </RegisterCard>
      </RegisterContainer>
    );
  }

  const handleRegistrationSuccess = () => {
    // Redirect to login page after successful registration
    navigate('/login', { 
      state: { 
        message: 'Usuario registrado exitosamente. Por favor inicia sesión.' 
      } 
    });
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <RegisterContainer>
      <RegisterCard shadow="large" padding="large">
        <LoginLogo />
        <RegisterForm onSuccess={handleRegistrationSuccess} />
        <LoginLink onClick={handleGoToLogin}>
          ¿Ya tienes una cuenta? Inicia sesión
        </LoginLink>
        <FooterText>
          © 2025 Happy Baby Style. Todos los derechos reservados.
        </FooterText>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
