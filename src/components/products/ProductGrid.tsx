import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  Grid3X3,
  List,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  images: string[];
  stockQuantity: number;
  isActive: boolean;
  rating?: number | null;
  reviewCount: number;
  tags: string[];
  category?: {
    name: string;
    slug: string;
  } | null;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string) => void;
  onToggleStatus?: (productId: string, isActive: boolean) => void;
  onViewDetails?: (productId: string) => void;
  emptyMessage?: string;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[8]};

  ${theme.breakpoints.md && `
    @media (max-width: ${theme.breakpoints.md}) {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: ${theme.spacing[4]};
    }
  `}

  ${theme.breakpoints.sm && `
    @media (max-width: ${theme.breakpoints.sm}) {
      grid-template-columns: 1fr;
      gap: ${theme.spacing[4]};
    }
  `}
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[16]};
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${theme.colors.background.accent};
  border-top: 4px solid ${theme.colors.primaryPurple};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: ${theme.spacing[4]};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const ErrorContainer = styled(Card)`
  text-align: center;
  padding: ${theme.spacing[8]};
  margin: ${theme.spacing[6]} 0;
`;

const ErrorIcon = styled.div`
  color: ${theme.colors.error};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.error};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const ErrorMessage = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing[4]} 0;
`;

const EmptyContainer = styled(Card)`
  text-align: center;
  padding: ${theme.spacing[12]};
  margin: ${theme.spacing[6]} 0;
`;

const EmptyIcon = styled.div`
  color: ${theme.colors.warmGray};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const EmptyMessage = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing[4]} 0;
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${theme.spacing[8]};
`;

const LoadMoreButton = styled(Button)`
  min-width: 200px;
`;

const GridStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[4]};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: ${theme.colors.background.accent};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.light};
`;

const StatsText = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const ProductCount = styled.span`
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
`;

const ViewToggleContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
`;

const ViewToggleButton = styled.button<{ isActive: boolean }>`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  background: ${({ isActive }) => 
    isActive ? theme.colors.primaryPurple : theme.colors.background.light};
  color: ${({ isActive }) => 
    isActive ? theme.colors.white : theme.colors.text.secondary};
  border: 1px solid ${({ isActive }) => 
    isActive ? theme.colors.primaryPurple : theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};

  &:hover {
    background: ${({ isActive }) => 
      isActive ? theme.colors.primaryPurple : theme.colors.softPurple};
    border-color: ${theme.colors.primaryPurple};
  }
`;

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  error = null,
  hasMore = false,
  onLoadMore,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
  emptyMessage = "No se encontraron productos que coincidan con los filtros aplicados."
}) => {
  if (loading && products.length === 0) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Cargando productos...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorIcon>
          <AlertTriangle size={48} />
        </ErrorIcon>
        <ErrorTitle>Error al cargar productos</ErrorTitle>
        <ErrorMessage>{error}</ErrorMessage>
        <Button
          variant="primary"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </ErrorContainer>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyContainer>
        <EmptyIcon>
          <Package size={48} />
        </EmptyIcon>
        <EmptyTitle>No hay productos</EmptyTitle>
        <EmptyMessage>{emptyMessage}</EmptyMessage>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Recargar
        </Button>
      </EmptyContainer>
    );
  }

  return (
    <>
      <GridStats>
        <StatsText>
          Mostrando <ProductCount>{products.length}</ProductCount> productos
        </StatsText>
        
        <ViewToggleContainer>
          <ViewToggleButton isActive={true}>
            <Grid3X3 size={14} />
            Grid
          </ViewToggleButton>
          <ViewToggleButton isActive={false}>
            <List size={14} />
            Lista
          </ViewToggleButton>
        </ViewToggleContainer>
      </GridStats>

      <GridContainer>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            {...(onEdit && { onEdit })}
            {...(onDelete && { onDelete })}
            {...(onToggleStatus && { onToggleStatus })}
            {...(onViewDetails && { onViewDetails })}
          />
        ))}
      </GridContainer>

      {hasMore && onLoadMore && (
        <LoadMoreContainer>
          <LoadMoreButton
            variant="outline"
            size="large"
            onClick={onLoadMore}
            isLoading={loading}
          >
            {loading ? 'Cargando...' : 'Cargar Más Productos'}
          </LoadMoreButton>
        </LoadMoreContainer>
      )}
    </>
  );
};
