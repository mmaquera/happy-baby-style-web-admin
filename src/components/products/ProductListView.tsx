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
  SortDesc
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  sku: string;
  images: string[];
  attributes: any;
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
    attributes: any;
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
  onFilter: (filters: any) => void;
}

// =====================================================
// STYLED COMPONENTS - Minimalist Design
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
  background: ${theme.colors.background.light};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  
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
  cursor: ${({ sortable }) => sortable ? 'pointer' : 'default'};
  user-select: none;
  
  ${({ sortable }) => sortable && `
    &:hover {
      color: ${theme.colors.primaryPurple};
    }
  `}
`;

const SortIcon = styled.div`
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
`;

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 60px 200px 120px 100px 100px 120px 100px 120px 100px 80px;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.border.light};
  align-items: center;
  transition: background-color ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.background.accent};
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
`;

const StockStatus = styled.div<{ isLowStock: boolean; isOutOfStock: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${({ isOutOfStock, isLowStock }) => 
    isOutOfStock ? theme.colors.error : 
    isLowStock ? theme.colors.warning : 
    theme.colors.success};
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
  background: ${({ isActive }) => isActive ? `${theme.colors.success}20` : `${theme.colors.warning}20`};
  color: ${({ isActive }) => isActive ? theme.colors.success : theme.colors.warning};
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[1]};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing[1]};
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.text.primary};
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
  border: 1px solid ${({ isActive }) => 
    isActive ? theme.colors.primaryPurple : theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover:not(:disabled) {
    background: ${({ isActive }) => 
      isActive ? theme.colors.primaryPurple : theme.colors.softPurple};
    border-color: ${theme.colors.primaryPurple};
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
  onFilter
}) => {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = useCallback((field: string) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSort(field, newDirection);
  }, [sortField, sortDirection, onSort]);

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return (
      <SortIcon>
        {sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
      </SortIcon>
    );
  };

  if (loading) {
    return (
      <EmptyState>
        <EmptyIcon>
          <Package size={48} />
        </EmptyIcon>
        <EmptyTitle>Cargando productos...</EmptyTitle>
        <EmptyMessage>Por favor espera mientras se cargan los datos</EmptyMessage>
      </EmptyState>
    );
  }

  if (error) {
    return (
      <EmptyState>
        <EmptyIcon>
          <AlertTriangle size={48} />
        </EmptyIcon>
        <EmptyTitle>Error al cargar productos</EmptyTitle>
        <EmptyMessage>{error}</EmptyMessage>
      </EmptyState>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>
          <Package size={48} />
        </EmptyIcon>
        <EmptyTitle>No hay productos</EmptyTitle>
        <EmptyMessage>No se encontraron productos que coincidan con los criterios de búsqueda</EmptyMessage>
      </EmptyState>
    );
  }

  return (
    <ListViewContainer>
      {/* Simplified Header - Only Context Information */}
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

      {/* Product Table - Clean and Focused */}
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

        {products.map((product) => (
          <ProductRow key={product.id}>
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
              <CurrentPrice>{CURRENCY_SYMBOL} {product.currentPrice}</CurrentPrice>
              {product.hasDiscount && (
                <>
                  <OriginalPrice>{CURRENCY_SYMBOL} {product.price}</OriginalPrice>
                  <DiscountBadge>-{product.discountPercentage}%</DiscountBadge>
                </>
              )}
            </PriceContainer>

            <StockStatus 
              isLowStock={product.stockQuantity <= 10 && product.stockQuantity > 0}
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

            <div>
              {new Date(product.createdAt).toLocaleDateString('es-ES')}
            </div>

            <StatusBadge isActive={product.isActive}>
              {product.isActive ? 'Activo' : 'Inactivo'}
            </StatusBadge>

            <ActionsContainer>
              <ActionButton onClick={() => onViewDetails(product.id)} title="Ver detalles">
                <Eye size={16} />
              </ActionButton>
              <ActionButton onClick={() => onEdit(product.id)} title="Editar">
                <Edit size={16} />
              </ActionButton>
              <ActionButton onClick={() => onToggleStatus(product.id, !product.isActive)} title="Cambiar estado">
                {product.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
              </ActionButton>
              <ActionButton onClick={() => onDelete(product.id)} title="Eliminar">
                <Trash2 size={16} />
              </ActionButton>
            </ActionsContainer>
          </ProductRow>
        ))}
      </ProductTable>

      {/* Pagination - Clean and Accessible */}
      {totalPages > 1 && (
        <PaginationContainer>
          <PageButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </PageButton>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PageButton
              key={page}
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PageButton>
          ))}

          <PageButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasMore}
          >
            Siguiente
          </PageButton>
        </PaginationContainer>
      )}
    </ListViewContainer>
  );
};
