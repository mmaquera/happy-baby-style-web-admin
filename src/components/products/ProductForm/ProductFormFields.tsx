import type React from 'react';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from '../ImageUpload';
import {
  X,
  Plus,
  Image as ImageIcon,
  Package,
  Tag,
  Hash,
  FileText,
  CheckCircle,
  Settings,
  BadgeDollarSign,
  RefreshCw,
} from 'lucide-react';
import type { Category, TagWithMetadata } from '../types';
import type { UseProductFormReturn } from './useProductForm';
import {
  FormSection,
  SectionTitle,
  FormGrid,
  FormRow,
  FormLabel,
  RequiredIndicator,
  Select,
  Textarea,
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
  TagsContainer,
  TagChip,
  AttributesContainer,
  AttributeRow,
  RemoveAttributeButton,
  AddAttributeButton,
  SkuFieldContainer,
  GenerateSkuButton,
  LoadingSpinner,
} from './styles';

export interface ProductFormFieldsProps {
  form: UseProductFormReturn;
  isLoading: boolean;
  // External data
  activeTags: TagWithMetadata;
  availableCategories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  tagsLoading: boolean;
  availableTags?: string[] | undefined;
  // Callbacks requiring external hooks
  onCreateTag: () => Promise<void>;
  // Rendering config
  entityType: 'product-draft' | 'product-edit';
  skuHint: string;
  showImagePreview?: boolean;
}

export const ProductFormFields: React.FC<ProductFormFieldsProps> = ({
  form,
  isLoading,
  activeTags,
  availableCategories,
  categoriesLoading,
  categoriesError,
  tagsLoading,
  availableTags,
  onCreateTag,
  entityType,
  skuHint,
  showImagePreview = false,
}) => {
  const {
    formData,
    errors,
    handleInputChange,
    handleTagToggle,
    handleImageUploadSuccess,
    removeImage,
    newAttributeKey,
    newAttributeValue,
    setNewAttributeKey,
    setNewAttributeValue,
    addAttribute,
    removeAttribute,
    newTagName,
    newTagColor,
    newTagDescription,
    setNewTagName,
    setNewTagColor,
    setNewTagDescription,
    handleGenerateSku,
    sessionId,
  } = form;

  const allTagNames: string[] = showImagePreview
    ? Array.from(new Set([...Object.keys(activeTags), ...formData.tags]))
    : Object.keys(activeTags);

  return (
    <>
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
              placeholder='Ej: Body Orgánico para Bebé'
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              error={errors['name'] ?? ''}
              leftIcon={<Package size={16} />}
            />
          </FormRow>

          <FormRow>
            <FormLabel>
              SKU <RequiredIndicator>*</RequiredIndicator>
            </FormLabel>
            <SkuFieldContainer>
              <Input
                placeholder='Ej: SKU-ABC123'
                value={formData.sku}
                onChange={e => handleInputChange('sku', e.target.value)}
                error={errors['sku'] ?? ''}
                leftIcon={<Hash size={16} />}
                style={{ flex: 1 }}
              />
              <GenerateSkuButton
                type='button'
                variant='outline'
                size='small'
                onClick={handleGenerateSku}
                title='Generar nuevo SKU automáticamente'
              >
                <RefreshCw size={14} />
                Generar
              </GenerateSkuButton>
            </SkuFieldContainer>
            <div
              style={{
                fontSize: theme.fontSizes.xs,
                color: theme.colors.text.secondary,
                marginTop: theme.spacing[1],
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[1],
              }}
            >
              <CheckCircle size={12} />
              {skuHint}
            </div>
          </FormRow>

          <FormRow>
            <FormLabel>
              Categoría <RequiredIndicator>*</RequiredIndicator>
            </FormLabel>
            <Select
              value={formData.categoryId}
              onChange={e => handleInputChange('categoryId', e.target.value)}
              disabled={
                categoriesLoading ? availableCategories.length === 0 : undefined
              }
            >
              <option value=''>
                {categoriesLoading && availableCategories.length === 0
                  ? 'Cargando categorías...'
                  : categoriesError && availableCategories.length === 0
                    ? 'Error al cargar categorías'
                    : 'Seleccionar categoría'}
              </option>
              {availableCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            {categoriesLoading && availableCategories.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  marginTop: theme.spacing[1],
                  fontSize: theme.fontSizes.sm,
                  color: theme.colors.text.secondary,
                }}
              >
                <LoadingSpinner />
                Cargando categorías...
              </div>
            ) : null}
            {categoriesError && availableCategories.length === 0 ? (
              <span
                style={{
                  color: theme.colors.error,
                  fontSize: theme.fontSizes.sm,
                }}
              >
                Error: {categoriesError}
              </span>
            ) : null}
            {errors['categoryId'] ? (
              <span
                style={{
                  color: theme.colors.error,
                  fontSize: theme.fontSizes.sm,
                }}
              >
                {errors['categoryId']}
              </span>
            ) : null}
          </FormRow>

          <FormRow>
            <FormLabel>Descripción</FormLabel>
            <Textarea
              placeholder='Describe las características y beneficios del producto...'
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
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
              type='number'
              step='0.01'
              min='0'
              placeholder='S/ 0.00'
              value={formData.price}
              onChange={e => handleInputChange('price', e.target.value)}
              error={errors['price'] ?? ''}
              leftIcon={<BadgeDollarSign size={16} />}
            />
          </FormRow>

          <FormRow>
            <FormLabel>Precio de Oferta</FormLabel>
            <Input
              type='number'
              step='0.01'
              min='0'
              placeholder='S/ 0.00 (opcional)'
              value={formData.salePrice}
              onChange={e => handleInputChange('salePrice', e.target.value)}
              error={errors['salePrice'] ?? ''}
              leftIcon={<BadgeDollarSign size={16} />}
            />
          </FormRow>

          <FormRow>
            <FormLabel>
              Stock Inicial <RequiredIndicator>*</RequiredIndicator>
            </FormLabel>
            <Input
              type='number'
              min='0'
              placeholder='0'
              value={formData.stockQuantity}
              onChange={e => handleInputChange('stockQuantity', e.target.value)}
              error={errors['stockQuantity'] ?? ''}
              leftIcon={<Package size={16} />}
            />
          </FormRow>

          <FormRow>
            <FormLabel>Estado del Producto</FormLabel>
            <CheckboxContainer>
              <Checkbox
                type='checkbox'
                id='isActive'
                checked={formData.isActive}
                onChange={e => handleInputChange('isActive', e.target.checked)}
              />
              <label htmlFor='isActive'>
                <CheckboxLabel>Producto activo en el catálogo</CheckboxLabel>
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
        <TagsContainer>
          {allTagNames.map(tag => {
            const meta = activeTags[tag];
            const isSelected = formData.tags.includes(tag);
            return (
              <TagChip
                key={tag}
                isSelected={isSelected}
                onClick={() => handleTagToggle(tag)}
                {...(meta?.color ? { color: meta.color } : {})}
                title={meta?.description ?? 'Etiqueta del producto'}
              >
                <Tag size={12} />
                {tag}
              </TagChip>
            );
          })}
        </TagsContainer>

        {allTagNames.length === 0 && (availableTags ?? []).length > 0 && (
          <TagsContainer>
            {(availableTags ?? []).map(tag => (
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

        <div style={{ marginTop: theme.spacing[4] }}>
          <FormLabel>Crear Nueva Etiqueta</FormLabel>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing[3],
            }}
          >
            <div style={{ display: 'flex', gap: theme.spacing[2] }}>
              <Input
                placeholder='Nombre de la etiqueta'
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                leftIcon={<Tag size={16} />}
              />
              <div style={{ display: 'flex', gap: theme.spacing[1] }}>
                {['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'].map(
                  color => (
                    <button
                      key={color}
                      type='button'
                      onClick={() => setNewTagColor(color)}
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: color,
                        border:
                          newTagColor === color
                            ? '3px solid white'
                            : '2px solid #e2e8f0',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        boxShadow:
                          newTagColor === color ? '0 0 0 2px #3b82f6' : 'none',
                      }}
                      title={`Color: ${color}`}
                    />
                  )
                )}
              </div>
            </div>
            <Input
              placeholder='Descripción (opcional)'
              value={newTagDescription}
              onChange={e => setNewTagDescription(e.target.value)}
              leftIcon={<Tag size={16} />}
            />
            <Button
              type='button'
              variant='outline'
              size='small'
              onClick={onCreateTag}
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

        {showImagePreview && formData.images.length > 0 ? (
          <div style={{ marginBottom: theme.spacing[4] }}>
            <FormLabel>Imágenes Actuales del Producto</FormLabel>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: theme.spacing[3],
                marginTop: theme.spacing[2],
              }}
            >
              {formData.images.map((image, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: theme.borderRadius.md,
                      border: `2px solid ${theme.colors.border.light}`,
                    }}
                  />
                  <button
                    type='button'
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: theme.colors.error,
                      color: theme.colors.white,
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${theme.colors.error}dd`;
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = theme.colors.error;
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <ImageUpload
          onUpload={handleImageUploadSuccess}
          maxFiles={5}
          maxSize={5 * 1024 * 1024}
          allowedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
          entityId={sessionId}
          entityType={entityType}
          disabled={isLoading}
        />

        {formData.images.length > 0 && (
          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(34, 197, 94, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(34, 197, 94, 0.8)',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: 'rgba(34, 197, 94, 0.8)',
                  borderRadius: '50%',
                }}
              />
              {formData.images.length} imagen
              {formData.images.length !== 1 ? 'es' : ''} lista
              {formData.images.length !== 1 ? 's' : ''} para el producto
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
              <Input placeholder='Nombre del atributo' value={key} disabled />
              <Input
                placeholder='Valor del atributo'
                value={String(value)}
                disabled
              />
              <RemoveAttributeButton
                type='button'
                onClick={() => removeAttribute(key)}
              >
                Eliminar
              </RemoveAttributeButton>
            </AttributeRow>
          ))}

          <AttributeRow>
            <Input
              placeholder='Nuevo atributo (ej: Material)'
              value={newAttributeKey}
              onChange={e => setNewAttributeKey(e.target.value)}
            />
            <Input
              placeholder='Valor (ej: Algodón 100%)'
              value={newAttributeValue}
              onChange={e => setNewAttributeValue(e.target.value)}
            />
            <AddAttributeButton
              type='button'
              variant='outline'
              size='small'
              onClick={addAttribute}
              disabled={!newAttributeKey.trim() || !newAttributeValue.trim()}
            >
              <Plus size={14} />
              Agregar
            </AddAttributeButton>
          </AttributeRow>
        </AttributesContainer>
      </FormSection>
    </>
  );
};
