import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useUserUseCases } from '@/app/di/users';
import type {
  User,
  UserFilter,
  CreateUserInput,
  UpdateUserInput,
} from '@happy-baby/domain-user';
import { isErr } from '@happy-baby/domain-shared';

export const useUserActions = () => {
  const useCases = useUserUseCases();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const loadUsers = useCallback(
    async (filter?: UserFilter, limit = 20, offset = 0) => {
      setLoading(true);
      setError(null);
      try {
        const result = await useCases.list.execute(filter, limit, offset);
        if (isErr(result)) {
          setError(result.error.message ?? 'Error al cargar usuarios');
          return;
        }
        setUsers(result.value.items);
        setTotal(result.value.total);
        setHasMore(result.value.hasMore);
      } finally {
        setLoading(false);
      }
    },
    [useCases.list]
  );

  const createUser = useCallback(
    async (input: CreateUserInput): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await useCases.create.execute(input);
        if (isErr(result)) {
          toast.error(result.error.message ?? 'Error al crear usuario');
          return false;
        }
        setUsers(prev => [result.value, ...prev]);
        setTotal(prev => prev + 1);
        toast.success('Usuario creado exitosamente');
        return true;
      } finally {
        setLoading(false);
      }
    },
    [useCases.create]
  );

  const updateUser = useCallback(
    async (id: string, input: UpdateUserInput): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await useCases.update.execute(id, input);
        if (isErr(result)) {
          toast.error(result.error.message ?? 'Error al actualizar usuario');
          return false;
        }
        setUsers(prev => prev.map(u => (u.id === id ? result.value : u)));
        toast.success('Usuario actualizado exitosamente');
        return true;
      } finally {
        setLoading(false);
      }
    },
    [useCases.update]
  );

  const deleteUser = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await useCases.delete.execute(id);
        if (isErr(result)) {
          toast.error(result.error.message ?? 'Error al eliminar usuario');
          return false;
        }
        setUsers(prev => prev.filter(u => u.id !== id));
        setTotal(prev => prev - 1);
        toast.success('Usuario eliminado exitosamente');
        return true;
      } finally {
        setLoading(false);
      }
    },
    [useCases.delete]
  );

  const activateUser = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await useCases.activate.execute(id);
        if (isErr(result)) {
          toast.error(result.error.message ?? 'Error al activar usuario');
          return false;
        }
        setUsers(prev => prev.map(u => (u.id === id ? result.value : u)));
        toast.success('Usuario activado exitosamente');
        return true;
      } finally {
        setLoading(false);
      }
    },
    [useCases.activate]
  );

  const deactivateUser = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await useCases.deactivate.execute(id);
        if (isErr(result)) {
          toast.error(result.error.message ?? 'Error al desactivar usuario');
          return false;
        }
        setUsers(prev => prev.map(u => (u.id === id ? result.value : u)));
        toast.success('Usuario desactivado exitosamente');
        return true;
      } finally {
        setLoading(false);
      }
    },
    [useCases.deactivate]
  );

  return {
    users,
    total,
    hasMore,
    loading,
    error,
    clearError,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
  };
};

export default useUserActions;
