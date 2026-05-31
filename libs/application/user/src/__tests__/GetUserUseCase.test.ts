import { GetUserUseCase } from '@happy-baby/application-user';
import { isOk, isErr } from '@happy-baby/domain-shared';
import { createMockRepository, MOCK_USER } from './fixtures';

describe('GetUserUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    return { useCase: new GetUserUseCase(repo), repo };
  };

  it('returns ok(user) for valid id', async () => {
    const { useCase } = makeUseCase();
    const result = await useCase.execute('user-1');
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.id).toBe(MOCK_USER.id);
      expect(result.value.email).toBe(MOCK_USER.email);
    }
  });

  it('calls repository with the provided id', async () => {
    const { useCase, repo } = makeUseCase();
    await useCase.execute('user-1');
    expect(repo.findById).toHaveBeenCalledWith('user-1');
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    repo.findById.mockResolvedValueOnce({
      ok: false,
      error: new Error('Not found'),
    });
    const result = await useCase.execute('user-1');
    expect(isErr(result)).toBe(true);
  });
});
