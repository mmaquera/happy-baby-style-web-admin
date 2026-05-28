import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useApolloClient } from '@apollo/client';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ApolloProductRepository } from '@/infrastructure/graphql/repositories/ApolloProductRepository';
import { ListProductsUseCase } from '@/core/application/product/ListProductsUseCase';
import { CreateProductUseCase } from '@/core/application/product/CreateProductUseCase';
import { UpdateProductUseCase } from '@/core/application/product/UpdateProductUseCase';
import { DeleteProductUseCase } from '@/core/application/product/DeleteProductUseCase';

export interface ProductUseCases {
  list: ListProductsUseCase;
  create: CreateProductUseCase;
  update: UpdateProductUseCase;
  delete: DeleteProductUseCase;
}

const ProductContext = createContext<ProductUseCases | null>(null);

function buildProductUseCases(
  client: ApolloClient<NormalizedCacheObject>
): ProductUseCases {
  const repository = new ApolloProductRepository(client);
  return {
    list: new ListProductsUseCase(repository),
    create: new CreateProductUseCase(repository),
    update: new UpdateProductUseCase(repository),
    delete: new DeleteProductUseCase(repository),
  };
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const useCases = useMemo(() => buildProductUseCases(client), [client]);
  return (
    <ProductContext.Provider value={useCases}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductUseCases(): ProductUseCases {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProductUseCases must be used within <ProductProvider>');
  }
  return ctx;
}
