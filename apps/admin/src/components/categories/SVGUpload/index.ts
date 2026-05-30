// =====================================================
// SVG UPLOAD MODULE EXPORTS - Categories Module
// =====================================================
// Following Clean Architecture principles and module organization

// Main component
export { SVGUpload } from './SVGUpload';

// Types
export type {
  SVGUploadProps,
  SVGUploadResult,
  SVGUploadProgress,
  SVGUploadError,
  SVGValidationResult,
  UseSVGUploadReturn,
} from './SVGUpload.types';

// Constants
export { SVG_UPLOAD_DEFAULTS, SVG_VALIDATION_RULES } from './SVGUpload.types';

// Hook
export { useSVGUpload } from '@/hooks/useSVGUpload';
