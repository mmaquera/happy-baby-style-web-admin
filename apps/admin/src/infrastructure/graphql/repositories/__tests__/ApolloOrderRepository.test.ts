import { ApolloOrderRepository } from '../ApolloOrderRepository';
import { isOk, isErr } from '@happy-baby/domain-shared';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

const makeOrderDTO = (overrides = {}) => ({
  id: 'order-1',
  orderNumber: 'ORD-001',
  status: 'pending' as const,
  subtotal: 100,
  taxAmount: 18,
  shippingAmount: 10,
  totalAmount: 128,
  notes: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  user: null,
  items: [],
  shippingAddress: null,
  ...overrides,
});

const makeClient = () => ({ query: vi.fn(), mutate: vi.fn() });

describe('ApolloOrderRepository', () => {
  let client: ReturnType<typeof makeClient>;
  let repo: ApolloOrderRepository;

  beforeEach(() => {
    client = makeClient();
    repo = new ApolloOrderRepository(
      client as unknown as ApolloClient<NormalizedCacheObject>
    );
  });

  describe('findAll', () => {
    it('returns orders on success', async () => {
      client.query.mockResolvedValue({
        data: {
          orders: { orders: [makeOrderDTO()], total: 1, hasMore: false },
        },
      });
      const result = await repo.findAll();
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value.items).toHaveLength(1);
        expect(result.value.total).toBe(1);
      }
    });

    it('handles null orders array', async () => {
      client.query.mockResolvedValue({
        data: { orders: { orders: null, total: 0, hasMore: false } },
      });
      const result = await repo.findAll();
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value.items).toHaveLength(0);
    });

    it('passes status filter to query', async () => {
      client.query.mockResolvedValue({
        data: { orders: { orders: [], total: 0, hasMore: false } },
      });
      await repo.findAll({ status: 'pending' }, 5, 10);
      expect(client.query).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: expect.objectContaining({
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
    it('returns mapped order when found', async () => {
      client.query.mockResolvedValue({ data: { order: makeOrderDTO() } });
      const result = await repo.findById('order-1');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value.id).toBe('order-1');
    });

    it('returns err when order is null', async () => {
      client.query.mockResolvedValue({ data: { order: null } });
      const result = await repo.findById('missing');
      expect(isErr(result)).toBe(true);
    });

    it('returns err on throw', async () => {
      client.query.mockRejectedValue(new Error('fail'));
      const result = await repo.findById('order-1');
      expect(isErr(result)).toBe(true);
    });
  });

  describe('updateStatus', () => {
    it('re-fetches order after successful mutation', async () => {
      client.mutate.mockResolvedValue({
        data: { updateOrderStatus: { id: 'order-1' } },
      });
      client.query.mockResolvedValue({
        data: { order: makeOrderDTO({ status: 'confirmed' }) },
      });
      const result = await repo.updateStatus('order-1', 'confirmed');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value.status).toBe('confirmed');
    });

    it('returns err when updateOrderStatus is null', async () => {
      client.mutate.mockResolvedValue({ data: { updateOrderStatus: null } });
      const result = await repo.updateStatus('order-1', 'confirmed');
      expect(isErr(result)).toBe(true);
    });

    it('returns err on throw', async () => {
      client.mutate.mockRejectedValue(new Error('fail'));
      const result = await repo.updateStatus('order-1', 'confirmed');
      expect(isErr(result)).toBe(true);
    });
  });

  describe('cancel', () => {
    it('re-fetches order after successful cancel', async () => {
      client.mutate.mockResolvedValue({
        data: { cancelOrder: { id: 'order-1' } },
      });
      client.query.mockResolvedValue({
        data: { order: makeOrderDTO({ status: 'cancelled' }) },
      });
      const result = await repo.cancel('order-1');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value.status).toBe('cancelled');
    });

    it('returns err when cancelOrder is null', async () => {
      client.mutate.mockResolvedValue({ data: { cancelOrder: null } });
      const result = await repo.cancel('order-1');
      expect(isErr(result)).toBe(true);
    });
  });
});
