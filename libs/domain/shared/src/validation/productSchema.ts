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

const toNumber = (v: unknown): unknown =>
  v === '' || v == null ? undefined : Number(v);

// Form-aware schema: price/salePrice/stockQuantity come in as strings from <input>
export const productFormSchema = z
  .object({
    name: z
      .string()
      .min(1, 'El nombre del producto es requerido')
      .max(200, 'Máximo 200 caracteres'),
    description: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
    sku: z
      .string()
      .min(1, 'El SKU es requerido')
      .min(3, 'El SKU debe tener al menos 3 caracteres')
      .regex(
        /^[A-Za-z0-9_-]+$/i,
        'El SKU solo puede contener letras, números, guiones y guiones bajos'
      ),
    price: z.preprocess(
      toNumber,
      z
        .number({ error: 'El precio es requerido' })
        .positive('El precio debe ser mayor a 0')
    ),
    salePrice: z.preprocess(toNumber, z.number().positive().optional()),
    categoryId: z.string().min(1, 'Debe seleccionar una categoría'),
    stockQuantity: z.preprocess(
      v => (v === '' || v == null ? 0 : Number(v)),
      z.number().int().min(0, 'El stock no puede ser negativo')
    ),
    tags: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
    images: z.array(z.string()).default([]),
    attributes: z.record(z.string(), z.string()).default({}),
  })
  .refine(
    data =>
      data.salePrice === undefined ||
      (data.price as number) === undefined ||
      data.salePrice < (data.price as number),
    {
      message: 'El precio de oferta debe ser menor al precio regular',
      path: ['salePrice'],
    }
  )
  .refine(
    data => !(data.images as string[]).some(img => img.startsWith('blob:')),
    {
      message:
        'Todas las imágenes deben ser subidas antes de guardar el producto',
      path: ['images'],
    }
  );

export type ProductFormSchemaInput = z.infer<typeof productFormSchema>;
