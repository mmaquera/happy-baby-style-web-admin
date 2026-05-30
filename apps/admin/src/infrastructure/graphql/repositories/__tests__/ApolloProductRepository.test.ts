import { ApolloProductRepository } from '../ApolloProductRepository';
import { isOk, isErr } from '@/core/shared/Result';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

const makeGQLProduct = (overrides = {}) => ({
  __typename: 'Product' as const,
  id: 'prod-1',
  name: 'Body Orgánico',
  description: 'Para bebé',
  sku: 'BODY-001',
  price: 100,
  salePrice: 80,
  images: [],
  tags: ['nuevo'],
  attributes: {},
  isActive: true,
  stockQuantity: 10,
  rating: null,
  reviewCount: 0,
  currentPrice: 80,
  hasDiscount: true,
  discountPercentage: 20,
  totalStock: 10,
  isInStock: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  category: null,
  variants: [],
  ...overrides,
});

const makeClient = () => ({
  query: vi.fn(),
  mutate: vi.fn(),
});

describe('ApolloProductRepository', () => {
  let client: ReturnType<typeof makeClient>;
  let repo: ApolloProductRepository;

  beforeEach(() => {
    client = makeClient();
    repo = new ApolloProductRepository(
      client as unknown as ApolloClient<NormalizedCacheObject>
    );
  });

  describe('findAll', () => {
    it('returns empty page when responseData is null', async () => {
      client.query.mockResolvedValue({ data: { products: null } });
      const result = await repo.findAll();
      expect(isOk(result)).toBe(true);
      if (isOk(result))
        expect(result.value).toEqual({ items: [], total: 0, hasMore: false });
    });

    it('returns mapped products on success', async () => {
      const gqlProduct = makeGQLProduct();
      client.query.mockResolvedValue({
        data: {
          products: {
            data: {
              items: [gqlProduct],
              pagination: { total: 1, hasMore: false },
            },
          },
        },
      });

      const result = await repo.findAll();
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value.items).toHaveLength(1);
        expect(result.value.items[0].id).toBe('prod-1');
        expect(result.value.total).toBe(1);
      }
    });

    it('passes filter and pagination to query', async () => {
      client.query.mockResolvedValue({ data: { products: null } });
      await repo.findAll({ isActive: true }, 10, 20);
      expect(client.query).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: expect.objectContaining({
            filter: expect.objectContaining({ isActive: true }),
            pagination: { limit: 10, offset: 20 },
          }),
        })
      );
    });

    it('returns err on network error', async () => {
      client.query.mockRejectedValue(new Error('Network error'));
      const result = await repo.findAll();
      expect(isErr(result)).toBe(true);
    });
  });

  describe('findById', () => {
    it('returns mapped product when found', async () => {
      const gqlProduct = makeGQLProduct();
      client.query.mockResolvedValue({
        data: { product: { data: { entity: gqlProduct } } },
      });

      const result = await repo.findById('prod-1');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value.id).toBe('prod-1');
    });

    it('returns err when entity is null', async () => {
      client.query.mockResolvedValue({ data: { product: { data: null } } });
      const result = await repo.findById('not-found');
      expect(isErr(result)).toBe(true);
    });

    it('returns err on query throw', async () => {
      client.query.mockRejectedValue(new Error('fail'));
      const result = await repo.findById('prod-1');
      expect(isErr(result)).toBe(true);
    });
  });

  describe('create', () => {
    it('returns mapped product on success', async () => {
      const gqlProduct = makeGQLProduct();
      client.mutate.mockResolvedValue({
        data: {
          createProduct: {
            success: true,
            message: 'Creado',
            data: { entity: gqlProduct },
          },
        },
      });

      const result = await repo.create({
        name: 'Body Orgánico',
        sku: 'BODY-001',
        price: 100,
      });

      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value.name).toBe('Body Orgánico');
    });

    it('returns err when success=false', async () => {
      client.mutate.mockResolvedValue({
        data: {
          createProduct: {
            success: false,
            message: 'SKU duplicado',
            data: null,
          },
        },
      });

      const result = await repo.create({ name: 'x', sku: 'dup', price: 10 });
      expect(isErr(result)).toBe(true);
      if (isErr(result))
        expect(result.error.message).toContain('SKU duplicado');
    });

    it('returns err on network throw', async () => {
      client.mutate.mockRejectedValue(new Error('Network error'));
      const result = await repo.create({ name: 'x', sku: 'y', price: 10 });
      expect(isErr(result)).toBe(true);
    });
  });

  describe('update', () => {
    it('returns updated product on success', async () => {
      const gqlProduct = makeGQLProduct({ name: 'Actualizado' });
      client.mutate.mockResolvedValue({
        data: {
          updateProduct: {
            success: true,
            message: 'OK',
            data: { entity: gqlProduct },
          },
        },
      });

      const result = await repo.update('prod-1', { name: 'Actualizado' });
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value.name).toBe('Actualizado');
    });

    it('returns err when success=false', async () => {
      client.mutate.mockResolvedValue({
        data: {
          updateProduct: {
            success: false,
            message: 'No encontrado',
            data: null,
          },
        },
      });

      const result = await repo.update('prod-99', { name: 'x' });
      expect(isErr(result)).toBe(true);
    });
  });

  describe('delete', () => {
    it('returns ok(true) on success', async () => {
      client.mutate.mockResolvedValue({
        data: { deleteProduct: { success: true, message: 'Eliminado' } },
      });

      const result = await repo.delete('prod-1');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value).toBe(true);
    });

    it('returns err when success=false', async () => {
      client.mutate.mockResolvedValue({
        data: {
          deleteProduct: { success: false, message: 'No se puede eliminar' },
        },
      });

      const result = await repo.delete('prod-1');
      expect(isErr(result)).toBe(true);
    });

    it('returns err on throw', async () => {
      client.mutate.mockRejectedValue(new Error('fail'));
      const result = await repo.delete('prod-1');
      expect(isErr(result)).toBe(true);
    });
  });

  describe('uploadImage', () => {
    it('returns url on success', async () => {
      client.mutate.mockResolvedValue({
        data: {
          uploadImage: {
            success: true,
            message: 'OK',
            data: { url: 'https://cdn.example.com/img.jpg' },
          },
        },
      });

      const result = await repo.uploadImage(
        new File([''], 'img.jpg'),
        'prod-1'
      );
      expect(isOk(result)).toBe(true);
      if (isOk(result))
        expect(result.value).toBe('https://cdn.example.com/img.jpg');
    });

    it('returns err when url is missing', async () => {
      client.mutate.mockResolvedValue({
        data: { uploadImage: { success: false, message: 'Error', data: null } },
      });

      const result = await repo.uploadImage(
        new File([''], 'img.jpg'),
        'prod-1'
      );
      expect(isErr(result)).toBe(true);
    });
  });
});
