import { memo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import XIcon from 'lucide-react/dist/esm/icons/x';
import FolderPlusIcon from 'lucide-react/dist/esm/icons/folder-plus';
import HashIcon from 'lucide-react/dist/esm/icons/hash';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useCreateCategory } from '@/hooks/useCreateCategory';
import type { CreateCategoryInput } from '@/generated/graphql';
import { SVGUpload } from './SVGUpload/SVGUpload';
import {
  createCategoryFormSchema,
  type CreateCategoryFormData,
} from '@happy-baby/domain-shared';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (category: Record<string, unknown>) => void;
}

export const CreateCategoryModal = memo<CreateCategoryModalProps>(
  ({ isOpen, onClose, onSuccess }) => {
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

    const handleSVGUploadError = useCallback((_error: string) => {}, []);

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
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
        <Card className='relative max-h-[90vh] w-full max-w-xl overflow-y-auto p-0 shadow-2xl'>
          {loading ? (
            <div className='absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/90'>
              <div className='h-10 w-10 animate-spin rounded-full border-3 border-border border-t-primary' />
            </div>
          ) : null}

          {/* Header */}
          <div className='flex items-center justify-between border-b border-border px-6 py-4'>
            <h2 className='font-heading flex items-center gap-2 text-xl font-semibold text-foreground'>
              <FolderPlusIcon size={24} />
              Crear Nueva Categoría
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
                  Categoría creada exitosamente
                </div>
              ) : null}

              {/* Basic info */}
              <section className='mb-6'>
                <h3 className='font-heading mb-4 flex items-center gap-2 text-lg font-semibold text-foreground'>
                  <HashIcon size={20} />
                  Información Básica
                </h3>

                <div className='mb-4'>
                  <label
                    htmlFor='name'
                    className='mb-1.5 block text-sm font-medium text-foreground'
                  >
                    Nombre de la Categoría *
                  </label>
                  <Input
                    id='name'
                    type='text'
                    placeholder='Ej: Ropa para Bebés'
                    error={errors.name?.message}
                    disabled={loading}
                    {...register('name')}
                  />
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='description'
                    className='mb-1.5 block text-sm font-medium text-foreground'
                  >
                    Descripción
                  </label>
                  <Input
                    id='description'
                    type='text'
                    placeholder='Descripción opcional de la categoría'
                    disabled={loading}
                    {...register('description')}
                  />
                </div>

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div>
                    <label
                      htmlFor='slug'
                      className='mb-1.5 block text-sm font-medium text-foreground'
                    >
                      Slug *
                    </label>
                    <Input
                      id='slug'
                      type='text'
                      placeholder='ejemplo-slug'
                      error={errors.slug?.message}
                      disabled={loading}
                      {...register('slug')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='sortOrder'
                      className='mb-1.5 block text-sm font-medium text-foreground'
                    >
                      Orden de Clasificación
                    </label>
                    <Input
                      id='sortOrder'
                      type='number'
                      placeholder='0'
                      error={errors.sortOrder?.message}
                      disabled={loading}
                      {...register('sortOrder', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </section>

              {/* Config */}
              <section>
                <h3 className='font-heading mb-4 flex items-center gap-2 text-lg font-semibold text-foreground'>
                  <SettingsIcon size={20} />
                  Configuración
                </h3>

                <div className='mb-4'>
                  <label className='mb-1.5 block text-sm font-medium text-foreground'>
                    Icono SVG de la Categoría
                  </label>
                  <SVGUpload
                    onUploadComplete={handleSVGUploadComplete}
                    onUploadError={handleSVGUploadError}
                    entityType='category'
                    disabled={loading}
                    placeholder='Arrastra un archivo SVG aquí o haz clic para seleccionar'
                    showPreview={true}
                  />
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
                {loading ? 'Creando...' : 'Crear Categoría'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }
);
CreateCategoryModal.displayName = 'CreateCategoryModal';
