import { memo } from 'react';
import UsersIcon from 'lucide-react/dist/esm/icons/users';
import UserPlusIcon from 'lucide-react/dist/esm/icons/user-plus';
import ShieldIcon from 'lucide-react/dist/esm/icons/shield';
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar';
import { Card } from '@happy-baby/shared-ui';

interface UserStats {
  totalUsers?: number;
  activeUsers?: number;
  newUsersThisMonth?: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
}

const StatCard = memo<StatCardProps>(({ icon, value, label }) => (
  <Card className='flex flex-col items-center p-4 text-center'>
    <div className='mb-3 text-brand-purple'>{icon}</div>
    <span className='mb-1.5 text-2xl font-bold text-brand-purple'>{value}</span>
    <span className='text-xs uppercase tracking-wide text-muted-foreground'>
      {label}
    </span>
  </Card>
));
StatCard.displayName = 'StatCard';

interface UserStatsGridProps {
  stats?: UserStats | null;
}

export const UserStatsGrid = memo<UserStatsGridProps>(({ stats }) => (
  <div className='mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4'>
    <StatCard
      icon={<UsersIcon size={24} />}
      value={stats?.totalUsers ?? 0}
      label='Total Usuarios'
    />
    <StatCard
      icon={<UserPlusIcon size={24} />}
      value={stats?.activeUsers ?? 0}
      label='Usuarios Activos'
    />
    <StatCard
      icon={<ShieldIcon size={24} />}
      value={stats?.activeUsers ?? 0}
      label='Email Verificado'
    />
    <StatCard
      icon={<CalendarIcon size={24} />}
      value={stats?.newUsersThisMonth ?? 0}
      label='Nuevos este Mes'
    />
  </div>
));
UserStatsGrid.displayName = 'UserStatsGrid';
