import { IProductRepository, ProductFilters } from '@domain/repositories/IProductRepository';
import { ProductEntity, ProductVariantEntity } from '@domain/entities/Product';
import { PostgresConfig } from '@infrastructure/config/postgres';

export class PostgresProductRepository implements IProductRepository {
  private postgres: PostgresConfig;

  constructor() {
    this.postgres = PostgresConfig.getInstance();
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    const query = `
      INSERT INTO products (
        category_id, name, description, price, sale_price, sku, 
        images, attributes, is_active, stock_quantity, tags, 
        rating, review_count, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      product.categoryId,
      product.name,
      product.description,
      product.price,
      product.salePrice,
      product.sku,
      JSON.stringify(product.images),
      JSON.stringify(product.attributes),
      product.isActive,
      product.stockQuantity,
      product.tags, // tags ya es un array, no necesita JSON.stringify
      product.rating,
      product.reviewCount
    ];

    const result = await this.postgres.query(query, values);
    return this.mapToProductEntity(result.rows[0]);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await this.postgres.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToProductEntity(result.rows[0]);
  }

  async findAll(filters?: ProductFilters): Promise<ProductEntity[]> {
    let query = 'SELECT * FROM products';
    const values: any[] = [];
    let whereConditions: string[] = [];
    let paramIndex = 1;

    if (filters?.categoryId) {
      whereConditions.push(`category_id = $${paramIndex}`);
      values.push(filters.categoryId);
      paramIndex++;
    }

    if (filters?.isActive !== undefined) {
      whereConditions.push(`is_active = $${paramIndex}`);
      values.push(filters.isActive);
      paramIndex++;
    }

    if (filters?.minPrice) {
      whereConditions.push(`price >= $${paramIndex}`);
      values.push(filters.minPrice);
      paramIndex++;
    }

    if (filters?.maxPrice) {
      whereConditions.push(`price <= $${paramIndex}`);
      values.push(filters.maxPrice);
      paramIndex++;
    }

    if (filters?.inStock) {
      whereConditions.push(`stock_quantity > 0`);
    }

    if (filters?.search) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      values.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    query += ` ORDER BY created_at DESC`;

    if (filters?.limit) {
      query += ` LIMIT $${paramIndex}`;
      values.push(filters.limit);
      paramIndex++;
    }

    if (filters?.offset) {
      query += ` OFFSET $${paramIndex}`;
      values.push(filters.offset);
    }

    const result = await this.postgres.query(query, values);
    return result.rows.map((row: any) => this.mapToProductEntity(row));
  }

  async update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity> {
    const query = `
      UPDATE products 
      SET category_id = COALESCE($1, category_id),
          name = COALESCE($2, name),
          description = COALESCE($3, description),
          price = COALESCE($4, price),
          sale_price = COALESCE($5, sale_price),
          sku = COALESCE($6, sku),
          images = COALESCE($7, images),
          attributes = COALESCE($8, attributes),
          is_active = COALESCE($9, is_active),
          stock_quantity = COALESCE($10, stock_quantity),
          tags = COALESCE($11, tags),
          rating = COALESCE($12, rating),
          review_count = COALESCE($13, review_count),
          updated_at = NOW()
      WHERE id = $14
      RETURNING *
    `;

    const values = [
      product.categoryId,
      product.name,
      product.description,
      product.price,
      product.salePrice,
      product.sku,
      product.images ? JSON.stringify(product.images) : undefined,
      product.attributes ? JSON.stringify(product.attributes) : undefined,
      product.isActive,
      product.stockQuantity,
      product.tags, // tags ya es un array, no necesita JSON.stringify
      product.rating,
      product.reviewCount,
      id
    ];

    const result = await this.postgres.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error(`Product with id ${id} not found`);
    }

    return this.mapToProductEntity(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM products WHERE id = $1';
    await this.postgres.query(query, [id]);
  }

  async findByCategory(categoryId: string): Promise<ProductEntity[]> {
    const query = 'SELECT * FROM products WHERE category_id = $1 AND is_active = true ORDER BY created_at DESC';
    const result = await this.postgres.query(query, [categoryId]);
    
    return result.rows.map((row: any) => this.mapToProductEntity(row));
  }

  async findBySku(sku: string): Promise<ProductEntity | null> {
    const query = 'SELECT * FROM products WHERE sku = $1';
    const result = await this.postgres.query(query, [sku]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToProductEntity(result.rows[0]);
  }

  async updateStock(id: string, stockQuantity: number): Promise<void> {
    const query = 'UPDATE products SET stock_quantity = $1, updated_at = NOW() WHERE id = $2';
    await this.postgres.query(query, [stockQuantity, id]);
  }

  async search(query: string): Promise<ProductEntity[]> {
    const sqlQuery = `
      SELECT * FROM products 
      WHERE (name ILIKE $1 OR description ILIKE $1 OR sku ILIKE $1)
      AND is_active = true 
      ORDER BY created_at DESC
    `;
    const result = await this.postgres.query(sqlQuery, [`%${query}%`]);
    return result.rows.map((row: any) => this.mapToProductEntity(row));
  }

  async createVariant(variant: any): Promise<any> {
    const query = `
      INSERT INTO product_variants (
        product_id, size, color, sku, price, stock_quantity, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      variant.productId,
      variant.size,
      variant.color,
      variant.sku,
      variant.price,
      variant.stockQuantity,
      variant.isActive
    ];

    const result = await this.postgres.query(query, values);
    return result.rows[0];
  }

  async getProductVariants(productId: string): Promise<any[]> {
    const query = 'SELECT * FROM product_variants WHERE product_id = $1 ORDER BY created_at ASC';
    const result = await this.postgres.query(query, [productId]);
    return result.rows;
  }

  async updateVariant(id: string, variantData: Partial<any>): Promise<any> {
    const query = `
      UPDATE product_variants 
      SET size = COALESCE($1, size),
          color = COALESCE($2, color),
          sku = COALESCE($3, sku),
          price = COALESCE($4, price),
          stock_quantity = COALESCE($5, stock_quantity),
          is_active = COALESCE($6, is_active),
          updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;

    const values = [
      variantData.size,
      variantData.color,
      variantData.sku,
      variantData.price,
      variantData.stockQuantity,
      variantData.isActive,
      id
    ];

    const result = await this.postgres.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error(`Variant with id ${id} not found`);
    }

    return result.rows[0];
  }

  async deleteVariant(id: string): Promise<void> {
    const query = 'DELETE FROM product_variants WHERE id = $1';
    await this.postgres.query(query, [id]);
  }

  async getCategories(): Promise<any[]> {
    const query = 'SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC, name ASC';
    const result = await this.postgres.query(query);
    return result.rows;
  }

  private mapToProductEntity(row: any): ProductEntity {
    // Función helper para parsear images (URLs separadas por comas)
    const parseImages = (images: any): string[] => {
      if (!images) return [];
      if (typeof images === 'string') {
        // Si es una cadena con URLs separadas por comas
        if (images.includes('http')) {
          return images.split(',').map(url => url.trim());
        }
        // Si es JSON válido
        try {
          return JSON.parse(images);
        } catch {
          return [];
        }
      }
      return [];
    };

    // Función helper para parsear attributes
    const parseAttributes = (attributes: any): any => {
      if (!attributes) return {};
      if (typeof attributes === 'string') {
        // Si es "[object Object]", devolver objeto vacío
        if (attributes === '[object Object]') {
          return {};
        }
        // Si es JSON válido
        try {
          return JSON.parse(attributes);
        } catch {
          return {};
        }
      }
      return attributes;
    };

    return new ProductEntity(
      row.id,
      row.category_id,
      row.name,
      row.description,
      parseFloat(row.price),
      row.sale_price ? parseFloat(row.sale_price) : undefined,
      row.sku,
      parseImages(row.images),
      parseAttributes(row.attributes),
      row.is_active,
      row.stock_quantity,
      row.tags || undefined, // tags ya es un array en PostgreSQL
      row.rating || 0,
      row.review_count || 0,
      row.created_at,
      row.updated_at
    );
  }
} 