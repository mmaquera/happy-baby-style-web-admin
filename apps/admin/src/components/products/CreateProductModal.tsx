import type React from 'react';
import { useCallback, useEffect } from 'react';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import XIcon from 'lucide-react/dist/esm/icons/x';
import PlusIcon from 'lucide-react/dist/esm/icons/plus';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import { Button } from '@/components/ui/Button';
import type { Category, Product } from '@happy-baby/feature-products';
import {
  useProductActions,
  useProductForm,
  ProductFormFields,
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
  useTags,
} from '@happy-baby/feature-products';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'react-hot-toast';
import {
  convertImageUrlsToRelativePaths,
  validateBackendImageUrls,
} from '@/utils/imageUtils';
import { logger } from '@/utils/logger';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: Product) => void;
  categories: Category[];
  availableTags?: string[];
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categories: propCategories,
  availableTags,
}) => {
  const {
    createProduct,
    loading: isCreating,
    error: createError,
  } = useProductActions();
  const form = useProductForm(null, 'product-session');
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
    if (isOpen) {
      resetForm(true);
      logger.debug('CreateProductModal opened, session:', sessionId);
    }
  }, [isOpen, resetForm, sessionId]);

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
      if (!validateForm()) return;
      setErrors({});

      const hasValidImages = validateBackendImageUrls(formData.images);
      if (formData.images.length > 0 && !hasValidImages) {
        setErrors({
          submit: 'Las imágenes deben ser subidas antes de crear el producto',
        });
        return;
      }

      try {
        const result = await createProduct({
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
          setSuccessMessage('Producto creado exitosamente');
          setTimeout(() => {
            onSuccess(result);
            onClose();
          }, 1500);
        } else {
          setErrors({
            submit:
              'No se pudo crear el producto. Verifique los datos e intente nuevamente.',
          });
        }
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : 'Error al crear el producto.';
        setErrors({ submit: msg });
        toast.error(msg);
      }
    },
    [
      formData,
      validateForm,
      createProduct,
      onSuccess,
      onClose,
      setErrors,
      setSuccessMessage,
    ]
  );

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        {isCreating ? (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        ) : null}

        <ModalHeader>
          <ModalTitle>
            <PackageIcon size={24} />
            Crear Nuevo Producto
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <XIcon size={20} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            {(errors['submit'] ?? createError) ? (
              <ErrorMessage>
                <AlertTriangleIcon size={16} />
                {errors['submit'] ?? createError}
              </ErrorMessage>
            ) : null}
            {successMessage ? (
              <SuccessMessage>
                <CheckCircleIcon size={16} />
                {successMessage}
              </SuccessMessage>
            ) : null}

            <ProductFormFields
              form={form}
              isLoading={isCreating}
              activeTags={activeTags}
              availableCategories={availableCategories}
              categoriesLoading={categoriesLoading}
              categoriesError={categoriesError}
              tagsLoading={tagsLoading}
              availableTags={availableTags}
              onCreateTag={handleCreateTag}
              entityType='product-draft'
              skuHint='SKU generado automáticamente. Puedes editarlo o generar uno nuevo.'
            />
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={onClose} disabled={isCreating}>
              Cancelar
            </Button>
            <Button
              type='submit'
              variant='primary'
              disabled={isCreating}
              isLoading={isCreating}
            >
              <PlusIcon size={16} />
              Crear Producto
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};
