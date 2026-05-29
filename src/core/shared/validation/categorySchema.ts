import { z } from 'zod';

const categoryObjectSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(200, 'Máximo 200 caracteres'),
  description: z
    .string()
    .max(2000, 'Máximo 2000 caracteres')
    .nullable()
    .optional(),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .max(200, 'Máximo 200 caracteres')
    .regex(
      /^[a-z0-9-]+$/,
      'El slug solo puede contener letras minúsculas, números y guiones'
    )
    .optional(),
  image: z.string().url('URL de imagen inválida').nullable().optional(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z
    .number()
    .int()
    .min(0, 'El orden no puede ser negativo')
    .optional()
    .default(0),
});

export const categorySchema = categoryObjectSchema;

export const updateCategorySchema = categoryObjectSchema.partial();

export type CategorySchemaInput = z.infer<typeof categorySchema>;
export type UpdateCategorySchemaInput = z.infer<typeof updateCategorySchema>;
