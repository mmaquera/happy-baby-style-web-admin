import { SupabaseClient } from '@supabase/supabase-js';
import { ProductEntity, ProductVariantEntity, CategoryEntity } from '@domain/entities/Product';
import { IProductRepository, ProductFilters } from '@domain/repositories/IProductRepository';

export class SupabaseProductRepository implements IProductRepository {
  private readonly tableName = 'products';
  private readonly variantsTableName = 'product_variants';
  private readonly categoriesTableName = 'categories';

  constructor(private readonly supabase: SupabaseClient) {}

  async create(product: ProductEntity): Promise<ProductEntity> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(this.toSupabaseFormat(product))
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*)
      `)
      .single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return this.toDomainEntity(data);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to find product: ${error.message}`);
    }

    return this.toDomainEntity(data);
  }

  async findAll(filters: ProductFilters = {}): Promise<ProductEntity[]> {
    let query = this.supabase
      .from(this.tableName)
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*)
      `);

    // Aplicar filtros
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.inStock) {
      query = query.gt('stock_quantity', 0);
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
    }

    // Paginación
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
    }

    // Ordenamiento
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return data.map(item => this.toDomainEntity(item));
  }

  async update(id: string, productData: Partial<ProductEntity>): Promise<ProductEntity> {
    const updateData = this.toSupabaseFormat(productData as ProductEntity);
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*)
      `)
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return this.toDomainEntity(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  async findByCategory(categoryId: string): Promise<ProductEntity[]> {
    return this.findAll({ categoryId });
  }

  async findBySku(sku: string): Promise<ProductEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*)
      `)
      .eq('sku', sku.toUpperCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to find product by SKU: ${error.message}`);
    }

    return this.toDomainEntity(data);
  }

  async updateStock(id: string, stockQuantity: number): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ 
        stock_quantity: stockQuantity, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update stock: ${error.message}`);
    }
  }

  async search(query: string): Promise<ProductEntity[]> {
    return this.findAll({ search: query });
  }

  // Métodos para variantes de productos
  async createVariant(variant: ProductVariantEntity): Promise<ProductVariantEntity> {
    const { data, error } = await this.supabase
      .from(this.variantsTableName)
      .insert(this.variantToSupabaseFormat(variant))
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create product variant: ${error.message}`);
    }

    return this.variantToDomainEntity(data);
  }

  async getProductVariants(productId: string): Promise<ProductVariantEntity[]> {
    const { data, error } = await this.supabase
      .from(this.variantsTableName)
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch product variants: ${error.message}`);
    }

    return data.map(item => this.variantToDomainEntity(item));
  }

  async updateVariant(id: string, variantData: Partial<ProductVariantEntity>): Promise<ProductVariantEntity> {
    const updateData = this.variantToSupabaseFormat(variantData as ProductVariantEntity);
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from(this.variantsTableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product variant: ${error.message}`);
    }

    return this.variantToDomainEntity(data);
  }

  async deleteVariant(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.variantsTableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product variant: ${error.message}`);
    }
  }

  // Métodos para categorías
  async getCategories(): Promise<CategoryEntity[]> {
    const { data, error } = await this.supabase
      .from(this.categoriesTableName)
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data.map(item => this.categoryToDomainEntity(item));
  }

  private toSupabaseFormat(product: ProductEntity): any {
    return {
      id: product.id,
      category_id: product.categoryId,
      name: product.name,
      description: product.description,
      price: product.price,
      sale_price: product.salePrice,
      sku: product.sku,
      images: product.images,
      attributes: product.attributes,
      is_active: product.isActive,
      stock_quantity: product.stockQuantity,
      tags: product.tags,
      rating: product.rating,
      review_count: product.reviewCount,
      created_at: product.createdAt.toISOString(),
      updated_at: product.updatedAt.toISOString()
    };
  }

  private toDomainEntity(data: any): ProductEntity {
    return new ProductEntity(
      data.id,
      data.category_id,
      data.name,
      data.description,
      data.price,
      data.sale_price,
      data.sku,
      data.images || [],
      data.attributes || {},
      data.is_active,
      data.stock_quantity,
      data.tags,
      data.rating,
      data.review_count,
      new Date(data.created_at),
      new Date(data.updated_at),
      data.category ? this.categoryToDomainEntity(data.category) : undefined,
      data.variants ? data.variants.map((v: any) => this.variantToDomainEntity(v)) : undefined
    );
  }

  private variantToSupabaseFormat(variant: ProductVariantEntity): any {
    return {
      id: variant.id,
      product_id: variant.productId,
      size: variant.size,
      color: variant.color,
      sku: variant.sku,
      price: variant.price,
      stock_quantity: variant.stockQuantity,
      is_active: variant.isActive,
      created_at: variant.createdAt.toISOString(),
      updated_at: variant.updatedAt.toISOString()
    };
  }

  private variantToDomainEntity(data: any): ProductVariantEntity {
    return new ProductVariantEntity(
      data.id,
      data.product_id,
      data.size,
      data.color,
      data.sku,
      data.price,
      data.stock_quantity,
      data.is_active,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }

  private categoryToDomainEntity(data: any): CategoryEntity {
    return new CategoryEntity(
      data.id,
      data.name,
      data.description,
      data.slug,
      data.image_url,
      data.is_active,
      data.sort_order,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }
}