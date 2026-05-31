import { GetOrderUseCase } from '@happy-baby/application-order';
import { isOk, isErr, ValidationError } from '@happy-baby/domain-shared';
import { createMockRepository, MOCK_ORDER } from './fixtures';

describe('GetOrderUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    return { useCase: new GetOrderUseCase(repo), repo };
  };

  it('returns ok(order) for a valid id', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('order-1');

    expect(isOk(result)).toBe(true);
    expect(repo.findById).toHaveBeenCalledWith('order-1');
    if (isOk(result)) {
      expect(result.value.id).toBe(MOCK_ORDER.id);
    }
  });

  it('returns err(ValidationError) for empty id', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('');

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);
    }
    expect(repo.findById).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) for whitespace-only id', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('   ');

    expect(isErr(result)).toBe(true);
    expect(repo.findById).not.toHaveBeenCalled();
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    repo.findById.mockResolvedValueOnce({
      ok: false,
      error: new Error('Not found'),
    });

    const result = await useCase.execute('order-1');

    expect(isErr(result)).toBe(true);
  });
});
