import type { UserRepository } from '@happy-baby/domain-user';
import type { Result } from '@happy-baby/domain-shared';

export class DeleteUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string): Promise<Result<boolean>> {
    return this.repository.delete(id);
  }
}
