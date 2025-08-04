import { Router } from 'express';
import { body, query } from 'express-validator';
import { ProductController } from '../controllers/ProductController';
import { validateRequest } from '../middleware/validateRequest';

export function createProductRoutes(productController: ProductController): Router {
  const router = Router();

  // GET /api/products - Obtener todos los productos
  router.get('/', [
    query('category').optional().isString(),
    query('isActive').optional().isBoolean(),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('inStock').optional().isBoolean(),
    query('search').optional().isString(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
    validateRequest
  ], (req: any, res: any) => productController.getAll(req, res));

  // GET /api/products/:id - Obtener producto por ID
  router.get('/:id', (req, res) => productController.getById(req, res));

  // POST /api/products - Crear nuevo producto
  router.post('/', [
    body('name').notEmpty().withMessage('Name is required').isLength({ max: 255 }),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('sizes').isArray({ min: 1 }).withMessage('At least one size is required'),
    body('colors').isArray({ min: 1 }).withMessage('At least one color is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('sku').notEmpty().withMessage('SKU is required').isLength({ max: 50 }),
    validateRequest
  ], (req: any, res: any) => productController.create(req, res));

  // PUT /api/products/:id - Actualizar producto
  router.put('/:id', [
    body('name').optional().isLength({ max: 255 }),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
    validateRequest
  ], (req: any, res: any) => productController.update(req, res));

  // DELETE /api/products/:id - Eliminar producto
  router.delete('/:id', (req, res) => productController.delete(req, res));

  return router;
}