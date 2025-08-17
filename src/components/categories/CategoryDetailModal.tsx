import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  X,
  Eye,
  Hash,
  Image as ImageIcon,
  Settings,
  Package,
  SortAsc,
  CheckCircle,
  XCircle,
  Link,
  Edit3
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  image?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  products?: Array<{
    id: string;
    name: string;
    description?: string | null;
    price: number;
    salePrice?: number | null;
    sku: string;
    images: string[];
    isActive: boolean;
    stockQuantity: number;
    tags: string[];
    rating?: number | null;
    reviewCount: number;
  }>;
}

interface CategoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onEdit: (category: Category) => void;
}

// Styled Components
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
  z-index: ${theme.zIndex?.modal || 1000};
  padding: ${theme.spacing[4]};
`;

const ModalContainer = styled(Card)`
  width: 100%;
  max-width: 800px;
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
  transition: all ${theme.transitions?.base || '0.2s ease'};

  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing[6]};
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[4]} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding-bottom: ${theme.spacing[2]};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[4]};
`;

const InfoCard = styled.div`
  background: ${theme.colors.background.light};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[4]};
`;

const InfoLabel = styled.div`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${theme.spacing[1]};
`;

const InfoValue = styled.div`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
`;

const StatusBadge = styled.span<{ isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  background: ${({ isActive }) => isActive ? `${theme.colors.success}20` : `${theme.colors.error}20`};
  color: ${({ isActive }) => isActive ? theme.colors.success : theme.colors.error};
  border: 1px solid ${({ isActive }) => isActive ? `${theme.colors.success}40` : `${theme.colors.error}40`};
`;

const ImagePreview = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[2]};
`;

const ImageThumbnail = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.md};
  border: 2px solid ${theme.colors.border.light};
`;

const NoImage = styled.div`
  width: 60px;
  height: 60px;
  background: ${theme.colors.background.accent};
  border: 2px dashed ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.secondary};
`;

const ProductsSection = styled.div`
  margin-top: ${theme.spacing[4]};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[3]};
`;

const ProductCard = styled.div`
  background: ${theme.colors.background.light};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: 0 4px 12px rgba(162, 133, 209, 0.15);
  }
`;

const ProductName = styled.div`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const ProductMeta = styled.div`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.text.secondary};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.background.light};
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
`;

const FooterRight = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
`;

export const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
  isOpen,
  onClose,
  category,
  onEdit
}) => {
  if (!isOpen || !category) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleEdit = () => {
    onEdit(category);
  };

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            <Eye size={24} />
            Detalle de Categoría
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Información del Sistema */}
          <Section>
            <SectionTitle>
              <Settings size={20} />
              Información del Sistema
            </SectionTitle>
            <InfoGrid>
              <InfoCard>
                <InfoLabel>ID de Categoría</InfoLabel>
                <InfoValue>{category.id}</InfoValue>
              </InfoCard>
              <InfoCard>
                <InfoLabel>Estado</InfoLabel>
                <StatusBadge isActive={category.isActive}>
                  {category.isActive ? (
                    <>
                      <CheckCircle size={14} />
                      Activa
                    </>
                  ) : (
                    <>
                      <XCircle size={14} />
                      Inactiva
                    </>
                  )}
                </StatusBadge>
              </InfoCard>
              <InfoCard>
                <InfoLabel>Fecha de Creación</InfoLabel>
                <InfoValue>{formatDate(category.createdAt)}</InfoValue>
              </InfoCard>
              <InfoCard>
                <InfoLabel>Última Actualización</InfoLabel>
                <InfoValue>{formatDate(category.updatedAt)}</InfoValue>
              </InfoCard>
            </InfoGrid>
          </Section>

          {/* Información Básica */}
          <Section>
            <SectionTitle>
              <Hash size={20} />
              Información Básica
            </SectionTitle>
            <InfoGrid>
              <InfoCard>
                <InfoLabel>Nombre</InfoLabel>
                <InfoValue>{category.name}</InfoValue>
              </InfoCard>
              <InfoCard>
                <InfoLabel>Slug</InfoLabel>
                <InfoValue>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[1] }}>
                    <Link size={14} />
                    {category.slug}
                  </div>
                </InfoValue>
              </InfoCard>
              <InfoCard>
                <InfoLabel>Descripción</InfoLabel>
                <InfoValue>
                  {category.description || (
                    <span style={{ color: theme.colors.text.secondary, fontStyle: 'italic' }}>
                      Sin descripción
                    </span>
                  )}
                </InfoValue>
              </InfoCard>
              <InfoCard>
                <InfoLabel>Orden de Clasificación</InfoLabel>
                <InfoValue>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[1] }}>
                    <SortAsc size={14} />
                    {category.sortOrder}
                  </div>
                </InfoValue>
              </InfoCard>
            </InfoGrid>
          </Section>

          {/* Imagen */}
          <Section>
            <SectionTitle>
              <ImageIcon size={20} />
              Imagen
            </SectionTitle>
            <ImagePreview>
              {category.image ? (
                <>
                  <ImageThumbnail src={category.image} alt={category.name} />
                  <div>
                    <InfoLabel>URL de Imagen</InfoLabel>
                    <InfoValue style={{ wordBreak: 'break-all' }}>
                      {category.image}
                    </InfoValue>
                  </div>
                </>
              ) : (
                <>
                  <NoImage>
                    <ImageIcon size={24} />
                  </NoImage>
                  <div>
                    <InfoLabel>Imagen</InfoLabel>
                    <InfoValue style={{ color: theme.colors.text.secondary }}>
                      No se ha configurado imagen
                    </InfoValue>
                  </div>
                </>
              )}
            </ImagePreview>
          </Section>

          {/* Productos */}
          <Section>
            <SectionTitle>
              <Package size={20} />
              Productos en esta Categoría
            </SectionTitle>
            {category.products && category.products.length > 0 ? (
              <ProductsSection>
                <InfoLabel style={{ marginBottom: theme.spacing[2] }}>
                  Total: {category.products.length} productos
                </InfoLabel>
                <ProductGrid>
                  {category.products.slice(0, 6).map((product) => (
                    <ProductCard key={product.id}>
                      <ProductName>{product.name}</ProductName>
                      <ProductMeta>
                        <span>SKU: {product.sku}</span>
                        <span>{product.stockQuantity} en stock</span>
                      </ProductMeta>
                      <ProductMeta>
                        <span>{formatPrice(product.price)}</span>
                        <StatusBadge isActive={product.isActive}>
                          {product.isActive ? 'Activo' : 'Inactivo'}
                        </StatusBadge>
                      </ProductMeta>
                    </ProductCard>
                  ))}
                </ProductGrid>
                {category.products.length > 6 && (
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: theme.spacing[3],
                    color: theme.colors.text.secondary,
                    fontSize: theme.fontSizes.sm
                  }}>
                    +{category.products.length - 6} productos más...
                  </div>
                )}
              </ProductsSection>
            ) : (
              <EmptyState>
                <Package size={48} style={{ marginBottom: theme.spacing[2], opacity: 0.5 }} />
                <div>No hay productos en esta categoría</div>
                <div style={{ fontSize: theme.fontSizes.xs, marginTop: theme.spacing[1] }}>
                  Los productos aparecerán aquí cuando sean agregados
                </div>
              </EmptyState>
            )}
          </Section>
        </ModalBody>

        <ModalFooter>
          <FooterLeft>
            <div>ID: {category.id}</div>
            <div>•</div>
            <div>Slug: {category.slug}</div>
          </FooterLeft>
          <FooterRight>
            <Button
              variant="outline"
              onClick={handleEdit}
            >
              <Edit3 size={16} />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </FooterRight>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};
