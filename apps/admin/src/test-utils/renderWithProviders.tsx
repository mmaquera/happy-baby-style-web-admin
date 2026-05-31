import type React from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Fixed URL — MSW intercepts all requests to this endpoint in tests.
const GRAPHQL_URL = 'http://localhost:3001/graphql';

export const createTestApolloClient = () =>
  new ApolloClient({
    link: new HttpLink({ uri: GRAPHQL_URL }),
    // addTypename: false so mock responses without __typename are not stripped.
    cache: new InMemoryCache({ addTypename: false }),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'no-cache' },
      query: { fetchPolicy: 'no-cache' },
      mutate: { fetchPolicy: 'no-cache' },
    },
  });

interface RenderWithProvidersOptions extends RenderOptions {
  routerProps?: MemoryRouterProps;
  apolloClient?: ApolloClient<unknown>;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    routerProps,
    apolloClient,
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) => {
  const client = apolloClient ?? createTestApolloClient();

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ApolloProvider client={client}>
      <MemoryRouter {...routerProps}>
        {children}
        <Toaster />
      </MemoryRouter>
    </ApolloProvider>
  );

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }), client };
};
