import type { UserRepository } from '@happy-baby/domain-user';
import type { User, UpdateUserInput } from '@happy-baby/domain-user';
import type { Result } from '@happy-baby/domain-shared';

export class UpdateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string, input: UpdateUserInput): Promise<Result<User>> {
    return this.repository.update(id, input);
  }
}
