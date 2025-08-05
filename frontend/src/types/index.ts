// Product Types
export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  images: string[];
  attributes: Record<string, any>;
  isActive: boolean;
  stockQuantity: number;
  tags?: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  
  // Relaciones
  category?: Category;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  size?: string;
  color?: string;
  sku: string;
  price?: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  id: string;
  userId?: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  billingAddress?: BillingAddress;
  notes?: string;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relaciones
  user?: UserProfile;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productSnapshot?: Record<string, any>;
  createdAt: string;
  
  // Relaciones
  product?: Product;
  variant?: ProductVariant;
}

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

export interface BillingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  birthDate?: Date;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAddress {
  id: string;
  userId: string;
  title: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  profile?: UserProfile;
  addresses?: UserAddress[];
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  STAFF = 'staff'
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role?: UserRole;
  profile?: {
    firstName: string;
    lastName: string;
    phone?: string;
    birthDate?: Date;
  };
}

export interface UpdateUserRequest {
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    birthDate?: Date;
    avatarUrl?: string;
  };
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: Record<UserRole, number>;
}

// Image Types
export interface Image {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  bucket: string;
  path: string;
  entityType: ImageEntityType;
  entityId: string;
  createdAt: string;
}

export enum ImageEntityType {
  PRODUCT = 'product',
  USER = 'user',
  CATEGORY = 'category'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
  errors?: ValidationError[];
  count?: number;
}

export interface ValidationError {
  field?: string;
  message: string;
  value?: any;
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

export const ORDER_STATUS_LABELS = {
  [OrderStatus.PENDING]: 'Pendiente',
  [OrderStatus.PAID]: 'Pagado',
  [OrderStatus.PROCESSING]: 'Procesando',
  [OrderStatus.SHIPPED]: 'Enviado',
  [OrderStatus.DELIVERED]: 'Entregado',
  [OrderStatus.CANCELLED]: 'Cancelado',
  [OrderStatus.REFUNDED]: 'Reembolsado'
};

export const ORDER_STATUS_COLORS = {
  [OrderStatus.PENDING]: '#FFA500',
  [OrderStatus.PAID]: '#4CAF50',
  [OrderStatus.PROCESSING]: '#2196F3',
  [OrderStatus.SHIPPED]: '#9C27B0',
  [OrderStatus.DELIVERED]: '#4CAF50',
  [OrderStatus.CANCELLED]: '#F44336',
  [OrderStatus.REFUNDED]: '#FF9800'
};