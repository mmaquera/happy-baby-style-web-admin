import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Settings,
  Download,
  Upload,
  Grid3X3,
  List
} from 'lucide-react';

interface ProductHeaderProps {
  title?: string;
  stats?: {
    totalProducts?: number;
    activeProducts?: number;
    lowStockProducts?: number;
    outOfStockProducts?: number;
  };
  viewMode?: 'grid' | 'list';
  onAddProduct?: () => void;
  onBulkActions?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  showActions?: boolean;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

// =====================================================
// STYLED COMPONENTS - Minimalist Design
// =====================================================

const HeaderContainer = styled.div`
  margin-bottom: ${theme.spacing[6]};
`;

const MainHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[4]};
  flex-wrap: wrap;
  gap: ${theme.spacing[4]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
    gap: ${theme.spacing[3]};
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const HeaderIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${theme.colors.softPurple};
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primaryPurple};
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`;

const HeaderTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
  line-height: 1.2;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['2xl']};
    text-align: center;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  margin: 0;
  
  @media (max-width: ${theme.breakpoints.md}) {
    text-align: center;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  
  @media (max-width: ${theme.breakpoints.md}) {
    justify-content: center;
    gap: ${theme.spacing[2]};
  }
`;

const ViewToggleContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[1]};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[1]};
  background: ${theme.colors.background.light};
`;

const ViewToggleButton = styled.button<{ isActive: boolean }>`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  background: ${({ isActive }) => 
    isActive ? theme.colors.primaryPurple : 'transparent'};
  color: ${({ isActive }) => 
    isActive ? theme.colors.white : theme.colors.text.secondary};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  min-width: 60px;
  justify-content: center;

  &:hover {
    background: ${({ isActive }) => 
      isActive ? theme.colors.primaryPurple : theme.colors.background.accent};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: ${theme.spacing[3]};
  }
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${theme.spacing[4]};
  transition: transform ${theme.transitions.base};
  border: 1px solid ${theme.colors.border.light};

  &:hover {
    transform: translateY(-2px);
    border-color: ${theme.colors.primaryPurple};
  }
`;

const StatIcon = styled.div<{ variant: 'primary' | 'success' | 'warning' | 'error' }>`
  color: ${({ variant }) => {
    switch (variant) {
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
      default: return theme.colors.primaryPurple;
    }
  }};
  margin-bottom: ${theme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.fontWeights.medium};
`;

const StatChange = styled.div<{ isPositive: boolean }>`
  font-size: ${theme.fontSizes.xs};
  color: ${({ isPositive }) => isPositive ? theme.colors.success : theme.colors.error};
  font-weight: ${theme.fontWeights.medium};
  margin-top: ${theme.spacing[1]};
`;

// =====================================================
// COMPONENT - Clean and Focused
// =====================================================

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  title = "Productos Happy Baby Style",
  stats,
  viewMode = 'list',
  onAddProduct,
  onBulkActions,
  onExport,
  onImport,
  showActions = true,
  onViewModeChange
}) => {
  const hasStats = stats && Object.values(stats).some(value => value !== undefined);

  return (
    <HeaderContainer>
      <MainHeader>
        <HeaderLeft>
          <HeaderIcon>
            <Package size={24} />
          </HeaderIcon>
          <HeaderContent>
            <HeaderTitle>{title}</HeaderTitle>
            <HeaderSubtitle>Gestiona tu catálogo de productos para bebés</HeaderSubtitle>
          </HeaderContent>
        </HeaderLeft>

        {showActions && (
          <HeaderActions>
            {/* View Mode Toggle - Consolidated */}
            {onViewModeChange && (
              <ViewToggleContainer>
                <ViewToggleButton 
                  isActive={viewMode === 'list'}
                  onClick={() => onViewModeChange('list')}
                  title="Vista de lista"
                >
                  <List size={16} />
                  Lista
                </ViewToggleButton>
                <ViewToggleButton 
                  isActive={viewMode === 'grid'}
                  onClick={() => onViewModeChange('grid')}
                  title="Vista de cuadrícula"
                >
                  <Grid3X3 size={16} />
                  Grid
                </ViewToggleButton>
              </ViewToggleContainer>
            )}

            {/* Primary Actions */}
            {onImport && (
              <Button
                variant="ghost"
                size="medium"
                onClick={onImport}
                title="Importar productos"
              >
                <Upload size={16} />
                Importar
              </Button>
            )}
            
            {onExport && (
              <Button
                variant="ghost"
                size="medium"
                onClick={onExport}
                title="Exportar productos"
              >
                <Download size={16} />
                Exportar
              </Button>
            )}
            
            {onBulkActions && (
              <Button
                variant="secondary"
                size="medium"
                onClick={onBulkActions}
                title="Acciones masivas"
              >
                <Settings size={16} />
                Acciones Masivas
              </Button>
            )}
            
            {onAddProduct && (
              <Button
                variant="primary"
                size="medium"
                onClick={onAddProduct}
                title="Agregar nuevo producto"
              >
                <Plus size={16} />
                Nuevo Producto
              </Button>
            )}
          </HeaderActions>
        )}
      </MainHeader>

      {/* Statistics - Clean and Informative */}
      {hasStats && (
        <StatsGrid>
          {stats.totalProducts !== undefined && (
            <StatCard>
              <StatIcon variant="primary">
                <Package size={24} />
              </StatIcon>
              <StatValue>{stats.totalProducts.toLocaleString()}</StatValue>
              <StatLabel>Total de Productos</StatLabel>
              <StatChange isPositive={true}>+12% este mes</StatChange>
            </StatCard>
          )}
          
          {stats.activeProducts !== undefined && (
            <StatCard>
              <StatIcon variant="success">
                <CheckCircle size={24} />
              </StatIcon>
              <StatValue>{stats.activeProducts.toLocaleString()}</StatValue>
              <StatLabel>Productos Activos</StatLabel>
              <StatChange isPositive={true}>+8% este mes</StatChange>
            </StatCard>
          )}
          
          {stats.lowStockProducts !== undefined && (
            <StatCard>
              <StatIcon variant="warning">
                <AlertTriangle size={24} />
              </StatIcon>
              <StatValue>{stats.lowStockProducts.toLocaleString()}</StatValue>
              <StatLabel>Stock Bajo</StatLabel>
              <StatChange isPositive={false}>+3% este mes</StatChange>
            </StatCard>
          )}
          
          {stats.outOfStockProducts !== undefined && (
            <StatCard>
              <StatIcon variant="error">
                <XCircle size={24} />
              </StatIcon>
              <StatValue>{stats.outOfStockProducts.toLocaleString()}</StatValue>
              <StatLabel>Sin Stock</StatLabel>
              <StatChange isPositive={false}>+2% este mes</StatChange>
            </StatCard>
          )}
        </StatsGrid>
      )}
    </HeaderContainer>
  );
};
