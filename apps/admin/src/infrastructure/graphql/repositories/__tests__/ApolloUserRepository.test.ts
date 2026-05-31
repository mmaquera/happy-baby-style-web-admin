import { ApolloUserRepository } from '@happy-baby/infrastructure-graphql';
import { isOk, isErr } from '@happy-baby/domain-shared';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { UserRole as GQLUserRole } from '@/generated/graphql';

const makeUserDTO = (overrides = {}) => ({
  id: 'u-1',
  email: 'test@example.com',
  role: GQLUserRole.customer,
  isActive: true,
  emailVerified: true,
  lastLoginAt: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  profile: {
    id: 'p-1',
    firstName: 'Juan',
    lastName: 'García',
    phone: null,
    dateOfBirth: null,
    avatar: null,
    fullName: 'Juan García',
  },
  addresses: [],
  ...overrides,
});

const makeClient = () => ({ query: vi.fn(), mutate: vi.fn() });

describe('ApolloUserRepository', () => {
  let client: ReturnType<typeof makeClient>;
  let repo: ApolloUserRepository;

  beforeEach(() => {
    client = makeClient();
    repo = new ApolloUserRepository(
      client as unknown as ApolloClient<NormalizedCacheObject>
    );
  });

  describe('findAll', () => {
    it('returns empty page when responseData is null', async () => {
      client.query.mockResolvedValue({ data: { users: null } });
      const result = await repo.findAll();
      expect(isOk(result)).toBe(true);
      if (isOk(result))
        expect(result.value).toEqual({ items: [], total: 0, hasMore: false });
    });

    it('returns mapped users on success', async () => {
      client.query.mockResolvedValue({
        data: {
          users: {
            data: {
              items: [makeUserDTO()],
              pagination: { total: 1, hasMore: false },
            },
          },
        },
      });
      const result = await repo.findAll();
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value.items).toHaveLength(1);
        expect(result.value.items[0].id).toBe('u-1');
      }
    });

    it('returns err on network error', async () => {
      client.query.mockRejectedValue(new Error('Network'));
      const result = await repo.findAll();
      expect(isErr(result)).toBe(true);
    });
  });

  describe('findById', () => {
    it('returns mapped user when found', async () => {
      client.query.mockResolvedValue({ data: { user: makeUserDTO() } });
      const result = await repo.findById('u-1');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value.id).toBe('u-1');
    });

    it('returns err when user is null', async () => {
      client.query.mockResolvedValue({ data: { user: null } });
      const result = await repo.findById('missing');
      expect(isErr(result)).toBe(true);
    });
  });

  describe('create', () => {
    it('returns mapped user on success', async () => {
      client.mutate.mockResolvedValue({
        data: { createUser: { data: { entity: makeUserDTO() } } },
      });
      const result = await repo.create({
        email: 'test@example.com',
        firstName: 'Juan',
        lastName: 'García',
      });
      expect(isOk(result)).toBe(true);
    });

    it('returns err when entity is null', async () => {
      client.mutate.mockResolvedValue({ data: { createUser: { data: null } } });
      const result = await repo.create({
        email: 'x@x.com',
        firstName: 'x',
        lastName: 'y',
      });
      expect(isErr(result)).toBe(true);
    });

    it('returns err on throw', async () => {
      client.mutate.mockRejectedValue(new Error('fail'));
      const result = await repo.create({
        email: 'x@x.com',
        firstName: 'x',
        lastName: 'y',
      });
      expect(isErr(result)).toBe(true);
    });
  });

  describe('update', () => {
    it('re-fetches full user on success', async () => {
      client.mutate.mockResolvedValue({ data: { updateUser: { id: 'u-1' } } });
      client.query.mockResolvedValue({
        data: { user: makeUserDTO({ email: 'updated@x.com' }) },
      });
      const result = await repo.update('u-1', { email: 'updated@x.com' });
      expect(isOk(result)).toBe(true);
    });

    it('returns err when updateUser is null', async () => {
      client.mutate.mockResolvedValue({ data: { updateUser: null } });
      const result = await repo.update('u-1', { email: 'x@x.com' });
      expect(isErr(result)).toBe(true);
    });
  });

  describe('delete', () => {
    it('returns ok(true) on success', async () => {
      client.mutate.mockResolvedValue({
        data: { deleteUser: { success: true, message: 'OK' } },
      });
      const result = await repo.delete('u-1');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value).toBe(true);
    });

    it('returns err when success=false', async () => {
      client.mutate.mockResolvedValue({
        data: { deleteUser: { success: false, message: 'Error' } },
      });
      const result = await repo.delete('u-1');
      expect(isErr(result)).toBe(true);
    });
  });

  describe('activate', () => {
    it('returns mapped user on success', async () => {
      client.mutate.mockResolvedValue({
        data: { activateUser: makeUserDTO({ isActive: true }) },
      });
      const result = await repo.activate('u-1');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value.isActive).toBe(true);
    });

    it('returns err when activateUser is null', async () => {
      client.mutate.mockResolvedValue({ data: { activateUser: null } });
      const result = await repo.activate('u-1');
      expect(isErr(result)).toBe(true);
    });
  });

  describe('deactivate', () => {
    it('returns mapped user on success', async () => {
      client.mutate.mockResolvedValue({
        data: { deactivateUser: makeUserDTO({ isActive: false }) },
      });
      const result = await repo.deactivate('u-1');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) expect(result.value.isActive).toBe(false);
    });

    it('returns err when deactivateUser is null', async () => {
      client.mutate.mockResolvedValue({ data: { deactivateUser: null } });
      const result = await repo.deactivate('u-1');
      expect(isErr(result)).toBe(true);
    });
  });
});
