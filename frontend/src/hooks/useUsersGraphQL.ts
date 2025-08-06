import { 
  useGetUsersQuery, 
  useGetUserStatsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  GetUsersDocument,
  UserFilterInput,
  CreateUserInput,
  UpdateUserInput
} from '../generated/graphql';
import toast from 'react-hot-toast';

interface UseUsersOptions {
  filter?: UserFilterInput;
  limit?: number;
  skip?: boolean;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const { filter, limit = 20, skip = false } = options;
  
  const { data, loading, error, fetchMore, refetch } = useGetUsersQuery({
    variables: {
      filter,
      pagination: { limit, offset: 0 }
    },
    skip,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all'
  });

  const loadMore = () => {
    if (!data?.users.hasMore) return;
    
    return fetchMore({
      variables: {
        pagination: {
          limit,
          offset: data.users.users.length
        }
      }
    });
  };

  return {
    users: data?.users.users || [],
    total: data?.users.total || 0,
    hasMore: data?.users.hasMore || false,
    loading,
    error,
    loadMore,
    refetch
  };
};

export const useCreateUser = () => {
  const [createUserMutation, { loading, error }] = useCreateUserMutation({
    refetchQueries: [GetUsersDocument],
  });

  const create = async (input: CreateUserInput) => {
    try {
      const result = await createUserMutation({
        variables: { input }
      });
      toast.success('Usuario creado exitosamente');
      return result.data?.createUser;
    } catch (error) {
      toast.error('Error al crear usuario');
      throw error;
    }
  };

  return { create, loading, error };
};

export const useUpdateUser = () => {
  const [updateUserMutation, { loading, error }] = useUpdateUserMutation({
    refetchQueries: [GetUsersDocument],
  });

  const update = async (id: string, input: UpdateUserInput) => {
    try {
      const result = await updateUserMutation({
        variables: { id, input }
      });
      toast.success('Usuario actualizado exitosamente');
      return result.data?.updateUser;
    } catch (error) {
      toast.error('Error al actualizar usuario');
      throw error;
    }
  };

  return { update, loading, error };
};

export const useUserStats = () => {
  const { data, loading, error, refetch } = useGetUserStatsQuery({
    errorPolicy: 'all'
  });

  return {
    stats: data?.userStats,
    loading,
    error,
    refetch
  };
};

export const useUsersByRole = (role: string) => {
  return useUsers({
    filter: { role }
  });
};

export const useActiveUsers = () => {
  return useUsers({
    filter: { isActive: true }
  });
};

export const useRecentUsers = () => {
  return useUsers({
    limit: 10
  });
}; 