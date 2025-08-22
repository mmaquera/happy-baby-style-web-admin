import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Eye,
  Edit,
  Trash2,
  Package
} from 'lucide-react';

interface ProductCardProps {
  product: {
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
  };
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string) => void;
  onToggleStatus?: (productId: string, isActive: boolean) => void;
  onViewDetails?: (productId: string) => void;
}

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;
  background: ${theme.colors.background.light};
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${theme.transitions.base};
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    ${theme.colors.primaryPurple}20 0%,
    ${theme.colors.turquoise}20 100%
  );
  opacity: 0;
  transition: opacity ${theme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusBadge = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: ${theme.spacing[3]};
  right: ${theme.spacing[3]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: ${({ isActive }) => isActive ? theme.colors.success : theme.colors.warning};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  border-radius: ${theme.borderRadius.full};
  z-index: 1;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const StockBadge = styled.div<{ isLowStock: boolean; isOutOfStock: boolean }>`
  position: absolute;
  top: ${theme.spacing[3]};
  left: ${theme.spacing[3]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: ${({ isOutOfStock, isLowStock }) => 
    isOutOfStock ? theme.colors.error : 
    isLowStock ? theme.colors.warning : 
    theme.colors.success};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  border-radius: ${theme.borderRadius.full};
  z-index: 1;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const ProductInfo = styled.div`
  padding: ${theme.spacing[4]};
`;

const ProductName = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductDescription = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing[3]} 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
`;

const CurrentPrice = styled.span`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primaryPurple};
`;

const OriginalPrice = styled.span`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.warmGray};
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  background: ${theme.colors.coralAccent};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[3]};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const StarIcon = styled(Star)`
  color: ${theme.colors.warning};
  width: 16px;
  height: 16px;
`;

const CategoryTag = styled.span`
  background: ${theme.colors.softPurple};
  color: ${theme.colors.primaryPurple};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[1]};
  margin-bottom: ${theme.spacing[3]};
`;

const Tag = styled.span`
  background: ${theme.colors.background.accent};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.xs};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  flex-wrap: wrap;
`;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails
}) => {
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;
  
  const isLowStock = product.stockQuantity <= 5 && product.stockQuantity > 0;
  const isOutOfStock = product.stockQuantity === 0;
  
  const currentPrice = product.salePrice || product.price;
  const safeCurrentPrice = typeof currentPrice === 'number' ? currentPrice : product.price;

  return (
    <Card hover clickable shadow="medium" padding="small">
      <ProductImageContainer>
        {product.images.length > 0 ? (
          <ProductImage 
            src={product.images[0]} 
            alt={product.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme.colors.background.light,
            color: theme.colors.warmGray,
            fontSize: theme.fontSizes.sm
          }}>
            <Package size={24} data-testid="placeholder-icon" />
          </div>
        )}
        
        <ImageOverlay />
        
        <StatusBadge isActive={product.isActive}>
          {product.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
          {product.isActive ? 'Activo' : 'Inactivo'}
        </StatusBadge>
        
        <StockBadge isLowStock={isLowStock} isOutOfStock={isOutOfStock}>
          {isOutOfStock ? <XCircle size={12} /> : 
           isLowStock ? <AlertTriangle size={12} /> : 
           <CheckCircle size={12} />}
          {isOutOfStock ? 'Sin stock' : isLowStock ? 'Stock bajo' : 'En stock'}
        </StockBadge>
      </ProductImageContainer>

      <ProductInfo>
        {product.category && (
          <CategoryTag>{product.category.name}</CategoryTag>
        )}
        
        <ProductName>{product.name}</ProductName>
        
        {product.description && (
          <ProductDescription>{product.description}</ProductDescription>
        )}
        
        <PriceContainer>
          <CurrentPrice>S/ {safeCurrentPrice.toFixed(2)}</CurrentPrice>
          {hasDiscount && (
            <>
              <OriginalPrice>S/ {product.price.toFixed(2)}</OriginalPrice>
              <DiscountBadge>-{discountPercentage}%</DiscountBadge>
            </>
          )}
        </PriceContainer>
        
        <ProductMeta>
          <RatingContainer>
            <StarIcon />
            <span>{product.rating?.toFixed(1) || 'N/A'}</span>
            <span>({product.reviewCount})</span>
          </RatingContainer>
          <span>Stock: {product.stockQuantity}</span>
        </ProductMeta>
        
        {product.tags.length > 0 && (
          <TagsContainer>
            {product.tags.slice(0, 3).map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
            {product.tags.length > 3 && (
              <Tag>+{product.tags.length - 3}</Tag>
            )}
          </TagsContainer>
        )}
        
        <ActionsContainer>
          {onViewDetails && (
            <Button
              variant="primary"
              size="small"
              onClick={() => onViewDetails(product.id)}
              fullWidth
              aria-label="Ver detalles del producto"
            >
              <Eye size={14} />
              Ver Detalles
            </Button>
          )}
          
          {onEdit && (
            <Button
              variant="outline"
              size="small"
              onClick={() => onEdit(product.id)}
              aria-label="Editar producto"
            >
              <Edit size={14} />
              Editar
            </Button>
          )}
          
          {onToggleStatus && (
            <Button
              variant={product.isActive ? "ghost" : "secondary"}
              size="small"
              onClick={() => onToggleStatus(product.id, !product.isActive)}
              aria-label="Cambiar estado del producto"
            >
              {product.isActive ? 'Desactivar' : 'Activar'}
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="danger"
              size="small"
              onClick={() => onDelete(product.id)}
              aria-label="Eliminar producto"
            >
              <Trash2 size={14} />
              Eliminar
            </Button>
          )}
        </ActionsContainer>
      </ProductInfo>
    </Card>
  );
};
