import type { ZodIssue } from 'zod';
import type { UserRepository } from '@/core/domain/user/UserRepository';
import type { User, CreateUserInput } from '@/core/domain/user/User';
import type { Result } from '@/core/shared/Result';
import { err, ValidationError } from '@/core/shared/Result';
import { createUserSchema } from '@/core/shared/validation/userSchema';

export class CreateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<Result<User>> {
    const parsed = createUserSchema.safeParse(input);
    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      parsed.error.issues.forEach((e: ZodIssue) => {
        const key = e.path.join('.');
        if (!fields[key]) fields[key] = [];
        fields[key].push(e.message);
      });
      return err(new ValidationError('Datos del usuario inválidos', fields));
    }
    return this.repository.create(parsed.data as CreateUserInput);
  }
}
