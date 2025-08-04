import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { Container } from '@shared/container';
import { createProductRoutes } from '@presentation/routes/productRoutes';
import { createImageRoutes } from '@presentation/routes/imageRoutes';
import { createOrderRoutes } from '@presentation/routes/orderRoutes';
import { ProductController } from '@presentation/controllers/ProductController';
import { ImageController } from '@presentation/controllers/ImageController';
import { OrderController } from '@presentation/controllers/OrderController';

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

// Parseo de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Inicializar container de dependencias
const container = Container.getInstance();

// Obtener controladores del container
const productController = container.get<ProductController>('productController');
const imageController = container.get<ImageController>('imageController');
const orderController = container.get<OrderController>('orderController');

// Rutas API
app.use('/api/products', createProductRoutes(productController));
app.use('/api/images', createImageRoutes(imageController));
app.use('/api/orders', createOrderRoutes(orderController));

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Happy Baby Style Admin API'
  });
});

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
    message: 'Route not found'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

export default app;