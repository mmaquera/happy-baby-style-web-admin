import { ListProductsUseCase } from '../ListProductsUseCase';
import { isOk } from '@/core/shared/Result';
import { createMockRepository } from './fixtures';

describe('ListProductsUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    const useCase = new ListProductsUseCase(repo);
    return { useCase, repo };
  };

  it('calls repository.findAll with default params when none provided', async () => {
    const { useCase, repo } = makeUseCase();

    await useCase.execute();

    expect(repo.findAll).toHaveBeenCalledWith(undefined, 20, 0);
  });

  it('passes filter, limit and offset to repository', async () => {
    const { useCase, repo } = makeUseCase();
    const filter = { isActive: true };

    await useCase.execute({ filter, limit: 10, offset: 5 });

    expect(repo.findAll).toHaveBeenCalledWith(filter, 10, 5);
  });

  it('returns result from repository', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute();

    expect(isOk(result)).toBe(true);
  });

  it('uses default limit of 20 when not provided', async () => {
    const { useCase, repo } = makeUseCase();

    await useCase.execute({ filter: { isActive: true } });

    expect(repo.findAll).toHaveBeenCalledWith({ isActive: true }, 20, 0);
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    const repoError = new Error('DB error');
    repo.findAll.mockResolvedValueOnce({ ok: false, error: repoError });

    const result = await useCase.execute();

    expect(result).toEqual({ ok: false, error: repoError });
  });
});
