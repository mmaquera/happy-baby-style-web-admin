import { ListUsersUseCase } from '../ListUsersUseCase';
import { isOk, isErr } from '@/core/shared/Result';
import { createMockRepository, MOCK_USER_PAGE } from './fixtures';

describe('ListUsersUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    return { useCase: new ListUsersUseCase(repo), repo };
  };

  it('returns ok(page) with default params', async () => {
    const { useCase } = makeUseCase();
    const result = await useCase.execute();
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.items).toHaveLength(1);
      expect(result.value.total).toBe(1);
      expect(result.value.hasMore).toBe(false);
    }
  });

  it('forwards filter to repository', async () => {
    const { useCase, repo } = makeUseCase();
    const filter = { role: 'admin' as const, isActive: true };
    await useCase.execute(filter);
    expect(repo.findAll).toHaveBeenCalledWith(filter, 20, 0);
  });

  it('forwards limit and offset to repository', async () => {
    const { useCase, repo } = makeUseCase();
    await useCase.execute(undefined, 10, 30);
    expect(repo.findAll).toHaveBeenCalledWith(undefined, 10, 30);
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

  it('returns empty page when repository returns empty items', async () => {
    const { useCase, repo } = makeUseCase();
    repo.findAll.mockResolvedValueOnce({
      ok: true,
      value: { items: [], total: 0, hasMore: false },
    });
    const result = await useCase.execute();
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.items).toHaveLength(0);
    }
  });
});
