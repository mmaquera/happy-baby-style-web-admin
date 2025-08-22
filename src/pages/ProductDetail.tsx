import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Edit,
  Trash2,
  Package,
  Eye,
  Settings,
  Download,
  Upload,
  Printer
} from 'lucide-react';

// Mock product data - in real app this would come from GraphQL
const mockProduct = {
  id: '1',
  name: 'Body Orgánico para Recién Nacido',
  description: 'Body 100% algodón orgánico, suave y transpirable para la piel sensible del bebé. Diseñado con costuras planas para evitar irritaciones y etiquetas removibles para mayor comodidad.',
  price: 25.99,
  salePrice: 19.99,
  sku: 'BODY-ORG-001',
  images: [
    'https://via.placeholder.com/400x400/FFB6C1/000000?text=Body+Bebe+1',
    'https://via.placeholder.com/400x400/FFB6C1/000000?text=Body+Bebe+2',
    'https://via.placeholder.com/400x400/FFB6C1/000000?text=Body+Bebe+3'
  ],
  stockQuantity: 45,
  isActive: true,
  rating: 4.8,
  reviewCount: 127,
  tags: ['orgánico', 'recién nacido', 'algodón', 'hipoalergénico'],
  category: { name: 'Ropa para Bebés', slug: 'ropa-bebes' },
  attributes: {
    material: '100% Algodón Orgánico',
    talla: '0-3 meses',
    peso: '80g',
    lavado: 'Lavable a máquina 30°C',
    certificaciones: 'GOTS, OEKO-TEX'
  },
  variants: [
    { id: '1', name: 'Blanco', price: 19.99, stockQuantity: 20, isActive: true },
    { id: '2', name: 'Azul Claro', price: 19.99, stockQuantity: 15, isActive: true },
    { id: '3', name: 'Rosa Suave', price: 19.99, stockQuantity: 10, isActive: true }
  ],
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z'
};

const ProductDetailContainer = styled.div`
  padding: ${theme.spacing[6]};
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[4]};
  }
`;

const BackButton = styled(Button)`
  margin-bottom: ${theme.spacing[4]};
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing[6]};
  flex-wrap: wrap;
  gap: ${theme.spacing[4]};
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
  line-height: 1.2;
`;

const ProductSubtitle = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing[3]} 0;
`;

const ProductMeta = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  flex-wrap: wrap;
`;

const ProductContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[8]};
  margin-bottom: ${theme.spacing[8]};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[6]};
  }
`;

const ImageSection = styled.div`
  position: sticky;
  top: ${theme.spacing[6]};
`;

const MainImage = styled.div`
  width: 100%;
  height: 400px;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${theme.spacing[4]};
  background: ${theme.colors.background.light};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing[2]};
`;

const Thumbnail = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 80px;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${({ isActive }) => 
    isActive ? theme.colors.primaryPurple : theme.colors.border.light};
  transition: all ${theme.transitions.base};
  
  &:hover {
    border-color: ${theme.colors.primaryPurple};
    transform: scale(1.05);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
`;

const CurrentPrice = styled.div`
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primaryPurple};
`;

const OriginalPrice = styled.div`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.warmGray};
  text-decoration: line-through;
`;

const DiscountBadge = styled.div`
  background: ${theme.colors.coralAccent};
  color: ${theme.colors.white};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
`;

const StockStatus = styled.div<{ isLowStock: boolean; isOutOfStock: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  background: ${({ isOutOfStock, isLowStock }) => 
    isOutOfStock ? `${theme.colors.error}20` : 
    isLowStock ? `${theme.colors.warning}20` : 
    `${theme.colors.success}20`};
  color: ${({ isOutOfStock, isLowStock }) => 
    isOutOfStock ? theme.colors.error : 
    isLowStock ? theme.colors.warning : 
    theme.colors.success};
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[4]};
`;

const RatingStars = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const StarIcon = styled(Star)`
  color: ${theme.colors.warning};
  width: 20px;
  height: 20px;
`;

const RatingText = styled.span`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
`;

const TagsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`;

const Tag = styled.span`
  background: ${theme.colors.background.accent};
  color: ${theme.colors.text.secondary};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
`;

const AttributesSection = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

const AttributeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[3]};
`;

const AttributeItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  background: ${theme.colors.background.light};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
`;

const AttributeLabel = styled.span`
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.fontWeights.medium};
`;

const AttributeValue = styled.span`
  color: ${theme.colors.text.primary};
`;

const VariantsSection = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

const VariantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing[3]};
`;

const VariantCard = styled(Card)<{ isActive: boolean }>`
  padding: ${theme.spacing[3]};
  text-align: center;
  cursor: pointer;
  transition: all ${theme.transitions.base};
  border: 2px solid ${({ isActive }) => 
    isActive ? theme.colors.primaryPurple : theme.colors.border.light};
  
  &:hover {
    border-color: ${theme.colors.primaryPurple};
    transform: translateY(-2px);
  }
`;

const VariantName = styled.div`
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const VariantPrice = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.primaryPurple};
  font-weight: ${theme.fontWeights.medium};
`;

const VariantStock = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing[1]};
`;

const AdditionalInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[8]};
`;

const InfoCard = styled(Card)`
  height: fit-content;
`;

const InfoCardTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[3]} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const InfoCardContent = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
`;

const StatusBadge = styled.div<{ isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  background: ${({ isActive }) => isActive ? `${theme.colors.success}20` : `${theme.colors.warning}20`};
  color: ${({ isActive }) => isActive ? theme.colors.success : theme.colors.warning};
`;

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // In real app, fetch product by ID from GraphQL
  const product = mockProduct;

  const handleBack = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  const handleEdit = useCallback(() => {
    // TODO: Implement edit functionality
    console.log('Edit product:', product.id);
  }, [product.id]);

  const handleDelete = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      // TODO: Implement delete functionality
      console.log('Delete product:', product.id);
      navigate('/products');
    }
  }, [product.id, navigate]);

  const handleToggleStatus = useCallback(() => {
    // TODO: Implement status toggle
    console.log('Toggle status:', product.id, !product.isActive);
  }, [product.id, product.isActive]);

  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon key={i} fill={i <= rating ? theme.colors.warning : 'none'} />
      );
    }
    return stars;
  };

  const isLowStock = product.stockQuantity <= 10 && product.stockQuantity > 0;
  const isOutOfStock = product.stockQuantity === 0;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <ProductDetailContainer>
      <BackButton variant="ghost" onClick={handleBack}>
        <ArrowLeft size={16} />
        Volver a Productos
      </BackButton>

      <ProductHeader>
        <HeaderLeft>
          <ProductTitle>{product.name}</ProductTitle>
          <ProductSubtitle>{product.description}</ProductSubtitle>
          <ProductMeta>
            <MetaItem>
              <span>SKU:</span>
              <strong>{product.sku}</strong>
            </MetaItem>
            <MetaItem>
              <span>Categoría:</span>
              <strong>{product.category.name}</strong>
            </MetaItem>
            <MetaItem>
              <span>Estado:</span>
              <StatusBadge isActive={product.isActive}>
                {product.isActive ? 'Activo' : 'Inactivo'}
              </StatusBadge>
            </MetaItem>
          </ProductMeta>
        </HeaderLeft>

        <HeaderActions>
          <Button variant="outline" onClick={handleToggleStatus}>
            {product.isActive ? 'Desactivar' : 'Activar'}
          </Button>
          <Button variant="secondary" onClick={handleEdit}>
            <Edit size={16} />
            Editar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 size={16} />
            Eliminar
          </Button>
        </HeaderActions>
      </ProductHeader>

      <ProductContent>
        <ImageSection>
          <MainImage>
            <img 
              src={product.images[selectedImage]} 
              alt={`${product.name} - Imagen ${selectedImage + 1}`}
            />
          </MainImage>
          
          <ThumbnailGrid>
            {product.images.map((image, index) => (
              <Thumbnail
                key={index}
                isActive={index === selectedImage}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.name} - Thumbnail ${index + 1}`} />
              </Thumbnail>
            ))}
          </ThumbnailGrid>
        </ImageSection>

        <InfoSection>
          <PriceSection>
            <CurrentPrice>
              S/ {product.salePrice || product.price}
            </CurrentPrice>
            {hasDiscount && (
              <>
                <OriginalPrice>S/ {product.price}</OriginalPrice>
                <DiscountBadge>-{discountPercentage}%</DiscountBadge>
              </>
            )}
          </PriceSection>

          <StockStatus isLowStock={isLowStock} isOutOfStock={isOutOfStock}>
            {isOutOfStock ? <XCircle size={16} /> : 
             isLowStock ? <AlertTriangle size={16} /> : 
             <CheckCircle size={16} />}
            {isOutOfStock ? 'Sin stock' : 
             isLowStock ? 'Stock bajo' : 'En stock'}
            <span>({product.stockQuantity} unidades)</span>
          </StockStatus>

          <RatingSection>
            <RatingStars>
              {renderRating(product.rating)}
            </RatingStars>
            <RatingText>
              {product.rating} ({product.reviewCount} reseñas)
            </RatingText>
          </RatingSection>

          <TagsSection>
            {product.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagsSection>

          <AttributesSection>
            <h3>Especificaciones</h3>
            <AttributeGrid>
              {Object.entries(product.attributes).map(([key, value]) => (
                <AttributeItem key={key}>
                  <AttributeLabel>{key}:</AttributeLabel>
                  <AttributeValue>{value}</AttributeValue>
                </AttributeItem>
              ))}
            </AttributeGrid>
          </AttributesSection>

          {product.variants.length > 0 && (
            <VariantsSection>
              <h3>Variantes Disponibles</h3>
              <VariantGrid>
                {product.variants.map((variant) => (
                  <VariantCard key={variant.id} isActive={variant.isActive}>
                    <VariantName>{variant.name}</VariantName>
                    <VariantPrice>S/ {variant.price}</VariantPrice>
                    <VariantStock>
                      Stock: {variant.stockQuantity}
                    </VariantStock>
                  </VariantCard>
                ))}
              </VariantGrid>
            </VariantsSection>
          )}
        </InfoSection>
      </ProductContent>

      <AdditionalInfo>
        <InfoCard>
          <InfoCardTitle>
            <Package size={20} />
            Información del Producto
          </InfoCardTitle>
          <InfoCardContent>
            <p><strong>Fecha de creación:</strong> {new Date(product.createdAt).toLocaleDateString('es-ES')}</p>
            <p><strong>Última actualización:</strong> {new Date(product.updatedAt).toLocaleDateString('es-ES')}</p>
            <p><strong>Total de variantes:</strong> {product.variants.length}</p>
            <p><strong>Estado del producto:</strong> {product.isActive ? 'Activo en el catálogo' : 'Inactivo'}</p>
          </InfoCardContent>
        </InfoCard>

        <InfoCard>
          <InfoCardTitle>
            <Settings size={20} />
            Categorización
          </InfoCardTitle>
          <InfoCardContent>
            <p><strong>Categoría principal:</strong> {product.category.name}</p>
            <p><strong>Etiquetas:</strong> {product.tags.join(', ')}</p>
            <p><strong>SKU:</strong> {product.sku}</p>
            <p><strong>Tipo:</strong> Producto físico</p>
          </InfoCardContent>
        </InfoCard>

        <InfoCard>
          <InfoCardTitle>
            <Download size={20} />
            Información de Precios
          </InfoCardTitle>
          <InfoCardContent>
            <p><strong>Precio base:</strong> S/ {product.price}</p>
            {hasDiscount && (
              <p><strong>Precio de oferta:</strong> S/ {product.salePrice}</p>
            )}
            <p><strong>Descuento:</strong> {hasDiscount ? `${discountPercentage}%` : 'Sin descuento'}</p>
            <p><strong>Margen estimado:</strong> 35%</p>
          </InfoCardContent>
        </InfoCard>
      </AdditionalInfo>
    </ProductDetailContainer>
  );
};
