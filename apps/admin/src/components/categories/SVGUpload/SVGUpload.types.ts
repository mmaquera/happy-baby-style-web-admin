// =====================================================
// SVG UPLOAD TYPES - Categories Module
// =====================================================
// Following Clean Architecture principles and TypeScript best practices
// Specific types for SVG upload functionality in categories

// Props interface for SVGUpload component
export interface SVGUploadProps {
  onUploadComplete: (svgUrl: string) => void;
  onUploadError?: (error: string) => void;
  maxSize?: number; // Maximum file size in bytes (default: 500KB for SVG)
  allowedTypes?: string[]; // Allowed MIME types (default: ['image/svg+xml'])
  entityType: 'category'; // Specific to categories module
  categoryId?: string; // Category context for upload
  disabled?: boolean; // Disable upload functionality
  className?: string; // Additional CSS classes
  placeholder?: string; // Custom placeholder text
  showPreview?: boolean; // Show SVG preview after upload
}

// Result interface for successful SVG upload
export interface SVGUploadResult {
  url: string;
  filename: string;
  size: number;
  categoryId: string;
  optimized: boolean;
  uploadedAt: string;
}

// Progress interface for upload tracking
export interface SVGUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  filename: string;
}

// Error interface for upload errors
export interface SVGUploadError {
  code: string;
  message: string;
  filename?: string;
  details?: unknown;
}

// Validation result interface
export interface SVGValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fileInfo: {
    size: number;
    type: string;
    name: string;
  };
}

// Hook return interface
export interface UseSVGUploadReturn {
  uploadSVG: (file: File) => Promise<SVGUploadResult>;
  validateSVG: (file: File) => SVGValidationResult;
  optimizeSVG: (svgContent: string) => string;
  loading: boolean;
  progress: SVGUploadProgress | null;
  error: SVGUploadError | null;
  clearError: () => void;
  reset: () => void;
}

// Default configuration for SVG uploads
export const SVG_UPLOAD_DEFAULTS = {
  maxSize: 500000, // 500KB
  allowedTypes: ['image/svg+xml'],
  entityType: 'category' as const,
  showPreview: true,
} as const;

// SVG validation rules
export const SVG_VALIDATION_RULES = {
  maxSize: 500000, // 500KB
  minSize: 100, // 100 bytes minimum
  allowedTypes: ['image/svg+xml', 'image/svg', 'application/xml', 'text/xml'],
  allowedExtensions: ['.svg'],
  maxDimensions: 2000, // Maximum width/height in pixels
  minDimensions: 16, // Minimum width/height in pixels
  // SVG-specific validation
  requiredElements: ['svg'],
  forbiddenElements: ['script', 'iframe', 'object', 'embed'],
} as const;
