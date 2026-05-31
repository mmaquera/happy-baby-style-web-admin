import { renderHook, act } from '@testing-library/react';
import { useCreateCategory } from '@happy-baby/feature-categories';
import { useUpdateCategory } from '@happy-baby/feature-categories';

vi.mock('react-hot-toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  success: vi.fn(),
  error: vi.fn(),
}));

const mockCreateMutate = vi.fn();
const mockUpdateMutate = vi.fn();
const mockUploadSvgMutate = vi.fn();

vi.mock('@happy-baby/infrastructure-graphql', () => ({
  useCreateCategoryMutation: () => [
    mockCreateMutate,
    { loading: false, error: null },
  ],
  useUpdateCategoryMutation: () => [
    mockUpdateMutate,
    { loading: false, error: null },
  ],
  useUploadSvgMutation: () => [mockUploadSvgMutate, { loading: false }],
}));

import { toast } from 'react-hot-toast';

const validInput = { name: 'Ropa bebé', slug: 'ropa-bebe', isActive: true };

describe('useCreateCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateMutate.mockResolvedValue({
      data: {
        createCategory: {
          success: true,
          message: 'Creado',
          code: 'OK',
          data: { entity: { id: 'cat-1' } },
        },
      },
    });
  });

  it('initializes with correct defaults', () => {
    const { result } = renderHook(() => useCreateCategory());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe('validateCategoryInput', () => {
    it('accepts valid input', () => {
      const { result } = renderHook(() => useCreateCategory());
      const errors = result.current.validateCategoryInput(validInput);
      expect(errors).toHaveLength(0);
    });

    it('rejects empty name', () => {
      const { result } = renderHook(() => useCreateCategory());
      const errors = result.current.validateCategoryInput({
        ...validInput,
        name: '',
      });
      expect(errors.some(e => e.includes('nombre'))).toBe(true);
    });

    it('rejects invalid slug (uppercase)', () => {
      const { result } = renderHook(() => useCreateCategory());
      const errors = result.current.validateCategoryInput({
        ...validInput,
        slug: 'Ropa-Bebe',
      });
      expect(errors.some(e => e.includes('slug'))).toBe(true);
    });

    it('rejects negative sortOrder', () => {
      const { result } = renderHook(() => useCreateCategory());
      const errors = result.current.validateCategoryInput({
        ...validInput,
        sortOrder: -1,
      });
      expect(errors.some(e => e.includes('negativo'))).toBe(true);
    });
  });

  describe('create', () => {
    it('calls mutation and shows success toast on valid input', async () => {
      const { result } = renderHook(() => useCreateCategory());

      await act(async () => {
        await result.current.create(validInput);
      });

      expect(mockCreateMutate).toHaveBeenCalledWith({
        variables: { input: validInput },
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Categoría creada exitosamente'
      );
    });

    it('returns false and shows error toast on validation failure', async () => {
      const { result } = renderHook(() => useCreateCategory());

      let ret: unknown;
      await act(async () => {
        ret = await result.current.create({ name: '', slug: '' });
      });

      expect(ret).toBe(false);
      expect(toast.error).toHaveBeenCalled();
      expect(mockCreateMutate).not.toHaveBeenCalled();
    });

    it('returns false when server responds success=false', async () => {
      mockCreateMutate.mockResolvedValueOnce({
        data: {
          createCategory: {
            success: false,
            message: 'Slug duplicado',
            code: 'DUPLICATE',
          },
        },
      });
      const { result } = renderHook(() => useCreateCategory());

      let ret: unknown;
      await act(async () => {
        ret = await result.current.create(validInput);
      });

      expect(ret).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Slug duplicado');
    });

    it('handles mutation throw', async () => {
      mockCreateMutate.mockRejectedValueOnce(new Error('Network error'));
      const { result } = renderHook(() => useCreateCategory());

      let ret: unknown;
      await act(async () => {
        ret = await result.current.create(validInput);
      });

      expect(ret).toBe(false);
      expect(result.current.error).toContain('Network error');
    });
  });

  it('clearError resets error', async () => {
    mockCreateMutate.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useCreateCategory());
    await act(async () => {
      await result.current.create(validInput);
    });
    expect(result.current.error).not.toBeNull();

    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });
});

describe('useUpdateCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateMutate.mockResolvedValue({
      data: {
        updateCategory: {
          success: true,
          message: 'Actualizado',
          code: 'OK',
          data: { entity: { id: 'cat-1' } },
        },
      },
    });
  });

  it('initializes with correct defaults', () => {
    const { result } = renderHook(() => useUpdateCategory());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe('validateCategoryInput', () => {
    it('rejects empty slug', () => {
      const { result } = renderHook(() => useUpdateCategory());
      const errors = result.current.validateCategoryInput({
        name: 'Ropa',
        slug: '',
      });
      expect(errors.some(e => e.includes('slug'))).toBe(true);
    });

    it('accepts valid slug', () => {
      const { result } = renderHook(() => useUpdateCategory());
      const errors = result.current.validateCategoryInput(validInput);
      expect(errors).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('calls mutation and shows success toast', async () => {
      const { result } = renderHook(() => useUpdateCategory());
      await act(async () => {
        await result.current.update('cat-1', validInput);
      });

      expect(mockUpdateMutate).toHaveBeenCalledWith({
        variables: { id: 'cat-1', input: validInput },
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Categoría actualizada exitosamente'
      );
    });

    it('returns false on validation failure', async () => {
      const { result } = renderHook(() => useUpdateCategory());
      let ret: unknown;
      await act(async () => {
        ret = await result.current.update('cat-1', { name: '', slug: '' });
      });
      expect(ret).toBe(false);
    });

    it('returns false when server responds success=false', async () => {
      mockUpdateMutate.mockResolvedValueOnce({
        data: {
          updateCategory: { success: false, message: 'Error', code: 'ERR' },
        },
      });
      const { result } = renderHook(() => useUpdateCategory());
      let ret: unknown;
      await act(async () => {
        ret = await result.current.update('cat-1', validInput);
      });
      expect(ret).toBe(false);
    });
  });
});
