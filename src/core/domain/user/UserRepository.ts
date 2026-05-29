import type { Result } from '@/core/shared/Result';
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserFilter,
  UserPage,
} from './User';

export interface UserRepository {
  findAll(filter?: UserFilter, limit?: number, offset?: number): Promise<Result<UserPage>>;
  findById(id: string): Promise<Result<User>>;
  create(input: CreateUserInput): Promise<Result<User>>;
  update(id: string, input: UpdateUserInput): Promise<Result<User>>;
  delete(id: string): Promise<Result<boolean>>;
  activate(id: string): Promise<Result<User>>;
  deactivate(id: string): Promise<Result<User>>;
}
