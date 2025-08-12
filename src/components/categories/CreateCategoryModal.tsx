import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useCreateCategory } from '@/hooks/useCreateCategory';
import { CreateCategoryInput } from '@/generated/graphql';
import { 
  X,
  FolderPlus,
  Hash,
  FileText,
  Image as ImageIcon,
  Settings,
  CheckCircle,
  AlertTriangle,
  SortAsc
} from 'lucide-react';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (category: any) => void;
}

interface CategoryFormData {
  name: string;
  description: string;
  slug: string;
  image: string;
  isActive: boolean;
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
  max-width: 600px;
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
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[4]} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
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

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
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

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    slug: '',
    image: '',
    isActive: true,
    sortOrder: '0'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const { create, loading } = useCreateCategory();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        slug: '',
        image: '',
        isActive: true,
        sortOrder: '0'
      });
      setErrors({});
      setSuccessMessage('');
    }
  }, [isOpen]);

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

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la categoría es requerido';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'El slug es requerido';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
    }

    if (formData.sortOrder && parseInt(formData.sortOrder) < 0) {
      newErrors.sortOrder = 'El orden no puede ser negativo';
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
    
    if (!validateForm()) {
      return;
    }

    setErrors({});

    try {
      const categoryData: CreateCategoryInput = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        slug: formData.slug.trim(),
        image: formData.image.trim() || undefined,
        isActive: formData.isActive,
        sortOrder: formData.sortOrder ? parseInt(formData.sortOrder) : undefined
      };

      const result = await create(categoryData);

      if (result?.success) {
        setSuccessMessage('Categoría creada exitosamente');
        
        // Wait a bit before closing to show success message
        setTimeout(() => {
          onSuccess(result.data?.entity || categoryData);
          onClose();
        }, 1500);
      }

    } catch (error) {
      setErrors({ submit: 'Error al crear la categoría. Intente nuevamente.' });
    }
  }, [formData, validateForm, create, onSuccess, onClose]);

  if (!isOpen) return null;

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
            <FolderPlus size={24} />
            Crear Nueva Categoría
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            {errors.submit && (
              <ErrorMessage>
                <AlertTriangle size={16} />
                {errors.submit}
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
                <Hash size={20} />
                Información Básica
              </SectionTitle>

              <FormField>
                <Label htmlFor="name">Nombre de la Categoría *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ej: Ropa para Bebés"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!errors.name}
                  disabled={loading}
                />
                {errors.name && <small style={{ color: theme.colors.error }}>{errors.name}</small>}
              </FormField>

              <FormField>
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Descripción opcional de la categoría"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={loading}
                />
              </FormField>

              <FormRow>
                <FormField>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    type="text"
                    placeholder="ejemplo-slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    error={!!errors.slug}
                    disabled={loading}
                  />
                  {errors.slug && <small style={{ color: theme.colors.error }}>{errors.slug}</small>}
                </FormField>

                <FormField>
                  <Label htmlFor="sortOrder">Orden de Clasificación</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    placeholder="0"
                    value={formData.sortOrder}
                    onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                    error={!!errors.sortOrder}
                    disabled={loading}
                  />
                  {errors.sortOrder && <small style={{ color: theme.colors.error }}>{errors.sortOrder}</small>}
                </FormField>
              </FormRow>
            </FormSection>

            {/* Configuración */}
            <FormSection>
              <SectionTitle>
                <Settings size={20} />
                Configuración
              </SectionTitle>

              <FormField>
                <Label htmlFor="image">URL de Imagen</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  disabled={loading}
                />
              </FormField>

              <SwitchContainer>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
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
              disabled={loading || !formData.name.trim() || !formData.slug.trim()}
            >
              {loading ? 'Creando...' : 'Crear Categoría'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};
