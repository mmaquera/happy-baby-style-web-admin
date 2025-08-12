import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { 
  Folder,
  Plus,
  Settings,
  Download,
  Upload,
  Printer,
  Grid3X3,
  List
} from 'lucide-react';

interface CategoryHeaderProps {
  title?: string;
  stats?: {
    totalCategories?: number;
    activeCategories?: number;
    inactiveCategories?: number;
  };
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onAddCategory?: () => void;
  onBulkActions?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  showActions?: boolean;
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

const StatCard = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  text-align: center;
  border: 1px solid ${theme.colors.border.light};
  transition: transform ${theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div<{ variant: 'primary' | 'success' | 'warning' }>`
  color: ${({ variant }) => {
    switch (variant) {
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      default: return theme.colors.primaryPurple;
    }
  }};
  margin-bottom: ${theme.spacing[3]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing[2]};
`;

const StatChange = styled.div<{ isPositive: boolean }>`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${({ isPositive }) => isPositive ? theme.colors.success : theme.colors.warning};
`;

const QuickActionsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  align-items: center;
  padding: ${theme.spacing[4]};
  background: ${theme.colors.white};
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

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  title = "Categorías Happy Baby Style",
  stats,
  viewMode = 'list',
  onViewModeChange,
  onAddCategory,
  onBulkActions,
  onExport,
  onImport,
  showActions = true
}) => {
  const hasStats = stats && Object.values(stats).some(value => value !== undefined);

  return (
    <HeaderContainer>
      <MainHeader>
        <HeaderLeft>
          <HeaderIcon>
            <Folder size={24} />
          </HeaderIcon>
          <HeaderContent>
            <HeaderTitle>{title}</HeaderTitle>
            <HeaderSubtitle>Organiza tu catálogo de productos por categorías</HeaderSubtitle>
          </HeaderContent>
        </HeaderLeft>

        <HeaderActions>
          {onViewModeChange && (
            <div style={{ display: 'flex', gap: theme.spacing[2] }}>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="small"
                onClick={() => onViewModeChange('list')}
              >
                <List size={16} />
                Lista
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="small"
                onClick={() => onViewModeChange('grid')}
              >
                <Grid3X3 size={16} />
                Grid
              </Button>
            </div>
          )}
          
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
          
          {onAddCategory && (
            <Button
              variant="primary"
              size="medium"
              onClick={onAddCategory}
            >
              <Plus size={16} />
              Nueva Categoría
            </Button>
          )}
        </HeaderActions>
      </MainHeader>

      {hasStats && (
        <StatsGrid>
          {stats.totalCategories !== undefined && (
            <StatCard>
              <StatIcon variant="primary">
                <Folder size={24} />
              </StatIcon>
              <StatValue>{stats.totalCategories.toLocaleString()}</StatValue>
              <StatLabel>Total de Categorías</StatLabel>
              <StatChange isPositive={true}>+5% este mes</StatChange>
            </StatCard>
          )}
          
          {stats.activeCategories !== undefined && (
            <StatCard>
              <StatIcon variant="success">
                <Folder size={24} />
              </StatIcon>
              <StatValue>{stats.activeCategories.toLocaleString()}</StatValue>
              <StatLabel>Categorías Activas</StatLabel>
              <StatChange isPositive={true}>+3% este mes</StatChange>
            </StatCard>
          )}
          
          {stats.inactiveCategories !== undefined && (
            <StatCard>
              <StatIcon variant="warning">
                <Folder size={24} />
              </StatIcon>
              <StatValue>{stats.inactiveCategories.toLocaleString()}</StatValue>
              <StatLabel>Categorías Inactivas</StatLabel>
              <StatChange isPositive={false}>+1% este mes</StatChange>
            </StatCard>
          )}
        </StatsGrid>
      )}

      {showActions && (
        <QuickActionsContainer>
          <QuickActionsLabel>Acciones rápidas:</QuickActionsLabel>
          
          {onAddCategory && (
            <QuickActionButton
              variant="outline"
              size="small"
              onClick={onAddCategory}
            >
              <Plus size={14} />
              Agregar Categoría
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
