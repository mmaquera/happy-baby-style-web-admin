import { ApolloCategoryRepository } from '@happy-baby/infrastructure-graphql';
import { isOk, isErr } from '@happy-baby/domain-shared';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

const makeGQLCategory = (overrides = {}) => ({
  __typename: 'Category' as const,
  id: 'cat-1',
  name: 'Ropa bebé',
  description: 'Desc',
  slug: 'ropa-bebe',
  image: null,
  isActive: true,
  sortOrder: 0,
  products: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

const makeClient = () => ({ query: vi.fn(), mutate: vi.fn() });

describe('ApolloCategoryRepository', () => {
  let client: ReturnType<typeof makeClient>;
  let repo: ApolloCategoryRepository;

  beforeEach(() => {
    client = makeClient();
    repo = new ApolloCategoryRepository(
      client as unknown as ApolloClient<NormalizedCacheObject>
    );
  });

  describe('findAll', () => {
    it('returns empty page when responseData is null', async () => {
      client.query.mockResolvedValue({ data: { categories: null } });
      const result = await repo.findAll();
      expect(isOk(result)).toBe(true);
      if (isOk(result))
        expect(result.value).toEqual({ items: [], total: 0, hasMore: false });
    });

    it('returns mapped categories on success', async () => {
      client.query.mockResolvedValue({
        data: {
          categories: {
            data: {
              items: [makeGQLCategory()],
              pagination: { total: 1, hasMore: false },
            },
          },
        },
      });

      const result = await repo.findAll();
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value.items).toHaveLength(1);
        expect(result.value.items[0]!.id).toBe('cat-1');
      }
    });

    it('passes filter to query', async () => {
      client.query.mockResolvedValue({ data: { categories: null } });
      await repo.findAll({ isActive: true }, 5, 10);
      expect(client.query).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: expect.objectContaining({
            filters: expect.objectContaining({ isActive: true }),
            pagination: { limit: 5, offset: 10 },
          }),
        })
      );
    });

    it('returns err on network error', async () => {
      client.query.mockRejectedValue(new Error('fail'));
      const result = await repo.findAll();
      expect(isErr(result)).toBe(true);
    });
  });

  describe('findById', () => {
    it('returns mapped category when found', async () => {
      client.query.mockResolvedValue({
        data: { category: { data: { entity: makeGQLCategory() } } },
      });
      const result = await repo.findById('cat-1');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value.id).toBe('cat-1');
    });

    it('returns err when entity is null', async () => {
      client.query.mockResolvedValue({ data: { category: { data: null } } });
      const result = await repo.findById('missing');
      expect(isErr(result)).toBe(true);
    });
  });

  describe('create', () => {
    it('returns mapped category on success', async () => {
      client.mutate.mockResolvedValue({
        data: {
          createCategory: {
            success: true,
            message: 'Creada',
            data: { entity: makeGQLCategory() },
          },
        },
      });

      const result = await repo.create({
        name: 'Ropa bebé',
        slug: 'ropa-bebe',
      });
      expect(isOk(result)).toBe(true);
    });

    it('returns err when success=false', async () => {
      client.mutate.mockResolvedValue({
        data: {
          createCategory: {
            success: false,
            message: 'Slug duplicado',
            data: null,
          },
        },
      });
      const result = await repo.create({ name: 'x', slug: 'dup' });
      expect(isErr(result)).toBe(true);
    });
  });

  describe('update', () => {
    it('returns updated category on success', async () => {
      client.mutate.mockResolvedValue({
        data: {
          updateCategory: {
            success: true,
            message: 'OK',
            data: { entity: makeGQLCategory({ name: 'Updated' }) },
          },
        },
      });
      const result = await repo.update('cat-1', { name: 'Updated' });
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value.name).toBe('Updated');
    });

    it('returns err when success=false', async () => {
      client.mutate.mockResolvedValue({
        data: {
          updateCategory: { success: false, message: 'Error', data: null },
        },
      });
      const result = await repo.update('cat-1', { name: 'x' });
      expect(isErr(result)).toBe(true);
    });
  });

  describe('delete', () => {
    it('returns ok(true) on success', async () => {
      client.mutate.mockResolvedValue({
        data: { deleteCategory: { success: true, message: 'OK' } },
      });
      const result = await repo.delete('cat-1');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value).toBe(true);
    });

    it('returns err when success=false', async () => {
      client.mutate.mockResolvedValue({
        data: { deleteCategory: { success: false, message: 'No se puede' } },
      });
      const result = await repo.delete('cat-1');
      expect(isErr(result)).toBe(true);
    });
  });
});
