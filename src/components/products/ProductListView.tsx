import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CURRENCY_SYMBOL } from '@/config/currency';
import {
  List,
  Eye,
  Edit,
  Trash2,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Star,
  SortAsc,
  SortDesc,
  MoreHorizontal,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  sku: string;
  images: string[];
  attributes: Record<string, unknown>;
  isActive: boolean;
  stockQuantity: number;
  tags: string[];
  rating?: number | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  currentPrice: number;
  hasDiscount: boolean;
  discountPercentage: number;
  totalStock: number;
  isInStock: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
  } | null;
  variants: Array<{
    id: string;
    name: string;
    price: number;
    sku: string;
    stockQuantity: number;
    attributes: Record<string, unknown>;
    isActive: boolean;
    isInStock: boolean;
  }>;
}

interface ProductListViewProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
  onToggleStatus: (productId: string, isActive: boolean) => void;
  onViewDetails: (productId: string) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  onFilter: (filters: Record<string, unknown>) => void;
}

// =====================================================
// STYLED COMPONENTS - Enhanced Minimalist Design
// =====================================================

const ListViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const ListViewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[4]};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.sm};

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${theme.spacing[3]};
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.md}) {
    justify-content: center;
    gap: ${theme.spacing[2]};
  }
`;

const ViewModeIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  background: ${theme.colors.primaryPurple};
  color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  box-shadow: ${theme.shadows.sm};
`;

const ProductCount = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.fontWeights.medium};
`;

const ProductTable = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 60px 200px 120px 100px 100px 120px 100px 120px 100px 80px;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  background: ${theme.colors.background.accent};
  border-bottom: 1px solid ${theme.colors.border.light};
  font-weight: ${theme.fontWeights.medium};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 50px 150px 100px 80px 80px 80px 80px 80px;
    gap: ${theme.spacing[2]};
    padding: ${theme.spacing[3]};
    font-size: ${theme.fontSizes.xs};
  }
`;

const TableHeaderCell = styled.div<{ sortable?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  cursor: ${({ sortable }) => (sortable ? 'pointer' : 'default')};
  user-select: none;
  transition: all ${theme.transitions.fast};
  padding: ${theme.spacing[1]};
  border-radius: ${theme.borderRadius.sm};

  ${({ sortable }) =>
    sortable &&
    `
    &:hover {
      color: ${theme.colors.primaryPurple};
      background: ${theme.colors.background.light};
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${theme.colors.primaryPurple}40;
    }
  `}
`;

const SortIcon = styled.div`
  color: ${theme.colors.primaryPurple};
  display: flex;
  align-items: center;
  opacity: 0.8;
`;

const ProductRow = styled.div<{ isEven: boolean }>`
  display: grid;
  grid-template-columns: 60px 200px 120px 100px 100px 120px 100px 120px 100px 80px;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.border.light};
  align-items: center;
  transition: all ${theme.transitions.base};
  background: ${({ isEven }) =>
    isEven ? theme.colors.white : theme.colors.background.light};
  position: relative;

  &:hover {
    background: ${theme.colors.background.accent};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.sm};
  }

  &:focus-within {
    background: ${theme.colors.background.accent};
    box-shadow: 0 0 0 2px ${theme.colors.primaryPurple}20;
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 50px 150px 100px 80px 80px 80px 80px 80px;
    gap: ${theme.spacing[2]};
    padding: ${theme.spacing[3]};
  }
`;

const ProductImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  background: ${theme.colors.background.light};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.colors.border.light};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`;

const ProductName = styled.div`
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.sm};
  line-height: 1.3;
`;

const ProductSku = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  font-family: ${theme.fonts.mono};
`;

const ProductCategory = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`;

const CurrentPrice = styled.div`
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.primaryPurple};
  font-size: ${theme.fontSizes.sm};
`;

const OriginalPrice = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.warmGray};
  text-decoration: line-through;
`;

const DiscountBadge = styled.div`
  background: ${theme.colors.coralAccent};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xs};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  text-align: center;
  font-weight: ${theme.fontWeights.medium};
  box-shadow: ${theme.shadows.sm};
`;

const StockStatus = styled.div<{ isLowStock: boolean; isOutOfStock: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${({ isOutOfStock, isLowStock }) =>
    isOutOfStock
      ? theme.colors.error
      : isLowStock
        ? theme.colors.warning
        : theme.colors.success};
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-size: ${theme.fontSizes.sm};
`;

const StarIcon = styled(Star)`
  color: ${theme.colors.warning};
  width: 14px;
  height: 14px;
`;

const StatusBadge = styled.div<{ isActive: boolean }>`
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  text-align: center;
  background: ${({ isActive }) =>
    isActive ? `${theme.colors.success}15` : `${theme.colors.warning}15`};
  color: ${({ isActive }) =>
    isActive ? theme.colors.success : theme.colors.warning};
  border: 1px solid
    ${({ isActive }) =>
      isActive ? `${theme.colors.success}30` : `${theme.colors.warning}30`};
`;

// Enhanced Action Buttons with Minimalist Design
const ActionsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[1]};
  position: relative;
`;

const ActionButton = styled.button<{
  variant: 'view' | 'edit' | 'toggle' | 'delete';
  isActive?: boolean;
}>`
  background: ${({ variant, isActive }) => {
    if (isActive) return theme.colors.primaryPurple;
    switch (variant) {
      case 'view':
        return theme.colors.background.light;
      case 'edit':
        return theme.colors.background.light;
      case 'toggle':
        return theme.colors.background.light;
      case 'delete':
        return theme.colors.background.light;
      default:
        return theme.colors.background.light;
    }
  }};
  border: 1px solid
    ${({ variant, isActive }) => {
      if (isActive) return theme.colors.primaryPurple;
      switch (variant) {
        case 'view':
          return theme.colors.border.light;
        case 'edit':
          return theme.colors.border.light;
        case 'toggle':
          return theme.colors.border.light;
        case 'delete':
          return theme.colors.border.light;
        default:
          return theme.colors.border.light;
      }
    }};
  color: ${({ variant, isActive }) => {
    if (isActive) return theme.colors.white;
    switch (variant) {
      case 'view':
        return theme.colors.info;
      case 'edit':
        return theme.colors.primaryPurple;
      case 'toggle':
        return theme.colors.warning;
      case 'delete':
        return theme.colors.error;
      default:
        return theme.colors.text.secondary;
    }
  }};
  cursor: pointer;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.base};
  min-width: 36px;
  height: 36px;
  position: relative;
  font-size: ${theme.fontSizes.xs};

  &:hover {
    background: ${({ variant, isActive }) => {
      if (isActive) return theme.colors.primaryPurple;
      switch (variant) {
        case 'view':
          return `${theme.colors.info}15`;
        case 'edit':
          return `${theme.colors.primaryPurple}15`;
        case 'toggle':
          return `${theme.colors.warning}15`;
        case 'delete':
          return `${theme.colors.error}15`;
        default:
          return theme.colors.background.accent;
      }
    }};
    border-color: ${({ variant, isActive }) => {
      if (isActive) return theme.colors.primaryPurple;
      switch (variant) {
        case 'view':
          return theme.colors.info;
        case 'edit':
          return theme.colors.primaryPurple;
        case 'toggle':
          return theme.colors.warning;
        case 'delete':
          return theme.colors.error;
        default:
          return theme.colors.border.medium;
      }
    }};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.sm};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${theme.shadows.sm};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primaryPurple}40;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[1]};
    min-width: 32px;
    height: 32px;
  }
`;

const ActionTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.colors.darkGray};
  color: ${theme.colors.white};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.xs};
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all ${theme.transitions.fast};
  z-index: 1000;
  margin-bottom: ${theme.spacing[1]};
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${theme.colors.darkGray};
  }
`;

const ActionButtonWrapper = styled.div`
  position: relative;

  &:hover ${ActionTooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.sm};

  @media (max-width: ${theme.breakpoints.md}) {
    flex-wrap: wrap;
    gap: ${theme.spacing[2]};
  }
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  background: ${({ isActive }) =>
    isActive ? theme.colors.primaryPurple : theme.colors.background.accent};
  color: ${({ isActive }) =>
    isActive ? theme.colors.white : theme.colors.text.primary};
  border: 1px solid
    ${({ isActive }) =>
      isActive ? theme.colors.primaryPurple : theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover:not(:disabled) {
    background: ${({ isActive }) =>
      isActive ? theme.colors.primaryPurple : theme.colors.softPurple};
    border-color: ${theme.colors.primaryPurple};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.sm};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: ${theme.shadows.sm};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[12]};
  color: ${theme.colors.text.secondary};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.sm};
`;

const EmptyIcon = styled.div`
  color: ${theme.colors.warmGray};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
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
  margin: 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[12]};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.sm};
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${theme.colors.background.accent};
  border-top: 3px solid ${theme.colors.primaryPurple};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: ${theme.spacing[4]};

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
  font-weight: ${theme.fontWeights.medium};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.error}30;
  box-shadow: ${theme.shadows.sm};
`;

const ErrorIcon = styled.div`
  color: ${theme.colors.error};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
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
  margin: 0;
`;

// =====================================================
// COMPONENT - Clean and Focused
// =====================================================

export const ProductListView: React.FC<ProductListViewProps> = ({
  products,
  loading = false,
  error = null,
  total,
  currentPage,
  totalPages,
  hasMore,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
  onSort,
  onFilter,
}) => {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const handleSort = useCallback(
    (field: string) => {
      const newDirection =
        sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
      setSortField(field);
      setSortDirection(newDirection);
      onSort(field, newDirection);
    },
    [sortField, sortDirection, onSort]
  );

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return (
      <SortIcon>
        {sortDirection === 'asc' ? (
          <SortAsc size={14} />
        ) : (
          <SortDesc size={14} />
        )}
      </SortIcon>
    );
  };

  const handleRowHover = useCallback((productId: string | null) => {
    setHoveredProduct(productId);
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Cargando productos...</LoadingText>
        <EmptyMessage>
          Por favor espera mientras se cargan los datos
        </EmptyMessage>
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
      </ErrorContainer>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>
          <Package size={48} />
        </EmptyIcon>
        <EmptyTitle>No hay productos</EmptyTitle>
        <EmptyMessage>
          No se encontraron productos que coincidan con los criterios de
          búsqueda
        </EmptyMessage>
      </EmptyState>
    );
  }

  return (
    <ListViewContainer>
      {/* Enhanced Header with Better Visual Hierarchy */}
      <ListViewHeader>
        <HeaderLeft>
          <ViewModeIndicator>
            <List size={16} />
            Vista de Lista
          </ViewModeIndicator>
          <ProductCount>
            Mostrando {products.length} de {total} productos
          </ProductCount>
        </HeaderLeft>
      </ListViewHeader>

      {/* Enhanced Product Table with Better UX */}
      <ProductTable>
        <TableHeader>
          <div>Imagen</div>
          <TableHeaderCell sortable onClick={() => handleSort('name')}>
            Producto {renderSortIcon('name')}
          </TableHeaderCell>
          <TableHeaderCell sortable onClick={() => handleSort('category')}>
            Categoría {renderSortIcon('category')}
          </TableHeaderCell>
          <TableHeaderCell sortable onClick={() => handleSort('price')}>
            Precio {renderSortIcon('price')}
          </TableHeaderCell>
          <TableHeaderCell sortable onClick={() => handleSort('stockQuantity')}>
            Stock {renderSortIcon('stockQuantity')}
          </TableHeaderCell>
          <TableHeaderCell sortable onClick={() => handleSort('rating')}>
            Rating {renderSortIcon('rating')}
          </TableHeaderCell>
          <TableHeaderCell sortable onClick={() => handleSort('createdAt')}>
            Creado {renderSortIcon('createdAt')}
          </TableHeaderCell>
          <TableHeaderCell sortable onClick={() => handleSort('isActive')}>
            Estado {renderSortIcon('isActive')}
          </TableHeaderCell>
          <div>Acciones</div>
        </TableHeader>

        {products.map((product, index) => (
          <ProductRow
            key={product.id}
            isEven={index % 2 === 0}
            onMouseEnter={() => handleRowHover(product.id)}
            onMouseLeave={() => handleRowHover(null)}
            tabIndex={0}
          >
            <ProductImage>
              {product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} />
              ) : (
                <Package size={24} />
              )}
            </ProductImage>

            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductSku>{product.sku}</ProductSku>
            </ProductInfo>

            <ProductCategory>
              {product.category?.name || 'Sin categoría'}
            </ProductCategory>

            <PriceContainer>
              <CurrentPrice>
                {CURRENCY_SYMBOL} {product.currentPrice}
              </CurrentPrice>
              {product.hasDiscount && (
                <>
                  <OriginalPrice>
                    {CURRENCY_SYMBOL} {product.price}
                  </OriginalPrice>
                  <DiscountBadge>-{product.discountPercentage}%</DiscountBadge>
                </>
              )}
            </PriceContainer>

            <StockStatus
              isLowStock={
                product.stockQuantity <= 10 && product.stockQuantity > 0
              }
              isOutOfStock={product.stockQuantity === 0}
            >
              {product.stockQuantity === 0 ? (
                <XCircle size={14} />
              ) : product.stockQuantity <= 10 ? (
                <AlertTriangle size={14} />
              ) : (
                <CheckCircle size={14} />
              )}
              {product.stockQuantity}
            </StockStatus>

            <RatingContainer>
              <StarIcon />
              <span>{product.rating?.toFixed(1) || 'N/A'}</span>
              <span>({product.reviewCount})</span>
            </RatingContainer>

            <div>{new Date(product.createdAt).toLocaleDateString('es-ES')}</div>

            <StatusBadge isActive={product.isActive}>
              {product.isActive ? 'Activo' : 'Inactivo'}
            </StatusBadge>

            <ActionsContainer>
              <ActionButtonWrapper>
                <ActionButton
                  variant='view'
                  onClick={() => onViewDetails(product.id)}
                  title='Ver detalles'
                  aria-label={`Ver detalles de ${product.name}`}
                >
                  <Eye size={16} />
                </ActionButton>
                <ActionTooltip>Ver detalles</ActionTooltip>
              </ActionButtonWrapper>

              <ActionButtonWrapper>
                <ActionButton
                  variant='edit'
                  onClick={() => onEdit(product.id)}
                  title='Editar'
                  aria-label={`Editar ${product.name}`}
                >
                  <Edit size={16} />
                </ActionButton>
                <ActionTooltip>Editar</ActionTooltip>
              </ActionButtonWrapper>

              <ActionButtonWrapper>
                <ActionButton
                  variant='toggle'
                  onClick={() => onToggleStatus(product.id, !product.isActive)}
                  title={product.isActive ? 'Desactivar' : 'Activar'}
                  aria-label={`${product.isActive ? 'Desactivar' : 'Activar'} ${product.name}`}
                >
                  {product.isActive ? (
                    <XCircle size={16} />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                </ActionButton>
                <ActionTooltip>
                  {product.isActive ? 'Desactivar' : 'Activar'}
                </ActionTooltip>
              </ActionButtonWrapper>

              <ActionButtonWrapper>
                <ActionButton
                  variant='delete'
                  onClick={() => onDelete(product.id)}
                  title='Eliminar'
                  aria-label={`Eliminar ${product.name}`}
                >
                  <Trash2 size={16} />
                </ActionButton>
                <ActionTooltip>Eliminar</ActionTooltip>
              </ActionButtonWrapper>
            </ActionsContainer>
          </ProductRow>
        ))}
      </ProductTable>

      {/* Enhanced Pagination with Better Visual Feedback */}
      {totalPages > 1 && (
        <PaginationContainer>
          <PageButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label='Página anterior'
          >
            Anterior
          </PageButton>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PageButton
              key={page}
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
              aria-label={`Página ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </PageButton>
          ))}

          <PageButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasMore}
            aria-label='Página siguiente'
          >
            Siguiente
          </PageButton>
        </PaginationContainer>
      )}
    </ListViewContainer>
  );
};
