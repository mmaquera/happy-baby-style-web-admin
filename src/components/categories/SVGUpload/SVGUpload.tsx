// =====================================================
// SVG UPLOAD COMPONENT - Categories Module
// =====================================================
// Following Clean Architecture principles and React best practices
// Specific component for SVG upload functionality in categories

import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { theme } from '@/styles/theme';
import { useSVGUpload } from '@/hooks/useSVGUpload';
import { SVGUploadProps, SVGUploadResult, SVG_UPLOAD_DEFAULTS } from './SVGUpload.types';
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
} from './SVGUpload.styles';

export const SVGUpload: React.FC<SVGUploadProps> = ({
  onUploadComplete,
  onUploadError,
  maxSize = SVG_UPLOAD_DEFAULTS.maxSize,
  allowedTypes = SVG_UPLOAD_DEFAULTS.allowedTypes,
  entityType = SVG_UPLOAD_DEFAULTS.entityType,
  categoryId,
  disabled = false,
  className,
  placeholder = 'Arrastra tu archivo SVG aquí o haz clic para seleccionar',
  showPreview = SVG_UPLOAD_DEFAULTS.showPreview,
}) => {
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<SVGUploadResult | null>(null);
  const [validationMessage, setValidationMessage] = useState<{
    type: 'error' | 'warning' | 'success';
    message: string;
  } | null>(null);

  // Custom hook
  const {
    uploadSVG,
    validateSVG,
    loading,
    progress,
    error,
    clearError,
    reset,
  } = useSVGUpload();

  // Clear validation message when error changes
  useEffect(() => {
    if (error) {
      setValidationMessage({
        type: 'error',
        message: error.message,
      });
    } else {
      setValidationMessage(null);
    }
  }, [error]);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    if (disabled) return;

    // Clear previous state
    clearError();
    setValidationMessage(null);

    // Validate file
    const validation = validateSVG(file);
    
    if (!validation.isValid) {
      setValidationMessage({
        type: 'error',
        message: validation.errors.join(', '),
      });
      onUploadError?.(validation.errors.join(', '));
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      setValidationMessage({
        type: 'warning',
        message: validation.warnings.join(', '),
      });
    }

    setSelectedFile(file);

    try {
      // Upload file
      const result = await uploadSVG(file);
      setUploadResult(result);
      
      // Notify parent component
      onUploadComplete(result.url);
      
      // Show success message
      setValidationMessage({
        type: 'success',
        message: 'Archivo SVG subido exitosamente',
      });
    } catch (err: any) {
      setValidationMessage({
        type: 'error',
        message: err.message || 'Error al subir el archivo',
      });
      onUploadError?.(err.message || 'Error al subir el archivo');
    }
  }, [disabled, validateSVG, uploadSVG, onUploadComplete, onUploadError, clearError]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const svgFile = files.find(file => 
      file.name.toLowerCase().endsWith('.svg') || 
      allowedTypes.includes(file.type as any)
    );

    if (svgFile) {
      handleFileSelect(svgFile);
    } else {
      setValidationMessage({
        type: 'error',
        message: 'Solo se permiten archivos SVG (.svg). Por favor selecciona un archivo SVG válido.',
      });
    }
  }, [disabled, allowedTypes, handleFileSelect]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Handle click to select file
  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  // Handle remove file
  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setUploadResult(null);
    setValidationMessage(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [reset]);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

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
          type="file"
          accept=".svg,image/svg+xml"
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
            Solo archivos SVG • Máximo {formatFileSize(maxSize)} • Sin scripts ni elementos inseguros
          </SVGUploadSubtext>
          
          {!loading && (
            <SVGUploadButton disabled={disabled}>
              Seleccionar archivo SVG
            </SVGUploadButton>
          )}
        </SVGUploadContent>
      </SVGUploadZone>

      {/* Progress Bar */}
      {progress && (
        <div>
          <SVGProgressBar>
            <SVGProgressFill progress={progress.percentage} />
          </SVGProgressBar>
          <SVGProgressText>
            Subiendo {progress.filename}... {progress.percentage}%
          </SVGProgressText>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <SVGErrorMessage>
          {error.message}
        </SVGErrorMessage>
      )}

      {/* Validation Message */}
      {validationMessage && (
        <SVGValidationMessage type={validationMessage.type}>
          {validationMessage.message}
        </SVGValidationMessage>
      )}

      {/* File List */}
      {selectedFile && (
        <SVGFileList>
          <SVGFileItem>
            <SVGFileInfo>
              <FileText size={16} />
              <div>
                <SVGFileName>{selectedFile.name}</SVGFileName>
                <SVGFileSize>{formatFileSize(selectedFile.size)}</SVGFileSize>
              </div>
            </SVGFileInfo>
            <SVGRemoveButton onClick={handleRemoveFile}>
              <X size={14} />
            </SVGRemoveButton>
          </SVGFileItem>
        </SVGFileList>
      )}

      {/* SVG Specifications Info */}
      <div style={{ 
        marginTop: theme.spacing[4], 
        padding: theme.spacing[3], 
        background: theme.colors.background.light,
        borderRadius: theme.borderRadius.md,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.text.secondary
      }}>
        <strong>Especificaciones para archivos SVG:</strong>
        <ul style={{ margin: `${theme.spacing[2]} 0 0 0`, paddingLeft: theme.spacing[4] }}>
          <li>Formato: SVG (Scalable Vector Graphics)</li>
          <li>Tamaño máximo: {formatFileSize(maxSize)}</li>
          <li>Elementos permitidos: formas, texto, gradientes</li>
          <li>Elementos prohibidos: scripts, iframes, objetos externos</li>
          <li>Optimización: Se aplicará automáticamente</li>
        </ul>
      </div>

      {/* SVG Preview */}
      {showPreview && uploadResult && (
        <SVGPreview>
          <SVGPreviewContent>
            <SVGPreviewImg>
              <img 
                src={uploadResult.url} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </SVGPreviewImg>
          </SVGPreviewContent>
          <SVGPreviewOverlay>
            <SVGPreviewActions>
              <SVGClearButton onClick={handleRemoveFile}>
                <X size={16} />
                Eliminar
              </SVGClearButton>
            </SVGPreviewActions>
          </SVGPreviewOverlay>
        </SVGPreview>
      )}
    </SVGUploadContainer>
  );
};
