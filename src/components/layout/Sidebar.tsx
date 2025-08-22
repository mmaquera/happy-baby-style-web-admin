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
  Baby,
  LogOut,
  Folder
} from 'lucide-react';
import { useLogout } from '@/hooks/useLogout';
import { LogoutConfirmModal } from '@/components/auth/LogoutConfirmModal';
import { useSidebar } from '@/contexts/SidebarContext';
import { Tooltip } from '@/components/ui/Tooltip';
import { CollapsibleNavItem } from './CollapsibleNavItem';
import { LogoutButtonWithTooltip } from './LogoutButtonWithTooltip';

const SidebarContainer = styled.aside<{ isCollapsed: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${props => props.isCollapsed ? '80px' : '280px'};
  height: 100vh;
  background: ${theme.colors.white};
  border-right: 1px solid ${theme.colors.border.light};
  display: flex;
  flex-direction: column;
  z-index: ${theme.zIndex.header + 1};
  transition: width ${theme.transitions.base};
  overflow: visible;
  box-sizing: border-box;
  flex-shrink: 0;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    transform: translateX(-100%);
    transition: transform ${theme.transitions.base};
  }
`;

const Logo = styled.div<{ isCollapsed: boolean }>`
  padding: ${props => props.isCollapsed ? theme.spacing[4] : theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.border.light};
  display: flex;
  align-items: center;
  gap: ${props => props.isCollapsed ? 0 : theme.spacing[3]};
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  min-height: 80px;
  position: relative;
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

const LogoText = styled.div<{ isCollapsed: boolean }>`
  display: ${props => props.isCollapsed ? 'none' : 'flex'};
  flex-direction: column;
  opacity: ${props => props.isCollapsed ? 0 : 1};
  transition: opacity ${theme.transitions.base};
  overflow: hidden;
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

const NavSectionTitle = styled.h3<{ isCollapsed: boolean }>`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 ${theme.spacing[3]} 0;
  padding: 0 ${props => props.isCollapsed ? theme.spacing[2] : theme.spacing[6]};
  text-align: ${props => props.isCollapsed ? 'center' : 'left'};
  opacity: ${props => props.isCollapsed ? 0 : 1};
  transition: opacity ${theme.transitions.base};
  height: ${props => props.isCollapsed ? 0 : 'auto'};
  overflow: hidden;
  white-space: nowrap;
`;

const NavItem = styled(NavLink)<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.isCollapsed ? 0 : theme.spacing[3]};
  padding: ${props => props.isCollapsed ? theme.spacing[4] : theme.spacing[3]} ${props => props.isCollapsed ? theme.spacing[2] : theme.spacing[6]};
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  transition: all ${theme.transitions.base};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.normal};
  border-right: 3px solid transparent;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  position: relative;
  min-height: 48px;

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

  span {
    opacity: ${props => props.isCollapsed ? 0 : 1};
    transition: opacity ${theme.transitions.base};
    white-space: nowrap;
    overflow: hidden;
    width: ${props => props.isCollapsed ? 0 : 'auto'};
  }
`;

const FooterSection = styled.div<{ isCollapsed: boolean }>`
  padding: ${props => props.isCollapsed ? theme.spacing[4] : theme.spacing[4]} ${props => props.isCollapsed ? theme.spacing[2] : theme.spacing[6]};
  border-top: 1px solid ${theme.colors.border.light};
`;



const FooterText = styled.div<{ isCollapsed: boolean }>`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  text-align: center;
  line-height: 1.4;
  opacity: ${props => props.isCollapsed ? 0 : 1};
  transition: opacity ${theme.transitions.base};
  height: ${props => props.isCollapsed ? 0 : 'auto'};
  overflow: hidden;
  white-space: nowrap;
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

  const { isCollapsed } = useSidebar();

  return (
    <SidebarContainer isCollapsed={isCollapsed}>
      <Logo isCollapsed={isCollapsed}>
        <LogoIcon>
          <Baby size={24} />
        </LogoIcon>
        <LogoText isCollapsed={isCollapsed}>
          <LogoTitle>Happy Baby Style</LogoTitle>
          <LogoSubtitle>Panel de Administración</LogoSubtitle>
        </LogoText>
      </Logo>

      <Navigation>
        <NavSection>
          <NavSectionTitle isCollapsed={isCollapsed}>Principal</NavSectionTitle>
          <CollapsibleNavItem to="/" end isCollapsed={isCollapsed} icon={<Home />}>
            Dashboard
          </CollapsibleNavItem>
        </NavSection>

        <NavSection>
          <NavSectionTitle isCollapsed={isCollapsed}>Gestión</NavSectionTitle>
          <CollapsibleNavItem to="/products" isCollapsed={isCollapsed} icon={<Package />}>
            Productos
          </CollapsibleNavItem>
          <CollapsibleNavItem to="/categories" isCollapsed={isCollapsed} icon={<Folder />}>
            Categorías
          </CollapsibleNavItem>
          <CollapsibleNavItem to="/orders" isCollapsed={isCollapsed} icon={<ShoppingCart />}>
            Pedidos
          </CollapsibleNavItem>
          <CollapsibleNavItem to="/users" isCollapsed={isCollapsed} icon={<Users />}>
            Usuarios
          </CollapsibleNavItem>
          <CollapsibleNavItem to="/images" isCollapsed={isCollapsed} icon={<ImageIcon />}>
            Imágenes
          </CollapsibleNavItem>
        </NavSection>

        <NavSection>
          <NavSectionTitle isCollapsed={isCollapsed}>Análisis</NavSectionTitle>
          <CollapsibleNavItem to="/analytics" isCollapsed={isCollapsed} icon={<BarChart3 />}>
            Estadísticas
          </CollapsibleNavItem>
        </NavSection>

        <NavSection>
          <NavSectionTitle isCollapsed={isCollapsed}>Configuración</NavSectionTitle>
          <CollapsibleNavItem to="/settings" isCollapsed={isCollapsed} icon={<Settings />}>
            Ajustes
          </CollapsibleNavItem>
        </NavSection>
      </Navigation>

      <FooterSection isCollapsed={isCollapsed}>
        <LogoutButtonWithTooltip 
          onClick={openLogoutModal} 
          isCollapsed={isCollapsed} 
        />
        
        <FooterText isCollapsed={isCollapsed}>
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