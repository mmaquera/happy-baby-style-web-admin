import { renderHook, act } from '@testing-library/react';
import { useRegisterForm } from '@happy-baby/feature-auth';

const mockRegister = vi.fn();
const mockClearError = vi.fn();

// Mock the actual lib file so the import inside useRegisterForm is intercepted
vi.mock('../../../../../libs/features/auth/src/hooks/useRegisterUser', () => ({
  useRegisterUser: () => ({
    register: mockRegister,
    isLoading: false,
    error: null,
    clearError: mockClearError,
  }),
}));

vi.mock('@happy-baby/infrastructure-graphql', () => ({
  UserRole: { customer: 'customer', admin: 'admin', staff: 'staff' },
}));

describe('useRegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRegister.mockResolvedValue(true);
  });

  it('initializes with correct defaults', () => {
    const { result } = renderHook(() => useRegisterForm());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
    expect(result.current.showPassword).toBe(false);
    expect(result.current.showConfirmPassword).toBe(false);
    expect(result.current.role).toBe('customer');
    expect(result.current.isActive).toBe(true);
    expect(result.current.dateOfBirth).toBe('');
  });

  it('togglePassword flips showPassword', () => {
    const { result } = renderHook(() => useRegisterForm());
    act(() => result.current.togglePassword());
    expect(result.current.showPassword).toBe(true);
    act(() => result.current.togglePassword());
    expect(result.current.showPassword).toBe(false);
  });

  it('toggleConfirmPassword flips showConfirmPassword', () => {
    const { result } = renderHook(() => useRegisterForm());
    act(() => result.current.toggleConfirmPassword());
    expect(result.current.showConfirmPassword).toBe(true);
  });

  it('setRole updates role', () => {
    const { result } = renderHook(() => useRegisterForm());
    act(() =>
      result.current.setRole(
        'admin' as Parameters<typeof result.current.setRole>[0]
      )
    );
    expect(result.current.role).toBe('admin');
  });

  it('setIsActive updates isActive', () => {
    const { result } = renderHook(() => useRegisterForm());
    act(() => result.current.setIsActive(false));
    expect(result.current.isActive).toBe(false);
  });

  it('setDateOfBirth updates dateOfBirth', () => {
    const { result } = renderHook(() => useRegisterForm());
    act(() => result.current.setDateOfBirth('1990-01-15'));
    expect(result.current.dateOfBirth).toBe('1990-01-15');
  });

  it('clearError delegates to useRegisterUser.clearError', () => {
    const { result } = renderHook(() => useRegisterForm());
    act(() => result.current.clearError());
    expect(mockClearError).toHaveBeenCalled();
  });

  it('onSubmit exposes form.handleSubmit wrapper', () => {
    const { result } = renderHook(() => useRegisterForm());
    expect(typeof result.current.onSubmit).toBe('function');
  });
});
