import type { Category } from '@/core/domain/category/Category';
import type { CategoryRepository } from '@/core/domain/category/CategoryRepository';
import { ok } from '@/core/shared/Result';
import { vi, type Mocked } from 'vitest';

export const MOCK_CATEGORY: Category = {
  id: 'cat-1',
  name: 'Ropa de Bebé',
  description: 'Colección de ropa para bebés',
  slug: 'ropa-de-bebe',
  image: 'https://cdn.example.com/cat.jpg',
  isActive: true,
  sortOrder: 1,
  productCount: 5,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
};

export const MOCK_CATEGORY_PAGE = {
  items: [MOCK_CATEGORY],
  total: 1,
  hasMore: false,
};

export const createMockRepository = (): Mocked<CategoryRepository> => ({
  findById: vi.fn().mockResolvedValue(ok(MOCK_CATEGORY)),
  findAll: vi.fn().mockResolvedValue(ok(MOCK_CATEGORY_PAGE)),
  create: vi.fn().mockResolvedValue(ok(MOCK_CATEGORY)),
  update: vi.fn().mockResolvedValue(ok(MOCK_CATEGORY)),
  delete: vi.fn().mockResolvedValue(ok(true)),
});
