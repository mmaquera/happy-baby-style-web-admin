import { productMapper } from '@happy-baby/infrastructure-graphql';
import type { Product as GQLProduct } from '@/generated/graphql';
import type {
  CreateProductInput,
  UpdateProductInput,
} from '@happy-baby/domain-product';

const gqlProduct: GQLProduct = {
  id: 'prod-1',
  name: 'Body Orgánico',
  description: 'Para bebé',
  sku: 'BODY-001',
  price: '100.50' as unknown as number,
  salePrice: '80.00' as unknown as number,
  images: ['https://cdn.example.com/img.jpg'],
  tags: ['nuevo', 'oferta'],
  attributes: { material: 'algodón' },
  isActive: true,
  stockQuantity: 10,
  categoryId: 'cat-1',
  rating: '4.5' as unknown as number,
  reviewCount: 12,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-06-01T12:00:00.000Z',
  // required relation fields (unused by mapper)
  appEvents: [],
  cartItems: [],
  category: null,
  currentPrice: '80.00' as unknown as number,
  discountPercentage: 20,
  favorites: [],
  hasDiscount: true,
  inventoryTransactions: [],
  isInStock: true,
  orderItems: [],
  reviews: [],
  stockAlerts: [],
  variants: [],
} as unknown as GQLProduct;

describe('productMapper.toDomain', () => {
  it('maps required string fields correctly', () => {
    const product = productMapper.toDomain(gqlProduct);
    expect(product.id).toBe('prod-1');
    expect(product.name).toBe('Body Orgánico');
    expect(product.sku).toBe('BODY-001');
    expect(product.description).toBe('Para bebé');
    expect(product.isActive).toBe(true);
    expect(product.stockQuantity).toBe(10);
    expect(product.categoryId).toBe('cat-1');
    expect(product.reviewCount).toBe(12);
  });

  it('parses Decimal price from string to number', () => {
    const product = productMapper.toDomain(gqlProduct);
    expect(product.price).toBe(100.5);
    expect(typeof product.price).toBe('number');
  });

  it('parses Decimal salePrice from string to number', () => {
    const product = productMapper.toDomain(gqlProduct);
    expect(product.salePrice).toBe(80.0);
    expect(typeof product.salePrice).toBe('number');
  });

  it('parses Decimal rating from string to number', () => {
    const product = productMapper.toDomain(gqlProduct);
    expect(product.rating).toBe(4.5);
  });

  it('parses createdAt and updatedAt as Date objects', () => {
    const product = productMapper.toDomain(gqlProduct);
    expect(product.createdAt).toBeInstanceOf(Date);
    expect(product.updatedAt).toBeInstanceOf(Date);
    expect(product.createdAt.getUTCFullYear()).toBe(2024);
    expect(product.updatedAt.getUTCMonth()).toBe(5); // June = 5 (UTC)
  });

  it('maps images and tags arrays', () => {
    const product = productMapper.toDomain(gqlProduct);
    expect(product.images).toEqual(['https://cdn.example.com/img.jpg']);
    expect(product.tags).toEqual(['nuevo', 'oferta']);
  });

  it('maps attributes as Record<string, unknown>', () => {
    const product = productMapper.toDomain(gqlProduct);
    expect(product.attributes).toEqual({ material: 'algodón' });
  });

  it('maps null description to null', () => {
    const product = productMapper.toDomain({
      ...gqlProduct,
      description: null,
    } as GQLProduct);
    expect(product.description).toBeNull();
  });

  it('maps null salePrice to null', () => {
    const product = productMapper.toDomain({
      ...gqlProduct,
      salePrice: null,
    } as GQLProduct);
    expect(product.salePrice).toBeNull();
  });

  it('maps null rating to null', () => {
    const product = productMapper.toDomain({
      ...gqlProduct,
      rating: null,
    } as GQLProduct);
    expect(product.rating).toBeNull();
  });

  it('maps null categoryId to null', () => {
    const product = productMapper.toDomain({
      ...gqlProduct,
      categoryId: null,
    } as GQLProduct);
    expect(product.categoryId).toBeNull();
  });

  it('defaults images to [] when null/undefined', () => {
    const product = productMapper.toDomain({
      ...gqlProduct,
      images: null,
    } as unknown as GQLProduct);
    expect(product.images).toEqual([]);
  });

  it('defaults tags to [] when null/undefined', () => {
    const product = productMapper.toDomain({
      ...gqlProduct,
      tags: null,
    } as unknown as GQLProduct);
    expect(product.tags).toEqual([]);
  });
});

describe('productMapper.toCreateDTO', () => {
  const input: CreateProductInput = {
    name: 'Body Orgánico',
    sku: 'BODY-001',
    price: 100.5,
    salePrice: 80,
    description: 'Para bebé',
    categoryId: 'cat-1',
    stockQuantity: 5,
    isActive: true,
    images: ['https://cdn.example.com/img.jpg'],
    tags: ['nuevo'],
    attributes: { material: 'algodón' },
  };

  it('includes required fields', () => {
    const dto = productMapper.toCreateDTO(input);
    expect(dto.name).toBe('Body Orgánico');
    expect(dto.sku).toBe('BODY-001');
    expect(dto.price).toBe(100.5);
  });

  it('includes optional fields when provided', () => {
    const dto = productMapper.toCreateDTO(input);
    expect(dto.description).toBe('Para bebé');
    expect(dto.salePrice).toBe(80);
    expect(dto.categoryId).toBe('cat-1');
    expect(dto.stockQuantity).toBe(5);
    expect(dto.isActive).toBe(true);
    expect(dto.images).toEqual(['https://cdn.example.com/img.jpg']);
    expect(dto.tags).toEqual(['nuevo']);
    expect(dto.attributes).toEqual({ material: 'algodón' });
  });

  it('omits undefined optional fields (exactOptionalPropertyTypes)', () => {
    const minimalInput: CreateProductInput = {
      name: 'Test',
      sku: 'TEST-001',
      price: 50,
    };
    const dto = productMapper.toCreateDTO(minimalInput);
    expect('description' in dto).toBe(false);
    expect('salePrice' in dto).toBe(false);
    expect('categoryId' in dto).toBe(false);
  });

  it('defaults images to [] when not provided', () => {
    const dto = productMapper.toCreateDTO({
      name: 'Test',
      sku: 'T-1',
      price: 10,
    });
    expect(dto.images).toEqual([]);
  });

  it('defaults tags to [] when not provided', () => {
    const dto = productMapper.toCreateDTO({
      name: 'Test',
      sku: 'T-1',
      price: 10,
    });
    expect(dto.tags).toEqual([]);
  });
});

describe('productMapper.toUpdateDTO', () => {
  it('produces empty object for empty input', () => {
    const dto = productMapper.toUpdateDTO({});
    expect(Object.keys(dto)).toHaveLength(0);
  });

  it('includes only provided fields', () => {
    const dto = productMapper.toUpdateDTO({ name: 'Nuevo', isActive: false });
    expect(dto.name).toBe('Nuevo');
    expect(dto.isActive).toBe(false);
    expect('price' in dto).toBe(false);
    expect('sku' in dto).toBe(false);
  });

  it('includes price when provided', () => {
    const dto = productMapper.toUpdateDTO({ price: 150.0 });
    expect(dto.price).toBe(150.0);
    expect(Object.keys(dto)).toHaveLength(1);
  });

  it('includes stockQuantity when provided', () => {
    const dto = productMapper.toUpdateDTO({ stockQuantity: 25 });
    expect(dto.stockQuantity).toBe(25);
  });

  it('includes images array when provided', () => {
    const input: UpdateProductInput = {
      images: ['https://cdn.example.com/a.jpg'],
    };
    const dto = productMapper.toUpdateDTO(input);
    expect(dto.images).toEqual(['https://cdn.example.com/a.jpg']);
  });

  it('round-trips: toDomain → toUpdateDTO preserves numeric types', () => {
    const domain = productMapper.toDomain(gqlProduct);
    const dto = productMapper.toUpdateDTO({
      price: domain.price,
      salePrice: domain.salePrice,
    });
    expect(dto.price).toBe(100.5);
    expect(dto.salePrice).toBe(80.0);
    expect(typeof dto.price).toBe('number');
  });
});
