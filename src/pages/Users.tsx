import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useUsers, useUserStats, useCreateUser, useUpdateUserOptimized } from '@/hooks/useUsersGraphQL';
import { User, UserRole } from '@/types';
import { InputMaybe } from '@/generated/graphql';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserDetailModal } from '@/components/users/UserDetailModal';
import { AuthProviderDashboard } from '@/components/users/AuthProviderDashboard';
import { ImprovedCreateUserModal } from '@/components/users/ImprovedCreateUserModal';
import { UserActionsMenu } from '@/components/users/UserActionsMenu';
import { PasswordManagementModal } from '@/components/users/PasswordManagementModal';
import { useProviderUtils, useAccountManagement } from '@/hooks/useAuthManagement';
import { useUserActions } from '@/hooks/useUserActions';
import { theme } from '@/styles/theme';
import { AuthProvider } from '@/types';
import { 
  Users as UsersIcon,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  Shield,
  MoreVertical,
  Key
} from 'lucide-react';
import toast from 'react-hot-toast';

// Styled Components
const Container = styled.div`
  padding: ${theme.spacing[6]};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[6]};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const Subtitle = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing[1]};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const StatsCard = styled(Card)`
  text-align: center;
  padding: ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatsIcon = styled.div`
  color: ${theme.colors.primaryPurple};
  margin-bottom: ${theme.spacing[3]};
`;

const StatsContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatsNumber = styled.div`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primaryPurple};
  margin-bottom: ${theme.spacing[2]};
`;

const StatsLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FiltersSection = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
  box-shadow: ${theme.shadows.sm};
`;

const FiltersRow = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled(Input)`
  min-width: 250px;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  background-color: ${theme.colors.white};
  color: ${theme.colors.text.primary};
  cursor: pointer;
`;

const FormSelect = styled.select`
  padding: 12px;
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  background-color: ${theme.colors.white};
  color: ${theme.colors.text.primary};
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primaryPurple};
    box-shadow: 0 0 0 2px ${theme.colors.primaryPurple}20;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${theme.colors.primaryPurple};
`;

const CheckboxLabel = styled.label`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  cursor: pointer;
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing[4]};
`;

const UserCard = styled(Card)`
  padding: ${theme.spacing[4]};
  transition: all ${theme.transitions.base};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${theme.colors.primaryPurple}10;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.primaryPurple};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const UserEmail = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing[2]};
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[2]};
`;

const UserRoleBadge = styled.span<{ role: UserRole }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ role }) => {
    switch (role) {
      case UserRole.admin:
        return `
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      case UserRole.staff:
        return `
          background: ${theme.colors.coralAccent}20;
          color: ${theme.colors.coralAccent};
        `;
      default:
        return `
          background: ${theme.colors.primaryPurple}20;
          color: ${theme.colors.primaryPurple};
        `;
    }
  }}
`;

const UserStatus = styled.span<{ active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ active }) => {
    if (active) {
      return `
        background: ${theme.colors.success}20;
        color: ${theme.colors.success};
      `;
    } else {
      return `
        background: ${theme.colors.error}20;
        color: ${theme.colors.error};
      `;
    }
  }}
`;

const UserPhone = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const UserBirthDate = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const AuthProviderIndicator = styled.div<{ provider: AuthProvider }>`
  position: absolute;
  top: ${theme.spacing[2]};
  right: ${theme.spacing[2]};
  width: 24px;
  height: 24px;
  border-radius: ${theme.borderRadius.full};
  background-color: ${props => getProviderColor(props.provider)}20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.xs};
  color: ${props => getProviderColor(props.provider)};
  border: 1px solid ${props => getProviderColor(props.provider)}40;
`;

const getProviderColor = (provider: AuthProvider) => {
  switch (provider) {
    case AuthProvider.google:
      return '#4285f4';
    case AuthProvider.facebook:
      return '#1877f2';
    case AuthProvider.apple:
      return '#000000';
    case AuthProvider.email:
      return theme.colors.primaryPurple;
    default:
      return theme.colors.text.secondary;
  }
};

const UserActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[3]};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.error};
`;

// Modal Components
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(Card)`
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[4]};
  padding-bottom: ${theme.spacing[3]};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
`;

const FormActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: flex-end;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.border.light};
  margin-bottom: ${theme.spacing[6]};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: none;
  background: none;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  
  ${({ active }) => active ? `
    color: ${theme.colors.primaryPurple};
    border-bottom: 2px solid ${theme.colors.primaryPurple};
  ` : `
    color: ${theme.colors.text.secondary};
    
    &:hover {
      color: ${theme.colors.text.primary};
    }
  `}
`;

const TabContent = styled.div`
  min-height: 400px;
`;

// Component
export const UsersPage: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    role: null as InputMaybe<UserRole>,
    isActive: null as InputMaybe<boolean>
  });
  
  const [activeTab, setActiveTab] = useState<'users' | 'auth-dashboard'>('users');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);

  // Queries and mutations (conexiones reales al backend)
  // Crear filtros que solo incluyan valores no nulos
  const effectiveFilters = {
    search: filters.search || null,
    role: filters.role || null,
    isActive: filters.isActive || null
  };

  // 🔍 DEBUGGING: Logs para diagnosticar el problema
  console.log('🔍 DEBUG Users.tsx - Estado actual:', {
    filters,
    effectiveFilters,
    filtersString: JSON.stringify(filters),
    effectiveFiltersString: JSON.stringify(effectiveFilters)
  });

  const { users = [], loading: usersLoading, error: usersError, refetch } = useUsers({ filter: effectiveFilters });

  // 🔍 DEBUGGING: Logs del hook useUsers
  console.log('🔍 DEBUG Users.tsx - Hook useUsers:', {
    users,
    usersLength: users.length,
    loading: usersLoading,
    error: usersError,
    hasRefetch: !!refetch
  });
  const { stats } = useUserStats();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUserOptimized();
  const { getProviderIcon } = useProviderUtils();
  
  // Password management hooks
  const { forcePasswordReset } = useAccountManagement();
  const userActions = useUserActions();

  // Sincronización automática de filtros con GraphQL
  const stableRefetch = useCallback(() => {
    console.log('🔍 DEBUG Users.tsx - stableRefetch ejecutándose');
    refetch();
  }, [refetch]);

  // Carga inicial de usuarios al montar el componente
  useEffect(() => {
    console.log('🔍 DEBUG Users.tsx - useEffect inicial ejecutándose');
    stableRefetch();
  }, [stableRefetch]);

  // Sincronización automática cuando cambian los filtros
  useEffect(() => {
    console.log('🔍 DEBUG Users.tsx - useEffect de filtros ejecutándose', {
      filters,
      shouldRefetch: filters.search || filters.role !== null || filters.isActive !== null
    });
    if (filters.search || filters.role !== null || filters.isActive !== null) {
      stableRefetch();
    }
  }, [filters, stableRefetch]);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: UserRole.customer,
    isActive: true,
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: undefined as string | undefined
    }
  });

  const handleCreateUser = async (userData: any) => {
    try {
      const result = await createUserMutation.create(userData);
      
      if (result?.success) {
        setShowCreateModal(false);
        // El toast ya se maneja en el hook
      } else {
        // Manejar caso donde success es false pero no hay excepción
        toast.error(result?.message || 'Error al crear usuario');
      }
    } catch (error) {
      // El error ya se maneja en el hook, solo cerrar el modal si es necesario
      console.error('Error en handleCreateUser:', error);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const updateData = {
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
        profile: formData.profile
      };
      
      await updateUserMutation.update(selectedUser.id, updateData);
      
      setShowEditModal(false);
      setSelectedUser(null);
      toast.success('Usuario actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar usuario');
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
              profile: {
          firstName: user.profile?.firstName || '',
          lastName: user.profile?.lastName || '',
          phone: user.profile?.phone || '',
          dateOfBirth: user.profile?.dateOfBirth || undefined
        }
    });
    setShowEditModal(true);
  };

  // User action handlers
  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const handleActivateUser = async (user: User) => {
    await userActions.activateUser(user);
  };

  const handleDeactivateUser = async (user: User) => {
    await userActions.deactivateUser(user);
  };

  const handleDeleteUser = async (user: User) => {
    await userActions.deleteUser(user);
  };

  const handlePromoteToAdmin = async (user: User) => {
    await userActions.promoteToAdmin(user);
  };

  const handleDemoteFromAdmin = async (user: User) => {
    await userActions.demoteFromAdmin(user);
  };

  // Menu management handlers
  const handleMenuToggle = (userId: string) => {
    setOpenMenuUserId(openMenuUserId === userId ? null : userId);
  };

  const handleMenuClose = () => {
    setOpenMenuUserId(null);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.admin: return 'Administrador';
      case UserRole.staff: return 'Personal';
      case UserRole.customer: return 'Cliente';
      default: return role;
    }
  };

  if (usersError) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <HeaderInfo>
              <Title>Gestión de Usuarios</Title>
              <Subtitle>Administra usuarios del sistema</Subtitle>
            </HeaderInfo>
            <HeaderActions>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                icon={<UserPlus size={16} />}
              >
                Nuevo Usuario
              </Button>
            </HeaderActions>
          </HeaderContent>
        </Header>

        <StatsGrid>
          <StatsCard>
            <StatsIcon>
              <UsersIcon size={24} />
            </StatsIcon>
            <StatsContent>
              <StatsNumber>{stats?.totalUsers || 0}</StatsNumber>
              <StatsLabel>Total Usuarios</StatsLabel>
            </StatsContent>
          </StatsCard>
          <StatsCard>
            <StatsIcon>
              <UserPlus size={24} />
            </StatsIcon>
            <StatsContent>
              <StatsNumber>{stats?.activeUsers || 0}</StatsNumber>
              <StatsLabel>Usuarios Activos</StatsLabel>
            </StatsContent>
          </StatsCard>
          <StatsCard>
            <StatsIcon>
              <UsersIcon size={24} />
            </StatsIcon>
            <StatsContent>
              <StatsNumber>{stats?.totalUsers || 0}</StatsNumber>
              <StatsLabel>Usuarios por Rol</StatsLabel>
            </StatsContent>
          </StatsCard>
          <StatsCard>
            <StatsIcon>
              <Calendar size={24} />
            </StatsIcon>
            <StatsContent>
              <StatsNumber>{stats?.newUsersThisMonth || 0}</StatsNumber>
              <StatsLabel>Nuevos este Mes</StatsLabel>
            </StatsContent>
          </StatsCard>
        </StatsGrid>

        <FiltersSection>
          <FiltersRow>
            <SearchInput
              placeholder="Buscar usuarios..."
              value={filters.search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              icon={<Search size={16} />}
              style={{ minWidth: '250px' }}
            />
            <FilterSelect
              value={filters.role || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ 
                ...prev, 
                role: e.target.value ? e.target.value as UserRole : null 
              }))}
            >
              <option value="">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="customer">Cliente</option>
              <option value="staff">Staff</option>
            </FilterSelect>
            <FilterSelect
              value={filters.isActive === null ? '' : filters.isActive ? 'true' : 'false'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ 
                ...prev, 
                isActive: e.target.value ? e.target.value === 'true' : null 
              }))}
            >
              <option value="">Todos los estados</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </FilterSelect>
          </FiltersRow>
        </FiltersSection>

        <UsersGrid>
          <LoadingMessage>Cargando usuarios...</LoadingMessage>
        </UsersGrid>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <Header>
        <HeaderContent>
          <HeaderInfo>
            <Title>Gestión de Usuarios</Title>
            <Subtitle>Administra usuarios del sistema y autenticación</Subtitle>
          </HeaderInfo>
          <HeaderActions>
            {activeTab === 'users' && (
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                icon={<UserPlus size={16} />}
              >
                Nuevo Usuario
              </Button>
            )}
          </HeaderActions>
        </HeaderContent>
      </Header>

      {/* Tabs Navigation */}
      <TabsContainer>
        <Tab 
          active={activeTab === 'users'} 
          onClick={() => setActiveTab('users')}
        >
          <UsersIcon size={16} />
          Gestión de Usuarios
        </Tab>
        <Tab 
          active={activeTab === 'auth-dashboard'} 
          onClick={() => setActiveTab('auth-dashboard')}
        >
          <Shield size={16} />
          Dashboard de Autenticación
        </Tab>
      </TabsContainer>

      {/* Tab Content */}
      <TabContent>
        {activeTab === 'users' && (
          <>
            {/* Stats Cards */}
            <StatsGrid>
        <StatsCard>
          <StatsIcon>
            <UsersIcon size={24} />
          </StatsIcon>
          <StatsContent>
            <StatsNumber>{stats?.totalUsers || 0}</StatsNumber>
            <StatsLabel>Total Usuarios</StatsLabel>
          </StatsContent>
        </StatsCard>
        <StatsCard>
          <StatsIcon>
            <UserPlus size={24} />
          </StatsIcon>
          <StatsContent>
            <StatsNumber>{stats?.activeUsers || 0}</StatsNumber>
            <StatsLabel>Usuarios Activos</StatsLabel>
          </StatsContent>
        </StatsCard>
        <StatsCard>
          <StatsIcon>
            <Shield size={24} />
          </StatsIcon>
          <StatsContent>
                         <StatsNumber>{stats?.activeUsers || 0}</StatsNumber>
            <StatsLabel>Email Verificado</StatsLabel>
          </StatsContent>
        </StatsCard>
        <StatsCard>
          <StatsIcon>
            <Calendar size={24} />
          </StatsIcon>
          <StatsContent>
            <StatsNumber>{stats?.newUsersThisMonth || 0}</StatsNumber>
            <StatsLabel>Nuevos este Mes</StatsLabel>
          </StatsContent>
        </StatsCard>
      </StatsGrid>

      {/* Filters */}
      <FiltersSection>
        <FiltersRow>
          <SearchInput
            placeholder="Buscar usuarios..."
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            icon={<Search size={16} />}
            style={{ minWidth: '250px' }}
          />
          <FilterSelect
            value={filters.role || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ 
              ...prev, 
              role: e.target.value ? e.target.value as UserRole : null 
            }))}
          >
            <option value="">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="customer">Cliente</option>
            <option value="staff">Staff</option>
          </FilterSelect>
          <FilterSelect
            value={filters.isActive === null ? '' : filters.isActive ? 'true' : 'false'}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ 
              ...prev, 
              isActive: e.target.value ? e.target.value === 'true' : null 
            }))}
          >
            <option value="">Todos los estados</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </FilterSelect>
        </FiltersRow>
      </FiltersSection>

      {/* 🔍 DEBUGGING: Log del render final */}
      {(() => {
        console.log('🔍 DEBUG Users.tsx - Render final:', {
          usersLength: users.length,
          loading: usersLoading,
          error: usersError,
          filters,
          effectiveFilters,
          usersArray: users
        });
        return null;
      })()}

      {/* Users List */}
      {usersLoading ? (
        <LoadingMessage>Cargando usuarios...</LoadingMessage>
      ) : usersError ? (
        <ErrorMessage>Error al cargar usuarios: Error desconocido</ErrorMessage>
      ) : (
        <UsersGrid>
          {users.map((user) => {
            // Determinar el proveedor principal del usuario
            const primaryProvider = AuthProvider.email;
            console.log(user);
            return (
              <UserCard key={user.id} onClick={() => openEditModal(user as any)}>
                {/* Indicador del proveedor de autenticación */}
                <AuthProviderIndicator provider={primaryProvider}>
                  {getProviderIcon(primaryProvider)}
                </AuthProviderIndicator>
                <UserAvatar>
                  {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0] || 'U'}
                </UserAvatar>
                <UserInfo>
                <UserName>
                  {user.profile?.firstName} {user.profile?.lastName}
                </UserName>
                <UserEmail>{user.email}</UserEmail>
                <UserDetails>
                  <UserRoleBadge role={user.role}>
                    {getRoleLabel(user.role)}
                  </UserRoleBadge>
                  <UserStatus active={user.isActive}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </UserStatus>
                </UserDetails>
                {user.profile?.phone && (
                  <UserPhone>
                    <Phone size={12} />
                    {user.profile.phone}
                  </UserPhone>
                )}
                {user.profile?.dateOfBirth && (
                  <UserBirthDate>
                    <Calendar size={12} />
                    {new Date(user.profile.dateOfBirth).toLocaleDateString()}
                  </UserBirthDate>
                )}
              </UserInfo>
              <UserActions>
                <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <UserActionsMenu
                    user={user as any}
                    isOpen={openMenuUserId === user.id}
                    onToggle={() => handleMenuToggle(user.id)}
                    onClose={handleMenuClose}
                    onEdit={openEditModal}
                    onView={(user) => {
                      setSelectedUser(user as any);
                      setShowDetailModal(true);
                    }}
                    onActivate={user.isActive ? () => {} : (user: any) => handleActivateUser(user)}
                    onDeactivate={user.isActive ? (user: any) => handleDeactivateUser(user) : () => {}}
                    onDelete={(user: any) => handleDeleteUser(user)}
                    onResetPassword={(user: any) => handleResetPassword(user)}
                    onPromoteToAdmin={user.role !== UserRole.admin ? (user: any) => handlePromoteToAdmin(user) : () => {}}
                    onDemoteFromAdmin={user.role === UserRole.admin ? (user: any) => handleDemoteFromAdmin(user) : () => {}}
                  />
                </div>
              </UserActions>
            </UserCard>
            );
          })}
        </UsersGrid>
      )}
          </>
        )}

        {activeTab === 'auth-dashboard' && (
          <AuthProviderDashboard />
        )}
      </TabContent>

      {/* Create User Modal */}
      <ImprovedCreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateUser}
        isLoading={createUserMutation.loading}
        serverError={createUserMutation.error?.message}
      />

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <Modal onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Editar Usuario</ModalTitle>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </Button>
            </ModalHeader>

            <FormGrid>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Input
                label="Nombre"
                value={formData.profile?.firstName || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, firstName: e.target.value }
                }))}
                required
              />
              <Input
                label="Apellido"
                value={formData.profile?.lastName || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, lastName: e.target.value }
                }))}
                required
              />
              <Input
                label="Teléfono"
                value={formData.profile?.phone || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, phone: e.target.value }
                }))}
              />
              <Input
                label="Fecha de Nacimiento"
                type="date"
                value={formData.profile?.dateOfBirth ? new Date(formData.profile.dateOfBirth).toISOString().split('T')[0] : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, dateOfBirth: e.target.value || undefined }
                }))}
              />
            </FormGrid>

            <div style={{ marginBottom: theme.spacing[4] }}>
              <label style={{ 
                display: 'block', 
                marginBottom: theme.spacing[2], 
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontWeights.medium,
                color: theme.colors.text.primary 
              }}>
                Rol
              </label>
              <FormSelect
                value={formData.role}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ 
                  ...prev, 
                  role: e.target.value as UserRole 
                }))}
              >
                <option value={UserRole.customer}>Cliente</option>
                <option value={UserRole.staff}>Staff</option>
                <option value={UserRole.admin}>Administrador</option>
              </FormSelect>
            </div>

            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                id="isActiveEdit"
                checked={formData.isActive}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ 
                  ...prev, 
                  isActive: e.target.checked 
                }))}
              />
              <CheckboxLabel htmlFor="isActiveEdit">Usuario activo</CheckboxLabel>
            </CheckboxContainer>

            <FormActions>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateUser}
                isLoading={updateUserMutation.loading}
              >
                Actualizar Usuario
              </Button>
            </FormActions>
          </ModalContent>
        </Modal>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Password Management Modal */}
      {selectedUser && (
        <PasswordManagementModal
          user={selectedUser}
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </Container>
  );
};

export default UsersPage; 