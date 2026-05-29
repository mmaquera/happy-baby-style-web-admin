import { CreateUserUseCase } from '../CreateUserUseCase';
import { isOk, isErr, ValidationError } from '@/core/shared/Result';
import { createMockRepository } from './fixtures';

describe('CreateUserUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    return { useCase: new CreateUserUseCase(repo), repo };
  };

  const VALID_INPUT = {
    email: 'nuevo@example.com',
    firstName: 'Carlos',
    lastName: 'López',
  };

  it('returns ok(user) for valid input', async () => {
    const { useCase, repo } = makeUseCase();
    const result = await useCase.execute(VALID_INPUT);
    expect(isOk(result)).toBe(true);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'nuevo@example.com' })
    );
  });

  it('returns err(ValidationError) for missing email', async () => {
    const { useCase, repo } = makeUseCase();
    // @ts-expect-error — testing runtime guard
    const result = await useCase.execute({ firstName: 'X', lastName: 'Y' });
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);
    }
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) for invalid email format', async () => {
    const { useCase, repo } = makeUseCase();
    const result = await useCase.execute({
      ...VALID_INPUT,
      email: 'not-an-email',
    });
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);
    }
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) for missing firstName', async () => {
    const { useCase, repo } = makeUseCase();
    // @ts-expect-error — testing runtime guard
    const result = await useCase.execute({ email: 'x@x.com', lastName: 'Y' });
    expect(isErr(result)).toBe(true);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    repo.create.mockResolvedValueOnce({ ok: false, error: new Error('Email already exists') });
    const result = await useCase.execute(VALID_INPUT);
    expect(isErr(result)).toBe(true);
  });

  it('accepts optional role and phone', async () => {
    const { useCase } = makeUseCase();
    const result = await useCase.execute({
      ...VALID_INPUT,
      role: 'admin',
      phone: '+573001234567',
    });
    expect(isOk(result)).toBe(true);
  });
});
