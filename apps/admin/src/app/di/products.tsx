import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useApolloClient } from '@apollo/client';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ApolloProductRepository } from '@/infrastructure/graphql/repositories/ApolloProductRepository';
import { ListProductsUseCase } from '@happy-baby/application-product';
import { CreateProductUseCase } from '@happy-baby/application-product';
import { UpdateProductUseCase } from '@happy-baby/application-product';
import { DeleteProductUseCase } from '@happy-baby/application-product';
import { UploadProductImageUseCase } from '@happy-baby/application-product';

export interface ProductUseCases {
  list: ListProductsUseCase;
  create: CreateProductUseCase;
  update: UpdateProductUseCase;
  delete: DeleteProductUseCase;
  uploadImage: UploadProductImageUseCase;
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
    uploadImage: new UploadProductImageUseCase(repository),
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
