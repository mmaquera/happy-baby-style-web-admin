// RegisterForm.test.tsx - Following testing standards
// Tests the RegisterForm component functionality

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { RegisterForm } from '../RegisterForm';
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

describe('RegisterForm', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    mockOnSuccess.mockClear();
  });

  it('should render all form fields', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RegisterForm onSuccess={mockOnSuccess} />
      </MockedProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha de nacimiento/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty required fields', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RegisterForm onSuccess={mockOnSuccess} />
      </MockedProvider>
    );

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/apellido es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/contraseña es requerida/i)).toBeInTheDocument();
      expect(screen.getByText(/confirmar contraseña es requerida/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RegisterForm onSuccess={mockOnSuccess} />
      </MockedProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email no válido/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for short password', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RegisterForm onSuccess={mockOnSuccess} />
      </MockedProvider>
    );

    const passwordInput = screen.getByLabelText(/contraseña/i);
    fireEvent.change(passwordInput, { target: { value: '123' } });

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for mismatched passwords', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RegisterForm onSuccess={mockOnSuccess} />
      </MockedProvider>
    );

    const passwordInput = screen.getByLabelText(/contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  it('should submit form successfully with valid data', async () => {
    render(
      <MockedProvider mocks={[mockRegisterUserMutation]} addTypename={false}>
        <RegisterForm onSuccess={mockOnSuccess} />
      </MockedProvider>
    );

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/¡usuario registrado exitosamente!/i)).toBeInTheDocument();
    });

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should handle server errors', async () => {
    render(
      <MockedProvider mocks={[mockErrorMutation]} addTypename={false}>
        <RegisterForm onSuccess={mockOnSuccess} />
      </MockedProvider>
    );

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email ya existe/i)).toBeInTheDocument();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should toggle password visibility', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RegisterForm onSuccess={mockOnSuccess} />
      </MockedProvider>
    );

    const passwordInput = screen.getByLabelText(/contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);

    // Initially should be password type
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Toggle password visibility
    const passwordToggle = screen.getAllByRole('button')[0]; // First toggle button
    const confirmPasswordToggle = screen.getAllByRole('button')[1]; // Second toggle button

    fireEvent.click(passwordToggle);
    fireEvent.click(confirmPasswordToggle);

    // Should now be text type
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  it('should change user role selection', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RegisterForm onSuccess={mockOnSuccess} />
      </MockedProvider>
    );

    // Initially customer role should be selected
    expect(screen.getByText(/cliente/i)).toBeInTheDocument();

    // Click on staff role
    const staffRole = screen.getByText(/staff/i);
    fireEvent.click(staffRole);

    // Staff role should now be selected
    expect(screen.getByText(/staff/i)).toBeInTheDocument();
  });
});
