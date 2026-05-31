import { renderHook, act } from '@testing-library/react';
import { useForgotPassword } from '@happy-baby/feature-auth';

vi.useFakeTimers();

describe('useForgotPassword', () => {
  afterEach(() => {
    vi.clearAllTimers();
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useForgotPassword());
    expect(result.current.email).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('setEmail updates email and clears error', () => {
    const { result } = renderHook(() => useForgotPassword());

    act(() => result.current.setEmail('user@example.com'));

    expect(result.current.email).toBe('user@example.com');
    expect(result.current.error).toBe('');
  });

  it('clearError clears the error message', async () => {
    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      await result.current.submitForm('');
    });
    expect(result.current.error).not.toBe('');

    act(() => result.current.clearError());

    expect(result.current.error).toBe('');
  });

  it('resetState restores initial state', async () => {
    const { result } = renderHook(() => useForgotPassword());

    act(() => result.current.setEmail('user@example.com'));
    act(() => result.current.resetState());

    expect(result.current.email).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe('');
  });

  describe('submitForm', () => {
    it('sets error when email is empty', async () => {
      const { result } = renderHook(() => useForgotPassword());

      await act(async () => {
        await result.current.submitForm('');
      });

      expect(result.current.error).toBe(
        'Por favor ingresa tu correo electrónico'
      );
      expect(result.current.isLoading).toBe(false);
    });

    it('sets error when email is whitespace', async () => {
      const { result } = renderHook(() => useForgotPassword());

      await act(async () => {
        await result.current.submitForm('   ');
      });

      expect(result.current.error).toBe(
        'Por favor ingresa tu correo electrónico'
      );
    });

    it('sets error when email format is invalid', async () => {
      const { result } = renderHook(() => useForgotPassword());

      await act(async () => {
        await result.current.submitForm('not-an-email');
      });

      expect(result.current.error).toBe(
        'Por favor ingresa un correo electrónico válido'
      );
      expect(result.current.isLoading).toBe(false);
    });

    it('sets isLoading true while submitting', async () => {
      const { result } = renderHook(() => useForgotPassword());

      act(() => {
        void result.current.submitForm('user@example.com');
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe('');

      await act(async () => {
        vi.runAllTimers();
      });
    });

    it('sets isSuccess after successful submission', async () => {
      const { result } = renderHook(() => useForgotPassword());

      await act(async () => {
        const promise = result.current.submitForm('user@example.com');
        vi.runAllTimers();
        await promise;
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
