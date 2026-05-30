import type React from 'react';
import BabyIcon from 'lucide-react/dist/esm/icons/baby';

export const LoginLogo: React.FC = () => {
  return (
    <div className='mb-6 flex items-center justify-center'>
      <div className='text-center'>
        <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-[#FF6B6B] shadow-lg'>
          <BabyIcon size={40} className='text-white' />
        </div>
        <h1 className='font-heading m-0 mb-1 text-3xl font-light text-foreground'>
          Happy Baby Style
        </h1>
        <p className='m-0 text-lg font-normal text-muted-foreground'>
          Panel de Administración
        </p>
      </div>
    </div>
  );
};

export default LoginLogo;
