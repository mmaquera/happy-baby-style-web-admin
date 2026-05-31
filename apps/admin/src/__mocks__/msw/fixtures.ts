export const mockUser = {
  id: 'user-1',
  email: 'admin@test.com',
  role: 'ADMIN',
  isActive: true,
  emailVerified: true,
  lastLoginAt: '2026-01-01T00:00:00.000Z',
  profile: {
    id: 'profile-1',
    firstName: 'Admin',
    lastName: 'Test',
    phone: null,
    dateOfBirth: null,
    avatar: null,
  },
};

export const mockAuthResponse = (success: boolean) => ({
  loginUser: {
    success,
    message: success ? 'Login exitoso' : 'Credenciales inválidas',
    code: success ? '200' : '401',
    timestamp: '2026-01-01T00:00:00.000Z',
    data: success
      ? {
          user: mockUser,
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        }
      : null,
    metadata: success
      ? {
          requestId: 'req-1',
          traceId: 'trace-1',
          duration: 100,
          timestamp: '2026-01-01T00:00:00.000Z',
        }
      : null,
  },
});

export const mockProduct = {
  id: 'prod-1',
  name: 'Babero azul',
  description: 'Babero de algodón azul',
  price: '25.00',
  salePrice: null,
  sku: 'BAB-001',
  images: [],
  attributes: {},
  isActive: true,
  stockQuantity: 10,
  tags: [],
  rating: null,
  reviewCount: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  currentPrice: '25.00',
  hasDiscount: false,
  discountPercentage: 0,
  totalStock: 10,
  isInStock: true,
  category: null,
  variants: [],
};

export const mockProductListResponse = {
  products: {
    data: {
      items: [mockProduct],
      pagination: { total: 1, limit: 20, offset: 0, hasMore: false },
    },
    success: true,
    message: null,
    code: '200',
  },
};

export const mockCreateProductResponse = (
  overrides: Partial<typeof mockProduct> = {}
) => ({
  createProduct: {
    success: true,
    message: 'Producto creado exitosamente',
    code: '201',
    data: {
      entity: { ...mockProduct, ...overrides },
    },
  },
});

export const mockUpdateProductResponse = (
  overrides: Partial<typeof mockProduct> = {}
) => ({
  updateProduct: {
    success: true,
    message: 'Producto actualizado exitosamente',
    code: '200',
    data: {
      entity: { ...mockProduct, ...overrides },
    },
  },
});

export const mockDeleteProductResponse = {
  deleteProduct: {
    success: true,
    message: 'Producto eliminado exitosamente',
    code: '200',
    data: null,
  },
};
