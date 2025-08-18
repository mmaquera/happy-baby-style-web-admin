// useRegisterUser.test.ts - Following testing standards
// Tests the useRegisterUser hook functionality

import { renderHook, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useRegisterUser } from '../useRegisterUser';
import { RegisterUserDocument } from '@/generated/graphql';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockRegisterUserMutation = {
  request: {
    query: RegisterUserDocument,
    variables: {
      input: {
        email: 'test@example.com',
        password: 'password123',
        role: 'customer',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        phone: '',
        dateOfBirth: null
      }
    }
  },
  result: {
    data: {
      registerUser: {
        success: true,
        message: 'Usuario registrado exitosamente',
        code: 'SUCCESS',
        timestamp: '2025-01-01T00:00:00Z',
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            role: 'customer',
            isActive: true,
            emailVerified: false,
            lastLoginAt: null,
            profile: {
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              phone: null,
              dateOfBirth: null,
              avatar: null
            }
          },
          accessToken: 'access-token',
          refreshToken: 'refresh-token'
        },
        metadata: {
          requestId: 'req-123',
          traceId: 'trace-123',
          duration: 100,
          timestamp: '2025-01-01T00:00:00Z'
        }
      }
    }
  }
};

const mockErrorMutation = {
  request: {
    query: RegisterUserDocument,
    variables: {
      input: {
        email: 'test@example.com',
        password: 'password123',
        role: 'customer',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        phone: '',
        dateOfBirth: null
      }
    }
  },
  result: {
    data: {
      registerUser: {
        success: false,
        message: 'Email ya existe',
        code: 'EMAIL_EXISTS',
        timestamp: '2025-01-01T00:00:00Z',
        data: null,
        metadata: null
      }
    }
  }
};

describe('useRegisterUser', () => {
  it('should register user successfully', async () => {
    const mocks = [mockRegisterUserMutation];

    const { result } = renderHook(() => useRegisterUser(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      ),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);

    await act(async () => {
      const success = await result.current.register({
        email: 'test@example.com',
        password: 'password123',
        role: 'customer',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        phone: '',
        dateOfBirth: null
      });

      expect(success).toBe(true);
    });
  });

  it('should handle server validation errors', async () => {
    const mocks = [mockErrorMutation];

    const { result } = renderHook(() => useRegisterUser(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      ),
    });

    await act(async () => {
      const success = await result.current.register({
        email: 'test@example.com',
        password: 'password123',
        role: 'customer',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        phone: '',
        dateOfBirth: null
      });

      expect(success).toBe(false);
    });
  });

  it('should validate required fields', async () => {
    const { result } = renderHook(() => useRegisterUser(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[]} addTypename={false}>
          {children}
        </MockedProvider>
      ),
    });

    await act(async () => {
      const success = await result.current.register({
        email: '',
        password: '',
        role: 'customer',
        firstName: '',
        lastName: '',
        isActive: true,
        phone: '',
        dateOfBirth: null
      });

      expect(success).toBe(false);
    });
  });

  it('should clear error when clearError is called', () => {
    const { result } = renderHook(() => useRegisterUser(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[]} addTypename={false}>
          {children}
        </MockedProvider>
      ),
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });
});
