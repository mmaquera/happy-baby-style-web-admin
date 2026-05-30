import { describe, it, expect, beforeEach } from 'vitest';
import { ListCategoriesUseCase } from '@happy-baby/application-category';
import { createMockRepository, MOCK_CATEGORY_PAGE } from './fixtures';
import { ok, err, isOk, isErr, DomainError } from '@happy-baby/domain-shared';

describe('ListCategoriesUseCase', () => {
  let useCase: ListCategoriesUseCase;
  let repo: ReturnType<typeof createMockRepository>;

  beforeEach(() => {
    repo = createMockRepository();
    useCase = new ListCategoriesUseCase(repo);
  });

  it('devuelve la página de categorías con defaults', async () => {
    repo.findAll.mockResolvedValueOnce(ok(MOCK_CATEGORY_PAGE));
    const result = await useCase.execute();
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.items).toHaveLength(1);
      expect(result.value.total).toBe(1);
      expect(result.value.hasMore).toBe(false);
    }
    expect(repo.findAll).toHaveBeenCalledWith(undefined, 20, 0);
  });

  it('pasa filtro, limit y offset al repositorio', async () => {
    repo.findAll.mockResolvedValueOnce(
      ok({ items: [], total: 0, hasMore: false })
    );
    const filter = { search: 'ropa', isActive: true };
    await useCase.execute({ filter, limit: 10, offset: 5 });
    expect(repo.findAll).toHaveBeenCalledWith(filter, 10, 5);
  });

  it('devuelve lista vacía cuando no hay categorías', async () => {
    repo.findAll.mockResolvedValueOnce(
      ok({ items: [], total: 0, hasMore: false })
    );
    const result = await useCase.execute();
    expect(isOk(result)).toBe(true);
    if (isOk(result)) expect(result.value.items).toHaveLength(0);
  });

  it('propaga error del repositorio', async () => {
    repo.findAll.mockResolvedValueOnce(err(new DomainError('DB error')));
    const result = await useCase.execute();
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.message).toBe('DB error');
  });

  it('usa limit 20 y offset 0 por defecto', async () => {
    repo.findAll.mockResolvedValueOnce(ok(MOCK_CATEGORY_PAGE));
    await useCase.execute({});
    expect(repo.findAll).toHaveBeenCalledWith(undefined, 20, 0);
  });
});
