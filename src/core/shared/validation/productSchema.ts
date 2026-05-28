import { z } from 'zod';

export const productSchema = z
  .object({
    name: z
      .string()
      .min(1, 'El nombre es requerido')
      .max(200, 'Máximo 200 caracteres'),
    description: z
      .string()
      .max(2000, 'Máximo 2000 caracteres')
      .nullable()
      .optional(),
    sku: z
      .string()
      .min(1, 'El SKU es requerido')
      .max(100, 'Máximo 100 caracteres')
      .regex(
        /^[A-Za-z0-9_-]+$/,
        'SKU solo puede contener letras, números, guiones y guiones bajos'
      ),
    price: z.number().positive('El precio debe ser mayor a 0'),
    salePrice: z
      .number()
      .positive('El precio de oferta debe ser mayor a 0')
      .nullable()
      .optional(),
    images: z
      .array(z.string().url('URL de imagen inválida'))
      .optional()
      .default([]),
    tags: z.array(z.string().min(1)).optional().default([]),
    attributes: z.record(z.string(), z.unknown()).optional().default({}),
    isActive: z.boolean().optional().default(true),
    stockQuantity: z
      .number()
      .int()
      .min(0, 'El stock no puede ser negativo')
      .optional()
      .default(0),
    categoryId: z.string().nullable().optional(),
  })
  .refine(
    data =>
      data.salePrice === null ||
      data.salePrice === undefined ||
      data.salePrice < data.price,
    {
      message: 'El precio de oferta debe ser menor al precio original',
      path: ['salePrice'],
    }
  );

export const updateProductSchema = productSchema
  .partial()
  .omit({ sku: true })
  .extend({
    sku: z
      .string()
      .min(1, 'El SKU es requerido')
      .max(100, 'Máximo 100 caracteres')
      .regex(
        /^[A-Za-z0-9_-]+$/,
        'SKU solo puede contener letras, números, guiones y guiones bajos'
      )
      .optional(),
  });

export type ProductSchemaInput = z.infer<typeof productSchema>;
export type UpdateProductSchemaInput = z.infer<typeof updateProductSchema>;
