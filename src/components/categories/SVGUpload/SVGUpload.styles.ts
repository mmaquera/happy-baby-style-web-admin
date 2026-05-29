import styled from 'styled-components';
import { theme } from '@/styles/theme';

// =====================================================
// SVG UPLOAD STYLES - Categories Module
// =====================================================
// Following Clean Architecture principles and styled-components best practices
// Specific styles for SVG upload functionality in categories

// Main container for SVG upload
export const SVGUploadContainer = styled.div`
  width: 100%;
  margin-bottom: ${theme.spacing[4]};
`;

// Upload zone with drag and drop functionality
export const SVGUploadZone = styled.div<{
  isDragOver: boolean;
  hasError: boolean;
  disabled: boolean;
}>`
  border: 2px dashed
    ${({ isDragOver, hasError, disabled }) =>
      disabled
        ? theme.colors.border.light
        : hasError
          ? theme.colors.error
          : isDragOver
            ? theme.colors.coralAccent
            : theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  text-align: center;
  transition: all ${theme.transitions.base};
  background: ${({ isDragOver, disabled }) =>
    disabled
      ? theme.colors.background.light
      : isDragOver
        ? theme.colors.background.accent
        : 'transparent'};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${({ hasError, disabled }) =>
      disabled
        ? theme.colors.border.light
        : hasError
          ? theme.colors.error
          : theme.colors.coralAccent};
    background: ${({ hasError, disabled }) =>
      disabled
        ? theme.colors.background.light
        : hasError
          ? `${theme.colors.error}10`
          : theme.colors.background.accent};
  }
`;

// Hidden file input
export const SVGFileInput = styled.input`
  display: none;
`;

// Upload content container
export const SVGUploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

// SVG icon
export const SVGUploadIcon = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 2.5rem;
  margin-bottom: ${theme.spacing[2]};

  svg {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

// Main upload text
export const SVGUploadText = styled.p`
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.medium};
  margin: 0;
`;

// Secondary upload text
export const SVGUploadSubtext = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
  margin: 0;
`;

// Upload button
export const SVGUploadButton = styled.button<{ disabled: boolean }>`
  background: ${({ disabled }) =>
    disabled ? theme.colors.border.light : theme.colors.coralAccent};
  color: ${({ disabled }) =>
    disabled ? theme.colors.text.secondary : 'white'};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all ${theme.transitions.base};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover {
    background: ${({ disabled }) =>
      disabled ? theme.colors.border.light : theme.colors.coralAccent};
    opacity: ${({ disabled }) => (disabled ? 0.6 : 0.9)};
    transform: ${({ disabled }) => (disabled ? 'none' : 'translateY(-1px)')};
  }
`;

// Progress bar container
export const SVGProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin-top: ${theme.spacing[3]};
`;

// Progress bar fill
export const SVGProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: ${theme.colors.coralAccent};
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

// Progress text
export const SVGProgressText = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
  margin: ${theme.spacing[2]} 0 0 0;
`;

// Error message
export const SVGErrorMessage = styled.p`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  margin: ${theme.spacing[2]} 0 0 0;
  text-align: center;
`;

// File list container
export const SVGFileList = styled.div`
  margin-top: ${theme.spacing[4]};
  width: 100%;
`;

// File item
export const SVGFileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  background: ${theme.colors.background.light};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing[2]};
  border: 1px solid ${theme.colors.border.light};
`;

// File info
export const SVGFileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

// File name
export const SVGFileName = styled.span`
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
`;

// File size
export const SVGFileSize = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.xs};
`;

// Remove button
export const SVGRemoveButton = styled.button`
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

// SVG preview container
export const SVGPreview = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  background: ${theme.colors.background.light};
  border: 2px solid ${theme.colors.border.light};
  transition: all ${theme.transitions.base};
  flex-shrink: 0;
  margin: ${theme.spacing[4]} auto;

  &:hover {
    border-color: ${theme.colors.coralAccent};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// SVG preview content
export const SVGPreviewContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.background.light};
`;

// SVG preview image
export const SVGPreviewImg = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
`;

// Preview overlay
export const SVGPreviewOverlay = styled.div`
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

  ${SVGPreview}:hover & {
    opacity: 1;
  }
`;

// Preview actions
export const SVGPreviewActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

// Loading spinner
export const SVGLoadingSpinner = styled.div`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  animation: spin 1s linear infinite;
  width: 2rem;
  height: 2rem;
  border: 2px solid ${theme.colors.border.light};
  border-top: 2px solid ${theme.colors.coralAccent};
  border-radius: 50%;
`;

// Validation message
export const SVGValidationMessage = styled.div<{
  type: 'error' | 'warning' | 'success';
}>`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  margin-top: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};

  ${({ type }) => {
    switch (type) {
      case 'error':
        return `
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
          border: 1px solid ${theme.colors.error}40;
        `;
      case 'warning':
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
          border: 1px solid ${theme.colors.warning}40;
        `;
      case 'success':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
          border: 1px solid ${theme.colors.success}40;
        `;
      default:
        return '';
    }
  }}
`;

// Clear button
export const SVGClearButton = styled.button`
  background: transparent;
  color: ${theme.colors.text.secondary};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.background.light};
    border-color: ${theme.colors.text.secondary};
  }
`;
