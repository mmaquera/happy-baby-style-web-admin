import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useUserActions } from '@happy-baby/feature-users';
import { UserContext } from '@happy-baby/feature-users';
import type { UserUseCases } from '@happy-baby/feature-users';
import { ok, err, DomainError } from '@happy-baby/domain-shared';
import type { User } from '@happy-baby/domain-user';

vi.mock('react-hot-toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  success: vi.fn(),
  error: vi.fn(),
}));

const mockListExecute = vi.fn();
const mockCreateExecute = vi.fn();
const mockUpdateExecute = vi.fn();
const mockDeleteExecute = vi.fn();
const mockActivateExecute = vi.fn();
const mockDeactivateExecute = vi.fn();
const mockGetExecute = vi.fn();

const mockUseCases = {
  list: { execute: mockListExecute },
  create: { execute: mockCreateExecute },
  update: { execute: mockUpdateExecute },
  delete: { execute: mockDeleteExecute },
  activate: { execute: mockActivateExecute },
  deactivate: { execute: mockDeactivateExecute },
  get: { execute: mockGetExecute },
} as unknown as UserUseCases;

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(UserContext.Provider, { value: mockUseCases }, children);

import { toast } from 'react-hot-toast';

const makeUser = (id = 'user-1', isActive = true): User => ({
  id,
  email: `${id}@example.com`,
  role: 'customer',
  isActive,
  emailVerified: true,
  lastLoginAt: null,
  profile: {
    id,
    firstName: 'Juan',
    lastName: 'García',
    phone: null,
    dateOfBirth: null,
    avatar: null,
    fullName: 'Juan García',
  },
  addresses: [],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
});

describe('useUserActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListExecute.mockResolvedValue(
      ok({ items: [], total: 0, hasMore: false })
    );
    mockCreateExecute.mockResolvedValue(ok(makeUser()));
    mockUpdateExecute.mockResolvedValue(ok(makeUser()));
    mockDeleteExecute.mockResolvedValue(ok(true));
    mockActivateExecute.mockResolvedValue(ok(makeUser('user-1', true)));
    mockDeactivateExecute.mockResolvedValue(ok(makeUser('user-1', false)));
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useUserActions(), { wrapper });
    expect(result.current.users).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe('loadUsers', () => {
    it('loads users and updates state', async () => {
      const user = makeUser();
      mockListExecute.mockResolvedValueOnce(
        ok({ items: [user], total: 1, hasMore: false })
      );
      const { result } = renderHook(() => useUserActions(), { wrapper });

      await act(async () => {
        await result.current.loadUsers();
      });

      expect(result.current.users).toEqual([user]);
      expect(result.current.total).toBe(1);
    });

    it('uses default limit=20, offset=0', async () => {
      const { result } = renderHook(() => useUserActions(), { wrapper });
      await act(async () => {
        await result.current.loadUsers();
      });
      expect(mockListExecute).toHaveBeenCalledWith(undefined, 20, 0);
    });

    it('sets error on failure', async () => {
      mockListExecute.mockResolvedValueOnce(
        err(new DomainError('No se pudo cargar', 'ERR'))
      );
      const { result } = renderHook(() => useUserActions(), { wrapper });

      await act(async () => {
        await result.current.loadUsers();
      });

      expect(result.current.error).toBe('No se pudo cargar');
    });
  });

  describe('createUser', () => {
    it('prepends created user to list', async () => {
      const existing = makeUser('existing');
      mockListExecute.mockResolvedValueOnce(
        ok({ items: [existing], total: 1, hasMore: false })
      );
      const newUser = makeUser('new-user');
      mockCreateExecute.mockResolvedValueOnce(ok(newUser));

      const { result } = renderHook(() => useUserActions(), { wrapper });
      await act(async () => {
        await result.current.loadUsers();
      });
      await act(async () => {
        await result.current.createUser({
          email: 'new@example.com',
          firstName: 'Ana',
          lastName: 'López',
        });
      });

      expect(result.current.users[0]).toEqual(newUser);
      expect(result.current.total).toBe(2);
    });

    it('shows success toast', async () => {
      const { result } = renderHook(() => useUserActions(), { wrapper });
      await act(async () => {
        await result.current.createUser({
          email: 'x@example.com',
          firstName: 'A',
          lastName: 'B',
        });
      });
      expect(toast.success).toHaveBeenCalledWith('Usuario creado exitosamente');
    });

    it('shows error toast on failure', async () => {
      mockCreateExecute.mockResolvedValueOnce(
        err(new DomainError('Email duplicado', 'DUPLICATE'))
      );
      const { result } = renderHook(() => useUserActions(), { wrapper });

      await act(async () => {
        const success = await result.current.createUser({
          email: 'dup@example.com',
          firstName: 'A',
          lastName: 'B',
        });
        expect(success).toBe(false);
      });

      expect(toast.error).toHaveBeenCalledWith('Email duplicado');
    });
  });

  describe('deleteUser', () => {
    it('removes user from list on success', async () => {
      const u1 = makeUser('u-1');
      const u2 = makeUser('u-2');
      mockListExecute.mockResolvedValueOnce(
        ok({ items: [u1, u2], total: 2, hasMore: false })
      );

      const { result } = renderHook(() => useUserActions(), { wrapper });
      await act(async () => {
        await result.current.loadUsers();
      });
      await act(async () => {
        await result.current.deleteUser('u-1');
      });

      expect(result.current.users).toEqual([u2]);
      expect(result.current.total).toBe(1);
    });

    it('shows success toast', async () => {
      const { result } = renderHook(() => useUserActions(), { wrapper });
      await act(async () => {
        await result.current.deleteUser('u-1');
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Usuario eliminado exitosamente'
      );
    });
  });

  describe('activateUser', () => {
    it('updates user to active in list', async () => {
      const inactive = makeUser('u-1', false);
      mockListExecute.mockResolvedValueOnce(
        ok({ items: [inactive], total: 1, hasMore: false })
      );

      const { result } = renderHook(() => useUserActions(), { wrapper });
      await act(async () => {
        await result.current.loadUsers();
      });
      await act(async () => {
        await result.current.activateUser('u-1');
      });

      expect(result.current.users[0]!.isActive).toBe(true);
    });

    it('shows success toast', async () => {
      const { result } = renderHook(() => useUserActions(), { wrapper });
      await act(async () => {
        await result.current.activateUser('u-1');
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Usuario activado exitosamente'
      );
    });

    it('returns false and shows error on failure', async () => {
      mockActivateExecute.mockResolvedValueOnce(
        err(new DomainError('No existe', 'NOT_FOUND'))
      );
      const { result } = renderHook(() => useUserActions(), { wrapper });

      await act(async () => {
        const success = await result.current.activateUser('u-1');
        expect(success).toBe(false);
      });
      expect(toast.error).toHaveBeenCalledWith('No existe');
    });
  });

  describe('deactivateUser', () => {
    it('updates user to inactive in list', async () => {
      const active = makeUser('u-1', true);
      mockListExecute.mockResolvedValueOnce(
        ok({ items: [active], total: 1, hasMore: false })
      );

      const { result } = renderHook(() => useUserActions(), { wrapper });
      await act(async () => {
        await result.current.loadUsers();
      });
      await act(async () => {
        await result.current.deactivateUser('u-1');
      });

      expect(result.current.users[0]!.isActive).toBe(false);
    });

    it('shows success toast', async () => {
      const { result } = renderHook(() => useUserActions(), { wrapper });
      await act(async () => {
        await result.current.deactivateUser('u-1');
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Usuario desactivado exitosamente'
      );
    });
  });
});
