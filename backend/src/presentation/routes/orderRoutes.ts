import { Router } from 'express';
import { body, param } from 'express-validator';
import { OrderController } from '@presentation/controllers/OrderController';
import { validateRequest } from '@presentation/middleware/validateRequest';

export function createOrderRoutes(orderController: OrderController): Router {
  const router = Router();

  // GET /api/orders - Obtener todos los pedidos
  router.get('/', orderController.getOrders.bind(orderController));

  // GET /api/orders/stats - Obtener estadísticas de pedidos
  router.get('/stats', orderController.getOrderStats.bind(orderController));

  // GET /api/orders/status/:status - Obtener pedidos por estado
  router.get('/status/:status', orderController.getOrdersByStatus.bind(orderController));

  // GET /api/orders/:id - Obtener pedido por ID
  router.get('/:id', orderController.getOrderById.bind(orderController));

  // POST /api/orders - Crear nuevo pedido
  router.post('/', [
    body('customerEmail').isEmail().withMessage('Valid email is required'),
    body('customerName').notEmpty().withMessage('Customer name is required'),
    body('customerPhone').optional().isString(),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.productId').notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.size').notEmpty().withMessage('Size is required'),
    body('items.*.color').notEmpty().withMessage('Color is required'),
    body('shippingAddress.street').notEmpty().withMessage('Street is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.state').notEmpty().withMessage('State is required'),
    body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
    body('shippingAddress.country').optional().isString(),
    validateRequest
  ], orderController.createOrder.bind(orderController));

  // PUT /api/orders/:id - Actualizar pedido
  router.put('/:id', [
    param('id').notEmpty().withMessage('Order ID is required'),
    body('status').optional().isString(),
    body('customerEmail').optional().isEmail(),
    body('customerName').optional().isString(),
    body('customerPhone').optional().isString(),
    body('deliveredAt').optional().isISO8601(),
    validateRequest
  ], orderController.updateOrder.bind(orderController));

  return router;
} 