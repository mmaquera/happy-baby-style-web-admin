import type React from 'react';
import UnlinkIcon from 'lucide-react/dist/esm/icons/unlink';
import ClockIcon from 'lucide-react/dist/esm/icons/clock';
import ShieldIcon from 'lucide-react/dist/esm/icons/shield';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import XCircleIcon from 'lucide-react/dist/esm/icons/x-circle';
import { cn } from '@/lib/utils';
import { type UserAccount, AuthProvider } from '@/types/unified';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  useAccountManagement,
  useProviderUtils,
} from '@/hooks/useAuthManagement';

interface UserAuthAccountsProps {
  accounts: UserAccount[];
  onAccountUnlinked?: () => void;
}

const getProviderBorderColor = (provider: AuthProvider): string => {
  switch (provider) {
    case AuthProvider.google:
      return '#4285f4';
    case AuthProvider.facebook:
      return '#1877f2';
    case AuthProvider.apple:
      return '#000000';
    case AuthProvider.email:
      return 'var(--color-brand-purple)';
    default:
      return 'var(--color-border)';
  }
};

const formatDate = (date: Date | string | number) => {
  if (!date) return 'N/A';
  const d = typeof date === 'number' ? new Date(date * 1000) : new Date(date);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const isTokenExpired = (expiresAt?: string | null) =>
  expiresAt ? new Date() > new Date(expiresAt) : false;

export const UserAuthAccounts: React.FC<UserAuthAccountsProps> = ({
  accounts,
  onAccountUnlinked,
}) => {
  const { loading, unlinkAccount } = useAccountManagement();
  const { getProviderLabel, getProviderIcon } = useProviderUtils();

  const handleUnlinkAccount = async (account: UserAccount) => {
    const result = await unlinkAccount(
      account.id,
      getProviderLabel(account.provider)
    );
    if (result?.success && onAccountUnlinked) onAccountUnlinked();
  };

  if (accounts.length === 0) {
    return (
      <div className='py-8 text-center text-muted-foreground'>
        <ShieldIcon size={48} className='mx-auto mb-3 opacity-40' />
        <h3 className='text-lg font-semibold'>Sin cuentas vinculadas</h3>
        <p className='text-sm'>
          Este usuario no tiene cuentas de redes sociales vinculadas
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      {accounts.map(account => {
        const expired = isTokenExpired(account.expiresAt);
        return (
          <Card
            key={account.id}
            className='border-l-4 p-4 transition-all hover:-translate-y-px hover:shadow-md'
            style={{
              borderLeftColor: getProviderBorderColor(account.provider),
            }}
          >
            {/* Header */}
            <div className='mb-3 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div
                  className='flex h-8 w-8 items-center justify-center rounded-md text-lg'
                  style={{
                    backgroundColor: `${getProviderBorderColor(account.provider)}20`,
                  }}
                >
                  {getProviderIcon(account.provider)}
                </div>
                <div>
                  <div className='font-semibold text-foreground'>
                    {getProviderLabel(account.provider)}
                  </div>
                  <div className='text-sm font-medium text-foreground'>
                    ID: {account.providerAccountId}
                  </div>
                </div>
              </div>

              {account.provider !== AuthProvider.email ? (
                <Button
                  variant='outline'
                  size='small'
                  onClick={() => handleUnlinkAccount(account)}
                  disabled={loading}
                  icon={<UnlinkIcon size={14} />}
                >
                  Desvincular
                </Button>
              ) : null}
            </div>

            {/* Details grid */}
            <div className='mb-3 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]'>
              <div className='flex flex-col gap-1'>
                <span className='text-xs font-medium uppercase tracking-[0.5px] text-muted-foreground'>
                  Estado del Token
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium uppercase tracking-[0.5px]',
                    expired
                      ? 'bg-destructive/20 text-destructive'
                      : 'bg-green-500/20 text-green-600'
                  )}
                >
                  {expired ? (
                    <>
                      <XCircleIcon size={12} /> Expirado
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon size={12} /> Válido
                    </>
                  )}
                </span>
              </div>

              <div className='flex flex-col gap-1'>
                <span className='text-xs font-medium uppercase tracking-[0.5px] text-muted-foreground'>
                  Fecha de Vinculación
                </span>
                <span className='text-sm font-medium text-foreground'>
                  {formatDate(account.createdAt)}
                </span>
              </div>

              {account.expiresAt ? (
                <div className='flex flex-col gap-1'>
                  <span className='text-xs font-medium uppercase tracking-[0.5px] text-muted-foreground'>
                    Expira
                  </span>
                  <span className='flex items-center gap-1 text-sm font-medium text-foreground'>
                    <ClockIcon size={12} />
                    {formatDate(account.expiresAt)}
                  </span>
                </div>
              ) : null}

              <div className='flex flex-col gap-1'>
                <span className='text-xs font-medium uppercase tracking-[0.5px] text-muted-foreground'>
                  Tipo de Token
                </span>
                <span className='text-sm font-medium text-foreground'>
                  {account.tokenType ?? 'Bearer'}
                </span>
              </div>
            </div>

            {/* Scopes */}
            {account.scope ? (
              <div className='flex flex-col gap-1'>
                <span className='text-xs font-medium uppercase tracking-[0.5px] text-muted-foreground'>
                  Permisos
                </span>
                <div className='mt-1 flex flex-wrap gap-1'>
                  {account.scope.split(' ').map((scope, i) => (
                    <span
                      key={i}
                      className='rounded-sm bg-muted px-2 py-1 text-xs text-muted-foreground'
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Expiry warning */}
            {expired ? (
              <div className='mt-2 flex items-center gap-2 rounded-md bg-yellow-500/20 p-2'>
                <AlertTriangleIcon size={16} className='text-yellow-600' />
                <span className='text-sm text-yellow-600'>
                  El token de acceso ha expirado. El usuario necesitará
                  re-autenticarse.
                </span>
              </div>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
};

export default UserAuthAccounts;
