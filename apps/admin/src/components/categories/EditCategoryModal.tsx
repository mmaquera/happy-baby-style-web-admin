import { memo, useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import XIcon from 'lucide-react/dist/esm/icons/x';
import Edit3Icon from 'lucide-react/dist/esm/icons/edit-3';
import HashIcon from 'lucide-react/dist/esm/icons/hash';
import ImageIcon from 'lucide-react/dist/esm/icons/image';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar';
import ClockIcon from 'lucide-react/dist/esm/icons/clock';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useUpdateCategory } from '@/hooks/useUpdateCategory';
import type { UpdateCategoryInput } from '@/generated/graphql';
import { SVGUpload } from './SVGUpload/SVGUpload';
import type { Category } from './types';
import {
  createCategoryFormSchema,
  type CreateCategoryFormData,
} from '@/core/shared/validation/categorySchema';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (category: Category) => void;
  category: Category | null;
}

export const EditCategoryModal = memo<EditCategoryModalProps>(
  ({ isOpen, onClose, onSuccess, category }) => {
    const [showUpload, setShowUpload] = useState(false);
    const { update, loading } = useUpdateCategory();

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

    const imageValue = watch('image');
    const isActiveValue = watch('isActive');

    useEffect(() => {
      if (isOpen && category) {
        reset({
          name: category.name ?? '',
          description: category.description ?? '',
          slug: category.slug ?? '',
          image: category.image ?? '',
          isActive: category.isActive,
          sortOrder: category.sortOrder ?? 0,
        });
        setShowUpload(false);
      }
    }, [isOpen, category, reset]);

    const handleSVGUploadComplete = useCallback(
      (svgUrl: string) => {
        setValue('image', svgUrl);
        setShowUpload(false);
      },
      [setValue]
    );

    const handleSVGUploadError = useCallback((_error: string) => {}, []);

    const onSubmit = useCallback(
      async (data: CreateCategoryFormData) => {
        if (!category) return;

        const imageUrl = data.image?.trim() ?? '';
        const relativeImagePath = imageUrl
          ? imageUrl.startsWith('http')
            ? new URL(imageUrl).pathname
            : imageUrl
          : null;

        const categoryData: UpdateCategoryInput = {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          slug: data.slug.trim(),
          image: relativeImagePath,
          isActive: data.isActive,
          sortOrder: data.sortOrder ?? null,
        };

        const rawResult = await update(category.id, categoryData);
        const result = rawResult as
          | { success?: boolean; message?: string }
          | false;

        if (result && result.success) {
          setTimeout(() => {
            const updatedCategory: Category = {
              ...category,
              name: categoryData.name ?? category.name,
              description: categoryData.description ?? category.description,
              slug: categoryData.slug ?? category.slug,
              image: categoryData.image ?? category.image,
              isActive: categoryData.isActive ?? category.isActive,
              sortOrder: categoryData.sortOrder ?? category.sortOrder,
            };
            onSuccess(updatedCategory);
            onClose();
          }, 1500);
        }
      },
      [update, category, onSuccess, onClose]
    );

    if (!isOpen || !category) return null;

    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
        <Card className='relative max-h-[90vh] w-full max-w-2xl overflow-y-auto p-0 shadow-2xl'>
          {loading ? (
            <div className='absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/90'>
              <div className='h-10 w-10 animate-spin rounded-full border-3 border-border border-t-primary' />
            </div>
          ) : null}

          {/* Header */}
          <div className='flex items-center justify-between border-b border-border px-6 py-4'>
            <h2 className='font-heading flex items-center gap-2 text-xl font-semibold text-foreground'>
              <Edit3Icon size={24} />
              Editar Categoría
            </h2>
            <button
              onClick={onClose}
              className='rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
            >
              <XIcon size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className='p-6'>
              {isSubmitSuccessful ? (
                <div className='mb-4 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700'>
                  <CheckCircleIcon size={16} />
                  Categoría actualizada exitosamente
                </div>
              ) : null}

              {/* System info */}
              <section className='mb-6 rounded-md bg-muted/40 p-4'>
                <h3 className='font-heading mb-3 flex items-center gap-2 text-base font-medium text-foreground'>
                  <SettingsIcon size={18} />
                  Información del Sistema
                </h3>
                <div className='space-y-1.5 text-sm text-muted-foreground'>
                  <p className='flex items-center gap-2'>
                    <CalendarIcon size={14} />
                    Creada:{' '}
                    {new Date(category.createdAt).toLocaleDateString('es-ES')}
                  </p>
                  <p className='flex items-center gap-2'>
                    <ClockIcon size={14} />
                    Última actualización:{' '}
                    {new Date(category.updatedAt).toLocaleDateString('es-ES')}
                  </p>
                  <p className='flex items-center gap-2'>
                    <HashIcon size={14} />
                    ID: {category.id}
                  </p>
                </div>
              </section>

              {/* Basic info */}
              <section className='mb-6'>
                <h3 className='font-heading mb-4 flex items-center gap-2 text-lg font-semibold text-foreground'>
                  <HashIcon size={20} />
                  Información Básica
                </h3>

                <div className='mb-4'>
                  <label
                    htmlFor='edit-name'
                    className='mb-1.5 block text-sm font-medium text-foreground'
                  >
                    Nombre de la Categoría *
                  </label>
                  <Input
                    id='edit-name'
                    type='text'
                    placeholder='Ej: Ropa para Bebés'
                    error={errors.name?.message}
                    disabled={loading}
                    {...register('name')}
                  />
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='edit-description'
                    className='mb-1.5 block text-sm font-medium text-foreground'
                  >
                    Descripción
                  </label>
                  <Input
                    id='edit-description'
                    type='text'
                    placeholder='Descripción opcional de la categoría'
                    disabled={loading}
                    {...register('description')}
                  />
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='edit-slug'
                    className='mb-1.5 block text-sm font-medium text-foreground'
                  >
                    Slug *
                  </label>
                  <Input
                    id='edit-slug'
                    type='text'
                    placeholder='ropa-para-bebes'
                    error={errors.slug?.message}
                    disabled={loading}
                    {...register('slug')}
                  />
                  <p className='mt-1 text-xs text-muted-foreground'>
                    El slug se usa en la URL y debe ser único
                  </p>
                </div>
              </section>

              {/* Config */}
              <section>
                <h3 className='font-heading mb-4 flex items-center gap-2 text-lg font-semibold text-foreground'>
                  <SettingsIcon size={20} />
                  Configuración
                </h3>

                <div className='mb-4'>
                  <label
                    htmlFor='edit-sortOrder'
                    className='mb-1.5 block text-sm font-medium text-foreground'
                  >
                    Orden de Clasificación
                  </label>
                  <Input
                    id='edit-sortOrder'
                    type='number'
                    placeholder='0'
                    error={errors.sortOrder?.message}
                    disabled={loading}
                    {...register('sortOrder', { valueAsNumber: true })}
                  />
                  <p className='mt-1 text-xs text-muted-foreground'>
                    Número menor = aparece primero
                  </p>
                </div>

                {/* Image section */}
                <div className='mb-4'>
                  <label className='mb-1.5 block text-sm font-medium text-foreground'>
                    Icono SVG de la Categoría
                  </label>

                  {showUpload ? (
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
                      <div className='mt-3 flex justify-center'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => setShowUpload(false)}
                          disabled={loading}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className='mb-3 flex items-center gap-3'>
                        {imageValue ? (
                          <div className='relative h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-md border-2 border-border bg-muted'>
                            <img
                              src={imageValue}
                              alt='Imagen actual de la categoría'
                              className='h-full w-full object-contain'
                              onError={e => {
                                const t = e.target as HTMLImageElement;
                                t.style.display = 'none';
                              }}
                            />
                          </div>
                        ) : (
                          <div className='flex h-[120px] w-[120px] flex-shrink-0 flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-muted text-muted-foreground'>
                            <ImageIcon size={24} />
                            <span className='mt-1 text-xs'>Sin imagen</span>
                          </div>
                        )}

                        {imageValue ? (
                          <div className='rounded-md border border-green-200 bg-green-50 p-3'>
                            <p className='flex items-center gap-2 text-sm font-medium text-green-700'>
                              <span className='h-2 w-2 rounded-full bg-green-500' />
                              Imagen SVG configurada correctamente
                            </p>
                          </div>
                        ) : null}
                      </div>

                      <button
                        type='button'
                        onClick={() => setShowUpload(true)}
                        disabled={loading}
                        className='rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {imageValue
                          ? 'Cambiar Imagen SVG'
                          : 'Agregar Imagen SVG'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Toggle */}
                <label className='flex cursor-pointer items-center gap-3'>
                  <span className='relative inline-block h-6 w-12'>
                    <input
                      type='checkbox'
                      className='peer sr-only'
                      checked={isActiveValue}
                      onChange={e => setValue('isActive', e.target.checked)}
                      disabled={loading}
                    />
                    <span className='absolute inset-0 rounded-full bg-muted transition-colors peer-checked:bg-primary' />
                    <span className='absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-[26px]' />
                  </span>
                  <span className='text-sm text-muted-foreground'>
                    Activar categoría
                  </span>
                </label>
              </section>
            </div>

            {/* Footer */}
            <div className='flex justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar Categoría'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }
);
EditCategoryModal.displayName = 'EditCategoryModal';
