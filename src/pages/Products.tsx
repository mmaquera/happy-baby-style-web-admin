import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useProducts } from '@/hooks/useProductsGraphQL';
import { ProductFilters, PRODUCT_CATEGORIES, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types';
import { Plus, Search, Filter, Grid, List, Edit, Trash2, Eye, Tag, Star } from 'lucide-react';

const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  font-weight: ${theme.fontWeights.light};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const PageSubtitle = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  align-items: center;

  @media (max-width: ${theme.breakpoints.md}) {
    justify-content: space-between;
  }
`;

const FiltersSection = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;

  @media (max-width: ${theme.breakpoints.md}) {
    max-width: none;
  }
`;

const FilterSelect = styled.select`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  font-size: ${theme.fontSizes.base};
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.base};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.primaryPurple};
    box-shadow: 0 0 0 3px ${theme.colors.primaryPurple}20;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: ${theme.colors.lightGray};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[1]};
`;

const ViewButton = styled.button<{ active?: boolean }>`
  background: ${({ active }) => active ? theme.colors.white : 'transparent'};
  border: none;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  color: ${({ active }) => active ? theme.colors.primaryPurple : theme.colors.warmGray};
  box-shadow: ${({ active }) => active ? theme.shadows.sm : 'none'};

  &:hover {
    color: ${theme.colors.primaryPurple};
  }
`;

const ProductsGrid = styled.div<{ view: 'grid' | 'list' }>`
  display: grid;
  gap: ${theme.spacing[4]};

  ${({ view }) => view === 'grid' ? `
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  ` : `
    grid-template-columns: 1fr;
  `}

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled(Card)<{ view?: 'grid' | 'list' }>`
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.card};
  }

  ${({ view }) => view === 'list' && `
    .product-content {
      display: flex;
      align-items: center;
      gap: ${theme.spacing[4]};
    }

    .product-image {
      width: 120px;
      height: 120px;
      flex-shrink: 0;
    }

    .product-info {
      flex: 1;
    }

    .product-actions {
      flex-shrink: 0;
    }
  `}
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${theme.colors.lightGray};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing[4]};
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductPlaceholder = styled.div`
  font-size: ${theme.fontSizes['4xl']};
  color: ${theme.colors.warmGray};
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
  margin-bottom: ${theme.spacing[3]};
`;

const ProductDetail = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  display: flex;
  justify-content: space-between;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
`;

const CurrentPrice = styled.div`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.primaryPurple};
`;

const OriginalPrice = styled.div`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.warmGray};
  text-decoration: line-through;
`;

const DiscountBadge = styled.div`
  background: ${theme.colors.coralAccent};
  color: ${theme.colors.white};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
`;

const ProductStatus = styled.div<{ isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  background: ${({ isActive }) => isActive ? `${theme.colors.success}20` : `${theme.colors.warmGray}20`};
  color: ${({ isActive }) => isActive ? theme.colors.success : theme.colors.warmGray};
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  margin-bottom: ${theme.spacing[2]};
`;

const RatingStars = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const StarIcon = styled(Star)<{ filled?: boolean }>`
  width: 16px;
  height: 16px;
  color: ${({ filled }) => filled ? theme.colors.coralAccent : theme.colors.warmGray};
  fill: ${({ filled }) => filled ? theme.colors.coralAccent : 'none'};
`;

const ProductActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  color: ${theme.colors.warmGray};

  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.primaryPurple};
  }

  &.danger:hover {
    background: ${theme.colors.error}20;
    color: ${theme.colors.error};
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing[12]};
  color: ${theme.colors.text.secondary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[12]};
  text-align: center;
  color: ${theme.colors.text.secondary};
`;

const EmptyIcon = styled.div`
  font-size: ${theme.fontSizes['5xl']};
  margin-bottom: ${theme.spacing[4]};
`;

const VariantCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

export const Products: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Simplified call to test if the hook works
  const { products, loading: isLoading, error } = useProducts({
    filter: {
      isActive: true
    }
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categoryId: categoryId || undefined
    }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      isActive: status === 'active' ? true : status === 'inactive' ? false : undefined
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  };

  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon key={i} filled={i <= rating} />
      );
    }
    return stars;
  };

  if (isLoading) {
    return (
      <ProductsContainer>
        <LoadingState>
          Cargando productos...
        </LoadingState>
      </ProductsContainer>
    );
  }

  if (error) {
    return (
      <ProductsContainer>
        <EmptyState>
          <EmptyIcon>⚠️</EmptyIcon>
          <h3>Error al cargar productos</h3>
          <p>Por favor, inténtalo de nuevo más tarde.</p>
        </EmptyState>
      </ProductsContainer>
    );
  }

  return (
    <ProductsContainer>
      <PageHeader>
        <HeaderLeft>
          <PageTitle>Productos</PageTitle>
          <PageSubtitle>Gestiona el catálogo de productos</PageSubtitle>
        </HeaderLeft>
        <HeaderActions>
          <ViewToggle>
            <ViewButton active={view === 'grid'} onClick={() => setView('grid')}>
              <Grid size={16} />
            </ViewButton>
            <ViewButton active={view === 'list'} onClick={() => setView('list')}>
              <List size={16} />
            </ViewButton>
          </ViewToggle>
          <Button icon={<Plus size={16} />}>
            Agregar Producto
          </Button>
        </HeaderActions>
      </PageHeader>

      <FiltersSection>
        <SearchContainer>
          <Input
            placeholder="Buscar productos..."
            leftIcon={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            fullWidth
          />
        </SearchContainer>

        <FilterSelect onChange={(e) => handleCategoryFilter(e.target.value)}>
          <option value="">Todas las categorías</option>
          {PRODUCT_CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect onChange={(e) => handleStatusFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </FilterSelect>
      </FiltersSection>

      {products.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📦</EmptyIcon>
          <h3>No hay productos</h3>
          <p>Comienza agregando tu primer producto al catálogo.</p>
          <Button icon={<Plus size={16} />} style={{ marginTop: theme.spacing[4] }}>
            Agregar Producto
          </Button>
        </EmptyState>
      ) : (
        <ProductsGrid view={view}>
          {products.map((product) => (
            <ProductCard key={product.id} view={view} padding="medium" shadow="small" hover>
              <div className="product-content">
                <ProductImage className="product-image">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <ProductPlaceholder>👕</ProductPlaceholder>
                  )}
                </ProductImage>

                <ProductInfo className="product-info">
                  <ProductName>{product.name}</ProductName>
                  
                  <ProductRating>
                    <RatingStars>
                      {renderRating(product.rating)}
                    </RatingStars>
                    <span>({product.reviewCount})</span>
                  </ProductRating>
                  
                  <ProductDetails>
                    <ProductDetail>
                      <span>SKU:</span>
                      <span>{product.sku}</span>
                    </ProductDetail>
                    <ProductDetail>
                      <span>Categoría:</span>
                      <span>{product.category?.name || 'Sin categoría'}</span>
                    </ProductDetail>
                    <ProductDetail>
                      <span>Stock:</span>
                      <span>{product.stockQuantity} unidades</span>
                    </ProductDetail>
                    <ProductDetail>
                      <span>Variantes:</span>
                      <VariantCount>
                        <Tag size={12} />
                        {product.variants?.length || 0}
                      </VariantCount>
                    </ProductDetail>
                  </ProductDetails>

                  <ProductPrice>
                    <CurrentPrice>
                      {formatPrice(product.salePrice || product.price)}
                    </CurrentPrice>
                    {product.salePrice && (
                      <>
                        <OriginalPrice>
                          {formatPrice(product.price)}
                        </OriginalPrice>
                        <DiscountBadge>
                          -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                        </DiscountBadge>
                      </>
                    )}
                  </ProductPrice>

                  <ProductStatus isActive={product.isActive}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </ProductStatus>
                </ProductInfo>

                <ProductActions className="product-actions">
                  <ActionButton title="Ver detalles">
                    <Eye size={16} />
                  </ActionButton>
                  <ActionButton title="Editar">
                    <Edit size={16} />
                  </ActionButton>
                  <ActionButton className="danger" title="Eliminar">
                    <Trash2 size={16} />
                  </ActionButton>
                </ProductActions>
              </div>
            </ProductCard>
          ))}
        </ProductsGrid>
      )}
    </ProductsContainer>
  );
};