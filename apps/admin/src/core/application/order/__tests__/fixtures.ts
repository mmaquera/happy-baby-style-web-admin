import type { Order } from '@/core/domain/order/Order';
import type { OrderRepository } from '@/core/domain/order/OrderRepository';
import { ok } from '@/core/shared/Result';
import { vi, type Mocked } from 'vitest';

export const MOCK_ORDER: Order = {
  id: 'order-1',
  orderNumber: 'ORD-001',
  status: 'pending',
  subtotal: 80000,
  taxAmount: 8000,
  shippingAmount: 5000,
  totalAmount: 93000,
  notes: null,
  customer: {
    id: 'user-1',
    email: 'cliente@example.com',
    firstName: 'Ana',
    lastName: 'García',
    phone: null,
  },
  items: [
    {
      id: 'item-1',
      quantity: 2,
      unitPrice: 40000,
      totalPrice: 80000,
      product: {
        id: 'prod-1',
        name: 'Body Orgánico',
        sku: 'BODY-001',
        images: [],
      },
    },
  ],
  shippingAddress: {
    id: 'addr-1',
    firstName: 'Ana',
    lastName: 'García',
    company: null,
    address1: 'Calle 123 #45-67',
    address2: null,
    city: 'Bogotá',
    state: 'Cundinamarca',
    postalCode: '110111',
    country: 'CO',
    phone: null,
  },
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
};

export const createMockRepository = (): Mocked<OrderRepository> => ({
  findAll: vi
    .fn()
    .mockResolvedValue(ok({ items: [MOCK_ORDER], total: 1, hasMore: false })),
  findById: vi.fn().mockResolvedValue(ok(MOCK_ORDER)),
  updateStatus: vi
    .fn()
    .mockResolvedValue(ok({ ...MOCK_ORDER, status: 'confirmed' as const })),
  cancel: vi
    .fn()
    .mockResolvedValue(ok({ ...MOCK_ORDER, status: 'cancelled' as const })),
});
