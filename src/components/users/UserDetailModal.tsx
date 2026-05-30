import type React from 'react';
import { useState } from 'react';
import XIcon from 'lucide-react/dist/esm/icons/x';
import PhoneIcon from 'lucide-react/dist/esm/icons/phone';
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar';
import MapPinIcon from 'lucide-react/dist/esm/icons/map-pin';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import ShieldIcon from 'lucide-react/dist/esm/icons/shield';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import XCircleIcon from 'lucide-react/dist/esm/icons/x-circle';
import KeyIcon from 'lucide-react/dist/esm/icons/key';
import ActivityIcon from 'lucide-react/dist/esm/icons/activity';
import AtSignIcon from 'lucide-react/dist/esm/icons/at-sign';
import EditIcon from 'lucide-react/dist/esm/icons/edit';
import { cn } from '@/lib/utils';
import { type User } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserAuthAccounts } from './UserAuthAccounts';
import { UserSessionsManager } from './UserSessionsManager';
import { GoogleUserFeatures } from './GoogleUserFeatures';
import { UserProfileEditForm } from './UserProfileEditForm';
import { UserAddressManager } from './UserAddressManager';
import { useUserSessions } from '@/hooks/useAuthManagement';
import { useUserProfile } from '@/hooks/useUserProfile';
import { AuthProvider } from '@/types';

interface UserDetailModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'general' | 'auth' | 'sessions' | 'google-features';

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin': return 'Administrador';
    case 'staff': return 'Personal';
    case 'customer': return 'Cliente';
    default: return role;
  }
};

const InfoItem = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className='mb-3 flex items-center gap-3 last:mb-0'>
    <div className='min-w-[20px] text-muted-foreground'>{icon}</div>
    <div className='flex-1'>
      <div className='mb-1 text-sm text-muted-foreground'>{label}</div>
      <div className='text-base font-medium text-foreground'>{children}</div>
    </div>
  </div>
);

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  const { sessions, loading: _sl, refetch: refetchSessions } = useUserSessions(user.id);
  const {
    profile,
    loading: _pl,
    isEditing,
    updatingProfile,
    updateProfile,
    startEditing,
    cancelEditing,
    editingAddressId: _eai,
    creatingAddress,
    updatingAddress,
    deletingAddress,
    settingDefault,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refetch: _rp,
  } = useUserProfile({ userId: user.id, skip: !isOpen });

  const hasGoogleAccount = user.accounts?.some(
    a => a.provider === AuthProvider.google
  );

  if (!isOpen) return null;

  const TABS: { id: Tab; label: string; icon: React.ReactNode; hidden?: boolean }[] = [
    { id: 'general', label: 'Información General', icon: <UserIcon size={16} /> },
    { id: 'auth', label: 'Autenticación', icon: <KeyIcon size={16} /> },
    { id: 'sessions', label: 'Sesiones', icon: <ActivityIcon size={16} /> },
    { id: 'google-features', label: '🔍 Google', icon: null, hidden: !hasGoogleAccount },
  ];

  return (
    <div
      className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/50'
      onClick={onClose}
    >
      <Card
        className='max-h-[90vh] w-[90%] max-w-[800px] overflow-y-auto'
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='mb-6 flex items-center justify-between border-b border-border pb-4'>
          <h2 className='flex items-center gap-3 text-2xl font-semibold text-foreground'>
            <div className='flex h-[60px] w-[60px] items-center justify-center rounded-full bg-brand-purple/10 text-2xl font-bold text-brand-purple'>
              {user.profile?.firstName?.[0]}
              {user.profile?.lastName?.[0]}
            </div>
            Detalles del Usuario
          </h2>
          <Button
            variant='ghost'
            size='small'
            onClick={onClose}
            icon={<XIcon size={20} />}
          />
        </div>

        {/* Tabs */}
        <div className='mb-4 flex border-b border-border'>
          {TABS.filter(t => !t.hidden).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-b-2 border-brand-purple text-brand-purple'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='min-h-[200px]'>
          {activeTab === 'general' ? (
            <>
              <div className='mb-4 grid gap-6 max-md:grid-cols-1 md:grid-cols-2'>
                {/* Personal Info */}
                <div className='mb-4 rounded-lg bg-muted p-4'>
                  <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-foreground'>
                    <UserIcon size={20} />
                    Información Personal
                    {!isEditing ? (
                      <Button
                        variant='ghost'
                        size='small'
                        onClick={startEditing}
                        icon={<EditIcon size={16} />}
                        className='ml-auto'
                      >
                        Editar
                      </Button>
                    ) : null}
                  </h3>

                  {isEditing ? (
                    <UserProfileEditForm
                      profile={profile ?? user.profile ?? {}}
                      onSave={async input => {
                        await updateProfile(input as unknown as Parameters<typeof updateProfile>[0]);
                      }}
                      onCancel={cancelEditing}
                      loading={updatingProfile}
                    />
                  ) : (
                    <>
                      <InfoItem icon={<UserIcon size={16} />} label='Nombre Completo'>
                        {user.profile?.firstName && user.profile?.lastName
                          ? `${user.profile.firstName} ${user.profile.lastName}`
                          : 'No especificado'}
                      </InfoItem>
                      <InfoItem icon={<AtSignIcon size={16} />} label='Email'>
                        {user.email}
                      </InfoItem>
                      {user.profile?.phone ? (
                        <InfoItem icon={<PhoneIcon size={16} />} label='Teléfono'>
                          {user.profile.phone}
                        </InfoItem>
                      ) : null}
                      {user.profile?.dateOfBirth ? (
                        <InfoItem icon={<CalendarIcon size={16} />} label='Fecha de Nacimiento'>
                          {formatDate(user.profile.dateOfBirth)}
                        </InfoItem>
                      ) : null}
                      <InfoItem icon={<CalendarIcon size={16} />} label='Fecha de Registro'>
                        {formatDate(user.createdAt)}
                      </InfoItem>
                      {user.lastLoginAt ? (
                        <InfoItem icon={<ActivityIcon size={16} />} label='Último Acceso'>
                          {formatDate(user.lastLoginAt)}
                        </InfoItem>
                      ) : null}
                    </>
                  )}
                </div>

                {/* Account Status */}
                <div className='mb-4 rounded-lg bg-muted p-4'>
                  <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-foreground'>
                    <ShieldIcon size={20} />
                    Estado de la Cuenta
                  </h3>

                  <InfoItem icon={<ShieldIcon size={16} />} label='Rol'>
                    <span className='inline-flex items-center rounded-sm bg-muted px-2 py-1 text-xs font-medium capitalize text-muted-foreground'>
                      {getRoleLabel(user.role)}
                    </span>
                  </InfoItem>

                  <InfoItem
                    icon={user.isActive ? <CheckCircleIcon size={16} /> : <XCircleIcon size={16} />}
                    label='Estado'
                  >
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium',
                        user.isActive ? 'text-green-600' : 'text-destructive'
                      )}
                    >
                      {user.isActive ? <CheckCircleIcon size={12} /> : <XCircleIcon size={12} />}
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </InfoItem>

                  <InfoItem
                    icon={user.emailVerified ? <CheckCircleIcon size={16} /> : <XCircleIcon size={16} />}
                    label='Email Verificado'
                  >
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium',
                        user.emailVerified ? 'text-green-600' : 'text-yellow-600'
                      )}
                    >
                      {user.emailVerified ? <CheckCircleIcon size={12} /> : <XCircleIcon size={12} />}
                      {user.emailVerified ? 'Verificado' : 'No Verificado'}
                    </span>
                  </InfoItem>

                  <InfoItem icon={<CalendarIcon size={16} />} label='Última Actualización'>
                    {formatDate(user.updatedAt)}
                  </InfoItem>
                </div>
              </div>

              {/* Addresses */}
              <div className='mb-4 rounded-lg bg-muted p-4'>
                <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-foreground'>
                  <MapPinIcon size={20} />
                  Direcciones
                </h3>
                <UserAddressManager
                  addresses={user.addresses ?? []}
                  userId={user.id}
                  onCreateAddress={input => createAddress(input as never)}
                  onUpdateAddress={(id, input) => updateAddress(id, input as never)}
                  onDeleteAddress={deleteAddress}
                  onSetDefaultAddress={setDefaultAddress}
                  loading={creatingAddress || updatingAddress || deletingAddress || settingDefault}
                />
              </div>
            </>
          ) : null}

          {activeTab === 'auth' ? (
            <div className='mb-4 rounded-lg bg-muted p-4'>
              <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-foreground'>
                <KeyIcon size={20} />
                Cuentas de Autenticación
              </h3>
              <UserAuthAccounts
                accounts={user.accounts ?? []}
                onAccountUnlinked={() => {}}
              />
            </div>
          ) : null}

          {activeTab === 'sessions' ? (
            <div className='mb-4 rounded-lg bg-muted p-4'>
              <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-foreground'>
                <ActivityIcon size={20} />
                Gestión de Sesiones
              </h3>
              <UserSessionsManager
                userId={user.id}
                sessions={sessions}
                onSessionRevoked={refetchSessions}
              />
            </div>
          ) : null}

          {activeTab === 'google-features' && hasGoogleAccount ? (
            <GoogleUserFeatures user={user} onUserUpdated={() => {}} />
          ) : null}
        </div>
      </Card>
    </div>
  );
};

export default UserDetailModal;
