import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { 
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  Package,
  Tag,
  DollarSign,
  Hash,
  FileText,
  CheckCircle,
  AlertTriangle,
  Settings,
  Edit3,
  Save,
  BadgeDollarSign
} from 'lucide-react';
import type { Category, Product, ProductFormData, ProductValidationErrors } from './types';
import { useUpdateProduct } from '@/hooks/useProductsGraphQL';
import { toast } from 'react-hot-toast';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: Product) => void;
  product: Product | null;
  categories: Category[];
  availableTags: string[];
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
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.background.accent};
    color: ${theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing[6]};
`;

const FormSection = styled.div`
  margin-bottom: ${theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[4]} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[4]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const Label = styled.label`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
`;

const ErrorText = styled.span`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.error};
  margin-top: ${theme.spacing[1]};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[2]};
`;

const TagChip = styled.span<{ isSelected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: ${({ isSelected }) => 
    isSelected ? theme.colors.primary : theme.colors.background.light};
  color: ${({ isSelected }) => 
    isSelected ? theme.colors.white : theme.colors.text.primary};
  border: 1px solid ${({ isSelected }) => 
    isSelected ? theme.colors.primary : theme.colors.border.light};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${({ isSelected }) => 
      isSelected ? theme.colors.primaryPurple : theme.colors.background.accent};
  }
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.xs};
  opacity: 0.7;
  transition: opacity ${theme.transitions.base};

  &:hover {
    opacity: 1;
  }
`;

const ImageUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[2]};
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  border: 2px solid ${theme.colors.border.light};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: ${theme.colors.error};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.full};
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  transition: background ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.error};
  }
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

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: '',
  salePrice: '',
  sku: '',
  categoryId: '',
  stockQuantity: '',
  tags: [],
  isActive: true,
  images: [],
  attributes: {}
};

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product,
  categories,
  availableTags
}) => {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [errors, setErrors] = useState<ProductValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { update: updateProduct, loading: updateLoading } = useUpdateProduct();

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        salePrice: product.salePrice?.toString() || '',
        sku: product.sku || '',
        categoryId: product.categoryId || '',
        stockQuantity: product.stockQuantity?.toString() || '',
        tags: product.tags || [],
        isActive: product.isActive,
        images: product.images || [],
        attributes: product.attributes || {}
      });
      setErrors({});
    }
  }, [product]);

  const validateForm = useCallback((): boolean => {
    const newErrors: ProductValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es requerido';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'El precio es requerido';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número mayor a 0';
    }

    if (formData.salePrice && (isNaN(Number(formData.salePrice)) || Number(formData.salePrice) < 0)) {
      newErrors.salePrice = 'El precio de oferta debe ser un número válido';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'El SKU es requerido';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'La categoría es requerida';
    }

    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = 'La cantidad de stock es requerida';
    } else if (isNaN(Number(formData.stockQuantity)) || Number(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'El stock debe ser un número mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof ProductValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleTagToggle = useCallback((tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  }, []);

  const handleAddCustomTag = useCallback((tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  }, [formData.tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const handleImageUpload = useCallback((imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
  }, []);

  const handleRemoveImage = useCallback((imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !product) return;

    setIsSubmitting(true);
    
    try {
      const updateData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        sku: formData.sku,
        categoryId: formData.categoryId || null,
        images: formData.images,
        attributes: formData.attributes,
        isActive: formData.isActive,
        stockQuantity: parseInt(formData.stockQuantity),
        tags: formData.tags
      };

      const result = await updateProduct(product.id, updateData);
      
      if (result.data?.updateProduct?.data?.entity) {
        toast.success('Producto actualizado exitosamente');
        // Convert the GraphQL result to our Product type
        const graphqlProduct = result.data.updateProduct.data.entity;
        const updatedProduct: Product = {
          ...graphqlProduct,
          variants: [],
          cartItems: [],
          favorites: [],
          orderItems: [],
          reviews: [],
          appEvents: [],
          inventoryTransactions: [],
          stockAlerts: [],
          category: graphqlProduct.category ? {
            ...graphqlProduct.category,
            description: null,
            isActive: true,
            sortOrder: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            products: []
          } : null
        };
        onSuccess(updatedProduct);
        onClose();
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, product, validateForm, updateProduct, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setFormData(initialFormData);
      setErrors({});
      onClose();
    }
  }, [isSubmitting, onClose]);

  if (!product) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            <Edit3 size={24} />
            Editar Producto
          </ModalTitle>
          <CloseButton onClick={handleClose} disabled={isSubmitting}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            {/* Basic Information */}
            <FormSection>
              <SectionTitle>
                <Package size={20} />
                Información Básica
              </SectionTitle>
              <FormGrid>
                <FormRow>
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Cochecito para Bebé Premium"
                    {...(errors.name && { error: errors.name })}
                  />
                  {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </FormRow>

                <FormRow>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Ej: COCHE-001"
                    {...(errors.sku && { error: errors.sku })}
                  />
                  {errors.sku && <ErrorText>{errors.sku}</ErrorText>}
                </FormRow>

                <FormRow>
                  <Label htmlFor="categoryId">Categoría *</Label>
                  <select
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    style={{
                      padding: theme.spacing[2],
                      border: `1px solid ${errors.categoryId ? theme.colors.error : theme.colors.border.light}`,
                      borderRadius: theme.borderRadius.md,
                      fontFamily: theme.fonts.primary,
                      fontSize: theme.fontSizes.sm
                    }}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <ErrorText>{errors.categoryId}</ErrorText>}
                </FormRow>

                <FormRow>
                  <Label htmlFor="stockQuantity">Stock *</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                    placeholder="0"
                    min="0"
                    {...(errors.stockQuantity && { error: errors.stockQuantity })}
                  />
                  {errors.stockQuantity && <ErrorText>{errors.stockQuantity}</ErrorText>}
                </FormRow>
              </FormGrid>

              <FormRow style={{ marginTop: theme.spacing[4] }}>
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe las características y beneficios del producto..."
                  rows={4}
                  style={{
                    padding: theme.spacing[2],
                    border: `1px solid ${theme.colors.border.light}`,
                    borderRadius: theme.borderRadius.md,
                    fontFamily: theme.fonts.primary,
                    fontSize: theme.fontSizes.sm,
                    resize: 'vertical'
                  }}
                />
              </FormRow>
            </FormSection>

            {/* Pricing */}
            <FormSection>
              <SectionTitle>
                <BadgeDollarSign size={20} />
                Precios
              </SectionTitle>
              <FormGrid>
                <FormRow>
                  <Label htmlFor="price">Precio Regular *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="S/ 0.00"
                    min="0"
                    {...(errors.price && { error: errors.price })}
                  />
                  {errors.price && <ErrorText>{errors.price}</ErrorText>}
                </FormRow>

                <FormRow>
                  <Label htmlFor="salePrice">Precio de Oferta</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => handleInputChange('salePrice', e.target.value)}
                    placeholder="S/ 0.00"
                    min="0"
                    {...(errors.salePrice && { error: errors.salePrice })}
                  />
                  {errors.salePrice && <ErrorText>{errors.salePrice}</ErrorText>}
                </FormRow>
              </FormGrid>
            </FormSection>

            {/* Tags */}
            <FormSection>
              <SectionTitle>
                <Tag size={20} />
                Etiquetas
              </SectionTitle>
              <FormRow>
                <Label>Etiquetas Disponibles</Label>
                <TagsContainer>
                  {availableTags.map(tag => (
                    <TagChip
                      key={tag}
                      isSelected={formData.tags.includes(tag)}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </TagChip>
                  ))}
                </TagsContainer>
              </FormRow>
              
              <FormRow style={{ marginTop: theme.spacing[3] }}>
                <Label>Etiquetas Seleccionadas</Label>
                <TagsContainer>
                  {formData.tags.map(tag => (
                    <TagChip key={tag} isSelected={true}>
                      {tag}
                      <RemoveTagButton onClick={() => handleRemoveTag(tag)}>
                        <X size={12} />
                      </RemoveTagButton>
                    </TagChip>
                  ))}
                </TagsContainer>
              </FormRow>
            </FormSection>

            {/* Images */}
            <FormSection>
              <SectionTitle>
                <ImageIcon size={20} />
                Imágenes
              </SectionTitle>
              <ImageUploadSection>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleImageUpload('https://via.placeholder.com/300x300')}
                  disabled={isSubmitting}
                >
                  <Upload size={16} />
                  Agregar Imagen
                </Button>
                
                <ImagePreviewGrid>
                  {formData.images.map((image, index) => (
                    <ImagePreview key={index}>
                      <img src={image} alt={`Producto ${index + 1}`} />
                      <RemoveImageButton onClick={() => handleRemoveImage(image)}>
                        <X size={12} />
                      </RemoveImageButton>
                    </ImagePreview>
                  ))}
                </ImagePreviewGrid>
              </ImageUploadSection>
            </FormSection>

            {/* Status */}
            <FormSection>
              <SectionTitle>
                <Settings size={20} />
                Estado
              </SectionTitle>
              <FormRow>
                <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    disabled={isSubmitting}
                  />
                  <span>Producto Activo</span>
                </label>
              </FormRow>
            </FormSection>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || updateLoading}
              isLoading={isSubmitting || updateLoading}
            >
              <Save size={16} />
              Guardar Cambios
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};
