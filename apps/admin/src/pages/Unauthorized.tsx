import type React from 'react';
import { useNavigate } from 'react-router-dom';
import ShieldIcon from 'lucide-react/dist/esm/icons/shield';
import ArrowLeftIcon from 'lucide-react/dist/esm/icons/arrow-left';
import HomeIcon from 'lucide-react/dist/esm/icons/home';
import { Card } from '@happy-baby/shared-ui';
import { Button } from '@happy-baby/shared-ui';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-purple/10 to-background p-4'>
      <Card className='relative w-full max-w-[500px] overflow-visible text-center'>
        <div className='mx-auto mb-6 flex h-[120px] w-[120px] items-center justify-center rounded-full border-[3px] border-yellow-500 bg-gradient-to-br from-yellow-500/20 to-destructive/20'>
          <ShieldIcon size={60} className='text-yellow-500' />
        </div>

        <h1 className='mb-3 mt-0 font-heading text-4xl font-light text-foreground'>
          403
        </h1>
        <h2 className='mb-4 mt-0 font-heading text-2xl font-medium text-yellow-600'>
          Acceso Denegado
        </h2>

        <p className='mb-6 mt-0 text-lg leading-relaxed text-muted-foreground'>
          No tienes permisos para acceder a esta página. Si crees que esto es un
          error, contacta al administrador del sistema.
        </p>

        <div className='flex flex-wrap justify-center gap-3 max-sm:flex-col'>
          <Button
            variant='outline'
            size='medium'
            icon={<ArrowLeftIcon size={18} />}
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
          <Button
            variant='primary'
            size='medium'
            icon={<HomeIcon size={18} />}
            onClick={() => navigate('/')}
          >
            Ir al Inicio
          </Button>
        </div>

        <div className='mt-6 rounded-lg border border-border bg-brand-purple/5 p-3'>
          <h4 className='mb-2 mt-0 text-sm font-medium text-foreground'>
            Información del Error
          </h4>
          <p className='m-0 rounded-sm border border-border bg-white p-2 font-mono text-xs text-muted-foreground'>
            Error: 403 Forbidden
            <br />
            Timestamp: {new Date().toISOString()}
            <br />
            Path: {window.location.pathname}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Unauthorized;
