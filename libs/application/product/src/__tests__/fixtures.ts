import type { Product } from '@happy-baby/domain-product';
import type { ProductRepository } from '@happy-baby/domain-product';
import { ok } from '@happy-baby/domain-shared';
import { vi, type Mocked } from 'vitest';

export const MOCK_PRODUCT: Product = {
  id: 'prod-1',
  name: 'Body Orgánico',
  description: 'Para bebé',
  sku: 'BODY-001',
  price: 100,
  salePrice: 80,
  images: [],
  tags: ['nuevo'],
  attributes: { material: 'algodón' },
  isActive: true,
  stockQuantity: 10,
  categoryId: 'cat-1',
  rating: null,
  reviewCount: 0,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
};

export const createMockRepository = (): Mocked<ProductRepository> => ({
  findAll: vi
    .fn()
    .mockResolvedValue(ok({ items: [], total: 0, hasMore: false })),
  findById: vi.fn().mockResolvedValue(ok(MOCK_PRODUCT)),
  create: vi.fn().mockResolvedValue(ok(MOCK_PRODUCT)),
  update: vi.fn().mockResolvedValue(ok(MOCK_PRODUCT)),
  delete: vi.fn().mockResolvedValue(ok(true)),
  uploadImage: vi.fn().mockResolvedValue(ok('https://cdn.example.com/img.jpg')),
});
