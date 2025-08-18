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
  /** DateTime custom scalar type */
  DateTime: { input: string; output: string; }
  /** Decimal custom scalar type */
  Decimal: { input: number; output: number; }
  /** JSON custom scalar type */
  JSON: { input: any; output: any; }
  Upload: { input: File; output: File; }
};

export type AppEvent = {
  __typename?: 'AppEvent';
  categoryId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deviceInfo?: Maybe<Scalars['JSON']['output']>;
  eventData?: Maybe<Scalars['JSON']['output']>;
  eventType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['JSON']['output']>;
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['String']['output']>;
  sessionId?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserProfile>;
  userAgent?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type AuditLog = {
  __typename?: 'AuditLog';
  action: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  newValues?: Maybe<Scalars['JSON']['output']>;
  oldValues?: Maybe<Scalars['JSON']['output']>;
  recordId?: Maybe<Scalars['String']['output']>;
  tableName?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserProfile>;
  userAgent?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type AuthData = {
  __typename?: 'AuthData';
  accessToken?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export enum AuthProvider {
  apple = 'apple',
  email = 'email',
  facebook = 'facebook',
  google = 'google'
}

export type AuthResponse = {
  __typename?: 'AuthResponse';
  code: Scalars['String']['output'];
  data?: Maybe<AuthData>;
  message: Scalars['String']['output'];
  metadata?: Maybe<ResponseMetadata>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type BaseResponse = {
  __typename?: 'BaseResponse';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
  metadata?: Maybe<ResponseMetadata>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type Carrier = {
  __typename?: 'Carrier';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  tracking: Array<OrderTracking>;
  trackingUrlTemplate?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  products: Array<Product>;
  slug: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CategoryFilterInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryPaginationInfo = {
  __typename?: 'CategoryPaginationInfo';
  currentPage: Scalars['Int']['output'];
  hasMore: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Coupon = {
  __typename?: 'Coupon';
  applicableCategories: Array<Scalars['String']['output']>;
  applicableProducts: Array<Scalars['String']['output']>;
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  discountType: DiscountType;
  discountValue: Scalars['Decimal']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isFirstTimeOnly: Scalars['Boolean']['output'];
  maximumDiscount?: Maybe<Scalars['Decimal']['output']>;
  minimumAmount?: Maybe<Scalars['Decimal']['output']>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  usage: Array<CouponUsage>;
  usageLimit?: Maybe<Scalars['Int']['output']>;
  usedCount: Scalars['Int']['output'];
  validFrom: Scalars['DateTime']['output'];
  validUntil: Scalars['DateTime']['output'];
};

export type CouponUsage = {
  __typename?: 'CouponUsage';
  coupon: Coupon;
  couponId: Scalars['ID']['output'];
  discountAmount: Scalars['Decimal']['output'];
  id: Scalars['ID']['output'];
  order: Order;
  orderId: Scalars['ID']['output'];
  usedAt: Scalars['DateTime']['output'];
  user: UserProfile;
  userId: Scalars['ID']['output'];
};

export type CreateCarrierInput = {
  code: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  trackingUrlTemplate?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCategoryData = {
  __typename?: 'CreateCategoryData';
  createdAt: Scalars['String']['output'];
  entity: Category;
  id: Scalars['ID']['output'];
};

export type CreateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateCategoryResponse = {
  __typename?: 'CreateCategoryResponse';
  code: Scalars['String']['output'];
  data?: Maybe<CreateCategoryData>;
  message: Scalars['String']['output'];
  metadata?: Maybe<ResponseMetadata>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type CreateCouponInput = {
  applicableCategories?: InputMaybe<Array<Scalars['String']['input']>>;
  applicableProducts?: InputMaybe<Array<Scalars['String']['input']>>;
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  discountType: DiscountType;
  discountValue: Scalars['Decimal']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isFirstTimeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  maximumDiscount?: InputMaybe<Scalars['Decimal']['input']>;
  minimumAmount?: InputMaybe<Scalars['Decimal']['input']>;
  name: Scalars['String']['input'];
  usageLimit?: InputMaybe<Scalars['Int']['input']>;
  validFrom: Scalars['DateTime']['input'];
  validUntil: Scalars['DateTime']['input'];
};

export type CreateInventoryTransactionInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  reference?: InputMaybe<Scalars['String']['input']>;
  type: InventoryTransactionType;
};

export type CreateNotificationTemplateInput = {
  body: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: NotificationType;
  variables: Array<Scalars['String']['input']>;
};

export type CreateOrderInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  discountAmount?: InputMaybe<Scalars['Decimal']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  orderNumber: Scalars['String']['input'];
  shippingAddressId?: InputMaybe<Scalars['String']['input']>;
  shippingAmount?: InputMaybe<Scalars['Decimal']['input']>;
  subtotal: Scalars['Decimal']['input'];
  taxAmount?: InputMaybe<Scalars['Decimal']['input']>;
  totalAmount: Scalars['Decimal']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateOrderItemInput = {
  orderId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  totalPrice: Scalars['Decimal']['input'];
  unitPrice: Scalars['Decimal']['input'];
};

export type CreatePaymentMethodInput = {
  amount: Scalars['Decimal']['input'];
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  orderId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
  transactionId?: InputMaybe<Scalars['String']['input']>;
  type: PaymentMethodType;
};

export type CreateProductData = {
  __typename?: 'CreateProductData';
  createdAt: Scalars['String']['output'];
  entity: Product;
  id: Scalars['ID']['output'];
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

export type CreateProductResponse = {
  __typename?: 'CreateProductResponse';
  code: Scalars['String']['output'];
  data?: Maybe<CreateProductData>;
  message: Scalars['String']['output'];
  metadata?: Maybe<ResponseMetadata>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type CreateProductReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type CreateProductVariantInput = {
  attributes?: InputMaybe<Scalars['JSON']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Decimal']['input'];
  productId: Scalars['ID']['input'];
  sku: Scalars['String']['input'];
  stockQuantity: Scalars['Int']['input'];
};

export type CreatePushNotificationInput = {
  body: Scalars['String']['input'];
  data?: InputMaybe<Scalars['JSON']['input']>;
  title: Scalars['String']['input'];
  type: NotificationType;
  userId: Scalars['ID']['input'];
};

export type CreateReviewVoteInput = {
  isHelpful: Scalars['Boolean']['input'];
  reviewId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateSavedPaymentMethodInput = {
  cardholderName?: InputMaybe<Scalars['String']['input']>;
  expiryMonth?: InputMaybe<Scalars['Int']['input']>;
  expiryYear?: InputMaybe<Scalars['Int']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  lastFour?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  provider: Scalars['String']['input'];
  type: PaymentMethodType;
  userId: Scalars['ID']['input'];
};

export type CreateShippingRateInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maxWeight?: InputMaybe<Scalars['Decimal']['input']>;
  minWeight?: InputMaybe<Scalars['Decimal']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Decimal']['input'];
  zoneId: Scalars['ID']['input'];
};

export type CreateShippingZoneInput = {
  cities: Array<Scalars['String']['input']>;
  countries: Array<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  postalCodes: Array<Scalars['String']['input']>;
  states: Array<Scalars['String']['input']>;
};

export type CreateStockAlertInput = {
  currentStock: Scalars['Int']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  productId: Scalars['ID']['input'];
  threshold: Scalars['Int']['input'];
  type: StockAlertType;
};

export type CreateUserAddressInput = {
  address1: Scalars['String']['input'];
  address2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  company?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
  type: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateUserData = {
  __typename?: 'CreateUserData';
  createdAt: Scalars['String']['output'];
  entity: User;
  id: Scalars['ID']['output'];
};

export type CreateUserProfileInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

export type CreateUserResponse = {
  __typename?: 'CreateUserResponse';
  code: Scalars['String']['output'];
  data?: Maybe<CreateUserData>;
  message: Scalars['String']['output'];
  metadata?: Maybe<ResponseMetadata>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type DashboardMetrics = {
  __typename?: 'DashboardMetrics';
  activeCoupons: Scalars['Int']['output'];
  lowStockProducts: Scalars['Int']['output'];
  pendingOrders: Scalars['Int']['output'];
  todayOrders: Scalars['Int']['output'];
  todayRevenue: Scalars['Decimal']['output'];
  totalOrders: Scalars['Int']['output'];
  totalProducts: Scalars['Int']['output'];
  totalRevenue: Scalars['Decimal']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type DeleteCategoryData = {
  __typename?: 'DeleteCategoryData';
  deletedAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  softDelete: Scalars['Boolean']['output'];
};

export type DeleteCategoryResponse = {
  __typename?: 'DeleteCategoryResponse';
  code: Scalars['String']['output'];
  data?: Maybe<DeleteCategoryData>;
  message: Scalars['String']['output'];
  metadata?: Maybe<ResponseMetadata>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type DeleteProductData = {
  __typename?: 'DeleteProductData';
  deletedAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  softDelete: Scalars['Boolean']['output'];
};

export type DeleteProductResponse = {
  __typename?: 'DeleteProductResponse';
  code: Scalars['String']['output'];
  data?: Maybe<DeleteProductData>;
  message: Scalars['String']['output'];
  metadata?: Maybe<ResponseMetadata>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type DeliverySlot = {
  __typename?: 'DeliverySlot';
  createdAt: Scalars['DateTime']['output'];
  dayOfWeek: Scalars['Int']['output'];
  endTime: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  maxOrders: Scalars['Int']['output'];
  startTime: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum DiscountType {
  fixed_amount = 'fixed_amount',
  free_shipping = 'free_shipping',
  percentage = 'percentage'
}

export type EmailTemplate = {
  __typename?: 'EmailTemplate';
  body: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  subject: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variables: Array<Scalars['String']['output']>;
};

export type GetCategoriesData = {
  __typename?: 'GetCategoriesData';
  items: Array<Category>;
  pagination: CategoryPaginationInfo;
};

export type GetCategoriesResponse = {
  __typename?: 'GetCategoriesResponse';
  code: Scalars['String']['output'];
  data?: Maybe<GetCategoriesData>;
  message: Scalars['String']['output'];
  metadata?: Maybe<ResponseMetadata>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type GetCategoryData = {
  __typename?: 'GetCategoryData';
  entity: Category;
};

export type GetCategoryResponse = {
  __typename?: 'GetCategoryResponse';
  code: Scalars['String']['output'];
  data?: Maybe<GetCategoryData>;
  message: Scalars['String']['output'];
  metadata?: Maybe<ResponseMetadata>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type GetProductData = {
  __typename?: 'GetProductData';
  entity: Product;
};

export type GetProductResponse = {
  __typename?: 'GetProductResponse';
  code: Scalars['String']['output'];
  data?: Maybe<GetProductData>;
  message: Scalars['String']['output'];
  metadata?: Maybe<ResponseMetadata>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type GetProductsData = {
  __typename?: 'GetProductsData';
  items: Array<Product>;
  pagination: ProductPaginationInfo;
};

export type GetProductsResponse = {
  __typename?: 'GetProductsResponse';
  code: Scalars['String']['output'];
  data?: Maybe<GetProductsData>;
  message: Scalars['String']['output'];
  metadata?: Maybe<ResponseMetadata>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type Image = {
  __typename?: 'Image';
  bucket?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  entityId?: Maybe<Scalars['String']['output']>;
  entityType?: Maybe<Scalars['String']['output']>;
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mimeType: Scalars['String']['output'];
  originalName: Scalars['String']['output'];
  path?: Maybe<Scalars['String']['output']>;
  size: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

export type InventoryTransaction = {
  __typename?: 'InventoryTransaction';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  product: Product;
  productId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  reference?: Maybe<Scalars['String']['output']>;
  type: InventoryTransactionType;
};

export enum InventoryTransactionType {
  adjustment = 'adjustment',
  purchase = 'purchase',
  return = 'return',
  sale = 'sale',
  transfer = 'transfer'
}

export type LoyaltyProgram = {
  __typename?: 'LoyaltyProgram';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  expiryMonths: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pointsPerDollar: Scalars['Decimal']['output'];
  redemptionRate: Scalars['Decimal']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  activateUser: User;
  addToCart: ShoppingCartItem;
  addToFavorites: UserFavorite;
  applyCoupon: Order;
  approveReview: ProductReview;
  bulkUpdateOrderStatus: Array<Order>;
  bulkUpdateProducts: Array<Product>;
  cancelOrder: Order;
  clearUserCart: SuccessResponse;
  createCarrier: Carrier;
  createCategory: CreateCategoryResponse;
  createCoupon: Coupon;
  createInventoryTransaction: InventoryTransaction;
  createNotificationTemplate: NotificationTemplate;
  createOrder: Order;
  createOrderItem: OrderItem;
  createPaymentMethod: PaymentMethod;
  createProduct: CreateProductResponse;
  createProductReview: ProductReview;
  createProductVariant: ProductVariant;
  createPushNotification: PushNotification;
  createReviewVote: ReviewVote;
  createSavedPaymentMethod: SavedPaymentMethod;
  createShippingRate: ShippingRate;
  createShippingZone: ShippingZone;
  createStockAlert: StockAlert;
  createUser: CreateUserResponse;
  createUserAddress: UserAddress;
  createUserProfile: UserProfile;
  deactivateUser: User;
  deleteCarrier: SuccessResponse;
  deleteCategory: DeleteCategoryResponse;
  deleteCoupon: SuccessResponse;
  deleteOrderItem: SuccessResponse;
  deletePaymentMethod: SuccessResponse;
  deleteProduct: DeleteProductResponse;
  deleteProductReview: SuccessResponse;
  deleteProductVariant: SuccessResponse;
  deleteReviewVote: SuccessResponse;
  deleteSavedPaymentMethod: SuccessResponse;
  deleteStockAlert: SuccessResponse;
  deleteUser: SuccessResponse;
  deleteUserAddress: SuccessResponse;
  deleteUserProfile: SuccessResponse;
  deliverOrder: Order;
  forcePasswordReset: SuccessResponse;
  impersonateUser: AuthResponse;
  loginUser: AuthResponse;
  logoutUser: SuccessResponse;
  markAllNotificationsAsRead: SuccessResponse;
  markNotificationAsRead: PushNotification;
  refreshToken: AuthResponse;
  registerUser: AuthResponse;
  removeCoupon: Order;
  removeFromCart: SuccessResponse;
  removeFromFavorites: SuccessResponse;
  requestPasswordReset: SuccessResponse;
  resetPassword: SuccessResponse;
  revokeAllUserSessions: SuccessResponse;
  revokeUserSession: SuccessResponse;
  setDefaultAddress: SuccessResponse;
  shipOrder: Order;
  subscribeToNewsletter: NewsletterSubscription;
  toggleFavorite: UserFavorite;
  unlinkUserAccount: SuccessResponse;
  unsubscribeFromNewsletter: SuccessResponse;
  updateCarrier: Carrier;
  updateCartItem: ShoppingCartItem;
  updateCategory: UpdateCategoryResponse;
  updateCoupon: Coupon;
  updateOrder: Order;
  updateOrderItem: OrderItem;
  updateOrderStatus: Order;
  updatePaymentMethod: PaymentMethod;
  updateProduct: UpdateProductResponse;
  updateProductReview: ProductReview;
  updateProductVariant: ProductVariant;
  updateSavedPaymentMethod: SavedPaymentMethod;
  updateStockAlert: StockAlert;
  updateUser: User;
  updateUserAddress: UserAddress;
  updateUserPassword: SuccessResponse;
  updateUserProfile: UserProfile;
  uploadImage: UploadResponse;
};


export type MutationActivateUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAddToCartArgs = {
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationAddToFavoritesArgs = {
  productId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationApplyCouponArgs = {
  couponCode: Scalars['String']['input'];
  orderId: Scalars['ID']['input'];
};


export type MutationApproveReviewArgs = {
  id: Scalars['ID']['input'];
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


export type MutationCreateCarrierArgs = {
  input: CreateCarrierInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateCouponArgs = {
  input: CreateCouponInput;
};


export type MutationCreateInventoryTransactionArgs = {
  input: CreateInventoryTransactionInput;
};


export type MutationCreateNotificationTemplateArgs = {
  input: CreateNotificationTemplateInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreateOrderItemArgs = {
  input: CreateOrderItemInput;
};


export type MutationCreatePaymentMethodArgs = {
  input: CreatePaymentMethodInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateProductReviewArgs = {
  input: CreateProductReviewInput;
};


export type MutationCreateProductVariantArgs = {
  input: CreateProductVariantInput;
};


export type MutationCreatePushNotificationArgs = {
  input: CreatePushNotificationInput;
};


export type MutationCreateReviewVoteArgs = {
  input: CreateReviewVoteInput;
};


export type MutationCreateSavedPaymentMethodArgs = {
  input: CreateSavedPaymentMethodInput;
};


export type MutationCreateShippingRateArgs = {
  input: CreateShippingRateInput;
};


export type MutationCreateShippingZoneArgs = {
  input: CreateShippingZoneInput;
};


export type MutationCreateStockAlertArgs = {
  input: CreateStockAlertInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserProfileInput;
};


export type MutationCreateUserAddressArgs = {
  input: CreateUserAddressInput;
};


export type MutationCreateUserProfileArgs = {
  input: CreateUserProfileInput;
};


export type MutationDeactivateUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCarrierArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCouponArgs = {
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


export type MutationDeleteProductReviewArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductVariantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteReviewVoteArgs = {
  reviewId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationDeleteSavedPaymentMethodArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStockAlertArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
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


export type MutationForcePasswordResetArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationImpersonateUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationLoginUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationMarkAllNotificationsAsReadArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterUserArgs = {
  input: CreateUserProfileInput;
};


export type MutationRemoveCouponArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationRemoveFromCartArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveFromFavoritesArgs = {
  productId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationRevokeAllUserSessionsArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationRevokeUserSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationSetDefaultAddressArgs = {
  addressId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationShipOrderArgs = {
  id: Scalars['ID']['input'];
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSubscribeToNewsletterArgs = {
  email: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationToggleFavoriteArgs = {
  productId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationUnlinkUserAccountArgs = {
  accountId: Scalars['ID']['input'];
};


export type MutationUnsubscribeFromNewsletterArgs = {
  email: Scalars['String']['input'];
};


export type MutationUpdateCarrierArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  trackingUrlTemplate?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateCartItemArgs = {
  id: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCategoryInput;
};


export type MutationUpdateCouponArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCouponInput;
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
  input: UpdatePaymentMethodInput;
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductInput;
};


export type MutationUpdateProductReviewArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductReviewInput;
};


export type MutationUpdateProductVariantArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductVariantInput;
};


export type MutationUpdateSavedPaymentMethodArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSavedPaymentMethodInput;
};


export type MutationUpdateStockAlertArgs = {
  id: Scalars['ID']['input'];
  isActive: Scalars['Boolean']['input'];
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};


export type MutationUpdateUserAddressArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserAddressInput;
};


export type MutationUpdateUserPasswordArgs = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
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

export type NewsletterSubscription = {
  __typename?: 'NewsletterSubscription';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  subscribedAt: Scalars['DateTime']['output'];
  unsubscribedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<UserProfile>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type NotificationTemplate = {
  __typename?: 'NotificationTemplate';
  body: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: NotificationType;
  updatedAt: Scalars['DateTime']['output'];
  variables: Array<Scalars['String']['output']>;
};

export enum NotificationType {
  marketing = 'marketing',
  order_status = 'order_status',
  payment = 'payment',
  shipping = 'shipping',
  system = 'system'
}

export type Order = {
  __typename?: 'Order';
  couponUsage: Array<CouponUsage>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  discountAmount: Scalars['Decimal']['output'];
  id: Scalars['ID']['output'];
  items: Array<OrderItem>;
  notes?: Maybe<Scalars['String']['output']>;
  orderNumber: Scalars['String']['output'];
  paymentMethods: Array<PaymentMethod>;
  shippingAddress?: Maybe<UserAddress>;
  shippingAddressId?: Maybe<Scalars['String']['output']>;
  shippingAmount: Scalars['Decimal']['output'];
  status: OrderStatus;
  subtotal: Scalars['Decimal']['output'];
  taxAmount: Scalars['Decimal']['output'];
  totalAmount: Scalars['Decimal']['output'];
  tracking: Array<OrderTracking>;
  transactions: Array<Transaction>;
  updatedAt: Scalars['DateTime']['output'];
  user: UserProfile;
  userId: Scalars['ID']['output'];
};

export type OrderAnalytics = {
  __typename?: 'OrderAnalytics';
  averageOrderValue: Scalars['Decimal']['output'];
  ordersByStatus: Scalars['JSON']['output'];
  revenueByMonth: Scalars['JSON']['output'];
  topCustomers: Array<UserProfile>;
  totalOrders: Scalars['Int']['output'];
  totalRevenue: Scalars['Decimal']['output'];
};

export type OrderFilterInput = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  maxAmount?: InputMaybe<Scalars['Decimal']['input']>;
  minAmount?: InputMaybe<Scalars['Decimal']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<OrderStatus>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  order: Order;
  orderId: Scalars['ID']['output'];
  product: Product;
  productId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  totalPrice: Scalars['Decimal']['output'];
  unitPrice: Scalars['Decimal']['output'];
};

export type OrderStats = {
  __typename?: 'OrderStats';
  averageOrderValue: Scalars['Decimal']['output'];
  cancelledOrders: Scalars['Int']['output'];
  deliveredOrders: Scalars['Int']['output'];
  pendingOrders: Scalars['Int']['output'];
  processingOrders: Scalars['Int']['output'];
  shippedOrders: Scalars['Int']['output'];
  totalOrders: Scalars['Int']['output'];
  totalRevenue: Scalars['Decimal']['output'];
};

export enum OrderStatus {
  cancelled = 'cancelled',
  confirmed = 'confirmed',
  delivered = 'delivered',
  pending = 'pending',
  processing = 'processing',
  refunded = 'refunded',
  shipped = 'shipped'
}

export type OrderTracking = {
  __typename?: 'OrderTracking';
  actualDelivery?: Maybe<Scalars['DateTime']['output']>;
  carrier?: Maybe<Carrier>;
  carrierId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  estimatedDelivery?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  location?: Maybe<Scalars['String']['output']>;
  order: Order;
  orderId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  trackingNumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

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

export type PaginatedReviews = {
  __typename?: 'PaginatedReviews';
  hasMore: Scalars['Boolean']['output'];
  reviews: Array<ProductReview>;
  total: Scalars['Int']['output'];
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  hasMore: Scalars['Boolean']['output'];
  total: Scalars['Int']['output'];
  users: Array<User>;
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  amount: Scalars['Decimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  metadata: Scalars['JSON']['output'];
  order: Order;
  orderId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  transactionId?: Maybe<Scalars['String']['output']>;
  type: PaymentMethodType;
  updatedAt: Scalars['DateTime']['output'];
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
  appEvents: Array<AppEvent>;
  attributes: Scalars['JSON']['output'];
  cartItems: Array<ShoppingCartItem>;
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
  inventoryTransactions: Array<InventoryTransaction>;
  isActive: Scalars['Boolean']['output'];
  isInStock: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  orderItems: Array<OrderItem>;
  price: Scalars['Decimal']['output'];
  rating?: Maybe<Scalars['Decimal']['output']>;
  reviewCount: Scalars['Int']['output'];
  reviews: Array<ProductReview>;
  salePrice?: Maybe<Scalars['Decimal']['output']>;
  sku: Scalars['String']['output'];
  stockAlerts: Array<StockAlert>;
  stockQuantity: Scalars['Int']['output'];
  tags: Array<Scalars['String']['output']>;
  totalStock: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variants: Array<ProductVariant>;
};

export type ProductAnalytics = {
  __typename?: 'ProductAnalytics';
  activeProducts: Scalars['Int']['output'];
  averageRating: Scalars['Decimal']['output'];
  lowStockProducts: Scalars['Int']['output'];
  outOfStockProducts: Scalars['Int']['output'];
  topRatedProducts: Array<Product>;
  topSellingProducts: Array<Product>;
  totalProducts: Scalars['Int']['output'];
  totalReviews: Scalars['Int']['output'];
};

export type ProductFilterInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  inStock?: InputMaybe<Scalars['Boolean']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maxPrice?: InputMaybe<Scalars['Decimal']['input']>;
  minPrice?: InputMaybe<Scalars['Decimal']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ProductPaginationInfo = {
  __typename?: 'ProductPaginationInfo';
  currentPage: Scalars['Int']['output'];
  hasMore: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type ProductReview = {
  __typename?: 'ProductReview';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  helpfulCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isApproved: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  photos: Array<ReviewPhoto>;
  product: Product;
  productId: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user: UserProfile;
  userId: Scalars['ID']['output'];
  votes: Array<ReviewVote>;
};

export type ProductStats = {
  __typename?: 'ProductStats';
  activeProducts: Scalars['Int']['output'];
  totalCategories: Scalars['Int']['output'];
  totalProducts: Scalars['Int']['output'];
};

export type ProductVariant = {
  __typename?: 'ProductVariant';
  attributes: Scalars['JSON']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isInStock: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Decimal']['output'];
  product: Product;
  productId: Scalars['ID']['output'];
  sku: Scalars['String']['output'];
  stockQuantity: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PushNotification = {
  __typename?: 'PushNotification';
  body: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  data: Scalars['JSON']['output'];
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  failedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  readAt?: Maybe<Scalars['DateTime']['output']>;
  sentAt?: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
  type: NotificationType;
  updatedAt: Scalars['DateTime']['output'];
  user: UserProfile;
  userId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  activeCoupons: Array<Coupon>;
  activeSessions: Array<UserSession>;
  activeUsers: Array<User>;
  carrier?: Maybe<Carrier>;
  carriers: Array<Carrier>;
  cartItem?: Maybe<ShoppingCart>;
  categories: GetCategoriesResponse;
  category: GetCategoryResponse;
  categoryBySlug: GetCategoryResponse;
  coupon?: Maybe<Coupon>;
  couponByCode?: Maybe<Coupon>;
  coupons: Array<Coupon>;
  currentUser?: Maybe<User>;
  dashboardMetrics: DashboardMetrics;
  deliverySlots: Array<DeliverySlot>;
  emailTemplates: Array<EmailTemplate>;
  health: Scalars['String']['output'];
  image?: Maybe<Image>;
  images: Array<Image>;
  inventoryTransactions: Array<InventoryTransaction>;
  isProductFavorited: Scalars['Boolean']['output'];
  isSubscribedToNewsletter: Scalars['Boolean']['output'];
  lowStockProducts: Array<Product>;
  loyaltyPrograms: Array<LoyaltyProgram>;
  newsletterSubscriptions: Array<NewsletterSubscription>;
  notificationTemplates: Array<NotificationTemplate>;
  order?: Maybe<Order>;
  orderAnalytics: OrderAnalytics;
  orderByNumber?: Maybe<Order>;
  orderItems: Array<OrderItem>;
  orderStats: OrderStats;
  orderTracking: Array<OrderTracking>;
  orderTransactions: Array<Transaction>;
  orders: PaginatedOrders;
  outOfStockProducts: Array<Product>;
  paymentMethod?: Maybe<PaymentMethod>;
  product: GetProductResponse;
  productAnalytics: ProductAnalytics;
  productAppEvents: Array<AppEvent>;
  productBySku: GetProductResponse;
  productReviews: PaginatedReviews;
  productStats: ProductStats;
  productVariant?: Maybe<ProductVariant>;
  productVariants: Array<ProductVariant>;
  products: GetProductsResponse;
  productsByCategory: PaginatedProducts;
  review?: Maybe<ProductReview>;
  reviewVotes: Array<ReviewVote>;
  savedPaymentMethods: Array<SavedPaymentMethod>;
  searchProducts: PaginatedProducts;
  searchUsers: Array<User>;
  shippingRates: Array<ShippingRate>;
  shippingZone?: Maybe<ShippingZone>;
  shippingZones: Array<ShippingZone>;
  stockAlerts: Array<StockAlert>;
  storeSetting?: Maybe<StoreSettings>;
  storeSettings: Array<StoreSettings>;
  taxRate?: Maybe<TaxRate>;
  taxRates: Array<TaxRate>;
  transaction?: Maybe<Transaction>;
  unreadNotifications: Array<PushNotification>;
  user?: Maybe<User>;
  userAccounts: Array<UserAccount>;
  userActivitySummary: UserActivitySummary;
  userAddress?: Maybe<UserAddress>;
  userAddresses: Array<UserAddress>;
  userAnalytics: UserAnalytics;
  userAppEvents: Array<AppEvent>;
  userAuditLogs: Array<AuditLog>;
  userCart: Array<ShoppingCart>;
  userCouponUsage: Array<CouponUsage>;
  userFavoriteStats: UserFavoriteStats;
  userFavorites: Array<UserFavorite>;
  userNotifications: Array<PushNotification>;
  userOrderHistory: UserOrderHistoryResponse;
  userOrders: PaginatedOrders;
  userPaymentMethods: Array<PaymentMethod>;
  userProfile?: Maybe<UserProfile>;
  userReviews: Array<ProductReview>;
  userRewardBalance: Scalars['Int']['output'];
  userRewardPoints: Array<RewardPoint>;
  userSecurityEvents: Array<SecurityEvent>;
  userSessionAnalytics: Array<UserSessionAnalytics>;
  userSessions: Array<UserSession>;
  userStats: UserStats;
  userTransactions: Array<Transaction>;
  users: PaginatedUsers;
  usersByProvider: Array<User>;
  usersByRole: Array<User>;
};


export type QueryActiveSessionsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryCarrierArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCartItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCategoriesArgs = {
  filters?: InputMaybe<CategoryFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCategoryBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryCouponArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCouponByCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryImageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryImagesArgs = {
  entityId?: InputMaybe<Scalars['String']['input']>;
  entityType?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInventoryTransactionsArgs = {
  productId: Scalars['ID']['input'];
};


export type QueryIsProductFavoritedArgs = {
  productId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type QueryIsSubscribedToNewsletterArgs = {
  email: Scalars['String']['input'];
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


export type QueryOrderTrackingArgs = {
  orderId: Scalars['ID']['input'];
};


export type QueryOrderTransactionsArgs = {
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


export type QueryProductAppEventsArgs = {
  productId: Scalars['ID']['input'];
};


export type QueryProductBySkuArgs = {
  sku: Scalars['String']['input'];
};


export type QueryProductReviewsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  productId: Scalars['ID']['input'];
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


export type QueryReviewArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReviewVotesArgs = {
  reviewId: Scalars['ID']['input'];
};


export type QuerySavedPaymentMethodsArgs = {
  userId: Scalars['ID']['input'];
};


export type QuerySearchProductsArgs = {
  filter?: InputMaybe<ProductFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  query: Scalars['String']['input'];
};


export type QuerySearchUsersArgs = {
  query: Scalars['String']['input'];
};


export type QueryShippingRatesArgs = {
  zoneId: Scalars['ID']['input'];
};


export type QueryShippingZoneArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStoreSettingArgs = {
  key: Scalars['String']['input'];
};


export type QueryTaxRateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUnreadNotificationsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserAccountsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserActivitySummaryArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserAddressArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserAddressesArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserAppEventsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserAuditLogsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserCartArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserCouponUsageArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserFavoriteStatsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserFavoritesArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserNotificationsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserOrderHistoryArgs = {
  filter?: InputMaybe<UserOrderHistoryFilter>;
  pagination?: InputMaybe<PaginationInput>;
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


export type QueryUserReviewsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserRewardBalanceArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserRewardPointsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserSecurityEventsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserSessionAnalyticsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserSessionsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserTransactionsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryUsersByProviderArgs = {
  provider: AuthProvider;
};


export type QueryUsersByRoleArgs = {
  role: UserRole;
};

export type ResponseMetadata = {
  __typename?: 'ResponseMetadata';
  duration?: Maybe<Scalars['Int']['output']>;
  requestId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  traceId?: Maybe<Scalars['String']['output']>;
};

export type ReviewPhoto = {
  __typename?: 'ReviewPhoto';
  caption?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  review: ProductReview;
  reviewId: Scalars['ID']['output'];
  sortOrder: Scalars['Int']['output'];
};

export type ReviewVote = {
  __typename?: 'ReviewVote';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isHelpful: Scalars['Boolean']['output'];
  review: ProductReview;
  reviewId: Scalars['ID']['output'];
  user: UserProfile;
  userId: Scalars['ID']['output'];
};

export type RewardPoint = {
  __typename?: 'RewardPoint';
  createdAt: Scalars['DateTime']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  points: Scalars['Int']['output'];
  type: RewardPointType;
  user: UserProfile;
  userId: Scalars['ID']['output'];
};

export enum RewardPointType {
  bonus = 'bonus',
  earned = 'earned',
  expired = 'expired',
  redeemed = 'redeemed'
}

export type SavedPaymentMethod = {
  __typename?: 'SavedPaymentMethod';
  cardholderName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  expiryMonth?: Maybe<Scalars['Int']['output']>;
  expiryYear?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDefault: Scalars['Boolean']['output'];
  lastFour?: Maybe<Scalars['String']['output']>;
  metadata: Scalars['JSON']['output'];
  provider: Scalars['String']['output'];
  type: PaymentMethodType;
  updatedAt: Scalars['DateTime']['output'];
  user: UserProfile;
  userId: Scalars['ID']['output'];
};

export type SecurityEvent = {
  __typename?: 'SecurityEvent';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  eventType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  metadata: Scalars['JSON']['output'];
  user?: Maybe<UserProfile>;
  userAgent?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type ShippingRate = {
  __typename?: 'ShippingRate';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  maxWeight?: Maybe<Scalars['Decimal']['output']>;
  minWeight?: Maybe<Scalars['Decimal']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['Decimal']['output'];
  updatedAt: Scalars['DateTime']['output'];
  zone: ShippingZone;
  zoneId: Scalars['ID']['output'];
};

export type ShippingZone = {
  __typename?: 'ShippingZone';
  cities: Array<Scalars['String']['output']>;
  countries: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  postalCodes: Array<Scalars['String']['output']>;
  rates: Array<ShippingRate>;
  states: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ShoppingCart = {
  __typename?: 'ShoppingCart';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  items: Array<ShoppingCartItem>;
  sessionId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export type ShoppingCartItem = {
  __typename?: 'ShoppingCartItem';
  cart: ShoppingCart;
  cartId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  price: Scalars['Decimal']['output'];
  product: Product;
  productId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type StockAlert = {
  __typename?: 'StockAlert';
  createdAt: Scalars['DateTime']['output'];
  currentStock: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  product: Product;
  productId: Scalars['ID']['output'];
  threshold: Scalars['Int']['output'];
  type: StockAlertType;
  updatedAt: Scalars['DateTime']['output'];
};

export enum StockAlertType {
  low_stock = 'low_stock',
  out_of_stock = 'out_of_stock',
  overstock = 'overstock'
}

export type StoreSettings = {
  __typename?: 'StoreSettings';
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  settingKey: Scalars['String']['output'];
  settingValue: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SuccessResponse = {
  __typename?: 'SuccessResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type TaxRate = {
  __typename?: 'TaxRate';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  rate: Scalars['Decimal']['output'];
  state?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Decimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  gateway?: Maybe<Scalars['String']['output']>;
  gatewayTransactionId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  metadata: Scalars['JSON']['output'];
  order: Order;
  orderId: Scalars['ID']['output'];
  status: TransactionStatus;
  type: TransactionType;
  updatedAt: Scalars['DateTime']['output'];
  user: UserProfile;
  userId: Scalars['ID']['output'];
};

export enum TransactionStatus {
  cancelled = 'cancelled',
  completed = 'completed',
  failed = 'failed',
  pending = 'pending',
  refunded = 'refunded'
}

export enum TransactionType {
  adjustment = 'adjustment',
  chargeback = 'chargeback',
  payment = 'payment',
  refund = 'refund'
}

export type UpdateCategoryData = {
  __typename?: 'UpdateCategoryData';
  changes: Array<Scalars['String']['output']>;
  entity: Category;
  id: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
};

export type UpdateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateCategoryResponse = {
  __typename?: 'UpdateCategoryResponse';
  code: Scalars['String']['output'];
  data?: Maybe<UpdateCategoryData>;
  message: Scalars['String']['output'];
  metadata?: Maybe<ResponseMetadata>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type UpdateCouponInput = {
  applicableCategories?: InputMaybe<Array<Scalars['String']['input']>>;
  applicableProducts?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  discountValue?: InputMaybe<Scalars['Decimal']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isFirstTimeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  maximumDiscount?: InputMaybe<Scalars['Decimal']['input']>;
  minimumAmount?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  usageLimit?: InputMaybe<Scalars['Int']['input']>;
  validFrom?: InputMaybe<Scalars['DateTime']['input']>;
  validUntil?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateOrderInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrderStatus>;
};

export type UpdatePaymentMethodInput = {
  amount?: InputMaybe<Scalars['Decimal']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<PaymentMethodType>;
};

export type UpdateProductData = {
  __typename?: 'UpdateProductData';
  changes: Array<Scalars['String']['output']>;
  entity: Product;
  id: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
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

export type UpdateProductResponse = {
  __typename?: 'UpdateProductResponse';
  code: Scalars['String']['output'];
  data?: Maybe<UpdateProductData>;
  message: Scalars['String']['output'];
  metadata?: Maybe<ResponseMetadata>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
};

export type UpdateProductReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  isApproved?: InputMaybe<Scalars['Boolean']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductVariantInput = {
  attributes?: InputMaybe<Scalars['JSON']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  stockQuantity?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateSavedPaymentMethodInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
};

export type UpdateUserAddressInput = {
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  profile?: InputMaybe<UpdateUserProfileInput>;
  role?: InputMaybe<UserRole>;
};

export type UpdateUserProfileInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

export type UploadResponse = {
  __typename?: 'UploadResponse';
  filename?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  accounts: Array<UserAccount>;
  addresses: Array<UserAddress>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  profile?: Maybe<UserProfile>;
  role: UserRole;
  sessions: Array<UserSession>;
  sessionsAnalytics: Array<UserSessionAnalytics>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserAccount = {
  __typename?: 'UserAccount';
  accessToken?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  idToken?: Maybe<Scalars['String']['output']>;
  provider: AuthProvider;
  providerAccountId: Scalars['String']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
  scope?: Maybe<Scalars['String']['output']>;
  tokenType?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type UserActivitySummary = {
  __typename?: 'UserActivitySummary';
  cartItemsCount: Scalars['Int']['output'];
  favoriteProducts: Array<Product>;
  joinDate: Scalars['DateTime']['output'];
  lastActivity: Scalars['DateTime']['output'];
  recentOrders: Array<Order>;
  totalSpent: Scalars['Decimal']['output'];
};

export type UserAddress = {
  __typename?: 'UserAddress';
  address1: Scalars['String']['output'];
  address2?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  company?: Maybe<Scalars['String']['output']>;
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  firstName: Scalars['String']['output'];
  fullAddress: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  orders: Array<Order>;
  phone?: Maybe<Scalars['String']['output']>;
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserProfile;
  userId: Scalars['ID']['output'];
};

export type UserAnalytics = {
  __typename?: 'UserAnalytics';
  activeUsers: Scalars['Int']['output'];
  newUsersThisMonth: Scalars['Int']['output'];
  topSpenders: Array<UserProfile>;
  totalUsers: Scalars['Int']['output'];
  userEngagement: Scalars['JSON']['output'];
  usersByRole: Scalars['JSON']['output'];
};

export type UserFavorite = {
  __typename?: 'UserFavorite';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  product: Product;
  productId: Scalars['ID']['output'];
  user: UserProfile;
  userId: Scalars['ID']['output'];
};

export type UserFavoriteStats = {
  __typename?: 'UserFavoriteStats';
  favoriteCategories: Array<Scalars['String']['output']>;
  recentFavorites: Array<UserFavorite>;
  totalFavorites: Scalars['Int']['output'];
};

export type UserFilterInput = {
  emailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<UserRole>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type UserOrderHistoryFilter = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  maxAmount?: InputMaybe<Scalars['Decimal']['input']>;
  minAmount?: InputMaybe<Scalars['Decimal']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<OrderStatus>;
};

export type UserOrderHistoryResponse = {
  __typename?: 'UserOrderHistoryResponse';
  hasMore: Scalars['Boolean']['output'];
  orders: Array<Order>;
  stats: UserOrderHistoryStats;
  total: Scalars['Int']['output'];
};

export type UserOrderHistoryStats = {
  __typename?: 'UserOrderHistoryStats';
  averageOrderValue: Scalars['Decimal']['output'];
  lastOrderDate?: Maybe<Scalars['DateTime']['output']>;
  ordersByStatus: Scalars['JSON']['output'];
  totalOrders: Scalars['Int']['output'];
  totalSpent: Scalars['Decimal']['output'];
};

export type UserProfile = {
  __typename?: 'UserProfile';
  addresses: Array<UserAddress>;
  appEvents: Array<AppEvent>;
  auditLogs: Array<AuditLog>;
  avatar?: Maybe<Scalars['String']['output']>;
  cartItems: Array<ShoppingCartItem>;
  couponUsage: Array<CouponUsage>;
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  favorites: Array<UserFavorite>;
  firstName: Scalars['String']['output'];
  fullName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  lastName: Scalars['String']['output'];
  newsletterSubscriptions: Array<NewsletterSubscription>;
  orders: Array<Order>;
  paymentMethods: Array<PaymentMethod>;
  phone?: Maybe<Scalars['String']['output']>;
  productReviews: Array<ProductReview>;
  pushNotifications: Array<PushNotification>;
  reviewVotes: Array<ReviewVote>;
  rewardPoints: Array<RewardPoint>;
  role: UserRole;
  savedPaymentMethods: Array<SavedPaymentMethod>;
  securityEvents: Array<SecurityEvent>;
  transactions: Array<Transaction>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum UserRole {
  admin = 'admin',
  customer = 'customer',
  staff = 'staff'
}

export type UserSession = {
  __typename?: 'UserSession';
  accessToken: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
  sessionToken: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
};

export type UserSessionAnalytics = {
  __typename?: 'UserSessionAnalytics';
  bounceRate: Scalars['Float']['output'];
  browser?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  conversionRate: Scalars['Float']['output'];
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deviceType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  os?: Maybe<Scalars['String']['output']>;
  pageViews: Scalars['Int']['output'];
  sessionId: Scalars['String']['output'];
  timeSpent: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type UserStats = {
  __typename?: 'UserStats';
  activeUsers: Scalars['Int']['output'];
  newUsersThisMonth: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
  usersByRole: Scalars['JSON']['output'];
};

export type RegisterUserMutationVariables = Exact<{
  input: CreateUserProfileInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'AuthResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'AuthData', accessToken?: string | null, refreshToken?: string | null, user?: { __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null } | null } | null } | null, metadata?: { __typename?: 'ResponseMetadata', requestId?: string | null, traceId?: string | null, duration?: number | null, timestamp: string } | null } };

export type LoginUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'AuthResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'AuthData', accessToken?: string | null, refreshToken?: string | null, user?: { __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null } | null } | null } | null, metadata?: { __typename?: 'ResponseMetadata', requestId?: string | null, traceId?: string | null, duration?: number | null, timestamp: string } | null } };

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = { __typename?: 'Mutation', logoutUser: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'AuthData', accessToken?: string | null, refreshToken?: string | null, user?: { __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null } | null } | null } | null, metadata?: { __typename?: 'ResponseMetadata', requestId?: string | null, traceId?: string | null, duration?: number | null, timestamp: string } | null } };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null } | null } | null };

export type GetCategoriesQueryVariables = Exact<{
  filters?: InputMaybe<CategoryFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetCategoriesQuery = { __typename?: 'Query', categories: { __typename?: 'GetCategoriesResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'GetCategoriesData', items: Array<{ __typename?: 'Category', id: string, name: string, description?: string | null, slug: string, image?: string | null, isActive: boolean, sortOrder: number, createdAt: string, updatedAt: string, products: Array<{ __typename?: 'Product', id: string, name: string, sku: string, isActive: boolean }> }>, pagination: { __typename?: 'CategoryPaginationInfo', total: number, limit: number, offset: number, hasMore: boolean, currentPage: number, totalPages: number } } | null, metadata?: { __typename?: 'ResponseMetadata', requestId?: string | null, traceId?: string | null, duration?: number | null, timestamp: string } | null } };

export type GetCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCategoryQuery = { __typename?: 'Query', category: { __typename?: 'GetCategoryResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'GetCategoryData', entity: { __typename?: 'Category', id: string, name: string, description?: string | null, slug: string, image?: string | null, isActive: boolean, sortOrder: number, createdAt: string, updatedAt: string, products: Array<{ __typename?: 'Product', id: string, name: string, description?: string | null, price: number, salePrice?: number | null, sku: string, images: Array<string>, attributes: any, isActive: boolean, stockQuantity: number, tags: Array<string>, rating?: number | null, reviewCount: number, currentPrice: number, hasDiscount: boolean, discountPercentage: number, totalStock: number, isInStock: boolean }> } } | null, metadata?: { __typename?: 'ResponseMetadata', requestId?: string | null, traceId?: string | null, duration?: number | null, timestamp: string } | null } };

export type GetCategoryBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetCategoryBySlugQuery = { __typename?: 'Query', categoryBySlug: { __typename?: 'GetCategoryResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'GetCategoryData', entity: { __typename?: 'Category', id: string, name: string, description?: string | null, slug: string, image?: string | null, isActive: boolean, sortOrder: number, createdAt: string, updatedAt: string, products: Array<{ __typename?: 'Product', id: string, name: string, description?: string | null, price: number, salePrice?: number | null, sku: string, images: Array<string>, attributes: any, isActive: boolean, stockQuantity: number, tags: Array<string>, rating?: number | null, reviewCount: number, currentPrice: number, hasDiscount: boolean, discountPercentage: number, totalStock: number, isInStock: boolean }> } } | null, metadata?: { __typename?: 'ResponseMetadata', requestId?: string | null, traceId?: string | null, duration?: number | null, timestamp: string } | null } };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'CreateCategoryResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'CreateCategoryData', entity: { __typename?: 'Category', id: string, name: string, description?: string | null, slug: string, image?: string | null, isActive: boolean, sortOrder: number, createdAt: string, updatedAt: string } } | null, metadata?: { __typename?: 'ResponseMetadata', requestId?: string | null, traceId?: string | null, duration?: number | null, timestamp: string } | null } };

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'UpdateCategoryResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'UpdateCategoryData', id: string, updatedAt: string, changes: Array<string>, entity: { __typename?: 'Category', id: string, name: string, description?: string | null, slug: string, image?: string | null, isActive: boolean, sortOrder: number, createdAt: string, updatedAt: string } } | null, metadata?: { __typename?: 'ResponseMetadata', requestId?: string | null, traceId?: string | null, duration?: number | null, timestamp: string } | null } };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'DeleteCategoryResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'DeleteCategoryData', id: string, deletedAt: string, softDelete: boolean } | null, metadata?: { __typename?: 'ResponseMetadata', requestId?: string | null, traceId?: string | null, duration?: number | null, timestamp: string } | null } };

export type GetOrdersQueryVariables = Exact<{
  filter?: InputMaybe<OrderFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetOrdersQuery = { __typename?: 'Query', orders: { __typename?: 'PaginatedOrders', total: number, hasMore: boolean, orders: Array<{ __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingAmount: number, totalAmount: number, notes?: string | null, createdAt: string, updatedAt: string, user: { __typename?: 'UserProfile', id: string, email: string, firstName: string, lastName: string, phone?: string | null }, items: Array<{ __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, product: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string> } }>, shippingAddress?: { __typename?: 'UserAddress', id: string, type: string, firstName: string, lastName: string, company?: string | null, address1: string, address2?: string | null, city: string, state: string, postalCode: string, country: string, phone?: string | null, isDefault: boolean, fullName: string, fullAddress: string } | null }> } };

export type GetOrderQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOrderQuery = { __typename?: 'Query', order?: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingAmount: number, totalAmount: number, notes?: string | null, createdAt: string, updatedAt: string, user: { __typename?: 'UserProfile', id: string, email: string, firstName: string, lastName: string, phone?: string | null }, items: Array<{ __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, product: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string>, price: number, salePrice?: number | null } }>, shippingAddress?: { __typename?: 'UserAddress', id: string, type: string, firstName: string, lastName: string, company?: string | null, address1: string, address2?: string | null, city: string, state: string, postalCode: string, country: string, phone?: string | null, isDefault: boolean, fullName: string, fullAddress: string } | null } | null };

export type GetOrderByNumberQueryVariables = Exact<{
  orderNumber: Scalars['String']['input'];
}>;


export type GetOrderByNumberQuery = { __typename?: 'Query', orderByNumber?: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingAmount: number, totalAmount: number, notes?: string | null, createdAt: string, updatedAt: string, user: { __typename?: 'UserProfile', id: string, email: string, firstName: string, lastName: string, phone?: string | null }, items: Array<{ __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, product: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string>, price: number, salePrice?: number | null } }>, shippingAddress?: { __typename?: 'UserAddress', id: string, type: string, firstName: string, lastName: string, company?: string | null, address1: string, address2?: string | null, city: string, state: string, postalCode: string, country: string, phone?: string | null, isDefault: boolean, fullName: string, fullAddress: string } | null } | null };

export type GetOrderItemsQueryVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type GetOrderItemsQuery = { __typename?: 'Query', orderItems: Array<{ __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, order: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, totalAmount: number, createdAt: string }, product: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string>, price: number, salePrice?: number | null } }> };

export type GetOrderStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrderStatsQuery = { __typename?: 'Query', orderStats: { __typename?: 'OrderStats', totalOrders: number, pendingOrders: number, processingOrders: number, shippedOrders: number, deliveredOrders: number, cancelledOrders: number, totalRevenue: number, averageOrderValue: number } };

export type CreateOrderMutationVariables = Exact<{
  input: CreateOrderInput;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingAmount: number, totalAmount: number, notes?: string | null, createdAt: string, updatedAt: string, user: { __typename?: 'UserProfile', id: string, email: string, firstName: string, lastName: string, phone?: string | null }, items: Array<{ __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, product: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string> } }>, shippingAddress?: { __typename?: 'UserAddress', id: string, type: string, firstName: string, lastName: string, company?: string | null, address1: string, address2?: string | null, city: string, state: string, postalCode: string, country: string, phone?: string | null, isDefault: boolean, fullName: string, fullAddress: string } | null } };

export type UpdateOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateOrderInput;
}>;


export type UpdateOrderMutation = { __typename?: 'Mutation', updateOrder: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingAmount: number, totalAmount: number, notes?: string | null, createdAt: string, updatedAt: string, user: { __typename?: 'UserProfile', id: string, email: string, firstName: string, lastName: string, phone?: string | null }, items: Array<{ __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, product: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string> } }>, shippingAddress?: { __typename?: 'UserAddress', id: string, type: string, firstName: string, lastName: string, company?: string | null, address1: string, address2?: string | null, city: string, state: string, postalCode: string, country: string, phone?: string | null, isDefault: boolean, fullName: string, fullAddress: string } | null } };

export type UpdateOrderStatusMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  status: OrderStatus;
}>;


export type UpdateOrderStatusMutation = { __typename?: 'Mutation', updateOrderStatus: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingAmount: number, totalAmount: number, notes?: string | null, createdAt: string, updatedAt: string, user: { __typename?: 'UserProfile', id: string, email: string, firstName: string, lastName: string, phone?: string | null } } };

export type CancelOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelOrderMutation = { __typename?: 'Mutation', cancelOrder: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingAmount: number, totalAmount: number, notes?: string | null, createdAt: string, updatedAt: string, user: { __typename?: 'UserProfile', id: string, email: string, firstName: string, lastName: string, phone?: string | null } } };

export type ShipOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
}>;


export type ShipOrderMutation = { __typename?: 'Mutation', shipOrder: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingAmount: number, totalAmount: number, notes?: string | null, createdAt: string, updatedAt: string, user: { __typename?: 'UserProfile', id: string, email: string, firstName: string, lastName: string, phone?: string | null } } };

export type DeliverOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeliverOrderMutation = { __typename?: 'Mutation', deliverOrder: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingAmount: number, totalAmount: number, notes?: string | null, createdAt: string, updatedAt: string, user: { __typename?: 'UserProfile', id: string, email: string, firstName: string, lastName: string, phone?: string | null } } };

export type CreateOrderItemMutationVariables = Exact<{
  input: CreateOrderItemInput;
}>;


export type CreateOrderItemMutation = { __typename?: 'Mutation', createOrderItem: { __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, order: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, totalAmount: number, createdAt: string }, product: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string>, price: number, salePrice?: number | null } } };

export type UpdateOrderItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  unitPrice: Scalars['Decimal']['input'];
}>;


export type UpdateOrderItemMutation = { __typename?: 'Mutation', updateOrderItem: { __typename?: 'OrderItem', id: string, quantity: number, unitPrice: number, totalPrice: number, order: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, totalAmount: number, createdAt: string }, product: { __typename?: 'Product', id: string, name: string, sku: string, images: Array<string>, price: number, salePrice?: number | null } } };

export type DeleteOrderItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOrderItemMutation = { __typename?: 'Mutation', deleteOrderItem: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type GetProductsQueryVariables = Exact<{
  filter?: InputMaybe<ProductFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetProductsQuery = { __typename?: 'Query', products: { __typename?: 'GetProductsResponse', data?: { __typename?: 'GetProductsData', items: Array<{ __typename?: 'Product', id: string, name: string, description?: string | null, price: number, salePrice?: number | null, sku: string, images: Array<string>, attributes: any, isActive: boolean, stockQuantity: number, tags: Array<string>, rating?: number | null, reviewCount: number, createdAt: string, updatedAt: string, currentPrice: number, hasDiscount: boolean, discountPercentage: number, totalStock: number, isInStock: boolean, category?: { __typename?: 'Category', id: string, name: string, slug: string, image?: string | null } | null, variants: Array<{ __typename?: 'ProductVariant', id: string, name: string, price: number, sku: string, stockQuantity: number, attributes: any, isActive: boolean, isInStock: boolean }> }>, pagination: { __typename?: 'ProductPaginationInfo', total: number, limit: number, offset: number, hasMore: boolean, currentPage: number, totalPages: number } } | null } };

export type GetProductQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProductQuery = { __typename?: 'Query', product: { __typename?: 'GetProductResponse', data?: { __typename?: 'GetProductData', entity: { __typename?: 'Product', id: string, name: string, description?: string | null, price: number, salePrice?: number | null, sku: string, images: Array<string>, attributes: any, isActive: boolean, stockQuantity: number, tags: Array<string>, rating?: number | null, reviewCount: number, createdAt: string, updatedAt: string, currentPrice: number, hasDiscount: boolean, discountPercentage: number, totalStock: number, isInStock: boolean, category?: { __typename?: 'Category', id: string, name: string, slug: string, image?: string | null } | null, variants: Array<{ __typename?: 'ProductVariant', id: string, name: string, price: number, sku: string, stockQuantity: number, attributes: any, isActive: boolean, isInStock: boolean }>, reviews: Array<{ __typename?: 'ProductReview', id: string, rating: number, title?: string | null, comment?: string | null, createdAt: string, user: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string } }> } } | null } };

export type GetProductBySkuQueryVariables = Exact<{
  sku: Scalars['String']['input'];
}>;


export type GetProductBySkuQuery = { __typename?: 'Query', productBySku: { __typename?: 'GetProductResponse', data?: { __typename?: 'GetProductData', entity: { __typename?: 'Product', id: string, name: string, description?: string | null, price: number, salePrice?: number | null, sku: string, images: Array<string>, attributes: any, isActive: boolean, stockQuantity: number, tags: Array<string>, rating?: number | null, reviewCount: number, createdAt: string, updatedAt: string, currentPrice: number, hasDiscount: boolean, discountPercentage: number, totalStock: number, isInStock: boolean, category?: { __typename?: 'Category', id: string, name: string, slug: string, image?: string | null } | null, variants: Array<{ __typename?: 'ProductVariant', id: string, name: string, price: number, sku: string, stockQuantity: number, attributes: any, isActive: boolean, isInStock: boolean }> } } | null } };

export type SearchProductsQueryVariables = Exact<{
  query: Scalars['String']['input'];
  filter?: InputMaybe<ProductFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type SearchProductsQuery = { __typename?: 'Query', searchProducts: { __typename?: 'PaginatedProducts', total: number, hasMore: boolean, products: Array<{ __typename?: 'Product', id: string, name: string, description?: string | null, price: number, salePrice?: number | null, sku: string, images: Array<string>, attributes: any, isActive: boolean, stockQuantity: number, tags: Array<string>, rating?: number | null, reviewCount: number, createdAt: string, updatedAt: string, currentPrice: number, hasDiscount: boolean, discountPercentage: number, totalStock: number, isInStock: boolean, category?: { __typename?: 'Category', id: string, name: string, slug: string, image?: string | null } | null }> } };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'CreateProductResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'CreateProductData', id: string, createdAt: string, entity: { __typename?: 'Product', id: string, name: string, description?: string | null, price: number, salePrice?: number | null, sku: string, images: Array<string>, attributes: any, isActive: boolean, stockQuantity: number, tags: Array<string>, rating?: number | null, reviewCount: number, createdAt: string, updatedAt: string, currentPrice: number, hasDiscount: boolean, discountPercentage: number, totalStock: number, isInStock: boolean, category?: { __typename?: 'Category', id: string, name: string, slug: string, image?: string | null } | null } } | null, metadata?: { __typename?: 'ResponseMetadata', requestId?: string | null, traceId?: string | null, duration?: number | null, timestamp: string } | null } };

export type UpdateProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct: { __typename?: 'UpdateProductResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'UpdateProductData', id: string, updatedAt: string, changes: Array<string>, entity: { __typename?: 'Product', id: string, name: string, description?: string | null, price: number, salePrice?: number | null, sku: string, images: Array<string>, attributes: any, isActive: boolean, stockQuantity: number, tags: Array<string>, rating?: number | null, reviewCount: number, createdAt: string, updatedAt: string, currentPrice: number, hasDiscount: boolean, discountPercentage: number, totalStock: number, isInStock: boolean, category?: { __typename?: 'Category', id: string, name: string, slug: string, image?: string | null } | null } } | null, metadata?: { __typename?: 'ResponseMetadata', requestId?: string | null, traceId?: string | null, duration?: number | null, timestamp: string } | null } };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: { __typename?: 'DeleteProductResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'DeleteProductData', id: string, deletedAt: string, softDelete: boolean } | null, metadata?: { __typename?: 'ResponseMetadata', requestId?: string | null, traceId?: string | null, duration?: number | null, timestamp: string } | null } };

export type CreateProductVariantMutationVariables = Exact<{
  input: CreateProductVariantInput;
}>;


export type CreateProductVariantMutation = { __typename?: 'Mutation', createProductVariant: { __typename?: 'ProductVariant', id: string, productId: string, name: string, price: number, sku: string, stockQuantity: number, attributes: any, isActive: boolean, createdAt: string, updatedAt: string, isInStock: boolean, product: { __typename?: 'Product', id: string, name: string, sku: string } } };

export type UpdateProductVariantMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateProductVariantInput;
}>;


export type UpdateProductVariantMutation = { __typename?: 'Mutation', updateProductVariant: { __typename?: 'ProductVariant', id: string, productId: string, name: string, price: number, sku: string, stockQuantity: number, attributes: any, isActive: boolean, createdAt: string, updatedAt: string, isInStock: boolean, product: { __typename?: 'Product', id: string, name: string, sku: string } } };

export type DeleteProductVariantMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProductVariantMutation = { __typename?: 'Mutation', deleteProductVariant: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type UploadImageMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
  entityId: Scalars['String']['input'];
  entityType: Scalars['String']['input'];
}>;


export type UploadImageMutation = { __typename?: 'Mutation', uploadImage: { __typename?: 'UploadResponse', success: boolean, url?: string | null, filename?: string | null, message: string } };

export type GetUsersQueryVariables = Exact<{
  filter?: InputMaybe<UserFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetUsersQuery = { __typename?: 'Query', users: { __typename?: 'PaginatedUsers', total: number, hasMore: boolean, users: Array<{ __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null, role: UserRole, emailVerified: boolean, isActive: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, fullName?: string | null } | null, addresses: Array<{ __typename?: 'UserAddress', id: string, type: string, firstName: string, lastName: string, company?: string | null, address1: string, address2?: string | null, city: string, state: string, postalCode: string, country: string, phone?: string | null, isDefault: boolean, createdAt: string, updatedAt: string, fullName: string, fullAddress: string }> }> } };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null, role: UserRole, emailVerified: boolean, isActive: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, fullName?: string | null } | null, addresses: Array<{ __typename?: 'UserAddress', id: string, type: string, firstName: string, lastName: string, company?: string | null, address1: string, address2?: string | null, city: string, state: string, postalCode: string, country: string, phone?: string | null, isDefault: boolean, createdAt: string, updatedAt: string, fullName: string, fullAddress: string }>, accounts: Array<{ __typename?: 'UserAccount', id: string, provider: AuthProvider, providerAccountId: string, accessToken?: string | null, refreshToken?: string | null, tokenType?: string | null, scope?: string | null, idToken?: string | null, expiresAt?: string | null, createdAt: string, updatedAt: string }>, sessions: Array<{ __typename?: 'UserSession', id: string, sessionToken: string, accessToken: string, refreshToken?: string | null, expiresAt: string, userAgent?: string | null, ipAddress?: string | null, isActive: boolean, createdAt: string, updatedAt: string }> } | null };

export type GetUserProfileQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserProfileQuery = { __typename?: 'Query', userProfile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null, role: UserRole, emailVerified: boolean, isActive: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, fullName?: string | null, addresses: Array<{ __typename?: 'UserAddress', id: string, type: string, firstName: string, lastName: string, company?: string | null, address1: string, address2?: string | null, city: string, state: string, postalCode: string, country: string, phone?: string | null, isDefault: boolean, createdAt: string, updatedAt: string, fullName: string, fullAddress: string }>, orders: Array<{ __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, totalAmount: number, createdAt: string, updatedAt: string }> } | null };

export type GetUserStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserStatsQuery = { __typename?: 'Query', userStats: { __typename?: 'UserStats', totalUsers: number, activeUsers: number, newUsersThisMonth: number, usersByRole: any } };

export type GetUserAddressesQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserAddressesQuery = { __typename?: 'Query', userAddresses: Array<{ __typename?: 'UserAddress', id: string, type: string, firstName: string, lastName: string, company?: string | null, address1: string, address2?: string | null, city: string, state: string, postalCode: string, country: string, phone?: string | null, isDefault: boolean, createdAt: string, updatedAt: string, fullName: string, fullAddress: string }> };

export type GetUserAddressQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserAddressQuery = { __typename?: 'Query', userAddress?: { __typename?: 'UserAddress', id: string, type: string, firstName: string, lastName: string, company?: string | null, address1: string, address2?: string | null, city: string, state: string, postalCode: string, country: string, phone?: string | null, isDefault: boolean, createdAt: string, updatedAt: string, fullName: string, fullAddress: string, user: { __typename?: 'UserProfile', id: string, email: string, firstName: string, lastName: string } } | null };

export type SearchUsersQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: Array<{ __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null, role: UserRole, emailVerified: boolean, isActive: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, fullName?: string | null } | null }> };

export type GetActiveUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveUsersQuery = { __typename?: 'Query', activeUsers: Array<{ __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null, role: UserRole, emailVerified: boolean, isActive: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, fullName?: string | null } | null }> };

export type GetUsersByRoleQueryVariables = Exact<{
  role: UserRole;
}>;


export type GetUsersByRoleQuery = { __typename?: 'Query', usersByRole: Array<{ __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null, role: UserRole, emailVerified: boolean, isActive: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, fullName?: string | null } | null }> };

export type GetUsersByProviderQueryVariables = Exact<{
  provider: AuthProvider;
}>;


export type GetUsersByProviderQuery = { __typename?: 'Query', usersByProvider: Array<{ __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null, role: UserRole, emailVerified: boolean, isActive: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, fullName?: string | null } | null }> };

export type GetUserOrderHistoryQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  filter?: InputMaybe<UserOrderHistoryFilter>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetUserOrderHistoryQuery = { __typename?: 'Query', userOrderHistory: { __typename?: 'UserOrderHistoryResponse', total: number, hasMore: boolean, orders: Array<{ __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, subtotal: number, taxAmount: number, shippingAmount: number, totalAmount: number, createdAt: string, updatedAt: string }>, stats: { __typename?: 'UserOrderHistoryStats', totalOrders: number, totalSpent: number, averageOrderValue: number, lastOrderDate?: string | null, ordersByStatus: any } } };

export type GetUserFavoriteStatsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserFavoriteStatsQuery = { __typename?: 'Query', userFavoriteStats: { __typename?: 'UserFavoriteStats', totalFavorites: number, favoriteCategories: Array<string>, recentFavorites: Array<{ __typename?: 'UserFavorite', id: string, createdAt: string, product: { __typename?: 'Product', id: string, name: string, price: number, images: Array<string> } }> } };

export type GetUserActivitySummaryQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserActivitySummaryQuery = { __typename?: 'Query', userActivitySummary: { __typename?: 'UserActivitySummary', joinDate: string, lastActivity: string, totalSpent: number, cartItemsCount: number, favoriteProducts: Array<{ __typename?: 'Product', id: string, name: string, price: number, images: Array<string> }>, recentOrders: Array<{ __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, totalAmount: number, createdAt: string }> } };

export type GetUserAccountsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserAccountsQuery = { __typename?: 'Query', userAccounts: Array<{ __typename?: 'UserAccount', id: string, provider: AuthProvider, providerAccountId: string, accessToken?: string | null, refreshToken?: string | null, tokenType?: string | null, scope?: string | null, idToken?: string | null, expiresAt?: string | null, createdAt: string, updatedAt: string }> };

export type GetUserSessionsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserSessionsQuery = { __typename?: 'Query', userSessions: Array<{ __typename?: 'UserSession', id: string, sessionToken: string, accessToken: string, refreshToken?: string | null, expiresAt: string, userAgent?: string | null, ipAddress?: string | null, isActive: boolean, createdAt: string, updatedAt: string }> };

export type GetActiveSessionsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetActiveSessionsQuery = { __typename?: 'Query', activeSessions: Array<{ __typename?: 'UserSession', id: string, sessionToken: string, accessToken: string, refreshToken?: string | null, expiresAt: string, userAgent?: string | null, ipAddress?: string | null, isActive: boolean, createdAt: string, updatedAt: string }> };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserProfileInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'CreateUserResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'CreateUserData', id: string, createdAt: string, entity: { __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null, role: UserRole, emailVerified: boolean, isActive: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, fullName?: string | null } | null } } | null } };

export type UpdateUserOptimizedMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
}>;


export type UpdateUserOptimizedMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null } | null } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null, role: UserRole, emailVerified: boolean, isActive: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, fullName?: string | null } | null } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type ActivateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ActivateUserMutation = { __typename?: 'Mutation', activateUser: { __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null, role: UserRole, emailVerified: boolean, isActive: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, fullName?: string | null } | null } };

export type DeactivateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeactivateUserMutation = { __typename?: 'Mutation', deactivateUser: { __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null, role: UserRole, emailVerified: boolean, isActive: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, fullName?: string | null } | null } };

export type CreateUserProfileMutationVariables = Exact<{
  input: CreateUserProfileInput;
}>;


export type CreateUserProfileMutation = { __typename?: 'Mutation', createUserProfile: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null, role: UserRole, emailVerified: boolean, isActive: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, fullName?: string | null } };

export type UpdateUserProfileMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  input: UpdateUserProfileInput;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateUserProfile: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null, role: UserRole, emailVerified: boolean, isActive: boolean, lastLoginAt?: string | null, createdAt: string, updatedAt: string, fullName?: string | null } };

export type DeleteUserProfileMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type DeleteUserProfileMutation = { __typename?: 'Mutation', deleteUserProfile: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type CreateUserAddressMutationVariables = Exact<{
  input: CreateUserAddressInput;
}>;


export type CreateUserAddressMutation = { __typename?: 'Mutation', createUserAddress: { __typename?: 'UserAddress', id: string, type: string, firstName: string, lastName: string, company?: string | null, address1: string, address2?: string | null, city: string, state: string, postalCode: string, country: string, phone?: string | null, isDefault: boolean, createdAt: string, updatedAt: string, fullName: string, fullAddress: string } };

export type UpdateUserAddressMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateUserAddressInput;
}>;


export type UpdateUserAddressMutation = { __typename?: 'Mutation', updateUserAddress: { __typename?: 'UserAddress', id: string, type: string, firstName: string, lastName: string, company?: string | null, address1: string, address2?: string | null, city: string, state: string, postalCode: string, country: string, phone?: string | null, isDefault: boolean, createdAt: string, updatedAt: string, fullName: string, fullAddress: string } };

export type DeleteUserAddressMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserAddressMutation = { __typename?: 'Mutation', deleteUserAddress: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type SetDefaultAddressMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  addressId: Scalars['ID']['input'];
}>;


export type SetDefaultAddressMutation = { __typename?: 'Mutation', setDefaultAddress: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type RevokeUserSessionMutationVariables = Exact<{
  sessionId: Scalars['ID']['input'];
}>;


export type RevokeUserSessionMutation = { __typename?: 'Mutation', revokeUserSession: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type RevokeAllUserSessionsMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type RevokeAllUserSessionsMutation = { __typename?: 'Mutation', revokeAllUserSessions: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type UnlinkUserAccountMutationVariables = Exact<{
  accountId: Scalars['ID']['input'];
}>;


export type UnlinkUserAccountMutation = { __typename?: 'Mutation', unlinkUserAccount: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type ForcePasswordResetMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type ForcePasswordResetMutation = { __typename?: 'Mutation', forcePasswordReset: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type ImpersonateUserMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type ImpersonateUserMutation = { __typename?: 'Mutation', impersonateUser: { __typename?: 'AuthResponse', success: boolean, message: string, code: string, timestamp: string, data?: { __typename?: 'AuthData', accessToken?: string | null, refreshToken?: string | null, user?: { __typename?: 'User', id: string, email: string, role: UserRole, isActive: boolean, emailVerified: boolean, lastLoginAt?: string | null, profile?: { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, phone?: string | null, dateOfBirth?: string | null, avatar?: string | null } | null } | null } | null, metadata?: { __typename?: 'ResponseMetadata', requestId?: string | null, traceId?: string | null, duration?: number | null, timestamp: string } | null } };


export const RegisterUserDocument = gql`
    mutation RegisterUser($input: CreateUserProfileInput!) {
  registerUser(input: $input) {
    success
    message
    code
    timestamp
    data {
      user {
        id
        email
        role
        isActive
        emailVerified
        lastLoginAt
        profile {
          id
          firstName
          lastName
          phone
          dateOfBirth
          avatar
        }
      }
      accessToken
      refreshToken
    }
    metadata {
      requestId
      traceId
      duration
      timestamp
    }
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const LoginUserDocument = gql`
    mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    success
    message
    code
    timestamp
    data {
      user {
        id
        email
        role
        isActive
        emailVerified
        lastLoginAt
        profile {
          id
          firstName
          lastName
          phone
          dateOfBirth
          avatar
        }
      }
      accessToken
      refreshToken
    }
    metadata {
      requestId
      traceId
      duration
      timestamp
    }
  }
}
    `;
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const LogoutUserDocument = gql`
    mutation LogoutUser {
  logoutUser {
    success
    message
  }
}
    `;
export type LogoutUserMutationFn = Apollo.MutationFunction<LogoutUserMutation, LogoutUserMutationVariables>;

/**
 * __useLogoutUserMutation__
 *
 * To run a mutation, you first call `useLogoutUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutUserMutation, { data, loading, error }] = useLogoutUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutUserMutation, LogoutUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument, options);
      }
export type LogoutUserMutationHookResult = ReturnType<typeof useLogoutUserMutation>;
export type LogoutUserMutationResult = Apollo.MutationResult<LogoutUserMutation>;
export type LogoutUserMutationOptions = Apollo.BaseMutationOptions<LogoutUserMutation, LogoutUserMutationVariables>;
export const RefreshTokenDocument = gql`
    mutation RefreshToken($refreshToken: String!) {
  refreshToken(refreshToken: $refreshToken) {
    success
    message
    code
    timestamp
    data {
      user {
        id
        email
        role
        isActive
        emailVerified
        lastLoginAt
        profile {
          id
          firstName
          lastName
          phone
          dateOfBirth
          avatar
        }
      }
      accessToken
      refreshToken
    }
    metadata {
      requestId
      traceId
      duration
      timestamp
    }
  }
}
    `;
export type RefreshTokenMutationFn = Apollo.MutationFunction<RefreshTokenMutation, RefreshTokenMutationVariables>;

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *      refreshToken: // value for 'refreshToken'
 *   },
 * });
 */
export function useRefreshTokenMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RefreshTokenMutation, RefreshTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, options);
      }
export type RefreshTokenMutationHookResult = ReturnType<typeof useRefreshTokenMutation>;
export type RefreshTokenMutationResult = Apollo.MutationResult<RefreshTokenMutation>;
export type RefreshTokenMutationOptions = Apollo.BaseMutationOptions<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  currentUser {
    id
    email
    role
    isActive
    emailVerified
    lastLoginAt
    profile {
      id
      firstName
      lastName
      phone
      dateOfBirth
      avatar
    }
  }
}
    `;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export function useGetCurrentUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserSuspenseQueryHookResult = ReturnType<typeof useGetCurrentUserSuspenseQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export function refetchGetCurrentUserQuery(variables?: GetCurrentUserQueryVariables) {
      return { query: GetCurrentUserDocument, variables: variables }
    }
export const GetCategoriesDocument = gql`
    query GetCategories($filters: CategoryFilterInput, $pagination: PaginationInput) {
  categories(filters: $filters, pagination: $pagination) {
    success
    message
    code
    timestamp
    data {
      items {
        id
        name
        description
        slug
        image
        isActive
        sortOrder
        createdAt
        updatedAt
        products {
          id
          name
          sku
          isActive
        }
      }
      pagination {
        total
        limit
        offset
        hasMore
        currentPage
        totalPages
      }
    }
    metadata {
      requestId
      traceId
      duration
      timestamp
    }
  }
}
    `;

/**
 * __useGetCategoriesQuery__
 *
 * To run a query within a React component, call `useGetCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
      }
export function useGetCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
        }
export function useGetCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
        }
export type GetCategoriesQueryHookResult = ReturnType<typeof useGetCategoriesQuery>;
export type GetCategoriesLazyQueryHookResult = ReturnType<typeof useGetCategoriesLazyQuery>;
export type GetCategoriesSuspenseQueryHookResult = ReturnType<typeof useGetCategoriesSuspenseQuery>;
export type GetCategoriesQueryResult = Apollo.QueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>;
export function refetchGetCategoriesQuery(variables?: GetCategoriesQueryVariables) {
      return { query: GetCategoriesDocument, variables: variables }
    }
export const GetCategoryDocument = gql`
    query GetCategory($id: ID!) {
  category(id: $id) {
    success
    message
    code
    timestamp
    data {
      entity {
        id
        name
        description
        slug
        image
        isActive
        sortOrder
        createdAt
        updatedAt
        products {
          id
          name
          description
          price
          salePrice
          sku
          images
          attributes
          isActive
          stockQuantity
          tags
          rating
          reviewCount
          currentPrice
          hasDiscount
          discountPercentage
          totalStock
          isInStock
        }
      }
    }
    metadata {
      requestId
      traceId
      duration
      timestamp
    }
  }
}
    `;

/**
 * __useGetCategoryQuery__
 *
 * To run a query within a React component, call `useGetCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCategoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables> & ({ variables: GetCategoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetCategoryQuery, GetCategoryQueryVariables>(GetCategoryDocument, options);
      }
export function useGetCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetCategoryQuery, GetCategoryQueryVariables>(GetCategoryDocument, options);
        }
export function useGetCategorySuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetCategoryQuery, GetCategoryQueryVariables>(GetCategoryDocument, options);
        }
export type GetCategoryQueryHookResult = ReturnType<typeof useGetCategoryQuery>;
export type GetCategoryLazyQueryHookResult = ReturnType<typeof useGetCategoryLazyQuery>;
export type GetCategorySuspenseQueryHookResult = ReturnType<typeof useGetCategorySuspenseQuery>;
export type GetCategoryQueryResult = Apollo.QueryResult<GetCategoryQuery, GetCategoryQueryVariables>;
export function refetchGetCategoryQuery(variables: GetCategoryQueryVariables) {
      return { query: GetCategoryDocument, variables: variables }
    }
export const GetCategoryBySlugDocument = gql`
    query GetCategoryBySlug($slug: String!) {
  categoryBySlug(slug: $slug) {
    success
    message
    code
    timestamp
    data {
      entity {
        id
        name
        description
        slug
        image
        isActive
        sortOrder
        createdAt
        updatedAt
        products {
          id
          name
          description
          price
          salePrice
          sku
          images
          attributes
          isActive
          stockQuantity
          tags
          rating
          reviewCount
          currentPrice
          hasDiscount
          discountPercentage
          totalStock
          isInStock
        }
      }
    }
    metadata {
      requestId
      traceId
      duration
      timestamp
    }
  }
}
    `;

/**
 * __useGetCategoryBySlugQuery__
 *
 * To run a query within a React component, call `useGetCategoryBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoryBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoryBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetCategoryBySlugQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables> & ({ variables: GetCategoryBySlugQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables>(GetCategoryBySlugDocument, options);
      }
export function useGetCategoryBySlugLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables>(GetCategoryBySlugDocument, options);
        }
export function useGetCategoryBySlugSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables>(GetCategoryBySlugDocument, options);
        }
export type GetCategoryBySlugQueryHookResult = ReturnType<typeof useGetCategoryBySlugQuery>;
export type GetCategoryBySlugLazyQueryHookResult = ReturnType<typeof useGetCategoryBySlugLazyQuery>;
export type GetCategoryBySlugSuspenseQueryHookResult = ReturnType<typeof useGetCategoryBySlugSuspenseQuery>;
export type GetCategoryBySlugQueryResult = Apollo.QueryResult<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables>;
export function refetchGetCategoryBySlugQuery(variables: GetCategoryBySlugQueryVariables) {
      return { query: GetCategoryBySlugDocument, variables: variables }
    }
export const CreateCategoryDocument = gql`
    mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    success
    message
    code
    timestamp
    data {
      entity {
        id
        name
        description
        slug
        image
        isActive
        sortOrder
        createdAt
        updatedAt
      }
    }
    metadata {
      requestId
      traceId
      duration
      timestamp
    }
  }
}
    `;
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
  updateCategory(id: $id, input: $input) {
    success
    message
    code
    timestamp
    data {
      entity {
        id
        name
        description
        slug
        image
        isActive
        sortOrder
        createdAt
        updatedAt
      }
      id
      updatedAt
      changes
    }
    metadata {
      requestId
      traceId
      duration
      timestamp
    }
  }
}
    `;
export type UpdateCategoryMutationFn = Apollo.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;

/**
 * __useUpdateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryMutation, { data, loading, error }] = useUpdateCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, options);
      }
export type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
export type UpdateCategoryMutationResult = Apollo.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($id: ID!) {
  deleteCategory(id: $id) {
    success
    message
    code
    timestamp
    data {
      id
      deletedAt
      softDelete
    }
    metadata {
      requestId
      traceId
      duration
      timestamp
    }
  }
}
    `;
export type DeleteCategoryMutationFn = Apollo.MutationFunction<DeleteCategoryMutation, DeleteCategoryMutationVariables>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, options);
      }
export type DeleteCategoryMutationHookResult = ReturnType<typeof useDeleteCategoryMutation>;
export type DeleteCategoryMutationResult = Apollo.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const GetOrdersDocument = gql`
    query GetOrders($filter: OrderFilterInput, $pagination: PaginationInput) {
  orders(filter: $filter, pagination: $pagination) {
    orders {
      id
      orderNumber
      status
      subtotal
      taxAmount
      shippingAmount
      totalAmount
      notes
      createdAt
      updatedAt
      user {
        id
        email
        firstName
        lastName
        phone
      }
      items {
        id
        quantity
        unitPrice
        totalPrice
        product {
          id
          name
          sku
          images
        }
      }
      shippingAddress {
        id
        type
        firstName
        lastName
        company
        address1
        address2
        city
        state
        postalCode
        country
        phone
        isDefault
        fullName
        fullAddress
      }
    }
    total
    hasMore
  }
}
    `;

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
    id
    orderNumber
    status
    subtotal
    taxAmount
    shippingAmount
    totalAmount
    notes
    createdAt
    updatedAt
    user {
      id
      email
      firstName
      lastName
      phone
    }
    items {
      id
      quantity
      unitPrice
      totalPrice
      product {
        id
        name
        sku
        images
        price
        salePrice
      }
    }
    shippingAddress {
      id
      type
      firstName
      lastName
      company
      address1
      address2
      city
      state
      postalCode
      country
      phone
      isDefault
      fullName
      fullAddress
    }
  }
}
    `;

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
    id
    orderNumber
    status
    subtotal
    taxAmount
    shippingAmount
    totalAmount
    notes
    createdAt
    updatedAt
    user {
      id
      email
      firstName
      lastName
      phone
    }
    items {
      id
      quantity
      unitPrice
      totalPrice
      product {
        id
        name
        sku
        images
        price
        salePrice
      }
    }
    shippingAddress {
      id
      type
      firstName
      lastName
      company
      address1
      address2
      city
      state
      postalCode
      country
      phone
      isDefault
      fullName
      fullAddress
    }
  }
}
    `;

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
export const GetOrderItemsDocument = gql`
    query GetOrderItems($orderId: ID!) {
  orderItems(orderId: $orderId) {
    id
    quantity
    unitPrice
    totalPrice
    order {
      id
      orderNumber
      status
      totalAmount
      createdAt
    }
    product {
      id
      name
      sku
      images
      price
      salePrice
    }
  }
}
    `;

/**
 * __useGetOrderItemsQuery__
 *
 * To run a query within a React component, call `useGetOrderItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrderItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrderItemsQuery({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useGetOrderItemsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetOrderItemsQuery, GetOrderItemsQueryVariables> & ({ variables: GetOrderItemsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetOrderItemsQuery, GetOrderItemsQueryVariables>(GetOrderItemsDocument, options);
      }
export function useGetOrderItemsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOrderItemsQuery, GetOrderItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetOrderItemsQuery, GetOrderItemsQueryVariables>(GetOrderItemsDocument, options);
        }
export function useGetOrderItemsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetOrderItemsQuery, GetOrderItemsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetOrderItemsQuery, GetOrderItemsQueryVariables>(GetOrderItemsDocument, options);
        }
export type GetOrderItemsQueryHookResult = ReturnType<typeof useGetOrderItemsQuery>;
export type GetOrderItemsLazyQueryHookResult = ReturnType<typeof useGetOrderItemsLazyQuery>;
export type GetOrderItemsSuspenseQueryHookResult = ReturnType<typeof useGetOrderItemsSuspenseQuery>;
export type GetOrderItemsQueryResult = Apollo.QueryResult<GetOrderItemsQuery, GetOrderItemsQueryVariables>;
export function refetchGetOrderItemsQuery(variables: GetOrderItemsQueryVariables) {
      return { query: GetOrderItemsDocument, variables: variables }
    }
export const GetOrderStatsDocument = gql`
    query GetOrderStats {
  orderStats {
    totalOrders
    pendingOrders
    processingOrders
    shippedOrders
    deliveredOrders
    cancelledOrders
    totalRevenue
    averageOrderValue
  }
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
    id
    orderNumber
    status
    subtotal
    taxAmount
    shippingAmount
    totalAmount
    notes
    createdAt
    updatedAt
    user {
      id
      email
      firstName
      lastName
      phone
    }
    items {
      id
      quantity
      unitPrice
      totalPrice
      product {
        id
        name
        sku
        images
      }
    }
    shippingAddress {
      id
      type
      firstName
      lastName
      company
      address1
      address2
      city
      state
      postalCode
      country
      phone
      isDefault
      fullName
      fullAddress
    }
  }
}
    `;
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
    id
    orderNumber
    status
    subtotal
    taxAmount
    shippingAmount
    totalAmount
    notes
    createdAt
    updatedAt
    user {
      id
      email
      firstName
      lastName
      phone
    }
    items {
      id
      quantity
      unitPrice
      totalPrice
      product {
        id
        name
        sku
        images
      }
    }
    shippingAddress {
      id
      type
      firstName
      lastName
      company
      address1
      address2
      city
      state
      postalCode
      country
      phone
      isDefault
      fullName
      fullAddress
    }
  }
}
    `;
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
    id
    orderNumber
    status
    subtotal
    taxAmount
    shippingAmount
    totalAmount
    notes
    createdAt
    updatedAt
    user {
      id
      email
      firstName
      lastName
      phone
    }
  }
}
    `;
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
export const CancelOrderDocument = gql`
    mutation CancelOrder($id: ID!) {
  cancelOrder(id: $id) {
    id
    orderNumber
    status
    subtotal
    taxAmount
    shippingAmount
    totalAmount
    notes
    createdAt
    updatedAt
    user {
      id
      email
      firstName
      lastName
      phone
    }
  }
}
    `;
export type CancelOrderMutationFn = Apollo.MutationFunction<CancelOrderMutation, CancelOrderMutationVariables>;

/**
 * __useCancelOrderMutation__
 *
 * To run a mutation, you first call `useCancelOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelOrderMutation, { data, loading, error }] = useCancelOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CancelOrderMutation, CancelOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CancelOrderMutation, CancelOrderMutationVariables>(CancelOrderDocument, options);
      }
export type CancelOrderMutationHookResult = ReturnType<typeof useCancelOrderMutation>;
export type CancelOrderMutationResult = Apollo.MutationResult<CancelOrderMutation>;
export type CancelOrderMutationOptions = Apollo.BaseMutationOptions<CancelOrderMutation, CancelOrderMutationVariables>;
export const ShipOrderDocument = gql`
    mutation ShipOrder($id: ID!, $trackingNumber: String) {
  shipOrder(id: $id, trackingNumber: $trackingNumber) {
    id
    orderNumber
    status
    subtotal
    taxAmount
    shippingAmount
    totalAmount
    notes
    createdAt
    updatedAt
    user {
      id
      email
      firstName
      lastName
      phone
    }
  }
}
    `;
export type ShipOrderMutationFn = Apollo.MutationFunction<ShipOrderMutation, ShipOrderMutationVariables>;

/**
 * __useShipOrderMutation__
 *
 * To run a mutation, you first call `useShipOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShipOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shipOrderMutation, { data, loading, error }] = useShipOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *      trackingNumber: // value for 'trackingNumber'
 *   },
 * });
 */
export function useShipOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ShipOrderMutation, ShipOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ShipOrderMutation, ShipOrderMutationVariables>(ShipOrderDocument, options);
      }
export type ShipOrderMutationHookResult = ReturnType<typeof useShipOrderMutation>;
export type ShipOrderMutationResult = Apollo.MutationResult<ShipOrderMutation>;
export type ShipOrderMutationOptions = Apollo.BaseMutationOptions<ShipOrderMutation, ShipOrderMutationVariables>;
export const DeliverOrderDocument = gql`
    mutation DeliverOrder($id: ID!) {
  deliverOrder(id: $id) {
    id
    orderNumber
    status
    subtotal
    taxAmount
    shippingAmount
    totalAmount
    notes
    createdAt
    updatedAt
    user {
      id
      email
      firstName
      lastName
      phone
    }
  }
}
    `;
export type DeliverOrderMutationFn = Apollo.MutationFunction<DeliverOrderMutation, DeliverOrderMutationVariables>;

/**
 * __useDeliverOrderMutation__
 *
 * To run a mutation, you first call `useDeliverOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeliverOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deliverOrderMutation, { data, loading, error }] = useDeliverOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeliverOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeliverOrderMutation, DeliverOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeliverOrderMutation, DeliverOrderMutationVariables>(DeliverOrderDocument, options);
      }
export type DeliverOrderMutationHookResult = ReturnType<typeof useDeliverOrderMutation>;
export type DeliverOrderMutationResult = Apollo.MutationResult<DeliverOrderMutation>;
export type DeliverOrderMutationOptions = Apollo.BaseMutationOptions<DeliverOrderMutation, DeliverOrderMutationVariables>;
export const CreateOrderItemDocument = gql`
    mutation CreateOrderItem($input: CreateOrderItemInput!) {
  createOrderItem(input: $input) {
    id
    quantity
    unitPrice
    totalPrice
    order {
      id
      orderNumber
      status
      totalAmount
      createdAt
    }
    product {
      id
      name
      sku
      images
      price
      salePrice
    }
  }
}
    `;
export type CreateOrderItemMutationFn = Apollo.MutationFunction<CreateOrderItemMutation, CreateOrderItemMutationVariables>;

/**
 * __useCreateOrderItemMutation__
 *
 * To run a mutation, you first call `useCreateOrderItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrderItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrderItemMutation, { data, loading, error }] = useCreateOrderItemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOrderItemMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateOrderItemMutation, CreateOrderItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateOrderItemMutation, CreateOrderItemMutationVariables>(CreateOrderItemDocument, options);
      }
export type CreateOrderItemMutationHookResult = ReturnType<typeof useCreateOrderItemMutation>;
export type CreateOrderItemMutationResult = Apollo.MutationResult<CreateOrderItemMutation>;
export type CreateOrderItemMutationOptions = Apollo.BaseMutationOptions<CreateOrderItemMutation, CreateOrderItemMutationVariables>;
export const UpdateOrderItemDocument = gql`
    mutation UpdateOrderItem($id: ID!, $quantity: Int!, $unitPrice: Decimal!) {
  updateOrderItem(id: $id, quantity: $quantity, unitPrice: $unitPrice) {
    id
    quantity
    unitPrice
    totalPrice
    order {
      id
      orderNumber
      status
      totalAmount
      createdAt
    }
    product {
      id
      name
      sku
      images
      price
      salePrice
    }
  }
}
    `;
export type UpdateOrderItemMutationFn = Apollo.MutationFunction<UpdateOrderItemMutation, UpdateOrderItemMutationVariables>;

/**
 * __useUpdateOrderItemMutation__
 *
 * To run a mutation, you first call `useUpdateOrderItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrderItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrderItemMutation, { data, loading, error }] = useUpdateOrderItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *      quantity: // value for 'quantity'
 *      unitPrice: // value for 'unitPrice'
 *   },
 * });
 */
export function useUpdateOrderItemMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateOrderItemMutation, UpdateOrderItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateOrderItemMutation, UpdateOrderItemMutationVariables>(UpdateOrderItemDocument, options);
      }
export type UpdateOrderItemMutationHookResult = ReturnType<typeof useUpdateOrderItemMutation>;
export type UpdateOrderItemMutationResult = Apollo.MutationResult<UpdateOrderItemMutation>;
export type UpdateOrderItemMutationOptions = Apollo.BaseMutationOptions<UpdateOrderItemMutation, UpdateOrderItemMutationVariables>;
export const DeleteOrderItemDocument = gql`
    mutation DeleteOrderItem($id: ID!) {
  deleteOrderItem(id: $id) {
    success
    message
  }
}
    `;
export type DeleteOrderItemMutationFn = Apollo.MutationFunction<DeleteOrderItemMutation, DeleteOrderItemMutationVariables>;

/**
 * __useDeleteOrderItemMutation__
 *
 * To run a mutation, you first call `useDeleteOrderItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrderItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrderItemMutation, { data, loading, error }] = useDeleteOrderItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteOrderItemMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteOrderItemMutation, DeleteOrderItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteOrderItemMutation, DeleteOrderItemMutationVariables>(DeleteOrderItemDocument, options);
      }
export type DeleteOrderItemMutationHookResult = ReturnType<typeof useDeleteOrderItemMutation>;
export type DeleteOrderItemMutationResult = Apollo.MutationResult<DeleteOrderItemMutation>;
export type DeleteOrderItemMutationOptions = Apollo.BaseMutationOptions<DeleteOrderItemMutation, DeleteOrderItemMutationVariables>;
export const GetProductsDocument = gql`
    query GetProducts($filter: ProductFilterInput, $pagination: PaginationInput) {
  products(filter: $filter, pagination: $pagination) {
    data {
      items {
        id
        name
        description
        price
        salePrice
        sku
        images
        attributes
        isActive
        stockQuantity
        tags
        rating
        reviewCount
        createdAt
        updatedAt
        currentPrice
        hasDiscount
        discountPercentage
        totalStock
        isInStock
        category {
          id
          name
          slug
          image
        }
        variants {
          id
          name
          price
          sku
          stockQuantity
          attributes
          isActive
          isInStock
        }
      }
      pagination {
        total
        limit
        offset
        hasMore
        currentPage
        totalPages
      }
    }
  }
}
    `;

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
    data {
      entity {
        id
        name
        description
        price
        salePrice
        sku
        images
        attributes
        isActive
        stockQuantity
        tags
        rating
        reviewCount
        createdAt
        updatedAt
        currentPrice
        hasDiscount
        discountPercentage
        totalStock
        isInStock
        category {
          id
          name
          slug
          image
        }
        variants {
          id
          name
          price
          sku
          stockQuantity
          attributes
          isActive
          isInStock
        }
        reviews {
          id
          rating
          title
          comment
          createdAt
          user {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
}
    `;

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
    data {
      entity {
        id
        name
        description
        price
        salePrice
        sku
        images
        attributes
        isActive
        stockQuantity
        tags
        rating
        reviewCount
        createdAt
        updatedAt
        currentPrice
        hasDiscount
        discountPercentage
        totalStock
        isInStock
        category {
          id
          name
          slug
          image
        }
        variants {
          id
          name
          price
          sku
          stockQuantity
          attributes
          isActive
          isInStock
        }
      }
    }
  }
}
    `;

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
export const SearchProductsDocument = gql`
    query SearchProducts($query: String!, $filter: ProductFilterInput, $pagination: PaginationInput) {
  searchProducts(query: $query, filter: $filter, pagination: $pagination) {
    products {
      id
      name
      description
      price
      salePrice
      sku
      images
      attributes
      isActive
      stockQuantity
      tags
      rating
      reviewCount
      createdAt
      updatedAt
      currentPrice
      hasDiscount
      discountPercentage
      totalStock
      isInStock
      category {
        id
        name
        slug
        image
      }
    }
    total
    hasMore
  }
}
    `;

/**
 * __useSearchProductsQuery__
 *
 * To run a query within a React component, call `useSearchProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProductsQuery({
 *   variables: {
 *      query: // value for 'query'
 *      filter: // value for 'filter'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useSearchProductsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchProductsQuery, SearchProductsQueryVariables> & ({ variables: SearchProductsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchProductsQuery, SearchProductsQueryVariables>(SearchProductsDocument, options);
      }
export function useSearchProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchProductsQuery, SearchProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchProductsQuery, SearchProductsQueryVariables>(SearchProductsDocument, options);
        }
export function useSearchProductsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchProductsQuery, SearchProductsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SearchProductsQuery, SearchProductsQueryVariables>(SearchProductsDocument, options);
        }
export type SearchProductsQueryHookResult = ReturnType<typeof useSearchProductsQuery>;
export type SearchProductsLazyQueryHookResult = ReturnType<typeof useSearchProductsLazyQuery>;
export type SearchProductsSuspenseQueryHookResult = ReturnType<typeof useSearchProductsSuspenseQuery>;
export type SearchProductsQueryResult = Apollo.QueryResult<SearchProductsQuery, SearchProductsQueryVariables>;
export function refetchSearchProductsQuery(variables: SearchProductsQueryVariables) {
      return { query: SearchProductsDocument, variables: variables }
    }
export const CreateProductDocument = gql`
    mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    success
    message
    code
    timestamp
    data {
      entity {
        id
        name
        description
        price
        salePrice
        sku
        images
        attributes
        isActive
        stockQuantity
        tags
        rating
        reviewCount
        createdAt
        updatedAt
        currentPrice
        hasDiscount
        discountPercentage
        totalStock
        isInStock
        category {
          id
          name
          slug
          image
        }
      }
      id
      createdAt
    }
    metadata {
      requestId
      traceId
      duration
      timestamp
    }
  }
}
    `;
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
    success
    message
    code
    timestamp
    data {
      entity {
        id
        name
        description
        price
        salePrice
        sku
        images
        attributes
        isActive
        stockQuantity
        tags
        rating
        reviewCount
        createdAt
        updatedAt
        currentPrice
        hasDiscount
        discountPercentage
        totalStock
        isInStock
        category {
          id
          name
          slug
          image
        }
      }
      id
      updatedAt
      changes
    }
    metadata {
      requestId
      traceId
      duration
      timestamp
    }
  }
}
    `;
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
    code
    timestamp
    data {
      id
      deletedAt
      softDelete
    }
    metadata {
      requestId
      traceId
      duration
      timestamp
    }
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
export const CreateProductVariantDocument = gql`
    mutation CreateProductVariant($input: CreateProductVariantInput!) {
  createProductVariant(input: $input) {
    id
    productId
    name
    price
    sku
    stockQuantity
    attributes
    isActive
    createdAt
    updatedAt
    isInStock
    product {
      id
      name
      sku
    }
  }
}
    `;
export type CreateProductVariantMutationFn = Apollo.MutationFunction<CreateProductVariantMutation, CreateProductVariantMutationVariables>;

/**
 * __useCreateProductVariantMutation__
 *
 * To run a mutation, you first call `useCreateProductVariantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductVariantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductVariantMutation, { data, loading, error }] = useCreateProductVariantMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductVariantMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProductVariantMutation, CreateProductVariantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateProductVariantMutation, CreateProductVariantMutationVariables>(CreateProductVariantDocument, options);
      }
export type CreateProductVariantMutationHookResult = ReturnType<typeof useCreateProductVariantMutation>;
export type CreateProductVariantMutationResult = Apollo.MutationResult<CreateProductVariantMutation>;
export type CreateProductVariantMutationOptions = Apollo.BaseMutationOptions<CreateProductVariantMutation, CreateProductVariantMutationVariables>;
export const UpdateProductVariantDocument = gql`
    mutation UpdateProductVariant($id: ID!, $input: UpdateProductVariantInput!) {
  updateProductVariant(id: $id, input: $input) {
    id
    productId
    name
    price
    sku
    stockQuantity
    attributes
    isActive
    createdAt
    updatedAt
    isInStock
    product {
      id
      name
      sku
    }
  }
}
    `;
export type UpdateProductVariantMutationFn = Apollo.MutationFunction<UpdateProductVariantMutation, UpdateProductVariantMutationVariables>;

/**
 * __useUpdateProductVariantMutation__
 *
 * To run a mutation, you first call `useUpdateProductVariantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductVariantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductVariantMutation, { data, loading, error }] = useUpdateProductVariantMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductVariantMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProductVariantMutation, UpdateProductVariantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateProductVariantMutation, UpdateProductVariantMutationVariables>(UpdateProductVariantDocument, options);
      }
export type UpdateProductVariantMutationHookResult = ReturnType<typeof useUpdateProductVariantMutation>;
export type UpdateProductVariantMutationResult = Apollo.MutationResult<UpdateProductVariantMutation>;
export type UpdateProductVariantMutationOptions = Apollo.BaseMutationOptions<UpdateProductVariantMutation, UpdateProductVariantMutationVariables>;
export const DeleteProductVariantDocument = gql`
    mutation DeleteProductVariant($id: ID!) {
  deleteProductVariant(id: $id) {
    success
    message
  }
}
    `;
export type DeleteProductVariantMutationFn = Apollo.MutationFunction<DeleteProductVariantMutation, DeleteProductVariantMutationVariables>;

/**
 * __useDeleteProductVariantMutation__
 *
 * To run a mutation, you first call `useDeleteProductVariantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductVariantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductVariantMutation, { data, loading, error }] = useDeleteProductVariantMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProductVariantMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteProductVariantMutation, DeleteProductVariantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteProductVariantMutation, DeleteProductVariantMutationVariables>(DeleteProductVariantDocument, options);
      }
export type DeleteProductVariantMutationHookResult = ReturnType<typeof useDeleteProductVariantMutation>;
export type DeleteProductVariantMutationResult = Apollo.MutationResult<DeleteProductVariantMutation>;
export type DeleteProductVariantMutationOptions = Apollo.BaseMutationOptions<DeleteProductVariantMutation, DeleteProductVariantMutationVariables>;
export const UploadImageDocument = gql`
    mutation UploadImage($file: Upload!, $entityId: String!, $entityType: String!) {
  uploadImage(file: $file, entityId: $entityId, entityType: $entityType) {
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
 *      entityId: // value for 'entityId'
 *      entityType: // value for 'entityType'
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
      email
      role
      isActive
      emailVerified
      lastLoginAt
      createdAt
      updatedAt
      profile {
        id
        firstName
        lastName
        phone
        dateOfBirth
        avatar
        role
        emailVerified
        isActive
        lastLoginAt
        createdAt
        updatedAt
        fullName
      }
      addresses {
        id
        type
        firstName
        lastName
        company
        address1
        address2
        city
        state
        postalCode
        country
        phone
        isDefault
        createdAt
        updatedAt
        fullName
        fullAddress
      }
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
  user(id: $id) {
    id
    email
    role
    isActive
    emailVerified
    lastLoginAt
    createdAt
    updatedAt
    profile {
      id
      firstName
      lastName
      phone
      dateOfBirth
      avatar
      role
      emailVerified
      isActive
      lastLoginAt
      createdAt
      updatedAt
      fullName
    }
    addresses {
      id
      type
      firstName
      lastName
      company
      address1
      address2
      city
      state
      postalCode
      country
      phone
      isDefault
      createdAt
      updatedAt
      fullName
      fullAddress
    }
    accounts {
      id
      provider
      providerAccountId
      accessToken
      refreshToken
      tokenType
      scope
      idToken
      expiresAt
      createdAt
      updatedAt
    }
    sessions {
      id
      sessionToken
      accessToken
      refreshToken
      expiresAt
      userAgent
      ipAddress
      isActive
      createdAt
      updatedAt
    }
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
export const GetUserProfileDocument = gql`
    query GetUserProfile($userId: ID!) {
  userProfile(userId: $userId) {
    id
    firstName
    lastName
    phone
    dateOfBirth
    avatar
    role
    emailVerified
    isActive
    lastLoginAt
    createdAt
    updatedAt
    fullName
    addresses {
      id
      type
      firstName
      lastName
      company
      address1
      address2
      city
      state
      postalCode
      country
      phone
      isDefault
      createdAt
      updatedAt
      fullName
      fullAddress
    }
    orders {
      id
      orderNumber
      status
      totalAmount
      createdAt
      updatedAt
    }
  }
}
    `;

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
  userStats {
    totalUsers
    activeUsers
    newUsersThisMonth
    usersByRole
  }
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
export const GetUserAddressesDocument = gql`
    query GetUserAddresses($userId: ID!) {
  userAddresses(userId: $userId) {
    id
    type
    firstName
    lastName
    company
    address1
    address2
    city
    state
    postalCode
    country
    phone
    isDefault
    createdAt
    updatedAt
    fullName
    fullAddress
  }
}
    `;

/**
 * __useGetUserAddressesQuery__
 *
 * To run a query within a React component, call `useGetUserAddressesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserAddressesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserAddressesQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserAddressesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserAddressesQuery, GetUserAddressesQueryVariables> & ({ variables: GetUserAddressesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserAddressesQuery, GetUserAddressesQueryVariables>(GetUserAddressesDocument, options);
      }
export function useGetUserAddressesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserAddressesQuery, GetUserAddressesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserAddressesQuery, GetUserAddressesQueryVariables>(GetUserAddressesDocument, options);
        }
export function useGetUserAddressesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserAddressesQuery, GetUserAddressesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserAddressesQuery, GetUserAddressesQueryVariables>(GetUserAddressesDocument, options);
        }
export type GetUserAddressesQueryHookResult = ReturnType<typeof useGetUserAddressesQuery>;
export type GetUserAddressesLazyQueryHookResult = ReturnType<typeof useGetUserAddressesLazyQuery>;
export type GetUserAddressesSuspenseQueryHookResult = ReturnType<typeof useGetUserAddressesSuspenseQuery>;
export type GetUserAddressesQueryResult = Apollo.QueryResult<GetUserAddressesQuery, GetUserAddressesQueryVariables>;
export function refetchGetUserAddressesQuery(variables: GetUserAddressesQueryVariables) {
      return { query: GetUserAddressesDocument, variables: variables }
    }
export const GetUserAddressDocument = gql`
    query GetUserAddress($id: ID!) {
  userAddress(id: $id) {
    id
    type
    firstName
    lastName
    company
    address1
    address2
    city
    state
    postalCode
    country
    phone
    isDefault
    createdAt
    updatedAt
    fullName
    fullAddress
    user {
      id
      email
      firstName
      lastName
    }
  }
}
    `;

/**
 * __useGetUserAddressQuery__
 *
 * To run a query within a React component, call `useGetUserAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserAddressQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserAddressQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserAddressQuery, GetUserAddressQueryVariables> & ({ variables: GetUserAddressQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserAddressQuery, GetUserAddressQueryVariables>(GetUserAddressDocument, options);
      }
export function useGetUserAddressLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserAddressQuery, GetUserAddressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserAddressQuery, GetUserAddressQueryVariables>(GetUserAddressDocument, options);
        }
export function useGetUserAddressSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserAddressQuery, GetUserAddressQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserAddressQuery, GetUserAddressQueryVariables>(GetUserAddressDocument, options);
        }
export type GetUserAddressQueryHookResult = ReturnType<typeof useGetUserAddressQuery>;
export type GetUserAddressLazyQueryHookResult = ReturnType<typeof useGetUserAddressLazyQuery>;
export type GetUserAddressSuspenseQueryHookResult = ReturnType<typeof useGetUserAddressSuspenseQuery>;
export type GetUserAddressQueryResult = Apollo.QueryResult<GetUserAddressQuery, GetUserAddressQueryVariables>;
export function refetchGetUserAddressQuery(variables: GetUserAddressQueryVariables) {
      return { query: GetUserAddressDocument, variables: variables }
    }
export const SearchUsersDocument = gql`
    query SearchUsers($query: String!) {
  searchUsers(query: $query) {
    id
    email
    role
    isActive
    emailVerified
    lastLoginAt
    createdAt
    updatedAt
    profile {
      id
      firstName
      lastName
      phone
      dateOfBirth
      avatar
      role
      emailVerified
      isActive
      lastLoginAt
      createdAt
      updatedAt
      fullName
    }
  }
}
    `;

/**
 * __useSearchUsersQuery__
 *
 * To run a query within a React component, call `useSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchUsersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables> & ({ variables: SearchUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
      }
export function useSearchUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export function useSearchUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>;
export type SearchUsersLazyQueryHookResult = ReturnType<typeof useSearchUsersLazyQuery>;
export type SearchUsersSuspenseQueryHookResult = ReturnType<typeof useSearchUsersSuspenseQuery>;
export type SearchUsersQueryResult = Apollo.QueryResult<SearchUsersQuery, SearchUsersQueryVariables>;
export function refetchSearchUsersQuery(variables: SearchUsersQueryVariables) {
      return { query: SearchUsersDocument, variables: variables }
    }
export const GetActiveUsersDocument = gql`
    query GetActiveUsers {
  activeUsers {
    id
    email
    role
    isActive
    emailVerified
    lastLoginAt
    createdAt
    updatedAt
    profile {
      id
      firstName
      lastName
      phone
      dateOfBirth
      avatar
      role
      emailVerified
      isActive
      lastLoginAt
      createdAt
      updatedAt
      fullName
    }
  }
}
    `;

/**
 * __useGetActiveUsersQuery__
 *
 * To run a query within a React component, call `useGetActiveUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetActiveUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetActiveUsersQuery, GetActiveUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetActiveUsersQuery, GetActiveUsersQueryVariables>(GetActiveUsersDocument, options);
      }
export function useGetActiveUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetActiveUsersQuery, GetActiveUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetActiveUsersQuery, GetActiveUsersQueryVariables>(GetActiveUsersDocument, options);
        }
export function useGetActiveUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetActiveUsersQuery, GetActiveUsersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetActiveUsersQuery, GetActiveUsersQueryVariables>(GetActiveUsersDocument, options);
        }
export type GetActiveUsersQueryHookResult = ReturnType<typeof useGetActiveUsersQuery>;
export type GetActiveUsersLazyQueryHookResult = ReturnType<typeof useGetActiveUsersLazyQuery>;
export type GetActiveUsersSuspenseQueryHookResult = ReturnType<typeof useGetActiveUsersSuspenseQuery>;
export type GetActiveUsersQueryResult = Apollo.QueryResult<GetActiveUsersQuery, GetActiveUsersQueryVariables>;
export function refetchGetActiveUsersQuery(variables?: GetActiveUsersQueryVariables) {
      return { query: GetActiveUsersDocument, variables: variables }
    }
export const GetUsersByRoleDocument = gql`
    query GetUsersByRole($role: UserRole!) {
  usersByRole(role: $role) {
    id
    email
    role
    isActive
    emailVerified
    lastLoginAt
    createdAt
    updatedAt
    profile {
      id
      firstName
      lastName
      phone
      dateOfBirth
      avatar
      role
      emailVerified
      isActive
      lastLoginAt
      createdAt
      updatedAt
      fullName
    }
  }
}
    `;

/**
 * __useGetUsersByRoleQuery__
 *
 * To run a query within a React component, call `useGetUsersByRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersByRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersByRoleQuery({
 *   variables: {
 *      role: // value for 'role'
 *   },
 * });
 */
export function useGetUsersByRoleQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUsersByRoleQuery, GetUsersByRoleQueryVariables> & ({ variables: GetUsersByRoleQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUsersByRoleQuery, GetUsersByRoleQueryVariables>(GetUsersByRoleDocument, options);
      }
export function useGetUsersByRoleLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUsersByRoleQuery, GetUsersByRoleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUsersByRoleQuery, GetUsersByRoleQueryVariables>(GetUsersByRoleDocument, options);
        }
export function useGetUsersByRoleSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUsersByRoleQuery, GetUsersByRoleQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUsersByRoleQuery, GetUsersByRoleQueryVariables>(GetUsersByRoleDocument, options);
        }
export type GetUsersByRoleQueryHookResult = ReturnType<typeof useGetUsersByRoleQuery>;
export type GetUsersByRoleLazyQueryHookResult = ReturnType<typeof useGetUsersByRoleLazyQuery>;
export type GetUsersByRoleSuspenseQueryHookResult = ReturnType<typeof useGetUsersByRoleSuspenseQuery>;
export type GetUsersByRoleQueryResult = Apollo.QueryResult<GetUsersByRoleQuery, GetUsersByRoleQueryVariables>;
export function refetchGetUsersByRoleQuery(variables: GetUsersByRoleQueryVariables) {
      return { query: GetUsersByRoleDocument, variables: variables }
    }
export const GetUsersByProviderDocument = gql`
    query GetUsersByProvider($provider: AuthProvider!) {
  usersByProvider(provider: $provider) {
    id
    email
    role
    isActive
    emailVerified
    lastLoginAt
    createdAt
    updatedAt
    profile {
      id
      firstName
      lastName
      phone
      dateOfBirth
      avatar
      role
      emailVerified
      isActive
      lastLoginAt
      createdAt
      updatedAt
      fullName
    }
  }
}
    `;

/**
 * __useGetUsersByProviderQuery__
 *
 * To run a query within a React component, call `useGetUsersByProviderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersByProviderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersByProviderQuery({
 *   variables: {
 *      provider: // value for 'provider'
 *   },
 * });
 */
export function useGetUsersByProviderQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUsersByProviderQuery, GetUsersByProviderQueryVariables> & ({ variables: GetUsersByProviderQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUsersByProviderQuery, GetUsersByProviderQueryVariables>(GetUsersByProviderDocument, options);
      }
export function useGetUsersByProviderLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUsersByProviderQuery, GetUsersByProviderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUsersByProviderQuery, GetUsersByProviderQueryVariables>(GetUsersByProviderDocument, options);
        }
export function useGetUsersByProviderSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUsersByProviderQuery, GetUsersByProviderQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUsersByProviderQuery, GetUsersByProviderQueryVariables>(GetUsersByProviderDocument, options);
        }
export type GetUsersByProviderQueryHookResult = ReturnType<typeof useGetUsersByProviderQuery>;
export type GetUsersByProviderLazyQueryHookResult = ReturnType<typeof useGetUsersByProviderLazyQuery>;
export type GetUsersByProviderSuspenseQueryHookResult = ReturnType<typeof useGetUsersByProviderSuspenseQuery>;
export type GetUsersByProviderQueryResult = Apollo.QueryResult<GetUsersByProviderQuery, GetUsersByProviderQueryVariables>;
export function refetchGetUsersByProviderQuery(variables: GetUsersByProviderQueryVariables) {
      return { query: GetUsersByProviderDocument, variables: variables }
    }
export const GetUserOrderHistoryDocument = gql`
    query GetUserOrderHistory($userId: ID!, $filter: UserOrderHistoryFilter, $pagination: PaginationInput) {
  userOrderHistory(userId: $userId, filter: $filter, pagination: $pagination) {
    orders {
      id
      orderNumber
      status
      subtotal
      taxAmount
      shippingAmount
      totalAmount
      createdAt
      updatedAt
    }
    stats {
      totalOrders
      totalSpent
      averageOrderValue
      lastOrderDate
      ordersByStatus
    }
    total
    hasMore
  }
}
    `;

/**
 * __useGetUserOrderHistoryQuery__
 *
 * To run a query within a React component, call `useGetUserOrderHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserOrderHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserOrderHistoryQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      filter: // value for 'filter'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetUserOrderHistoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserOrderHistoryQuery, GetUserOrderHistoryQueryVariables> & ({ variables: GetUserOrderHistoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserOrderHistoryQuery, GetUserOrderHistoryQueryVariables>(GetUserOrderHistoryDocument, options);
      }
export function useGetUserOrderHistoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserOrderHistoryQuery, GetUserOrderHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserOrderHistoryQuery, GetUserOrderHistoryQueryVariables>(GetUserOrderHistoryDocument, options);
        }
export function useGetUserOrderHistorySuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserOrderHistoryQuery, GetUserOrderHistoryQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserOrderHistoryQuery, GetUserOrderHistoryQueryVariables>(GetUserOrderHistoryDocument, options);
        }
export type GetUserOrderHistoryQueryHookResult = ReturnType<typeof useGetUserOrderHistoryQuery>;
export type GetUserOrderHistoryLazyQueryHookResult = ReturnType<typeof useGetUserOrderHistoryLazyQuery>;
export type GetUserOrderHistorySuspenseQueryHookResult = ReturnType<typeof useGetUserOrderHistorySuspenseQuery>;
export type GetUserOrderHistoryQueryResult = Apollo.QueryResult<GetUserOrderHistoryQuery, GetUserOrderHistoryQueryVariables>;
export function refetchGetUserOrderHistoryQuery(variables: GetUserOrderHistoryQueryVariables) {
      return { query: GetUserOrderHistoryDocument, variables: variables }
    }
export const GetUserFavoriteStatsDocument = gql`
    query GetUserFavoriteStats($userId: ID!) {
  userFavoriteStats(userId: $userId) {
    totalFavorites
    favoriteCategories
    recentFavorites {
      id
      createdAt
      product {
        id
        name
        price
        images
      }
    }
  }
}
    `;

/**
 * __useGetUserFavoriteStatsQuery__
 *
 * To run a query within a React component, call `useGetUserFavoriteStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserFavoriteStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserFavoriteStatsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserFavoriteStatsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserFavoriteStatsQuery, GetUserFavoriteStatsQueryVariables> & ({ variables: GetUserFavoriteStatsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserFavoriteStatsQuery, GetUserFavoriteStatsQueryVariables>(GetUserFavoriteStatsDocument, options);
      }
export function useGetUserFavoriteStatsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserFavoriteStatsQuery, GetUserFavoriteStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserFavoriteStatsQuery, GetUserFavoriteStatsQueryVariables>(GetUserFavoriteStatsDocument, options);
        }
export function useGetUserFavoriteStatsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserFavoriteStatsQuery, GetUserFavoriteStatsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserFavoriteStatsQuery, GetUserFavoriteStatsQueryVariables>(GetUserFavoriteStatsDocument, options);
        }
export type GetUserFavoriteStatsQueryHookResult = ReturnType<typeof useGetUserFavoriteStatsQuery>;
export type GetUserFavoriteStatsLazyQueryHookResult = ReturnType<typeof useGetUserFavoriteStatsLazyQuery>;
export type GetUserFavoriteStatsSuspenseQueryHookResult = ReturnType<typeof useGetUserFavoriteStatsSuspenseQuery>;
export type GetUserFavoriteStatsQueryResult = Apollo.QueryResult<GetUserFavoriteStatsQuery, GetUserFavoriteStatsQueryVariables>;
export function refetchGetUserFavoriteStatsQuery(variables: GetUserFavoriteStatsQueryVariables) {
      return { query: GetUserFavoriteStatsDocument, variables: variables }
    }
export const GetUserActivitySummaryDocument = gql`
    query GetUserActivitySummary($userId: ID!) {
  userActivitySummary(userId: $userId) {
    joinDate
    lastActivity
    totalSpent
    cartItemsCount
    favoriteProducts {
      id
      name
      price
      images
    }
    recentOrders {
      id
      orderNumber
      status
      totalAmount
      createdAt
    }
  }
}
    `;

/**
 * __useGetUserActivitySummaryQuery__
 *
 * To run a query within a React component, call `useGetUserActivitySummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserActivitySummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserActivitySummaryQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserActivitySummaryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserActivitySummaryQuery, GetUserActivitySummaryQueryVariables> & ({ variables: GetUserActivitySummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserActivitySummaryQuery, GetUserActivitySummaryQueryVariables>(GetUserActivitySummaryDocument, options);
      }
export function useGetUserActivitySummaryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserActivitySummaryQuery, GetUserActivitySummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserActivitySummaryQuery, GetUserActivitySummaryQueryVariables>(GetUserActivitySummaryDocument, options);
        }
export function useGetUserActivitySummarySuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserActivitySummaryQuery, GetUserActivitySummaryQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserActivitySummaryQuery, GetUserActivitySummaryQueryVariables>(GetUserActivitySummaryDocument, options);
        }
export type GetUserActivitySummaryQueryHookResult = ReturnType<typeof useGetUserActivitySummaryQuery>;
export type GetUserActivitySummaryLazyQueryHookResult = ReturnType<typeof useGetUserActivitySummaryLazyQuery>;
export type GetUserActivitySummarySuspenseQueryHookResult = ReturnType<typeof useGetUserActivitySummarySuspenseQuery>;
export type GetUserActivitySummaryQueryResult = Apollo.QueryResult<GetUserActivitySummaryQuery, GetUserActivitySummaryQueryVariables>;
export function refetchGetUserActivitySummaryQuery(variables: GetUserActivitySummaryQueryVariables) {
      return { query: GetUserActivitySummaryDocument, variables: variables }
    }
export const GetUserAccountsDocument = gql`
    query GetUserAccounts($userId: ID!) {
  userAccounts(userId: $userId) {
    id
    provider
    providerAccountId
    accessToken
    refreshToken
    tokenType
    scope
    idToken
    expiresAt
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserAccountsQuery__
 *
 * To run a query within a React component, call `useGetUserAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserAccountsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserAccountsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserAccountsQuery, GetUserAccountsQueryVariables> & ({ variables: GetUserAccountsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserAccountsQuery, GetUserAccountsQueryVariables>(GetUserAccountsDocument, options);
      }
export function useGetUserAccountsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserAccountsQuery, GetUserAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserAccountsQuery, GetUserAccountsQueryVariables>(GetUserAccountsDocument, options);
        }
export function useGetUserAccountsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserAccountsQuery, GetUserAccountsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserAccountsQuery, GetUserAccountsQueryVariables>(GetUserAccountsDocument, options);
        }
export type GetUserAccountsQueryHookResult = ReturnType<typeof useGetUserAccountsQuery>;
export type GetUserAccountsLazyQueryHookResult = ReturnType<typeof useGetUserAccountsLazyQuery>;
export type GetUserAccountsSuspenseQueryHookResult = ReturnType<typeof useGetUserAccountsSuspenseQuery>;
export type GetUserAccountsQueryResult = Apollo.QueryResult<GetUserAccountsQuery, GetUserAccountsQueryVariables>;
export function refetchGetUserAccountsQuery(variables: GetUserAccountsQueryVariables) {
      return { query: GetUserAccountsDocument, variables: variables }
    }
export const GetUserSessionsDocument = gql`
    query GetUserSessions($userId: ID!) {
  userSessions(userId: $userId) {
    id
    sessionToken
    accessToken
    refreshToken
    expiresAt
    userAgent
    ipAddress
    isActive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserSessionsQuery__
 *
 * To run a query within a React component, call `useGetUserSessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserSessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserSessionsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserSessionsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserSessionsQuery, GetUserSessionsQueryVariables> & ({ variables: GetUserSessionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserSessionsQuery, GetUserSessionsQueryVariables>(GetUserSessionsDocument, options);
      }
export function useGetUserSessionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserSessionsQuery, GetUserSessionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserSessionsQuery, GetUserSessionsQueryVariables>(GetUserSessionsDocument, options);
        }
export function useGetUserSessionsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserSessionsQuery, GetUserSessionsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserSessionsQuery, GetUserSessionsQueryVariables>(GetUserSessionsDocument, options);
        }
export type GetUserSessionsQueryHookResult = ReturnType<typeof useGetUserSessionsQuery>;
export type GetUserSessionsLazyQueryHookResult = ReturnType<typeof useGetUserSessionsLazyQuery>;
export type GetUserSessionsSuspenseQueryHookResult = ReturnType<typeof useGetUserSessionsSuspenseQuery>;
export type GetUserSessionsQueryResult = Apollo.QueryResult<GetUserSessionsQuery, GetUserSessionsQueryVariables>;
export function refetchGetUserSessionsQuery(variables: GetUserSessionsQueryVariables) {
      return { query: GetUserSessionsDocument, variables: variables }
    }
export const GetActiveSessionsDocument = gql`
    query GetActiveSessions($userId: ID!) {
  activeSessions(userId: $userId) {
    id
    sessionToken
    accessToken
    refreshToken
    expiresAt
    userAgent
    ipAddress
    isActive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetActiveSessionsQuery__
 *
 * To run a query within a React component, call `useGetActiveSessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveSessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveSessionsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetActiveSessionsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetActiveSessionsQuery, GetActiveSessionsQueryVariables> & ({ variables: GetActiveSessionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetActiveSessionsQuery, GetActiveSessionsQueryVariables>(GetActiveSessionsDocument, options);
      }
export function useGetActiveSessionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetActiveSessionsQuery, GetActiveSessionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetActiveSessionsQuery, GetActiveSessionsQueryVariables>(GetActiveSessionsDocument, options);
        }
export function useGetActiveSessionsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetActiveSessionsQuery, GetActiveSessionsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetActiveSessionsQuery, GetActiveSessionsQueryVariables>(GetActiveSessionsDocument, options);
        }
export type GetActiveSessionsQueryHookResult = ReturnType<typeof useGetActiveSessionsQuery>;
export type GetActiveSessionsLazyQueryHookResult = ReturnType<typeof useGetActiveSessionsLazyQuery>;
export type GetActiveSessionsSuspenseQueryHookResult = ReturnType<typeof useGetActiveSessionsSuspenseQuery>;
export type GetActiveSessionsQueryResult = Apollo.QueryResult<GetActiveSessionsQuery, GetActiveSessionsQueryVariables>;
export function refetchGetActiveSessionsQuery(variables: GetActiveSessionsQueryVariables) {
      return { query: GetActiveSessionsDocument, variables: variables }
    }
export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserProfileInput!) {
  createUser(input: $input) {
    success
    message
    code
    timestamp
    data {
      entity {
        id
        email
        role
        isActive
        emailVerified
        lastLoginAt
        createdAt
        updatedAt
        profile {
          id
          firstName
          lastName
          phone
          dateOfBirth
          avatar
          role
          emailVerified
          isActive
          lastLoginAt
          createdAt
          updatedAt
          fullName
        }
      }
      id
      createdAt
    }
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
export const UpdateUserOptimizedDocument = gql`
    mutation UpdateUserOptimized($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    email
    role
    isActive
    profile {
      id
      firstName
      lastName
      phone
      dateOfBirth
    }
  }
}
    `;
export type UpdateUserOptimizedMutationFn = Apollo.MutationFunction<UpdateUserOptimizedMutation, UpdateUserOptimizedMutationVariables>;

/**
 * __useUpdateUserOptimizedMutation__
 *
 * To run a mutation, you first call `useUpdateUserOptimizedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserOptimizedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserOptimizedMutation, { data, loading, error }] = useUpdateUserOptimizedMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserOptimizedMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserOptimizedMutation, UpdateUserOptimizedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateUserOptimizedMutation, UpdateUserOptimizedMutationVariables>(UpdateUserOptimizedDocument, options);
      }
export type UpdateUserOptimizedMutationHookResult = ReturnType<typeof useUpdateUserOptimizedMutation>;
export type UpdateUserOptimizedMutationResult = Apollo.MutationResult<UpdateUserOptimizedMutation>;
export type UpdateUserOptimizedMutationOptions = Apollo.BaseMutationOptions<UpdateUserOptimizedMutation, UpdateUserOptimizedMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    email
    role
    isActive
    emailVerified
    lastLoginAt
    createdAt
    updatedAt
    profile {
      id
      firstName
      lastName
      phone
      dateOfBirth
      avatar
      role
      emailVerified
      isActive
      lastLoginAt
      createdAt
      updatedAt
      fullName
    }
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
 *      id: // value for 'id'
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
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id) {
    success
    message
  }
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const ActivateUserDocument = gql`
    mutation ActivateUser($id: ID!) {
  activateUser(id: $id) {
    id
    email
    role
    isActive
    emailVerified
    lastLoginAt
    createdAt
    updatedAt
    profile {
      id
      firstName
      lastName
      phone
      dateOfBirth
      avatar
      role
      emailVerified
      isActive
      lastLoginAt
      createdAt
      updatedAt
      fullName
    }
  }
}
    `;
export type ActivateUserMutationFn = Apollo.MutationFunction<ActivateUserMutation, ActivateUserMutationVariables>;

/**
 * __useActivateUserMutation__
 *
 * To run a mutation, you first call `useActivateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActivateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [activateUserMutation, { data, loading, error }] = useActivateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useActivateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ActivateUserMutation, ActivateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ActivateUserMutation, ActivateUserMutationVariables>(ActivateUserDocument, options);
      }
export type ActivateUserMutationHookResult = ReturnType<typeof useActivateUserMutation>;
export type ActivateUserMutationResult = Apollo.MutationResult<ActivateUserMutation>;
export type ActivateUserMutationOptions = Apollo.BaseMutationOptions<ActivateUserMutation, ActivateUserMutationVariables>;
export const DeactivateUserDocument = gql`
    mutation DeactivateUser($id: ID!) {
  deactivateUser(id: $id) {
    id
    email
    role
    isActive
    emailVerified
    lastLoginAt
    createdAt
    updatedAt
    profile {
      id
      firstName
      lastName
      phone
      dateOfBirth
      avatar
      role
      emailVerified
      isActive
      lastLoginAt
      createdAt
      updatedAt
      fullName
    }
  }
}
    `;
export type DeactivateUserMutationFn = Apollo.MutationFunction<DeactivateUserMutation, DeactivateUserMutationVariables>;

/**
 * __useDeactivateUserMutation__
 *
 * To run a mutation, you first call `useDeactivateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeactivateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deactivateUserMutation, { data, loading, error }] = useDeactivateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeactivateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeactivateUserMutation, DeactivateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeactivateUserMutation, DeactivateUserMutationVariables>(DeactivateUserDocument, options);
      }
export type DeactivateUserMutationHookResult = ReturnType<typeof useDeactivateUserMutation>;
export type DeactivateUserMutationResult = Apollo.MutationResult<DeactivateUserMutation>;
export type DeactivateUserMutationOptions = Apollo.BaseMutationOptions<DeactivateUserMutation, DeactivateUserMutationVariables>;
export const CreateUserProfileDocument = gql`
    mutation CreateUserProfile($input: CreateUserProfileInput!) {
  createUserProfile(input: $input) {
    id
    firstName
    lastName
    phone
    dateOfBirth
    avatar
    role
    emailVerified
    isActive
    lastLoginAt
    createdAt
    updatedAt
    fullName
  }
}
    `;
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
    id
    firstName
    lastName
    phone
    dateOfBirth
    avatar
    role
    emailVerified
    isActive
    lastLoginAt
    createdAt
    updatedAt
    fullName
  }
}
    `;
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
export const DeleteUserProfileDocument = gql`
    mutation DeleteUserProfile($userId: ID!) {
  deleteUserProfile(userId: $userId) {
    success
    message
  }
}
    `;
export type DeleteUserProfileMutationFn = Apollo.MutationFunction<DeleteUserProfileMutation, DeleteUserProfileMutationVariables>;

/**
 * __useDeleteUserProfileMutation__
 *
 * To run a mutation, you first call `useDeleteUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserProfileMutation, { data, loading, error }] = useDeleteUserProfileMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useDeleteUserProfileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteUserProfileMutation, DeleteUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteUserProfileMutation, DeleteUserProfileMutationVariables>(DeleteUserProfileDocument, options);
      }
export type DeleteUserProfileMutationHookResult = ReturnType<typeof useDeleteUserProfileMutation>;
export type DeleteUserProfileMutationResult = Apollo.MutationResult<DeleteUserProfileMutation>;
export type DeleteUserProfileMutationOptions = Apollo.BaseMutationOptions<DeleteUserProfileMutation, DeleteUserProfileMutationVariables>;
export const CreateUserAddressDocument = gql`
    mutation CreateUserAddress($input: CreateUserAddressInput!) {
  createUserAddress(input: $input) {
    id
    type
    firstName
    lastName
    company
    address1
    address2
    city
    state
    postalCode
    country
    phone
    isDefault
    createdAt
    updatedAt
    fullName
    fullAddress
  }
}
    `;
export type CreateUserAddressMutationFn = Apollo.MutationFunction<CreateUserAddressMutation, CreateUserAddressMutationVariables>;

/**
 * __useCreateUserAddressMutation__
 *
 * To run a mutation, you first call `useCreateUserAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserAddressMutation, { data, loading, error }] = useCreateUserAddressMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserAddressMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateUserAddressMutation, CreateUserAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateUserAddressMutation, CreateUserAddressMutationVariables>(CreateUserAddressDocument, options);
      }
export type CreateUserAddressMutationHookResult = ReturnType<typeof useCreateUserAddressMutation>;
export type CreateUserAddressMutationResult = Apollo.MutationResult<CreateUserAddressMutation>;
export type CreateUserAddressMutationOptions = Apollo.BaseMutationOptions<CreateUserAddressMutation, CreateUserAddressMutationVariables>;
export const UpdateUserAddressDocument = gql`
    mutation UpdateUserAddress($id: ID!, $input: UpdateUserAddressInput!) {
  updateUserAddress(id: $id, input: $input) {
    id
    type
    firstName
    lastName
    company
    address1
    address2
    city
    state
    postalCode
    country
    phone
    isDefault
    createdAt
    updatedAt
    fullName
    fullAddress
  }
}
    `;
export type UpdateUserAddressMutationFn = Apollo.MutationFunction<UpdateUserAddressMutation, UpdateUserAddressMutationVariables>;

/**
 * __useUpdateUserAddressMutation__
 *
 * To run a mutation, you first call `useUpdateUserAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserAddressMutation, { data, loading, error }] = useUpdateUserAddressMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserAddressMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserAddressMutation, UpdateUserAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateUserAddressMutation, UpdateUserAddressMutationVariables>(UpdateUserAddressDocument, options);
      }
export type UpdateUserAddressMutationHookResult = ReturnType<typeof useUpdateUserAddressMutation>;
export type UpdateUserAddressMutationResult = Apollo.MutationResult<UpdateUserAddressMutation>;
export type UpdateUserAddressMutationOptions = Apollo.BaseMutationOptions<UpdateUserAddressMutation, UpdateUserAddressMutationVariables>;
export const DeleteUserAddressDocument = gql`
    mutation DeleteUserAddress($id: ID!) {
  deleteUserAddress(id: $id) {
    success
    message
  }
}
    `;
export type DeleteUserAddressMutationFn = Apollo.MutationFunction<DeleteUserAddressMutation, DeleteUserAddressMutationVariables>;

/**
 * __useDeleteUserAddressMutation__
 *
 * To run a mutation, you first call `useDeleteUserAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserAddressMutation, { data, loading, error }] = useDeleteUserAddressMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserAddressMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteUserAddressMutation, DeleteUserAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteUserAddressMutation, DeleteUserAddressMutationVariables>(DeleteUserAddressDocument, options);
      }
export type DeleteUserAddressMutationHookResult = ReturnType<typeof useDeleteUserAddressMutation>;
export type DeleteUserAddressMutationResult = Apollo.MutationResult<DeleteUserAddressMutation>;
export type DeleteUserAddressMutationOptions = Apollo.BaseMutationOptions<DeleteUserAddressMutation, DeleteUserAddressMutationVariables>;
export const SetDefaultAddressDocument = gql`
    mutation SetDefaultAddress($userId: ID!, $addressId: ID!) {
  setDefaultAddress(userId: $userId, addressId: $addressId) {
    success
    message
  }
}
    `;
export type SetDefaultAddressMutationFn = Apollo.MutationFunction<SetDefaultAddressMutation, SetDefaultAddressMutationVariables>;

/**
 * __useSetDefaultAddressMutation__
 *
 * To run a mutation, you first call `useSetDefaultAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetDefaultAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setDefaultAddressMutation, { data, loading, error }] = useSetDefaultAddressMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      addressId: // value for 'addressId'
 *   },
 * });
 */
export function useSetDefaultAddressMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetDefaultAddressMutation, SetDefaultAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetDefaultAddressMutation, SetDefaultAddressMutationVariables>(SetDefaultAddressDocument, options);
      }
export type SetDefaultAddressMutationHookResult = ReturnType<typeof useSetDefaultAddressMutation>;
export type SetDefaultAddressMutationResult = Apollo.MutationResult<SetDefaultAddressMutation>;
export type SetDefaultAddressMutationOptions = Apollo.BaseMutationOptions<SetDefaultAddressMutation, SetDefaultAddressMutationVariables>;
export const RevokeUserSessionDocument = gql`
    mutation RevokeUserSession($sessionId: ID!) {
  revokeUserSession(sessionId: $sessionId) {
    success
    message
  }
}
    `;
export type RevokeUserSessionMutationFn = Apollo.MutationFunction<RevokeUserSessionMutation, RevokeUserSessionMutationVariables>;

/**
 * __useRevokeUserSessionMutation__
 *
 * To run a mutation, you first call `useRevokeUserSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeUserSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeUserSessionMutation, { data, loading, error }] = useRevokeUserSessionMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useRevokeUserSessionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RevokeUserSessionMutation, RevokeUserSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RevokeUserSessionMutation, RevokeUserSessionMutationVariables>(RevokeUserSessionDocument, options);
      }
export type RevokeUserSessionMutationHookResult = ReturnType<typeof useRevokeUserSessionMutation>;
export type RevokeUserSessionMutationResult = Apollo.MutationResult<RevokeUserSessionMutation>;
export type RevokeUserSessionMutationOptions = Apollo.BaseMutationOptions<RevokeUserSessionMutation, RevokeUserSessionMutationVariables>;
export const RevokeAllUserSessionsDocument = gql`
    mutation RevokeAllUserSessions($userId: ID!) {
  revokeAllUserSessions(userId: $userId) {
    success
    message
  }
}
    `;
export type RevokeAllUserSessionsMutationFn = Apollo.MutationFunction<RevokeAllUserSessionsMutation, RevokeAllUserSessionsMutationVariables>;

/**
 * __useRevokeAllUserSessionsMutation__
 *
 * To run a mutation, you first call `useRevokeAllUserSessionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeAllUserSessionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeAllUserSessionsMutation, { data, loading, error }] = useRevokeAllUserSessionsMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useRevokeAllUserSessionsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RevokeAllUserSessionsMutation, RevokeAllUserSessionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RevokeAllUserSessionsMutation, RevokeAllUserSessionsMutationVariables>(RevokeAllUserSessionsDocument, options);
      }
export type RevokeAllUserSessionsMutationHookResult = ReturnType<typeof useRevokeAllUserSessionsMutation>;
export type RevokeAllUserSessionsMutationResult = Apollo.MutationResult<RevokeAllUserSessionsMutation>;
export type RevokeAllUserSessionsMutationOptions = Apollo.BaseMutationOptions<RevokeAllUserSessionsMutation, RevokeAllUserSessionsMutationVariables>;
export const UnlinkUserAccountDocument = gql`
    mutation UnlinkUserAccount($accountId: ID!) {
  unlinkUserAccount(accountId: $accountId) {
    success
    message
  }
}
    `;
export type UnlinkUserAccountMutationFn = Apollo.MutationFunction<UnlinkUserAccountMutation, UnlinkUserAccountMutationVariables>;

/**
 * __useUnlinkUserAccountMutation__
 *
 * To run a mutation, you first call `useUnlinkUserAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlinkUserAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlinkUserAccountMutation, { data, loading, error }] = useUnlinkUserAccountMutation({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useUnlinkUserAccountMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UnlinkUserAccountMutation, UnlinkUserAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UnlinkUserAccountMutation, UnlinkUserAccountMutationVariables>(UnlinkUserAccountDocument, options);
      }
export type UnlinkUserAccountMutationHookResult = ReturnType<typeof useUnlinkUserAccountMutation>;
export type UnlinkUserAccountMutationResult = Apollo.MutationResult<UnlinkUserAccountMutation>;
export type UnlinkUserAccountMutationOptions = Apollo.BaseMutationOptions<UnlinkUserAccountMutation, UnlinkUserAccountMutationVariables>;
export const ForcePasswordResetDocument = gql`
    mutation ForcePasswordReset($userId: ID!) {
  forcePasswordReset(userId: $userId) {
    success
    message
  }
}
    `;
export type ForcePasswordResetMutationFn = Apollo.MutationFunction<ForcePasswordResetMutation, ForcePasswordResetMutationVariables>;

/**
 * __useForcePasswordResetMutation__
 *
 * To run a mutation, you first call `useForcePasswordResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForcePasswordResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forcePasswordResetMutation, { data, loading, error }] = useForcePasswordResetMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useForcePasswordResetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ForcePasswordResetMutation, ForcePasswordResetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ForcePasswordResetMutation, ForcePasswordResetMutationVariables>(ForcePasswordResetDocument, options);
      }
export type ForcePasswordResetMutationHookResult = ReturnType<typeof useForcePasswordResetMutation>;
export type ForcePasswordResetMutationResult = Apollo.MutationResult<ForcePasswordResetMutation>;
export type ForcePasswordResetMutationOptions = Apollo.BaseMutationOptions<ForcePasswordResetMutation, ForcePasswordResetMutationVariables>;
export const ImpersonateUserDocument = gql`
    mutation ImpersonateUser($userId: ID!) {
  impersonateUser(userId: $userId) {
    success
    message
    code
    timestamp
    data {
      user {
        id
        email
        role
        isActive
        emailVerified
        lastLoginAt
        profile {
          id
          firstName
          lastName
          phone
          dateOfBirth
          avatar
        }
      }
      accessToken
      refreshToken
    }
    metadata {
      requestId
      traceId
      duration
      timestamp
    }
  }
}
    `;
export type ImpersonateUserMutationFn = Apollo.MutationFunction<ImpersonateUserMutation, ImpersonateUserMutationVariables>;

/**
 * __useImpersonateUserMutation__
 *
 * To run a mutation, you first call `useImpersonateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useImpersonateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [impersonateUserMutation, { data, loading, error }] = useImpersonateUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useImpersonateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ImpersonateUserMutation, ImpersonateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ImpersonateUserMutation, ImpersonateUserMutationVariables>(ImpersonateUserDocument, options);
      }
export type ImpersonateUserMutationHookResult = ReturnType<typeof useImpersonateUserMutation>;
export type ImpersonateUserMutationResult = Apollo.MutationResult<ImpersonateUserMutation>;
export type ImpersonateUserMutationOptions = Apollo.BaseMutationOptions<ImpersonateUserMutation, ImpersonateUserMutationVariables>;