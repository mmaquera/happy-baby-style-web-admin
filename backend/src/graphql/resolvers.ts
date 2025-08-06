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

const transformUser = (user: any) => ({
  ...user,
  userId: user.user_id,
  firstName: user.first_name,
  lastName: user.last_name,
  birthDate: user.birth_date,
  avatarUrl: user.avatar_url,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
  // Computed field
  fullName: user.first_name && user.last_name 
    ? `${user.first_name} ${user.last_name}`
    : user.first_name || user.last_name || '',
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

    userProfile: async (_: any, { userId }: { userId: string }) => {
      const getUserByIdUseCase = container.get<GetUserByIdUseCase>('getUserByIdUseCase');
      const user = await getUserByIdUseCase.execute(userId);
      return user ? transformUser(user) : null;
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

    // Placeholder queries (to be implemented)
    categories: () => [],
    category: () => null,
    categoryBySlug: () => null,
    productsByCategory: () => ({ products: [], total: 0, hasMore: false }),
    productVariants: () => [],
    productVariant: () => null,
    userCart: () => [],
    cartItem: () => null,
    userFavorites: () => [],
    isProductFavorited: () => false,
    userOrders: () => ({ orders: [], total: 0, hasMore: false }),
    orderItems: () => [],
    userAddresses: () => [],
    userAddress: () => null,
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
      return transformUser(user);
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
      return transformUser(user);
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