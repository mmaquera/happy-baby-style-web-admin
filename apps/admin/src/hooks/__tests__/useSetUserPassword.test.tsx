import { renderHook, act } from '@testing-library/react';
import { useSetUserPassword } from '@happy-baby/feature-auth';

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
  success: vi.fn(),
  error: vi.fn(),
}));

const mockMutate = vi.fn();

vi.mock('@happy-baby/infrastructure-graphql', () => ({
  useSetUserPasswordMutation: () => [
    mockMutate,
    { loading: false, error: null },
  ],
}));

const mockIsAuthenticated = vi.fn(() => true);

// Mock the actual lib AuthContext so the import inside useSetUserPassword is intercepted
vi.mock('../../../../../libs/features/auth/src/context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: mockIsAuthenticated() }),
}));

import toast from 'react-hot-toast';

const STRONG_PASSWORD = 'Password1!';

describe('useSetUserPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated.mockReturnValue(true);
    mockMutate.mockResolvedValue({
      data: {
        setUserPassword: {
          success: true,
          message: 'Contraseña establecida',
          code: 'OK',
        },
      },
    });
  });

  it('initializes with correct defaults', () => {
    const { result } = renderHook(() => useSetUserPassword());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns false and shows error when not authenticated', async () => {
    mockIsAuthenticated.mockReturnValue(false);
    const { result } = renderHook(() => useSetUserPassword());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.setUserPassword('user-1', STRONG_PASSWORD);
    });

    expect(success).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      'Debes estar autenticado para realizar esta acción'
    );
  });

  describe('password validation', () => {
    it('rejects empty password', async () => {
      const { result } = renderHook(() => useSetUserPassword());

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.setUserPassword('user-1', '');
      });

      expect(success).toBe(false);
      expect(toast.error).toHaveBeenCalled();
    });

    it('rejects short password (< 8 chars)', async () => {
      const { result } = renderHook(() => useSetUserPassword());
      await act(async () => {
        await result.current.setUserPassword('user-1', 'Ab1!');
      });
      expect(result.current.error).toContain('8 caracteres');
    });

    it('rejects password without uppercase', async () => {
      const { result } = renderHook(() => useSetUserPassword());
      await act(async () => {
        await result.current.setUserPassword('user-1', 'password1!');
      });
      expect(result.current.error).toContain('mayúscula');
    });

    it('rejects password without lowercase', async () => {
      const { result } = renderHook(() => useSetUserPassword());
      await act(async () => {
        await result.current.setUserPassword('user-1', 'PASSWORD1!');
      });
      expect(result.current.error).toContain('minúscula');
    });

    it('rejects password without number', async () => {
      const { result } = renderHook(() => useSetUserPassword());
      await act(async () => {
        await result.current.setUserPassword('user-1', 'Password!');
      });
      expect(result.current.error).toContain('número');
    });

    it('rejects password without symbol', async () => {
      const { result } = renderHook(() => useSetUserPassword());
      await act(async () => {
        await result.current.setUserPassword('user-1', 'Password1');
      });
      expect(result.current.error).toContain('símbolo');
    });
  });

  it('calls mutation with correct args on valid password', async () => {
    const { result } = renderHook(() => useSetUserPassword());

    await act(async () => {
      await result.current.setUserPassword('user-1', STRONG_PASSWORD);
    });

    expect(mockMutate).toHaveBeenCalledWith({
      variables: { userId: 'user-1', newPassword: STRONG_PASSWORD },
    });
  });

  it('returns true and shows success toast on success', async () => {
    const { result } = renderHook(() => useSetUserPassword());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.setUserPassword('user-1', STRONG_PASSWORD);
    });

    expect(success).toBe(true);
    expect(toast.success).toHaveBeenCalledWith('Contraseña establecida');
  });

  it('returns false when server responds with success=false', async () => {
    mockMutate.mockResolvedValueOnce({
      data: {
        setUserPassword: {
          success: false,
          message: 'User not found',
          code: 'NOT_FOUND',
        },
      },
    });
    const { result } = renderHook(() => useSetUserPassword());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.setUserPassword('user-1', STRONG_PASSWORD);
    });

    expect(success).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('User not found');
    expect(result.current.error).toContain('User not found');
  });

  it('handles null response from server', async () => {
    mockMutate.mockResolvedValueOnce({ data: { setUserPassword: null } });
    const { result } = renderHook(() => useSetUserPassword());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.setUserPassword('user-1', STRONG_PASSWORD);
    });

    expect(success).toBe(false);
  });

  it('handles thrown error from mutation', async () => {
    mockMutate.mockRejectedValueOnce(new Error('Network error'));
    const { result } = renderHook(() => useSetUserPassword());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.setUserPassword('user-1', STRONG_PASSWORD);
    });

    expect(success).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Network error');
  });

  it('clearError resets error state', async () => {
    const { result } = renderHook(() => useSetUserPassword());
    await act(async () => {
      await result.current.setUserPassword('user-1', 'bad');
    });
    expect(result.current.error).not.toBeNull();

    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });
});
