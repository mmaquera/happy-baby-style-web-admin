import type React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import FileTextIcon from 'lucide-react/dist/esm/icons/file-text';
import XIcon from 'lucide-react/dist/esm/icons/x';
import ImageIcon from 'lucide-react/dist/esm/icons/image';
import { useSVGUpload } from '../hooks/useSVGUpload';
import {
  type SVGUploadProps,
  type SVGUploadResult,
  SVG_UPLOAD_DEFAULTS,
} from '../types/svgUpload';
import {
  SVGUploadContainer,
  SVGUploadZone,
  SVGFileInput,
  SVGUploadContent,
  SVGUploadIcon,
  SVGUploadText,
  SVGUploadSubtext,
  SVGUploadButton,
  SVGProgressBar,
  SVGProgressFill,
  SVGProgressText,
  SVGErrorMessage,
  SVGFileList,
  SVGFileItem,
  SVGFileInfo,
  SVGFileName,
  SVGFileSize,
  SVGRemoveButton,
  SVGPreview,
  SVGPreviewContent,
  SVGPreviewImg,
  SVGPreviewOverlay,
  SVGPreviewActions,
  SVGLoadingSpinner,
  SVGValidationMessage,
  SVGClearButton,
} from './SVGUploadStyles';

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const SVGUpload: React.FC<SVGUploadProps> = ({
  onUploadComplete,
  onUploadError,
  maxSize = SVG_UPLOAD_DEFAULTS.maxSize,
  allowedTypes = SVG_UPLOAD_DEFAULTS.allowedTypes,
  entityType: _entityType = SVG_UPLOAD_DEFAULTS.entityType,
  categoryId: _categoryId,
  disabled = false,
  className,
  placeholder = 'Arrastra tu archivo SVG aquí o haz clic para seleccionar',
  showPreview = SVG_UPLOAD_DEFAULTS.showPreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<SVGUploadResult | null>(
    null
  );
  const [validationMessage, setValidationMessage] = useState<{
    type: 'error' | 'warning' | 'success';
    message: string;
  } | null>(null);

  const {
    uploadSVG,
    validateSVG,
    loading,
    progress,
    error,
    clearError,
    reset,
  } = useSVGUpload();

  useEffect(() => {
    if (error) {
      setValidationMessage({ type: 'error', message: error.message });
    } else {
      setValidationMessage(null);
    }
  }, [error]);

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (disabled) return;
      clearError();
      setValidationMessage(null);

      const validation = validateSVG(file);
      if (!validation.isValid) {
        setValidationMessage({
          type: 'error',
          message: validation.errors.join(', '),
        });
        onUploadError?.(validation.errors.join(', '));
        return;
      }

      if (validation.warnings.length > 0) {
        setValidationMessage({
          type: 'warning',
          message: validation.warnings.join(', '),
        });
      }

      setSelectedFile(file);

      try {
        const result = await uploadSVG(file);
        setUploadResult(result);
        onUploadComplete(result.url);
        setValidationMessage({
          type: 'success',
          message: 'Archivo SVG subido exitosamente',
        });
      } catch (err: unknown) {
        const errMsg =
          err instanceof Error ? err.message : 'Error al subir el archivo';
        setValidationMessage({ type: 'error', message: errMsg });
        onUploadError?.(errMsg);
      }
    },
    [
      disabled,
      validateSVG,
      uploadSVG,
      onUploadComplete,
      onUploadError,
      clearError,
    ]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const svgFile = files.find(
        file =>
          file.name.toLowerCase().endsWith('.svg') ||
          (allowedTypes as string[]).includes(file.type)
      );

      if (svgFile) {
        handleFileSelect(svgFile);
      } else {
        setValidationMessage({
          type: 'error',
          message:
            'Solo se permiten archivos SVG (.svg). Por favor selecciona un archivo SVG válido.',
        });
      }
    },
    [disabled, allowedTypes, handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled) fileInputRef.current?.click();
  }, [disabled]);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setUploadResult(null);
    setValidationMessage(null);
    reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [reset]);

  return (
    <SVGUploadContainer className={className}>
      <SVGUploadZone
        isDragOver={isDragOver}
        hasError={!!error}
        disabled={disabled}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <SVGFileInput
          ref={fileInputRef}
          type='file'
          accept='.svg,image/svg+xml'
          onChange={handleFileInputChange}
          disabled={disabled}
        />

        <SVGUploadContent>
          {loading ? (
            <SVGLoadingSpinner />
          ) : (
            <SVGUploadIcon>
              <ImageIcon />
            </SVGUploadIcon>
          )}

          <SVGUploadText>
            {loading ? 'Subiendo archivo...' : placeholder}
          </SVGUploadText>

          <SVGUploadSubtext>
            Solo archivos SVG • Máximo {formatFileSize(maxSize)} • Sin scripts
            ni elementos inseguros
          </SVGUploadSubtext>

          {!loading ? (
            <SVGUploadButton disabled={disabled}>
              Seleccionar archivo SVG
            </SVGUploadButton>
          ) : null}
        </SVGUploadContent>
      </SVGUploadZone>

      {progress ? (
        <div>
          <SVGProgressBar>
            <SVGProgressFill progress={progress.percentage} />
          </SVGProgressBar>
          <SVGProgressText>
            Subiendo {progress.filename}... {progress.percentage}%
          </SVGProgressText>
        </div>
      ) : null}

      {error ? <SVGErrorMessage>{error.message}</SVGErrorMessage> : null}

      {validationMessage ? (
        <SVGValidationMessage type={validationMessage.type}>
          {validationMessage.message}
        </SVGValidationMessage>
      ) : null}

      {selectedFile ? (
        <SVGFileList>
          <SVGFileItem>
            <SVGFileInfo>
              <FileTextIcon size={16} />
              <div>
                <SVGFileName>{selectedFile.name}</SVGFileName>
                <SVGFileSize>{formatFileSize(selectedFile.size)}</SVGFileSize>
              </div>
            </SVGFileInfo>
            <SVGRemoveButton onClick={handleRemoveFile}>
              <XIcon size={14} />
            </SVGRemoveButton>
          </SVGFileItem>
        </SVGFileList>
      ) : null}

      <div className='mt-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground'>
        <strong>Especificaciones para archivos SVG:</strong>
        <ul className='ml-4 mt-2 list-disc'>
          <li>Formato: SVG (Scalable Vector Graphics)</li>
          <li>Tamaño máximo: {formatFileSize(maxSize)}</li>
          <li>Elementos permitidos: formas, texto, gradientes</li>
          <li>Elementos prohibidos: scripts, iframes, objetos externos</li>
          <li>Optimización: Se aplicará automáticamente</li>
        </ul>
      </div>

      {showPreview && uploadResult ? (
        <SVGPreview>
          <SVGPreviewContent>
            <SVGPreviewImg>
              <img
                src={uploadResult.url}
                alt='Preview'
                className='max-h-full max-w-full'
              />
            </SVGPreviewImg>
          </SVGPreviewContent>
          <SVGPreviewOverlay>
            <SVGPreviewActions>
              <SVGClearButton onClick={handleRemoveFile}>
                <XIcon size={16} />
                Eliminar
              </SVGClearButton>
            </SVGPreviewActions>
          </SVGPreviewOverlay>
        </SVGPreview>
      ) : null}
    </SVGUploadContainer>
  );
};
