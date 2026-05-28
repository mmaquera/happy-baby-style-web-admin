import React, { useCallback, useEffect } from 'react';
import { Edit3, X, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Category, Product } from './types';
import { useProductActions } from '@/hooks/useProductActions';
import { useCategories } from '@/hooks/useCategories';
import { useTags } from '@/hooks/useTags';
import { toast } from 'react-hot-toast';
import {
  convertImageUrlsToRelativePaths,
  validateBackendImageUrls,
} from '@/utils/imageUtils';
import { logger } from '@/utils/logger';
import { useProductForm } from './ProductForm/useProductForm';
import { ProductFormFields } from './ProductForm/ProductFormFields';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  ErrorMessage,
  SuccessMessage,
  LoadingOverlay,
  LoadingSpinner,
} from './ProductForm/styles';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: Product) => void;
  product: Product | null;
  categories: Category[];
  availableTags?: string[];
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product,
  categories: propCategories,
  availableTags,
}) => {
  const {
    updateProduct,
    loading: isUpdating,
    error: updateError,
  } = useProductActions();
  const form = useProductForm(product, 'product-edit');
  const {
    formData,
    errors,
    successMessage,
    setSuccessMessage,
    setErrors,
    sessionId,
    validateForm,
    resetForm,
    newTagName,
    newTagColor,
    newTagDescription,
    setNewTagName,
    setNewTagColor,
    setNewTagDescription,
    handleInputChange,
  } = form;

  const {
    categories: graphqlCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const { activeTags, createTag, isLoading: tagsLoading } = useTags();

  useEffect(() => {
    if (!isOpen) {
      resetForm(false);
    } else {
      logger.debug(
        'EditProductModal opened, product:',
        product?.id,
        'session:',
        sessionId
      );
    }
  }, [isOpen, resetForm, product?.id, sessionId]);

  const availableCategories =
    graphqlCategories.length > 0
      ? graphqlCategories
          .filter(cat => cat.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder)
      : (propCategories ?? []);

  const handleCreateTag = useCallback(async () => {
    if (!newTagName.trim()) return;
    try {
      const result = await createTag(newTagName.trim(), {
        color: newTagColor,
        description: newTagDescription.trim() || newTagName.trim(),
        category: 'personalizado',
        isActive: true,
      });
      if (result.success) {
        handleInputChange('tags', [...formData.tags, newTagName.trim()]);
        setNewTagName('');
        setNewTagColor('#ff6b6b');
        setNewTagDescription('');
        toast.success('Etiqueta creada exitosamente');
      } else {
        toast.error(result.error ?? 'Error al crear la etiqueta');
      }
    } catch (e: unknown) {
      toast.error(
        e instanceof Error ? e.message : 'Error al crear la etiqueta'
      );
    }
  }, [
    newTagName,
    newTagColor,
    newTagDescription,
    createTag,
    formData.tags,
    handleInputChange,
    setNewTagName,
    setNewTagColor,
    setNewTagDescription,
  ]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!product || !validateForm()) return;
      setErrors({});

      const hasValidImages = validateBackendImageUrls(formData.images);
      if (formData.images.length > 0 && !hasValidImages) {
        setErrors({
          submit:
            'Las imágenes deben ser subidas antes de actualizar el producto',
        });
        return;
      }

      try {
        const result = await updateProduct(product.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          price: parseFloat(formData.price),
          salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
          sku: formData.sku.trim(),
          categoryId: formData.categoryId,
          stockQuantity: parseInt(formData.stockQuantity),
          tags: formData.tags,
          isActive: formData.isActive,
          images: convertImageUrlsToRelativePaths(formData.images),
          attributes: formData.attributes,
        });

        if (result) {
          setSuccessMessage('Producto actualizado exitosamente');
          setTimeout(() => {
            onSuccess(result);
            onClose();
          }, 1500);
        } else {
          setErrors({
            submit:
              'No se pudo actualizar el producto. Verifique los datos e intente nuevamente.',
          });
        }
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : 'Error al actualizar el producto.';
        setErrors({ submit: msg });
        toast.error(msg);
      }
    },
    [
      formData,
      validateForm,
      product,
      updateProduct,
      onSuccess,
      onClose,
      setErrors,
      setSuccessMessage,
    ]
  );

  if (!isOpen || !product) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        {isUpdating ? (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        ) : null}

        <ModalHeader>
          <ModalTitle>
            <Edit3 size={24} />
            Editar Producto
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            {(errors['submit'] ?? updateError) ? (
              <ErrorMessage>
                <AlertTriangle size={16} />
                {errors['submit'] ?? updateError}
              </ErrorMessage>
            ) : null}
            {successMessage ? (
              <SuccessMessage>
                <CheckCircle size={16} />
                {successMessage}
              </SuccessMessage>
            ) : null}

            <ProductFormFields
              form={form}
              isLoading={isUpdating}
              activeTags={activeTags}
              availableCategories={availableCategories}
              categoriesLoading={categoriesLoading}
              categoriesError={categoriesError}
              tagsLoading={tagsLoading}
              availableTags={availableTags}
              onCreateTag={handleCreateTag}
              entityType='product-edit'
              skuHint='Puedes editar el SKU existente o generar uno nuevo.'
              showImagePreview
            />
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={onClose} disabled={isUpdating}>
              Cancelar
            </Button>
            <Button
              type='submit'
              variant='primary'
              disabled={isUpdating}
              isLoading={isUpdating}
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
