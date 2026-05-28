import type { Product } from '@/core/domain/product/Product';
import type { ProductRepository } from '@/core/domain/product/ProductRepository';
import { ok } from '@/core/shared/Result';

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

export const createMockRepository = (): jest.Mocked<ProductRepository> => ({
  findAll: jest
    .fn()
    .mockResolvedValue(ok({ items: [], total: 0, hasMore: false })),
  findById: jest.fn().mockResolvedValue(ok(MOCK_PRODUCT)),
  create: jest.fn().mockResolvedValue(ok(MOCK_PRODUCT)),
  update: jest.fn().mockResolvedValue(ok(MOCK_PRODUCT)),
  delete: jest.fn().mockResolvedValue(ok(true)),
  uploadImage: jest
    .fn()
    .mockResolvedValue(ok('https://cdn.example.com/img.jpg')),
});
