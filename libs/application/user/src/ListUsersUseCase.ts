import type { UserRepository } from '@happy-baby/domain-user';
import type { UserFilter, UserPage } from '@happy-baby/domain-user';
import type { Result } from '@happy-baby/domain-shared';

export class ListUsersUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(
    filter?: UserFilter,
    limit = 20,
    offset = 0
  ): Promise<Result<UserPage>> {
    return this.repository.findAll(filter, limit, offset);
  }
}
