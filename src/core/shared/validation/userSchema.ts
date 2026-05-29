import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  role: z.enum(['admin', 'customer', 'staff']).optional(),
  phone: z.string().nullable().optional(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  firstName: z.string().min(1, 'El nombre es requerido').optional(),
  lastName: z.string().min(1, 'El apellido es requerido').optional(),
  role: z.enum(['admin', 'customer', 'staff']).optional(),
  isActive: z.boolean().optional(),
  phone: z.string().nullable().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export const createUserFormSchema = z.object({
  email: z.string().min(1, 'Email es requerido').email('Email no válido'),
  password: z
    .string()
    .min(1, 'Contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  phone: z.string().nullable().optional(),
  dateOfBirth: z
    .string()
    .nullable()
    .optional()
    .refine(val => {
      if (!val) return true;
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      if (date > new Date()) return false;
      if (date < new Date('1900-01-01')) return false;
      return true;
    }, 'Fecha de nacimiento inválida'),
  role: z.enum(['admin', 'customer', 'staff']),
  isActive: z.boolean(),
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
