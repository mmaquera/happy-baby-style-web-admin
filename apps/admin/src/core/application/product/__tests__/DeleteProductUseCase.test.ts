import { DeleteProductUseCase } from '@happy-baby/application-product';
import { isOk, isErr, ok } from '@happy-baby/domain-shared';
import { ValidationError } from '@happy-baby/domain-shared';
import { createMockRepository } from './fixtures';

describe('DeleteProductUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    const useCase = new DeleteProductUseCase(repo);
    return { useCase, repo };
  };

  it('returns ok(true) for valid id', async () => {
    const { useCase, repo } = makeUseCase();
    repo.delete.mockResolvedValueOnce(ok(true));

    const result = await useCase.execute('prod-1');

    expect(isOk(result)).toBe(true);
    if (isOk(result)) expect(result.value).toBe(true);
    expect(repo.delete).toHaveBeenCalledWith('prod-1');
  });

  it('returns err(ValidationError) for empty id', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('');

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);
    }
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) for whitespace id', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('   ');

    expect(isErr(result)).toBe(true);
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    repo.delete.mockResolvedValueOnce({
      ok: false,
      error: new Error('Not found'),
    });

    const result = await useCase.execute('prod-1');

    expect(isErr(result)).toBe(true);
  });
});
