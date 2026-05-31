import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import type { ProductRepository } from '@happy-baby/domain-product';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilter,
  ProductPage,
} from '@happy-baby/domain-product';
import type { Result } from '@happy-baby/domain-shared';
import { ok, err } from '@happy-baby/domain-shared';
import { productMapper } from '../mappers/productMapper';
import type {
  Product as GQLProduct,
  ProductFilterInput,
} from '../generated/graphql';
import {
  GetProductsDocument,
  GetProductDocument,
  CreateProductDocument,
  UpdateProductDocument,
  DeleteProductDocument,
  UploadImageDocument,
  type GetProductsQuery,
  type GetProductsQueryVariables,
  type GetProductQuery,
  type GetProductQueryVariables,
  type CreateProductMutation,
  type CreateProductMutationVariables,
  type UpdateProductMutation,
  type UpdateProductMutationVariables,
  type DeleteProductMutation,
  type DeleteProductMutationVariables,
  type UploadImageMutation,
  type UploadImageMutationVariables,
} from '../generated/graphql';

export class ApolloProductRepository implements ProductRepository {
  constructor(private readonly client: ApolloClient<NormalizedCacheObject>) {}

  async findAll(
    filter?: ProductFilter,
    limit = 20,
    offset = 0
  ): Promise<Result<ProductPage>> {
    try {
      const { data } = await this.client.query<
        GetProductsQuery,
        GetProductsQueryVariables
      >({
        query: GetProductsDocument,
        variables: {
          filter: filter ? this.toGQLFilter(filter) : null,
          pagination: { limit, offset },
        },
        // network-only ensures fresh data on list views; Apollo caches the individual
        // normalized entities automatically.
        fetchPolicy: 'network-only',
      });

      const responseData = data.products?.data;
      if (!responseData) {
        return ok({ items: [], total: 0, hasMore: false });
      }

      return ok({
        items: responseData.items.map(item =>
          productMapper.toDomain(item as GQLProduct)
        ),
        total: responseData.pagination.total,
        hasMore: responseData.pagination.hasMore,
      });
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async findById(id: string): Promise<Result<Product>> {
    try {
      const { data } = await this.client.query<
        GetProductQuery,
        GetProductQueryVariables
      >({
        query: GetProductDocument,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      const entity = data.product?.data?.entity;
      if (!entity) {
        return err(new Error(`Producto "${id}" no encontrado`));
      }
      return ok(productMapper.toDomain(entity as GQLProduct));
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async create(input: CreateProductInput): Promise<Result<Product>> {
    try {
      const { data } = await this.client.mutate<
        CreateProductMutation,
        CreateProductMutationVariables
      >({
        mutation: CreateProductDocument,
        variables: { input: productMapper.toCreateDTO(input) },
      });

      const entity = data?.createProduct?.data?.entity;
      if (!entity || !data?.createProduct?.success) {
        return err(
          new Error(data?.createProduct?.message ?? 'Error al crear producto')
        );
      }
      return ok(productMapper.toDomain(entity as GQLProduct));
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async update(
    id: string,
    input: UpdateProductInput
  ): Promise<Result<Product>> {
    try {
      const { data } = await this.client.mutate<
        UpdateProductMutation,
        UpdateProductMutationVariables
      >({
        mutation: UpdateProductDocument,
        variables: { id, input: productMapper.toUpdateDTO(input) },
      });

      const entity = data?.updateProduct?.data?.entity;
      if (!entity || !data?.updateProduct?.success) {
        return err(
          new Error(
            data?.updateProduct?.message ?? 'Error al actualizar producto'
          )
        );
      }
      return ok(productMapper.toDomain(entity as GQLProduct));
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const { data } = await this.client.mutate<
        DeleteProductMutation,
        DeleteProductMutationVariables
      >({
        mutation: DeleteProductDocument,
        variables: { id },
      });

      if (!data?.deleteProduct?.success) {
        return err(
          new Error(
            data?.deleteProduct?.message ?? 'Error al eliminar producto'
          )
        );
      }
      return ok(true);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private toGQLFilter(filter: ProductFilter): ProductFilterInput {
    const gql: ProductFilterInput = {};
    if (filter.search !== undefined) gql.search = filter.search;
    if (filter.categoryId !== undefined) gql.categoryId = filter.categoryId;
    if (filter.isActive !== undefined) gql.isActive = filter.isActive;
    if (filter.inStock !== undefined) gql.inStock = filter.inStock;
    if (filter.minPrice !== undefined) gql.minPrice = filter.minPrice;
    if (filter.maxPrice !== undefined) gql.maxPrice = filter.maxPrice;
    if (filter.tags !== undefined) gql.tags = filter.tags;
    return gql;
  }

  async uploadImage(file: File, productId: string): Promise<Result<string>> {
    try {
      const { data } = await this.client.mutate<
        UploadImageMutation,
        UploadImageMutationVariables
      >({
        mutation: UploadImageDocument,
        variables: { file, entityId: productId, entityType: 'product' },
      });

      const url = data?.uploadImage?.data?.url;
      if (!url || !data?.uploadImage?.success) {
        return err(
          new Error(data?.uploadImage?.message ?? 'Error al subir imagen')
        );
      }
      return ok(url);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
