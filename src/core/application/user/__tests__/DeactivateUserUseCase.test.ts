import { DeactivateUserUseCase } from '../DeactivateUserUseCase';
import { isOk, isErr } from '@/core/shared/Result';
import { createMockRepository, MOCK_USER } from './fixtures';

describe('DeactivateUserUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    return { useCase: new DeactivateUserUseCase(repo), repo };
  };

  it('returns ok(user) with isActive false', async () => {
    const { useCase, repo } = makeUseCase();
    const result = await useCase.execute(MOCK_USER.id);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.isActive).toBe(false);
    }
    expect(repo.deactivate).toHaveBeenCalledWith(MOCK_USER.id);
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    repo.deactivate.mockResolvedValueOnce({ ok: false, error: new Error('User not found') });
    const result = await useCase.execute(MOCK_USER.id);
    expect(isErr(result)).toBe(true);
  });
});
