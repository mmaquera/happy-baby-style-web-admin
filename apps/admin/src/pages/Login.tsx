import type React from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@happy-baby/shared-ui';
import { LoginLogo, LoginForm, useAuth } from '@happy-baby/feature-auth';
import { logger } from '@happy-baby/infrastructure-monitoring';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isInitialized, isLoading } = useAuth();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const from =
        (location.state as { from?: { pathname?: string } })?.from?.pathname ||
        '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isInitialized, navigate, location]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          logger.debug('Cleared invalid tokens');
        }
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        logger.debug('Cleared malformed tokens');
      }
    }
  }, []);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-purple/10 to-background p-4'>
      <Card className='relative w-full max-w-[400px] overflow-visible text-center'>
        <LoginLogo />
        {isLoading && !isInitialized ? (
          <div className='py-8 text-center text-muted-foreground'>
            Inicializando...
          </div>
        ) : (
          <LoginForm />
        )}
        <p className='m-0 text-center text-sm text-muted-foreground'>
          © 2025 Happy Baby Style. Todos los derechos reservados.
        </p>
      </Card>
    </div>
  );
};

export default Login;
