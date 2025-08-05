import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { theme } from '@/styles/theme';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  Image as ImageIcon,
  Home,
  Heart,
  LogOut
} from 'lucide-react';
import { useLogout } from '@/hooks/useLogout';
import { LogoutConfirmModal } from '@/components/auth/LogoutConfirmModal';

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: ${theme.colors.white};
  border-right: 1px solid ${theme.colors.border.light};
  display: flex;
  flex-direction: column;
  z-index: ${theme.zIndex.header + 1};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    transform: translateX(-100%);
    transition: transform ${theme.transitions.base};
  }
`;

const Logo = styled.div`
  padding: ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.border.light};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${theme.colors.primaryPurple}, ${theme.colors.coralAccent});
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xl};
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin: 0;
  line-height: 1.2;
`;

const LogoSubtitle = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  line-height: 1.2;
`;

const Navigation = styled.nav`
  flex: 1;
  padding: ${theme.spacing[4]} 0;
  overflow-y: auto;
`;

const NavSection = styled.div`
  margin-bottom: ${theme.spacing[6]};
`;

const NavSectionTitle = styled.h3`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 ${theme.spacing[3]} 0;
  padding: 0 ${theme.spacing[6]};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  transition: all ${theme.transitions.base};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.normal};
  border-right: 3px solid transparent;

  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.primaryPurple};
  }

  &.active {
    background: ${theme.colors.softPurple};
    color: ${theme.colors.primaryPurple};
    border-right-color: ${theme.colors.primaryPurple};
    font-weight: ${theme.fontWeights.medium};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const FooterSection = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.border.light};
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: none;
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  margin-bottom: ${theme.spacing[3]};

  &:hover {
    background: ${theme.colors.error}10;
    border-color: ${theme.colors.error};
    color: ${theme.colors.error};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FooterText = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  text-align: center;
  line-height: 1.4;
`;

const BrandText = styled.span`
  color: ${theme.colors.primaryPurple};
  font-weight: ${theme.fontWeights.medium};
`;

export const Sidebar: React.FC = () => {
  const { 
    isLogoutModalOpen, 
    isLoggingOut, 
    openLogoutModal, 
    closeLogoutModal, 
    handleLogout 
  } = useLogout();

  return (
    <SidebarContainer>
      <Logo>
        <LogoIcon>
          <Heart size={24} />
        </LogoIcon>
        <LogoText>
          <LogoTitle>Happy Baby Style</LogoTitle>
          <LogoSubtitle>Panel de Administración</LogoSubtitle>
        </LogoText>
      </Logo>

      <Navigation>
        <NavSection>
          <NavSectionTitle>Principal</NavSectionTitle>
          <NavItem to="/" end>
            <Home />
            Dashboard
          </NavItem>
        </NavSection>

        <NavSection>
          <NavSectionTitle>Gestión</NavSectionTitle>
          <NavItem to="/products">
            <Package />
            Productos
          </NavItem>
          <NavItem to="/orders">
            <ShoppingCart />
            Pedidos
          </NavItem>
          <NavItem to="/users">
            <Users />
            Usuarios
          </NavItem>
          <NavItem to="/images">
            <ImageIcon />
            Imágenes
          </NavItem>
        </NavSection>

        <NavSection>
          <NavSectionTitle>Análisis</NavSectionTitle>
          <NavItem to="/analytics">
            <BarChart3 />
            Estadísticas
          </NavItem>
        </NavSection>

        <NavSection>
          <NavSectionTitle>Configuración</NavSectionTitle>
          <NavItem to="/settings">
            <Settings />
            Ajustes
          </NavItem>
        </NavSection>
      </Navigation>

      <FooterSection>
        <LogoutButton onClick={openLogoutModal}>
          <LogOut />
          Cerrar Sesión
        </LogoutButton>
        
        <FooterText>
          © 2025 <BrandText>Happy Baby Style</BrandText>
          <br />
          Hecho con amor para tu bebé
        </FooterText>
      </FooterSection>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </SidebarContainer>
  );
};