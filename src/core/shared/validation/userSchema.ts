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
