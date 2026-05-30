import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useApolloClient } from '@apollo/client';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ApolloUserRepository } from '@/infrastructure/graphql/repositories/ApolloUserRepository';
import { ListUsersUseCase } from '@happy-baby/application-user';
import { GetUserUseCase } from '@happy-baby/application-user';
import { CreateUserUseCase } from '@happy-baby/application-user';
import { UpdateUserUseCase } from '@happy-baby/application-user';
import { DeleteUserUseCase } from '@happy-baby/application-user';
import { ActivateUserUseCase } from '@happy-baby/application-user';
import { DeactivateUserUseCase } from '@happy-baby/application-user';

export interface UserUseCases {
  list: ListUsersUseCase;
  get: GetUserUseCase;
  create: CreateUserUseCase;
  update: UpdateUserUseCase;
  delete: DeleteUserUseCase;
  activate: ActivateUserUseCase;
  deactivate: DeactivateUserUseCase;
}

const UserContext = createContext<UserUseCases | null>(null);

function buildUserUseCases(
  client: ApolloClient<NormalizedCacheObject>
): UserUseCases {
  const repository = new ApolloUserRepository(client);
  return {
    list: new ListUsersUseCase(repository),
    get: new GetUserUseCase(repository),
    create: new CreateUserUseCase(repository),
    update: new UpdateUserUseCase(repository),
    delete: new DeleteUserUseCase(repository),
    activate: new ActivateUserUseCase(repository),
    deactivate: new DeactivateUserUseCase(repository),
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const useCases = useMemo(() => buildUserUseCases(client), [client]);
  return (
    <UserContext.Provider value={useCases}>{children}</UserContext.Provider>
  );
}

export function useUserUseCases(): UserUseCases {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUserUseCases must be used within <UserProvider>');
  }
  return ctx;
}
