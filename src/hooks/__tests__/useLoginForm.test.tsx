import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useLoginForm } from '../useLoginForm';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null, pathname: '/login' }),
  };
});

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockClearAuthError = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoading: false,
    error: null,
    clearError: mockClearAuthError,
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('useLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue(true);
  });

  it('initializes with correct defaults', () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    expect(result.current.showPassword).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('togglePasswordVisibility flips showPassword', () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    act(() => result.current.togglePasswordVisibility());
    expect(result.current.showPassword).toBe(true);

    act(() => result.current.togglePasswordVisibility());
    expect(result.current.showPassword).toBe(false);
  });

  it('clearError clears errors', () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    act(() => result.current.clearError());

    expect(mockClearAuthError).toHaveBeenCalledTimes(1);
  });

  it('onSubmit calls login with form data and navigates on success', async () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    await act(async () => {
      await result.current.onSubmit({ email: 'user@example.com', password: 'password123' });
    });

    expect(mockLogin).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' });
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('onSubmit sets localError when login returns false', async () => {
    mockLogin.mockResolvedValue(false);
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    await act(async () => {
      await result.current.onSubmit({ email: 'user@example.com', password: 'wrongpass' });
    });

    expect(result.current.error).toMatch(/Credenciales incorrectas/);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('onSubmit sets network error message on connection failure', async () => {
    mockLogin.mockRejectedValue(new Error('network connection failed'));
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    await act(async () => {
      await result.current.onSubmit({ email: 'user@example.com', password: 'pass' });
    });

    expect(result.current.error).toMatch(/conexión/i);
  });

  it('onSubmit sets server error message on server failure', async () => {
    mockLogin.mockRejectedValue(new Error('internal server error'));
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    await act(async () => {
      await result.current.onSubmit({ email: 'user@example.com', password: 'pass' });
    });

    expect(result.current.error).toMatch(/servidor/i);
  });

  it('onSubmit sets generic error for unknown failures', async () => {
    mockLogin.mockRejectedValue(new Error('unknown'));
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    await act(async () => {
      await result.current.onSubmit({ email: 'user@example.com', password: 'pass' });
    });

    expect(result.current.error).toBeTruthy();
  });
});
