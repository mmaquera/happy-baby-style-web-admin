import type { ProductRepository } from '@happy-baby/domain-product';
import type { Result } from '@happy-baby/domain-shared';
import { err, ValidationError } from '@happy-baby/domain-shared';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export class UploadProductImageUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(file: File, productId: string): Promise<Result<string>> {
    if (!file) {
      return err(new ValidationError('No se seleccionó ningún archivo'));
    }
    if (file.size > MAX_SIZE_BYTES) {
      return err(
        new ValidationError('El archivo es demasiado grande. Máximo 5MB')
      );
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return err(
        new ValidationError(
          'Tipo de archivo no soportado. Solo JPG, PNG y WebP'
        )
      );
    }
    return this.repository.uploadImage(file, productId);
  }
}
