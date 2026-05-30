import type { UserRepository } from '@/core/domain/user/UserRepository';
import type { User, UpdateUserInput } from '@/core/domain/user/User';
import type { Result } from '@/core/shared/Result';

export class UpdateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string, input: UpdateUserInput): Promise<Result<User>> {
    return this.repository.update(id, input);
  }
}
