import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User, UserRole } from '@happy-baby/domain-user';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const editUserSchema = z.object({
  email: z.string().email('Email inválido'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  phone: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  role: z.enum(['admin', 'customer', 'staff']),
  isActive: z.boolean(),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

export interface EditUserSubmitData {
  email: string;
  role: UserRole;
  isActive: boolean;
  firstName: string;
  lastName: string;
  phone: string | null;
}

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditUserSubmitData) => Promise<void>;
  isLoading: boolean;
}

export const EditUserModal = memo<EditUserModalProps>(
  ({ user, isOpen, onClose, onSubmit, isLoading }) => {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<EditUserFormValues>({
      resolver: zodResolver(editUserSchema),
      defaultValues: {
        email: user.email,
        firstName: user.profile?.firstName ?? '',
        lastName: user.profile?.lastName ?? '',
        phone: user.profile?.phone ?? '',
        dateOfBirth: user.profile?.dateOfBirth ?? '',
        role: user.role,
        isActive: user.isActive,
      },
    });

    useEffect(() => {
      if (isOpen) {
        reset({
          email: user.email,
          firstName: user.profile?.firstName ?? '',
          lastName: user.profile?.lastName ?? '',
          phone: user.profile?.phone ?? '',
          dateOfBirth: user.profile?.dateOfBirth ?? '',
          role: user.role,
          isActive: user.isActive,
        });
      }
    }, [isOpen, user, reset]);

    const handleFormSubmit = async (data: EditUserFormValues) => {
      await onSubmit({
        email: data.email,
        role: data.role as UserRole,
        isActive: data.isActive,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone ?? null,
      });
    };

    if (!isOpen) return null;

    return (
      <div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
        onClick={onClose}
      >
        <div
          className='max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-lg'
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className='mb-6 flex items-center justify-between border-b border-border pb-4'>
            <h2 className='text-xl font-semibold text-foreground'>
              Editar Usuario
            </h2>
            <Button variant='ghost' size='small' onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <div className='mb-4 grid grid-cols-2 gap-4'>
              <div className='col-span-2'>
                <Input
                  label='Email'
                  type='email'
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>
              <Input
                label='Nombre'
                {...register('firstName')}
                error={errors.firstName?.message}
              />
              <Input
                label='Apellido'
                {...register('lastName')}
                error={errors.lastName?.message}
              />
              <Input label='Teléfono' {...register('phone')} />
              <Input
                label='Fecha de Nacimiento'
                type='date'
                {...register('dateOfBirth')}
              />
            </div>

            <div className='mb-4'>
              <label className='mb-1.5 block text-sm font-medium text-foreground'>
                Rol
              </label>
              <select
                {...register('role')}
                className='w-full cursor-pointer rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
              >
                <option value='customer'>Cliente</option>
                <option value='staff'>Staff</option>
                <option value='admin'>Administrador</option>
              </select>
            </div>

            <div className='mb-6 flex items-center gap-2.5'>
              <input
                id='isActiveEdit'
                type='checkbox'
                {...register('isActive')}
                className='h-4 w-4 accent-primary'
              />
              <label
                htmlFor='isActiveEdit'
                className='cursor-pointer text-sm text-foreground'
              >
                Usuario activo
              </label>
            </div>

            <div className='flex justify-end gap-3'>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancelar
              </Button>
              <Button type='submit' variant='primary' isLoading={isLoading}>
                Actualizar Usuario
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);
EditUserModal.displayName = 'EditUserModal';
