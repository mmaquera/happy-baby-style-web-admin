import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  Decimal: { input: number; output: number; }
  JSON: { input: any; output: any; }
  Upload: { input: File; output: File; }
};

export type AddToCartInput = {
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  userId: Scalars['ID']['input'];
  variantId?: InputMaybe<Scalars['ID']['input']>;
};

export type AddToFavoritesInput = {
  productId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  token: Scalars['String']['output'];
  user: UserProfile;
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  products: Array<Product>;
  slug: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateOrderInput = {
  billingAddress?: InputMaybe<Scalars['JSON']['input']>;
  discountAmount?: InputMaybe<Scalars['Decimal']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  orderNumber: Scalars['String']['input'];
  shippingAddress: Scalars['JSON']['input'];
  shippingCost?: InputMaybe<Scalars['Decimal']['input']>;
  subtotal: Scalars['Decimal']['input'];
  taxAmount?: InputMaybe<Scalars['Decimal']['input']>;
  totalAmount: Scalars['Decimal']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateOrderItemInput = {
  orderId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
  productSnapshot?: InputMaybe<Scalars['JSON']['input']>;
  quantity: Scalars['Int']['input'];
  totalPrice: Scalars['Decimal']['input'];
  unitPrice: Scalars['Decimal']['input'];
  variantId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateProductInput = {
  attributes?: InputMaybe<Scalars['JSON']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Decimal']['input'];
  salePrice?: InputMaybe<Scalars['Decimal']['input']>;
  sku: Scalars['String']['input'];
  stockQuantity?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateProductVariantInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  productId: Scalars['ID']['input'];
  size?: InputMaybe<Scalars['String']['input']>;
  sku: Scalars['String']['input'];
  stockQuantity: Scalars['Int']['input'];
};

export type CreateUserAddressInput = {
  addressLine1: Scalars['String']['input'];
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  country?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
  title: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateUserProfileInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addToCart: ShoppingCart;
  addToFavorites: UserFavorite;
  bulkUpdateOrderStatus: Array<Order>;
  bulkUpdateProducts: Array<Product>;
  cancelOrder: Order;
  clearUserCart: SuccessResponse;
  createCategory: Category;
  createOrder: Order;
  createOrderItem: OrderItem;
  createPaymentMethod: PaymentMethod;
  createProduct: Product;
  createProductVariant: ProductVariant;
  createUserAddress: UserAddress;
  createUserProfile: UserProfile;
  deleteCategory: SuccessResponse;
  deleteOrderItem: SuccessResponse;
  deletePaymentMethod: SuccessResponse;
  deleteProduct: SuccessResponse;
  deleteProductVariant: SuccessResponse;
  deleteUserAddress: SuccessResponse;
  deleteUserProfile: SuccessResponse;
  deliverOrder: Order;
  removeFromCart: SuccessResponse;
  removeFromFavorites: SuccessResponse;
  shipOrder: Order;
  updateCartItem: ShoppingCart;
  updateCategory: Category;
  updateOrder: Order;
  updateOrderItem: OrderItem;
  updateOrderStatus: Order;
  updatePaymentMethod: PaymentMethod;
  updateProduct: Product;
  updateProductVariant: ProductVariant;
  updateUserAddress: UserAddress;
  updateUserProfile: UserProfile;
  uploadImage: UploadResponse;
};


export type MutationAddToCartArgs = {
  input: AddToCartInput;
};


export type MutationAddToFavoritesArgs = {
  input: AddToFavoritesInput;
};


export type MutationBulkUpdateOrderStatusArgs = {
  orders: Array<Scalars['ID']['input']>;
  status: OrderStatus;
};


export type MutationBulkUpdateProductsArgs = {
  updates: Array<UpdateProductInput>;
};


export type MutationCancelOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationClearUserCartArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreateOrderItemArgs = {
  input: CreateOrderItemInput;
};


export type MutationCreatePaymentMethodArgs = {
  lastFour?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  type: PaymentMethodType;
  userId: Scalars['ID']['input'];
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateProductVariantArgs = {
  input: CreateProductVariantInput;
};


export type MutationCreateUserAddressArgs = {
  input: CreateUserAddressInput;
};


export type MutationCreateUserProfileArgs = {
  input: CreateUserProfileInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrderItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePaymentMethodArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductVariantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserAddressArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserProfileArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationDeliverOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveFromCartArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveFromFavoritesArgs = {
  productId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationShipOrderArgs = {
  id: Scalars['ID']['input'];
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateCartItemArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCartItemInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCategoryInput;
};


export type MutationUpdateOrderArgs = {
  id: Scalars['ID']['input'];
  input: UpdateOrderInput;
};


export type MutationUpdateOrderItemArgs = {
  id: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  unitPrice: Scalars['Decimal']['input'];
};


export type MutationUpdateOrderStatusArgs = {
  id: Scalars['ID']['input'];
  status: OrderStatus;
};


export type MutationUpdatePaymentMethodArgs = {
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductInput;
};


export type MutationUpdateProductVariantArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductVariantInput;
};


export type MutationUpdateUserAddressArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserAddressInput;
};


export type MutationUpdateUserProfileArgs = {
  input: UpdateUserProfileInput;
  userId: Scalars['ID']['input'];
};


export type MutationUploadImageArgs = {
  entityId: Scalars['String']['input'];
  entityType: Scalars['String']['input'];
  file: Scalars['Upload']['input'];
};

export type Order = {
  __typename?: 'Order';
  billingAddress?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  discountAmount: Scalars['Decimal']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  orderItems: Array<OrderItem>;
  orderNumber: Scalars['String']['output'];
  shippedAt?: Maybe<Scalars['DateTime']['output']>;
  shippingAddress: Scalars['JSON']['output'];
  shippingCost: Scalars['Decimal']['output'];
  status: OrderStatus;
  subtotal: Scalars['Decimal']['output'];
  taxAmount: Scalars['Decimal']['output'];
  totalAmount: Scalars['Decimal']['output'];
  trackingNumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<UserProfile>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type OrderFilterInput = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<OrderStatus>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  order?: Maybe<Order>;
  orderId?: Maybe<Scalars['ID']['output']>;
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['ID']['output']>;
  productSnapshot?: Maybe<Scalars['JSON']['output']>;
  quantity: Scalars['Int']['output'];
  totalPrice: Scalars['Decimal']['output'];
  unitPrice: Scalars['Decimal']['output'];
  variant?: Maybe<ProductVariant>;
  variantId?: Maybe<Scalars['ID']['output']>;
};

export enum OrderStatus {
  cancelled = 'cancelled',
  delivered = 'delivered',
  paid = 'paid',
  pending = 'pending',
  processing = 'processing',
  refunded = 'refunded',
  shipped = 'shipped'
}

export type PaginatedOrders = {
  __typename?: 'PaginatedOrders';
  hasMore: Scalars['Boolean']['output'];
  orders: Array<Order>;
  total: Scalars['Int']['output'];
};

export type PaginatedProducts = {
  __typename?: 'PaginatedProducts';
  hasMore: Scalars['Boolean']['output'];
  products: Array<Product>;
  total: Scalars['Int']['output'];
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  hasMore: Scalars['Boolean']['output'];
  total: Scalars['Int']['output'];
  users: Array<UserProfile>;
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDefault: Scalars['Boolean']['output'];
  lastFour?: Maybe<Scalars['String']['output']>;
  metadata: Scalars['JSON']['output'];
  provider?: Maybe<Scalars['String']['output']>;
  type: PaymentMethodType;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<UserProfile>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export enum PaymentMethodType {
  bank_transfer = 'bank_transfer',
  cash_on_delivery = 'cash_on_delivery',
  credit_card = 'credit_card',
  debit_card = 'debit_card',
  paypal = 'paypal'
}

export type Product = {
  __typename?: 'Product';
  attributes: Scalars['JSON']['output'];
  cartItems: Array<ShoppingCart>;
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currentPrice: Scalars['Decimal']['output'];
  description?: Maybe<Scalars['String']['output']>;
  discountPercentage: Scalars['Int']['output'];
  favorites: Array<UserFavorite>;
  hasDiscount: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  images: Array<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isInStock: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  orderItems: Array<OrderItem>;
  price: Scalars['Decimal']['output'];
  rating: Scalars['Decimal']['output'];
  reviewCount: Scalars['Int']['output'];
  salePrice?: Maybe<Scalars['Decimal']['output']>;
  sku: Scalars['String']['output'];
  stockQuantity: Scalars['Int']['output'];
  tags: Array<Scalars['String']['output']>;
  totalStock: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variants: Array<ProductVariant>;
};

export type ProductFilterInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  inStock?: InputMaybe<Scalars['Boolean']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maxPrice?: InputMaybe<Scalars['Decimal']['input']>;
  minPrice?: InputMaybe<Scalars['Decimal']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ProductVariant = {
  __typename?: 'ProductVariant';
  cartItems: Array<ShoppingCart>;
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isInStock: Scalars['Boolean']['output'];
  orderItems: Array<OrderItem>;
  price?: Maybe<Scalars['Decimal']['output']>;
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['ID']['output']>;
  size?: Maybe<Scalars['String']['output']>;
  sku: Scalars['String']['output'];
  stockQuantity: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  cartItem?: Maybe<ShoppingCart>;
  categories: Array<Category>;
  category?: Maybe<Category>;
  categoryBySlug?: Maybe<Category>;
  health: Scalars['String']['output'];
  isProductFavorited: Scalars['Boolean']['output'];
  order?: Maybe<Order>;
  orderByNumber?: Maybe<Order>;
  orderItems: Array<OrderItem>;
  orderStats: Scalars['JSON']['output'];
  orders: PaginatedOrders;
  paymentMethod?: Maybe<PaymentMethod>;
  product?: Maybe<Product>;
  productBySku?: Maybe<Product>;
  productStats: Scalars['JSON']['output'];
  productVariant?: Maybe<ProductVariant>;
  productVariants: Array<ProductVariant>;
  products: PaginatedProducts;
  productsByCategory: PaginatedProducts;
  userAddress?: Maybe<UserAddress>;
  userAddresses: Array<UserAddress>;
  userCart: Array<ShoppingCart>;
  userFavorites: Array<UserFavorite>;
  userOrders: PaginatedOrders;
  userPaymentMethods: Array<PaymentMethod>;
  userProfile?: Maybe<UserProfile>;
  userStats: Scalars['JSON']['output'];
  users: PaginatedUsers;
};


export type QueryCartItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCategoryBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryIsProductFavoritedArgs = {
  productId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type QueryOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrderByNumberArgs = {
  orderNumber: Scalars['String']['input'];
};


export type QueryOrderItemsArgs = {
  orderId: Scalars['ID']['input'];
};


export type QueryOrdersArgs = {
  filter?: InputMaybe<OrderFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryPaymentMethodArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductBySkuArgs = {
  sku: Scalars['String']['input'];
};


export type QueryProductVariantArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductVariantsArgs = {
  productId: Scalars['ID']['input'];
};


export type QueryProductsArgs = {
  filter?: InputMaybe<ProductFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryProductsByCategoryArgs = {
  categoryId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryUserAddressArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserAddressesArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserCartArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserFavoritesArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserOrdersArgs = {
  pagination?: InputMaybe<PaginationInput>;
  userId: Scalars['ID']['input'];
};


export type QueryUserPaymentMethodsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserProfileArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};

export type ShoppingCart = {
  __typename?: 'ShoppingCart';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['ID']['output']>;
  quantity: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<UserProfile>;
  userId?: Maybe<Scalars['ID']['output']>;
  variant?: Maybe<ProductVariant>;
  variantId?: Maybe<Scalars['ID']['output']>;
};

export type SuccessResponse = {
  __typename?: 'SuccessResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UpdateCartItemInput = {
  quantity: Scalars['Int']['input'];
};

export type UpdateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateOrderInput = {
  deliveredAt?: InputMaybe<Scalars['DateTime']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  shippedAt?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<OrderStatus>;
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  attributes?: InputMaybe<Scalars['JSON']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  salePrice?: InputMaybe<Scalars['Decimal']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  stockQuantity?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateProductVariantInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  size?: InputMaybe<Scalars['String']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  stockQuantity?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateUserAddressInput = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserProfileInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UploadResponse = {
  __typename?: 'UploadResponse';
  filename?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type UserAddress = {
  __typename?: 'UserAddress';
  addressLine1: Scalars['String']['output'];
  addressLine2?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  firstName: Scalars['String']['output'];
  fullAddress: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserProfile;
  userId: Scalars['ID']['output'];
};

export type UserFavorite = {
  __typename?: 'UserFavorite';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['ID']['output']>;
  user?: Maybe<UserProfile>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type UserFilterInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<UserRole>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type UserProfile = {
  __typename?: 'UserProfile';
  addresses: Array<UserAddress>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  birthDate?: Maybe<Scalars['DateTime']['output']>;
  cartItems: Array<ShoppingCart>;
  createdAt: Scalars['DateTime']['output'];
  favorites: Array<UserFavorite>;
  firstName?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  orders: Array<Order>;
  paymentMethods: Array<PaymentMethod>;
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export enum UserRole {
  admin = 'admin',
  customer = 'customer',
  staff = 'staff'
}

export type OrderBasicFragment = { __typename?: 'Order', id: string, userId?: string | null, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingCost: number, discountAmount: number, totalAmount: number, notes?: string | null, trackingNumber?: string | null, shippedAt?: string | null, deliveredAt?: string | null, createdAt: string, updatedAt: string };

export type OrderFullFragment = { __typename?: 'Order', shippingAddress: any, billingAddress?: any | null, id: string, userId?: string | null, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingCost: number, discountAmount: number, totalAmount: number, notes?: string | null, trackingNumber?: string | null, shippedAt?: string | null, deliveredAt?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'UserProfile', id: string, firstName?: string | null, lastName?: string | null, fullName?: string | null } | null, orderItems: Array<{ __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, productSnapshot?: any | null, product?: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string> } | null, variant?: { __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null, sku: string } | null }> };

export type GetOrdersQueryVariables = Exact<{
  filter?: InputMaybe<OrderFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetOrdersQuery = { __typename?: 'Query', orders: { __typename?: 'PaginatedOrders', total: number, hasMore: boolean, orders: Array<{ __typename?: 'Order', shippingAddress: any, billingAddress?: any | null, id: string, userId?: string | null, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingCost: number, discountAmount: number, totalAmount: number, notes?: string | null, trackingNumber?: string | null, shippedAt?: string | null, deliveredAt?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'UserProfile', id: string, firstName?: string | null, lastName?: string | null, fullName?: string | null } | null, orderItems: Array<{ __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, productSnapshot?: any | null, product?: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string> } | null, variant?: { __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null, sku: string } | null }> }> } };

export type GetOrderQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOrderQuery = { __typename?: 'Query', order?: { __typename?: 'Order', shippingAddress: any, billingAddress?: any | null, id: string, userId?: string | null, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingCost: number, discountAmount: number, totalAmount: number, notes?: string | null, trackingNumber?: string | null, shippedAt?: string | null, deliveredAt?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'UserProfile', id: string, firstName?: string | null, lastName?: string | null, fullName?: string | null } | null, orderItems: Array<{ __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, productSnapshot?: any | null, product?: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string> } | null, variant?: { __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null, sku: string } | null }> } | null };

export type GetOrderByNumberQueryVariables = Exact<{
  orderNumber: Scalars['String']['input'];
}>;


export type GetOrderByNumberQuery = { __typename?: 'Query', orderByNumber?: { __typename?: 'Order', shippingAddress: any, billingAddress?: any | null, id: string, userId?: string | null, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingCost: number, discountAmount: number, totalAmount: number, notes?: string | null, trackingNumber?: string | null, shippedAt?: string | null, deliveredAt?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'UserProfile', id: string, firstName?: string | null, lastName?: string | null, fullName?: string | null } | null, orderItems: Array<{ __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, productSnapshot?: any | null, product?: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string> } | null, variant?: { __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null, sku: string } | null }> } | null };

export type GetOrderStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrderStatsQuery = { __typename?: 'Query', orderStats: any };

export type CreateOrderMutationVariables = Exact<{
  input: CreateOrderInput;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder: { __typename?: 'Order', shippingAddress: any, billingAddress?: any | null, id: string, userId?: string | null, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingCost: number, discountAmount: number, totalAmount: number, notes?: string | null, trackingNumber?: string | null, shippedAt?: string | null, deliveredAt?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'UserProfile', id: string, firstName?: string | null, lastName?: string | null, fullName?: string | null } | null, orderItems: Array<{ __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, productSnapshot?: any | null, product?: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string> } | null, variant?: { __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null, sku: string } | null }> } };

export type UpdateOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateOrderInput;
}>;


export type UpdateOrderMutation = { __typename?: 'Mutation', updateOrder: { __typename?: 'Order', shippingAddress: any, billingAddress?: any | null, id: string, userId?: string | null, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingCost: number, discountAmount: number, totalAmount: number, notes?: string | null, trackingNumber?: string | null, shippedAt?: string | null, deliveredAt?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'UserProfile', id: string, firstName?: string | null, lastName?: string | null, fullName?: string | null } | null, orderItems: Array<{ __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, productSnapshot?: any | null, product?: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string> } | null, variant?: { __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null, sku: string } | null }> } };

export type UpdateOrderStatusMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  status: OrderStatus;
}>;


export type UpdateOrderStatusMutation = { __typename?: 'Mutation', updateOrderStatus: { __typename?: 'Order', id: string, userId?: string | null, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingCost: number, discountAmount: number, totalAmount: number, notes?: string | null, trackingNumber?: string | null, shippedAt?: string | null, deliveredAt?: string | null, createdAt: string, updatedAt: string } };

export type ProductBasicFragment = { __typename?: 'Product', id: string, name: string, price: number, currentPrice: number, hasDiscount: boolean, discountPercentage: number, sku: string, images: Array<string>, isActive: boolean, isInStock: boolean, stockQuantity: number, rating: number, reviewCount: number, createdAt: string, updatedAt: string };

export type ProductFullFragment = { __typename?: 'Product', description?: string | null, salePrice?: number | null, attributes: any, tags: Array<string>, totalStock: number, id: string, name: string, price: number, currentPrice: number, hasDiscount: boolean, discountPercentage: number, sku: string, images: Array<string>, isActive: boolean, isInStock: boolean, stockQuantity: number, rating: number, reviewCount: number, createdAt: string, updatedAt: string, category?: { __typename?: 'Category', id: string, name: string, slug: string } | null, variants: Array<{ __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null, sku: string, price?: number | null, stockQuantity: number, isActive: boolean, isInStock: boolean }> };

export type GetProductsQueryVariables = Exact<{
  filter?: InputMaybe<ProductFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetProductsQuery = { __typename?: 'Query', products: { __typename?: 'PaginatedProducts', total: number, hasMore: boolean, products: Array<{ __typename?: 'Product', description?: string | null, salePrice?: number | null, attributes: any, tags: Array<string>, totalStock: number, id: string, name: string, price: number, currentPrice: number, hasDiscount: boolean, discountPercentage: number, sku: string, images: Array<string>, isActive: boolean, isInStock: boolean, stockQuantity: number, rating: number, reviewCount: number, createdAt: string, updatedAt: string, category?: { __typename?: 'Category', id: string, name: string, slug: string } | null, variants: Array<{ __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null, sku: string, price?: number | null, stockQuantity: number, isActive: boolean, isInStock: boolean }> }> } };

export type GetProductQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', description?: string | null, salePrice?: number | null, attributes: any, tags: Array<string>, totalStock: number, id: string, name: string, price: number, currentPrice: number, hasDiscount: boolean, discountPercentage: number, sku: string, images: Array<string>, isActive: boolean, isInStock: boolean, stockQuantity: number, rating: number, reviewCount: number, createdAt: string, updatedAt: string, category?: { __typename?: 'Category', id: string, name: string, slug: string } | null, variants: Array<{ __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null, sku: string, price?: number | null, stockQuantity: number, isActive: boolean, isInStock: boolean }> } | null };

export type GetProductBySkuQueryVariables = Exact<{
  sku: Scalars['String']['input'];
}>;


export type GetProductBySkuQuery = { __typename?: 'Query', productBySku?: { __typename?: 'Product', description?: string | null, salePrice?: number | null, attributes: any, tags: Array<string>, totalStock: number, id: string, name: string, price: number, currentPrice: number, hasDiscount: boolean, discountPercentage: number, sku: string, images: Array<string>, isActive: boolean, isInStock: boolean, stockQuantity: number, rating: number, reviewCount: number, createdAt: string, updatedAt: string, category?: { __typename?: 'Category', id: string, name: string, slug: string } | null, variants: Array<{ __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null, sku: string, price?: number | null, stockQuantity: number, isActive: boolean, isInStock: boolean }> } | null };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'Product', description?: string | null, salePrice?: number | null, attributes: any, tags: Array<string>, totalStock: number, id: string, name: string, price: number, currentPrice: number, hasDiscount: boolean, discountPercentage: number, sku: string, images: Array<string>, isActive: boolean, isInStock: boolean, stockQuantity: number, rating: number, reviewCount: number, createdAt: string, updatedAt: string, category?: { __typename?: 'Category', id: string, name: string, slug: string } | null, variants: Array<{ __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null, sku: string, price?: number | null, stockQuantity: number, isActive: boolean, isInStock: boolean }> } };

export type UpdateProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct: { __typename?: 'Product', description?: string | null, salePrice?: number | null, attributes: any, tags: Array<string>, totalStock: number, id: string, name: string, price: number, currentPrice: number, hasDiscount: boolean, discountPercentage: number, sku: string, images: Array<string>, isActive: boolean, isInStock: boolean, stockQuantity: number, rating: number, reviewCount: number, createdAt: string, updatedAt: string, category?: { __typename?: 'Category', id: string, name: string, slug: string } | null, variants: Array<{ __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null, sku: string, price?: number | null, stockQuantity: number, isActive: boolean, isInStock: boolean }> } };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type UploadImageMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
  entityType: Scalars['String']['input'];
  entityId: Scalars['String']['input'];
}>;


export type UploadImageMutation = { __typename?: 'Mutation', uploadImage: { __typename?: 'UploadResponse', success: boolean, url?: string | null, filename?: string | null, message: string } };

export type GetUsersQueryVariables = Exact<{
  filter?: InputMaybe<UserFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetUsersQuery = { __typename?: 'Query', users: { __typename?: 'PaginatedUsers', total: number, hasMore: boolean, users: Array<{ __typename?: 'UserProfile', id: string, userId: string, firstName?: string | null, lastName?: string | null, phone?: string | null, birthDate?: string | null, avatarUrl?: string | null, createdAt: string, updatedAt: string }> } };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', userProfile?: { __typename?: 'UserProfile', id: string, userId: string, firstName?: string | null, lastName?: string | null, phone?: string | null, birthDate?: string | null, avatarUrl?: string | null, createdAt: string, updatedAt: string } | null };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserProfileInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUserProfile: { __typename?: 'UserProfile', id: string, userId: string, firstName?: string | null, lastName?: string | null, phone?: string | null, birthDate?: string | null, avatarUrl?: string | null, createdAt: string, updatedAt: string } };

export type UpdateUserMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  input: UpdateUserProfileInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUserProfile: { __typename?: 'UserProfile', id: string, userId: string, firstName?: string | null, lastName?: string | null, phone?: string | null, birthDate?: string | null, avatarUrl?: string | null, createdAt: string, updatedAt: string } };

export type UserProfileBasicFragment = { __typename?: 'UserProfile', id: string, userId: string, firstName?: string | null, lastName?: string | null, fullName?: string | null, phone?: string | null, birthDate?: string | null, avatarUrl?: string | null, createdAt: string, updatedAt: string };

export type UserProfileFullFragment = { __typename?: 'UserProfile', id: string, userId: string, firstName?: string | null, lastName?: string | null, fullName?: string | null, phone?: string | null, birthDate?: string | null, avatarUrl?: string | null, createdAt: string, updatedAt: string, addresses: Array<{ __typename?: 'UserAddress', id: string, title: string, firstName: string, lastName: string, fullName: string, fullAddress: string, isDefault: boolean }>, orders: Array<{ __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, totalAmount: number, createdAt: string }>, cartItems: Array<{ __typename?: 'ShoppingCart', id: string, quantity: number, product?: { __typename?: 'Product', id: string, name: string, currentPrice: number, images: Array<string> } | null, variant?: { __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null } | null }>, favorites: Array<{ __typename?: 'UserFavorite', id: string, product?: { __typename?: 'Product', id: string, name: string, currentPrice: number, images: Array<string> } | null }> };

export type GetUserProfileQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserProfileQuery = { __typename?: 'Query', userProfile?: { __typename?: 'UserProfile', id: string, userId: string, firstName?: string | null, lastName?: string | null, fullName?: string | null, phone?: string | null, birthDate?: string | null, avatarUrl?: string | null, createdAt: string, updatedAt: string, addresses: Array<{ __typename?: 'UserAddress', id: string, title: string, firstName: string, lastName: string, fullName: string, fullAddress: string, isDefault: boolean }>, orders: Array<{ __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, totalAmount: number, createdAt: string }>, cartItems: Array<{ __typename?: 'ShoppingCart', id: string, quantity: number, product?: { __typename?: 'Product', id: string, name: string, currentPrice: number, images: Array<string> } | null, variant?: { __typename?: 'ProductVariant', id: string, size?: string | null, color?: string | null } | null }>, favorites: Array<{ __typename?: 'UserFavorite', id: string, product?: { __typename?: 'Product', id: string, name: string, currentPrice: number, images: Array<string> } | null }> } | null };

export type GetUserStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserStatsQuery = { __typename?: 'Query', userStats: any };

export type CreateUserProfileMutationVariables = Exact<{
  input: CreateUserProfileInput;
}>;


export type CreateUserProfileMutation = { __typename?: 'Mutation', createUserProfile: { __typename?: 'UserProfile', id: string, userId: string, firstName?: string | null, lastName?: string | null, fullName?: string | null, phone?: string | null, birthDate?: string | null, avatarUrl?: string | null, createdAt: string, updatedAt: string } };

export type UpdateUserProfileMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  input: UpdateUserProfileInput;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateUserProfile: { __typename?: 'UserProfile', id: string, userId: string, firstName?: string | null, lastName?: string | null, fullName?: string | null, phone?: string | null, birthDate?: string | null, avatarUrl?: string | null, createdAt: string, updatedAt: string } };

export const OrderBasicFragmentDoc = gql`
    fragment OrderBasic on Order {
  id
  userId
  orderNumber
  status
  subtotal
  taxAmount
  shippingCost
  discountAmount
  totalAmount
  notes
  trackingNumber
  shippedAt
  deliveredAt
  createdAt
  updatedAt
}
    `;
export const OrderFullFragmentDoc = gql`
    fragment OrderFull on Order {
  ...OrderBasic
  shippingAddress
  billingAddress
  user {
    id
    firstName
    lastName
    fullName
  }
  orderItems {
    id
    quantity
    unitPrice
    totalPrice
    productSnapshot
    product {
      id
      name
      sku
      images
    }
    variant {
      id
      size
      color
      sku
    }
  }
}
    ${OrderBasicFragmentDoc}`;
export const ProductBasicFragmentDoc = gql`
    fragment ProductBasic on Product {
  id
  name
  price
  currentPrice
  hasDiscount
  discountPercentage
  sku
  images
  isActive
  isInStock
  stockQuantity
  rating
  reviewCount
  createdAt
  updatedAt
}
    `;
export const ProductFullFragmentDoc = gql`
    fragment ProductFull on Product {
  ...ProductBasic
  description
  salePrice
  attributes
  tags
  totalStock
  category {
    id
    name
    slug
  }
  variants {
    id
    size
    color
    sku
    price
    stockQuantity
    isActive
    isInStock
  }
}
    ${ProductBasicFragmentDoc}`;
export const UserProfileBasicFragmentDoc = gql`
    fragment UserProfileBasic on UserProfile {
  id
  userId
  firstName
  lastName
  fullName
  phone
  birthDate
  avatarUrl
  createdAt
  updatedAt
}
    `;
export const UserProfileFullFragmentDoc = gql`
    fragment UserProfileFull on UserProfile {
  ...UserProfileBasic
  addresses {
    id
    title
    firstName
    lastName
    fullName
    fullAddress
    isDefault
  }
  orders {
    id
    orderNumber
    status
    totalAmount
    createdAt
  }
  cartItems {
    id
    quantity
    product {
      id
      name
      currentPrice
      images
    }
    variant {
      id
      size
      color
    }
  }
  favorites {
    id
    product {
      id
      name
      currentPrice
      images
    }
  }
}
    ${UserProfileBasicFragmentDoc}`;
export const GetOrdersDocument = gql`
    query GetOrders($filter: OrderFilterInput, $pagination: PaginationInput) {
  orders(filter: $filter, pagination: $pagination) {
    orders {
      ...OrderFull
    }
    total
    hasMore
  }
}
    ${OrderFullFragmentDoc}`;

/**
 * __useGetOrdersQuery__
 *
 * To run a query within a React component, call `useGetOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrdersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetOrdersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetOrdersQuery, GetOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetOrdersQuery, GetOrdersQueryVariables>(GetOrdersDocument, options);
      }
export function useGetOrdersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOrdersQuery, GetOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetOrdersQuery, GetOrdersQueryVariables>(GetOrdersDocument, options);
        }
export function useGetOrdersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetOrdersQuery, GetOrdersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetOrdersQuery, GetOrdersQueryVariables>(GetOrdersDocument, options);
        }
export type GetOrdersQueryHookResult = ReturnType<typeof useGetOrdersQuery>;
export type GetOrdersLazyQueryHookResult = ReturnType<typeof useGetOrdersLazyQuery>;
export type GetOrdersSuspenseQueryHookResult = ReturnType<typeof useGetOrdersSuspenseQuery>;
export type GetOrdersQueryResult = Apollo.QueryResult<GetOrdersQuery, GetOrdersQueryVariables>;
export function refetchGetOrdersQuery(variables?: GetOrdersQueryVariables) {
      return { query: GetOrdersDocument, variables: variables }
    }
export const GetOrderDocument = gql`
    query GetOrder($id: ID!) {
  order(id: $id) {
    ...OrderFull
  }
}
    ${OrderFullFragmentDoc}`;

/**
 * __useGetOrderQuery__
 *
 * To run a query within a React component, call `useGetOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrderQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOrderQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetOrderQuery, GetOrderQueryVariables> & ({ variables: GetOrderQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetOrderQuery, GetOrderQueryVariables>(GetOrderDocument, options);
      }
export function useGetOrderLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOrderQuery, GetOrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetOrderQuery, GetOrderQueryVariables>(GetOrderDocument, options);
        }
export function useGetOrderSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetOrderQuery, GetOrderQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetOrderQuery, GetOrderQueryVariables>(GetOrderDocument, options);
        }
export type GetOrderQueryHookResult = ReturnType<typeof useGetOrderQuery>;
export type GetOrderLazyQueryHookResult = ReturnType<typeof useGetOrderLazyQuery>;
export type GetOrderSuspenseQueryHookResult = ReturnType<typeof useGetOrderSuspenseQuery>;
export type GetOrderQueryResult = Apollo.QueryResult<GetOrderQuery, GetOrderQueryVariables>;
export function refetchGetOrderQuery(variables: GetOrderQueryVariables) {
      return { query: GetOrderDocument, variables: variables }
    }
export const GetOrderByNumberDocument = gql`
    query GetOrderByNumber($orderNumber: String!) {
  orderByNumber(orderNumber: $orderNumber) {
    ...OrderFull
  }
}
    ${OrderFullFragmentDoc}`;

/**
 * __useGetOrderByNumberQuery__
 *
 * To run a query within a React component, call `useGetOrderByNumberQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrderByNumberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrderByNumberQuery({
 *   variables: {
 *      orderNumber: // value for 'orderNumber'
 *   },
 * });
 */
export function useGetOrderByNumberQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetOrderByNumberQuery, GetOrderByNumberQueryVariables> & ({ variables: GetOrderByNumberQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetOrderByNumberQuery, GetOrderByNumberQueryVariables>(GetOrderByNumberDocument, options);
      }
export function useGetOrderByNumberLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOrderByNumberQuery, GetOrderByNumberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetOrderByNumberQuery, GetOrderByNumberQueryVariables>(GetOrderByNumberDocument, options);
        }
export function useGetOrderByNumberSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetOrderByNumberQuery, GetOrderByNumberQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetOrderByNumberQuery, GetOrderByNumberQueryVariables>(GetOrderByNumberDocument, options);
        }
export type GetOrderByNumberQueryHookResult = ReturnType<typeof useGetOrderByNumberQuery>;
export type GetOrderByNumberLazyQueryHookResult = ReturnType<typeof useGetOrderByNumberLazyQuery>;
export type GetOrderByNumberSuspenseQueryHookResult = ReturnType<typeof useGetOrderByNumberSuspenseQuery>;
export type GetOrderByNumberQueryResult = Apollo.QueryResult<GetOrderByNumberQuery, GetOrderByNumberQueryVariables>;
export function refetchGetOrderByNumberQuery(variables: GetOrderByNumberQueryVariables) {
      return { query: GetOrderByNumberDocument, variables: variables }
    }
export const GetOrderStatsDocument = gql`
    query GetOrderStats {
  orderStats
}
    `;

/**
 * __useGetOrderStatsQuery__
 *
 * To run a query within a React component, call `useGetOrderStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrderStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrderStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOrderStatsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetOrderStatsQuery, GetOrderStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetOrderStatsQuery, GetOrderStatsQueryVariables>(GetOrderStatsDocument, options);
      }
export function useGetOrderStatsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOrderStatsQuery, GetOrderStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetOrderStatsQuery, GetOrderStatsQueryVariables>(GetOrderStatsDocument, options);
        }
export function useGetOrderStatsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetOrderStatsQuery, GetOrderStatsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetOrderStatsQuery, GetOrderStatsQueryVariables>(GetOrderStatsDocument, options);
        }
export type GetOrderStatsQueryHookResult = ReturnType<typeof useGetOrderStatsQuery>;
export type GetOrderStatsLazyQueryHookResult = ReturnType<typeof useGetOrderStatsLazyQuery>;
export type GetOrderStatsSuspenseQueryHookResult = ReturnType<typeof useGetOrderStatsSuspenseQuery>;
export type GetOrderStatsQueryResult = Apollo.QueryResult<GetOrderStatsQuery, GetOrderStatsQueryVariables>;
export function refetchGetOrderStatsQuery(variables?: GetOrderStatsQueryVariables) {
      return { query: GetOrderStatsDocument, variables: variables }
    }
export const CreateOrderDocument = gql`
    mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    ...OrderFull
  }
}
    ${OrderFullFragmentDoc}`;
export type CreateOrderMutationFn = Apollo.MutationFunction<CreateOrderMutation, CreateOrderMutationVariables>;

/**
 * __useCreateOrderMutation__
 *
 * To run a mutation, you first call `useCreateOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrderMutation, { data, loading, error }] = useCreateOrderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateOrderMutation, CreateOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateOrderMutation, CreateOrderMutationVariables>(CreateOrderDocument, options);
      }
export type CreateOrderMutationHookResult = ReturnType<typeof useCreateOrderMutation>;
export type CreateOrderMutationResult = Apollo.MutationResult<CreateOrderMutation>;
export type CreateOrderMutationOptions = Apollo.BaseMutationOptions<CreateOrderMutation, CreateOrderMutationVariables>;
export const UpdateOrderDocument = gql`
    mutation UpdateOrder($id: ID!, $input: UpdateOrderInput!) {
  updateOrder(id: $id, input: $input) {
    ...OrderFull
  }
}
    ${OrderFullFragmentDoc}`;
export type UpdateOrderMutationFn = Apollo.MutationFunction<UpdateOrderMutation, UpdateOrderMutationVariables>;

/**
 * __useUpdateOrderMutation__
 *
 * To run a mutation, you first call `useUpdateOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrderMutation, { data, loading, error }] = useUpdateOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateOrderMutation, UpdateOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateOrderMutation, UpdateOrderMutationVariables>(UpdateOrderDocument, options);
      }
export type UpdateOrderMutationHookResult = ReturnType<typeof useUpdateOrderMutation>;
export type UpdateOrderMutationResult = Apollo.MutationResult<UpdateOrderMutation>;
export type UpdateOrderMutationOptions = Apollo.BaseMutationOptions<UpdateOrderMutation, UpdateOrderMutationVariables>;
export const UpdateOrderStatusDocument = gql`
    mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
  updateOrderStatus(id: $id, status: $status) {
    ...OrderBasic
  }
}
    ${OrderBasicFragmentDoc}`;
export type UpdateOrderStatusMutationFn = Apollo.MutationFunction<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>;

/**
 * __useUpdateOrderStatusMutation__
 *
 * To run a mutation, you first call `useUpdateOrderStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrderStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrderStatusMutation, { data, loading, error }] = useUpdateOrderStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useUpdateOrderStatusMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>(UpdateOrderStatusDocument, options);
      }
export type UpdateOrderStatusMutationHookResult = ReturnType<typeof useUpdateOrderStatusMutation>;
export type UpdateOrderStatusMutationResult = Apollo.MutationResult<UpdateOrderStatusMutation>;
export type UpdateOrderStatusMutationOptions = Apollo.BaseMutationOptions<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>;
export const GetProductsDocument = gql`
    query GetProducts($filter: ProductFilterInput, $pagination: PaginationInput) {
  products(filter: $filter, pagination: $pagination) {
    products {
      ...ProductFull
    }
    total
    hasMore
  }
}
    ${ProductFullFragmentDoc}`;

/**
 * __useGetProductsQuery__
 *
 * To run a query within a React component, call `useGetProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetProductsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
      }
export function useGetProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
        }
export function useGetProductsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
        }
export type GetProductsQueryHookResult = ReturnType<typeof useGetProductsQuery>;
export type GetProductsLazyQueryHookResult = ReturnType<typeof useGetProductsLazyQuery>;
export type GetProductsSuspenseQueryHookResult = ReturnType<typeof useGetProductsSuspenseQuery>;
export type GetProductsQueryResult = Apollo.QueryResult<GetProductsQuery, GetProductsQueryVariables>;
export function refetchGetProductsQuery(variables?: GetProductsQueryVariables) {
      return { query: GetProductsDocument, variables: variables }
    }
export const GetProductDocument = gql`
    query GetProduct($id: ID!) {
  product(id: $id) {
    ...ProductFull
  }
}
    ${ProductFullFragmentDoc}`;

/**
 * __useGetProductQuery__
 *
 * To run a query within a React component, call `useGetProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProductQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetProductQuery, GetProductQueryVariables> & ({ variables: GetProductQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
      }
export function useGetProductLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
        }
export function useGetProductSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
        }
export type GetProductQueryHookResult = ReturnType<typeof useGetProductQuery>;
export type GetProductLazyQueryHookResult = ReturnType<typeof useGetProductLazyQuery>;
export type GetProductSuspenseQueryHookResult = ReturnType<typeof useGetProductSuspenseQuery>;
export type GetProductQueryResult = Apollo.QueryResult<GetProductQuery, GetProductQueryVariables>;
export function refetchGetProductQuery(variables: GetProductQueryVariables) {
      return { query: GetProductDocument, variables: variables }
    }
export const GetProductBySkuDocument = gql`
    query GetProductBySku($sku: String!) {
  productBySku(sku: $sku) {
    ...ProductFull
  }
}
    ${ProductFullFragmentDoc}`;

/**
 * __useGetProductBySkuQuery__
 *
 * To run a query within a React component, call `useGetProductBySkuQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductBySkuQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductBySkuQuery({
 *   variables: {
 *      sku: // value for 'sku'
 *   },
 * });
 */
export function useGetProductBySkuQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetProductBySkuQuery, GetProductBySkuQueryVariables> & ({ variables: GetProductBySkuQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetProductBySkuQuery, GetProductBySkuQueryVariables>(GetProductBySkuDocument, options);
      }
export function useGetProductBySkuLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProductBySkuQuery, GetProductBySkuQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetProductBySkuQuery, GetProductBySkuQueryVariables>(GetProductBySkuDocument, options);
        }
export function useGetProductBySkuSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetProductBySkuQuery, GetProductBySkuQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetProductBySkuQuery, GetProductBySkuQueryVariables>(GetProductBySkuDocument, options);
        }
export type GetProductBySkuQueryHookResult = ReturnType<typeof useGetProductBySkuQuery>;
export type GetProductBySkuLazyQueryHookResult = ReturnType<typeof useGetProductBySkuLazyQuery>;
export type GetProductBySkuSuspenseQueryHookResult = ReturnType<typeof useGetProductBySkuSuspenseQuery>;
export type GetProductBySkuQueryResult = Apollo.QueryResult<GetProductBySkuQuery, GetProductBySkuQueryVariables>;
export function refetchGetProductBySkuQuery(variables: GetProductBySkuQueryVariables) {
      return { query: GetProductBySkuDocument, variables: variables }
    }
export const CreateProductDocument = gql`
    mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    ...ProductFull
  }
}
    ${ProductFullFragmentDoc}`;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
  updateProduct(id: $id, input: $input) {
    ...ProductFull
  }
}
    ${ProductFullFragmentDoc}`;
export type UpdateProductMutationFn = Apollo.MutationFunction<UpdateProductMutation, UpdateProductMutationVariables>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, options);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id) {
    success
    message
  }
}
    `;
export type DeleteProductMutationFn = Apollo.MutationFunction<DeleteProductMutation, DeleteProductMutationVariables>;

/**
 * __useDeleteProductMutation__
 *
 * To run a mutation, you first call `useDeleteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductMutation, { data, loading, error }] = useDeleteProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteProductMutation, DeleteProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, options);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
export const UploadImageDocument = gql`
    mutation UploadImage($file: Upload!, $entityType: String!, $entityId: String!) {
  uploadImage(file: $file, entityType: $entityType, entityId: $entityId) {
    success
    url
    filename
    message
  }
}
    `;
export type UploadImageMutationFn = Apollo.MutationFunction<UploadImageMutation, UploadImageMutationVariables>;

/**
 * __useUploadImageMutation__
 *
 * To run a mutation, you first call `useUploadImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadImageMutation, { data, loading, error }] = useUploadImageMutation({
 *   variables: {
 *      file: // value for 'file'
 *      entityType: // value for 'entityType'
 *      entityId: // value for 'entityId'
 *   },
 * });
 */
export function useUploadImageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UploadImageMutation, UploadImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UploadImageMutation, UploadImageMutationVariables>(UploadImageDocument, options);
      }
export type UploadImageMutationHookResult = ReturnType<typeof useUploadImageMutation>;
export type UploadImageMutationResult = Apollo.MutationResult<UploadImageMutation>;
export type UploadImageMutationOptions = Apollo.BaseMutationOptions<UploadImageMutation, UploadImageMutationVariables>;
export const GetUsersDocument = gql`
    query GetUsers($filter: UserFilterInput, $pagination: PaginationInput) {
  users(filter: $filter, pagination: $pagination) {
    users {
      id
      userId
      firstName
      lastName
      phone
      birthDate
      avatarUrl
      createdAt
      updatedAt
    }
    total
    hasMore
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export function useGetUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersSuspenseQueryHookResult = ReturnType<typeof useGetUsersSuspenseQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export function refetchGetUsersQuery(variables?: GetUsersQueryVariables) {
      return { query: GetUsersDocument, variables: variables }
    }
export const GetUserDocument = gql`
    query GetUser($id: ID!) {
  userProfile(userId: $id) {
    id
    userId
    firstName
    lastName
    phone
    birthDate
    avatarUrl
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserQuery, GetUserQueryVariables> & ({ variables: GetUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export function refetchGetUserQuery(variables: GetUserQueryVariables) {
      return { query: GetUserDocument, variables: variables }
    }
export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserProfileInput!) {
  createUserProfile(input: $input) {
    id
    userId
    firstName
    lastName
    phone
    birthDate
    avatarUrl
    createdAt
    updatedAt
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($userId: ID!, $input: UpdateUserProfileInput!) {
  updateUserProfile(userId: $userId, input: $input) {
    id
    userId
    firstName
    lastName
    phone
    birthDate
    avatarUrl
    createdAt
    updatedAt
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetUserProfileDocument = gql`
    query GetUserProfile($userId: ID!) {
  userProfile(userId: $userId) {
    ...UserProfileFull
  }
}
    ${UserProfileFullFragmentDoc}`;

/**
 * __useGetUserProfileQuery__
 *
 * To run a query within a React component, call `useGetUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserProfileQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserProfileQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables> & ({ variables: GetUserProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
      }
export function useGetUserProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
        }
export function useGetUserProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
        }
export type GetUserProfileQueryHookResult = ReturnType<typeof useGetUserProfileQuery>;
export type GetUserProfileLazyQueryHookResult = ReturnType<typeof useGetUserProfileLazyQuery>;
export type GetUserProfileSuspenseQueryHookResult = ReturnType<typeof useGetUserProfileSuspenseQuery>;
export type GetUserProfileQueryResult = Apollo.QueryResult<GetUserProfileQuery, GetUserProfileQueryVariables>;
export function refetchGetUserProfileQuery(variables: GetUserProfileQueryVariables) {
      return { query: GetUserProfileDocument, variables: variables }
    }
export const GetUserStatsDocument = gql`
    query GetUserStats {
  userStats
}
    `;

/**
 * __useGetUserStatsQuery__
 *
 * To run a query within a React component, call `useGetUserStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserStatsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUserStatsQuery, GetUserStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(GetUserStatsDocument, options);
      }
export function useGetUserStatsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserStatsQuery, GetUserStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(GetUserStatsDocument, options);
        }
export function useGetUserStatsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserStatsQuery, GetUserStatsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(GetUserStatsDocument, options);
        }
export type GetUserStatsQueryHookResult = ReturnType<typeof useGetUserStatsQuery>;
export type GetUserStatsLazyQueryHookResult = ReturnType<typeof useGetUserStatsLazyQuery>;
export type GetUserStatsSuspenseQueryHookResult = ReturnType<typeof useGetUserStatsSuspenseQuery>;
export type GetUserStatsQueryResult = Apollo.QueryResult<GetUserStatsQuery, GetUserStatsQueryVariables>;
export function refetchGetUserStatsQuery(variables?: GetUserStatsQueryVariables) {
      return { query: GetUserStatsDocument, variables: variables }
    }
export const CreateUserProfileDocument = gql`
    mutation CreateUserProfile($input: CreateUserProfileInput!) {
  createUserProfile(input: $input) {
    ...UserProfileBasic
  }
}
    ${UserProfileBasicFragmentDoc}`;
export type CreateUserProfileMutationFn = Apollo.MutationFunction<CreateUserProfileMutation, CreateUserProfileMutationVariables>;

/**
 * __useCreateUserProfileMutation__
 *
 * To run a mutation, you first call `useCreateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserProfileMutation, { data, loading, error }] = useCreateUserProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserProfileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateUserProfileMutation, CreateUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateUserProfileMutation, CreateUserProfileMutationVariables>(CreateUserProfileDocument, options);
      }
export type CreateUserProfileMutationHookResult = ReturnType<typeof useCreateUserProfileMutation>;
export type CreateUserProfileMutationResult = Apollo.MutationResult<CreateUserProfileMutation>;
export type CreateUserProfileMutationOptions = Apollo.BaseMutationOptions<CreateUserProfileMutation, CreateUserProfileMutationVariables>;
export const UpdateUserProfileDocument = gql`
    mutation UpdateUserProfile($userId: ID!, $input: UpdateUserProfileInput!) {
  updateUserProfile(userId: $userId, input: $input) {
    ...UserProfileBasic
  }
}
    ${UserProfileBasicFragmentDoc}`;
export type UpdateUserProfileMutationFn = Apollo.MutationFunction<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;

/**
 * __useUpdateUserProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProfileMutation, { data, loading, error }] = useUpdateUserProfileMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserProfileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, options);
      }
export type UpdateUserProfileMutationHookResult = ReturnType<typeof useUpdateUserProfileMutation>;
export type UpdateUserProfileMutationResult = Apollo.MutationResult<UpdateUserProfileMutation>;
export type UpdateUserProfileMutationOptions = Apollo.BaseMutationOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;