import React, { useState } from 'react';
import styled from 'styled-components';
import { useUsers, useUserStats, useCreateUser, useUpdateUser } from '@/hooks/useUsersGraphQL';
import { User, UserRole, CreateUserRequest, UpdateUserRequest } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { theme } from '@/styles/theme';
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
  Plus
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

// Component
export const UsersPage: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    role: undefined as UserRole | undefined,
    isActive: undefined as boolean | undefined
  });
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Queries and mutations
  const { users = [], loading: usersLoading, error: usersError } = useUsers({ filter: filters });
  const { stats } = useUserStats();
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
      await createUserMutation.create(formData);
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
      
      await updateUserMutation.update(editingUser.id, {
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
              <Mail size={24} />
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
                role: e.target.value ? e.target.value as UserRole : undefined 
              }))}
            >
              <option value="">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="customer">Cliente</option>
              <option value="staff">Staff</option>
            </FilterSelect>
            <FilterSelect
              value={filters.isActive === undefined ? '' : filters.isActive ? 'true' : 'false'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ 
                ...prev, 
                isActive: e.target.value ? e.target.value === 'true' : undefined 
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
            <Mail size={24} />
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
              role: e.target.value ? e.target.value as UserRole : undefined 
            }))}
          >
            <option value="">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="customer">Cliente</option>
            <option value="staff">Staff</option>
          </FilterSelect>
          <FilterSelect
            value={filters.isActive === undefined ? '' : filters.isActive ? 'true' : 'false'}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ 
              ...prev, 
              isActive: e.target.value ? e.target.value === 'true' : undefined 
            }))}
          >
            <option value="">Todos los estados</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </FilterSelect>
        </FiltersRow>
      </FiltersSection>

      {/* Users List */}
      {usersLoading ? (
        <LoadingMessage>Cargando usuarios...</LoadingMessage>
      ) : usersError ? (
        <ErrorMessage>Error al cargar usuarios: Error desconocido</ErrorMessage>
      ) : (
        <UsersGrid>
          {users.map((user) => (
            <UserCard key={user.id} onClick={() => openEditModal(user)}>
              <UserAvatar>
                {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}
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
                {user.profile?.birthDate && (
                  <UserBirthDate>
                    <Calendar size={12} />
                    {new Date(user.profile.birthDate).toLocaleDateString()}
                  </UserBirthDate>
                )}
              </UserInfo>
              <UserActions>
                <Button
                  variant="outline"
                  size="small"
                  onClick={(e: React.MouseEvent) => {
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
                  onClick={(e: React.MouseEvent) => {
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
          <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Input
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
                value={formData.profile?.birthDate ? new Date(formData.profile.birthDate).toISOString().split('T')[0] : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
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
                isLoading={createUserMutation.loading}
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
                value={formData.profile?.birthDate ? new Date(formData.profile.birthDate).toISOString().split('T')[0] : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile!, birthDate: e.target.value ? new Date(e.target.value) : undefined }
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
                isLoading={updateUserMutation.loading}
              >
                Actualizar Usuario
              </Button>
            </FormActions>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default UsersPage; 