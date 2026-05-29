import type { UserRepository } from '@/core/domain/user/UserRepository';
import type { UserFilter, UserPage } from '@/core/domain/user/User';
import type { Result } from '@/core/shared/Result';

export class ListUsersUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(filter?: UserFilter, limit = 20, offset = 0): Promise<Result<UserPage>> {
    return this.repository.findAll(filter, limit, offset);
  }
}
