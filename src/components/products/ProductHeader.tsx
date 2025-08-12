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
  Printer,
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
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
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
`;

const HeaderSubtitle = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  flex-wrap: wrap;
  align-items: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${theme.spacing[4]};
  transition: transform ${theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
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

const QuickActionsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  flex-wrap: wrap;
  align-items: center;
  padding: ${theme.spacing[4]};
  background: ${theme.colors.background.accent};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;

const QuickActionsLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.secondary};
`;

const QuickActionButton = styled(Button)`
  font-size: ${theme.fontSizes.sm};
`;

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  title = "Productos Happy Baby Style",
  stats,
  viewMode = 'grid',
  onAddProduct,
  onBulkActions,
  onExport,
  onImport,
  showActions = true,
  onViewModeChange
}) => {
  console.log('ProductHeader recibió viewMode:', viewMode);
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
            {onImport && (
              <Button
                variant="ghost"
                size="medium"
                onClick={onImport}
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
              >
                <Settings size={16} />
                Acciones Masivas
              </Button>
            )}
            
            {onViewModeChange && (
              <div style={{ display: 'flex', gap: theme.spacing[2] }}>
              
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="small"
                  onClick={() => {
                    console.log('Botón Lista clickeado, viewMode actual:', viewMode);
                    onViewModeChange('list');
                  }}
                >
                  <List size={16} />
                  Lista
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="small"
                  onClick={() => {
                    console.log('Botón Grid clickeado, viewMode actual:', viewMode);
                    onViewModeChange('grid');
                  }}
                >
                  <Grid3X3 size={16} />
                  Grid
                </Button>
              </div>
            )}
            
            {onAddProduct && (
              <Button
                variant="primary"
                size="medium"
                onClick={onAddProduct}
              >
                <Plus size={16} />
                Nuevo Producto
              </Button>
            )}
          </HeaderActions>
        )}
      </MainHeader>

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

      {showActions && (
        <QuickActionsContainer>
          <QuickActionsLabel>Acciones rápidas:</QuickActionsLabel>
          
          {onAddProduct && (
            <QuickActionButton
              variant="outline"
              size="small"
              onClick={onAddProduct}
            >
              <Plus size={14} />
              Agregar Producto
            </QuickActionButton>
          )}
          
          {onBulkActions && (
            <QuickActionButton
              variant="outline"
              size="small"
              onClick={onBulkActions}
            >
              <Settings size={14} />
              Acciones Masivas
            </QuickActionButton>
          )}
          
          {onExport && (
            <QuickActionButton
              variant="ghost"
              size="small"
              onClick={onExport}
            >
              <Download size={14} />
              Exportar Lista
            </QuickActionButton>
          )}
          
          <QuickActionButton
            variant="ghost"
            size="small"
            onClick={() => window.print()}
          >
            <Printer size={14} />
            Imprimir
          </QuickActionButton>
        </QuickActionsContainer>
      )}
    </HeaderContainer>
  );
};
