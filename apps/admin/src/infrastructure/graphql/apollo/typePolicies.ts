import type { TypePolicies } from '@apollo/client';

export const typePolicies: TypePolicies = {
  // Entity normalization — all main entities use 'id' as cache key
  // Apollo default is already id + __typename, but being explicit avoids
  // surprises when entities are renamed or have non-standard keys
  Product: { keyFields: ['id'] },
  Category: { keyFields: ['id'] },
  User: { keyFields: ['id'] },
  UserProfile: { keyFields: ['id'] },
  Order: { keyFields: ['id'] },
  OrderItem: { keyFields: ['id'] },
  ProductVariant: { keyFields: ['id'] },
  UserAddress: { keyFields: ['id'] },

  Query: {
    fields: {
      // Offset-based paginated lists:
      //   keyArgs → cache key includes only filter args, NOT limit/offset
      //   This means all pages for the same filter share one cache slot.
      //   merge: false → incoming data replaces (doesn't accumulate), which
      //   is correct for offset pagination (show current page, not all pages).
      //
      // Recommended fetchPolicy per consumer:
      //   - list hooks  → 'cache-and-network' (shows stale while fetching)
      //   - detail hooks → 'cache-first' (reuse cache until refetch is explicit)

      // Products (variables: filters, limit, offset)
      products: {
        keyArgs: ['filters'],
        merge: false,
      },

      // Categories (variables: filters, limit, offset)
      categories: {
        keyArgs: ['filters'],
        merge: false,
      },

      // Users (variables: filter, pagination)
      users: {
        keyArgs: ['filter'],
        merge: false,
      },

      // Orders (variables: filter, pagination)
      orders: {
        keyArgs: ['filter'],
        merge: false,
      },
    },
  },
};
