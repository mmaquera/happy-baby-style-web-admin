import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useUpdateCategory } from '@/hooks/useUpdateCategory';
import { UpdateCategoryInput } from '@/generated/graphql';
import { SVGUpload } from './SVGUpload/SVGUpload';
import {
  X,
  Edit3,
  Hash,
  FileText,
  Image as ImageIcon,
  Settings,
  CheckCircle,
  AlertTriangle,
  SortAsc,
  Calendar,
  Clock,
  Upload,
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
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (category: Category) => void;
  category: Category | null;
}

interface CategoryFormData {
  name: string;
  description: string;
  slug: string;
  image: string;
  isActive: string;
  sortOrder: string;
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
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex?.modal || 1000};
  padding: ${theme.spacing[4]};
`;

const ModalContainer = styled(Card)`
  width: 100%;
  max-width: 700px;
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

const FormSection = styled.div`
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

const FormField = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

const Label = styled.label`
  display: block;
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[2]};
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[4]};
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${theme.colors.primary};
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.border.medium};
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`;

const SwitchLabel = styled.span`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.background.light};
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]};
  background: ${theme.colors.error}15;
  border: 1px solid ${theme.colors.error}30;
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  margin-bottom: ${theme.spacing[4]};
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]};
  background: ${theme.colors.success}15;
  border: 1px solid ${theme.colors.success}30;
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.success};
  font-size: ${theme.fontSizes.sm};
  margin-bottom: ${theme.spacing[4]};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: ${theme.borderRadius.lg};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.border.light};
  border-top: 3px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const InfoSection = styled.div`
  background: ${theme.colors.background.accent};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};

  &:last-child {
    margin-bottom: 0;
  }
`;

// Preview Components - Similar to Product ImageUpload
const CurrentImagePreview = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

const PreviewTitle = styled.h4`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing[3]} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const PreviewContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  flex-wrap: wrap;
  align-items: flex-start;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  background: ${theme.colors.background.light};
  border: 2px solid ${theme.colors.border.light};
  transition: all ${theme.transitions.base};
  flex-shrink: 0;

  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ImagePreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  background: ${theme.colors.background.light};
`;

const ImagePreviewOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity ${theme.transitions.base};

  ${ImagePreview}:hover & {
    opacity: 1;
  }
`;

const ImagePreviewActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const NoImagePreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: ${theme.colors.background.light};
  border: 2px dashed ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
`;

const SuccessIndicator = styled.div`
  margin-top: ${theme.spacing[3]};
  padding: ${theme.spacing[3]};
  background: rgba(34, 197, 94, 0.1);
  border-radius: ${theme.borderRadius.md};
  border: 1px solid rgba(34, 197, 94, 0.2);
`;

const SuccessText = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  color: rgba(34, 197, 94, 0.8);
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
`;

const SuccessDot = styled.div`
  width: 8px;
  height: 8px;
  background: rgba(34, 197, 94, 0.8);
  border-radius: 50%;
`;

const ReplaceButton = styled.button`
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${theme.transitions?.base || '0.2s ease'};

  &:hover {
    background: ${theme.colors.primary};
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${theme.colors.border.light};
    color: ${theme.colors.text.secondary};
    cursor: not-allowed;
    transform: none;
  }
`;

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    slug: '',
    image: '',
    isActive: 'true',
    sortOrder: '0',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showUploadComponent, setShowUploadComponent] = useState(false);

  const { update, loading } = useUpdateCategory();

  // Initialize form when modal opens or category changes
  useEffect(() => {
    if (isOpen && category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        slug: category.slug || '',
        image: category.image || '',
        isActive: category.isActive ? 'true' : 'false',
        sortOrder: category.sortOrder?.toString() || '0',
      });
      setErrors({});
      setSuccessMessage('');
      setShowUploadComponent(false);
    }
  }, [isOpen, category]);

  // Generate slug from name
  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }, []);

  // Auto-generate slug when name changes
  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.name),
      }));
    }
  }, [formData.name, formData.slug, generateSlug]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData['name'].trim()) {
      newErrors['name'] = 'El nombre de la categoría es requerido';
    }

    if (!formData['slug'].trim()) {
      newErrors['slug'] = 'El slug es requerido';
    } else if (!/^[a-z0-9-]+$/.test(formData['slug'])) {
      newErrors['slug'] =
        'El slug solo puede contener letras minúsculas, números y guiones';
    }

    if (formData['sortOrder'] && parseInt(formData['sortOrder']) < 0) {
      newErrors['sortOrder'] = 'El orden no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (field: keyof CategoryFormData, value: CategoryFormData[typeof field]) => {
      setFormData(prev => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  // Handle SVG upload success - store in image field
  const handleSVGUploadComplete = useCallback((svgUrl: string) => {
    setFormData(prev => ({ ...prev, image: svgUrl }));
    setErrors(prev => ({ ...prev, image: '' }));
    setShowUploadComponent(false); // Hide upload component after successful upload
  }, []);

  // Handle SVG upload error
  const handleSVGUploadError = useCallback((error: string) => {
    setErrors(prev => ({ ...prev, image: error }));
  }, []);

  // Handle showing upload component
  const handleShowUpload = useCallback(() => {
    setShowUploadComponent(true);
  }, []);

  // Handle canceling upload
  const handleCancelUpload = useCallback(() => {
    setShowUploadComponent(false);
    setErrors(prev => ({ ...prev, image: '' }));
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!validateForm() || !category) {
        return;
      }

      setErrors({});

      try {
        // Convert absolute URL to relative path for image field
        const imageUrl = formData['image'].trim();
        const relativeImagePath = imageUrl
          ? imageUrl.startsWith('http')
            ? new URL(imageUrl).pathname
            : imageUrl
          : null;

        const categoryData: UpdateCategoryInput = {
          name: formData['name'].trim(),
          description: formData['description'].trim() || null,
          slug: formData['slug'].trim(),
          image: relativeImagePath,
          isActive: formData['isActive'] === 'true',
          sortOrder: formData['sortOrder']
            ? parseInt(formData['sortOrder'])
            : null,
        };

        const rawResult = await update(category.id, categoryData);
        const result = rawResult as { success?: boolean; message?: string } | false;

        if (result && result.success) {
          setSuccessMessage('Categoría actualizada exitosamente');

          // Wait a bit before closing to show success message
          setTimeout(() => {
            const updatedCategory = {
              ...category,
              name: categoryData.name || category.name,
              description:
                categoryData.description || category.description || null,
              slug: categoryData.slug || category.slug,
              image: categoryData.image || category.image || null,
              isActive: categoryData.isActive || category.isActive,
              sortOrder: categoryData.sortOrder || category.sortOrder,
            };
            onSuccess(updatedCategory);
            onClose();
          }, 1500);
        } else {
          const errorMessage =
            (result && result.message) || 'Error al actualizar la categoría';
          setErrors({ submit: errorMessage });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Error al actualizar la categoría. Intente nuevamente.';
        setErrors({ submit: errorMessage });
      }
    },
    [formData, validateForm, update, category, onSuccess, onClose]
  );

  if (!isOpen || !category) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        {loading && (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        )}

        <ModalHeader>
          <ModalTitle>
            <Edit3 size={24} />
            Editar Categoría
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            {errors['submit'] && (
              <ErrorMessage>
                <AlertTriangle size={16} />
                {errors['submit']}
              </ErrorMessage>
            )}

            {successMessage && (
              <SuccessMessage>
                <CheckCircle size={16} />
                {successMessage}
              </SuccessMessage>
            )}

            {/* Información del Sistema */}
            <InfoSection>
              <SectionTitle>
                <Settings size={20} />
                Información del Sistema
              </SectionTitle>
              <InfoRow>
                <Calendar size={16} />
                <span>
                  Creada:{' '}
                  {new Date(category.createdAt).toLocaleDateString('es-ES')}
                </span>
              </InfoRow>
              <InfoRow>
                <Clock size={16} />
                <span>
                  Última actualización:{' '}
                  {new Date(category.updatedAt).toLocaleDateString('es-ES')}
                </span>
              </InfoRow>
              <InfoRow>
                <Hash size={16} />
                <span>ID: {category.id}</span>
              </InfoRow>
            </InfoSection>

            {/* Información Básica */}
            <FormSection>
              <SectionTitle>
                <Hash size={20} />
                Información Básica
              </SectionTitle>

              <FormField>
                <Label htmlFor='name'>Nombre de la Categoría *</Label>
                <Input
                  id='name'
                  type='text'
                  placeholder='Ej: Ropa para Bebés'
                  value={formData['name']}
                  onChange={e => handleInputChange('name', e.target.value)}
                  error={!!errors['name'] ? errors['name'] : ''}
                  disabled={loading}
                />
                {errors['name'] && (
                  <small style={{ color: theme.colors.error }}>
                    {errors['name']}
                  </small>
                )}
              </FormField>

              <FormField>
                <Label htmlFor='description'>Descripción</Label>
                <Input
                  id='description'
                  type='text'
                  placeholder='Descripción opcional de la categoría'
                  value={formData['description']}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  disabled={loading}
                />
              </FormField>

              <FormField>
                <Label htmlFor='slug'>Slug *</Label>
                <Input
                  id='slug'
                  type='text'
                  placeholder='ropa-para-bebes'
                  value={formData['slug']}
                  onChange={e => handleInputChange('slug', e.target.value)}
                  error={!!errors['slug'] ? errors['slug'] : ''}
                  disabled={loading}
                />
                {errors['slug'] && (
                  <small style={{ color: theme.colors.error }}>
                    {errors['slug']}
                  </small>
                )}
                <small
                  style={{
                    color: theme.colors.text.secondary,
                    marginTop: theme.spacing[1],
                  }}
                >
                  El slug se usa en la URL y debe ser único
                </small>
              </FormField>
            </FormSection>

            {/* Configuración */}
            <FormSection>
              <SectionTitle>
                <Settings size={20} />
                Configuración
              </SectionTitle>

              <FormField>
                <Label htmlFor='sortOrder'>Orden de Clasificación</Label>
                <Input
                  id='sortOrder'
                  type='number'
                  placeholder='0'
                  value={formData['sortOrder']}
                  onChange={e => handleInputChange('sortOrder', e.target.value)}
                  error={!!errors['sortOrder'] ? errors['sortOrder'] : ''}
                  disabled={loading}
                />
                {errors['sortOrder'] && (
                  <small style={{ color: theme.colors.error }}>
                    {errors['sortOrder']}
                  </small>
                )}
                <small
                  style={{
                    color: theme.colors.text.secondary,
                    marginTop: theme.spacing[1],
                  }}
                >
                  Número menor = aparece primero
                </small>
              </FormField>

              <FormField>
                <Label>Icono SVG de la Categoría</Label>

                {!showUploadComponent ? (
                  <CurrentImagePreview>
                    <PreviewTitle>
                      <ImageIcon size={16} />
                      Vista previa
                    </PreviewTitle>

                    <PreviewContainer>
                      {formData['image'] ? (
                        <ImagePreview>
                          <ImagePreviewImg
                            src={formData['image']}
                            alt='Imagen actual de la categoría'
                            onError={e => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <ImagePreviewOverlay>
                            <ImagePreviewActions>
                              <ReplaceButton
                                onClick={handleShowUpload}
                                disabled={loading}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.9)',
                                  color: theme.colors.text.primary,
                                  fontSize: '12px',
                                  padding: '6px 12px',
                                }}
                              >
                                <Edit3 size={14} />
                                Cambiar
                              </ReplaceButton>
                            </ImagePreviewActions>
                          </ImagePreviewOverlay>
                        </ImagePreview>
                      ) : (
                        <NoImagePreview>
                          <ImageIcon size={24} />
                          <span>Sin imagen</span>
                        </NoImagePreview>
                      )}
                    </PreviewContainer>

                    {/* Success indicator similar to products */}
                    {formData['image'] && (
                      <SuccessIndicator>
                        <SuccessText>
                          <SuccessDot />
                          <span>Imagen SVG configurada correctamente</span>
                        </SuccessText>
                      </SuccessIndicator>
                    )}

                    {/* Action button */}
                    <div style={{ marginTop: theme.spacing[3] }}>
                      <ReplaceButton
                        onClick={handleShowUpload}
                        disabled={loading}
                      >
                        {formData['image']
                          ? 'Cambiar Imagen SVG'
                          : 'Agregar Imagen SVG'}
                      </ReplaceButton>
                    </div>
                  </CurrentImagePreview>
                ) : (
                  <div>
                    <SVGUpload
                      onUploadComplete={handleSVGUploadComplete}
                      onUploadError={handleSVGUploadError}
                      entityType='category'
                      categoryId={category.id}
                      disabled={loading}
                      placeholder='Arrastra un archivo SVG aquí o haz clic para seleccionar'
                      showPreview={true}
                    />
                    <div
                      style={{
                        marginTop: theme.spacing[3],
                        display: 'flex',
                        gap: theme.spacing[2],
                        justifyContent: 'center',
                      }}
                    >
                      <Button
                        type='button'
                        variant='outline'
                        onClick={handleCancelUpload}
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {errors['image'] && (
                  <small
                    style={{
                      color: theme.colors.error,
                      marginTop: theme.spacing[2],
                      display: 'block',
                    }}
                  >
                    {errors['image']}
                  </small>
                )}
              </FormField>

              <SwitchContainer>
                <Switch>
                  <SwitchInput
                    type='checkbox'
                    checked={formData['isActive'] === 'true'}
                    onChange={e =>
                      handleInputChange(
                        'isActive',
                        e.target.checked ? 'true' : 'false'
                      )
                    }
                    disabled={loading}
                  />
                  <Slider />
                </Switch>
                <SwitchLabel>Activar categoría</SwitchLabel>
              </SwitchContainer>
            </FormSection>
          </ModalBody>

          <ModalFooter>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={
                loading || !formData['name'].trim() || !formData['slug'].trim()
              }
            >
              {loading ? 'Actualizando...' : 'Actualizar Categoría'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};
