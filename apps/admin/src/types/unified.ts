// Unified Types - Resolves conflicts between local types and GraphQL generated types
// Following SOLID principles and Clean Architecture

// Re-export GraphQL types as the source of truth
export type {
  User as GraphQLUser,
  Order as GraphQLOrder,
  OrderItem as GraphQLOrderItem,
  UserProfile as GraphQLUserProfile,
} from '../generated/graphql';

// Unified UserRole enum - using GraphQL as source of truth
export enum UserRole {
  admin = 'admin',
  customer = 'customer',
  staff = 'staff',
}

// Unified AuthProvider enum - using GraphQL as source of truth
export enum AuthProvider {
  google = 'google',
  facebook = 'facebook',
  apple = 'apple',
  email = 'email',
}

// Unified OrderStatus enum - using GraphQL as source of truth
export enum OrderStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  processing = 'processing',
  shipped = 'shipped',
  delivered = 'delivered',
  cancelled = 'cancelled',
  refunded = 'refunded',
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

// Unified Order interface
export interface Order {
  id: string;
  userId?: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: ShippingAddress | Record<string, unknown>;
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
