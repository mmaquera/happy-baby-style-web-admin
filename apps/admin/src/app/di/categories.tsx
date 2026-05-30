import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useApolloClient } from '@apollo/client';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ApolloCategoryRepository } from '@/infrastructure/graphql/repositories/ApolloCategoryRepository';
import { ListCategoriesUseCase } from '@/core/application/category/ListCategoriesUseCase';
import { CreateCategoryUseCase } from '@/core/application/category/CreateCategoryUseCase';
import { UpdateCategoryUseCase } from '@/core/application/category/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '@/core/application/category/DeleteCategoryUseCase';

export interface CategoryUseCases {
  list: ListCategoriesUseCase;
  create: CreateCategoryUseCase;
  update: UpdateCategoryUseCase;
  delete: DeleteCategoryUseCase;
}

const CategoryContext = createContext<CategoryUseCases | null>(null);

function buildCategoryUseCases(
  client: ApolloClient<NormalizedCacheObject>
): CategoryUseCases {
  const repository = new ApolloCategoryRepository(client);
  return {
    list: new ListCategoriesUseCase(repository),
    create: new CreateCategoryUseCase(repository),
    update: new UpdateCategoryUseCase(repository),
    delete: new DeleteCategoryUseCase(repository),
  };
}

export function CategoryProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const useCases = useMemo(() => buildCategoryUseCases(client), [client]);
  return (
    <CategoryContext.Provider value={useCases}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryUseCases(): CategoryUseCases {
  const ctx = useContext(CategoryContext);
  if (!ctx) {
    throw new Error(
      'useCategoryUseCases must be used within <CategoryProvider>'
    );
  }
  return ctx;
}
