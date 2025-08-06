import { GraphQLScalarType, Kind } from 'graphql';
import { Container } from '@shared/container';
import { GetProductsUseCase } from '@application/use-cases/product/GetProductsUseCase';
import { GetProductByIdUseCase } from '@application/use-cases/product/GetProductByIdUseCase';
import { CreateProductUseCase } from '@application/use-cases/product/CreateProductUseCase';
import { UpdateProductUseCase } from '@application/use-cases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from '@application/use-cases/product/DeleteProductUseCase';
import { GetOrdersUseCase } from '@application/use-cases/order/GetOrdersUseCase';
import { GetOrderByIdUseCase } from '@application/use-cases/order/GetOrderByIdUseCase';
import { CreateOrderUseCase } from '@application/use-cases/order/CreateOrderUseCase';
import { UpdateOrderUseCase } from '@application/use-cases/order/UpdateOrderUseCase';
import { GetOrderStatsUseCase } from '@application/use-cases/order/GetOrderStatsUseCase';
import { GetUsersUseCase } from '@application/use-cases/user/GetUsersUseCase';
import { GetUserByIdUseCase } from '@application/use-cases/user/GetUserByIdUseCase';
import { CreateUserUseCase } from '@application/use-cases/user/CreateUserUseCase';
import { UpdateUserUseCase } from '@application/use-cases/user/UpdateUserUseCase';
import { GetUserStatsUseCase } from '@application/use-cases/user/GetUserStatsUseCase';
import { AuthenticateUserUseCase } from '@application/use-cases/user/AuthenticateUserUseCase';
import { ManageUserFavoritesUseCase } from '@application/use-cases/user/ManageUserFavoritesUseCase';
import { GetUserOrderHistoryUseCase } from '@application/use-cases/user/GetUserOrderHistoryUseCase';
import { UpdateUserPasswordUseCase } from '@application/use-cases/user/UpdateUserPasswordUseCase';
import { UploadImageUseCase } from '@application/use-cases/image/UploadImageUseCase';

// Initialize container
const container = Container.getInstance();

// Custom scalar resolvers
const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: any) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'string') {
      return value;
    }
    throw new Error('GraphQL DateTime Scalar serializer expected a Date object or string');
  },
  parseValue(value: any) {
    if (typeof value === 'string') {
      return new Date(value);
    }
    throw new Error('GraphQL DateTime Scalar parser expected a string');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const decimalScalar = new GraphQLScalarType({
  name: 'Decimal',
  description: 'Decimal custom scalar type',
  serialize(value: any) {
    return parseFloat(value?.toString() || '0');
  },
  parseValue(value: any) {
    return parseFloat(value?.toString() || '0');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
      return parseFloat(ast.value);
    }
    return 0;
  },
});

const jsonScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value: any) {
    return value;
  },
  parseValue(value: any) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value);
      } catch {
        return null;
      }
    }
    return null;
  },
});

// Helper function to transform database entities to GraphQL format
const transformUserAddress = (address: any) => ({
  ...address,
  userId: address.userId,
  firstName: address.firstName,
  lastName: address.lastName,
  addressLine1: address.addressLine1,
  addressLine2: address.addressLine2,
  postalCode: address.postalCode,
  isDefault: Boolean(address.isDefault),
  createdAt: address.createdAt || new Date(),
  updatedAt: address.updatedAt || new Date(),
  fullName: `${address.firstName} ${address.lastName}`.trim(),
  fullAddress: [address.addressLine1, address.addressLine2, address.city, address.state, address.postalCode, address.country]
    .filter(Boolean)
    .join(', ')
});

const transformProduct = (product: any) => ({
  ...product,
  categoryId: product.category_id || '',
  salePrice: product.sale_price,
  stockQuantity: parseInt(product.stock_quantity) || 0, // Ensure integer value
  isActive: Boolean(product.is_active), // Ensure boolean value
  reviewCount: parseInt(product.review_count) || 0, // Ensure integer value
  createdAt: product.created_at || new Date(),
  updatedAt: product.updated_at || new Date(),
  // Relations - ensure arrays are never null
  variants: product.variants || [], // Ensure array is never null
  cartItems: product.cartItems || [], // Ensure array is never null
  favorites: product.favorites || [], // Ensure array is never null
  orderItems: product.orderItems || [], // Ensure array is never null
  // Computed fields
  currentPrice: product.sale_price || product.price || 0,
  hasDiscount: Boolean(product.sale_price && product.price && product.sale_price < product.price),
  discountPercentage: product.sale_price && product.price && product.price > 0 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0,
  totalStock: parseInt(product.stock_quantity) || 0,
  isInStock: (parseInt(product.stock_quantity) || 0) > 0,
});

const transformOrder = (order: any) => ({
  ...order,
  userId: order.user_id,
  orderNumber: order.order_number,
  taxAmount: order.tax_amount,
  shippingCost: order.shipping_cost,
  discountAmount: order.discount_amount,
  totalAmount: order.total_amount,
  shippingAddress: order.shipping_address,
  billingAddress: order.billing_address,
  trackingNumber: order.tracking_number,
  shippedAt: order.shipped_at,
  deliveredAt: order.delivered_at,
  createdAt: order.created_at,
  updatedAt: order.updated_at,
});

const transformUserProfile = (profile: any) => ({
  ...profile,
  userId: profile.user_id || profile.userId,
  firstName: profile.first_name || profile.firstName,
  lastName: profile.last_name || profile.lastName,
  birthDate: profile.birth_date || profile.birthDate,
  avatarUrl: profile.avatar_url || profile.avatarUrl,
  createdAt: profile.created_at || profile.createdAt,
  updatedAt: profile.updated_at || profile.updatedAt,
  // Computed field
  fullName: (profile.first_name || profile.firstName) && (profile.last_name || profile.lastName)
    ? `${profile.first_name || profile.firstName} ${profile.last_name || profile.lastName}`
    : (profile.first_name || profile.firstName) || (profile.last_name || profile.lastName) || '',
});

const transformUserAccount = (account: any) => ({
  id: account.id,
  userId: account.userId || account.user_id,
  provider: account.provider,
  providerAccountId: account.providerAccountId || account.provider_account_id,
  accessToken: account.accessToken || account.access_token,
  refreshToken: account.refreshToken || account.refresh_token,
  tokenType: account.tokenType || account.token_type,
  scope: account.scope,
  idToken: account.idToken || account.id_token,
  expiresAt: account.expiresAt || account.expires_at,
  createdAt: account.createdAt || account.created_at,
  updatedAt: account.updatedAt || account.updated_at,
});

const transformUserSession = (session: any) => ({
  id: session.id,
  userId: session.userId || session.user_id,
  sessionToken: session.sessionToken || session.session_token,
  accessToken: session.accessToken || session.access_token,
  refreshToken: session.refreshToken || session.refresh_token,
  expiresAt: session.expiresAt || session.expires_at,
  userAgent: session.userAgent || session.user_agent,
  ipAddress: session.ipAddress || session.ip_address,
  isActive: session.isActive !== undefined ? session.isActive : session.is_active !== undefined ? session.is_active : true,
  createdAt: session.createdAt || session.created_at,
  updatedAt: session.updatedAt || session.updated_at,
});

const transformUser = (user: any) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  isActive: user.isActive !== undefined ? user.isActive : user.is_active !== undefined ? user.is_active : true,
  emailVerified: user.emailVerified !== undefined ? user.emailVerified : user.email_verified !== undefined ? user.email_verified : false,
  lastLoginAt: user.lastLoginAt || user.last_login_at,
  createdAt: user.created_at || user.createdAt,
  updatedAt: user.updated_at || user.updatedAt,
  profile: user.profile ? transformUserProfile(user.profile) : null,
  addresses: user.addresses ? user.addresses.map(transformUserAddress) : [],
  accounts: user.accounts ? user.accounts.map(transformUserAccount) : [],
  sessions: user.sessions ? user.sessions.map(transformUserSession) : []
});

export const resolvers = {
  // Scalar types
  DateTime: dateTimeScalar,
  Decimal: decimalScalar,
  JSON: jsonScalar,

  Query: {
    health: () => 'GraphQL server is running with clean architecture!',

    // Product queries
    products: async (_: any, { filter, pagination }: any) => {
      try {
        const getProductsUseCase = container.get<GetProductsUseCase>('getProductsUseCase');
        
        const result = await getProductsUseCase.execute({
          filters: filter,
          pagination: pagination || { limit: 10, offset: 0 }
        });
        
        return {
          products: result.products.map(transformProduct),
          total: result.total,
          hasMore: result.hasMore
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch products: ${error.message || 'Unknown error'}`);
      }
    },

    product: async (_: any, { id }: { id: string }) => {
      try {
        if (!id) {
          throw new Error('Product ID is required');
        }
        const getProductByIdUseCase = container.get<GetProductByIdUseCase>('getProductByIdUseCase');
        const product = await getProductByIdUseCase.execute({ id });
        return product ? transformProduct(product) : null;
      } catch (error: any) {
        throw new Error(`Failed to fetch product: ${error.message || 'Unknown error'}`);
      }
    },

    productBySku: async (_: any, { sku }: { sku: string }) => {
      const getProductsUseCase = container.get<GetProductsUseCase>('getProductsUseCase');
      const result = await getProductsUseCase.execute({
        filters: { sku },
        pagination: { limit: 1, offset: 0 }
      });
      return result.products[0] ? transformProduct(result.products[0]) : null;
    },

    // Order queries
    orders: async (_: any, { filter, pagination }: any) => {
      const getOrdersUseCase = container.get<GetOrdersUseCase>('getOrdersUseCase');
      const result = await getOrdersUseCase.execute({
        filters: filter,
        pagination: pagination || { limit: 10, offset: 0 }
      });

      return {
        orders: result.orders.map(transformOrder),
        total: result.total,
        hasMore: result.hasMore
      };
    },

    order: async (_: any, { id }: { id: string }) => {
      const getOrderByIdUseCase = container.get<GetOrderByIdUseCase>('getOrderByIdUseCase');
      const order = await getOrderByIdUseCase.execute(id);
      return order ? transformOrder(order) : null;
    },

    orderByNumber: async (_: any, { orderNumber }: { orderNumber: string }) => {
      const getOrdersUseCase = container.get<GetOrdersUseCase>('getOrdersUseCase');
      const result = await getOrdersUseCase.execute({
        filters: { orderNumber },
        pagination: { limit: 1, offset: 0 }
      });
      return result.orders[0] ? transformOrder(result.orders[0]) : null;
    },

    // User queries
    users: async (_: any, { filter, pagination }: any) => {
      const getUsersUseCase = container.get<GetUsersUseCase>('getUsersUseCase');
      const result = await getUsersUseCase.execute({
        role: filter?.role,
        isActive: filter?.isActive,
        search: filter?.search,
        limit: pagination?.limit || 10,
        offset: pagination?.offset || 0
      });

      return {
        users: result.map(transformUser),
        total: result.length,
        hasMore: result.length === (pagination?.limit || 10)
      };
    },

    user: async (_: any, { id }: { id: string }) => {
      const getUserByIdUseCase = container.get<GetUserByIdUseCase>('getUserByIdUseCase');
      const user = await getUserByIdUseCase.execute(id);
      return user ? transformUser(user) : null;
    },

    userProfile: async (_: any, { userId }: { userId: string }) => {
      const getUserByIdUseCase = container.get<GetUserByIdUseCase>('getUserByIdUseCase');
      const user = await getUserByIdUseCase.execute(userId);
      return user?.profile ? transformUserProfile(user.profile) : null;
    },

    currentUser: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      const getUserByIdUseCase = container.get<GetUserByIdUseCase>('getUserByIdUseCase');
      const user = await getUserByIdUseCase.execute(context.user.id);
      return user ? transformUser(user) : null;
    },

    searchUsers: async (_: any, { query }: { query: string }) => {
      const getUsersUseCase = container.get<GetUsersUseCase>('getUsersUseCase');
      const users = await getUsersUseCase.execute({
        search: query,
        limit: 50,
        offset: 0
      });
      return users.map(transformUser);
    },

    activeUsers: async () => {
      const getUsersUseCase = container.get<GetUsersUseCase>('getUsersUseCase');
      const users = await getUsersUseCase.execute({
        isActive: true,
        limit: 100,
        offset: 0
      });
      return users.map(transformUser);
    },

    usersByRole: async (_: any, { role }: { role: string }) => {
      const getUsersUseCase = container.get<GetUsersUseCase>('getUsersUseCase');
      const users = await getUsersUseCase.execute({
        role,
        limit: 100,
        offset: 0
      });
      return users.map(transformUser);
    },

    usersByProvider: async (_: any, { provider }: { provider: string }) => {
      const getUsersUseCase = container.get<GetUsersUseCase>('getUsersUseCase');
      const users = await getUsersUseCase.execute({
        provider,
        limit: 100,
        offset: 0
      });
      return users.map(transformUser);
    },

    // Authentication queries
    userAccounts: async (_: any, { userId }: { userId: string }) => {
      // This would be implemented with proper repository
      return [];
    },

    userSessions: async (_: any, { userId }: { userId: string }) => {
      // This would be implemented with proper repository
      return [];
    },

    activeSessions: async (_: any, { userId }: { userId: string }) => {
      // This would be implemented with proper repository
      return [];
    },

    authProviderStats: async () => {
      // This would be implemented with proper use case
      return {
        totalUsers: 0,
        usersByProvider: [],
        activeSessionsCount: 0,
        recentLogins: []
      };
    },

    userOrderHistory: async (_: any, { userId, filter, pagination }: any) => {
      try {
        const getUserOrderHistoryUseCase = container.get<GetUserOrderHistoryUseCase>('getUserOrderHistoryUseCase');
        const result = await getUserOrderHistoryUseCase.execute({
          userId,
          ...filter,
          limit: pagination?.limit || 20,
          offset: pagination?.offset || 0
        });

        return {
          orders: result.orders.map(transformOrder),
          total: result.total,
          hasMore: result.hasMore,
          stats: {
            totalOrders: result.stats.totalOrders,
            totalSpent: result.stats.totalSpent,
            averageOrderValue: result.stats.averageOrderValue,
            lastOrderDate: result.stats.lastOrderDate,
            ordersByStatus: result.stats.ordersByStatus || {}
          }
        };
      } catch (error) {
        // Return empty response if use case is not available
        return {
          orders: [],
          total: 0,
          hasMore: false,
          stats: {
            totalOrders: 0,
            totalSpent: 0,
            averageOrderValue: 0,
            lastOrderDate: null,
            ordersByStatus: {}
          }
        };
      }
    },

    userFavoriteStats: async (_: any, { userId }: { userId: string }) => {
      try {
        const favoritesUseCase = container.get<ManageUserFavoritesUseCase>('manageUserFavoritesUseCase');
        const favorites = await favoritesUseCase.getUserFavorites(userId);
        const stats = await favoritesUseCase.getFavoriteStats(userId);

        return {
          totalFavorites: stats.totalFavorites,
          recentFavorites: favorites.slice(0, 10).map(fav => ({
            id: fav.id,
            userId: fav.userId,
            productId: fav.productId,
            createdAt: fav.createdAt
          })),
          favoriteCategories: [] // TODO: Implement category analysis
        };
      } catch (error) {
        return {
          totalFavorites: 0,
          recentFavorites: [],
          favoriteCategories: []
        };
      }
    },

    userActivitySummary: async (_: any, { userId }: { userId: string }) => {
      try {
        const getUserByIdUseCase = container.get<GetUserByIdUseCase>('getUserByIdUseCase');
        const user = await getUserByIdUseCase.execute(userId);
        
        if (!user) {
          throw new Error('User not found');
        }

        // Get recent orders
        const getUserOrderHistoryUseCase = container.get<GetUserOrderHistoryUseCase>('getUserOrderHistoryUseCase');
        const orderHistory = await getUserOrderHistoryUseCase.execute({
          userId,
          limit: 5,
          offset: 0
        });

        // Get favorites (as favorite products)
        const favoritesUseCase = container.get<ManageUserFavoritesUseCase>('manageUserFavoritesUseCase');
        const favorites = await favoritesUseCase.getUserFavorites(userId);

        return {
          recentOrders: orderHistory.orders.slice(0, 3).map(transformOrder),
          favoriteProducts: [], // TODO: Map favorites to products
          cartItemsCount: 0, // TODO: Get from cart service
          totalSpent: orderHistory.stats.totalSpent,
          joinDate: user.createdAt,
          lastActivity: user.updatedAt
        };
      } catch (error) {
        throw new Error(`Failed to get user activity summary: ${error.message}`);
      }
    },

    // Stats queries
    productStats: async () => {
      // This would be implemented with a dedicated use case
      return {
        totalProducts: 0,
        activeProducts: 0,
        totalCategories: 0
      };
    },

    orderStats: async () => {
      const getOrderStatsUseCase = container.get<GetOrderStatsUseCase>('getOrderStatsUseCase');
      return await getOrderStatsUseCase.execute();
    },

    userStats: async () => {
      const getUserStatsUseCase = container.get<GetUserStatsUseCase>('getUserStatsUseCase');
      return await getUserStatsUseCase.execute();
    },

    // User favorites and cart queries
    userFavorites: async (_: any, { userId }: { userId: string }) => {
      try {
        const favoritesUseCase = container.get<ManageUserFavoritesUseCase>('manageUserFavoritesUseCase');
        const favorites = await favoritesUseCase.getUserFavorites(userId);
        return favorites.map(fav => ({
          id: fav.id,
          userId: fav.userId,
          productId: fav.productId,
          createdAt: fav.createdAt
        }));
      } catch (error) {
        return [];
      }
    },

    isProductFavorited: async (_: any, { userId, productId }: { userId: string; productId: string }) => {
      try {
        const favoritesUseCase = container.get<ManageUserFavoritesUseCase>('manageUserFavoritesUseCase');
        const favorites = await favoritesUseCase.getUserFavorites(userId);
        return favorites.some(fav => fav.productId === productId);
      } catch (error) {
        return false;
      }
    },

    userOrders: async (_: any, { userId, pagination }: any) => {
      try {
        const getUserOrderHistoryUseCase = container.get<GetUserOrderHistoryUseCase>('getUserOrderHistoryUseCase');
        const result = await getUserOrderHistoryUseCase.execute({
          userId,
          limit: pagination?.limit || 20,
          offset: pagination?.offset || 0
        });

        return {
          orders: result.orders.map(transformOrder),
          total: result.total,
          hasMore: result.hasMore
        };
      } catch (error) {
        return { orders: [], total: 0, hasMore: false };
      }
    },

    // Address queries - implemented with user repository
    userAddresses: async (_: any, { userId }: { userId: string }) => {
      try {
        const getUserByIdUseCase = container.get<GetUserByIdUseCase>('getUserByIdUseCase');
        const user = await getUserByIdUseCase.execute(userId);
        return user?.addresses?.map(transformUserAddress) || [];
      } catch (error) {
        return [];
      }
    },

    userAddress: async (_: any, { id }: { id: string }) => {
      // This would need a dedicated getUserAddressById use case
      return null;
    },

    // Placeholder queries (to be implemented)
    categories: () => [],
    category: () => null,
    categoryBySlug: () => null,
    productsByCategory: () => ({ products: [], total: 0, hasMore: false }),
    productVariants: () => [],
    productVariant: () => null,
    userCart: () => [],
    cartItem: () => null,
    orderItems: () => [],
    userPaymentMethods: () => [],
    paymentMethod: () => null,
  },

  Mutation: {
    // Product mutations
    createProduct: async (_: any, { input }: { input: any }) => {
      const createProductUseCase = container.get<CreateProductUseCase>('createProductUseCase');
      const product = await createProductUseCase.execute({
        categoryId: input.categoryId,
        name: input.name,
        description: input.description,
        price: input.price,
        salePrice: input.salePrice,
        sku: input.sku,
        images: input.images || [],
        attributes: input.attributes || {},
        isActive: input.isActive !== false,
        stockQuantity: input.stockQuantity || 0,
        tags: input.tags || []
      });
      return transformProduct(product);
    },

    updateProduct: async (_: any, { id, input }: { id: string; input: any }) => {
      const updateProductUseCase = container.get<UpdateProductUseCase>('updateProductUseCase');
      const product = await updateProductUseCase.execute({
        id,
        categoryId: input.categoryId,
        name: input.name,
        description: input.description,
        price: input.price,
        salePrice: input.salePrice,
        sku: input.sku,
        images: input.images,
        attributes: input.attributes,
        isActive: input.isActive,
        stockQuantity: input.stockQuantity,
        tags: input.tags
      });
      return transformProduct(product);
    },

    deleteProduct: async (_: any, { id }: { id: string }) => {
      const deleteProductUseCase = container.get<DeleteProductUseCase>('deleteProductUseCase');
      await deleteProductUseCase.execute({ id });
      return { success: true, message: 'Product deleted successfully' };
    },

    // Order mutations
    createOrder: async (_: any, { input }: { input: any }) => {
      const createOrderUseCase = container.get<CreateOrderUseCase>('createOrderUseCase');
      const order = await createOrderUseCase.execute({
        customerEmail: input.customerEmail,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        items: input.items,
        shippingAddress: input.shippingAddress
      });
      return transformOrder(order);
    },

    updateOrder: async (_: any, { id, input }: { id: string; input: any }) => {
      const updateOrderUseCase = container.get<UpdateOrderUseCase>('updateOrderUseCase');
      const order = await updateOrderUseCase.execute(id, {
        status: input.status,
        customerEmail: input.customerEmail,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        deliveredAt: input.deliveredAt
      });
      return transformOrder(order);
    },

    updateOrderStatus: async (_: any, { id, status }: { id: string; status: string }) => {
      const updateOrderUseCase = container.get<UpdateOrderUseCase>('updateOrderUseCase');
      const order = await updateOrderUseCase.execute(id, { status: status as any });
      return transformOrder(order);
    },

    // User mutations
    createUser: async (_: any, { input }: { input: any }) => {
      const createUserUseCase = container.get<CreateUserUseCase>('createUserUseCase');
      const user = await createUserUseCase.execute({
        email: input.email,
        password: input.password,
        role: input.role,
        isActive: input.isActive !== undefined ? input.isActive : true,
        profile: input.profile ? {
          firstName: input.profile.firstName,
          lastName: input.profile.lastName,
          phone: input.profile.phone,
          birthDate: input.profile.birthDate
        } : undefined
      });
      return transformUser(user);
    },

    updateUser: async (_: any, { id, input }: { id: string; input: any }) => {
      const updateUserUseCase = container.get<UpdateUserUseCase>('updateUserUseCase');
      const user = await updateUserUseCase.execute(id, {
        email: input.email,
        role: input.role,
        isActive: input.isActive,
        profile: input.profile ? {
          firstName: input.profile.firstName,
          lastName: input.profile.lastName,
          phone: input.profile.phone,
          birthDate: input.profile.birthDate,
          avatarUrl: input.profile.avatarUrl
        } : undefined
      });
      return transformUser(user);
    },

    deleteUser: async (_: any, { id }: { id: string }) => {
      // This would be implemented with a delete use case
      return {
        success: true,
        message: 'User deleted successfully'
      };
    },

    activateUser: async (_: any, { id }: { id: string }) => {
      const updateUserUseCase = container.get<UpdateUserUseCase>('updateUserUseCase');
      const user = await updateUserUseCase.execute(id, { isActive: true });
      return transformUser(user);
    },

    deactivateUser: async (_: any, { id }: { id: string }) => {
      const updateUserUseCase = container.get<UpdateUserUseCase>('updateUserUseCase');
      const user = await updateUserUseCase.execute(id, { isActive: false });
      return transformUser(user);
    },

    // Authentication management mutations
    revokeUserSession: async (_: any, { sessionId }: { sessionId: string }) => {
      // This would be implemented with proper auth repository
      return {
        success: true,
        message: 'Sesión revocada exitosamente'
      };
    },

    revokeAllUserSessions: async (_: any, { userId }: { userId: string }) => {
      // This would be implemented with proper auth repository
      return {
        success: true,
        message: 'Todas las sesiones han sido revocadas'
      };
    },

    unlinkUserAccount: async (_: any, { accountId }: { accountId: string }) => {
      // This would be implemented with proper auth repository
      return {
        success: true,
        message: 'Cuenta desvinculada exitosamente'
      };
    },

    forcePasswordReset: async (_: any, { userId }: { userId: string }) => {
      // This would be implemented with proper auth repository
      return {
        success: true,
        message: 'Reset de contraseña forzado exitosamente'
      };
    },

    impersonateUser: async (_: any, { userId }: { userId: string }) => {
      // This would be implemented with proper auth repository - only for admin users
      return {
        success: true,
        user: null,
        accessToken: 'mock_impersonation_token',
        refreshToken: 'mock_refresh_token',
        message: 'Impersonación iniciada'
      };
    },

    createUserProfile: async (_: any, { input }: { input: any }) => {
      const createUserUseCase = container.get<CreateUserUseCase>('createUserUseCase');
      const user = await createUserUseCase.execute({
        email: input.email,
        password: input.password,
        role: input.role,
        profile: {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          birthDate: input.birthDate
        }
      });
      return user?.profile ? transformUserProfile(user.profile) : null;
    },

    updateUserProfile: async (_: any, { userId, input }: { userId: string; input: any }) => {
      const updateUserUseCase = container.get<UpdateUserUseCase>('updateUserUseCase');
      const user = await updateUserUseCase.execute(userId, {
        profile: {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          birthDate: input.birthDate,
          avatarUrl: input.avatarUrl
        }
      });
      return user?.profile ? transformUserProfile(user.profile) : null;
    },

    // Auth mutations
    registerUser: async (_: any, { input }: { input: any }) => {
      try {
        const createUserUseCase = container.get<CreateUserUseCase>('createUserUseCase');
        const user = await createUserUseCase.execute({
          email: input.email,
          password: input.password,
          profile: {
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
            birthDate: input.birthDate ? new Date(input.birthDate) : undefined
          }
        });

        return {
          success: true,
          user: transformUser(user),
          accessToken: 'mock_access_token', // This would be generated by JWT Auth
          refreshToken: 'mock_refresh_token', // This would be generated by JWT Auth
          message: 'User registered successfully'
        };
      } catch (error) {
        return {
          success: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          message: error.message || 'Registration failed'
        };
      }
    },

    loginUser: async (_: any, { input }: { input: any }) => {
      try {
        const authenticateUserUseCase = container.get<AuthenticateUserUseCase>('authenticateUserUseCase');
        const result = await authenticateUserUseCase.execute({
          email: input.email,
          password: input.password
        });

        return {
          success: true,
          user: transformUser(result.user),
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          message: 'Login successful'
        };
      } catch (error) {
        return {
          success: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          message: error.message || 'Login failed'
        };
      }
    },

    logoutUser: async () => {
      // In a real implementation, this would invalidate tokens
      return {
        success: true,
        message: 'Logout successful'
      };
    },

    refreshToken: async (_: any, { refreshToken }: { refreshToken: string }) => {
      // In a real implementation, this would validate and refresh tokens
      return {
        success: true,
        user: null,
        accessToken: 'new_mock_access_token',
        refreshToken: 'new_mock_refresh_token',
        message: 'Token refreshed successfully'
      };
    },

    // Password management mutations
    updateUserPassword: async (_: any, { input }: { input: any }) => {
      try {
        const updatePasswordUseCase = container.get<UpdateUserPasswordUseCase>('updateUserPasswordUseCase');
        await updatePasswordUseCase.execute({
          userId: input.userId || 'current_user_id', // Would come from context
          currentPassword: input.currentPassword,
          newPassword: input.newPassword,
          confirmPassword: input.confirmPassword
        });

        return {
          success: true,
          message: 'Password updated successfully'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Password update failed'
        };
      }
    },

    requestPasswordReset: async (_: any, { email }: { email: string }) => {
      try {
        const updatePasswordUseCase = container.get<UpdateUserPasswordUseCase>('updateUserPasswordUseCase');
        await updatePasswordUseCase.generatePasswordResetToken(email);

        return {
          success: true,
          message: 'Password reset email sent'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Password reset request failed'
        };
      }
    },

    resetPassword: async (_: any, { token, newPassword }: { token: string; newPassword: string }) => {
      try {
        const updatePasswordUseCase = container.get<UpdateUserPasswordUseCase>('updateUserPasswordUseCase');
        await updatePasswordUseCase.resetPasswordWithToken(token, newPassword);

        return {
          success: true,
          message: 'Password reset successfully'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Password reset failed'
        };
      }
    },

    // Address mutations
    createUserAddress: async (_: any, { input }: { input: any }) => {
      // This would need integration with user repository address methods
      return null; // Placeholder
    },

    updateUserAddress: async (_: any, { id, input }: { id: string; input: any }) => {
      // This would need integration with user repository address methods
      return null; // Placeholder
    },

    deleteUserAddress: async (_: any, { id }: { id: string }) => {
      // This would need integration with user repository address methods
      return { success: true, message: 'Address deleted successfully' };
    },

    setDefaultAddress: async (_: any, { userId, addressId }: { userId: string; addressId: string }) => {
      // This would need integration with user repository address methods
      return { success: true, message: 'Default address set successfully' };
    },

    // Favorites mutations
    addToFavorites: async (_: any, { input }: { input: any }) => {
      try {
        const favoritesUseCase = container.get<ManageUserFavoritesUseCase>('manageUserFavoritesUseCase');
        const favorite = await favoritesUseCase.addToFavorites({
          userId: input.userId,
          productId: input.productId
        });

        return {
          id: favorite.id,
          userId: favorite.userId,
          productId: favorite.productId,
          createdAt: favorite.createdAt
        };
      } catch (error) {
        throw new Error(`Failed to add to favorites: ${error.message}`);
      }
    },

    removeFromFavorites: async (_: any, { userId, productId }: { userId: string; productId: string }) => {
      try {
        const favoritesUseCase = container.get<ManageUserFavoritesUseCase>('manageUserFavoritesUseCase');
        await favoritesUseCase.removeFromFavorites({ userId, productId });

        return {
          success: true,
          message: 'Removed from favorites successfully'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Failed to remove from favorites'
        };
      }
    },

    toggleFavorite: async (_: any, { userId, productId }: { userId: string; productId: string }) => {
      try {
        const favoritesUseCase = container.get<ManageUserFavoritesUseCase>('manageUserFavoritesUseCase');
        const result = await favoritesUseCase.toggleFavorite(userId, productId);

        return {
          action: result.action,
          favorite: result.favorite ? {
            id: result.favorite.id,
            userId: result.favorite.userId,
            productId: result.favorite.productId,
            createdAt: result.favorite.createdAt
          } : null,
          message: `Product ${result.action} favorites successfully`
        };
      } catch (error) {
        throw new Error(`Failed to toggle favorite: ${error.message}`);
      }
    },

    deleteUserProfile: async (_: any, { userId }: { userId: string }) => {
      // This would use the user repository to soft delete
      return { success: true, message: 'User profile deleted successfully' };
    },

    // Image upload mutation (critical functionality)
    uploadImage: async (_: any, { file, entityType, entityId }: { file: any; entityType: string; entityId: string }) => {
      const uploadImageUseCase = container.get<UploadImageUseCase>('uploadImageUseCase');
      try {
        const result = await uploadImageUseCase.execute({
          file,
          entityType: entityType as any,
          entityId
        });
        return {
          success: true,
          url: result.url,
          filename: result.fileName || result.url,
          message: 'Image uploaded successfully'
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'Failed to upload image'
        };
      }
    },

    // Placeholder mutations (to be implemented)
    deleteUserProfile: () => ({ success: true, message: 'User profile deleted successfully' }),
    createUserAddress: () => null,
    updateUserAddress: () => null,
    deleteUserAddress: () => ({ success: true, message: 'Address deleted successfully' }),
    createCategory: () => null,
    updateCategory: () => null,
    deleteCategory: () => ({ success: true, message: 'Category deleted successfully' }),
    createProductVariant: () => null,
    updateProductVariant: () => null,
    deleteProductVariant: () => ({ success: true, message: 'Product variant deleted successfully' }),
    addToCart: () => null,
    updateCartItem: () => null,
    removeFromCart: () => ({ success: true, message: 'Item removed from cart' }),
    clearUserCart: () => ({ success: true, message: 'Cart cleared successfully' }),
    addToFavorites: () => null,
    removeFromFavorites: () => ({ success: true, message: 'Removed from favorites' }),
    cancelOrder: () => null,
    shipOrder: () => null,
    deliverOrder: () => null,
    createOrderItem: () => null,
    updateOrderItem: () => null,
    deleteOrderItem: () => ({ success: true, message: 'Order item deleted successfully' }),
    createPaymentMethod: () => null,
    updatePaymentMethod: () => null,
    deletePaymentMethod: () => ({ success: true, message: 'Payment method deleted successfully' }),
    bulkUpdateProducts: () => [],
    bulkUpdateOrderStatus: () => [],
  }
};