import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import type { UserRepository } from '@happy-baby/domain-user';
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserFilter,
  UserPage,
} from '@happy-baby/domain-user';
import type { Result } from '@happy-baby/domain-shared';
import { ok, err } from '@happy-baby/domain-shared';
import { userMapper } from '../mappers/userMapper';
import {
  GetUsersDocument,
  GetUserDocument,
  CreateUserDocument,
  UpdateUserOptimizedDocument,
  DeleteUserDocument,
  ActivateUserDocument,
  DeactivateUserDocument,
  type GetUsersQuery,
  type GetUsersQueryVariables,
  type GetUserQuery,
  type GetUserQueryVariables,
  type CreateUserMutation,
  type CreateUserMutationVariables,
  type UpdateUserOptimizedMutation,
  type UpdateUserOptimizedMutationVariables,
  type DeleteUserMutation,
  type DeleteUserMutationVariables,
  type ActivateUserMutation,
  type ActivateUserMutationVariables,
  type DeactivateUserMutation,
  type DeactivateUserMutationVariables,
} from '@/generated/graphql';

export class ApolloUserRepository implements UserRepository {
  constructor(private readonly client: ApolloClient<NormalizedCacheObject>) {}

  async findAll(
    filter?: UserFilter,
    limit = 20,
    offset = 0
  ): Promise<Result<UserPage>> {
    try {
      const variables: GetUsersQueryVariables = {
        filter: filter
          ? {
              isActive: filter.isActive ?? null,
              role: filter.role ? userMapper.toGQLRole(filter.role) : null,
            }
          : null,
        pagination: { limit, offset },
      };

      const { data } = await this.client.query<
        GetUsersQuery,
        GetUsersQueryVariables
      >({
        query: GetUsersDocument,
        variables,
        fetchPolicy: 'network-only',
      });

      const responseData = data.users?.data;
      if (!responseData) {
        return ok({ items: [], total: 0, hasMore: false });
      }

      return ok({
        items: responseData.items.map(u => userMapper.toDomain(u)),
        total: responseData.pagination.total,
        hasMore: responseData.pagination.hasMore,
      });
    } catch (e) {
      return err(new Error('Error al listar usuarios'));
    }
  }

  async findById(id: string): Promise<Result<User>> {
    try {
      const { data } = await this.client.query<
        GetUserQuery,
        GetUserQueryVariables
      >({
        query: GetUserDocument,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      if (!data.user) {
        return err(new Error('Usuario no encontrado'));
      }

      return ok(userMapper.toDomain(data.user));
    } catch (e) {
      return err(new Error('Error al obtener usuario'));
    }
  }

  async create(input: CreateUserInput): Promise<Result<User>> {
    try {
      const { data } = await this.client.mutate<
        CreateUserMutation,
        CreateUserMutationVariables
      >({
        mutation: CreateUserDocument,
        variables: { input: userMapper.toCreateDTO(input) },
      });

      const entity = data?.createUser?.data?.entity;
      if (!entity) {
        return err(new Error('Error al crear usuario: respuesta vacía'));
      }

      return ok(userMapper.toDomain(entity));
    } catch (e) {
      return err(new Error('Error al crear usuario'));
    }
  }

  async update(id: string, input: UpdateUserInput): Promise<Result<User>> {
    try {
      const { data } = await this.client.mutate<
        UpdateUserOptimizedMutation,
        UpdateUserOptimizedMutationVariables
      >({
        mutation: UpdateUserOptimizedDocument,
        variables: { id, input: userMapper.toUpdateDTO(input) },
      });

      if (!data?.updateUser) {
        return err(new Error('Error al actualizar usuario: respuesta vacía'));
      }

      // UpdateUserOptimized returns partial fields — re-fetch full entity
      return this.findById(id);
    } catch (e) {
      return err(new Error('Error al actualizar usuario'));
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const { data } = await this.client.mutate<
        DeleteUserMutation,
        DeleteUserMutationVariables
      >({
        mutation: DeleteUserDocument,
        variables: { id },
      });

      if (!data?.deleteUser?.success) {
        return err(
          new Error(data?.deleteUser?.message ?? 'Error al eliminar usuario')
        );
      }

      return ok(true);
    } catch (e) {
      return err(new Error('Error al eliminar usuario'));
    }
  }

  async activate(id: string): Promise<Result<User>> {
    try {
      const { data } = await this.client.mutate<
        ActivateUserMutation,
        ActivateUserMutationVariables
      >({
        mutation: ActivateUserDocument,
        variables: { id },
      });

      if (!data?.activateUser) {
        return err(new Error('Error al activar usuario'));
      }

      return ok(userMapper.toDomain(data.activateUser));
    } catch (e) {
      return err(new Error('Error al activar usuario'));
    }
  }

  async deactivate(id: string): Promise<Result<User>> {
    try {
      const { data } = await this.client.mutate<
        DeactivateUserMutation,
        DeactivateUserMutationVariables
      >({
        mutation: DeactivateUserDocument,
        variables: { id },
      });

      if (!data?.deactivateUser) {
        return err(new Error('Error al desactivar usuario'));
      }

      return ok(userMapper.toDomain(data.deactivateUser));
    } catch (e) {
      return err(new Error('Error al desactivar usuario'));
    }
  }
}
