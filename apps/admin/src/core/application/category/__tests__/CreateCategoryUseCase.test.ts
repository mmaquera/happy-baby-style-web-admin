import { describe, it, expect, beforeEach } from 'vitest';
import { CreateCategoryUseCase } from '@happy-baby/application-category';
import { createMockRepository, MOCK_CATEGORY } from './fixtures';
import { isOk, isErr } from '@happy-baby/domain-shared';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let repo: ReturnType<typeof createMockRepository>;

  beforeEach(() => {
    repo = createMockRepository();
    useCase = new CreateCategoryUseCase(repo);
  });

  it('crea categoría con datos válidos', async () => {
    const result = await useCase.execute({ name: 'Ropa de Bebé' });
    expect(isOk(result)).toBe(true);
    expect(repo.create).toHaveBeenCalledOnce();
  });

  it('falla si el nombre está vacío', async () => {
    const result = await useCase.execute({ name: '' });
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.message).toContain('inválidos');
  });

  it('falla si el nombre supera 200 caracteres', async () => {
    const result = await useCase.execute({ name: 'a'.repeat(201) });
    expect(isErr(result)).toBe(true);
  });

  it('falla si la URL de imagen es inválida', async () => {
    const result = await useCase.execute({ name: 'Test', image: 'not-a-url' });
    expect(isErr(result)).toBe(true);
  });

  it('acepta imagen nula', async () => {
    const result = await useCase.execute({ name: 'Test', image: null });
    expect(isOk(result)).toBe(true);
  });

  it('falla si sortOrder es negativo', async () => {
    const result = await useCase.execute({ name: 'Test', sortOrder: -1 });
    expect(isErr(result)).toBe(true);
  });

  it('devuelve la categoría creada del repositorio', async () => {
    const result = await useCase.execute({ name: 'Ropa de Bebé' });
    expect(isOk(result)).toBe(true);
    if (isOk(result)) expect(result.value).toEqual(MOCK_CATEGORY);
  });

  it('slug inválido con mayúsculas falla', async () => {
    const result = await useCase.execute({ name: 'Test', slug: 'Mi Slug' });
    expect(isErr(result)).toBe(true);
  });

  it('slug válido pasa', async () => {
    const result = await useCase.execute({ name: 'Test', slug: 'mi-slug-123' });
    expect(isOk(result)).toBe(true);
  });
});
