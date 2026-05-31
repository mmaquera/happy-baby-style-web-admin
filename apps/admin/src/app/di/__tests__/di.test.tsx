import { renderHook } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import type { ReactNode } from 'react';

import { ProductProvider, useProductUseCases } from '@/app/di/products';
import { OrderProvider, useOrderUseCases } from '@/app/di/orders';
import { UserProvider, useUserUseCases } from '@/app/di/users';
import { CategoryProvider, useCategoryUseCases } from '@/app/di/categories';

import { ListProductsUseCase } from '@happy-baby/application-product';
import { CreateProductUseCase } from '@happy-baby/application-product';
import { UpdateProductUseCase } from '@happy-baby/application-product';
import { DeleteProductUseCase } from '@happy-baby/application-product';
import { UploadProductImageUseCase } from '@happy-baby/application-product';

import { ListOrdersUseCase } from '@happy-baby/application-order';
import { GetOrderUseCase } from '@happy-baby/application-order';
import { UpdateOrderStatusUseCase } from '@happy-baby/application-order';
import { CancelOrderUseCase } from '@happy-baby/application-order';

import { ListUsersUseCase } from '@happy-baby/application-user';
import { GetUserUseCase } from '@happy-baby/application-user';
import { CreateUserUseCase } from '@happy-baby/application-user';
import { UpdateUserUseCase } from '@happy-baby/application-user';
import { DeleteUserUseCase } from '@happy-baby/application-user';
import { ActivateUserUseCase } from '@happy-baby/application-user';
import { DeactivateUserUseCase } from '@happy-baby/application-user';

import { ListCategoriesUseCase } from '@happy-baby/application-category';
import { CreateCategoryUseCase } from '@happy-baby/application-category';
import { UpdateCategoryUseCase } from '@happy-baby/application-category';
import { DeleteCategoryUseCase } from '@happy-baby/application-category';

function makeWrapper(
  Provider: ({ children }: { children: ReactNode }) => JSX.Element
) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider>{children}</Provider>
      </MockedProvider>
    );
  };
}

describe('ProductProvider / useProductUseCases', () => {
  it('provides all product use case instances', () => {
    const { result } = renderHook(() => useProductUseCases(), {
      wrapper: makeWrapper(ProductProvider),
    });
    expect(result.current.list).toBeInstanceOf(ListProductsUseCase);
    expect(result.current.create).toBeInstanceOf(CreateProductUseCase);
    expect(result.current.update).toBeInstanceOf(UpdateProductUseCase);
    expect(result.current.delete).toBeInstanceOf(DeleteProductUseCase);
    expect(result.current.uploadImage).toBeInstanceOf(
      UploadProductImageUseCase
    );
  });

  it('throws when used outside ProductProvider', () => {
    expect(() => renderHook(() => useProductUseCases())).toThrow(
      'useProductUseCases must be used within <ProductProvider>'
    );
  });

  it('memoizes use cases across re-renders', () => {
    const { result, rerender } = renderHook(() => useProductUseCases(), {
      wrapper: makeWrapper(ProductProvider),
    });
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});

describe('OrderProvider / useOrderUseCases', () => {
  it('provides all order use case instances', () => {
    const { result } = renderHook(() => useOrderUseCases(), {
      wrapper: makeWrapper(OrderProvider),
    });
    expect(result.current.list).toBeInstanceOf(ListOrdersUseCase);
    expect(result.current.get).toBeInstanceOf(GetOrderUseCase);
    expect(result.current.updateStatus).toBeInstanceOf(
      UpdateOrderStatusUseCase
    );
    expect(result.current.cancel).toBeInstanceOf(CancelOrderUseCase);
  });

  it('throws when used outside OrderProvider', () => {
    expect(() => renderHook(() => useOrderUseCases())).toThrow(
      'useOrderUseCases must be used within <OrderProvider>'
    );
  });
});

describe('UserProvider / useUserUseCases', () => {
  it('provides all user use case instances', () => {
    const { result } = renderHook(() => useUserUseCases(), {
      wrapper: makeWrapper(UserProvider),
    });
    expect(result.current.list).toBeInstanceOf(ListUsersUseCase);
    expect(result.current.get).toBeInstanceOf(GetUserUseCase);
    expect(result.current.create).toBeInstanceOf(CreateUserUseCase);
    expect(result.current.update).toBeInstanceOf(UpdateUserUseCase);
    expect(result.current.delete).toBeInstanceOf(DeleteUserUseCase);
    expect(result.current.activate).toBeInstanceOf(ActivateUserUseCase);
    expect(result.current.deactivate).toBeInstanceOf(DeactivateUserUseCase);
  });

  it('throws when used outside UserProvider', () => {
    expect(() => renderHook(() => useUserUseCases())).toThrow(
      'useUserUseCases must be used within <UserProvider>'
    );
  });
});

describe('CategoryProvider / useCategoryUseCases', () => {
  it('provides all category use case instances', () => {
    const { result } = renderHook(() => useCategoryUseCases(), {
      wrapper: makeWrapper(CategoryProvider),
    });
    expect(result.current.list).toBeInstanceOf(ListCategoriesUseCase);
    expect(result.current.create).toBeInstanceOf(CreateCategoryUseCase);
    expect(result.current.update).toBeInstanceOf(UpdateCategoryUseCase);
    expect(result.current.delete).toBeInstanceOf(DeleteCategoryUseCase);
  });

  it('throws when used outside CategoryProvider', () => {
    expect(() => renderHook(() => useCategoryUseCases())).toThrow(
      'useCategoryUseCases must be used within <CategoryProvider>'
    );
  });
});
