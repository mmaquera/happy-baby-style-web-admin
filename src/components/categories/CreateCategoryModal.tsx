import type React from 'react';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useCreateCategory } from '@/hooks/useCreateCategory';
import { type CreateCategoryInput } from '@/generated/graphql';
import { SVGUpload } from './SVGUpload/SVGUpload';
import {
  createCategoryFormSchema,
  type CreateCategoryFormData,
} from '@/core/shared/validation/categorySchema';
import {
  X,
  FolderPlus,
  Hash,
  Settings,
  CheckCircle,
} from 'lucide-react';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (category: Record<string, unknown>) => void;
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

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { create, loading } = useCreateCategory();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      image: '',
      isActive: true,
      sortOrder: 0,
    },
  });

  const nameValue = watch('name');
  const slugValue = watch('slug');
  const isActiveValue = watch('isActive');

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const generateSlug = useCallback(
    (name: string) =>
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-'),
    []
  );

  useEffect(() => {
    if (nameValue && !slugValue) {
      setValue('slug', generateSlug(nameValue), { shouldValidate: false });
    }
  }, [nameValue, slugValue, generateSlug, setValue]);

  const handleSVGUploadComplete = useCallback(
    (svgUrl: string) => setValue('image', svgUrl),
    [setValue]
  );

  const handleSVGUploadError = useCallback(
    (_error: string) => {
      // Error displayed inline by SVGUpload component
    },
    []
  );

  const onSubmit = useCallback(
    async (data: CreateCategoryFormData) => {
      try {
        const categoryData: CreateCategoryInput = {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          slug: data.slug.trim(),
          image: data.image?.trim() || null,
          isActive: data.isActive,
          sortOrder: data.sortOrder ?? null,
        };

        const rawResult = await create(categoryData);
        const result = rawResult as
          | { success?: boolean; data?: { entity?: unknown } | null }
          | false;

        if (result && result.success) {
          setTimeout(() => {
            onSuccess(
              (result.data?.entity as Record<string, unknown>) ||
                (categoryData as unknown as Record<string, unknown>)
            );
            onClose();
          }, 1500);
        }
      } catch (_error) {
        // Network/GraphQL errors are surfaced via useCreateCategory toast
      }
    },
    [create, onSuccess, onClose]
  );

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        {loading ? (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        ) : null}

        <ModalHeader>
          <ModalTitle>
            <FolderPlus size={24} />
            Crear Nueva Categoría
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <ModalBody>
            {isSubmitSuccessful ? (
              <SuccessMessage>
                <CheckCircle size={16} />
                Categoría creada exitosamente
              </SuccessMessage>
            ) : null}

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
                  error={errors.name?.message}
                  disabled={loading}
                  {...register('name')}
                />
                {errors.name ? (
                  <small style={{ color: theme.colors.error }}>
                    {errors.name.message}
                  </small>
                ) : null}
              </FormField>

              <FormField>
                <Label htmlFor='description'>Descripción</Label>
                <Input
                  id='description'
                  type='text'
                  placeholder='Descripción opcional de la categoría'
                  disabled={loading}
                  {...register('description')}
                />
              </FormField>

              <FormRow>
                <FormField>
                  <Label htmlFor='slug'>Slug *</Label>
                  <Input
                    id='slug'
                    type='text'
                    placeholder='ejemplo-slug'
                    error={errors.slug?.message}
                    disabled={loading}
                    {...register('slug')}
                  />
                  {errors.slug ? (
                    <small style={{ color: theme.colors.error }}>
                      {errors.slug.message}
                    </small>
                  ) : null}
                </FormField>

                <FormField>
                  <Label htmlFor='sortOrder'>Orden de Clasificación</Label>
                  <Input
                    id='sortOrder'
                    type='number'
                    placeholder='0'
                    error={errors.sortOrder?.message}
                    disabled={loading}
                    {...register('sortOrder', { valueAsNumber: true })}
                  />
                  {errors.sortOrder ? (
                    <small style={{ color: theme.colors.error }}>
                      {errors.sortOrder.message}
                    </small>
                  ) : null}
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
                <Label>Icono SVG de la Categoría</Label>
                <SVGUpload
                  onUploadComplete={handleSVGUploadComplete}
                  onUploadError={handleSVGUploadError}
                  entityType='category'
                  disabled={loading}
                  placeholder='Arrastra un archivo SVG aquí o haz clic para seleccionar'
                  showPreview={true}
                />
              </FormField>

              <SwitchContainer>
                <Switch>
                  <SwitchInput
                    type='checkbox'
                    checked={isActiveValue}
                    onChange={e => setValue('isActive', e.target.checked)}
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
            <Button type='submit' disabled={loading}>
              {loading ? 'Creando...' : 'Crear Categoría'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};
