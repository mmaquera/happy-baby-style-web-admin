import type React from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import { LoginLogo, LoginForm, useAuth } from '@happy-baby/feature-auth';

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

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='animate-[loginFadeIn_400ms_ease-out_both] w-full max-w-5xl rounded-3xl overflow-hidden shadow-[var(--shadow-brand-xl)] grid md:grid-cols-[55fr_45fr]'>
        {/* Hero panel — oculto en mobile */}
        <aside
          aria-hidden='true'
          className='hidden md:flex flex-col justify-center p-12 xl:p-16 relative overflow-hidden bg-gradient-to-br from-brand-purple/15 via-brand-turquoise/[0.08] to-brand-coral/10'
        >
          {/* Blobs decorativos SVG */}
          <svg
            aria-hidden='true'
            className='pointer-events-none absolute bottom-0 left-0 w-[480px] opacity-80'
            viewBox='0 0 480 400'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <ellipse
              cx='200'
              cy='300'
              rx='240'
              ry='200'
              fill='rgba(162,133,209,0.12)'
            />
          </svg>
          <svg
            aria-hidden='true'
            className='pointer-events-none absolute right-0 top-0 w-[360px] opacity-80'
            viewBox='0 0 360 440'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <ellipse
              cx='200'
              cy='180'
              rx='180'
              ry='220'
              fill='rgba(92,189,180,0.10)'
            />
          </svg>

          {/* Logo + wordmark */}
          <div className='relative z-10 mb-8'>
            <LoginLogo size='lg' />
          </div>

          {/* Tagline */}
          <p className='relative z-10 font-heading font-light text-[20px] text-foreground/70 max-w-xs leading-relaxed mb-8'>
            Tu panel de gestión, diseñado para crecer con tu negocio.
          </p>

          {/* Bullets */}
          <ul className='relative z-10 flex flex-col gap-3 list-none'>
            {[
              'Gestión inteligente de productos',
              'Inventario en tiempo real',
              'Reportes y métricas claras',
            ].map(item => (
              <li
                key={item}
                className='flex items-center gap-2 font-sans text-[15px] text-foreground/60'
              >
                <CheckCircleIcon
                  size={16}
                  className='shrink-0 text-brand-turquoise'
                />
                {item}
              </li>
            ))}
          </ul>
        </aside>

        {/* Form panel */}
        <main className='bg-card flex flex-col justify-center px-6 py-8 md:px-10 md:py-12'>
          {/* Logo mark centrado — visible en todos los tamaños */}
          <div className='flex justify-center mb-6'>
            <LoginLogo size='md' />
          </div>

          {isLoading && !isInitialized ? (
            <div className='py-8 text-center text-muted-foreground'>
              Inicializando...
            </div>
          ) : (
            <LoginForm />
          )}

          <p className='text-xs text-muted-foreground/60 mt-8 text-center'>
            © 2025 Happy Baby Style. Todos los derechos reservados.
          </p>
        </main>
      </div>
    </div>
  );
};

export default Login;
