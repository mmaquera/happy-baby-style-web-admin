// GraphQL Service Configuration - Following Clean Architecture
// Uses the new UnifiedGraphQLMiddleware for authentication

import { createApolloClientWithUnifiedMiddleware } from './graphql/UnifiedGraphQLMiddleware';
import { defaultGraphQLConfig } from '../config/auth';

// Create Apollo Client with unified middleware
export const client = createApolloClientWithUnifiedMiddleware(defaultGraphQLConfig);

// Export the main client (preferred)
export default client;