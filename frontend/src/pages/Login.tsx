import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Eye, EyeOff, Lock, Mail, Baby } from 'lucide-react';
import { theme } from '@/styles/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

// Types
interface LoginFormData {
  email: string;
  password: string;
}

// Styled Components
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

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const FormTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const FormSubtitle = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing[4]} 0;
`;

const PasswordInputWrapper = styled.div`
  position: relative;
`;

const PasswordToggleButton = styled.button`
  position: absolute;
  right: ${theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${theme.colors.warmGray};
  cursor: pointer;
  padding: ${theme.spacing[1]};
  border-radius: ${theme.borderRadius.sm};
  transition: all ${theme.transitions.fast};
  z-index: 10;

  &:hover {
    color: ${theme.colors.primaryPurple};
    background: ${theme.colors.background.accent};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primaryPurple}20;
  }
`;

const ForgotPasswordLink = styled.a`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.primaryPurple};
  text-decoration: none;
  font-weight: ${theme.fontWeights.medium};
  transition: color ${theme.transitions.fast};
  align-self: flex-end;
  margin-top: -${theme.spacing[2]};

  &:hover {
    color: ${theme.colors.coralAccent};
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${theme.spacing[4]} 0;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${theme.colors.border.light};
  }

  span {
    padding: 0 ${theme.spacing[3]};
  }
`;

const DemoCredentials = styled.div`
  background: ${theme.colors.background.accent};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]};
  margin-top: ${theme.spacing[4]};
  border: 1px solid ${theme.colors.border.accent}20;
`;

const DemoTitle = styled.h4`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const DemoText = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const FooterText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
  text-align: center;
`;

// Component
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const success = await login(data);
      
      if (success) {
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setValue('email', 'admin@happybabystyle.com');
    setValue('password', 'admin123');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginContainer>
      <LoginCard shadow="large" padding="large">
        <LogoContainer>
          <div>
            <LogoIcon>
              <Baby />
            </LogoIcon>
            <BrandTitle>Happy Baby Style</BrandTitle>
            <BrandSubtitle>Panel de Administración</BrandSubtitle>
          </div>
        </LogoContainer>

        <FormTitle>Iniciar Sesión</FormTitle>
        <FormSubtitle>
          Ingresa tus credenciales para acceder al panel de administración
        </FormSubtitle>

        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="admin@happybabystyle.com"
            leftIcon={<Mail size={18} />}
            fullWidth
            {...register('email', {
              required: 'El correo electrónico es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Ingresa un correo electrónico válido',
              },
            })}
            error={errors.email?.message}
          />

          <PasswordInputWrapper>
            <Input
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              fullWidth
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              })}
              error={errors.password?.message}
            />
            <PasswordToggleButton
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </PasswordToggleButton>
          </PasswordInputWrapper>

          <ForgotPasswordLink href="#" onClick={(e) => e.preventDefault()}>
            ¿Olvidaste tu contraseña?
          </ForgotPasswordLink>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            isLoading={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </FormContainer>

        <Divider>
          <span>o</span>
        </Divider>

        <Button
          variant="outline"
          size="medium"
          fullWidth
          onClick={handleDemoLogin}
        >
          Usar Credenciales de Demo
        </Button>

        <DemoCredentials>
          <DemoTitle>Credenciales de Demo</DemoTitle>
          <DemoText>
            Email: admin@happybabystyle.com<br />
            Contraseña: admin123
          </DemoText>
        </DemoCredentials>

        <FooterText>
          © 2024 Happy Baby Style. Todos los derechos reservados.
        </FooterText>
      </LoginCard>
    </LoginContainer>
  );
};



export default Login; 