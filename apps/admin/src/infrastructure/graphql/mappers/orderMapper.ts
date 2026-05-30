import type { OrderStatus } from '@/generated/graphql';
import type {
  Order,
  OrderItem,
  OrderAddress,
  OrderCustomer,
  OrderStatus as DomainOrderStatus,
} from '@happy-baby/domain-order';

// Minimal address shape from any order query
interface OrderAddressDTO {
  id: string;
  firstName: string;
  lastName: string;
  company?: string | null;
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
}

// Minimal customer shape returned from order queries (uses UserProfile)
interface OrderCustomerDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
}

// Minimal order item shape
interface OrderItemDTO {
  id: string;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
  product?: {
    id: string;
    name: string;
    sku: string;
    images?: string[];
  } | null;
}

// Minimal DTO shape accepted from any query/mutation returning order data
export interface OrderDTO {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number | string;
  taxAmount: number | string;
  shippingAmount: number | string;
  totalAmount: number | string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: OrderCustomerDTO | null;
  items?: OrderItemDTO[];
  shippingAddress?: OrderAddressDTO | null;
}

const parseDecimal = (value: number | string): number => {
  if (typeof value === 'number') return value;
  return parseFloat(value);
};

const toOrderAddress = (dto: OrderAddressDTO): OrderAddress => ({
  id: dto.id,
  firstName: dto.firstName,
  lastName: dto.lastName,
  company: dto.company ?? null,
  address1: dto.address1,
  address2: dto.address2 ?? null,
  city: dto.city,
  state: dto.state,
  postalCode: dto.postalCode,
  country: dto.country,
  phone: dto.phone ?? null,
});

export const orderMapper = {
  toDomain(dto: OrderDTO): Order {
    const customer: OrderCustomer | null = dto.user
      ? {
          id: dto.user.id,
          email: dto.user.email,
          firstName: dto.user.firstName,
          lastName: dto.user.lastName,
          phone: dto.user.phone ?? null,
        }
      : null;

    const items: OrderItem[] = (dto.items ?? []).map(item => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: parseDecimal(item.unitPrice),
      totalPrice: parseDecimal(item.totalPrice),
      product: item.product
        ? {
            id: item.product.id,
            name: item.product.name,
            sku: item.product.sku,
            images: item.product.images ?? [],
          }
        : null,
    }));

    return {
      id: dto.id,
      orderNumber: dto.orderNumber,
      status: dto.status as DomainOrderStatus,
      subtotal: parseDecimal(dto.subtotal),
      taxAmount: parseDecimal(dto.taxAmount),
      shippingAmount: parseDecimal(dto.shippingAmount),
      totalAmount: parseDecimal(dto.totalAmount),
      notes: dto.notes ?? null,
      customer,
      items,
      shippingAddress: dto.shippingAddress
        ? toOrderAddress(dto.shippingAddress)
        : null,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  },
};
