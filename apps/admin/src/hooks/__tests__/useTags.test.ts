import { renderHook, act } from '@testing-library/react';
import { useTags } from '@happy-baby/feature-products';

describe('useTags', () => {
  it('initializes with default tags and empty custom tags', () => {
    const { result } = renderHook(() => useTags());
    expect(Object.keys(result.current.allTags).length).toBeGreaterThan(0);
    expect(result.current.customTags).toEqual({});
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('activeTags contains all default tags (all isActive=true)', () => {
    const { result } = renderHook(() => useTags());
    const activeCount = Object.values(result.current.allTags).filter(
      t => t.isActive
    ).length;
    expect(Object.keys(result.current.activeTags).length).toBe(activeCount);
  });

  describe('getTagsByCategory', () => {
    it('returns tags filtered by category', () => {
      const { result } = renderHook(() => useTags());
      const ageTags = result.current.getTagsByCategory('edad');
      expect(Object.keys(ageTags).length).toBeGreaterThan(0);
      Object.values(ageTags).forEach(tag => {
        expect(tag.category).toBe('edad');
      });
    });

    it('returns empty object for unknown category', () => {
      const { result } = renderHook(() => useTags());
      const none = result.current.getTagsByCategory('unknown');
      expect(none).toEqual({});
    });
  });

  describe('getPopularTags', () => {
    it('returns at most N tags', () => {
      const { result } = renderHook(() => useTags());
      const popular = result.current.getPopularTags(3);
      expect(Object.keys(popular).length).toBeLessThanOrEqual(3);
    });

    it('defaults to 5 tags', () => {
      const { result } = renderHook(() => useTags());
      const popular = result.current.getPopularTags();
      expect(Object.keys(popular).length).toBeLessThanOrEqual(5);
    });
  });

  describe('createTag', () => {
    it('creates a new custom tag successfully', async () => {
      const { result } = renderHook(() => useTags());

      let response:
        | Awaited<ReturnType<typeof result.current.createTag>>
        | undefined;
      await act(async () => {
        response = await result.current.createTag('nuevo-tag', {
          color: '#fff',
          description: 'Test tag',
          category: 'test',
          isActive: true,
        });
      });

      expect(response?.success).toBe(true);
      expect(result.current.customTags['nuevo-tag']).toBeDefined();
    });

    it('fails when tag name is empty', async () => {
      const { result } = renderHook(() => useTags());

      let response:
        | Awaited<ReturnType<typeof result.current.createTag>>
        | undefined;
      await act(async () => {
        response = await result.current.createTag('', {
          color: '#fff',
          description: 'x',
          category: 'test',
          isActive: true,
        });
      });

      expect(response?.success).toBe(false);
      expect(result.current.error).toContain('requerido');
    });

    it('fails when tag already exists', async () => {
      const { result } = renderHook(() => useTags());
      const existingTag = Object.keys(result.current.allTags)[0]!;

      let response:
        | Awaited<ReturnType<typeof result.current.createTag>>
        | undefined;
      await act(async () => {
        response = await result.current.createTag(existingTag, {
          color: '#fff',
          description: 'x',
          category: 'test',
          isActive: true,
        });
      });

      expect(response?.success).toBe(false);
      expect(result.current.error).toContain('existe');
    });
  });

  describe('updateTag', () => {
    it('updates an existing tag', async () => {
      const { result } = renderHook(() => useTags());
      const tagName = Object.keys(result.current.allTags)[0]!;

      await act(async () => {
        await result.current.updateTag(tagName, { color: '#123456' });
      });

      expect(result.current.allTags[tagName]!.color).toBe('#123456');
    });

    it('fails when tag does not exist', async () => {
      const { result } = renderHook(() => useTags());

      let response:
        | Awaited<ReturnType<typeof result.current.updateTag>>
        | undefined;
      await act(async () => {
        response = await result.current.updateTag('non-existent-tag', {
          color: '#fff',
        });
      });

      expect(response?.success).toBe(false);
      expect(result.current.error).toContain('no existe');
    });
  });

  describe('deleteTag', () => {
    it('deletes a custom tag', async () => {
      const { result } = renderHook(() => useTags());

      await act(async () => {
        await result.current.createTag('mi-tag', {
          color: '#fff',
          description: 'x',
          category: 'test',
          isActive: true,
        });
      });
      expect(result.current.customTags['mi-tag']).toBeDefined();

      let response:
        | Awaited<ReturnType<typeof result.current.deleteTag>>
        | undefined;
      await act(async () => {
        response = await result.current.deleteTag('mi-tag');
      });

      expect(response?.success).toBe(true);
      expect(result.current.customTags['mi-tag']).toBeUndefined();
    });

    it('fails when trying to delete a default tag', async () => {
      const { result } = renderHook(() => useTags());
      const defaultTag = Object.keys(result.current.allTags)[0]!;

      let response:
        | Awaited<ReturnType<typeof result.current.deleteTag>>
        | undefined;
      await act(async () => {
        response = await result.current.deleteTag(defaultTag);
      });

      expect(response?.success).toBe(false);
      expect(result.current.error).toContain('personalizadas');
    });
  });

  describe('incrementUsage', () => {
    it('increments usage count of an existing tag', () => {
      const { result } = renderHook(() => useTags());
      const tagName = Object.keys(result.current.allTags)[0]!;
      const initialCount = result.current.allTags[tagName]!.usageCount;

      act(() => result.current.incrementUsage(tagName));

      expect(result.current.allTags[tagName]!.usageCount).toBe(
        initialCount + 1
      );
    });

    it('does nothing for non-existent tag', () => {
      const { result } = renderHook(() => useTags());
      act(() => result.current.incrementUsage('ghost-tag'));
      // No error thrown — silently ignored
      expect(result.current.error).toBeNull();
    });
  });

  describe('searchTags', () => {
    it('finds tags by name', () => {
      const { result } = renderHook(() => useTags());
      const found = result.current.searchTags('orgánico');
      expect(Object.keys(found)).toContain('orgánico');
    });

    it('returns empty object when no match', () => {
      const { result } = renderHook(() => useTags());
      const found = result.current.searchTags('xyz-nonexistent-xyz');
      expect(found).toEqual({});
    });
  });

  describe('getTagSuggestions', () => {
    it('returns age tags for edad context', () => {
      const { result } = renderHook(() => useTags());
      const suggestions = result.current.getTagSuggestions('edad', 5);
      const categories = Object.values(suggestions).map(t => t.category);
      expect(categories.every(c => c === 'edad')).toBe(true);
    });

    it('returns quality tags for premium context', () => {
      const { result } = renderHook(() => useTags());
      const suggestions = result.current.getTagSuggestions('premium', 5);
      const categories = Object.values(suggestions).map(t => t.category);
      expect(categories.every(c => c === 'calidad')).toBe(true);
    });

    it('respects limit parameter', () => {
      const { result } = renderHook(() => useTags());
      const suggestions = result.current.getTagSuggestions('edad', 2);
      expect(Object.keys(suggestions).length).toBeLessThanOrEqual(2);
    });
  });

  it('clearError resets error state', async () => {
    const { result } = renderHook(() => useTags());
    await act(async () => {
      await result.current.createTag('', {
        color: '#fff',
        description: 'x',
        category: 'test',
        isActive: true,
      });
    });
    expect(result.current.error).not.toBeNull();

    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });
});
