import type React from 'react';

interface LoginLogoProps {
  size?: 'lg' | 'md';
}

export const LoginLogo: React.FC<LoginLogoProps> = ({ size = 'md' }) => {
  const isLg = size === 'lg';

  const badgeClass = isLg
    ? 'w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple to-[#8E6FC2] flex items-center justify-center shadow-[var(--shadow-brand-lg)] shrink-0'
    : 'w-12 h-12 rounded-xl bg-gradient-to-br from-brand-purple to-[#8E6FC2] flex items-center justify-center shadow-[var(--shadow-brand-md)] shrink-0';

  const badgeTextClass = isLg
    ? 'font-heading font-bold text-[22px] tracking-[-0.02em] text-white select-none'
    : 'font-heading font-bold text-[16px] tracking-[-0.02em] text-white select-none';

  const wordmarkClass = isLg
    ? 'font-heading font-bold text-[24px] text-foreground leading-tight'
    : 'font-heading font-bold text-[18px] text-foreground leading-tight';

  const subTextClass = isLg
    ? 'font-sans font-normal text-[11px] uppercase tracking-widest text-muted-foreground'
    : 'font-sans font-normal text-[10px] uppercase tracking-widest text-muted-foreground';

  return (
    <div className='flex items-center gap-3'>
      <div className={badgeClass} aria-hidden='true'>
        <span className={badgeTextClass}>HB</span>
      </div>
      <div className='flex flex-col'>
        <span className={wordmarkClass}>Happy Baby</span>
        <span className={subTextClass}>Admin</span>
      </div>
    </div>
  );
};

export default LoginLogo;
