import { SupabaseConfig } from '@infrastructure/config/supabase';
import { PostgresProductRepository } from '@infrastructure/repositories/PostgresProductRepository';
import { PostgresImageRepository } from '@infrastructure/repositories/PostgresImageRepository';
import { PostgresOrderRepository } from '@infrastructure/repositories/PostgresOrderRepository';
import { SupabaseStorageService } from '@infrastructure/services/SupabaseStorageService';
import { CreateProductUseCase } from '@application/use-cases/product/CreateProductUseCase';
import { GetProductsUseCase } from '@application/use-cases/product/GetProductsUseCase';
import { GetProductByIdUseCase } from '@application/use-cases/product/GetProductByIdUseCase';
import { UpdateProductUseCase } from '@application/use-cases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from '@application/use-cases/product/DeleteProductUseCase';
import { UploadImageUseCase } from '@application/use-cases/image/UploadImageUseCase';
import { CreateOrderUseCase } from '@application/use-cases/order/CreateOrderUseCase';
import { GetOrdersUseCase } from '@application/use-cases/order/GetOrdersUseCase';
import { GetOrderByIdUseCase } from '@application/use-cases/order/GetOrderByIdUseCase';
import { UpdateOrderUseCase } from '@application/use-cases/order/UpdateOrderUseCase';
import { GetOrderStatsUseCase } from '@application/use-cases/order/GetOrderStatsUseCase';
import { ProductController } from '@presentation/controllers/ProductController';
import { ImageController } from '@presentation/controllers/ImageController';
import { OrderController } from '@presentation/controllers/OrderController';
import { IProductRepository } from '@domain/repositories/IProductRepository';
import { IImageRepository, IStorageService } from '@domain/repositories/IImageRepository';
import { IOrderRepository } from '@domain/repositories/IOrderRepository';

export class Container {
  private static instance: Container;
  private dependencies: Map<string, any> = new Map();

  static getInstance(): Container {
    if (!this.instance) {
      this.instance = new Container();
      this.instance.registerDependencies();
    }
    return this.instance;
  }

  private registerDependencies(): void {
    // Configuración
    const supabase = SupabaseConfig.getInstance();
    
    // Repositorios PostgreSQL
    const productRepository: IProductRepository = new PostgresProductRepository();
    const imageRepository: IImageRepository = new PostgresImageRepository();
    const orderRepository: IOrderRepository = new PostgresOrderRepository();
    
    // Servicios
    const storageService: IStorageService = new SupabaseStorageService(supabase);
    
    // Casos de uso de Productos
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const getProductsUseCase = new GetProductsUseCase(productRepository);
    const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
    const updateProductUseCase = new UpdateProductUseCase(productRepository);
    const deleteProductUseCase = new DeleteProductUseCase(productRepository);
    
    // Casos de uso de Imágenes
    const uploadImageUseCase = new UploadImageUseCase(imageRepository, storageService);
    
    // Casos de uso de Pedidos
    const createOrderUseCase = new CreateOrderUseCase(orderRepository, productRepository);
    const getOrdersUseCase = new GetOrdersUseCase(orderRepository);
    const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);
    const updateOrderUseCase = new UpdateOrderUseCase(orderRepository);
    const getOrderStatsUseCase = new GetOrderStatsUseCase(orderRepository);
    
    // Controladores
    const productController = new ProductController(
      createProductUseCase, 
      getProductsUseCase,
      getProductByIdUseCase,
      updateProductUseCase,
      deleteProductUseCase
    );
    const imageController = new ImageController(uploadImageUseCase);
    const orderController = new OrderController(
      createOrderUseCase,
      getOrdersUseCase,
      getOrderByIdUseCase,
      updateOrderUseCase,
      getOrderStatsUseCase
    );

    // Registrar dependencias
    this.dependencies.set('supabase', supabase);
    this.dependencies.set('productRepository', productRepository);
    this.dependencies.set('imageRepository', imageRepository);
    this.dependencies.set('orderRepository', orderRepository);
    this.dependencies.set('storageService', storageService);
    
    // Casos de uso
    this.dependencies.set('createProductUseCase', createProductUseCase);
    this.dependencies.set('getProductsUseCase', getProductsUseCase);
    this.dependencies.set('getProductByIdUseCase', getProductByIdUseCase);
    this.dependencies.set('updateProductUseCase', updateProductUseCase);
    this.dependencies.set('deleteProductUseCase', deleteProductUseCase);
    this.dependencies.set('uploadImageUseCase', uploadImageUseCase);
    this.dependencies.set('createOrderUseCase', createOrderUseCase);
    this.dependencies.set('getOrdersUseCase', getOrdersUseCase);
    this.dependencies.set('getOrderByIdUseCase', getOrderByIdUseCase);
    this.dependencies.set('updateOrderUseCase', updateOrderUseCase);
    this.dependencies.set('getOrderStatsUseCase', getOrderStatsUseCase);
    
    // Controladores
    this.dependencies.set('productController', productController);
    this.dependencies.set('imageController', imageController);
    this.dependencies.set('orderController', orderController);
  }

  get<T>(key: string): T {
    const dependency = this.dependencies.get(key);
    if (!dependency) {
      throw new Error(`Dependency '${key}' not found`);
    }
    return dependency;
  }
}