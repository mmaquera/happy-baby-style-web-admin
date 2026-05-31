import { orderMapper, type OrderDTO } from '@happy-baby/infrastructure-graphql';

const BASE_DTO: OrderDTO = {
  id: 'order-1',
  orderNumber: 'ORD-001',
  status: 'pending' as const,
  subtotal: '80000',
  taxAmount: '8000',
  shippingAmount: '5000',
  totalAmount: '93000',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T12:00:00Z',
};

describe('orderMapper.toDomain', () => {
  it('maps scalar fields correctly', () => {
    const order = orderMapper.toDomain(BASE_DTO);

    expect(order.id).toBe('order-1');
    expect(order.orderNumber).toBe('ORD-001');
    expect(order.status).toBe('pending');
  });

  it('parses string Decimal amounts to numbers', () => {
    const order = orderMapper.toDomain(BASE_DTO);

    expect(order.subtotal).toBe(80000);
    expect(order.taxAmount).toBe(8000);
    expect(order.shippingAmount).toBe(5000);
    expect(order.totalAmount).toBe(93000);
  });

  it('handles numeric amounts without conversion', () => {
    const order = orderMapper.toDomain({
      ...BASE_DTO,
      subtotal: 80000,
      taxAmount: 8000,
      shippingAmount: 5000,
      totalAmount: 93000,
    });

    expect(order.subtotal).toBe(80000);
    expect(order.totalAmount).toBe(93000);
  });

  it('converts createdAt/updatedAt strings to Date', () => {
    const order = orderMapper.toDomain(BASE_DTO);

    expect(order.createdAt).toBeInstanceOf(Date);
    expect(order.updatedAt).toBeInstanceOf(Date);
    expect(order.createdAt.toISOString()).toBe('2024-01-15T10:00:00.000Z');
  });

  it('maps customer from user field', () => {
    const dto: OrderDTO = {
      ...BASE_DTO,
      user: {
        id: 'user-1',
        email: 'ana@example.com',
        firstName: 'Ana',
        lastName: 'García',
        phone: '+573001234567',
      },
    };

    const order = orderMapper.toDomain(dto);

    expect(order.customer).not.toBeNull();
    expect(order.customer?.id).toBe('user-1');
    expect(order.customer?.email).toBe('ana@example.com');
    expect(order.customer?.firstName).toBe('Ana');
    expect(order.customer?.phone).toBe('+573001234567');
  });

  it('sets customer to null when user is absent', () => {
    const order = orderMapper.toDomain(BASE_DTO);

    expect(order.customer).toBeNull();
  });

  it('maps shippingAddress correctly', () => {
    const dto: OrderDTO = {
      ...BASE_DTO,
      shippingAddress: {
        id: 'addr-1',
        firstName: 'Ana',
        lastName: 'García',
        company: null,
        address1: 'Calle 123 #45-67',
        address2: null,
        city: 'Bogotá',
        state: 'Cundinamarca',
        postalCode: '110111',
        country: 'CO',
        phone: null,
      },
    };

    const order = orderMapper.toDomain(dto);

    expect(order.shippingAddress).not.toBeNull();
    expect(order.shippingAddress?.address1).toBe('Calle 123 #45-67');
    expect(order.shippingAddress?.city).toBe('Bogotá');
    expect(order.shippingAddress?.postalCode).toBe('110111');
    expect(order.shippingAddress?.company).toBeNull();
  });

  it('sets shippingAddress to null when absent', () => {
    const order = orderMapper.toDomain(BASE_DTO);

    expect(order.shippingAddress).toBeNull();
  });

  it('maps order items with product info', () => {
    const dto: OrderDTO = {
      ...BASE_DTO,
      items: [
        {
          id: 'item-1',
          quantity: 2,
          unitPrice: '40000',
          totalPrice: '80000',
          product: {
            id: 'prod-1',
            name: 'Body Orgánico',
            sku: 'BODY-001',
            images: ['img.jpg'],
          },
        },
      ],
    };

    const order = orderMapper.toDomain(dto);

    expect(order.items).toHaveLength(1);
    expect(order.items[0].id).toBe('item-1');
    expect(order.items[0].quantity).toBe(2);
    expect(order.items[0].unitPrice).toBe(40000);
    expect(order.items[0].totalPrice).toBe(80000);
    expect(order.items[0].product?.name).toBe('Body Orgánico');
  });

  it('sets item.product to null when absent', () => {
    const dto: OrderDTO = {
      ...BASE_DTO,
      items: [
        {
          id: 'item-1',
          quantity: 1,
          unitPrice: 10000,
          totalPrice: 10000,
          product: null,
        },
      ],
    };

    const order = orderMapper.toDomain(dto);

    expect(order.items[0].product).toBeNull();
  });

  it('defaults items to empty array when absent', () => {
    const order = orderMapper.toDomain({ ...BASE_DTO, items: undefined });

    expect(order.items).toEqual([]);
  });

  it('maps notes to null when absent', () => {
    const order = orderMapper.toDomain(BASE_DTO);

    expect(order.notes).toBeNull();
  });

  it('maps notes when present', () => {
    const order = orderMapper.toDomain({ ...BASE_DTO, notes: 'Sin lácteos' });

    expect(order.notes).toBe('Sin lácteos');
  });

  it('maps phone null when missing from user', () => {
    const dto: OrderDTO = {
      ...BASE_DTO,
      user: { id: 'u-1', email: 'x@x.com', firstName: 'X', lastName: 'Y' },
    };

    const order = orderMapper.toDomain(dto);

    expect(order.customer?.phone).toBeNull();
  });
});
