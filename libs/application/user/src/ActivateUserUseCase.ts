import type { UserRepository } from '@happy-baby/domain-user';
import type { User } from '@happy-baby/domain-user';
import type { Result } from '@happy-baby/domain-shared';

export class ActivateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string): Promise<Result<User>> {
    return this.repository.activate(id);
  }
}
