import { Request, Response } from 'express';
import { ProductController } from '@presentation/controllers/ProductController';
import { CreateProductUseCase } from '@application/use-cases/product/CreateProductUseCase';
import { GetProductsUseCase } from '@application/use-cases/product/GetProductsUseCase';
import { GetProductByIdUseCase } from '@application/use-cases/product/GetProductByIdUseCase';
import { UpdateProductUseCase } from '@application/use-cases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from '@application/use-cases/product/DeleteProductUseCase';
import { ProductEntity } from '@domain/entities/Product';

// Mocks de los casos de uso
const mockCreateProductUseCase = {
  execute: jest.fn()
} as jest.Mocked<CreateProductUseCase>;

const mockGetProductsUseCase = {
  execute: jest.fn()
} as jest.Mocked<GetProductsUseCase>;

const mockGetProductByIdUseCase = {
  execute: jest.fn()
} as jest.Mocked<GetProductByIdUseCase>;

const mockUpdateProductUseCase = {
  execute: jest.fn()
} as jest.Mocked<UpdateProductUseCase>;

const mockDeleteProductUseCase = {
  execute: jest.fn()
} as jest.Mocked<DeleteProductUseCase>;

describe('ProductController', () => {
  let controller: ProductController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    controller = new ProductController(
      mockCreateProductUseCase,
      mockGetProductsUseCase,
      mockGetProductByIdUseCase,
      mockUpdateProductUseCase,
      mockDeleteProductUseCase
    );

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockRequest = {};
    mockResponse = {
      json: mockJson,
      status: mockStatus
    };

    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return products successfully', async () => {
      // Arrange
      const mockProducts = [
        new ProductEntity(
          '1',
          'category-1',
          'Test Product',
          'Test Description',
          29.99,
          undefined,
          'SKU-1',
          [],
          {},
          true,
          10,
          ['test'],
          4.5,
          5,
          new Date(),
          new Date()
        )
      ];

      mockRequest.query = {
        isActive: 'true',
        limit: '10',
        offset: '0'
      };

      mockGetProductsUseCase.execute.mockResolvedValue(mockProducts);

      // Act
      await controller.getAll(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockGetProductsUseCase.execute).toHaveBeenCalledWith({
        category: undefined,
        isActive: true,
        minPrice: undefined,
        maxPrice: undefined,
        inStock: undefined,
        search: undefined,
        limit: 10,
        offset: 0
      });
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockProducts,
        count: 1,
        message: 'Products retrieved successfully'
      });
    });

    it('should handle errors and return 500 status', async () => {
      // Arrange
      const error = new Error('Database error');
      mockGetProductsUseCase.execute.mockRejectedValue(error);

      // Act
      await controller.getAll(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Database error',
        message: 'Failed to retrieve products'
      });
    });

    it('should parse query parameters correctly', async () => {
      // Arrange
      mockRequest.query = {
        category: 'test-category',
        isActive: 'false',
        minPrice: '10.50',
        maxPrice: '100.00',
        inStock: 'true',
        search: 'test search',
        limit: '5',
        offset: '10'
      };

      mockGetProductsUseCase.execute.mockResolvedValue([]);

      // Act
      await controller.getAll(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockGetProductsUseCase.execute).toHaveBeenCalledWith({
        category: 'test-category',
        isActive: false,
        minPrice: 10.5,
        maxPrice: 100,
        inStock: true,
        search: 'test search',
        limit: 5,
        offset: 10
      });
    });
  });

  describe('getById', () => {
    it('should return product when found', async () => {
      // Arrange
      const mockProduct = new ProductEntity(
        '1',
        'category-1',
        'Test Product',
        'Test Description',
        29.99,
        undefined,
        'SKU-1',
        [],
        {},
        true,
        10,
        ['test'],
        4.5,
        5,
        new Date(),
        new Date()
      );

      mockRequest.params = { id: '1' };
      mockGetProductByIdUseCase.execute.mockResolvedValue(mockProduct);

      // Act
      await controller.getById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockGetProductByIdUseCase.execute).toHaveBeenCalledWith({ id: '1' });
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
        message: 'Product retrieved successfully'
      });
    });

    it('should return 404 when product not found', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent' };
      mockGetProductByIdUseCase.execute.mockResolvedValue(null);

      // Act
      await controller.getById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Product not found'
      });
    });

    it('should return 400 when ID is missing', async () => {
      // Arrange
      mockRequest.params = {};

      // Act
      await controller.getById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Product ID is required'
      });
    });
  });

  describe('create', () => {
    it('should create product successfully', async () => {
      // Arrange
      const mockProduct = new ProductEntity(
        '1',
        'category-1',
        'New Product',
        'New Description',
        29.99,
        undefined,
        'SKU-1',
        [],
        {},
        true,
        10,
        ['new'],
        0,
        0,
        new Date(),
        new Date()
      );

      mockRequest.body = {
        name: 'New Product',
        description: 'New Description',
        price: 29.99,
        categoryId: 'category-1'
      };

      mockCreateProductUseCase.execute.mockResolvedValue(mockProduct);

      // Act
      await controller.create(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockCreateProductUseCase.execute).toHaveBeenCalledWith(mockRequest.body);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
        message: 'Product created successfully'
      });
    });

    it('should handle creation errors', async () => {
      // Arrange
      const error = new Error('Validation error');
      mockRequest.body = { name: 'Test' };
      mockCreateProductUseCase.execute.mockRejectedValue(error);

      // Act
      await controller.create(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Validation error',
        message: 'Failed to create product'
      });
    });
  });

  describe('update', () => {
    it('should update product successfully', async () => {
      // Arrange
      const mockProduct = new ProductEntity(
        '1',
        'category-1',
        'Updated Product',
        'Updated Description',
        39.99,
        undefined,
        'SKU-1',
        [],
        {},
        true,
        15,
        ['updated'],
        4.5,
        5,
        new Date(),
        new Date()
      );

      mockRequest.params = { id: '1' };
      mockRequest.body = {
        name: 'Updated Product',
        price: 39.99
      };

      mockUpdateProductUseCase.execute.mockResolvedValue(mockProduct);

      // Act
      await controller.update(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUpdateProductUseCase.execute).toHaveBeenCalledWith({
        id: '1',
        name: 'Updated Product',
        price: 39.99
      });
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
        message: 'Product updated successfully'
      });
    });

    it('should handle not found error', async () => {
      // Arrange
      const error = new Error('Product not found');
      mockRequest.params = { id: 'non-existent' };
      mockRequest.body = { name: 'Updated' };
      mockUpdateProductUseCase.execute.mockRejectedValue(error);

      // Act
      await controller.update(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Product not found'
      });
    });

    it('should handle validation errors', async () => {
      // Arrange
      const error = new Error('SKU already exists');
      mockRequest.params = { id: '1' };
      mockRequest.body = { sku: 'EXISTING-SKU' };
      mockUpdateProductUseCase.execute.mockRejectedValue(error);

      // Act
      await controller.update(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'SKU already exists'
      });
    });
  });

  describe('delete', () => {
    it('should delete product successfully', async () => {
      // Arrange
      mockRequest.params = { id: '1' };
      mockDeleteProductUseCase.execute.mockResolvedValue(undefined);

      // Act
      await controller.delete(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockDeleteProductUseCase.execute).toHaveBeenCalledWith({ id: '1' });
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Product deleted successfully'
      });
    });

    it('should handle not found error', async () => {
      // Arrange
      const error = new Error('Product not found');
      mockRequest.params = { id: 'non-existent' };
      mockDeleteProductUseCase.execute.mockRejectedValue(error);

      // Act
      await controller.delete(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Product not found'
      });
    });

    it('should return 400 when ID is missing', async () => {
      // Arrange
      mockRequest.params = {};

      // Act
      await controller.delete(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Product ID is required'
      });
    });
  });
}); 