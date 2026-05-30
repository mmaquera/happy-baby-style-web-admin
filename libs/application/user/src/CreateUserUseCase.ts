import type { ZodIssue } from 'zod';
import type { UserRepository } from '@happy-baby/domain-user';
import type { User, CreateUserInput } from '@happy-baby/domain-user';
import type { Result } from '@happy-baby/domain-shared';
import { err, ValidationError } from '@happy-baby/domain-shared';
import { createUserSchema } from '@happy-baby/domain-shared';

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
