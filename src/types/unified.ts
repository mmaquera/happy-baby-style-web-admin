// Unified Types - Resolves conflicts between local types and GraphQL generated types
// Following SOLID principles and Clean Architecture

import { User as GraphQLUser, Order as GraphQLOrder, OrderItem as GraphQLOrderItem, UserProfile as GraphQLUserProfile, UserRole as GraphQLUserRole, AuthProvider as GraphQLAuthProvider, OrderStatus as GraphQLOrderStatus } from '../generated/graphql';

// Re-export GraphQL types as the source of truth
export type {
  User as GraphQLUser,
  Order as GraphQLOrder,
  OrderItem as GraphQLOrderItem,
  UserProfile as GraphQLUserProfile
} from '../generated/graphql';

// Unified UserRole enum - using GraphQL as source of truth
export enum UserRole {
  admin = 'admin',
  customer = 'customer',
  staff = 'staff'
}

// Unified AuthProvider enum - using GraphQL as source of truth
export enum AuthProvider {
  google = 'google',
  facebook = 'facebook',
  apple = 'apple',
  email = 'email'
}

// Unified OrderStatus enum - using GraphQL as source of truth
export enum OrderStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  processing = 'processing',
  shipped = 'shipped',
  delivered = 'delivered',
  cancelled = 'cancelled',
  refunded = 'refunded'
}

// Unified User interface - explicitly defined to avoid conflicts
export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string | null;
  profile?: UserProfile | null;
  accounts?: UserAccount[];
  sessions?: UserSession[];
  createdAt: string;
  updatedAt: string;
}

// Unified UserProfile interface - explicitly defined
export interface UserProfile {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Unified Order interface
export interface Order {
  id: string;
  userId?: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: any;
  items?: OrderItem[];
  user?: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

// Unified OrderItem interface
export interface OrderItem {
  id: string;
  orderId?: string;
  productId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
  createdAt: Date;
}

// Unified ShippingAddress interface (defined locally as it was not in generated)
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface UserAccount {
  id: string;
  userId: string;
  provider: AuthProvider;
  providerAccountId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  tokenType?: string | null;
  scope?: string | null;
  idToken?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  userId: string;
  sessionToken: string;
  expiresAt: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  isActive: boolean;
  accessToken: string;
  refreshToken?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  category?: Category;
  variants?: ProductVariant[];
  images?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Input types for mutations
export interface CreateUserInput {
  email: string;
  password: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface CreateProfileForUserInput {
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  avatar?: string;
}

export interface UpdateUserInput {
  id: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
}

export interface UpdateProfileForUserInput {
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  avatar?: string;
}

// Type guards
export const isUserRole = (value: any): value is UserRole => {
  return Object.values(UserRole).includes(value);
};

export const isAuthProvider = (value: any): value is AuthProvider => {
  return Object.values(AuthProvider).includes(value);
};

export const isOrderStatus = (value: any): value is OrderStatus => {
  return Object.values(OrderStatus).includes(value);
};

// Conversion functions
export const convertGraphQLUserToUser = (graphqlUser: GraphQLUser): User => {
  return {
    id: graphqlUser.id,
    email: graphqlUser.email,
    role: convertGraphQLUserRoleToUserRole(graphqlUser.role),
    isActive: graphqlUser.isActive,
    emailVerified: graphqlUser.emailVerified,
    lastLoginAt: graphqlUser.lastLoginAt || null,
    profile: graphqlUser.profile ? convertGraphQLUserProfileToUserProfile(graphqlUser.profile) : null,
    accounts: graphqlUser.accounts?.map(convertGraphQLUserAccountToUserAccount) || [],
    sessions: graphqlUser.sessions?.map(convertGraphQLUserSessionToUserSession) || [],
    createdAt: graphqlUser.createdAt,
    updatedAt: graphqlUser.updatedAt
  };
};

export const convertGraphQLUserProfileToUserProfile = (graphqlProfile: GraphQLUserProfile): UserProfile => {
  return {
    id: graphqlProfile.id,
    firstName: graphqlProfile.firstName || null,
    lastName: graphqlProfile.lastName || null,
    phone: graphqlProfile.phone || null,
    dateOfBirth: graphqlProfile.dateOfBirth || null,
    avatar: graphqlProfile.avatar || null,
    createdAt: graphqlProfile.createdAt,
    updatedAt: graphqlProfile.updatedAt
  };
};

export const convertGraphQLOrderToOrder = (graphqlOrder: GraphQLOrder): Order => {
  return {
    id: graphqlOrder.id,
    userId: graphqlOrder.userId,
    status: convertGraphQLOrderStatusToOrderStatus(graphqlOrder.status),
    totalAmount: Number(graphqlOrder.totalAmount),
    shippingAddress: graphqlOrder.shippingAddress || {},
    items: graphqlOrder.items?.map(item => convertGraphQLOrderItemToOrderItem(item)) || [],
    ...(graphqlOrder.user && { user: convertGraphQLUserProfileToUserProfile(graphqlOrder.user) }),
    createdAt: new Date(graphqlOrder.createdAt),
    updatedAt: new Date(graphqlOrder.updatedAt)
  };
};

export const convertGraphQLOrderItemToOrderItem = (graphqlOrderItem: GraphQLOrderItem): OrderItem => {
  return {
    id: graphqlOrderItem.id,
    orderId: graphqlOrderItem.orderId,
    productId: graphqlOrderItem.productId,
    quantity: graphqlOrderItem.quantity,
    unitPrice: Number(graphqlOrderItem.unitPrice),
    totalPrice: Number(graphqlOrderItem.totalPrice),
    ...(graphqlOrderItem.product && { product: convertGraphQLProductToProduct(graphqlOrderItem.product) }),
    createdAt: new Date(graphqlOrderItem.createdAt)
  };
};

export const convertGraphQLProductToProduct = (graphqlProduct: any): Product => {
  return {
    id: graphqlProduct.id,
    name: graphqlProduct.name,
    description: graphqlProduct.description || undefined,
    price: Number(graphqlProduct.price),
    categoryId: graphqlProduct.categoryId || undefined,
    category: graphqlProduct.category || undefined,
    variants: graphqlProduct.variants || [],
    images: graphqlProduct.images || [],
    isActive: graphqlProduct.isActive,
    createdAt: new Date(graphqlProduct.createdAt),
    updatedAt: new Date(graphqlProduct.updatedAt)
  };
};

export const convertGraphQLUserRoleToUserRole = (graphqlRole: GraphQLUserRole): UserRole => {
  switch (graphqlRole) {
    case GraphQLUserRole.admin:
      return UserRole.admin;
    case GraphQLUserRole.customer:
      return UserRole.customer;
    case GraphQLUserRole.staff:
      return UserRole.staff;
    default:
      return UserRole.customer;
  }
};

export const convertGraphQLAuthProviderToAuthProvider = (graphqlProvider: GraphQLAuthProvider): AuthProvider => {
  switch (graphqlProvider) {
    case GraphQLAuthProvider.google:
      return AuthProvider.google;
    case GraphQLAuthProvider.facebook:
      return AuthProvider.facebook;
    case GraphQLAuthProvider.apple:
      return AuthProvider.apple;
    case GraphQLAuthProvider.email:
      return AuthProvider.email;
    default:
      return AuthProvider.email;
  }
};

export const convertGraphQLOrderStatusToOrderStatus = (graphqlStatus: GraphQLOrderStatus): OrderStatus => {
  switch (graphqlStatus) {
    case GraphQLOrderStatus.pending:
      return OrderStatus.pending;
    case GraphQLOrderStatus.confirmed:
      return OrderStatus.confirmed;
    case GraphQLOrderStatus.processing:
      return OrderStatus.processing;
    case GraphQLOrderStatus.shipped:
      return OrderStatus.shipped;
    case GraphQLOrderStatus.delivered:
      return OrderStatus.delivered;
    case GraphQLOrderStatus.cancelled:
      return OrderStatus.cancelled;
    case GraphQLOrderStatus.refunded:
      return OrderStatus.refunded;
    default:
      return OrderStatus.pending;
  }
};

export const convertGraphQLUserAccountToUserAccount = (graphqlAccount: any): UserAccount => {
  return {
    id: graphqlAccount.id,
    userId: graphqlAccount.userId,
    provider: convertGraphQLAuthProviderToAuthProvider(graphqlAccount.provider),
    providerAccountId: graphqlAccount.providerAccountId,
    accessToken: graphqlAccount.accessToken || null,
    refreshToken: graphqlAccount.refreshToken || null,
    tokenType: graphqlAccount.tokenType || null,
    scope: graphqlAccount.scope || null,
    idToken: graphqlAccount.idToken || null,
    expiresAt: graphqlAccount.expiresAt || null,
    createdAt: graphqlAccount.createdAt,
    updatedAt: graphqlAccount.updatedAt
  };
};

export const convertGraphQLUserSessionToUserSession = (graphqlSession: any): UserSession => {
  return {
    id: graphqlSession.id,
    userId: graphqlSession.userId,
    sessionToken: graphqlSession.sessionToken,
    expiresAt: graphqlSession.expiresAt,
    userAgent: graphqlSession.userAgent || undefined,
    ipAddress: graphqlSession.ipAddress || undefined,
    isActive: graphqlSession.isActive,
    accessToken: graphqlSession.accessToken,
    refreshToken: graphqlSession.refreshToken || undefined,
    createdAt: graphqlSession.createdAt,
    updatedAt: graphqlSession.updatedAt
  };
};
