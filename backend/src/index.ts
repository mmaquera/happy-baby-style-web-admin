import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { createApolloServer } from '@graphql/server';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de seguridad y utilidades
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS configurado para desarrollo
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Parseo de JSON (necesario para GraphQL)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta de salud (solo información GraphQL)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Happy Baby Style - GraphQL API',
    api: 'GraphQL Only',
    endpoint: '/graphql',
    playground: process.env.NODE_ENV !== 'production' ? 'Available at /graphql' : 'Disabled in production',
    message: 'GraphQL API is the primary endpoint.'
  });
});

// Inicializar servidor
async function startServer() {
  try {
    // Configurar Apollo GraphQL Server
    const apolloServer = await createApolloServer(app);
    
    // Middleware de manejo de errores
    app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    });

    // Middleware para rutas no encontradas
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Endpoint not found. This API only supports GraphQL.',
        availableEndpoints: {
          graphql: '/graphql',
          health: '/health',
          playground: process.env.NODE_ENV !== 'production' ? '/graphql' : null
        },
        notice: 'Please use GraphQL endpoint at /graphql'
      });
    });
    
    // Iniciar servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Happy Baby Style GraphQL Server running on port ${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
      console.log(`🎮 GraphQL Endpoint: http://localhost:${PORT}/graphql`);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔍 GraphQL Playground: http://localhost:${PORT}/graphql`);
        console.log(`📊 Schema Explorer available in Playground`);
      }
      
      console.log(`✨ GraphQL API Ready`);
    });

    console.log('✅ Apollo GraphQL Server initialized successfully');
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;