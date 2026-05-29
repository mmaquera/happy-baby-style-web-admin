import type { User } from '@/core/domain/user/User';
import type { UserRepository } from '@/core/domain/user/UserRepository';
import { ok } from '@/core/shared/Result';
import { vi, type Mocked } from 'vitest';

export const MOCK_USER: User = {
  id: 'user-1',
  email: 'ana@example.com',
  role: 'customer',
  isActive: true,
  emailVerified: true,
  lastLoginAt: new Date('2024-01-15T10:00:00Z'),
  profile: {
    id: 'profile-1',
    firstName: 'Ana',
    lastName: 'García',
    phone: '+573001234567',
    dateOfBirth: '1990-05-15',
    avatar: null,
    fullName: 'Ana García',
  },
  addresses: [],
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
};

export const MOCK_USER_PAGE = {
  items: [MOCK_USER],
  total: 1,
  hasMore: false,
};

export const createMockRepository = (): Mocked<UserRepository> => ({
  findAll: vi.fn().mockResolvedValue(ok(MOCK_USER_PAGE)),
  findById: vi.fn().mockResolvedValue(ok(MOCK_USER)),
  create: vi.fn().mockResolvedValue(ok(MOCK_USER)),
  update: vi.fn().mockResolvedValue(ok(MOCK_USER)),
  delete: vi.fn().mockResolvedValue(ok(true)),
  activate: vi.fn().mockResolvedValue(ok({ ...MOCK_USER, isActive: true })),
  deactivate: vi.fn().mockResolvedValue(ok({ ...MOCK_USER, isActive: false })),
});
