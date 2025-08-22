import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ImageUpload } from './ImageUpload';
import { 
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  Package,
  Tag,
  Hash,
  FileText,
  CheckCircle,
  AlertTriangle,
  Settings,
  BadgeDollarSign,
  Trash2
} from 'lucide-react';
import type { Category, ProductFormData, Product, TagWithMetadata } from './types';
import { useProductActions } from '@/hooks/useProductActions';
import { useCategories } from '@/hooks/useCategories';
import { useTags } from '@/hooks/useTags';
import type { UploadResult } from '@/types/upload';
import { toast } from 'react-hot-toast';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: Product) => void;
  categories: Category[];
  availableTags?: string[]; // Optional for backward compatibility
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const FormLabel = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const RequiredIndicator = styled.span`
  color: ${theme.colors.error};
  font-weight: ${theme.fontWeights.bold};
`;

const Select = styled.select`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.primary};
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

  &:hover {
    border-color: ${theme.colors.border.medium};
  }
`;

const Textarea = styled.textarea`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.primary};
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.base};
  outline: none;
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: ${theme.colors.primaryPurple};
    box-shadow: 0 0 0 3px ${theme.colors.primaryPurple}20;
  }

  &:hover {
    border-color: ${theme.colors.border.medium};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${theme.colors.primaryPurple};
  cursor: pointer;
`;

const CheckboxLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[2]};
`;

const TagChip = styled.div<{ isSelected: boolean; color?: string }>`
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: ${({ isSelected, color }) => 
    isSelected 
      ? (color || theme.colors.primaryPurple)
      : theme.colors.background.accent};
  color: ${({ isSelected }) => 
    isSelected ? theme.colors.white : theme.colors.text.secondary};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  border: 1px solid ${({ isSelected, color }) => 
    isSelected 
      ? (color || theme.colors.primaryPurple)
      : theme.colors.border.light};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  position: relative;

  &:hover {
    background: ${({ isSelected, color }) => 
      isSelected 
        ? (color || theme.colors.primaryPurple)
        : theme.colors.softPurple};
    transform: translateY(-1px);
  }

  &:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: ${theme.colors.text.primary};
    color: ${theme.colors.white};
    padding: ${theme.spacing[1]} ${theme.spacing[2]};
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.fontSizes.xs};
    white-space: nowrap;
    z-index: 1000;
    margin-bottom: ${theme.spacing[2]};
    pointer-events: none;
  }
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  text-align: center;
  transition: all ${theme.transitions.base};
  cursor: pointer;

  &:hover {
    border-color: ${theme.colors.primaryPurple};
    background: ${theme.colors.softPurple}10;
  }
`;

const ImageUploadIcon = styled.div`
  color: ${theme.colors.primaryPurple};
  margin-bottom: ${theme.spacing[3]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageUploadText = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const ImageUploadButton = styled(Button)`
  margin-top: ${theme.spacing[2]};
`;

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[4]};
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  background: ${theme.colors.background.light};
`;

const ImagePreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: ${theme.spacing[1]};
  right: ${theme.spacing[1]};
  background: ${theme.colors.error};
  color: ${theme.colors.white};
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.xs};
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.error}dd;
    transform: scale(1.1);
  }
`;

const AttributesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const AttributeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: ${theme.spacing[3]};
  align-items: end;
`;

const RemoveAttributeButton = styled.button`
  background: ${theme.colors.error};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.error}dd;
  }
`;

const AddAttributeButton = styled(Button)`
  align-self: flex-start;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.border.light};
  position: sticky;
  bottom: 0;
  background: ${theme.colors.white};
  z-index: 1;
`;

const ErrorMessage = styled.div`
  background: ${theme.colors.error}20;
  color: ${theme.colors.error};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
`;

const SuccessMessage = styled.div`
  background: ${theme.colors.success}20;
  color: ${theme.colors.success};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.white}80;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${theme.colors.background.accent};
  border-top: 4px solid ${theme.colors.primaryPurple};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categories: propCategories, // Renamed to avoid conflict
  availableTags
}) => {
  const { createProduct, loading: isCreating, error: createError, uploadProductImage } = useProductActions();
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    sku: '',
    categoryId: '',
    stockQuantity: '0',
    tags: [],
    isActive: true,
    images: [],
    attributes: {}
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [newAttributeKey, setNewAttributeKey] = useState('');
  const [newAttributeValue, setNewAttributeValue] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#ff6b6b');
  const [newTagDescription, setNewTagDescription] = useState('');

  // Generar ID de sesión único para agrupar todas las imágenes del producto
  const [sessionId] = useState(() => `product-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Log para debugging - verificar que el sessionId se genera correctamente
  useEffect(() => {
    if (isOpen) {
      console.log('🔗 CreateProductModal - Session ID generado:', sessionId);
    }
  }, [isOpen, sessionId]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        price: '',
        salePrice: '',
        sku: '',
        categoryId: '',
        stockQuantity: '0',
        tags: [],
        isActive: true,
        images: [],
        attributes: {}
      });
      setErrors({});
      setSuccessMessage('');
      
    }
  }, [isOpen]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors['name'] = 'El nombre del producto es requerido';
    }

    if (!formData.sku.trim()) {
      newErrors['sku'] = 'El SKU es requerido';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors['price'] = 'El precio debe ser mayor a 0';
    }

    if (formData.salePrice && parseFloat(formData.salePrice) >= parseFloat(formData.price)) {
      newErrors['salePrice'] = 'El precio de oferta debe ser menor al precio regular';
    }

    if (!formData.categoryId) {
      newErrors['categoryId'] = 'Debe seleccionar una categoría';
    }

    if (parseInt(formData.stockQuantity) < 0) {
      newErrors['stockQuantity'] = 'El stock no puede ser negativo';
    }

    // Validate that all images are real URLs (not blob URLs)
    if (formData.images.length > 0) {
      const hasInvalidImages = formData.images.some(img => img.startsWith('blob:'));
      if (hasInvalidImages) {
        newErrors['images'] = 'Todas las imágenes deben ser subidas antes de crear el producto';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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



  const handleImageUploadSuccess = useCallback((result: UploadResult) => {
    if (result.success && result.url) {
      // Agregar la imagen subida al formulario
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, result.url!]
      }));
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, []);

  const addAttribute = useCallback(() => {
    if (newAttributeKey.trim() && newAttributeValue.trim()) {
      setFormData(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [newAttributeKey.trim()]: newAttributeValue.trim()
        }
      }));
      setNewAttributeKey('');
      setNewAttributeValue('');
    }
  }, [newAttributeKey, newAttributeValue]);

  const removeAttribute = useCallback((key: string) => {
    setFormData(prev => {
      const newAttributes = { ...prev.attributes };
      delete newAttributes[key];
      return { ...prev, attributes: newAttributes };
    });
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setErrors({});

    try {
      // Validate that images are real URLs from backend
      const hasValidImages = formData.images.every(img => 
        img.startsWith('http') && !img.startsWith('blob:')
      );
      
      if (formData.images.length > 0 && !hasValidImages) {
        setErrors({ submit: 'Las imágenes deben ser subidas antes de crear el producto' });
        return;
      }

      // Prepare product data for GraphQL mutation
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        sku: formData.sku.trim(),
        categoryId: formData.categoryId,
        stockQuantity: parseInt(formData.stockQuantity),
        tags: formData.tags,
        isActive: formData.isActive,
        images: formData.images,
        attributes: formData.attributes
      };

      // Call GraphQL mutation
      const result = await createProduct(productData);
      
      if (result) {
        setSuccessMessage('Producto creado exitosamente');
        // ✅ Removido toast duplicado - useProductActions ya muestra el toast
        
        // Close modal after success
        setTimeout(() => {
          onSuccess(result);
          onClose();
        }, 1500);
      } else {
        setErrors({ submit: 'No se pudo crear el producto. Verifique los datos e intente nuevamente.' });
      }

    } catch (error: any) {
      const errorMessage = error.message || 'Error al crear el producto. Intente nuevamente.';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    }
  }, [formData, validateForm, createProduct, onSuccess, onClose]);

  // GraphQL integration for categories
  const { 
    categories: graphqlCategories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useCategories();

  // Enhanced tags management with metadata
  const { 
    activeTags, 
    createTag, 
    isLoading: tagsLoading, 
    error: tagsError 
  } = useTags();

  // Handle creating new custom tags
  const handleCreateTag = useCallback(async () => {
    if (!newTagName.trim()) return;

    try {
      const result = await createTag(newTagName.trim(), {
        color: newTagColor,
        description: newTagDescription.trim() || newTagName.trim(),
        category: 'personalizado',
        isActive: true
      });

      if (result.success) {
        // Add the new tag to the form
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTagName.trim()]
        }));

        // Reset form
        setNewTagName('');
        setNewTagColor('#ff6b6b');
        setNewTagDescription('');
        
        toast.success('Etiqueta creada exitosamente');
      } else {
        toast.error(result.error || 'Error al crear la etiqueta');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la etiqueta');
    }
  }, [newTagName, newTagColor, newTagDescription, createTag]);

  // Use GraphQL categories if available, fallback to prop categories
  const availableCategories = graphqlCategories.length > 0 
    ? graphqlCategories.filter(cat => cat.isActive).sort((a, b) => a.sortOrder - b.sortOrder)
    : propCategories || [];

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        {isCreating && (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        )}

        <ModalHeader>
          <ModalTitle>
            <Package size={24} />
            Crear Nuevo Producto
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            {(errors['submit'] || createError) && (
              <ErrorMessage>
                <AlertTriangle size={16} />
                {errors['submit'] || createError}
              </ErrorMessage>
            )}

            {successMessage && (
              <SuccessMessage>
                <CheckCircle size={16} />
                {successMessage}
              </SuccessMessage>
            )}

            {/* Información Básica */}
            <FormSection>
              <SectionTitle>
                <FileText size={20} />
                Información Básica
              </SectionTitle>
              
              <FormGrid>
                <FormRow>
                  <FormLabel>
                    Nombre del Producto <RequiredIndicator>*</RequiredIndicator>
                  </FormLabel>
                  <Input
                    placeholder="Ej: Body Orgánico para Bebé"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors['name'] || ''}
                    leftIcon={<Package size={16} />}
                  />
                </FormRow>

                <FormRow>
                  <FormLabel>
                    SKU <RequiredIndicator>*</RequiredIndicator>
                  </FormLabel>
                  <Input
                    placeholder="Ej: BODY-ORG-001"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    error={errors['sku'] || ''}
                    leftIcon={<Hash size={16} />}
                  />
                </FormRow>

                <FormRow>
                  <FormLabel>
                    Categoría <RequiredIndicator>*</RequiredIndicator>
                  </FormLabel>
                  <Select
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    disabled={categoriesLoading && availableCategories.length === 0}
                  >
                    <option value="">
                      {categoriesLoading && availableCategories.length === 0
                        ? 'Cargando categorías...' 
                        : categoriesError && availableCategories.length === 0
                          ? 'Error al cargar categorías' 
                          : 'Seleccionar categoría'
                      }
                    </option>
                    {availableCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                  {/* Only show loading indicator when no categories are available */}
                  {categoriesLoading && availableCategories.length === 0 && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: theme.spacing[2], 
                      marginTop: theme.spacing[1],
                      fontSize: theme.fontSizes.sm,
                      color: theme.colors.text.secondary
                    }}>
                      <LoadingSpinner />
                      Cargando categorías...
                    </div>
                  )}
                  {/* Only show error when no categories are available */}
                  {categoriesError && availableCategories.length === 0 && (
                    <span style={{ color: theme.colors.error, fontSize: theme.fontSizes.sm }}>
                      Error: {categoriesError}
                    </span>
                  )}
                  {errors['categoryId'] && <span style={{ color: theme.colors.error, fontSize: theme.fontSizes.sm }}>{errors['categoryId']}</span>}
                </FormRow>

                <FormRow>
                  <FormLabel>Descripción</FormLabel>
                  <Textarea
                    placeholder="Describe las características y beneficios del producto..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </FormRow>
              </FormGrid>
            </FormSection>

            {/* Precios y Stock */}
            <FormSection>
              <SectionTitle>
                <BadgeDollarSign size={20} />
                Precios y Stock
              </SectionTitle>
              
              <FormGrid>
                <FormRow>
                  <FormLabel>
                    Precio Regular <RequiredIndicator>*</RequiredIndicator>
                  </FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="S/ 0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    error={errors['price'] || ''}
                    leftIcon={<BadgeDollarSign size={16} />}
                  />
                </FormRow>

                <FormRow>
                  <FormLabel>Precio de Oferta</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="S/ 0.00 (opcional)"
                    value={formData.salePrice}
                    onChange={(e) => handleInputChange('salePrice', e.target.value)}
                    error={errors['salePrice'] || ''}
                    leftIcon={<BadgeDollarSign size={16} />}
                  />
                </FormRow>

                <FormRow>
                  <FormLabel>
                    Stock Inicial <RequiredIndicator>*</RequiredIndicator>
                  </FormLabel>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                    error={errors['stockQuantity'] || ''}
                    leftIcon={<Package size={16} />}
                  />
                </FormRow>

                <FormRow>
                  <FormLabel>Estado del Producto</FormLabel>
                  <CheckboxContainer>
                    <Checkbox
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    />
                    <label htmlFor="isActive">
                      <CheckboxLabel>
                        Producto activo en el catálogo
                      </CheckboxLabel>
                    </label>
                  </CheckboxContainer>
                </FormRow>
              </FormGrid>
            </FormSection>

            {/* Etiquetas */}
            <FormSection>
              <SectionTitle>
                <Tag size={20} />
                Etiquetas y Categorización
              </SectionTitle>
              
              <FormLabel>Seleccionar Etiquetas</FormLabel>
              
              {/* Enhanced Tags with Metadata */}
              <TagsContainer>
                {Object.entries(activeTags).map(([tagName, tagMetadata]) => (
                  <TagChip
                    key={tagName}
                    isSelected={formData.tags.includes(tagName)}
                    onClick={() => handleTagToggle(tagName)}
                    color={tagMetadata.color}
                    title={tagMetadata.description}
                  >
                    <Tag size={12} />
                    {tagName}
                  </TagChip>
                ))}
              </TagsContainer>

              {/* Fallback to prop tags if no enhanced tags available */}
              {Object.keys(activeTags).length === 0 && (availableTags || []).length > 0 && (
                <TagsContainer>
                  {(availableTags || []).map(tag => (
                    <TagChip
                      key={tag}
                      isSelected={formData.tags.includes(tag)}
                      onClick={() => handleTagToggle(tag)}
                    >
                      <Tag size={12} />
                      {tag}
                    </TagChip>
                  ))}
                </TagsContainer>
              )}

              {/* Tag Creation Section */}
              <div style={{ marginTop: theme.spacing[4] }}>
                <FormLabel>Crear Nueva Etiqueta</FormLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
                  <div style={{ display: 'flex', gap: theme.spacing[2] }}>
                    <Input
                      placeholder="Nombre de la etiqueta"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      leftIcon={<Tag size={16} />}
                    />
                    <div style={{ display: 'flex', gap: theme.spacing[1] }}>
                      {['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewTagColor(color)}
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: color,
                            border: newTagColor === color ? '3px solid white' : '2px solid #e2e8f0',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            boxShadow: newTagColor === color ? '0 0 0 2px #3b82f6' : 'none'
                          }}
                          title={`Color: ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                  <Input
                    placeholder="Descripción (opcional)"
                    value={newTagDescription}
                    onChange={(e) => setNewTagDescription(e.target.value)}
                    leftIcon={<Tag size={16} />}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim() || tagsLoading}
                    isLoading={tagsLoading}
                  >
                    <Plus size={16} />
                    Crear Etiqueta
                  </Button>
                </div>
              </div>
            </FormSection>

            {/* Imágenes */}
            <FormSection>
              <SectionTitle>
                <ImageIcon size={20} />
                Imágenes del Producto
              </SectionTitle>
              
              <ImageUpload
                onUpload={handleImageUploadSuccess}
                maxFiles={5}
                maxSize={5 * 1024 * 1024} // 5MB
                allowedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                entityId={sessionId}
                entityType="product-draft"
                disabled={isCreating}
              />

              {/* Preview de imágenes se maneja internamente en ImageUpload */}
              {formData.images.length > 0 && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '12px', 
                  background: 'rgba(34, 197, 94, 0.1)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    color: 'rgba(34, 197, 94, 0.8)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      background: 'rgba(34, 197, 94, 0.8)', 
                      borderRadius: '50%' 
                    }} />
                    {formData.images.length} imagen{formData.images.length !== 1 ? 'es' : ''} lista{formData.images.length !== 1 ? 's' : ''} para el producto
                  </div>
                </div>
              )}
            </FormSection>

            {/* Atributos Personalizados */}
            <FormSection>
              <SectionTitle>
                <Settings size={20} />
                Atributos Personalizados
              </SectionTitle>
              
              <AttributesContainer>
                {Object.entries(formData.attributes).map(([key, value]) => (
                  <AttributeRow key={key}>
                    <Input
                      placeholder="Nombre del atributo"
                      value={key}
                      disabled
                    />
                    <Input
                      placeholder="Valor del atributo"
                      value={value}
                      disabled
                    />
                    <RemoveAttributeButton onClick={() => removeAttribute(key)}>
                      Eliminar
                    </RemoveAttributeButton>
                  </AttributeRow>
                ))}

                <AttributeRow>
                  <Input
                    placeholder="Nuevo atributo (ej: Material)"
                    value={newAttributeKey}
                    onChange={(e) => setNewAttributeKey(e.target.value)}
                  />
                  <Input
                    placeholder="Valor (ej: Algodón 100%)"
                    value={newAttributeValue}
                    onChange={(e) => setNewAttributeValue(e.target.value)}
                  />
                  <AddAttributeButton
                    variant="outline"
                    size="small"
                    onClick={addAttribute}
                    disabled={!newAttributeKey.trim() || !newAttributeValue.trim()}
                  >
                    <Plus size={14} />
                    Agregar
                  </AddAttributeButton>
                </AttributeRow>
              </AttributesContainer>
            </FormSection>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose} disabled={isCreating}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isCreating}
              isLoading={isCreating}
            >
              <Plus size={16} />
              Crear Producto
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};
