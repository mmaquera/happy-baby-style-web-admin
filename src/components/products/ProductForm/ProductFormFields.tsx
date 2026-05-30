import type React from 'react';
import XIcon from 'lucide-react/dist/esm/icons/x';
import PlusIcon from 'lucide-react/dist/esm/icons/plus';
import ImageIcon from 'lucide-react/dist/esm/icons/image';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import TagIcon from 'lucide-react/dist/esm/icons/tag';
import HashIcon from 'lucide-react/dist/esm/icons/hash';
import FileTextIcon from 'lucide-react/dist/esm/icons/file-text';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import BadgeDollarSignIcon from 'lucide-react/dist/esm/icons/badge-dollar-sign';
import RefreshCwIcon from 'lucide-react/dist/esm/icons/refresh-cw';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from '../ImageUpload';
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
  activeTags: TagWithMetadata;
  availableCategories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  tagsLoading: boolean;
  availableTags?: string[] | undefined;
  onCreateTag: () => Promise<void>;
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
          <FileTextIcon size={20} />
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
              leftIcon={<PackageIcon size={16} />}
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
                leftIcon={<HashIcon size={16} />}
                style={{ flex: 1 }}
              />
              <GenerateSkuButton
                type='button'
                variant='outline'
                size='small'
                onClick={handleGenerateSku}
                title='Generar nuevo SKU automáticamente'
              >
                <RefreshCwIcon size={14} />
                Generar
              </GenerateSkuButton>
            </SkuFieldContainer>
            <div className='mt-1 flex items-center gap-1 text-xs text-muted-foreground'>
              <CheckCircleIcon size={12} />
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
              <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                <LoadingSpinner className='h-4 w-4 border-2' />
                Cargando categorías...
              </div>
            ) : null}
            {categoriesError && availableCategories.length === 0 ? (
              <span className='text-sm text-destructive'>
                Error: {categoriesError}
              </span>
            ) : null}
            {errors['categoryId'] ? (
              <span className='text-sm text-destructive'>
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
          <BadgeDollarSignIcon size={20} />
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
              leftIcon={<BadgeDollarSignIcon size={16} />}
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
              leftIcon={<BadgeDollarSignIcon size={16} />}
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
              leftIcon={<PackageIcon size={16} />}
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
          <TagIcon size={20} />
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
                <TagIcon size={12} />
                {tag}
              </TagChip>
            );
          })}
        </TagsContainer>

        {allTagNames.length === 0 && (availableTags ?? []).length > 0 ? (
          <TagsContainer>
            {(availableTags ?? []).map(tag => (
              <TagChip
                key={tag}
                isSelected={formData.tags.includes(tag)}
                onClick={() => handleTagToggle(tag)}
              >
                <TagIcon size={12} />
                {tag}
              </TagChip>
            ))}
          </TagsContainer>
        ) : null}

        <div className='mt-4'>
          <FormLabel>Crear Nueva Etiqueta</FormLabel>
          <div className='flex flex-col gap-3'>
            <div className='flex gap-2'>
              <Input
                placeholder='Nombre de la etiqueta'
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                leftIcon={<TagIcon size={16} />}
              />
              <div className='flex gap-1'>
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
              leftIcon={<TagIcon size={16} />}
            />
            <Button
              type='button'
              variant='outline'
              size='small'
              onClick={onCreateTag}
              disabled={!newTagName.trim() || tagsLoading}
              isLoading={tagsLoading}
            >
              <PlusIcon size={16} />
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
          <div className='mb-4'>
            <FormLabel>Imágenes Actuales del Producto</FormLabel>
            <div className='mt-2 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(120px,1fr))]'>
              {formData.images.map((image, index) => (
                <div key={index} className='group relative'>
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className='h-[120px] w-full rounded-xl border-2 border-border/10 object-cover'
                  />
                  <button
                    type='button'
                    onClick={() => removeImage(index)}
                    className='absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full border-none bg-destructive text-white transition-all hover:scale-110 hover:bg-destructive/90'
                  >
                    <XIcon size={14} />
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

        {formData.images.length > 0 ? (
          <div className='mt-3 rounded-lg border border-green-500/20 bg-green-500/10 p-3'>
            <div className='flex items-center gap-2 text-sm font-medium text-green-700'>
              <div className='h-2 w-2 rounded-full bg-green-500/80' />
              {formData.images.length} imagen
              {formData.images.length !== 1 ? 'es' : ''} lista
              {formData.images.length !== 1 ? 's' : ''} para el producto
            </div>
          </div>
        ) : null}
      </FormSection>

      {/* Atributos Personalizados */}
      <FormSection>
        <SectionTitle>
          <SettingsIcon size={20} />
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
              <PlusIcon size={14} />
              Agregar
            </AddAttributeButton>
          </AttributeRow>
        </AttributesContainer>
      </FormSection>
    </>
  );
};
