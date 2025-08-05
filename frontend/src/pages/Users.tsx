import React, { useState } from 'react';
import styled from 'styled-components';
import { useUsers, useUserStats, useCreateUser, useUpdateUser } from '@/hooks/useUsers';
import { User, UserRole, CreateUserRequest, UpdateUserRequest } from '@/types';
import { Card, Button, Input } from '@/components/ui';
import { theme } from '@/styles/theme';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Shield,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

// Styled Components
const UsersContainer = styled.div`
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

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${theme.spacing[4]};
`;

const StatNumber = styled.div`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primaryPurple};
  margin-bottom: ${theme.spacing[2]};
`;

const StatLabel = styled.div`
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

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing[4]};
`;

const UserCard = styled(Card)`
  padding: ${theme.spacing[4]};
  transition: all ${theme.transitions.base};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing[3]};
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
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
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
      case UserRole.ADMIN:
        return `
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      case UserRole.STAFF:
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

const UserStatus = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-size: ${theme.fontSizes.sm};
  color: ${({ isActive }) => isActive ? theme.colors.success : theme.colors.error};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const UserDetail = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const UserActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[3]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.text.secondary};
`;

const EmptyIcon = styled(Users)`
  width: 64px;
  height: 64px;
  margin: 0 auto ${theme.spacing[4]};
  color: ${theme.colors.border.light};
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

// Component
export const UsersPage: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    role: '' as UserRole | '',
    isActive: undefined as boolean | undefined
  });
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Queries and mutations
  const { data: users = [], isLoading: usersLoading, error: usersError } = useUsers(filters);
  const { data: stats } = useUserStats();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  // Form state
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    password: '',
    role: UserRole.CUSTOMER,
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      birthDate: undefined
    }
  });

  const handleCreateUser = async () => {
    try {
      await createUserMutation.mutateAsync(formData);
      setShowCreateModal(false);
      setFormData({
        email: '',
        password: '',
        role: UserRole.CUSTOMER,
        profile: {
          firstName: '',
          lastName: '',
          phone: '',
          birthDate: undefined
        }
      });
      toast.success('Usuario creado exitosamente');
    } catch (error) {
      toast.error('Error al crear usuario');
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const updateData: UpdateUserRequest = {
        email: formData.email,
        role: formData.role,
        profile: formData.profile
      };
      
      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        data: updateData
      });
      
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
      profile: {
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        phone: user.profile?.phone || '',
        birthDate: user.profile?.birthDate
      }
    });
    setShowEditModal(true);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'Administrador';
      case UserRole.STAFF: return 'Personal';
      case UserRole.CUSTOMER: return 'Cliente';
      default: return role;
    }
  };

  if (usersError) {
    return (
      <UsersContainer>
        <EmptyState>
          <EmptyIcon />
          <h3>Error al cargar usuarios</h3>
          <p>No se pudieron cargar los usuarios. Inténtalo de nuevo.</p>
        </EmptyState>
      </UsersContainer>
    );
  }

  return (
    <UsersContainer>
      <Header>
        <Title>
          <Users size={32} />
          Gestión de Usuarios
        </Title>
        <Button
          variant="primary"
          size="medium"
          onClick={() => setShowCreateModal(true)}
        >
          <UserPlus size={16} />
          Nuevo Usuario
        </Button>
      </Header>

      {/* Stats */}
      {stats && (
        <StatsGrid>
          <StatCard>
            <StatNumber>{stats.totalUsers}</StatNumber>
            <StatLabel>Total de Usuarios</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.activeUsers}</StatNumber>
            <StatLabel>Usuarios Activos</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.newUsersThisMonth}</StatNumber>
            <StatLabel>Nuevos este Mes</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.usersByRole[UserRole.ADMIN] || 0}</StatNumber>
            <StatLabel>Administradores</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      {/* Filters */}
      <FiltersSection>
        <FiltersRow>
          <Input
            placeholder="Buscar usuarios..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            leftIcon={<Search size={16} />}
            style={{ minWidth: '250px' }}
          />
          <select
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as UserRole | '' }))}
            style={{
              padding: '8px 12px',
              border: `1px solid ${theme.colors.border.light}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fontSizes.sm
            }}
          >
            <option value="">Todos los roles</option>
            <option value={UserRole.ADMIN}>Administrador</option>
            <option value={UserRole.STAFF}>Personal</option>
            <option value={UserRole.CUSTOMER}>Cliente</option>
          </select>
          <select
            value={filters.isActive === undefined ? '' : filters.isActive.toString()}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              isActive: e.target.value === '' ? undefined : e.target.value === 'true'
            }))}
            style={{
              padding: '8px 12px',
              border: `1px solid ${theme.colors.border.light}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fontSizes.sm
            }}
          >
            <option value="">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </FiltersRow>
      </FiltersSection>

      {/* Users Grid */}
      {usersLoading ? (
        <EmptyState>
          <EmptyIcon />
          <h3>Cargando usuarios...</h3>
        </EmptyState>
      ) : users.length === 0 ? (
        <EmptyState>
          <EmptyIcon />
          <h3>No se encontraron usuarios</h3>
          <p>No hay usuarios que coincidan con los filtros aplicados.</p>
        </EmptyState>
      ) : (
        <UsersGrid>
          {users.map((user) => (
            <UserCard key={user.id} onClick={() => openEditModal(user)}>
              <UserHeader>
                <UserInfo>
                  <UserName>
                    {user.profile?.firstName && user.profile?.lastName
                      ? `${user.profile.firstName} ${user.profile.lastName}`
                      : user.email.split('@')[0]
                    }
                  </UserName>
                  <UserEmail>
                    <Mail size={14} />
                    {user.email}
                  </UserEmail>
                  <UserRoleBadge role={user.role}>
                    <Shield size={12} />
                    {getRoleLabel(user.role)}
                  </UserRoleBadge>
                </UserInfo>
                <UserStatus isActive={user.isActive}>
                  {user.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </UserStatus>
              </UserHeader>

              <UserDetails>
                {user.profile?.phone && (
                  <UserDetail>
                    <Phone size={14} />
                    {user.profile.phone}
                  </UserDetail>
                )}
                {user.profile?.birthDate && (
                  <UserDetail>
                    <Calendar size={14} />
                    {new Date(user.profile.birthDate).toLocaleDateString()}
                  </UserDetail>
                )}
                {user.addresses && user.addresses.length > 0 && (
                  <UserDetail>
                    <MapPin size={14} />
                    {user.addresses.length} dirección{user.addresses.length !== 1 ? 'es' : ''}
                  </UserDetail>
                )}
              </UserDetails>

              <UserActions>
                <Button
                  variant="outline"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(user);
                  }}
                >
                  <Edit size={14} />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement view user details
                  }}
                >
                  <Eye size={14} />
                  Ver
                </Button>
              </UserActions>
            </UserCard>
          ))}
        </UsersGrid>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <Modal onClick={() => setShowCreateModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Crear Nuevo Usuario</ModalTitle>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </Button>
            </ModalHeader>

            <FormGrid>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Input
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <Input
                label="Nombre"
                value={formData.profile?.firstName || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, firstName: e.target.value }
                }))}
                required
              />
              <Input
                label="Apellido"
                value={formData.profile?.lastName || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, lastName: e.target.value }
                }))}
                required
              />
              <Input
                label="Teléfono"
                value={formData.profile?.phone || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, phone: e.target.value }
                }))}
              />
              <Input
                label="Fecha de Nacimiento"
                type="date"
                value={formData.profile?.birthDate ? new Date(formData.profile.birthDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, birthDate: e.target.value ? new Date(e.target.value) : undefined }
                }))}
              />
            </FormGrid>

            <FormActions>
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateUser}
                isLoading={createUserMutation.isPending}
              >
                Crear Usuario
              </Button>
            </FormActions>
          </ModalContent>
        </Modal>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <Modal onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
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
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Input
                label="Nombre"
                value={formData.profile?.firstName || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, firstName: e.target.value }
                }))}
                required
              />
              <Input
                label="Apellido"
                value={formData.profile?.lastName || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, lastName: e.target.value }
                }))}
                required
              />
              <Input
                label="Teléfono"
                value={formData.profile?.phone || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, phone: e.target.value }
                }))}
              />
            </FormGrid>

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
                isLoading={updateUserMutation.isPending}
              >
                Actualizar Usuario
              </Button>
            </FormActions>
          </ModalContent>
        </Modal>
      )}
    </UsersContainer>
  );
};

export default UsersPage; 