import styled from 'styled-components';
import { theme } from '@/styles/theme';

// Contenedor principal del upload
export const UploadContainer = styled.div`
  width: 100%;
  margin-bottom: ${theme.spacing[4]};
`;

// Zona de upload
export const UploadZone = styled.div<{ isDragOver: boolean; hasError: boolean }>`
  border: 2px dashed ${({ isDragOver, hasError }) => 
    hasError ? theme.colors.error : 
    isDragOver ? theme.colors.primary : 
    theme.colors.border.light
  };
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  text-align: center;
  transition: all ${theme.transitions.base};
  background: ${({ isDragOver }) => 
    isDragOver ? theme.colors.background.accent : 'transparent'
  };
  cursor: pointer;
  
  &:hover {
    border-color: ${({ hasError }) => 
      hasError ? theme.colors.error : theme.colors.primary
    };
    background: ${({ hasError }) => 
      hasError ? theme.colors.error + '10' : theme.colors.background.accent
    };
  }
`;

// Input de archivo oculto
export const FileInput = styled.input`
  display: none;
`;

// Contenido de la zona de upload
export const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

// Icono de upload
export const UploadIcon = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 2rem;
  margin-bottom: ${theme.spacing[2]};
`;

// Texto principal del upload
export const UploadText = styled.p`
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.medium};
  margin: 0;
`;

// Texto secundario del upload
export const UploadSubtext = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
  margin: 0;
`;

// Botón de upload
export const UploadButton = styled.button`
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  
  &:hover {
    background: ${theme.colors.primary};
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: ${theme.colors.border.light};
    cursor: not-allowed;
    transform: none;
  }
`;

// Barra de progreso
export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin-top: ${theme.spacing[3]};
`;

export const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: ${theme.colors.primary};
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

// Texto de progreso
export const ProgressText = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
  margin: ${theme.spacing[2]} 0 0 0;
`;

// Mensaje de error
export const ErrorMessage = styled.p`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  margin: ${theme.spacing[2]} 0 0 0;
  text-align: center;
`;

// Lista de archivos seleccionados
export const FileList = styled.div`
  margin-top: ${theme.spacing[4]};
  width: 100%;
`;

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  background: ${theme.colors.background.light};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing[2]};
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

export const FileName = styled.span`
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
`;

export const FileSize = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.xs};
`;

export const RemoveButton = styled.button`
  background: ${theme.colors.error};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  
  &:hover {
    background: ${theme.colors.error};
    opacity: 0.9;
  }
`;

// Estilos para preview de imágenes
export const ImagePreview = styled.div`
  position: relative;
  width: 140px;
  height: 180px;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  background: ${theme.colors.background.light};
  border: 2px solid ${theme.colors.border.light};
  transition: all ${theme.transitions.base};
  flex-shrink: 0;
  
  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const ImagePreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  background: ${theme.colors.background.light};
`;

export const ImagePreviewOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity ${theme.transitions.base};
  
  ${ImagePreview}:hover & {
    opacity: 1;
  }
`;

export const ImagePreviewActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

// Animación para el spinner
export const SpinnerAnimation = styled.div`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
