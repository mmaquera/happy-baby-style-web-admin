import { renderHook, act } from '@testing-library/react';
import { useCategoryActions } from '../useCategoryActions';
import { ok, err } from '@/core/shared/Result';
import { DomainError } from '@/core/shared/Result';
import type { Category } from '@/core/domain/category/Category';

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
  success: vi.fn(),
  error: vi.fn(),
}));

const mockListExecute = vi.fn();
const mockDeleteExecute = vi.fn();
const mockUpdateExecute = vi.fn();
const mockCreateExecute = vi.fn();

vi.mock('@/app/di/categories', () => ({
  useCategoryUseCases: () => ({
    list: { execute: mockListExecute },
    delete: { execute: mockDeleteExecute },
    update: { execute: mockUpdateExecute },
    create: { execute: mockCreateExecute },
  }),
}));

import { toast } from 'react-hot-toast';

const makeCategory = (id = 'cat-1'): Category => ({
  id,
  name: 'Ropa bebé',
  description: null,
  slug: 'ropa-bebe',
  image: null,
  isActive: true,
  sortOrder: 0,
  productCount: 0,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
});

describe('useCategoryActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListExecute.mockResolvedValue(
      ok({ items: [], total: 0, hasMore: false })
    );
    mockDeleteExecute.mockResolvedValue(ok(true));
    mockUpdateExecute.mockResolvedValue(ok(makeCategory()));
    mockCreateExecute.mockResolvedValue(ok(makeCategory()));
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useCategoryActions());
    expect(result.current.categories).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe('loadCategories', () => {
    it('loads categories and updates state', async () => {
      const cat = makeCategory();
      mockListExecute.mockResolvedValueOnce(
        ok({ items: [cat], total: 1, hasMore: false })
      );

      const { result } = renderHook(() => useCategoryActions());

      await act(async () => {
        await result.current.loadCategories();
      });

      expect(result.current.categories).toEqual([cat]);
      expect(result.current.total).toBe(1);
      expect(result.current.loading).toBe(false);
    });

    it('calls list.execute with default limit=50, offset=0', async () => {
      const { result } = renderHook(() => useCategoryActions());

      await act(async () => {
        await result.current.loadCategories();
      });

      expect(mockListExecute).toHaveBeenCalledWith({ limit: 50, offset: 0 });
    });

    it('passes filter when provided', async () => {
      const { result } = renderHook(() => useCategoryActions());

      await act(async () => {
        await result.current.loadCategories({ isActive: true }, 10, 5);
      });

      expect(mockListExecute).toHaveBeenCalledWith({
        filter: { isActive: true },
        limit: 10,
        offset: 5,
      });
    });

    it('sets error when list use case fails', async () => {
      mockListExecute.mockResolvedValueOnce(
        err(new DomainError('Error al cargar', 'LOAD_FAILED'))
      );

      const { result } = renderHook(() => useCategoryActions());

      await act(async () => {
        await result.current.loadCategories();
      });

      expect(result.current.error).toBe('Error al cargar');
      expect(result.current.loading).toBe(false);
    });

    it('resets loading to false even on success', async () => {
      const { result } = renderHook(() => useCategoryActions());

      await act(async () => {
        await result.current.loadCategories();
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe('clearError', () => {
    it('clears the error state', async () => {
      mockListExecute.mockResolvedValueOnce(
        err(new DomainError('fail', 'ERR'))
      );
      const { result } = renderHook(() => useCategoryActions());

      await act(async () => {
        await result.current.loadCategories();
      });

      act(() => result.current.clearError());

      expect(result.current.error).toBeNull();
    });
  });

  describe('deleteCategory', () => {
    it('removes category from list on success', async () => {
      const cat1 = makeCategory('cat-1');
      const cat2 = makeCategory('cat-2');
      mockListExecute.mockResolvedValueOnce(
        ok({ items: [cat1, cat2], total: 2, hasMore: false })
      );

      const { result } = renderHook(() => useCategoryActions());

      await act(async () => {
        await result.current.loadCategories();
      });

      await act(async () => {
        await result.current.deleteCategory('cat-1');
      });

      expect(result.current.categories).toEqual([cat2]);
      expect(result.current.total).toBe(1);
    });

    it('shows success toast on delete', async () => {
      const { result } = renderHook(() => useCategoryActions());

      await act(async () => {
        const success = await result.current.deleteCategory('cat-1');
        expect(success).toBe(true);
      });

      expect(toast.success).toHaveBeenCalledWith('Categoría eliminada exitosamente');
    });

    it('shows error toast when delete fails', async () => {
      mockDeleteExecute.mockResolvedValueOnce(
        err(new DomainError('No se puede eliminar', 'DELETE_FAILED'))
      );
      const { result } = renderHook(() => useCategoryActions());

      await act(async () => {
        const success = await result.current.deleteCategory('cat-1');
        expect(success).toBe(false);
      });

      expect(toast.error).toHaveBeenCalledWith('No se puede eliminar');
    });
  });

  describe('updateCategory', () => {
    it('updates category in list on success', async () => {
      const cat = makeCategory('cat-1');
      mockListExecute.mockResolvedValueOnce(
        ok({ items: [cat], total: 1, hasMore: false })
      );
      const updated = { ...cat, name: 'Ropa actualizada' };
      mockUpdateExecute.mockResolvedValueOnce(ok(updated));

      const { result } = renderHook(() => useCategoryActions());

      await act(async () => {
        await result.current.loadCategories();
      });

      await act(async () => {
        await result.current.updateCategory('cat-1', { name: 'Ropa actualizada' });
      });

      expect(result.current.categories[0].name).toBe('Ropa actualizada');
    });

    it('shows success toast on update', async () => {
      const { result } = renderHook(() => useCategoryActions());

      await act(async () => {
        const success = await result.current.updateCategory('cat-1', { name: 'x' });
        expect(success).toBe(true);
      });

      expect(toast.success).toHaveBeenCalledWith('Categoría actualizada exitosamente');
    });

    it('shows error toast when update fails', async () => {
      mockUpdateExecute.mockResolvedValueOnce(
        err(new DomainError('Error al actualizar', 'UPDATE_FAILED'))
      );
      const { result } = renderHook(() => useCategoryActions());

      await act(async () => {
        const success = await result.current.updateCategory('cat-1', { name: 'x' });
        expect(success).toBe(false);
      });

      expect(toast.error).toHaveBeenCalledWith('Error al actualizar');
    });
  });
});
