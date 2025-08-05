import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { UserController } from '../controllers/UserController';
import { validateRequest } from '../middleware/validateRequest';

export const createUserRoutes = (userController: UserController): Router => {
  const router = Router();

  // Validation rules
  const createUserValidation = [
    body('email')
      .isEmail()
      .withMessage('Email must be a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role')
      .optional()
      .isIn(['admin', 'customer', 'staff'])
      .withMessage('Role must be one of: admin, customer, staff'),
    body('profile.firstName')
      .optional()
      .isLength({ min: 2 })
      .withMessage('First name must be at least 2 characters long'),
    body('profile.lastName')
      .optional()
      .isLength({ min: 2 })
      .withMessage('Last name must be at least 2 characters long'),
    body('profile.phone')
      .optional()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Phone number must be a valid international format'),
    body('profile.birthDate')
      .optional()
      .isISO8601()
      .withMessage('Birth date must be a valid date'),
    validateRequest
  ];

  const updateUserValidation = [
    param('id')
      .isUUID()
      .withMessage('User ID must be a valid UUID'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Email must be a valid email address')
      .normalizeEmail(),
    body('role')
      .optional()
      .isIn(['admin', 'customer', 'staff'])
      .withMessage('Role must be one of: admin, customer, staff'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('profile.firstName')
      .optional()
      .isLength({ min: 2 })
      .withMessage('First name must be at least 2 characters long'),
    body('profile.lastName')
      .optional()
      .isLength({ min: 2 })
      .withMessage('Last name must be at least 2 characters long'),
    body('profile.phone')
      .optional()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Phone number must be a valid international format'),
    body('profile.birthDate')
      .optional()
      .isISO8601()
      .withMessage('Birth date must be a valid date'),
    validateRequest
  ];

  const getUserByIdValidation = [
    param('id')
      .isUUID()
      .withMessage('User ID must be a valid UUID'),
    validateRequest
  ];

  const getUsersValidation = [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be a non-negative integer'),
    query('role')
      .optional()
      .isIn(['admin', 'customer', 'staff'])
      .withMessage('Role must be one of: admin, customer, staff'),
    query('isActive')
      .optional()
      .isIn(['true', 'false'])
      .withMessage('isActive must be true or false'),
    query('search')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Search query must not be empty'),
    validateRequest
  ];

  // Routes
  router.post('/', createUserValidation, userController.createUser.bind(userController));
  router.get('/', getUsersValidation, userController.getUsers.bind(userController));
  router.get('/stats', userController.getUserStats.bind(userController));
  router.get('/:id', getUserByIdValidation, userController.getUserById.bind(userController));
  router.put('/:id', updateUserValidation, userController.updateUser.bind(userController));

  return router;
}; 