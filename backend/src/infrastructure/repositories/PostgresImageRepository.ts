import { IImageRepository, ImageFilters } from '@domain/repositories/IImageRepository';
import { ImageEntity, ImageEntityType } from '@domain/entities/Image';
import { PostgresConfig } from '@infrastructure/config/postgres';

export class PostgresImageRepository implements IImageRepository {
  private postgres: PostgresConfig;

  constructor() {
    this.postgres = PostgresConfig.getInstance();
  }

  async create(image: ImageEntity): Promise<ImageEntity> {
    const query = `
      INSERT INTO images (
        file_name, original_name, mime_type, size, url, bucket, path,
        entity_type, entity_id, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *
    `;

    const values = [
      image.fileName,
      image.originalName,
      image.mimeType,
      image.size,
      image.url,
      image.bucket,
      image.path,
      image.entityType,
      image.entityId
    ];

    const result = await this.postgres.query(query, values);
    return this.mapToImageEntity(result.rows[0]);
  }

  async findById(id: string): Promise<ImageEntity | null> {
    const query = 'SELECT * FROM images WHERE id = $1';
    const result = await this.postgres.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToImageEntity(result.rows[0]);
  }

  async findAll(filters?: ImageFilters): Promise<ImageEntity[]> {
    let query = 'SELECT * FROM images';
    const values: any[] = [];
    let whereConditions: string[] = [];
    let paramIndex = 1;

    if (filters?.entityType) {
      whereConditions.push(`entity_type = $${paramIndex}`);
      values.push(filters.entityType);
      paramIndex++;
    }

    if (filters?.entityId) {
      whereConditions.push(`entity_id = $${paramIndex}`);
      values.push(filters.entityId);
      paramIndex++;
    }

    if (filters?.mimeType) {
      whereConditions.push(`mime_type = $${paramIndex}`);
      values.push(filters.mimeType);
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
    return result.rows.map((row: any) => this.mapToImageEntity(row));
  }

  async findByEntityId(entityId: string, entityType: ImageEntityType): Promise<ImageEntity[]> {
    const query = 'SELECT * FROM images WHERE entity_id = $1 AND entity_type = $2 ORDER BY created_at ASC';
    const result = await this.postgres.query(query, [entityId, entityType]);
    
    return result.rows.map((row: any) => this.mapToImageEntity(row));
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM images WHERE id = $1';
    await this.postgres.query(query, [id]);
  }

  async deleteByEntityId(entityId: string, entityType: ImageEntityType): Promise<void> {
    const query = 'DELETE FROM images WHERE entity_id = $1 AND entity_type = $2';
    await this.postgres.query(query, [entityId, entityType]);
  }

  private mapToImageEntity(row: any): ImageEntity {
    return new ImageEntity(
      row.id,
      row.file_name,
      row.original_name,
      row.mime_type,
      row.size,
      row.url,
      row.bucket,
      row.path,
      row.entity_type as ImageEntityType,
      row.entity_id,
      row.created_at
    );
  }
} 