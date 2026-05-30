import type {
  Product as GQLProduct,
  CreateProductInput as GQLCreateInput,
  UpdateProductInput as GQLUpdateInput,
} from '@/generated/graphql';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from '@happy-baby/domain-product';

const parseDecimal = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  return 0;
};

export const productMapper = {
  toDomain(gql: GQLProduct): Product {
    return {
      id: gql.id,
      name: gql.name,
      description: gql.description ?? null,
      sku: gql.sku,
      price: parseDecimal(gql.price),
      salePrice: gql.salePrice != null ? parseDecimal(gql.salePrice) : null,
      images: gql.images ?? [],
      tags: gql.tags ?? [],
      attributes: (gql.attributes as Record<string, unknown>) ?? {},
      isActive: gql.isActive,
      stockQuantity: gql.stockQuantity,
      categoryId: gql.categoryId ?? null,
      rating: gql.rating != null ? parseDecimal(gql.rating) : null,
      reviewCount: gql.reviewCount,
      createdAt: new Date(gql.createdAt as string),
      updatedAt: new Date(gql.updatedAt as string),
    };
  },

  toCreateDTO(input: CreateProductInput): GQLCreateInput {
    return {
      name: input.name,
      sku: input.sku,
      price: input.price,
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.salePrice !== undefined && { salePrice: input.salePrice }),
      ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
      images: input.images ?? [],
      tags: input.tags ?? [],
      attributes: input.attributes ?? {},
      isActive: input.isActive ?? true,
      stockQuantity: input.stockQuantity ?? 0,
    };
  },

  // eslint-disable-next-line complexity -- each optional field is one conditional spread; complexity is structural, not logical
  toUpdateDTO(input: UpdateProductInput): GQLUpdateInput {
    return {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.sku !== undefined && { sku: input.sku }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.salePrice !== undefined && { salePrice: input.salePrice }),
      ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
      ...(input.images !== undefined && { images: input.images }),
      ...(input.tags !== undefined && { tags: input.tags }),
      ...(input.attributes !== undefined && { attributes: input.attributes }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.stockQuantity !== undefined && {
        stockQuantity: input.stockQuantity,
      }),
    };
  },
};
