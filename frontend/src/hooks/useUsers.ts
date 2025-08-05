import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { User, UserRole, UserStats, CreateUserRequest, UpdateUserRequest } from '@/types';

// Types
export interface GetUsersFilters {
  limit?: number;
  offset?: number;
  role?: UserRole;
  isActive?: boolean;
  search?: string;
}

// API functions
const usersApi = {
  getUsers: async (filters: GetUsersFilters = {}): Promise<User[]> => {
    const params = new URLSearchParams();
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());
    if (filters.role) params.append('role', filters.role);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/users?${params.toString()}`);
    return response.data.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data.data;
  },

  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  },

  getUserStats: async (): Promise<UserStats> => {
    const response = await api.get('/users/stats');
    return response.data.data;
  }
};

// Hooks
export const useUsers = (filters: GetUsersFilters = {}) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: usersApi.getUserStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersApi.updateUser(id, data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', updatedUser.id] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
  });
}; 