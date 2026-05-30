import type React from 'react';
import {
  lazy,
  Suspense,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import UsersIcon from 'lucide-react/dist/esm/icons/users';
import ShieldIcon from 'lucide-react/dist/esm/icons/shield';
import UserPlusIcon from 'lucide-react/dist/esm/icons/user-plus';
import type { User, UserRole, CreateUserInput } from '@/core/domain/user/User';
import type { CreateUserProfileInput } from '@/generated/graphql';
import { useUserActions } from '@/hooks/useUserActions';
import { useUserStats } from '@/hooks/useUsersGraphQL';
import { useProviderUtils } from '@/hooks/useAuthManagement';
import { AuthProvider } from '@/types';
import { Button } from '@/components/ui/Button';
import { AuthProviderDashboard } from '@/components/users/AuthProviderDashboard';
import { UserStatsGrid } from '@/components/users/UserStatsGrid';
import { UserFilters } from '@/components/users/UserFilters';
import { UserGridItem } from '@/components/users/UserGridItem';
import type { EditUserSubmitData } from '@/components/users/EditUserModal';

const EditUserModal = lazy(() =>
  import('@/components/users/EditUserModal').then(m => ({
    default: m.EditUserModal,
  }))
);
const CreateUserModal = lazy(() =>
  import('@/components/users/CreateUserModal').then(m => ({
    default: m.CreateUserModal,
  }))
);
const UserDetailModal = lazy(() =>
  import('@/components/users/UserDetailModal').then(m => ({
    default: m.UserDetailModal,
  }))
);
const PasswordManagementModal = lazy(() =>
  import('@/components/users/PasswordManagementModal').then(m => ({
    default: m.PasswordManagementModal,
  }))
);

export const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'auth-dashboard'>(
    'users'
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);

  const {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
  } = useUserActions();

  const { stats } = useUserStats();
  const { getProviderIcon } = useProviderUtils();

  const emailProviderIcon = useMemo(
    () => getProviderIcon(AuthProvider.email),
    [getProviderIcon]
  );

  const buildFilter = useCallback(() => {
    const filter: { search?: string; role?: UserRole; isActive?: boolean } = {};
    if (searchTerm) filter.search = searchTerm;
    if (roleFilter) filter.role = roleFilter;
    if (isActiveFilter !== null) filter.isActive = isActiveFilter;
    return Object.keys(filter).length > 0 ? filter : undefined;
  }, [searchTerm, roleFilter, isActiveFilter]);

  useEffect(() => {
    void loadUsers(buildFilter());
  }, [loadUsers, buildFilter]);

  const handleCreateUser = useCallback(
    async (gqlInput: CreateUserProfileInput) => {
      const input: CreateUserInput = {
        email: gqlInput.email,
        firstName: gqlInput.firstName,
        lastName: gqlInput.lastName,
        phone: gqlInput.phone ?? null,
        ...(gqlInput.password ? { password: gqlInput.password } : {}),
        ...(gqlInput.role ? { role: gqlInput.role as UserRole } : {}),
      };
      const ok = await createUser(input);
      if (ok) setShowCreateModal(false);
    },
    [createUser]
  );

  const handleUpdateUser = useCallback(
    async (data: EditUserSubmitData) => {
      if (!selectedUser) return;
      const ok = await updateUser(selectedUser.id, data);
      if (ok) {
        setShowEditModal(false);
        setSelectedUser(null);
      }
    },
    [selectedUser, updateUser]
  );

  const openEditModal = useCallback((user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  }, []);

  const openDetailModal = useCallback((user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  }, []);

  const handleResetPassword = useCallback((user: User) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  }, []);

  const handleActivateUser = useCallback(
    async (user: User) => {
      await activateUser(user.id);
    },
    [activateUser]
  );

  const handleDeactivateUser = useCallback(
    async (user: User) => {
      await deactivateUser(user.id);
    },
    [deactivateUser]
  );

  const handleDeleteUser = useCallback(
    async (user: User) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm(`¿Eliminar al usuario ${user.email}?`)) return;
      await deleteUser(user.id);
    },
    [deleteUser]
  );

  const handlePromoteToAdmin = useCallback(
    async (user: User) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm(`¿Promover a ${user.email} como administrador?`))
        return;
      await updateUser(user.id, { role: 'admin' });
    },
    [updateUser]
  );

  const handleDemoteFromAdmin = useCallback(
    async (user: User) => {
      // eslint-disable-next-line no-alert
      const confirmed = window.confirm(
        `¿Remover permisos de administrador de ${user.email}?`
      );
      if (!confirmed) return;
      await updateUser(user.id, { role: 'customer' });
    },
    [updateUser]
  );

  const handleMenuToggle = useCallback((userId: string) => {
    setOpenMenuUserId(prev => (prev === userId ? null : userId));
  }, []);

  const handleMenuClose = useCallback(() => setOpenMenuUserId(null), []);

  if (error) {
    return (
      <div className='mx-auto max-w-screen-xl p-6'>
        <div className='py-16 text-center'>
          <p className='mb-4 text-destructive'>
            Error al cargar usuarios: {error}
          </p>
          <Button onClick={() => void loadUsers(buildFilter())}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-screen-xl p-6'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='font-heading text-3xl font-bold text-foreground'>
            Gestión de Usuarios
          </h1>
          <p className='mt-1 text-lg text-muted-foreground'>
            Administra usuarios del sistema y autenticación
          </p>
        </div>
        {activeTab === 'users' && (
          <Button variant='primary' onClick={() => setShowCreateModal(true)}>
            <UserPlusIcon size={16} className='mr-1.5' />
            Nuevo Usuario
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className='mb-6 flex border-b border-border'>
        {(
          [
            {
              id: 'users',
              label: 'Gestión de Usuarios',
              icon: <UsersIcon size={16} />,
            },
            {
              id: 'auth-dashboard',
              label: 'Dashboard de Autenticación',
              icon: <ShieldIcon size={16} />,
            },
          ] as const
        ).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className='min-h-96'>
        {activeTab === 'users' && (
          <>
            <UserStatsGrid stats={stats ?? null} />

            <UserFilters
              searchTerm={searchTerm}
              roleFilter={roleFilter}
              isActiveFilter={isActiveFilter}
              onSearchChange={setSearchTerm}
              onRoleChange={setRoleFilter}
              onActiveChange={setIsActiveFilter}
            />

            {loading && users.length === 0 ? (
              <div className='py-16 text-center text-muted-foreground'>
                Cargando usuarios...
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                {users.map(user => (
                  <UserGridItem
                    key={user.id}
                    user={user}
                    providerIcon={emailProviderIcon}
                    isMenuOpen={openMenuUserId === user.id}
                    onMenuToggle={() => handleMenuToggle(user.id)}
                    onMenuClose={handleMenuClose}
                    onEdit={openEditModal}
                    onView={openDetailModal}
                    onDelete={handleDeleteUser}
                    onResetPassword={handleResetPassword}
                    {...(!user.isActive
                      ? { onActivate: handleActivateUser }
                      : {})}
                    {...(user.isActive
                      ? { onDeactivate: handleDeactivateUser }
                      : {})}
                    {...(user.role !== 'admin'
                      ? { onPromoteToAdmin: handlePromoteToAdmin }
                      : {})}
                    {...(user.role === 'admin'
                      ? { onDemoteFromAdmin: handleDemoteFromAdmin }
                      : {})}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'auth-dashboard' ? <AuthProviderDashboard /> : null}
      </div>

      {/* Modals */}
      {showCreateModal ? (
        <Suspense fallback={null}>
          <CreateUserModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateUser}
            isLoading={loading}
          />
        </Suspense>
      ) : null}

      {showEditModal && selectedUser ? (
        <Suspense fallback={null}>
          <EditUserModal
            user={selectedUser}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
            onSubmit={handleUpdateUser}
            isLoading={loading}
          />
        </Suspense>
      ) : null}

      {showDetailModal && selectedUser ? (
        <Suspense fallback={null}>
          <UserDetailModal
            user={selectedUser as never}
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedUser(null);
            }}
          />
        </Suspense>
      ) : null}

      {showPasswordModal && selectedUser ? (
        <Suspense fallback={null}>
          <PasswordManagementModal
            user={selectedUser}
            isOpen={showPasswordModal}
            onClose={() => {
              setShowPasswordModal(false);
              setSelectedUser(null);
            }}
          />
        </Suspense>
      ) : null}
    </div>
  );
};

export default UsersPage;
