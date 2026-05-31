import { renderHook, act } from '@testing-library/react';
import type React from 'react';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { useProductActions } from '@happy-baby/feature-products';
import { ProductProvider } from '@/app/di/products';
import {
  CreateProductDocument,
  DeleteProductDocument,
} from '@happy-baby/infrastructure-graphql';

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
  success: vi.fn(),
  error: vi.fn(),
}));

const mockProductEntity = {
  id: 'prod-1',
  name: 'Babero rojo',
  description: 'Babero algodón',
  price: '30.00',
  salePrice: null,
  sku: 'BAB-002',
  images: [],
  attributes: {},
  isActive: true,
  stockQuantity: 5,
  tags: [],
  rating: null,
  reviewCount: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  currentPrice: '30.00',
  hasDiscount: false,
  discountPercentage: 0,
  totalStock: 5,
  isInStock: true,
  category: null,
  variants: [],
};

const createProductMock = (
  overrides: { success?: boolean; message?: string } = {}
): MockedResponse => ({
  request: {
    query: CreateProductDocument,
    variables: {
      input: {
        name: 'Babero rojo',
        sku: 'BAB-002',
        price: 30,
        description: 'Babero algodón',
        isActive: true,
        stockQuantity: 5,
        images: [],
        tags: [],
        attributes: {},
      },
    },
  },
  result: {
    data: {
      createProduct: {
        success: overrides.success ?? true,
        message: overrides.message ?? 'Producto creado',
        code: overrides.success === false ? '400' : '201',
        timestamp: '2026-01-01T00:00:00.000Z',
        data:
          overrides.success !== false
            ? {
                entity: mockProductEntity,
                id: 'prod-1',
                createdAt: '2026-01-01T00:00:00.000Z',
              }
            : null,
        metadata: null,
      },
    },
  },
});

const deleteProductMock = (id: string, success = true): MockedResponse => ({
  request: { query: DeleteProductDocument, variables: { id } },
  result: {
    data: {
      deleteProduct: {
        success,
        message: success ? 'Eliminado' : 'Error',
        code: success ? '200' : '400',
        timestamp: '2026-01-01T00:00:00.000Z',
        data: null,
        metadata: null,
      },
    },
  },
});

const createWrapper =
  (mocks: MockedResponse[]): React.FC<{ children: React.ReactNode }> =>
  ({ children }) => (
    <MockedProvider mocks={mocks} addTypename={false}>
      <ProductProvider>{children}</ProductProvider>
    </MockedProvider>
  );

const baseInput = {
  name: 'Babero rojo',
  sku: 'BAB-002',
  price: 30,
  description: 'Babero algodón',
  isActive: true,
  stockQuantity: 5,
  images: [] as string[],
  tags: [] as string[],
  attributes: {} as Record<string, string>,
};

describe('useProductActions — integración MockedProvider', () => {
  it('createProduct retorna el producto y llama la mutación correcta', async () => {
    const { result } = renderHook(() => useProductActions(), {
      wrapper: createWrapper([createProductMock()]),
    });

    let created: unknown;
    await act(async () => {
      created = await result.current.createProduct(baseInput);
    });

    expect(created).toBeTruthy();
    expect((created as { name?: string })?.name).toBe('Babero rojo');
  });

  it('createProduct devuelve null cuando el servidor rechaza', async () => {
    const { result } = renderHook(() => useProductActions(), {
      wrapper: createWrapper([
        createProductMock({ success: false, message: 'SKU duplicado' }),
      ]),
    });

    let created: unknown;
    await act(async () => {
      created = await result.current.createProduct(baseInput);
    });

    expect(created).toBeNull();
    expect(result.current.error).toBeTruthy();
  });

  it('deleteProduct devuelve true cuando el servidor confirma', async () => {
    const { result } = renderHook(() => useProductActions(), {
      wrapper: createWrapper([deleteProductMock('prod-1', true)]),
    });

    let ok: unknown;
    await act(async () => {
      ok = await result.current.deleteProduct('prod-1');
    });

    expect(ok).toBe(true);
  });

  it('deleteProduct devuelve false cuando el servidor falla', async () => {
    const { result } = renderHook(() => useProductActions(), {
      wrapper: createWrapper([deleteProductMock('prod-1', false)]),
    });

    let ok: unknown;
    await act(async () => {
      ok = await result.current.deleteProduct('prod-1');
    });

    expect(ok).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('loading es true durante la operación y false al completar', async () => {
    const { result } = renderHook(() => useProductActions(), {
      wrapper: createWrapper([createProductMock()]),
    });

    expect(result.current.loading).toBe(false);

    const promise = act(async () => {
      await result.current.createProduct(baseInput);
    });

    await promise;
    expect(result.current.loading).toBe(false);
  });
});
