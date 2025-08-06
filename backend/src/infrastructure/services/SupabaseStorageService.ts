import { SupabaseClient } from '@supabase/supabase-js';
import { IStorageService } from '@domain/repositories/IImageRepository';
import { Multer } from 'multer';

export class SupabaseStorageService implements IStorageService {
  private readonly bucketName = 'images';

  constructor(private readonly supabase: SupabaseClient) {}

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    try {
      // Asegurar que el bucket existe
      await this.ensureBucketExists();

      // Subir archivo
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(path, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Obtener URL pública
      return this.getPublicUrl(path);
    } catch (error) {
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteFile(path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .remove([path]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  getPublicUrl(path: string): string {
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      // Verificar si el bucket existe
      const { data: buckets, error: listError } = await this.supabase.storage.listBuckets();
      
      if (listError) {
        throw new Error(`Failed to list buckets: ${listError.message}`);
      }

      const bucketExists = buckets?.some(bucket => bucket.name === this.bucketName);

      if (!bucketExists) {
        // Crear bucket si no existe
        const { error: createError } = await this.supabase.storage.createBucket(this.bucketName, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 5 * 1024 * 1024 // 5MB
        });

        if (createError) {
          throw new Error(`Failed to create bucket: ${createError.message}`);
        }
      }
    } catch (error) {
      // Si falla la creación, probablemente ya existe o no tenemos permisos
      // En producción, el bucket debería estar pre-creado
      console.warn('Bucket check/creation failed:', error);
    }
  }
}