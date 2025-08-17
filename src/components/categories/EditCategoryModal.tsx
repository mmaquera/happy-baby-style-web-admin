import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useUpdateCategory } from '@/hooks/useUpdateCategory';
import { UpdateCategoryInput } from '@/generated/graphql';
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
  Clock
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
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
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
    content: "";
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  category
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    slug: '',
    image: '',
    isActive: 'true',
    sortOrder: '0'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

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
        sortOrder: category.sortOrder?.toString() || '0'
      });
      setErrors({});
      setSuccessMessage('');
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
        slug: generateSlug(formData.name)
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
      newErrors['slug'] = 'El slug solo puede contener letras minúsculas, números y guiones';
    }

    if (formData['sortOrder'] && parseInt(formData['sortOrder']) < 0) {
      newErrors['sortOrder'] = 'El orden no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof CategoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm() || !category) {
      return;
    }

    setErrors({});

    try {
      const categoryData: UpdateCategoryInput = {
        name: formData['name'].trim(),
        description: formData['description'].trim() || null,
        slug: formData['slug'].trim(),
        image: formData['image'].trim() || null,
        isActive: formData['isActive'] === 'true',
        sortOrder: formData['sortOrder'] ? parseInt(formData['sortOrder']) : null
      };

      const result = await update(category.id, categoryData);

      if (result?.success) {
        setSuccessMessage('Categoría actualizada exitosamente');
        
        // Wait a bit before closing to show success message
        setTimeout(() => {
          const updatedCategory = {
            ...category,
            name: categoryData.name || category.name,
            description: categoryData.description || category.description || null,
            slug: categoryData.slug || category.slug,
            image: categoryData.image || category.image || null,
            isActive: categoryData.isActive || category.isActive,
            sortOrder: categoryData.sortOrder || category.sortOrder
          };
          onSuccess(updatedCategory);
          onClose();
        }, 1500);
      } else {
        const errorMessage = result?.message || 'Error al actualizar la categoría';
        setErrors({ submit: errorMessage });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la categoría. Intente nuevamente.';
      setErrors({ submit: errorMessage });
    }
  }, [formData, validateForm, update, category, onSuccess, onClose]);

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
                <span>Creada: {new Date(category.createdAt).toLocaleDateString('es-ES')}</span>
              </InfoRow>
              <InfoRow>
                <Clock size={16} />
                <span>Última actualización: {new Date(category.updatedAt).toLocaleDateString('es-ES')}</span>
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
                <Label htmlFor="name">Nombre de la Categoría *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ej: Ropa para Bebés"
                  value={formData['name']}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!errors['name'] ? errors['name'] : ''}
                  disabled={loading}
                />
                {errors['name'] && <small style={{ color: theme.colors.error }}>{errors['name']}</small>}
              </FormField>

              <FormField>
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Descripción opcional de la categoría"
                  value={formData['description']}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={loading}
                />
              </FormField>

              <FormField>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  type="text"
                  placeholder="ropa-para-bebes"
                  value={formData['slug']}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  error={!!errors['slug'] ? errors['slug'] : ''}
                  disabled={loading}
                />
                {errors['slug'] && <small style={{ color: theme.colors.error }}>{errors['slug']}</small>}
                <small style={{ color: theme.colors.text.secondary, marginTop: theme.spacing[1] }}>
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
                <Label htmlFor="sortOrder">Orden de Clasificación</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  placeholder="0"
                  value={formData['sortOrder']}
                  onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                  error={!!errors['sortOrder'] ? errors['sortOrder'] : ''}
                  disabled={loading}
                />
                {errors['sortOrder'] && <small style={{ color: theme.colors.error }}>{errors['sortOrder']}</small>}
                <small style={{ color: theme.colors.text.secondary, marginTop: theme.spacing[1] }}>
                  Número menor = aparece primero
                </small>
              </FormField>

              <FormField>
                <Label htmlFor="image">URL de Imagen</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData['image']}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  disabled={loading}
                />
              </FormField>

              <SwitchContainer>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={formData['isActive'] === 'true'}
                    onChange={(e) => handleInputChange('isActive', e.target.checked ? 'true' : 'false')}
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
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData['name'].trim() || !formData['slug'].trim()}
            >
              {loading ? 'Actualizando...' : 'Actualizar Categoría'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};
