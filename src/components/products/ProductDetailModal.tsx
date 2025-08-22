import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  X,
  Eye,
  Edit3,
  Package,
  Tag,
  DollarSign,
  Hash,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Star,
  Calendar,
  BarChart3,
  ShoppingCart,
  Heart,
  MessageSquare,
  TrendingUp,
  Users,
  MapPin,
  Globe,
  Settings
} from 'lucide-react';
import type { Product, Category } from './types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  padding: ${theme.spacing[4]};
`;

const ModalContainer = styled(Card)`
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 0;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.border.light};
  position: sticky;
  top: 0;
  background: ${theme.colors.white};
  z-index: 1;
`;

const ModalTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing[6]};
`;

const ProductHeader = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const MainImage = styled.div`
  width: 100%;
  height: 300px;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  border: 2px solid ${theme.colors.border.light};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageThumbnails = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing[2]};
`;

const ImageThumbnail = styled.div<{ isActive: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  border: 2px solid ${({ isActive }) => 
    isActive ? theme.colors.primary : theme.colors.border.light};
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover {
    border-color: ${theme.colors.primary};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const ProductTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const ProductSKU = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const PriceSection = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${theme.spacing[3]};
`;

const CurrentPrice = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
`;

const OriginalPrice = styled.span`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  background: ${theme.colors.success};
  color: ${theme.colors.white};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
`;

const StatusBadge = styled.span<{ isActive: boolean }>`
  background: ${({ isActive }) => 
    isActive ? theme.colors.success : theme.colors.error};
  color: ${theme.colors.white};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  align-self: flex-start;
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
`;

const StockBadge = styled.span<{ isInStock: boolean; isLowStock: boolean }>`
  background: ${({ isInStock, isLowStock }) => {
    if (!isInStock) return theme.colors.error;
    if (isLowStock) return theme.colors.warning;
    return theme.colors.success;
  }};
  color: ${theme.colors.white};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const StarIcon = styled(Star)<{ filled: boolean }>`
  color: ${({ filled }) => 
    filled ? theme.colors.warning : theme.colors.border.light};
  fill: ${({ filled }) => 
    filled ? theme.colors.warning : 'none'};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${theme.spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const Section = styled.div`
  background: ${theme.colors.background.light};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  border: 1px solid ${theme.colors.border.light};
`;

const SectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[3]} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const Description = styled.p`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
`;

const TagChip = styled.span`
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
`;

const VariantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing[3]};
`;

const VariantCard = styled.div<{ isActive: boolean }>`
  background: ${theme.colors.white};
  border: 1px solid ${({ isActive }) => 
    isActive ? theme.colors.primary : theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]};
  opacity: ${({ isActive }) => isActive ? 1 : 0.7};
`;

const VariantName = styled.div`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[2]};
`;

const VariantPrice = styled.div`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const VariantStock = styled.div`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing[1]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing[3]};
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${theme.spacing[3]};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.light};
`;

const StatValue = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.background.light};
  position: sticky;
  bottom: 0;
`;

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onEdit
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  if (!product) return null;

  const currentPrice = parseFloat(product.currentPrice?.toString() || '0');
  const originalPrice = parseFloat(product.price?.toString() || '0');
  const hasDiscount = product.hasDiscount;
  const discountPercentage = product.discountPercentage;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;

  const handleEdit = () => {
    onEdit(product);
    onClose();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon 
          key={i} 
          size={16} 
          filled={i <= rating} 
        />
      );
    }
    return stars;
  };

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            <Eye size={24} />
            Detalles del Producto
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ProductHeader>
            <ImageSection>
              <MainImage>
                <img 
                  src={product.images[selectedImageIndex] || 'https://via.placeholder.com/300x300'} 
                  alt={product.name} 
                />
              </MainImage>
              {product.images.length > 1 && (
                <ImageThumbnails>
                  {product.images.map((image, index) => (
                    <ImageThumbnail
                      key={index}
                      isActive={index === selectedImageIndex}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} />
                    </ImageThumbnail>
                  ))}
                </ImageThumbnails>
              )}
            </ImageSection>

            <ProductInfo>
              <div>
                <ProductTitle>{product.name}</ProductTitle>
                <ProductSKU>
                  <Hash size={16} />
                  SKU: {product.sku}
                </ProductSKU>
              </div>

              <PriceSection>
                <CurrentPrice>
                  S/ {currentPrice.toFixed(2)}
                </CurrentPrice>
                {hasDiscount && (
                  <>
                    <OriginalPrice>
                      S/ {originalPrice.toFixed(2)}
                    </OriginalPrice>
                    <DiscountBadge>
                      -{discountPercentage}%
                    </DiscountBadge>
                  </>
                )}
              </PriceSection>

              <div style={{ display: 'flex', gap: theme.spacing[2] }}>
                <StatusBadge isActive={product.isActive}>
                  {product.isActive ? 'Activo' : 'Inactivo'}
                </StatusBadge>
                <StockBadge isInStock={product.isInStock} isLowStock={isLowStock}>
                  {!product.isInStock ? 'Sin Stock' : isLowStock ? 'Stock Bajo' : 'En Stock'}
                </StockBadge>
              </div>

              <StockInfo>
                <Package size={16} />
                Stock disponible: {product.stockQuantity} unidades
              </StockInfo>

              {product.rating && (
                <RatingSection>
                  <Stars>
                    {renderStars(Math.round(parseFloat(product.rating.toString())))}
                  </Stars>
                  <span style={{ color: theme.colors.text.secondary }}>
                    ({product.reviewCount} reseñas)
                  </span>
                </RatingSection>
              )}
            </ProductInfo>
          </ProductHeader>

          <ContentGrid>
            <MainContent>
              {/* Description */}
              <Section>
                <SectionTitle>
                  <FileText size={20} />
                  Descripción
                </SectionTitle>
                <Description>
                  {product.description || 'No hay descripción disponible para este producto.'}
                </Description>
              </Section>

              {/* Tags */}
              {product.tags.length > 0 && (
                <Section>
                  <SectionTitle>
                    <Tag size={20} />
                    Etiquetas
                  </SectionTitle>
                  <TagsContainer>
                    {product.tags.map(tag => (
                      <TagChip key={tag}>{tag}</TagChip>
                    ))}
                  </TagsContainer>
                </Section>
              )}

              {/* Variants */}
              {product.variants.length > 0 && (
                <Section>
                  <SectionTitle>
                    <Package size={20} />
                    Variantes ({product.variants.length})
                  </SectionTitle>
                  <VariantsGrid>
                    {product.variants.map(variant => (
                      <VariantCard key={variant.id} isActive={variant.isActive}>
                        <VariantName>{variant.name}</VariantName>
                        <VariantPrice>S/ {parseFloat(variant.price.toString()).toFixed(2)}</VariantPrice>
                        <VariantStock>Stock: {variant.stockQuantity}</VariantStock>
                      </VariantCard>
                    ))}
                  </VariantsGrid>
                </Section>
              )}

              {/* Attributes */}
              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <Section>
                  <SectionTitle>
                    <Settings size={20} />
                    Atributos
                  </SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: theme.spacing[3] }}>
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} style={{ padding: theme.spacing[2], background: theme.colors.white, borderRadius: theme.borderRadius.md }}>
                        <strong>{key}:</strong> {String(value)}
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </MainContent>

            <Sidebar>
              {/* Category */}
              {product.category && (
                <Section>
                  <SectionTitle>
                    <MapPin size={20} />
                    Categoría
                  </SectionTitle>
                  <div style={{ padding: theme.spacing[2], background: theme.colors.white, borderRadius: theme.borderRadius.md }}>
                    {product.category.name}
                  </div>
                </Section>
              )}

              {/* Statistics */}
              <Section>
                <SectionTitle>
                  <BarChart3 size={20} />
                  Estadísticas
                </SectionTitle>
                <StatsGrid>
                  <StatItem>
                    <StatValue>{product.reviewCount}</StatValue>
                    <StatLabel>Reseñas</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{product.totalStock}</StatValue>
                    <StatLabel>Stock Total</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{product.variants.length}</StatValue>
                    <StatLabel>Variantes</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{product.favorites?.length || 0}</StatValue>
                    <StatLabel>Favoritos</StatLabel>
                  </StatItem>
                </StatsGrid>
              </Section>

              {/* Dates */}
              <Section>
                <SectionTitle>
                  <Calendar size={20} />
                  Fechas
                </SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
                  <div style={{ fontSize: theme.fontSizes.sm }}>
                    <strong>Creado:</strong> {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: theme.fontSizes.sm }}>
                    <strong>Actualizado:</strong> {new Date(product.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </Section>
            </Sidebar>
          </ContentGrid>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cerrar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleEdit}
          >
            <Edit3 size={16} />
            Editar Producto
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};
