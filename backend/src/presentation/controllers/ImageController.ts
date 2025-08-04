import { Request, Response } from 'express';
import { UploadImageUseCase } from '@application/use-cases/image/UploadImageUseCase';
import { ImageEntityType } from '@domain/entities/Image';

export class ImageController {
  constructor(
    private readonly uploadImageUseCase: UploadImageUseCase
  ) {}

  async upload(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file provided'
        });
        return;
      }

      const { entityType, entityId } = req.body;

      if (!entityType || !entityId) {
        res.status(400).json({
          success: false,
          message: 'Entity type and entity ID are required'
        });
        return;
      }

      // Validar que entityType sea válido
      if (!Object.values(ImageEntityType).includes(entityType)) {
        res.status(400).json({
          success: false,
          message: 'Invalid entity type'
        });
        return;
      }

      const image = await this.uploadImageUseCase.execute({
        file: req.file,
        entityType: entityType as ImageEntityType,
        entityId
      });

      res.status(201).json({
        success: true,
        data: image,
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to upload image'
      });
    }
  }

  async getByEntity(req: Request, res: Response): Promise<void> {
    try {
      const { entityType, entityId } = req.params;

      if (!Object.values(ImageEntityType).includes(entityType as ImageEntityType)) {
        res.status(400).json({
          success: false,
          message: 'Invalid entity type'
        });
        return;
      }

      // Esta lógica se implementaría con un GetImagesByEntityUseCase
      res.status(501).json({
        success: false,
        message: 'Not implemented yet'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve images'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      // Esta lógica se implementaría con un DeleteImageUseCase
      res.status(501).json({
        success: false,
        message: 'Not implemented yet'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to delete image'
      });
    }
  }
}