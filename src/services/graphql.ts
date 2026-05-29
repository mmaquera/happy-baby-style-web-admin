// Re-export Apollo client from infrastructure layer.
// All consumers (App.tsx, etc.) continue importing from this path unchanged.
export { client, default } from '@/infrastructure/graphql/apollo/apolloClient';
