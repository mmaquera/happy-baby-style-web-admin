// Product Types - Using GraphQL generated types as base
import { 
  Product as GraphQLProduct, 
  ProductVariant as GraphQLProductVariant, 
  Category as GraphQLCategory,
  Order as GraphQLOrder,
  OrderItem as GraphQLOrderItem,
  User as GraphQLUser,
  UserProfile as GraphQLUserProfile,
  UserAddress as GraphQLUserAddress
} from '../generated/graphql';

// Re-export GraphQL types for direct use
export type {
  GraphQLProduct as Product,
  GraphQLProductVariant as ProductVariant,
  GraphQLCategory as Category,
  GraphQLOrder as Order,
  GraphQLOrderItem as OrderItem,
  GraphQLUser as User,
  GraphQLUserProfile as UserProfile,
  GraphQLUserAddress as UserAddress
};

// Additional local interfaces that extend or complement GraphQL types
export interface ProductWithExtras extends GraphQLProduct {
  // Additional properties not in GraphQL schema
  categoryId?: string;
  salePrice?: number;
}

export interface ProductVariantWithExtras extends GraphQLProductVariant {
  // Additional properties not in GraphQL schema
  size?: string;
  color?: string;
}

export interface CategoryWithExtras extends GraphQLCategory {
  // Additional properties not in GraphQL schema
  imageUrl?: string;
}

export interface OrderWithExtras extends GraphQLOrder {
  // Additional properties not in GraphQL schema
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderItemWithExtras extends GraphQLOrderItem {
  // Additional properties not in GraphQL schema
  variantId?: string;
  productSnapshot?: Record<string, any>;
}

export interface UserWithExtras extends GraphQLUser {
  // Additional properties not in GraphQL schema
  displayName?: string;
}

export interface UserProfileWithExtras extends GraphQLUserProfile {
  // Additional properties not in GraphQL schema
  birthDate?: string;
  avatarUrl?: string;
}

export interface UserAddressWithExtras extends GraphQLUserAddress {
  // Additional properties not in GraphQL schema
  title?: string;
  addressLine1?: string;
  addressLine2?: string;
}

// Auth interfaces
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  profile?: GraphQLUserProfile;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  birthDate?: string;
}

// Additional utility types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Form Types
export interface CreateProductForm {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  images?: string[];
  attributes?: Record<string, any>;
  stockQuantity: number;
  tags?: string[];
  isActive?: boolean;
}

export interface ProductFilters {
  categoryId?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// UI Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

// Constants - Basados en datos reales de la base de datos
export const PRODUCT_CATEGORIES = [
  { value: 'bfe12af6-883f-4c46-8032-a23fc56a483c', label: 'Bodysuits' },
  { value: '8377d4f9-5401-4b06-b2af-45a9b48fdc94', label: 'Pijamas' },
  { value: '6e2d110a-8664-4126-a6ed-a0bf0e6596c5', label: 'Conjuntos' },
  { value: '76dbe908-c937-4b5c-90fb-a900adef0cdc', label: 'Gorros' },
  { value: 'dbaab418-c029-43fd-b280-97afd31459c7', label: 'Calcetines' },
  { value: '8758b479-4e2f-46f5-8e9a-354dcb185cc3', label: 'Accesorios' }
];

export const PRODUCT_SIZES = [
  { value: 'recien_nacido', label: 'Recién Nacido' },
  { value: '3_meses', label: '3 Meses' },
  { value: '6_meses', label: '6 Meses' },
  { value: '9_meses', label: '9 Meses' },
  { value: '12_meses', label: '12 Meses' },
  { value: '18_meses', label: '18 Meses' },
  { value: '24_meses', label: '24 Meses' }
];

export const PRODUCT_COLORS = [
  { value: 'blanco', label: 'Blanco', hex: '#FFFFFF' },
  { value: 'rosa_suave', label: 'Rosa Suave', hex: '#F8BBD9' },
  { value: 'azul_cielo', label: 'Azul Cielo', hex: '#87CEEB' },
  { value: 'amarillo_pastel', label: 'Amarillo Pastel', hex: '#FDFD96' },
  { value: 'verde_menta', label: 'Verde Menta', hex: '#98FB98' },
  { value: 'gris_perla', label: 'Gris Perla', hex: '#E5E4E2' }
];

// Re-export GraphQL enums
export { OrderStatus, UserRole, AuthProvider } from '../generated/graphql';

export const ORDER_STATUS_LABELS = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado'
};

export const ORDER_STATUS_COLORS = {
  pending: '#FFA500',
  confirmed: '#4CAF50',
  processing: '#2196F3',
  shipped: '#9C27B0',
  delivered: '#4CAF50',
  cancelled: '#F44336',
  refunded: '#FF9800'
};