import { z } from 'zod';

const pricePositive = z.number().positive('El precio debe ser mayor a 0');

// Base object schema without the cross-field refinement so .partial() works in zod v4
const productObjectSchema = z.object({
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
  price: pricePositive,
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
});

const salePriceRefinement = (data: {
  price?: number | undefined;
  salePrice?: number | null | undefined;
}): boolean =>
  data.salePrice === null ||
  data.salePrice === undefined ||
  data.price === undefined ||
  data.salePrice < data.price!;

const salePriceRefinementOptions = {
  message: 'El precio de oferta debe ser menor al precio original',
  path: ['salePrice'],
};

export const productSchema = productObjectSchema.refine(
  salePriceRefinement,
  salePriceRefinementOptions
);

export const updateProductSchema = productObjectSchema
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
  })
  .refine(salePriceRefinement, salePriceRefinementOptions);

export type ProductSchemaInput = z.infer<typeof productSchema>;
export type UpdateProductSchemaInput = z.infer<typeof updateProductSchema>;
