import type { UserRepository } from '@/core/domain/user/UserRepository';
import type { User } from '@/core/domain/user/User';
import type { Result } from '@/core/shared/Result';

export class ActivateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string): Promise<Result<User>> {
    return this.repository.activate(id);
  }
}
