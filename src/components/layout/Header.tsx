import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Search, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLogout } from '@/hooks/useLogout';
import { LogoutConfirmModal } from '@/components/auth/LogoutConfirmModal';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: 280px; // Sidebar width
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${theme.colors.border.light};
  z-index: ${theme.zIndex.header};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing[6]};

  @media (max-width: ${theme.breakpoints.lg}) {
    left: 0;
    padding: 0 ${theme.spacing[4]};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    height: 70px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    height: 60px;
    padding: 0 ${theme.spacing[3]};
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
  position: relative;
  margin-right: ${theme.spacing[6]};

  @media (max-width: ${theme.breakpoints.md}) {
    max-width: 300px;
    margin-right: ${theme.spacing[4]};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  padding-left: ${theme.spacing[10]};
  font-size: ${theme.fontSizes.base};
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.transitions.base};
  outline: none;

  &:focus {
    border-color: ${theme.colors.primaryPurple};
    box-shadow: 0 0 0 3px ${theme.colors.primaryPurple}20;
  }

  &::placeholder {
    color: ${theme.colors.warmGray};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.warmGray};
  width: 20px;
  height: 20px;
  pointer-events: none;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.warmGray};
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.primaryPurple};
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background: ${theme.colors.coralAccent};
  border-radius: 50%;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  cursor: pointer;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.background.accent};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing[2]};
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${theme.colors.primaryPurple}, ${theme.colors.coralAccent});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeights.medium};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 32px;
    height: 32px;
    font-size: ${theme.fontSizes.sm};
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  line-height: 1.2;
`;

const UserRole = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  line-height: 1.2;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.warmGray};
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.primaryPurple};
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    display: block;
  }
`;

const UserDropdown = styled.div`
  position: relative;
`;

const UserDropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${theme.spacing[2]};
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  min-width: 200px;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all ${theme.transitions.base};
  z-index: ${theme.zIndex.dropdown};
`;

const UserDropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: none;
  border: none;
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.primaryPurple};
  }

  &:first-child {
    border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${theme.borderRadius.lg} ${theme.borderRadius.lg};
    border-top: 1px solid ${theme.colors.border.light};
    color: ${theme.colors.error};
  }

  &:last-child:hover {
    background: ${theme.colors.error}10;
    color: ${theme.colors.error};
  }
`;

const DropdownArrow = styled(ChevronDown)<{ isOpen: boolean }>`
  transition: transform ${theme.transitions.fast};
  transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { 
    isLogoutModalOpen, 
    isLoggingOut, 
    openLogoutModal, 
    closeLogoutModal, 
    handleLogout 
  } = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleUserClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    openLogoutModal();
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    
    // If it's an email, use the part before @
    if (name.includes('@')) {
      const emailUser = name.split('@')[0];
      if (emailUser) {
        return emailUser.charAt(0).toUpperCase();
      }
    }
    
    // If it's a regular name, use first letters of words
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <HeaderContainer>
      <MobileMenuButton>
        <Settings size={24} />
      </MobileMenuButton>

      <SearchContainer>
        <SearchIcon />
        <SearchInput 
          placeholder="Buscar productos, pedidos..." 
          type="search"
        />
      </SearchContainer>

      <HeaderActions>
        <NotificationButton>
          <Bell size={20} />
          <NotificationBadge />
        </NotificationButton>

        <UserDropdown>
          <UserProfile onClick={handleUserClick}>
            <Avatar>
              {user ? getUserInitials(
                user.profile?.firstName && user.profile?.lastName 
                  ? `${user.profile.firstName} ${user.profile.lastName}`
                  : user.email
              ) : 'U'}
            </Avatar>
            <UserInfo>
              <UserName>
                {user?.profile?.firstName && user?.profile?.lastName 
                  ? `${user.profile.firstName} ${user.profile.lastName}`
                  : user?.email || 'Usuario'
                }
              </UserName>
              <UserRole>{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</UserRole>
            </UserInfo>
            <DropdownArrow size={16} isOpen={isDropdownOpen} />
          </UserProfile>

          <UserDropdownMenu isOpen={isDropdownOpen}>
            <UserDropdownItem>
              <User size={16} />
              Mi Perfil
            </UserDropdownItem>
            <UserDropdownItem>
              <Settings size={16} />
              Configuración
            </UserDropdownItem>
            <UserDropdownItem onClick={handleLogoutClick}>
              <LogOut size={16} />
              Cerrar Sesión
            </UserDropdownItem>
          </UserDropdownMenu>
        </UserDropdown>
      </HeaderActions>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </HeaderContainer>
  );
};