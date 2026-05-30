import { UpdateUserUseCase } from '../UpdateUserUseCase';
import { isOk, isErr } from '@/core/shared/Result';
import { createMockRepository, MOCK_USER } from './fixtures';

describe('UpdateUserUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    return { useCase: new UpdateUserUseCase(repo), repo };
  };

  it('returns ok(user) for valid id and input', async () => {
    const { useCase, repo } = makeUseCase();
    const result = await useCase.execute(MOCK_USER.id, {
      email: 'nuevo@example.com',
    });
    expect(isOk(result)).toBe(true);
    expect(repo.update).toHaveBeenCalledWith(MOCK_USER.id, {
      email: 'nuevo@example.com',
    });
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    repo.update.mockResolvedValueOnce({
      ok: false,
      error: new Error('User not found'),
    });
    const result = await useCase.execute(MOCK_USER.id, { isActive: false });
    expect(isErr(result)).toBe(true);
  });

  it('accepts role update', async () => {
    const { useCase, repo } = makeUseCase();
    repo.update.mockResolvedValueOnce({
      ok: true,
      value: { ...MOCK_USER, role: 'admin' as const },
    });
    const result = await useCase.execute(MOCK_USER.id, { role: 'admin' });
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.role).toBe('admin');
    }
  });

  it('accepts isActive update', async () => {
    const { useCase, repo } = makeUseCase();
    repo.update.mockResolvedValueOnce({
      ok: true,
      value: { ...MOCK_USER, isActive: false },
    });
    const result = await useCase.execute(MOCK_USER.id, { isActive: false });
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.isActive).toBe(false);
    }
  });
});
