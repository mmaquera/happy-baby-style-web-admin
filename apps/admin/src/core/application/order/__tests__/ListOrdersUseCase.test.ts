import { ListOrdersUseCase } from '@happy-baby/application-order';
import { isOk, isErr } from '@happy-baby/domain-shared';
import { createMockRepository, MOCK_ORDER } from './fixtures';

describe('ListOrdersUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    return { useCase: new ListOrdersUseCase(repo), repo };
  };

  it('returns ok(page) with default params', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute();

    expect(isOk(result)).toBe(true);
    expect(repo.findAll).toHaveBeenCalledWith(undefined, 20, 0);
  });

  it('passes filter and pagination to repository', async () => {
    const { useCase, repo } = makeUseCase();

    await useCase.execute({
      filter: { status: 'pending' },
      limit: 10,
      offset: 20,
    });

    expect(repo.findAll).toHaveBeenCalledWith({ status: 'pending' }, 10, 20);
  });

  it('returns orders from repository', async () => {
    const { useCase } = makeUseCase();

    const result = await useCase.execute();

    if (isOk(result)) {
      expect(result.value.items).toHaveLength(1);
      expect(result.value.items[0].id).toBe(MOCK_ORDER.id);
      expect(result.value.total).toBe(1);
      expect(result.value.hasMore).toBe(false);
    }
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    repo.findAll.mockResolvedValueOnce({
      ok: false,
      error: new Error('DB error'),
    });

    const result = await useCase.execute();

    expect(isErr(result)).toBe(true);
  });
});
