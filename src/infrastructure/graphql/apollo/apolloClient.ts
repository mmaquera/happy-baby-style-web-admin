import { createApolloClientWithUnifiedMiddleware } from '@/services/graphql/UnifiedGraphQLMiddleware';
import { defaultGraphQLConfig } from '@/config/auth';
import { typePolicies } from './typePolicies';

export const client = createApolloClientWithUnifiedMiddleware(
  defaultGraphQLConfig,
  typePolicies
);

export default client;
