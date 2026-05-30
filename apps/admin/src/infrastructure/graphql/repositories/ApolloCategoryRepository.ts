import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import type { CategoryRepository } from '@happy-baby/domain-category';
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryFilter,
  CategoryPage,
} from '@happy-baby/domain-category';
import type { Result } from '@happy-baby/domain-shared';
import { ok, err } from '@happy-baby/domain-shared';
import { categoryMapper } from '../mappers/categoryMapper';
import type {
  Category as GQLCategory,
  CategoryFilterInput,
} from '@/generated/graphql';
import {
  GetCategoriesDocument,
  GetCategoryDocument,
  CreateCategoryDocument,
  UpdateCategoryDocument,
  DeleteCategoryDocument,
  type GetCategoriesQuery,
  type GetCategoriesQueryVariables,
  type GetCategoryQuery,
  type GetCategoryQueryVariables,
  type CreateCategoryMutation,
  type CreateCategoryMutationVariables,
  type UpdateCategoryMutation,
  type UpdateCategoryMutationVariables,
  type DeleteCategoryMutation,
  type DeleteCategoryMutationVariables,
} from '@/generated/graphql';

export class ApolloCategoryRepository implements CategoryRepository {
  constructor(private readonly client: ApolloClient<NormalizedCacheObject>) {}

  async findAll(
    filter?: CategoryFilter,
    limit = 20,
    offset = 0
  ): Promise<Result<CategoryPage>> {
    try {
      const { data } = await this.client.query<
        GetCategoriesQuery,
        GetCategoriesQueryVariables
      >({
        query: GetCategoriesDocument,
        variables: {
          filters: filter ? this.toGQLFilter(filter) : null,
          pagination: { limit, offset },
        },
        fetchPolicy: 'network-only',
      });

      const responseData = data.categories?.data;
      if (!responseData) {
        return ok({ items: [], total: 0, hasMore: false });
      }

      return ok({
        items: responseData.items.map(item =>
          categoryMapper.toDomain(item as GQLCategory)
        ),
        total: responseData.pagination.total,
        hasMore: responseData.pagination.hasMore,
      });
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async findById(id: string): Promise<Result<Category>> {
    try {
      const { data } = await this.client.query<
        GetCategoryQuery,
        GetCategoryQueryVariables
      >({
        query: GetCategoryDocument,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      const entity = data.category?.data?.entity;
      if (!entity) {
        return err(new Error(`Categoría "${id}" no encontrada`));
      }
      return ok(categoryMapper.toDomain(entity as GQLCategory));
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async create(input: CreateCategoryInput): Promise<Result<Category>> {
    try {
      const { data } = await this.client.mutate<
        CreateCategoryMutation,
        CreateCategoryMutationVariables
      >({
        mutation: CreateCategoryDocument,
        variables: { input: categoryMapper.toCreateDTO(input) },
      });

      const entity = data?.createCategory?.data?.entity;
      if (!entity || !data?.createCategory?.success) {
        return err(
          new Error(data?.createCategory?.message ?? 'Error al crear categoría')
        );
      }
      return ok(categoryMapper.toDomain(entity as GQLCategory));
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async update(
    id: string,
    input: UpdateCategoryInput
  ): Promise<Result<Category>> {
    try {
      const { data } = await this.client.mutate<
        UpdateCategoryMutation,
        UpdateCategoryMutationVariables
      >({
        mutation: UpdateCategoryDocument,
        variables: { id, input: categoryMapper.toUpdateDTO(input) },
      });

      const entity = data?.updateCategory?.data?.entity;
      if (!entity || !data?.updateCategory?.success) {
        return err(
          new Error(
            data?.updateCategory?.message ?? 'Error al actualizar categoría'
          )
        );
      }
      return ok(categoryMapper.toDomain(entity as GQLCategory));
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const { data } = await this.client.mutate<
        DeleteCategoryMutation,
        DeleteCategoryMutationVariables
      >({
        mutation: DeleteCategoryDocument,
        variables: { id },
      });

      if (!data?.deleteCategory?.success) {
        return err(
          new Error(
            data?.deleteCategory?.message ?? 'Error al eliminar categoría'
          )
        );
      }
      return ok(true);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private toGQLFilter(filter: CategoryFilter): CategoryFilterInput {
    const gql: CategoryFilterInput = {};
    if (filter.search !== undefined) gql.search = filter.search;
    if (filter.isActive !== undefined) gql.isActive = filter.isActive;
    return gql;
  }
}
