import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useUploadNotifications } from '@/hooks/useUploadNotifications';
import type { ImageUploadProps, ImageUploadFormData, UploadResult } from '@/types/upload';
import {
  UploadContainer,
  UploadZone,
  FileInput,
  UploadContent,
  UploadIcon,
  UploadText,
  UploadSubtext,
  ProgressBar,
  ProgressFill,
  ProgressText,
  ErrorMessage,
  FileList,
  FileItem,
  FileInfo,
  FileName,
  FileSize,
  RemoveButton,
  ImagePreview,
  ImagePreviewImg,
  ImagePreviewOverlay,
  ImagePreviewActions,
} from './ImageUpload.styles';

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB por defecto
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  entityId,
  entityType = 'product',
  disabled = false,
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { upload, loading, progress, error, clearError } = useImageUpload();
  const { showSuccess, showError, showProgress, dismiss } = useUploadNotifications();
  
  const {
    register,
    formState: { errors },
    setValue,
  } = useForm<ImageUploadFormData>();

  // Función para validar archivos
  const validateFiles = useCallback((files: FileList): { valid: File[]; invalid: string[] } => {
    const valid: File[] = [];
    const invalid: string[] = [];
    
    // Calcular el total de archivos ya seleccionados y subidos
    const totalExistingFiles = selectedFiles.length + uploadedImages.length;
    
    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        invalid.push(`${file.name} (demasiado grande)`);
      } else if (!allowedTypes.includes(file.type)) {
        invalid.push(`${file.name} (tipo no soportado)`);
      } else if (totalExistingFiles + valid.length >= maxFiles) {
        invalid.push(`${file.name} (límite de archivos alcanzado: ${totalExistingFiles}/${maxFiles})`);
      } else {
        valid.push(file);
      }
    });
    
    return { valid, invalid };
  }, [maxSize, allowedTypes, maxFiles, selectedFiles.length, uploadedImages.length]);

  // Función para crear URL temporal para preview
  const createPreviewUrl = useCallback((file: File): string => {
    return URL.createObjectURL(file);
  }, []);

  // Función para manejar selección de archivos con upload automático
  const handleFileSelect = useCallback(async (files: FileList) => {
    const { valid, invalid } = validateFiles(files);
    
    if (invalid.length > 0) {
      showError(`Archivos inválidos: ${invalid.join(', ')}`);
    }
    
    if (valid.length > 0) {
      // Agregar archivos seleccionados para preview inmediato
      setSelectedFiles(prev => [...prev, ...valid]);
      
      // Iniciar upload automático
      setIsUploading(true);
      
      try {
        const result = await upload(files, entityId, entityType);
        
        if (result.success) {
          showSuccess(`Imagen subida exitosamente`);
          
          // Agregar a la lista de imágenes subidas
          setUploadedImages(prev => [...prev, result]);
          
          // Notificar al componente padre
          onUpload?.(result);
          
          // Limpiar archivos seleccionados después del upload exitoso
          setSelectedFiles([]);
        } else {
          showError(result.error || 'Error al subir la imagen');
        }
      } catch (err: any) {
        showError(`Error inesperado: ${err.message}`);
      } finally {
        setIsUploading(false);
      }
    }
  }, [validateFiles, upload, onUpload, showSuccess, showError]);

  // Función para manejar drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  // Función para abrir selector de archivos
  const handleZoneClick = useCallback(() => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, isUploading]);

  // Función para remover imagen subida
  const removeUploadedImage = useCallback((index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Función para formatear tamaño de archivo
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Función para manejar cambio en input de archivos
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
      // Resetear el input para permitir seleccionar la misma imagen nuevamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [handleFileSelect]);

  // Limpiar URLs temporales al desmontar
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        URL.revokeObjectURL(createPreviewUrl(file));
      });
    };
  }, [selectedFiles, createPreviewUrl]);

  return (
    <UploadContainer className={className}>
      <UploadZone
        isDragOver={isDragOver}
        hasError={!!error}
        onClick={handleZoneClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}
      >
        <FileInput
          {...register('files')}
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleFileChange}
          disabled={disabled || isUploading}
        />
        
        <UploadContent>
          <UploadIcon>
            {isUploading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', border: '2px solid #e2e8f0', borderTop: '2px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Subiendo...
              </div>
            ) : (
              <ImageIcon size={32} />
            )}
          </UploadIcon>
          
          <UploadText>
            {isUploading 
              ? 'Subiendo imágenes...' 
              : isDragOver 
                ? 'Suelta los archivos aquí' 
                : 'Haz clic para seleccionar o arrastra archivos'
            }
          </UploadText>
          
          <UploadSubtext>
            Tipos permitidos: {allowedTypes.map(type => type.split('/')[1]?.toUpperCase() || type).join(', ')} | 
            Máximo: {formatFileSize(maxSize)} | 
            Archivos: {uploadedImages.length + selectedFiles.length}/{maxFiles}
          </UploadSubtext>
        </UploadContent>
      </UploadZone>

      {/* Barra de progreso minimalista */}
      {isUploading && progress.total > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '4px'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              height: '100%',
              width: `${progress.percentage}%`,
              transition: 'width 0.3s ease',
              borderRadius: '4px'
            }} />
          </div>
          <div style={{
            marginTop: '8px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#64748b',
            fontWeight: '500'
          }}>
            Subiendo imagen... {progress.percentage}%
          </div>
        </div>
      )}

      {/* Preview único minimalista */}
      {(selectedFiles.length > 0 || uploadedImages.length > 0) && (
        <div style={{ marginTop: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b' }}>
            Vista previa
          </h4>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
          }}>
            {/* Mostrar archivos seleccionados (placeholder) */}
            {selectedFiles.map((file, index) => (
              <ImagePreview key={`temp-${index}`}>
                <ImagePreviewImg src={createPreviewUrl(file)} alt={`Preview ${file.name}`} />
                <ImagePreviewOverlay>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    textAlign: 'center',
                    padding: '8px'
                  }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Upload size={20} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '500' }}>
                      Subiendo...
                    </span>
                    <span style={{ fontSize: '10px', opacity: 0.8, marginTop: '4px' }}>
                      {file.name}
                    </span>
                  </div>
                </ImagePreviewOverlay>
              </ImagePreview>
            ))}
            
            {/* Mostrar imágenes subidas exitosamente */}
            {uploadedImages.map((image, index) => (
              <ImagePreview key={`uploaded-${index}`}>
                <ImagePreviewImg src={image.url || ''} alt={`Imagen ${index + 1}`} />
                <ImagePreviewOverlay>
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => removeUploadedImage(index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 1)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  >
                    <X size={14} />
                  </div>
                </ImagePreviewOverlay>
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  background: 'rgba(34, 197, 94, 0.9)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '600',
                  backdropFilter: 'blur(4px)'
                }}>
                  ✓ Subida
                </div>
              </ImagePreview>
            ))}
          </div>
        </div>
      )}

      {/* Mensajes de error */}
      {errors.files && (
        <ErrorMessage>{errors.files.message}</ErrorMessage>
      )}
      
      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
    </UploadContainer>
  );
};
