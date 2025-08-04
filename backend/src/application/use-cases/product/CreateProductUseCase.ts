import { ProductEntity } from '@domain/entities/Product';
import { IProductRepository } from '@domain/repositories/IProductRepository';

export interface CreateProductRequest {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  images?: string[];
  attributes?: Record<string, any>;
  stockQuantity: number;
  tags?: string[];
  isActive?: boolean;
}

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository
  ) {}

  async execute(request: CreateProductRequest): Promise<ProductEntity> {
    // Validar que el SKU sea único
    const existingProduct = await this.productRepository.findBySku(request.sku);
    if (existingProduct) {
      throw new Error('Product with this SKU already exists');
    }

    // Validar precio
    if (request.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    // Validar precio de oferta
    if (request.salePrice !== undefined && request.salePrice >= request.price) {
      throw new Error('Sale price must be less than regular price');
    }

    // Validar stock
    if (request.stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }

    // Crear producto
    const product = ProductEntity.create({
      categoryId: request.categoryId,
      name: request.name.trim(),
      description: request.description.trim(),
      price: request.price,
      salePrice: request.salePrice,
      sku: request.sku.trim().toUpperCase(),
      images: request.images || [],
      attributes: request.attributes || {},
      isActive: request.isActive ?? true,
      stockQuantity: request.stockQuantity,
      tags: request.tags
    });

    return await this.productRepository.create(product);
  }
}