import { SupabaseClient } from '@supabase/supabase-js';
import { ImageEntity, ImageEntityType } from '@domain/entities/Image';
import { IImageRepository, ImageFilters } from '@domain/repositories/IImageRepository';

export class SupabaseImageRepository implements IImageRepository {
  private readonly tableName = 'images';

  constructor(private readonly supabase: SupabaseClient) {}

  async create(image: ImageEntity): Promise<ImageEntity> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(this.toSupabaseFormat(image))
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create image: ${error.message}`);
    }

    return this.toDomainEntity(data);
  }

  async findById(id: string): Promise<ImageEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to find image: ${error.message}`);
    }

    return this.toDomainEntity(data);
  }

  async findAll(filters: ImageFilters = {}): Promise<ImageEntity[]> {
    let query = this.supabase
      .from(this.tableName)
      .select('*');

    // Aplicar filtros
    if (filters.entityType) {
      query = query.eq('entity_type', filters.entityType);
    }
    if (filters.entityId) {
      query = query.eq('entity_id', filters.entityId);
    }
    if (filters.mimeType) {
      query = query.eq('mime_type', filters.mimeType);
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
      throw new Error(`Failed to fetch images: ${error.message}`);
    }

    return data.map(item => this.toDomainEntity(item));
  }

  async findByEntityId(entityId: string, entityType: ImageEntityType): Promise<ImageEntity[]> {
    return this.findAll({ entityId, entityType });
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  async deleteByEntityId(entityId: string, entityType: ImageEntityType): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('entity_id', entityId)
      .eq('entity_type', entityType);

    if (error) {
      throw new Error(`Failed to delete images by entity: ${error.message}`);
    }
  }

  private toSupabaseFormat(image: ImageEntity): any {
    return {
      id: image.id,
      file_name: image.fileName,
      original_name: image.originalName,
      mime_type: image.mimeType,
      size: image.size,
      url: image.url,
      bucket: image.bucket,
      path: image.path,
      entity_type: image.entityType,
      entity_id: image.entityId,
      created_at: image.createdAt.toISOString()
    };
  }

  private toDomainEntity(data: any): ImageEntity {
    return new ImageEntity(
      data.id,
      data.file_name,
      data.original_name,
      data.mime_type,
      data.size,
      data.url,
      data.bucket,
      data.path,
      data.entity_type,
      data.entity_id,
      new Date(data.created_at)
    );
  }
}