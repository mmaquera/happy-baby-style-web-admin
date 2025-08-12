import { 
  useGetUsersQuery, 
  useGetUserStatsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  GetUsersDocument,
  UserFilterInput,
  CreateUserProfileInput,
  UpdateUserProfileInput,
  InputMaybe,
  UserRole,
  useUpdateUserOptimizedMutation
} from '../generated/graphql';
import toast from 'react-hot-toast';

interface UseUsersOptions {
  filter?: UserFilterInput;
  limit?: number;
  skip?: boolean;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const { filter, limit = 20, skip = false } = options;
  
  // 🔍 DEBUGGING: Log de parámetros recibidos
  console.log('🔍 DEBUG useUsers hook - Parámetros recibidos:', {
    options,
    filter,
    limit,
    skip,
    filterString: JSON.stringify(filter)
  });
  
  const { data, loading, error, fetchMore, refetch } = useGetUsersQuery({
    variables: {
      filter: filter as InputMaybe<UserFilterInput>,
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

  // 🔍 DEBUGGING: Log de respuesta de la query
  console.log('🔍 DEBUG useUsers hook - Respuesta de la query:', {
    data,
    users: data?.users?.users || [],
    total: data?.users?.total || 0,
    hasMore: data?.users?.hasMore || false,
    loading,
    error
  });

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

  const create = async (input: CreateUserProfileInput) => {
    try {
      const result = await createUserMutation({
        variables: { input }
      });
      
      const response = result.data?.createUser;
      
      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }
      
      if (!response.success) {
        // Manejar errores de validación del servidor
        const errorMessage = response.message || 'Error al crear usuario';
        const errorCode = response.code || 'UNKNOWN_ERROR';
        
        throw new Error(`${errorMessage} (${errorCode})`);
      }
      
      toast.success('Usuario creado exitosamente');
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear usuario';
      toast.error(errorMessage);
      throw error;
    }
  };

  return { create, loading, error };
};

export const useUpdateUser = () => {
  const [updateUserMutation, { loading, error }] = useUpdateUserMutation({
    refetchQueries: [GetUsersDocument],
  });

  const update = async (id: string, input: UpdateUserProfileInput) => {
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

// Optimized update user hook - only returns essential fields
export const useUpdateUserOptimized = () => {
  const [updateUserOptimized, { loading, error, data }] = useUpdateUserOptimizedMutation();

  const update = async (id: string, input: UpdateUserProfileInput) => {
    try {
      const result = await updateUserOptimized({
        variables: { id, input },
        // Optimize cache updates by only updating the specific user
        update: (cache, { data }) => {
          if (data?.updateUser) {
            if (data.updateUser.id && typeof data.updateUser.id === 'string') {
              cache.modify({
                id: cache.identify({ __typename: 'User', id: data.updateUser.id as string }),
                fields: {
                  email: () => data.updateUser.email,
                  role: () => data.updateUser.role,
                  isActive: () => data.updateUser.isActive,
                  profile: () => data.updateUser.profile,
                },
              });
            }
          }
        },
      });
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return {
    update,
    loading,
    error,
    data,
  };
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

export const useUsersByRole = (role: UserRole) => {
  return useUsers({
    filter: { role: role as InputMaybe<UserRole> }
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