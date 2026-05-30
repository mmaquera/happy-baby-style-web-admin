import type {
  Category as GQLCategory,
  CreateCategoryInput as GQLCreateCategoryInput,
  UpdateCategoryInput as GQLUpdateCategoryInput,
} from '@/generated/graphql';
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@happy-baby/domain-category';

export const categoryMapper = {
  toDomain(gql: GQLCategory): Category {
    return {
      id: gql.id,
      name: gql.name,
      description: gql.description ?? null,
      slug: gql.slug,
      image: gql.image ?? null,
      isActive: gql.isActive,
      sortOrder: gql.sortOrder,
      productCount: gql.products?.length ?? 0,
      createdAt: new Date(gql.createdAt as string),
      updatedAt: new Date(gql.updatedAt as string),
    };
  },

  toCreateDTO(input: CreateCategoryInput): GQLCreateCategoryInput {
    return {
      name: input.name,
      slug: input.slug ?? input.name.toLowerCase().replace(/\s+/g, '-'),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.image !== undefined && { image: input.image }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
    };
  },

  toUpdateDTO(input: UpdateCategoryInput): GQLUpdateCategoryInput {
    return {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.slug !== undefined && { slug: input.slug }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.image !== undefined && { image: input.image }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
    };
  },
};
