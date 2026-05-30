import { DeleteUserUseCase } from '@happy-baby/application-user';
import { isOk, isErr } from '@happy-baby/domain-shared';
import { createMockRepository, MOCK_USER } from './fixtures';

describe('DeleteUserUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    return { useCase: new DeleteUserUseCase(repo), repo };
  };

  it('returns ok(true) for valid id', async () => {
    const { useCase, repo } = makeUseCase();
    const result = await useCase.execute(MOCK_USER.id);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value).toBe(true);
    }
    expect(repo.delete).toHaveBeenCalledWith(MOCK_USER.id);
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    repo.delete.mockResolvedValueOnce({
      ok: false,
      error: new Error('User not found'),
    });
    const result = await useCase.execute(MOCK_USER.id);
    expect(isErr(result)).toBe(true);
  });
});
