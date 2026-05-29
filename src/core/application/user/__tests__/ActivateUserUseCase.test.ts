import { ActivateUserUseCase } from '../ActivateUserUseCase';
import { isOk, isErr } from '@/core/shared/Result';
import { createMockRepository, MOCK_USER } from './fixtures';

describe('ActivateUserUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    return { useCase: new ActivateUserUseCase(repo), repo };
  };

  it('returns ok(user) with isActive true', async () => {
    const { useCase, repo } = makeUseCase();
    const result = await useCase.execute(MOCK_USER.id);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.isActive).toBe(true);
    }
    expect(repo.activate).toHaveBeenCalledWith(MOCK_USER.id);
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    repo.activate.mockResolvedValueOnce({
      ok: false,
      error: new Error('User not found'),
    });
    const result = await useCase.execute(MOCK_USER.id);
    expect(isErr(result)).toBe(true);
  });
});
