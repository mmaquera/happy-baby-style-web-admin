import {
  CURRENCY_CONFIG,
  formatPrice,
  formatPriceRange,
  formatDiscountPrice,
  formatOriginalPrice,
  CURRENCY_SYMBOL,
} from '@happy-baby/shared-utils';

describe('CURRENCY_CONFIG', () => {
  it('has correct symbol', () => {
    expect(CURRENCY_CONFIG.symbol).toBe('S/');
  });

  it('has correct code', () => {
    expect(CURRENCY_CONFIG.code).toBe('PEN');
  });
});

describe('CURRENCY_SYMBOL', () => {
  it('is S/', () => {
    expect(CURRENCY_SYMBOL).toBe('S/');
  });
});

describe('formatPrice', () => {
  it('formats integer amount', () => {
    expect(formatPrice(100)).toBe('S/ 100.00');
  });

  it('formats decimal amount', () => {
    expect(formatPrice(29.99)).toBe('S/ 29.99');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('S/ 0.00');
  });
});

describe('formatPriceRange', () => {
  it('formats a price range', () => {
    expect(formatPriceRange(10, 50)).toBe('S/ 10.00 - S/ 50.00');
  });
});

describe('formatDiscountPrice', () => {
  it('formats discount price (ignores original)', () => {
    expect(formatDiscountPrice(100, 75)).toBe('S/ 75.00');
  });
});

describe('formatOriginalPrice', () => {
  it('formats original price', () => {
    expect(formatOriginalPrice(100)).toBe('S/ 100.00');
  });
});
