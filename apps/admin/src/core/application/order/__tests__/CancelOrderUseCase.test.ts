import { CancelOrderUseCase } from '@happy-baby/application-order';
import { isOk, isErr, ValidationError } from '@happy-baby/domain-shared';
import { createMockRepository, MOCK_ORDER } from './fixtures';

describe('CancelOrderUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    return { useCase: new CancelOrderUseCase(repo), repo };
  };

  it('returns ok(cancelled order) for valid id', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('order-1');

    expect(isOk(result)).toBe(true);
    expect(repo.cancel).toHaveBeenCalledWith('order-1');
    if (isOk(result)) {
      expect(result.value.status).toBe('cancelled');
    }
  });

  it('returns err(ValidationError) for empty id', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('');

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);
      expect((result.error as ValidationError).fields?.['id']).toBeDefined();
    }
    expect(repo.cancel).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) for whitespace-only id', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('   ');

    expect(isErr(result)).toBe(true);
    expect(repo.cancel).not.toHaveBeenCalled();
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    repo.cancel.mockResolvedValueOnce({
      ok: false,
      error: new Error('Order already cancelled'),
    });

    const result = await useCase.execute(MOCK_ORDER.id);

    expect(isErr(result)).toBe(true);
  });
});
