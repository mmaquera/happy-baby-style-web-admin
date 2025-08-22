// =====================================================
// CURRENCY CONFIGURATION
// =====================================================
// Centralized currency configuration for the application
// Following Clean Architecture principles for easy maintenance

export const CURRENCY_CONFIG = {
  // Currency symbol
  symbol: 'S/',
  
  // Currency name
  name: 'Soles',
  
  // Currency code (ISO 4217)
  code: 'PEN',
  
  // Decimal places
  decimals: 2,
  
  // Thousand separator
  thousandSeparator: ',',
  
  // Decimal separator
  decimalSeparator: '.',
  
  // Position of currency symbol
  symbolPosition: 'before' as 'before' | 'after',
  
  // Format function for prices
  format: (amount: number): string => {
    return `S/ ${amount.toFixed(2)}`;
  },
  
  // Format function for price ranges
  formatRange: (min: number, max: number): string => {
    return `S/ ${min.toFixed(2)} - S/ ${max.toFixed(2)}`;
  },
  
  // Format function for discount prices
  formatDiscount: (originalPrice: number, discountPrice: number): string => {
    return `S/ ${discountPrice.toFixed(2)}`;
  },
  
  // Format function for original prices (with strikethrough)
  formatOriginal: (price: number): string => {
    return `S/ ${price.toFixed(2)}`;
  }
};

// Export individual functions for specific use cases
export const formatPrice = CURRENCY_CONFIG.format;
export const formatPriceRange = CURRENCY_CONFIG.formatRange;
export const formatDiscountPrice = CURRENCY_CONFIG.formatDiscount;
export const formatOriginalPrice = CURRENCY_CONFIG.formatOriginal;

// Currency symbol constant for direct use
export const CURRENCY_SYMBOL = CURRENCY_CONFIG.symbol;
