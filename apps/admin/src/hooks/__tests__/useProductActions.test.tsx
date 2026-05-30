import { renderHook, act } from '@testing-library/react';
import { useProductActions } from '../useProductActions';
import {
  ok,
  err,
  DomainError,
  ValidationError,
} from '@happy-baby/domain-shared';
import type { Product as DomainProduct } from '@happy-baby/domain-product';

vi.mock('react-hot-toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  success: vi.fn(),
  error: vi.fn(),
}));

const mockCreateExecute = vi.fn();
const mockUpdateExecute = vi.fn();
const mockDeleteExecute = vi.fn();
const mockUploadImageExecute = vi.fn();

vi.mock('@/app/di/products', () => ({
  useProductUseCases: () => ({
    create: { execute: mockCreateExecute },
    update: { execute: mockUpdateExecute },
    delete: { execute: mockDeleteExecute },
    uploadImage: { execute: mockUploadImageExecute },
    list: { execute: vi.fn() },
    get: { execute: vi.fn() },
  }),
}));

import { toast } from 'react-hot-toast';

const makeDomainProduct = (
  overrides: Partial<DomainProduct> = {}
): DomainProduct => ({
  id: 'prod-1',
  name: 'Body bebé',
  description: null,
  sku: 'SKU-001',
  price: 100,
  salePrice: null,
  images: [],
  tags: [],
  attributes: {},
  isActive: true,
  stockQuantity: 10,
  categoryId: null,
  rating: null,
  reviewCount: 0,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

describe('useProductActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateExecute.mockResolvedValue(ok(makeDomainProduct()));
    mockUpdateExecute.mockResolvedValue(ok(makeDomainProduct()));
    mockDeleteExecute.mockResolvedValue(ok(true));
    mockUploadImageExecute.mockResolvedValue(
      ok('https://cdn.example.com/img.jpg')
    );
  });

  it('initializes with correct defaults', () => {
    const { result } = renderHook(() => useProductActions());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('clearError resets error state', async () => {
    mockCreateExecute.mockResolvedValueOnce(
      err(new DomainError('fallo', 'ERR'))
    );
    const { result } = renderHook(() => useProductActions());

    await act(async () => {
      await result.current.createProduct({
        name: 'x',
        sku: 'y',
        price: 10,
      } as Parameters<typeof result.current.createProduct>[0]);
    });
    expect(result.current.error).toBe('fallo');

    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });

  describe('createProduct', () => {
    it('returns presentation product on success', async () => {
      mockCreateExecute.mockResolvedValueOnce(
        ok(makeDomainProduct({ name: 'Pelele' }))
      );
      const { result } = renderHook(() => useProductActions());

      let product: ReturnType<
        typeof result.current.createProduct
      > extends Promise<infer T>
        ? T
        : never;
      await act(async () => {
        product = await result.current.createProduct({
          name: 'Pelele',
          sku: 'SKU-001',
          price: 50,
        } as Parameters<typeof result.current.createProduct>[0]);
      });

      expect(product!).not.toBeNull();
      expect(product!?.name).toBe('Pelele');
    });

    it('shows success toast', async () => {
      const { result } = renderHook(() => useProductActions());
      await act(async () => {
        await result.current.createProduct({
          name: 'x',
          sku: 'y',
          price: 10,
        } as Parameters<typeof result.current.createProduct>[0]);
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Producto creado exitosamente'
      );
    });

    it('returns null and shows error toast on failure', async () => {
      mockCreateExecute.mockResolvedValueOnce(
        err(new DomainError('SKU duplicado', 'DUPLICATE'))
      );
      const { result } = renderHook(() => useProductActions());

      let product: unknown;
      await act(async () => {
        product = await result.current.createProduct({
          name: 'x',
          sku: 'dup',
          price: 10,
        } as Parameters<typeof result.current.createProduct>[0]);
      });

      expect(product).toBeNull();
      expect(toast.error).toHaveBeenCalledWith('SKU duplicado');
      expect(result.current.error).toBe('SKU duplicado');
    });

    it('uses ValidationError message', async () => {
      mockCreateExecute.mockResolvedValueOnce(
        err(new ValidationError('Campo requerido'))
      );
      const { result } = renderHook(() => useProductActions());

      await act(async () => {
        await result.current.createProduct({
          name: '',
          sku: '',
          price: 0,
        } as Parameters<typeof result.current.createProduct>[0]);
      });

      expect(toast.error).toHaveBeenCalledWith('Campo requerido');
    });
  });

  describe('updateProduct', () => {
    it('returns updated product on success', async () => {
      mockUpdateExecute.mockResolvedValueOnce(
        ok(makeDomainProduct({ name: 'Actualizado' }))
      );
      const { result } = renderHook(() => useProductActions());

      let product: unknown;
      await act(async () => {
        product = await result.current.updateProduct('prod-1', {
          name: 'Actualizado',
        });
      });

      expect(product).not.toBeNull();
      expect((product as { name: string })?.name).toBe('Actualizado');
      expect(toast.success).toHaveBeenCalledWith(
        'Producto actualizado exitosamente'
      );
    });

    it('returns null on failure', async () => {
      mockUpdateExecute.mockResolvedValueOnce(
        err(new DomainError('No encontrado', 'NOT_FOUND'))
      );
      const { result } = renderHook(() => useProductActions());

      let product: unknown;
      await act(async () => {
        product = await result.current.updateProduct('prod-99', { name: 'X' });
      });

      expect(product).toBeNull();
      expect(toast.error).toHaveBeenCalledWith('No encontrado');
    });
  });

  describe('deleteProduct', () => {
    it('returns true and shows success toast', async () => {
      const { result } = renderHook(() => useProductActions());

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.deleteProduct('prod-1');
      });

      expect(success).toBe(true);
      expect(toast.success).toHaveBeenCalledWith(
        'Producto eliminado exitosamente'
      );
    });

    it('returns false on failure', async () => {
      mockDeleteExecute.mockResolvedValueOnce(
        err(new DomainError('Error delete', 'ERR'))
      );
      const { result } = renderHook(() => useProductActions());

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.deleteProduct('prod-1');
      });

      expect(success).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Error delete');
    });
  });

  describe('toggleProductStatus', () => {
    it('shows activate toast when isActive=true', async () => {
      const { result } = renderHook(() => useProductActions());
      await act(async () => {
        await result.current.toggleProductStatus('prod-1', true);
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Producto activado exitosamente'
      );
    });

    it('shows deactivate toast when isActive=false', async () => {
      const { result } = renderHook(() => useProductActions());
      await act(async () => {
        await result.current.toggleProductStatus('prod-1', false);
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Producto desactivado exitosamente'
      );
    });

    it('returns false on failure', async () => {
      mockUpdateExecute.mockResolvedValueOnce(
        err(new DomainError('Error estado', 'ERR'))
      );
      const { result } = renderHook(() => useProductActions());

      let ok: boolean | undefined;
      await act(async () => {
        ok = await result.current.toggleProductStatus('prod-1', true);
      });
      expect(ok).toBe(false);
    });
  });

  describe('updateProductStock', () => {
    it('shows success toast', async () => {
      const { result } = renderHook(() => useProductActions());
      await act(async () => {
        await result.current.updateProductStock('prod-1', 50);
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Stock actualizado exitosamente'
      );
    });

    it('returns false on failure', async () => {
      mockUpdateExecute.mockResolvedValueOnce(
        err(new DomainError('Error stock', 'ERR'))
      );
      const { result } = renderHook(() => useProductActions());

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.updateProductStock('prod-1', 5);
      });
      expect(success).toBe(false);
    });
  });

  describe('bulkUpdateProducts', () => {
    it('processes activate operation and shows success toast', async () => {
      mockUpdateExecute.mockResolvedValue(ok(makeDomainProduct()));
      const { result } = renderHook(() => useProductActions());

      await act(async () => {
        await result.current.bulkUpdateProducts([
          { operation: 'activate', ids: ['p1', 'p2'] },
        ]);
      });

      expect(mockUpdateExecute).toHaveBeenCalledTimes(2);
      expect(toast.success).toHaveBeenCalledWith('2 productos procesados');
    });

    it('processes delete operation', async () => {
      mockDeleteExecute.mockResolvedValue(ok(true));
      const { result } = renderHook(() => useProductActions());

      await act(async () => {
        await result.current.bulkUpdateProducts([
          { operation: 'delete', ids: ['p1'] },
        ]);
      });

      expect(mockDeleteExecute).toHaveBeenCalledWith('p1');
    });

    it('shows error toast for rejected tasks', async () => {
      mockUpdateExecute.mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useProductActions());

      await act(async () => {
        await result.current.bulkUpdateProducts([
          { operation: 'activate', ids: ['p1'] },
        ]);
      });

      expect(toast.error).toHaveBeenCalledWith('1 productos fallaron');
    });
  });

  describe('uploadProductImage', () => {
    it('returns url on success', async () => {
      const { result } = renderHook(() => useProductActions());

      let url: string | null | undefined;
      await act(async () => {
        url = await result.current.uploadProductImage(
          new File([''], 'img.jpg'),
          'prod-1'
        );
      });

      expect(url).toBe('https://cdn.example.com/img.jpg');
    });

    it('returns null on failure', async () => {
      mockUploadImageExecute.mockResolvedValueOnce(
        err(new DomainError('Error upload', 'ERR'))
      );
      const { result } = renderHook(() => useProductActions());

      let url: string | null | undefined;
      await act(async () => {
        url = await result.current.uploadProductImage(
          new File([''], 'img.jpg'),
          'prod-1'
        );
      });

      expect(url).toBeNull();
    });
  });

  it('validateProductInput always returns empty array', () => {
    const { result } = renderHook(() => useProductActions());
    expect(result.current.validateProductInput()).toEqual([]);
  });
});
