import { renderHook } from '@testing-library/react';
import { useUploadNotifications } from '../useUploadNotifications';

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(() => 'toast-id'),
    dismiss: vi.fn(),
  },
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(() => 'toast-id'),
    dismiss: vi.fn(),
  },
}));

import { toast } from 'react-hot-toast';

describe('useUploadNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('showSuccess calls toast.success with message', () => {
    const { result } = renderHook(() => useUploadNotifications());
    result.current.showSuccess('Imagen subida');
    expect(toast.success).toHaveBeenCalledWith(
      'Imagen subida',
      expect.objectContaining({ duration: 4000 })
    );
  });

  it('showError calls toast.error with message', () => {
    const { result } = renderHook(() => useUploadNotifications());
    result.current.showError('Error al subir');
    expect(toast.error).toHaveBeenCalledWith(
      'Error al subir',
      expect.objectContaining({ duration: 6000 })
    );
  });

  it('showProgress calls toast.loading with percentage', () => {
    const { result } = renderHook(() => useUploadNotifications());
    result.current.showProgress(50);
    expect(toast.loading).toHaveBeenCalledWith(
      'Subiendo imagen... 50%',
      expect.objectContaining({ duration: Infinity })
    );
  });

  it('showProgress returns toast id', () => {
    const { result } = renderHook(() => useUploadNotifications());
    const id = result.current.showProgress(75);
    expect(id).toBe('toast-id');
  });

  it('dismiss calls toast.dismiss', () => {
    const { result } = renderHook(() => useUploadNotifications());
    result.current.dismiss();
    expect(toast.dismiss).toHaveBeenCalled();
  });
});
