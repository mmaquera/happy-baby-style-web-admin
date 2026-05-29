import { UpdateOrderStatusUseCase } from '../UpdateOrderStatusUseCase';
import { isOk, isErr, ValidationError } from '@/core/shared/Result';
import { createMockRepository, MOCK_ORDER } from './fixtures';

describe('UpdateOrderStatusUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    return { useCase: new UpdateOrderStatusUseCase(repo), repo };
  };

  it('returns ok(order) for valid id and status', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('order-1', 'confirmed');

    expect(isOk(result)).toBe(true);
    expect(repo.updateStatus).toHaveBeenCalledWith('order-1', 'confirmed');
    if (isOk(result)) {
      expect(result.value.status).toBe('confirmed');
    }
  });

  it('returns err(ValidationError) for empty id', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute('', 'confirmed');

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.fields?.['id']).toBeDefined();
    }
    expect(repo.updateStatus).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) for missing status', async () => {
    const { useCase, repo } = makeUseCase();

    // @ts-expect-error — testing runtime guard with falsy value
    const result = await useCase.execute('order-1', '');

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.fields?.['status']).toBeDefined();
    }
    expect(repo.updateStatus).not.toHaveBeenCalled();
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    repo.updateStatus.mockResolvedValueOnce({
      ok: false,
      error: new Error('DB error'),
    });

    const result = await useCase.execute(MOCK_ORDER.id, 'processing');

    expect(isErr(result)).toBe(true);
  });

  it('allows all valid status transitions', async () => {
    const statuses = [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ] as const;
    for (const status of statuses) {
      const { useCase } = makeUseCase();
      const result = await useCase.execute('order-1', status);
      expect(isOk(result)).toBe(true);
    }
  });
});
