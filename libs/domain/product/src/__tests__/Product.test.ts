import {
  currentPrice,
  hasDiscount,
  discountPercentage,
  isInStock,
  type Product,
} from '@happy-baby/domain-product';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'p1',
  name: 'Pelele azul',
  description: null,
  sku: 'PELELE-001',
  price: 100,
  salePrice: null,
  images: [],
  tags: [],
  attributes: {},
  isActive: true,
  stockQuantity: 10,
  categoryId: null,
  rating: null,
  reviewCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('currentPrice', () => {
  it('returns price when no salePrice', () => {
    expect(currentPrice(makeProduct({ price: 100, salePrice: null }))).toBe(
      100
    );
  });

  it('returns salePrice when it is less than price', () => {
    expect(currentPrice(makeProduct({ price: 100, salePrice: 75 }))).toBe(75);
  });

  it('returns price when salePrice equals price', () => {
    expect(currentPrice(makeProduct({ price: 100, salePrice: 100 }))).toBe(100);
  });

  it('returns price when salePrice is greater than price', () => {
    expect(currentPrice(makeProduct({ price: 100, salePrice: 120 }))).toBe(100);
  });
});

describe('hasDiscount', () => {
  it('returns false when salePrice is null', () => {
    expect(hasDiscount(makeProduct({ salePrice: null }))).toBe(false);
  });

  it('returns true when salePrice is less than price', () => {
    expect(hasDiscount(makeProduct({ price: 100, salePrice: 80 }))).toBe(true);
  });

  it('returns false when salePrice equals price', () => {
    expect(hasDiscount(makeProduct({ price: 100, salePrice: 100 }))).toBe(
      false
    );
  });

  it('returns false when salePrice is greater than price', () => {
    expect(hasDiscount(makeProduct({ price: 100, salePrice: 110 }))).toBe(
      false
    );
  });
});

describe('discountPercentage', () => {
  it('returns 0 when no discount', () => {
    expect(discountPercentage(makeProduct({ salePrice: null }))).toBe(0);
  });

  it('returns correct percentage for 25% discount', () => {
    expect(discountPercentage(makeProduct({ price: 100, salePrice: 75 }))).toBe(
      25
    );
  });

  it('returns correct percentage for 50% discount', () => {
    expect(discountPercentage(makeProduct({ price: 100, salePrice: 50 }))).toBe(
      50
    );
  });

  it('rounds to nearest integer', () => {
    expect(
      discountPercentage(makeProduct({ price: 100, salePrice: 66.67 }))
    ).toBe(33);
  });

  it('returns 0 when salePrice equals price', () => {
    expect(
      discountPercentage(makeProduct({ price: 100, salePrice: 100 }))
    ).toBe(0);
  });
});

describe('isInStock', () => {
  it('returns true when stock > 0', () => {
    expect(isInStock(makeProduct({ stockQuantity: 5 }))).toBe(true);
  });

  it('returns false when stock is 0', () => {
    expect(isInStock(makeProduct({ stockQuantity: 0 }))).toBe(false);
  });
});
