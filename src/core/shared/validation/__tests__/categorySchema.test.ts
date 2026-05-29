import { categorySchema, updateCategorySchema, createCategoryFormSchema } from '../categorySchema';

describe('categorySchema', () => {
  it('accepts valid category with all fields', () => {
    const result = categorySchema.safeParse({
      name: 'Ropa bebé',
      description: 'Ropa para bebés',
      slug: 'ropa-bebe',
      image: 'https://example.com/image.svg',
      isActive: true,
      sortOrder: 1,
    });
    expect(result.success).toBe(true);
  });

  it('accepts category with only required name', () => {
    const result = categorySchema.safeParse({ name: 'Ropa' });
    expect(result.success).toBe(true);
  });

  it('defaults isActive to true', () => {
    const result = categorySchema.safeParse({ name: 'Ropa' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.isActive).toBe(true);
  });

  it('defaults sortOrder to 0', () => {
    const result = categorySchema.safeParse({ name: 'Ropa' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.sortOrder).toBe(0);
  });

  it('rejects empty name', () => {
    const result = categorySchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name).toBeDefined();
  });

  it('rejects name exceeding 200 characters', () => {
    const result = categorySchema.safeParse({ name: 'a'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('rejects invalid image URL', () => {
    const result = categorySchema.safeParse({ name: 'Ropa', image: 'not-a-url' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.image).toBeDefined();
  });

  it('rejects slug with uppercase letters', () => {
    const result = categorySchema.safeParse({ name: 'Ropa', slug: 'Ropa-Bebe' });
    expect(result.success).toBe(false);
  });

  it('rejects slug with spaces', () => {
    const result = categorySchema.safeParse({ name: 'Ropa', slug: 'ropa bebe' });
    expect(result.success).toBe(false);
  });

  it('rejects negative sortOrder', () => {
    const result = categorySchema.safeParse({ name: 'Ropa', sortOrder: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects decimal sortOrder', () => {
    const result = categorySchema.safeParse({ name: 'Ropa', sortOrder: 1.5 });
    expect(result.success).toBe(false);
  });
});

describe('updateCategorySchema', () => {
  it('accepts empty object (all fields optional)', () => {
    const result = updateCategorySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts partial update with only name', () => {
    const result = updateCategorySchema.safeParse({ name: 'Nueva categoría' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid slug in partial update', () => {
    const result = updateCategorySchema.safeParse({ slug: 'Slug Inválido' });
    expect(result.success).toBe(false);
  });
});

describe('createCategoryFormSchema', () => {
  const validData = {
    name: 'Ropa bebé',
    description: 'Descripción',
    slug: 'ropa-bebe',
    image: 'https://example.com/img.svg',
    isActive: true,
    sortOrder: 0,
  };

  it('accepts valid form data', () => {
    expect(createCategoryFormSchema.safeParse(validData).success).toBe(true);
  });

  it('accepts form without description and image', () => {
    const { description: _, image: __, ...minimal } = validData;
    expect(createCategoryFormSchema.safeParse(minimal).success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = createCategoryFormSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name).toBeDefined();
  });

  it('rejects empty slug', () => {
    const result = createCategoryFormSchema.safeParse({ ...validData, slug: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.slug).toBeDefined();
  });

  it('rejects slug with special characters', () => {
    const result = createCategoryFormSchema.safeParse({ ...validData, slug: 'ropa_bebe' });
    expect(result.success).toBe(false);
  });

  it('rejects slug with uppercase', () => {
    const result = createCategoryFormSchema.safeParse({ ...validData, slug: 'RopaBebe' });
    expect(result.success).toBe(false);
  });

  it('rejects negative sortOrder', () => {
    const result = createCategoryFormSchema.safeParse({ ...validData, sortOrder: -5 });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.sortOrder).toBeDefined();
  });

  it('accepts sortOrder of 0', () => {
    const result = createCategoryFormSchema.safeParse({ ...validData, sortOrder: 0 });
    expect(result.success).toBe(true);
  });

  it('requires isActive to be boolean', () => {
    const result = createCategoryFormSchema.safeParse({ ...validData, isActive: 'yes' });
    expect(result.success).toBe(false);
  });
});
