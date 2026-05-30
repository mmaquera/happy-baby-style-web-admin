import type React from 'react';
import TrendingUpIcon from 'lucide-react/dist/esm/icons/trending-up';
import UsersIcon from 'lucide-react/dist/esm/icons/users';
import ActivityIcon from 'lucide-react/dist/esm/icons/activity';
import GlobeIcon from 'lucide-react/dist/esm/icons/globe';
import ClockIcon from 'lucide-react/dist/esm/icons/clock';
import MapPinIcon from 'lucide-react/dist/esm/icons/map-pin';
import RefreshCwIcon from 'lucide-react/dist/esm/icons/refresh-cw';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  useAuthProviderStats,
  useProviderUtils,
  type AuthProviderStats,
} from '@/hooks/useAuthManagement';
import { logger } from '@/utils/logger';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export const AuthProviderDashboard: React.FC = () => {
  const { stats, loading, error, refetch } = useAuthProviderStats();
  const { getProviderLabel, getProviderIcon, getProviderColor } = useProviderUtils();

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (err) {
      logger.error('Error al refrescar estadísticas:', err);
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-[400px] flex-col items-center justify-center gap-6 text-muted-foreground'>
        <RefreshCwIcon size={32} className='animate-spin' />
        <p>Cargando estadísticas de autenticación...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className='flex min-h-[400px] flex-col items-center justify-center gap-4 text-destructive'>
        <p>{error ? 'Error al cargar estadísticas' : 'No hay datos disponibles'}</p>
        {error ? (
          <Button variant='outline' onClick={() => refetch()}>
            Reintentar
          </Button>
        ) : null}
      </div>
    );
  }

  const isUsingFallbackData =
    stats.totalUsers === 0 &&
    stats.activeSessionsCount === 0 &&
    stats.usersByProvider.every(p => p.count === 0) &&
    stats.recentLogins.length === 0;

  const STAT_CARDS = [
    { color: 'var(--color-brand-purple)', icon: <UsersIcon size={24} />, value: stats.totalUsers, label: 'Total Usuarios' },
    { color: '#22c55e', icon: <ActivityIcon size={24} />, value: stats.activeSessionsCount, label: 'Sesiones Activas' },
    { color: '#f97316', icon: <GlobeIcon size={24} />, value: stats.usersByProvider.length, label: 'Proveedores Activos' },
    { color: '#eab308', icon: <TrendingUpIcon size={24} />, value: stats.recentLogins.length, label: 'Logins Recientes' },
  ];

  return (
    <div className='mx-auto flex max-w-[1200px] flex-col gap-8 p-6'>
      {/* Header */}
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-foreground'>
          Dashboard de Autenticación
        </h2>
        <Button
          variant='outline'
          size='small'
          onClick={handleRefresh}
          disabled={loading}
          icon={<RefreshCwIcon size={16} />}
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      {/* Demo banner */}
      {isUsingFallbackData ? (
        <div className='mb-6 flex items-center gap-4 rounded-lg border border-border bg-muted p-5'>
          <div className='flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-teal-400 text-xs font-bold text-white'>
            i
          </div>
          <div>
            <div className='mb-1 text-sm font-semibold text-foreground'>Modo Demostración</div>
            <div className='text-xs leading-[1.4] text-muted-foreground'>
              Mostrando datos de ejemplo hasta la conexión con el backend
            </div>
          </div>
        </div>
      ) : null}

      {/* Stats Grid */}
      <div className='grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] max-md:grid-cols-2 max-sm:grid-cols-1'>
        {STAT_CARDS.map(({ color, icon, value, label }) => (
          <Card
            key={label}
            className='group flex flex-col items-center p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-md'
          >
            <div
              className='mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-all group-hover:scale-105'
              style={{ background: `${color}20`, color }}
            >
              {icon}
            </div>
            <div className='mb-2 font-heading text-3xl font-bold leading-none text-foreground'>
              {value}
            </div>
            <div className='text-sm font-medium text-muted-foreground'>{label}</div>
          </Card>
        ))}
      </div>

      {/* Providers + Activity */}
      <div className='grid gap-8 max-md:grid-cols-1 md:grid-cols-2'>
        {/* By Provider */}
        <div>
          <h3 className='relative mb-6 font-heading text-xl font-semibold text-foreground'>
            Distribución por Proveedor
            <span className='absolute bottom-[-8px] left-0 block h-[3px] w-10 rounded-full bg-gradient-to-r from-brand-purple to-teal-400' />
          </h3>
          <div className='flex flex-col gap-4'>
            {stats.usersByProvider.map(
              (provider: AuthProviderStats['usersByProvider'][0]) => {
                const color = getProviderColor(provider.provider);
                return (
                  <Card
                    key={provider.provider}
                    className='group border-l-4 p-6 transition-all hover:-translate-y-0.5 hover:shadow-md'
                    style={{ borderLeftColor: color }}
                  >
                    <div className='mb-4 flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div
                          className='flex h-12 w-12 items-center justify-center rounded-full text-xl transition-all group-hover:scale-110'
                          style={{ background: `${color}20`, color }}
                        >
                          {getProviderIcon(provider.provider)}
                        </div>
                        <div className='font-semibold text-foreground'>
                          {getProviderLabel(provider.provider)}
                        </div>
                      </div>

                      <div className='flex gap-6'>
                        <div className='text-center'>
                          <div
                            className='font-heading text-2xl font-bold leading-none'
                            style={{ color }}
                          >
                            {provider.count}
                          </div>
                          <div className='text-xs text-muted-foreground'>Usuarios</div>
                        </div>
                        <div className='text-center'>
                          <div
                            className='font-heading text-2xl font-bold leading-none'
                            style={{ color }}
                          >
                            {provider.percentage.toFixed(1)}%
                          </div>
                          <div className='text-xs text-muted-foreground'>Porcentaje</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className='mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border'>
                      <div
                        className='h-full rounded-full transition-[width]'
                        style={{
                          width: `${provider.percentage}%`,
                          background: `linear-gradient(90deg, ${color}, ${color}80)`,
                        }}
                      />
                    </div>
                  </Card>
                );
              }
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className='relative mb-6 font-heading text-xl font-semibold text-foreground'>
            Actividad Reciente
            <span className='absolute bottom-[-8px] left-0 block h-[3px] w-10 rounded-full bg-gradient-to-r from-brand-purple to-teal-400' />
          </h3>
          <div className='mt-4 flex flex-col gap-3'>
            {stats.recentLogins.slice(0, 5).map(
              (login: AuthProviderStats['recentLogins'][0], index: number) => {
                const color = getProviderColor(login.provider);
                return (
                  <div
                    key={`${login.userId}-${index}`}
                    className='group flex items-center gap-4 rounded-md border border-border bg-muted p-4 transition-all hover:translate-x-1 hover:border-border/60 hover:bg-card'
                  >
                    <div
                      className='flex h-9 w-9 items-center justify-center rounded-full text-base transition-all group-hover:scale-110'
                      style={{ background: `${color}20`, color }}
                    >
                      {getProviderIcon(login.provider)}
                    </div>
                    <div className='flex-1'>
                      <div className='mb-2 text-sm font-medium text-foreground'>
                        {login.email}
                      </div>
                      <div className='flex flex-wrap items-center gap-3 text-xs text-muted-foreground'>
                        <span>{getProviderLabel(login.provider)}</span>
                        <ClockIcon size={12} />
                        <span>{formatDate(login.loginAt)}</span>
                        {login.ipAddress && login.ipAddress !== 'N/A' ? (
                          <>
                            <MapPinIcon size={12} />
                            <span>{login.ipAddress}</span>
                          </>
                        ) : null}
                        {login.userAgent && login.userAgent !== 'N/A' ? (
                          <span className='opacity-70' style={{ fontSize: 11 }}>
                            {login.userAgent.length > 30
                              ? `${login.userAgent.substring(0, 30)}...`
                              : login.userAgent}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              }
            )}

            {stats.recentLogins.length === 0 ? (
              <div className='p-4 text-center text-muted-foreground'>
                {isUsingFallbackData ? (
                  <div>
                    <div className='mb-2'>📊 Sin actividad reciente</div>
                    <div className='text-sm opacity-70'>
                      Los logins recientes aparecerán aquí cuando haya usuarios activos
                    </div>
                  </div>
                ) : (
                  'No hay actividad reciente'
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthProviderDashboard;
