import { 
  useGetUsersQuery, 
  useGetUserStatsQuery,
  GetUsersDocument,
  UserFilterInput,
  CreateUserProfileInput,
  UpdateUserProfileInput
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
  // Placeholder - implement when mutations are available
  const create = (input: CreateUserProfileInput) => {
    return Promise.resolve();
  };

  return { create, loading: false, error: null };
};

export const useUpdateUser = () => {
  // Placeholder - implement when mutations are available
  const update = (id: string, input: UpdateUserProfileInput) => {
    return Promise.resolve();
  };

  return { update, loading: false, error: null };
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