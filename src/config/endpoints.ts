// GraphQL Endpoints Configuration - Following SOLID principles
// Single Responsibility: Manages only GraphQL endpoints
// Open/Closed: Easy to extend with new environments
// Single source of truth for all GraphQL URLs

export const GRAPHQL_ENDPOINTS = {
  development: import.meta.env.VITE_GRAPHQL_URL,
  production: import.meta.env.VITE_GRAPHQL_URL,
  staging: import.meta.env.VITE_GRAPHQL_URL,
  test: import.meta.env.VITE_GRAPHQL_URL,
} as const;

export const getCurrentGraphQLEndpoint = (): string => {
  const mode = import.meta.env.VITE_MODE || 'development';
  return GRAPHQL_ENDPOINTS[mode as keyof typeof GRAPHQL_ENDPOINTS] || GRAPHQL_ENDPOINTS.development;
};
