import type { UserRepository } from '@/core/domain/user/UserRepository';
import type { Result } from '@/core/shared/Result';

export class DeleteUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string): Promise<Result<boolean>> {
    return this.repository.delete(id);
  }
}
