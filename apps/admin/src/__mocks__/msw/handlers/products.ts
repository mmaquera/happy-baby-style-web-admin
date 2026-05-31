import { graphql, HttpResponse } from 'msw';
import {
  mockProductListResponse,
  mockCreateProductResponse,
  mockUpdateProductResponse,
  mockDeleteProductResponse,
} from '../fixtures';

export const productHandlers = [
  graphql.query('GetProducts', () =>
    HttpResponse.json({ data: mockProductListResponse })
  ),

  graphql.mutation('CreateProduct', ({ variables }) => {
    const input = (variables as { input: { name?: string } }).input ?? {};
    return HttpResponse.json({
      data: mockCreateProductResponse({ name: input.name ?? 'Nuevo producto' }),
    });
  }),

  graphql.mutation('UpdateProduct', ({ variables }) => {
    const { id, input } = variables as {
      id: string;
      input: { name?: string };
    };
    const overrides: Record<string, string> = { id };
    if (input.name !== undefined) overrides['name'] = input.name;
    return HttpResponse.json({
      data: mockUpdateProductResponse(overrides),
    });
  }),

  graphql.mutation('DeleteProduct', () =>
    HttpResponse.json({ data: mockDeleteProductResponse })
  ),
];
