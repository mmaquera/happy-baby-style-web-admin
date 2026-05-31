import { UpdateProductUseCase } from '@happy-baby/application-product';
import { isOk, isErr, ok } from '@happy-baby/domain-shared';
import { ValidationError } from '@happy-baby/domain-shared';
import { createMockRepository, MOCK_PRODUCT } from './fixtures';

describe('UpdateProductUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    const useCase = new UpdateProductUseCase(repo);
    return { useCase, repo };
  };

  it('returns ok(product) for valid id + input', async () => {
    const { useCase, repo } = makeUseCase();
    repo.update.mockResolvedValueOnce(ok(MOCK_PRODUCT));

    const result = await useCase.execute('prod-1', {
      name: 'Nuevo Nombre',
      price: 120,
    });

    expect(isOk(result)).toBe(true);
    expect(repo.update).toHaveBeenCalledWith(
      'prod-1',
      expect.objectContaining({ name: 'Nuevo Nombre' })
    );
  });

  it('returns err(ValidationError) when id is empty string', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('', { name: 'x' });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);
      expect((result.error as ValidationError).fields?.['id']).toBeDefined();
    }
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) when id is whitespace', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('   ', { name: 'x' });

    expect(isErr(result)).toBe(true);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) when price is negative', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('prod-1', { price: -5 });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect((result.error as ValidationError).fields?.['price']).toBeDefined();
    }
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('allows partial update (only isActive)', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('prod-1', { isActive: false });

    expect(isOk(result)).toBe(true);
    expect(repo.update).toHaveBeenCalledWith(
      'prod-1',
      expect.objectContaining({ isActive: false })
    );
  });

  it('allows partial update (only stockQuantity)', async () => {
    const { useCase } = makeUseCase();

    const result = await useCase.execute('prod-1', { stockQuantity: 25 });

    expect(isOk(result)).toBe(true);
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    repo.update.mockResolvedValueOnce({
      ok: false,
      error: new Error('Not found'),
    });

    const result = await useCase.execute('prod-1', { name: 'x' });

    expect(isErr(result)).toBe(true);
  });
});
