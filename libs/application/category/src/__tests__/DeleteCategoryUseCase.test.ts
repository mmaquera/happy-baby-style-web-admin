import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteCategoryUseCase } from '@happy-baby/application-category';
import { createMockRepository } from './fixtures';
import { err, isOk, isErr, DomainError } from '@happy-baby/domain-shared';

describe('DeleteCategoryUseCase', () => {
  let useCase: DeleteCategoryUseCase;
  let repo: ReturnType<typeof createMockRepository>;

  beforeEach(() => {
    repo = createMockRepository();
    useCase = new DeleteCategoryUseCase(repo);
  });

  it('elimina la categoría y retorna true', async () => {
    const result = await useCase.execute('cat-1');
    expect(isOk(result)).toBe(true);
    if (isOk(result)) expect(result.value).toBe(true);
    expect(repo.delete).toHaveBeenCalledWith('cat-1');
  });

  it('falla si el id está vacío', async () => {
    const result = await useCase.execute('');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.message).toContain('requerido');
  });

  it('falla si el id es sólo espacios', async () => {
    const result = await useCase.execute('   ');
    expect(isErr(result)).toBe(true);
  });

  it('propaga error del repositorio', async () => {
    repo.delete.mockResolvedValueOnce(
      err(new DomainError('No encontrado', 'NOT_FOUND'))
    );
    const result = await useCase.execute('cat-99');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.message).toBe('No encontrado');
  });
});
