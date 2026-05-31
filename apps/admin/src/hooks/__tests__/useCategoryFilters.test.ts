import { renderHook, act } from '@testing-library/react';
import { useCategoryFilters } from '@happy-baby/feature-categories';
import type { Category } from '@/generated/graphql';

const makeCategory = (overrides: Partial<Category> = {}): Category => ({
  __typename: 'Category',
  id: 'cat-1',
  name: 'Ropa bebé',
  description: 'Desc',
  slug: 'ropa-bebe',
  image: null,
  isActive: true,
  sortOrder: 0,
  products: [],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

describe('useCategoryFilters', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useCategoryFilters(0));
    expect(result.current.filters).toEqual({ search: '' });
    expect(result.current.sortConfig).toEqual({
      field: 'sortOrder',
      direction: 'asc',
    });
    expect(result.current.pagination).toEqual({ limit: 10, offset: 0 });
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPrevPage).toBe(false);
  });

  describe('pagination', () => {
    it('computes totalPages correctly', () => {
      const { result } = renderHook(() => useCategoryFilters(25));
      expect(result.current.totalPages).toBe(3);
    });

    it('goToPage updates offset', () => {
      const { result } = renderHook(() => useCategoryFilters(30));
      act(() => result.current.goToPage(3));
      expect(result.current.pagination.offset).toBe(20);
      expect(result.current.currentPage).toBe(3);
    });

    it('nextPage advances page when hasNextPage', () => {
      const { result } = renderHook(() => useCategoryFilters(30));
      act(() => result.current.nextPage());
      expect(result.current.currentPage).toBe(2);
    });

    it('nextPage does nothing on last page', () => {
      const { result } = renderHook(() => useCategoryFilters(10));
      act(() => result.current.nextPage());
      expect(result.current.currentPage).toBe(1);
    });

    it('prevPage goes back when hasPrevPage', () => {
      const { result } = renderHook(() => useCategoryFilters(30));
      act(() => result.current.goToPage(2));
      act(() => result.current.prevPage());
      expect(result.current.currentPage).toBe(1);
    });

    it('prevPage does nothing on first page', () => {
      const { result } = renderHook(() => useCategoryFilters(30));
      act(() => result.current.prevPage());
      expect(result.current.currentPage).toBe(1);
    });

    it('setPaginationFromGraphQL converts to local format', () => {
      const { result } = renderHook(() => useCategoryFilters(0));
      act(() =>
        result.current.setPaginationFromGraphQL({ limit: 20, offset: 40 })
      );
      expect(result.current.pagination).toEqual({ limit: 20, offset: 40 });
    });
  });

  describe('filters', () => {
    it('updateFilter sets filter and resets offset', () => {
      const { result } = renderHook(() => useCategoryFilters(30));
      act(() => result.current.goToPage(2));
      act(() => result.current.updateFilter('search', 'ropa'));
      expect(result.current.filters.search).toBe('ropa');
      expect(result.current.pagination.offset).toBe(0);
    });

    it('clearFilters resets all filters and offset', () => {
      const { result } = renderHook(() => useCategoryFilters(30));
      act(() => {
        result.current.updateFilter('search', 'test');
        result.current.goToPage(2);
      });
      act(() => result.current.clearFilters());
      expect(result.current.filters).toEqual({ search: '' });
      expect(result.current.pagination.offset).toBe(0);
    });
  });

  describe('sorting', () => {
    it('handleSort toggles direction on same field', () => {
      const { result } = renderHook(() => useCategoryFilters(0));
      act(() => result.current.handleSort('name'));
      expect(result.current.sortConfig).toEqual({
        field: 'name',
        direction: 'asc',
      });
      act(() => result.current.handleSort('name'));
      expect(result.current.sortConfig).toEqual({
        field: 'name',
        direction: 'desc',
      });
    });

    it('handleSort resets to asc for new field', () => {
      const { result } = renderHook(() => useCategoryFilters(0));
      act(() => result.current.handleSort('name'));
      act(() => result.current.handleSort('name'));
      act(() => result.current.handleSort('sortOrder'));
      expect(result.current.sortConfig).toEqual({
        field: 'sortOrder',
        direction: 'asc',
      });
    });
  });

  describe('resetToDefaults', () => {
    it('resets all state to defaults', () => {
      const { result } = renderHook(() => useCategoryFilters(30));
      act(() => {
        result.current.updateFilter('search', 'ropa');
        result.current.handleSort('name');
        result.current.goToPage(2);
      });
      act(() => result.current.resetToDefaults());
      expect(result.current.filters).toEqual({ search: '' });
      expect(result.current.sortConfig).toEqual({
        field: 'sortOrder',
        direction: 'asc',
      });
      expect(result.current.pagination).toEqual({ limit: 10, offset: 0 });
    });
  });

  describe('getFilteredAndSortedCategories', () => {
    it('filters by search', () => {
      const cats = [
        makeCategory({ id: '1', name: 'Ropa bebé', slug: 'ropa' }),
        makeCategory({ id: '2', name: 'Zapatos', slug: 'zapatos' }),
      ];
      const { result } = renderHook(() => useCategoryFilters(2));
      act(() => result.current.updateFilter('search', 'ropa'));
      const filtered = result.current.getFilteredAndSortedCategories(cats);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]!.id).toBe('1');
    });

    it('filters by isActive', () => {
      const cats = [
        makeCategory({ id: '1', isActive: true }),
        makeCategory({ id: '2', isActive: false }),
      ];
      const { result } = renderHook(() => useCategoryFilters(2));
      act(() => result.current.updateFilter('isActive', false));
      const filtered = result.current.getFilteredAndSortedCategories(cats);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]!.id).toBe('2');
    });

    it('sorts by name ascending', () => {
      const cats = [
        makeCategory({ id: '1', name: 'Zapatos', sortOrder: 2 }),
        makeCategory({ id: '2', name: 'Accesorios', sortOrder: 1 }),
      ];
      const { result } = renderHook(() => useCategoryFilters(2));
      act(() => result.current.handleSort('name'));
      const sorted = result.current.getFilteredAndSortedCategories(cats);
      expect(sorted[0]!.name).toBe('Accesorios');
      expect(sorted[1]!.name).toBe('Zapatos');
    });

    it('sorts descending after double handleSort', () => {
      const cats = [
        makeCategory({ id: '1', name: 'Accesorios', sortOrder: 1 }),
        makeCategory({ id: '2', name: 'Zapatos', sortOrder: 2 }),
      ];
      const { result } = renderHook(() => useCategoryFilters(2));
      act(() => result.current.handleSort('name'));
      act(() => result.current.handleSort('name'));
      const sorted = result.current.getFilteredAndSortedCategories(cats);
      expect(sorted[0]!.name).toBe('Zapatos');
    });
  });

  describe('mapFiltersToGraphQL', () => {
    it('omits undefined fields', () => {
      const { result } = renderHook(() => useCategoryFilters(0));
      const mapped = result.current.mapFiltersToGraphQL({ search: '' });
      expect(mapped).toEqual({});
    });

    it('includes search when set', () => {
      const { result } = renderHook(() => useCategoryFilters(0));
      const mapped = result.current.mapFiltersToGraphQL({
        search: 'ropa',
        isActive: true,
      });
      expect(mapped.search).toBe('ropa');
      expect(mapped.isActive).toBe(true);
    });
  });
});
