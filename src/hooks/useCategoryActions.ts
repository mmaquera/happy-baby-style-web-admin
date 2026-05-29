import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useCategoryUseCases } from '@/app/di/categories';
import type {
  Category,
  CategoryFilter,
  UpdateCategoryInput,
} from '@/core/domain/category/Category';
import { isErr } from '@/core/shared/Result';

export const useCategoryActions = () => {
  const useCases = useCategoryUseCases();
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const loadCategories = useCallback(
    async (filter?: CategoryFilter, limit = 50, offset = 0) => {
      setLoading(true);
      setError(null);
      try {
        const result = await useCases.list.execute({
          ...(filter ? { filter } : {}),
          limit,
          offset,
        });
        if (isErr(result)) {
          setError(result.error.message ?? 'Error al cargar categorías');
          return;
        }
        setCategories(result.value.items);
        setTotal(result.value.total);
        setHasMore(result.value.hasMore);
      } finally {
        setLoading(false);
      }
    },
    [useCases.list]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await useCases.delete.execute(id);
        if (isErr(result)) {
          toast.error(result.error.message ?? 'Error al eliminar categoría');
          return false;
        }
        setCategories(prev => prev.filter(c => c.id !== id));
        setTotal(prev => prev - 1);
        toast.success('Categoría eliminada exitosamente');
        return true;
      } finally {
        setLoading(false);
      }
    },
    [useCases.delete]
  );

  const updateCategory = useCallback(
    async (id: string, input: UpdateCategoryInput): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await useCases.update.execute(id, input);
        if (isErr(result)) {
          toast.error(result.error.message ?? 'Error al actualizar categoría');
          return false;
        }
        setCategories(prev =>
          prev.map(c => (c.id === id ? result.value : c))
        );
        toast.success('Categoría actualizada exitosamente');
        return true;
      } finally {
        setLoading(false);
      }
    },
    [useCases.update]
  );

  return {
    categories,
    total,
    hasMore,
    loading,
    error,
    clearError,
    loadCategories,
    deleteCategory,
    updateCategory,
  };
};

export default useCategoryActions;
