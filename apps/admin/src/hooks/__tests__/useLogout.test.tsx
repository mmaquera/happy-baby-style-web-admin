import { renderHook, act } from '@testing-library/react';
import { useLogout } from '../useLogout';

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
  success: vi.fn(),
  error: vi.fn(),
}));

const mockLogout = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

import toast from 'react-hot-toast';

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogout.mockResolvedValue(undefined);
  });

  it('initializes with modal closed and not logging out', () => {
    const { result } = renderHook(() => useLogout());
    expect(result.current.isLogoutModalOpen).toBe(false);
    expect(result.current.isLoggingOut).toBe(false);
  });

  it('openLogoutModal sets isLogoutModalOpen to true', () => {
    const { result } = renderHook(() => useLogout());
    act(() => result.current.openLogoutModal());
    expect(result.current.isLogoutModalOpen).toBe(true);
  });

  it('closeLogoutModal sets isLogoutModalOpen to false when not logging out', () => {
    const { result } = renderHook(() => useLogout());
    act(() => result.current.openLogoutModal());
    act(() => result.current.closeLogoutModal());
    expect(result.current.isLogoutModalOpen).toBe(false);
  });

  it('closeLogoutModal does nothing while logging out', async () => {
    let resolveLogout!: () => void;
    mockLogout.mockReturnValue(
      new Promise<void>(r => {
        resolveLogout = r;
      })
    );

    const { result } = renderHook(() => useLogout());

    act(() => result.current.openLogoutModal());

    act(() => {
      void result.current.handleLogout();
    });

    act(() => result.current.closeLogoutModal());
    expect(result.current.isLogoutModalOpen).toBe(true);

    await act(async () => {
      resolveLogout();
    });
  });

  it('handleLogout calls logout and shows success toast', async () => {
    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith('Sesión cerrada exitosamente');
    expect(result.current.isLoggingOut).toBe(false);
    expect(result.current.isLogoutModalOpen).toBe(false);
  });

  it('handleLogout shows error toast when logout fails', async () => {
    mockLogout.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(toast.error).toHaveBeenCalledWith('Error al cerrar sesión');
    expect(result.current.isLoggingOut).toBe(false);
  });
});
