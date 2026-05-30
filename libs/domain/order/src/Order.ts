export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderAddress {
  id: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: { id: string; name: string; sku: string; images: string[] } | null;
}

export interface OrderCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  notes: string | null;
  customer: OrderCustomer | null;
  items: OrderItem[];
  shippingAddress: OrderAddress | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderFilter {
  status?: OrderStatus;
  search?: string;
}

export interface OrderPage {
  items: Order[];
  total: number;
  hasMore: boolean;
}
