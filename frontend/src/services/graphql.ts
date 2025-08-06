import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Create HTTP link for GraphQL queries
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

// Auth link to add JWT token to requests
const authLink = setContext((operation, { headers }) => {
  // Debug logging
  console.log('🔗 AuthLink - Operation:', operation.operationName);
  
  // Don't send token for public operations like login
  const publicOperations = ['LoginUser', 'RefreshToken', 'RegisterUser'];
  const isPublicOperation = publicOperations.includes(operation.operationName || '');
  
  console.log('🔗 AuthLink - Is public operation:', isPublicOperation);
  
  if (isPublicOperation) {
    console.log('🔗 AuthLink - Public operation, not sending token');
    return {
      headers: {
        ...headers,
        // Explicitly do not include authorization
      }
    };
  }
  
  const token = localStorage.getItem('authToken');
  console.log('🔗 AuthLink - Sending token:', !!token);
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Error link to handle GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      // Enhanced error logging with more context
      console.error(
        `GraphQL error in operation "${operation.operationName}":`,
        {
          message,
          locations: locations?.map(loc => `${loc.line}:${loc.column}`).join(', '),
          path: path?.join('.'),
          extensions,
          variables: operation.variables
        }
      );
      
      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED' || extensions?.statusCode === 401) {
        console.warn('Authentication error detected, clearing tokens...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return;
      }
      
      // Handle forbidden errors
      if (extensions?.code === 'FORBIDDEN' || extensions?.statusCode === 403) {
        console.error('Access forbidden - insufficient permissions');
        return;
      }

      // Handle internal server errors
      if (extensions?.code === 'INTERNAL_SERVER_ERROR') {
        console.error('Internal server error detected. Please check backend logs.');
        return;
      }
    });
  }

  if (networkError) {
    console.error(`Network error in operation "${operation.operationName}":`, {
      message: networkError.message,
      statusCode: 'statusCode' in networkError ? networkError.statusCode : 'unknown',
      stack: networkError.stack
    });
    
    // Handle network authentication errors
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      console.warn('Network authentication error, redirecting to login...');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return;
    }

    // Handle connection errors
    if (networkError.message.includes('Failed to fetch') || networkError.message.includes('NetworkError')) {
      console.error('Network connection error. Please check your internet connection and try again.');
      return;
    }
  }
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            // Handle pagination for products
            keyArgs: ["filter"],
            merge(existing = { products: [], total: 0, hasMore: false }, incoming) {
              return {
                ...incoming,
                products: [...(existing.products || []), ...incoming.products],
              };
            },
          },
          orders: {
            // Handle pagination for orders
            keyArgs: ["filter"],
            merge(existing = { orders: [], total: 0, hasMore: false }, incoming) {
              return {
                ...incoming,
                orders: [...(existing.orders || []), ...incoming.orders],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: process.env.NODE_ENV === 'development',
});

// Helper function to clear cache
export const clearApolloCache = () => {
  apolloClient.cache.reset();
};

// Helper function to refetch queries
export const refetchQueries = (queries: string[]) => {
  return apolloClient.refetchQueries({
    include: queries,
  });
};

export default apolloClient;