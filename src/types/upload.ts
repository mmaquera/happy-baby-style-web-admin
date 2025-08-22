// Tipos para el sistema de upload de imágenes
export interface ImageUploadFormData {
  files: FileList;
}

export interface UploadProgress {
  current: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  imageId?: string;
  message?: string;
  error?: string;
}

export interface ImageUploadProps {
  onUpload?: (result: UploadResult) => void;
  maxFiles?: number;
  maxSize?: number; // en bytes
  allowedTypes?: string[];
  entityId?: string;
  entityType?: string;
  disabled?: boolean;
  className?: string;
}

export interface UseImageUploadReturn {
  upload: (files: FileList, entityId?: string, entityType?: string) => Promise<UploadResult>;
  loading: boolean;
  progress: UploadProgress;
  error: string | null;
  clearError: () => void;
}

export interface UseUploadNotificationsReturn {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showProgress: (progress: number) => void;
  dismiss: () => void;
}
