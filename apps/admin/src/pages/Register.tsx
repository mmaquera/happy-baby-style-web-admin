import type React from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@happy-baby/shared-ui';
import { LoginLogo, RegisterForm, useAuth } from '@happy-baby/feature-auth';

export const Register: React.FC = () => {
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

  const handleRegistrationSuccess = () => {
    navigate('/login', {
      state: {
        message: 'Usuario registrado exitosamente. Por favor inicia sesión.',
      },
    });
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-purple/10 to-background p-4'>
      <Card className='relative w-full max-w-[700px] overflow-visible text-center'>
        <LoginLogo />
        {isLoading && !isInitialized ? (
          <div className='py-8 text-center text-muted-foreground'>
            Inicializando...
          </div>
        ) : (
          <RegisterForm onSuccess={handleRegistrationSuccess} />
        )}
        <button
          onClick={handleGoToLogin}
          className='mt-4 cursor-pointer rounded-sm border-none bg-transparent px-2 py-2 text-sm font-medium text-brand-purple transition-colors hover:bg-brand-purple/10 hover:text-destructive hover:underline active:scale-[0.98]'
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </button>
        <p className='m-0 text-center text-sm text-muted-foreground'>
          © 2025 Happy Baby Style. Todos los derechos reservados.
        </p>
      </Card>
    </div>
  );
};

export default Register;
