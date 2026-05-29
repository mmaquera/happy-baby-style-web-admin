import { describe, it, expect } from 'vitest';
import { categoryMapper } from '../categoryMapper';
import type { Category as GQLCategory } from '@/generated/graphql';

const GQL_CATEGORY: GQLCategory = {
  __typename: 'Category',
  id: 'cat-1',
  name: 'Ropa de Bebé',
  description: 'Colección de ropa',
  slug: 'ropa-de-bebe',
  image: 'https://cdn.example.com/cat.jpg',
  isActive: true,
  sortOrder: 1,
  products: [{ __typename: 'Product', id: 'p1' }, { __typename: 'Product', id: 'p2' }] as GQLCategory['products'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z',
};

describe('categoryMapper.toDomain', () => {
  it('mapea todos los campos básicos', () => {
    const domain = categoryMapper.toDomain(GQL_CATEGORY);
    expect(domain.id).toBe('cat-1');
    expect(domain.name).toBe('Ropa de Bebé');
    expect(domain.description).toBe('Colección de ropa');
    expect(domain.slug).toBe('ropa-de-bebe');
    expect(domain.image).toBe('https://cdn.example.com/cat.jpg');
    expect(domain.isActive).toBe(true);
    expect(domain.sortOrder).toBe(1);
  });

  it('calcula productCount desde el array de products del GQL', () => {
    const domain = categoryMapper.toDomain(GQL_CATEGORY);
    expect(domain.productCount).toBe(2);
  });

  it('productCount es 0 si products es undefined', () => {
    const domain = categoryMapper.toDomain({ ...GQL_CATEGORY, products: undefined });
    expect(domain.productCount).toBe(0);
  });

  it('productCount es 0 si products es array vacío', () => {
    const domain = categoryMapper.toDomain({ ...GQL_CATEGORY, products: [] });
    expect(domain.productCount).toBe(0);
  });

  it('convierte createdAt string a Date', () => {
    const domain = categoryMapper.toDomain(GQL_CATEGORY);
    expect(domain.createdAt).toBeInstanceOf(Date);
    expect(domain.createdAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });

  it('convierte updatedAt string a Date', () => {
    const domain = categoryMapper.toDomain(GQL_CATEGORY);
    expect(domain.updatedAt).toBeInstanceOf(Date);
    expect(domain.updatedAt.toISOString()).toBe('2024-06-01T00:00:00.000Z');
  });

  it('normaliza description null a null', () => {
    const domain = categoryMapper.toDomain({ ...GQL_CATEGORY, description: null });
    expect(domain.description).toBeNull();
  });

  it('normaliza image null a null', () => {
    const domain = categoryMapper.toDomain({ ...GQL_CATEGORY, image: null });
    expect(domain.image).toBeNull();
  });

  it('normaliza description undefined a null', () => {
    const domain = categoryMapper.toDomain({ ...GQL_CATEGORY, description: undefined });
    expect(domain.description).toBeNull();
  });
});

describe('categoryMapper.toCreateDTO', () => {
  it('incluye nombre y genera slug a partir del nombre', () => {
    const dto = categoryMapper.toCreateDTO({ name: 'Ropa Bebé' });
    expect(dto.name).toBe('Ropa Bebé');
    expect(dto.slug).toBe('ropa-bebé');
  });

  it('usa slug provisto si existe', () => {
    const dto = categoryMapper.toCreateDTO({ name: 'Test', slug: 'mi-slug' });
    expect(dto.slug).toBe('mi-slug');
  });

  it('incluye description si se pasa', () => {
    const dto = categoryMapper.toCreateDTO({ name: 'Test', description: 'Desc' });
    expect(dto.description).toBe('Desc');
  });

  it('no incluye description si es undefined', () => {
    const dto = categoryMapper.toCreateDTO({ name: 'Test' });
    expect('description' in dto).toBe(false);
  });

  it('incluye image si se pasa', () => {
    const dto = categoryMapper.toCreateDTO({ name: 'Test', image: 'https://img.com/a.jpg' });
    expect(dto.image).toBe('https://img.com/a.jpg');
  });

  it('incluye isActive si se pasa', () => {
    const dto = categoryMapper.toCreateDTO({ name: 'Test', isActive: false });
    expect(dto.isActive).toBe(false);
  });

  it('incluye sortOrder si se pasa', () => {
    const dto = categoryMapper.toCreateDTO({ name: 'Test', sortOrder: 5 });
    expect(dto.sortOrder).toBe(5);
  });
});

describe('categoryMapper.toUpdateDTO', () => {
  it('incluye sólo los campos provistos', () => {
    const dto = categoryMapper.toUpdateDTO({ name: 'Nuevo' });
    expect(dto.name).toBe('Nuevo');
    expect('slug' in dto).toBe(false);
    expect('isActive' in dto).toBe(false);
  });

  it('DTO vacío si input es vacío', () => {
    const dto = categoryMapper.toUpdateDTO({});
    expect(Object.keys(dto)).toHaveLength(0);
  });

  it('incluye isActive si se pasa', () => {
    const dto = categoryMapper.toUpdateDTO({ isActive: false });
    expect(dto.isActive).toBe(false);
  });

  it('incluye sortOrder si se pasa', () => {
    const dto = categoryMapper.toUpdateDTO({ sortOrder: 10 });
    expect(dto.sortOrder).toBe(10);
  });

  it('incluye description null para limpiarla', () => {
    const dto = categoryMapper.toUpdateDTO({ description: null });
    expect(dto.description).toBeNull();
  });
});
