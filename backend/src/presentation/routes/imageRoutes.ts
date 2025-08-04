import { Router } from 'express';
import { body, param } from 'express-validator';
import multer from 'multer';
import { ImageController } from '../controllers/ImageController';
import { validateRequest } from '../middleware/validateRequest';

// Configurar multer para manejar archivos en memoria
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WEBP are allowed'));
    }
  }
});

export function createImageRoutes(imageController: ImageController): Router {
  const router = Router();

  // POST /api/images/upload - Subir imagen
  router.post('/upload', upload.single('image'), [
    body('entityType').notEmpty().withMessage('Entity type is required'),
    body('entityId').notEmpty().withMessage('Entity ID is required'),
    validateRequest
  ], (req: any, res: any) => imageController.upload(req, res));

  // GET /api/images/:entityType/:entityId - Obtener imágenes por entidad
  router.get('/:entityType/:entityId', [
    param('entityType').notEmpty().withMessage('Entity type is required'),
    param('entityId').notEmpty().withMessage('Entity ID is required'),
    validateRequest
  ], (req: any, res: any) => imageController.getByEntity(req, res));

  // DELETE /api/images/:id - Eliminar imagen
  router.delete('/:id', (req, res) => imageController.delete(req, res));

  return router;
}