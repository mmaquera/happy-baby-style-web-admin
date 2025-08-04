import request from 'supertest';
import express from 'express';
import { Container } from '@shared/container';
import { createProductRoutes } from '@presentation/routes/productRoutes';

// Mock del container para tests
jest.mock('@shared/container');

describe('Products API Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock del container
    const mockContainer = {
      get: jest.fn()
    };

    // Mock de los casos de uso
    const mockCreateProductUseCase = {
      execute: jest.fn()
    };

    const mockGetProductsUseCase = {
      execute: jest.fn()
    };

    const mockGetProductByIdUseCase = {
      execute: jest.fn()
    };

    const mockUpdateProductUseCase = {
      execute: jest.fn()
    };

    const mockDeleteProductUseCase = {
      execute: jest.fn()
    };

    // Mock del controlador
    const mockProductController = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    (Container.getInstance as jest.Mock).mockReturnValue(mockContainer);
    mockContainer.get.mockImplementation((key: string) => {
      switch (key) {
        case 'productController':
          return mockProductController;
        default:
          return null;
      }
    });

    // Configurar rutas
    app.use('/api/products', createProductRoutes(mockProductController));
  });

  describe('GET /api/products', () => {
    it('should return products successfully', async () => {
      // Arrange
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          price: 29.99,
          sku: 'SKU-1'
        }
      ];

      const mockController = Container.getInstance().get('productController');
      mockController.getAll.mockImplementation((req: any, res: any) => {
        res.json({
          success: true,
          data: mockProducts,
          count: 1,
          message: 'Products retrieved successfully'
        });
      });

      // Act
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockProducts,
        count: 1,
        message: 'Products retrieved successfully'
      });
      expect(mockController.getAll).toHaveBeenCalled();
    });

    it('should handle query parameters correctly', async () => {
      // Arrange
      const mockController = Container.getInstance().get('productController');
      mockController.getAll.mockImplementation((req: any, res: any) => {
        res.json({
          success: true,
          data: [],
          count: 0,
          message: 'Products retrieved successfully'
        });
      });

      // Act
      const response = await request(app)
        .get('/api/products?isActive=true&limit=10&offset=0&search=test')
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(mockController.getAll).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      // Arrange
      const mockController = Container.getInstance().get('productController');
      mockController.getAll.mockImplementation((req: any, res: any) => {
        res.status(500).json({
          success: false,
          error: 'Database error',
          message: 'Failed to retrieve products'
        });
      });

      // Act
      const response = await request(app)
        .get('/api/products')
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        error: 'Database error',
        message: 'Failed to retrieve products'
      });
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product when found', async () => {
      // Arrange
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        price: 29.99,
        sku: 'SKU-1'
      };

      const mockController = Container.getInstance().get('productController');
      mockController.getById.mockImplementation((req: any, res: any) => {
        res.json({
          success: true,
          data: mockProduct,
          message: 'Product retrieved successfully'
        });
      });

      // Act
      const response = await request(app)
        .get('/api/products/1')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockProduct,
        message: 'Product retrieved successfully'
      });
    });

    it('should return 404 when product not found', async () => {
      // Arrange
      const mockController = Container.getInstance().get('productController');
      mockController.getById.mockImplementation((req: any, res: any) => {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      });

      // Act
      const response = await request(app)
        .get('/api/products/non-existent')
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: 'Product not found'
      });
    });
  });

  describe('POST /api/products', () => {
    it('should create product successfully', async () => {
      // Arrange
      const productData = {
        name: 'New Product',
        description: 'New Description',
        price: 29.99,
        categoryId: 'category-1'
      };

      const createdProduct = {
        id: '1',
        ...productData
      };

      const mockController = Container.getInstance().get('productController');
      mockController.create.mockImplementation((req: any, res: any) => {
        res.status(201).json({
          success: true,
          data: createdProduct,
          message: 'Product created successfully'
        });
      });

      // Act
      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: createdProduct,
        message: 'Product created successfully'
      });
    });

    it('should handle validation errors', async () => {
      // Arrange
      const invalidData = {
        name: '', // Invalid: empty name
        price: -10 // Invalid: negative price
      };

      const mockController = Container.getInstance().get('productController');
      mockController.create.mockImplementation((req: any, res: any) => {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Failed to create product'
        });
      });

      // Act
      const response = await request(app)
        .post('/api/products')
        .send(invalidData)
        .expect(400);

      // Assert
      expect(response.body).toEqual({
        success: false,
        error: 'Validation error',
        message: 'Failed to create product'
      });
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update product successfully', async () => {
      // Arrange
      const updateData = {
        name: 'Updated Product',
        price: 39.99
      };

      const updatedProduct = {
        id: '1',
        ...updateData
      };

      const mockController = Container.getInstance().get('productController');
      mockController.update.mockImplementation((req: any, res: any) => {
        res.json({
          success: true,
          data: updatedProduct,
          message: 'Product updated successfully'
        });
      });

      // Act
      const response = await request(app)
        .put('/api/products/1')
        .send(updateData)
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully'
      });
    });

    it('should handle not found error', async () => {
      // Arrange
      const mockController = Container.getInstance().get('productController');
      mockController.update.mockImplementation((req: any, res: any) => {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      });

      // Act
      const response = await request(app)
        .put('/api/products/non-existent')
        .send({ name: 'Updated' })
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: 'Product not found'
      });
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product successfully', async () => {
      // Arrange
      const mockController = Container.getInstance().get('productController');
      mockController.delete.mockImplementation((req: any, res: any) => {
        res.json({
          success: true,
          message: 'Product deleted successfully'
        });
      });

      // Act
      const response = await request(app)
        .delete('/api/products/1')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        message: 'Product deleted successfully'
      });
    });

    it('should handle not found error', async () => {
      // Arrange
      const mockController = Container.getInstance().get('productController');
      mockController.delete.mockImplementation((req: any, res: any) => {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      });

      // Act
      const response = await request(app)
        .delete('/api/products/non-existent')
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: 'Product not found'
      });
    });
  });
}); 