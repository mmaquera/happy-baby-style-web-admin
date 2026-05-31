import {
  productSchema,
  updateProductSchema,
  productFormSchema,
} from '@happy-baby/domain-shared';

describe('productSchema', () => {
  const validData = {
    name: 'Pelele azul',
    description: 'Ropa cómoda para bebés',
    sku: 'PELELE-001',
    price: 29.99,
    salePrice: 19.99,
    images: ['https://example.com/img1.jpg'],
    tags: ['bebé', 'azul'],
    isActive: true,
    stockQuantity: 50,
    categoryId: 'cat-123',
  };

  it('accepts valid product data', () => {
    expect(productSchema.safeParse(validData).success).toBe(true);
  });

  it('accepts product with only required fields', () => {
    expect(
      productSchema.safeParse({ name: 'Pelele', sku: 'SKU-001', price: 10 })
        .success
    ).toBe(true);
  });

  it('defaults isActive to true', () => {
    const result = productSchema.safeParse({
      name: 'Pelele',
      sku: 'SKU-001',
      price: 10,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.isActive).toBe(true);
  });

  it('defaults stockQuantity to 0', () => {
    const result = productSchema.safeParse({
      name: 'Pelele',
      sku: 'SKU-001',
      price: 10,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.stockQuantity).toBe(0);
  });

  it('rejects empty name', () => {
    const result = productSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name).toBeDefined();
  });

  it('rejects name exceeding 200 characters', () => {
    const result = productSchema.safeParse({
      ...validData,
      name: 'x'.repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty SKU', () => {
    const result = productSchema.safeParse({ ...validData, sku: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.sku).toBeDefined();
  });

  it('rejects SKU with spaces', () => {
    const result = productSchema.safeParse({ ...validData, sku: 'SKU 001' });
    expect(result.success).toBe(false);
  });

  it('rejects SKU with special characters', () => {
    const result = productSchema.safeParse({ ...validData, sku: 'SKU@001!' });
    expect(result.success).toBe(false);
  });

  it('accepts SKU with letters, numbers, hyphens and underscores', () => {
    const result = productSchema.safeParse({ ...validData, sku: 'SKU_001-A' });
    expect(result.success).toBe(true);
  });

  it('rejects zero price', () => {
    const result = productSchema.safeParse({ ...validData, price: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.price).toBeDefined();
  });

  it('rejects negative price', () => {
    const result = productSchema.safeParse({ ...validData, price: -5 });
    expect(result.success).toBe(false);
  });

  it('rejects salePrice greater than or equal to price', () => {
    const result = productSchema.safeParse({
      ...validData,
      price: 10,
      salePrice: 10,
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.salePrice).toBeDefined();
  });

  it('rejects salePrice greater than price', () => {
    const result = productSchema.safeParse({
      ...validData,
      price: 10,
      salePrice: 15,
    });
    expect(result.success).toBe(false);
  });

  it('accepts null salePrice', () => {
    const result = productSchema.safeParse({ ...validData, salePrice: null });
    expect(result.success).toBe(true);
  });

  it('rejects negative stockQuantity', () => {
    const result = productSchema.safeParse({ ...validData, stockQuantity: -1 });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.stockQuantity).toBeDefined();
  });

  it('rejects decimal stockQuantity', () => {
    const result = productSchema.safeParse({
      ...validData,
      stockQuantity: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid image URL', () => {
    const result = productSchema.safeParse({
      ...validData,
      images: ['not-a-url'],
    });
    expect(result.success).toBe(false);
  });

  it('accepts empty images array', () => {
    const result = productSchema.safeParse({ ...validData, images: [] });
    expect(result.success).toBe(true);
  });
});

describe('productFormSchema', () => {
  const validFormData = {
    name: 'Pelele azul',
    sku: 'PELELE-001',
    price: '29.99',
    salePrice: '19.99',
    categoryId: 'cat-123',
    stockQuantity: '50',
    description: 'Ropa bebé',
    tags: ['bebé'],
    isActive: true,
    images: ['https://example.com/img.jpg'],
    attributes: {},
  };

  it('coerces string price to number', () => {
    const result = productFormSchema.safeParse(validFormData);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.price).toBe(29.99);
  });

  it('rejects empty price string', () => {
    const result = productFormSchema.safeParse({ ...validFormData, price: '' });
    expect(result.success).toBe(false);
    const errors = result.error?.flatten().fieldErrors;
    expect(errors?.price).toBeDefined();
  });

  it('rejects price of zero', () => {
    const result = productFormSchema.safeParse({
      ...validFormData,
      price: '0',
    });
    expect(result.success).toBe(false);
  });

  it('accepts empty salePrice string (treated as undefined)', () => {
    const result = productFormSchema.safeParse({
      ...validFormData,
      salePrice: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects salePrice >= price', () => {
    const result = productFormSchema.safeParse({
      ...validFormData,
      price: '10',
      salePrice: '10',
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.salePrice).toBeDefined();
  });

  it('rejects empty categoryId', () => {
    const result = productFormSchema.safeParse({
      ...validFormData,
      categoryId: '',
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.categoryId).toBeDefined();
  });

  it('rejects images with blob: URLs', () => {
    const result = productFormSchema.safeParse({
      ...validFormData,
      images: ['blob:http://localhost/fake-url'],
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.images).toBeDefined();
  });

  it('coerces stockQuantity string to number', () => {
    const result = productFormSchema.safeParse({
      ...validFormData,
      stockQuantity: '10',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.stockQuantity).toBe(10);
  });

  it('rejects SKU shorter than 3 characters', () => {
    const result = productFormSchema.safeParse({ ...validFormData, sku: 'AB' });
    expect(result.success).toBe(false);
  });
});

describe('updateProductSchema', () => {
  it('accepts empty object (all fields optional)', () => {
    expect(updateProductSchema.safeParse({}).success).toBe(true);
  });

  it('accepts partial update with only name', () => {
    expect(
      updateProductSchema.safeParse({ name: 'Nuevo nombre' }).success
    ).toBe(true);
  });

  it('accepts partial update with only price', () => {
    expect(updateProductSchema.safeParse({ price: 25 }).success).toBe(true);
  });

  it('rejects salePrice >= price in partial update', () => {
    const result = updateProductSchema.safeParse({ price: 20, salePrice: 25 });
    expect(result.success).toBe(false);
  });

  it('accepts valid SKU in partial update', () => {
    expect(updateProductSchema.safeParse({ sku: 'NEW-SKU-001' }).success).toBe(
      true
    );
  });

  it('rejects invalid SKU in partial update', () => {
    const result = updateProductSchema.safeParse({ sku: 'invalid sku!' });
    expect(result.success).toBe(false);
  });
});
