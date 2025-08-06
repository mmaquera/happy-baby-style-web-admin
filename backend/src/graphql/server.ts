import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { GraphQLError } from 'graphql';
import { DataLoaders } from '@infrastructure/loaders/DataLoaders';
import { AuthMiddleware } from '@presentation/middleware/AuthMiddleware';
import { AuthUser } from '@application/auth/AuthService';
import { DomainError } from '@domain/errors/DomainError';

export interface Context {
  user?: AuthUser | null;
  isAuthenticated: boolean;
  dataloaders: DataLoaders;
  req?: any;
}

export async function createApolloServer(app: Express): Promise<ApolloServer> {
  const authMiddleware = new AuthMiddleware();
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }): Promise<Context> => {
      // Enhanced authentication setup
      const authContext = await authMiddleware.createAuthContext(req);

      return {
        user: authContext.user,
        isAuthenticated: authContext.isAuthenticated,
        dataloaders: new DataLoaders(), // Fresh instance per request
        req, // Include request for additional context
      };
    },
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      
      // Handle domain errors
      if (error.originalError instanceof DomainError) {
        const domainError = error.originalError;
        return new GraphQLError(domainError.message, {
          extensions: {
            code: domainError.code,
            statusCode: domainError.statusCode,
            details: domainError.details
          }
        });
      }
      
      // Don't expose internal errors to clients
      if (error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
        return new GraphQLError('Internal server error');
      }
      
      return error;
    },
    introspection: process.env.NODE_ENV !== 'production',
    debug: process.env.NODE_ENV !== 'production',
    csrfPrevention: false, // Permite requests desde el navegador
    plugins: [
      // Plugin para Apollo Studio Sandbox
      process.env.NODE_ENV !== 'production' && {
        requestDidStart() {
          return {
            didResolveOperation() {
              return;
            },
          };
        },
      },
      {
        requestDidStart: async () => ({
          willSendResponse: async ({ response }) => {
            // Add custom headers or modify response
            if (response.http) {
              response.http.headers.set('X-GraphQL-Server', 'Happy Baby Style Admin');
            }
          },
        }),
      },
    ].filter(Boolean),
  });

  await server.start();
  
  // Apply middleware to Express app
  server.applyMiddleware({
    app: app as any,
    path: '/graphql',
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  return server;
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down GraphQL server...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down GraphQL server...');
  process.exit(0);
}); 