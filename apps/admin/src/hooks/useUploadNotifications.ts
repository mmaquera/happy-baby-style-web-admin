import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import type { UseUploadNotificationsReturn } from '@/types/upload';

export const useUploadNotifications = (): UseUploadNotificationsReturn => {
  const showSuccess = useCallback((message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: 'white',
        fontWeight: '500',
      },
    });
  }, []);

  const showError = useCallback((message: string) => {
    toast.error(message, {
      duration: 6000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: 'white',
        fontWeight: '500',
      },
    });
  }, []);

  const showProgress = useCallback((progress: number) => {
    return toast.loading(`Subiendo imagen... ${progress}%`, {
      duration: Infinity,
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: 'white',
        fontWeight: '500',
      },
    });
  }, []);

  const dismiss = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    showSuccess,
    showError,
    showProgress,
    dismiss,
  };
};
