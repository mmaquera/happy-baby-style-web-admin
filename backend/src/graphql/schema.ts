import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  # Enums
  enum OrderStatus {
    pending
    paid
    processing
    shipped
    delivered
    cancelled
    refunded
  }

  enum PaymentMethodType {
    credit_card
    debit_card
    paypal
    bank_transfer
    cash_on_delivery
  }

  enum UserRole {
    admin
    customer
    staff
  }

  # Scalars
  scalar DateTime
  scalar Decimal
  scalar JSON
  scalar Upload

  # Types
  type UserProfile {
    id: ID!
    userId: ID!
    firstName: String
    lastName: String
    phone: String
    birthDate: DateTime
    avatarUrl: String
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Computed fields
    fullName: String
    
    # Relations
    addresses: [UserAddress!]!
    orders: [Order!]!
    cartItems: [ShoppingCart!]!
    favorites: [UserFavorite!]!
    paymentMethods: [PaymentMethod!]!
  }

  type UserAddress {
    id: ID!
    userId: ID!
    title: String!
    firstName: String!
    lastName: String!
    addressLine1: String!
    addressLine2: String
    city: String!
    state: String!
    postalCode: String!
    country: String!
    isDefault: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Computed fields
    fullName: String!
    fullAddress: String!
    
    # Relations
    user: UserProfile!
  }

  type Category {
    id: ID!
    name: String!
    description: String
    slug: String!
    imageUrl: String
    isActive: Boolean!
    sortOrder: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    products: [Product!]!
  }

  type Product {
    id: ID!
    categoryId: ID
    name: String!
    description: String
    price: Decimal!
    salePrice: Decimal
    sku: String!
    images: [String!]!
    attributes: JSON!
    isActive: Boolean!
    stockQuantity: Int!
    tags: [String!]!
    rating: Decimal!
    reviewCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Computed fields
    currentPrice: Decimal!
    hasDiscount: Boolean!
    discountPercentage: Int!
    totalStock: Int!
    isInStock: Boolean!
    
    # Relations
    category: Category
    variants: [ProductVariant!]!
    cartItems: [ShoppingCart!]!
    favorites: [UserFavorite!]!
    orderItems: [OrderItem!]!
  }

  type ProductVariant {
    id: ID!
    productId: ID
    size: String
    color: String
    sku: String!
    price: Decimal
    stockQuantity: Int!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Computed fields
    isInStock: Boolean!
    
    # Relations
    product: Product
    cartItems: [ShoppingCart!]!
    orderItems: [OrderItem!]!
  }

  type ShoppingCart {
    id: ID!
    userId: ID
    productId: ID
    variantId: ID
    quantity: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    user: UserProfile
    product: Product
    variant: ProductVariant
  }

  type UserFavorite {
    id: ID!
    userId: ID
    productId: ID
    createdAt: DateTime!
    
    # Relations
    user: UserProfile
    product: Product
  }

  type Order {
    id: ID!
    userId: ID
    orderNumber: String!
    status: OrderStatus!
    subtotal: Decimal!
    taxAmount: Decimal!
    shippingCost: Decimal!
    discountAmount: Decimal!
    totalAmount: Decimal!
    shippingAddress: JSON!
    billingAddress: JSON
    notes: String
    trackingNumber: String
    shippedAt: DateTime
    deliveredAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    user: UserProfile
    orderItems: [OrderItem!]!
  }

  type OrderItem {
    id: ID!
    orderId: ID
    productId: ID
    variantId: ID
    quantity: Int!
    unitPrice: Decimal!
    totalPrice: Decimal!
    productSnapshot: JSON
    createdAt: DateTime!
    
    # Relations
    order: Order
    product: Product
    variant: ProductVariant
  }

  type PaymentMethod {
    id: ID!
    userId: ID
    type: PaymentMethodType!
    provider: String
    lastFour: String
    metadata: JSON!
    isDefault: Boolean!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    user: UserProfile
  }

  # Input Types
  input CreateUserProfileInput {
    userId: ID!
    firstName: String
    lastName: String
    phone: String
    birthDate: DateTime
    avatarUrl: String
  }

  input UpdateUserProfileInput {
    firstName: String
    lastName: String
    phone: String
    birthDate: DateTime
    avatarUrl: String
  }

  input CreateUserAddressInput {
    userId: ID!
    title: String!
    firstName: String!
    lastName: String!
    addressLine1: String!
    addressLine2: String
    city: String!
    state: String!
    postalCode: String!
    country: String
    isDefault: Boolean
  }

  input UpdateUserAddressInput {
    title: String
    firstName: String
    lastName: String
    addressLine1: String
    addressLine2: String
    city: String
    state: String
    postalCode: String
    country: String
    isDefault: Boolean
  }

  input CreateCategoryInput {
    name: String!
    description: String
    slug: String!
    imageUrl: String
    isActive: Boolean
    sortOrder: Int
  }

  input UpdateCategoryInput {
    name: String
    description: String
    slug: String
    imageUrl: String
    isActive: Boolean
    sortOrder: Int
  }

  input CreateProductInput {
    categoryId: ID
    name: String!
    description: String
    price: Decimal!
    salePrice: Decimal
    sku: String!
    images: [String!]
    attributes: JSON
    isActive: Boolean
    stockQuantity: Int
    tags: [String!]
  }

  input UpdateProductInput {
    categoryId: ID
    name: String
    description: String
    price: Decimal
    salePrice: Decimal
    sku: String
    images: [String!]
    attributes: JSON
    isActive: Boolean
    stockQuantity: Int
    tags: [String!]
  }

  input CreateProductVariantInput {
    productId: ID!
    size: String
    color: String
    sku: String!
    price: Decimal
    stockQuantity: Int!
    isActive: Boolean
  }

  input UpdateProductVariantInput {
    size: String
    color: String
    sku: String
    price: Decimal
    stockQuantity: Int
    isActive: Boolean
  }

  input CreateOrderInput {
    userId: ID
    orderNumber: String!
    subtotal: Decimal!
    taxAmount: Decimal
    shippingCost: Decimal
    discountAmount: Decimal
    totalAmount: Decimal!
    shippingAddress: JSON!
    billingAddress: JSON
    notes: String
  }

  input UpdateOrderInput {
    status: OrderStatus
    trackingNumber: String
    notes: String
    shippedAt: DateTime
    deliveredAt: DateTime
  }

  input CreateOrderItemInput {
    orderId: ID!
    productId: ID!
    variantId: ID
    quantity: Int!
    unitPrice: Decimal!
    totalPrice: Decimal!
    productSnapshot: JSON
  }

  input AddToCartInput {
    userId: ID!
    productId: ID!
    variantId: ID
    quantity: Int!
  }

  input UpdateCartItemInput {
    quantity: Int!
  }

  input AddToFavoritesInput {
    userId: ID!
    productId: ID!
  }

  # Filter and Pagination
  input ProductFilterInput {
    categoryId: ID
    isActive: Boolean
    minPrice: Decimal
    maxPrice: Decimal
    inStock: Boolean
    search: String
    tags: [String!]
  }

  input OrderFilterInput {
    userId: ID
    status: OrderStatus
    startDate: DateTime
    endDate: DateTime
  }

  input UserFilterInput {
    role: UserRole
    isActive: Boolean
    search: String
  }

  input PaginationInput {
    limit: Int = 10
    offset: Int = 0
  }

  # Response Types
  type PaginatedProducts {
    products: [Product!]!
    total: Int!
    hasMore: Boolean!
  }

  type PaginatedOrders {
    orders: [Order!]!
    total: Int!
    hasMore: Boolean!
  }

  type PaginatedUsers {
    users: [UserProfile!]!
    total: Int!
    hasMore: Boolean!
  }

  type AuthResponse {
    token: String!
    user: UserProfile!
  }

  type SuccessResponse {
    success: Boolean!
    message: String!
  }

  type UploadResponse {
    success: Boolean!
    url: String
    filename: String
    message: String!
  }

  # Queries
  type Query {
    # Health check
    health: String!
    
    # User queries
    users(filter: UserFilterInput, pagination: PaginationInput): PaginatedUsers!
    userProfile(userId: ID!): UserProfile
    userAddresses(userId: ID!): [UserAddress!]!
    userAddress(id: ID!): UserAddress
    
    # Category queries
    categories: [Category!]!
    category(id: ID!): Category
    categoryBySlug(slug: String!): Category
    
    # Product queries
    products(filter: ProductFilterInput, pagination: PaginationInput): PaginatedProducts!
    product(id: ID!): Product
    productBySku(sku: String!): Product
    productsByCategory(categoryId: ID!, pagination: PaginationInput): PaginatedProducts!
    
    # Product variant queries
    productVariants(productId: ID!): [ProductVariant!]!
    productVariant(id: ID!): ProductVariant
    
    # Shopping cart queries
    userCart(userId: ID!): [ShoppingCart!]!
    cartItem(id: ID!): ShoppingCart
    
    # User favorites queries
    userFavorites(userId: ID!): [UserFavorite!]!
    isProductFavorited(userId: ID!, productId: ID!): Boolean!
    
    # Order queries
    orders(filter: OrderFilterInput, pagination: PaginationInput): PaginatedOrders!
    order(id: ID!): Order
    orderByNumber(orderNumber: String!): Order
    userOrders(userId: ID!, pagination: PaginationInput): PaginatedOrders!
    
    # Order item queries
    orderItems(orderId: ID!): [OrderItem!]!
    
    # Payment method queries
    userPaymentMethods(userId: ID!): [PaymentMethod!]!
    paymentMethod(id: ID!): PaymentMethod
    
    # Analytics queries
    productStats: JSON!
    orderStats: JSON!
    userStats: JSON!
  }

  # Mutations
  type Mutation {
    # User mutations
    createUserProfile(input: CreateUserProfileInput!): UserProfile!
    updateUserProfile(userId: ID!, input: UpdateUserProfileInput!): UserProfile!
    deleteUserProfile(userId: ID!): SuccessResponse!
    
    # User address mutations
    createUserAddress(input: CreateUserAddressInput!): UserAddress!
    updateUserAddress(id: ID!, input: UpdateUserAddressInput!): UserAddress!
    deleteUserAddress(id: ID!): SuccessResponse!
    
    # Category mutations
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): SuccessResponse!
    
    # Product mutations
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): SuccessResponse!
    
    # Product variant mutations
    createProductVariant(input: CreateProductVariantInput!): ProductVariant!
    updateProductVariant(id: ID!, input: UpdateProductVariantInput!): ProductVariant!
    deleteProductVariant(id: ID!): SuccessResponse!
    
    # Shopping cart mutations
    addToCart(input: AddToCartInput!): ShoppingCart!
    updateCartItem(id: ID!, input: UpdateCartItemInput!): ShoppingCart!
    removeFromCart(id: ID!): SuccessResponse!
    clearUserCart(userId: ID!): SuccessResponse!
    
    # User favorites mutations
    addToFavorites(input: AddToFavoritesInput!): UserFavorite!
    removeFromFavorites(userId: ID!, productId: ID!): SuccessResponse!
    
    # Order mutations
    createOrder(input: CreateOrderInput!): Order!
    updateOrder(id: ID!, input: UpdateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!
    cancelOrder(id: ID!): Order!
    shipOrder(id: ID!, trackingNumber: String): Order!
    deliverOrder(id: ID!): Order!
    
    # Order item mutations
    createOrderItem(input: CreateOrderItemInput!): OrderItem!
    updateOrderItem(id: ID!, quantity: Int!, unitPrice: Decimal!): OrderItem!
    deleteOrderItem(id: ID!): SuccessResponse!
    
    # Payment method mutations
    createPaymentMethod(userId: ID!, type: PaymentMethodType!, provider: String, lastFour: String, metadata: JSON): PaymentMethod!
    updatePaymentMethod(id: ID!, isDefault: Boolean, isActive: Boolean): PaymentMethod!
    deletePaymentMethod(id: ID!): SuccessResponse!
    
    # Image upload
    uploadImage(file: Upload!, entityType: String!, entityId: String!): UploadResponse!

    # Bulk operations
    bulkUpdateProducts(updates: [UpdateProductInput!]!): [Product!]!
    bulkUpdateOrderStatus(orders: [ID!]!, status: OrderStatus!): [Order!]!
  }
`; 