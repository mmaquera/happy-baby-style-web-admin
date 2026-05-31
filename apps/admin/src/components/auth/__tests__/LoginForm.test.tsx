import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginForm, AuthProvider } from '@happy-baby/feature-auth';
import { LoginUserDocument } from '@happy-baby/infrastructure-graphql';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async importOriginal => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null, pathname: '/login' }),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  // Ensure no stored tokens so AuthProvider doesn't make HTTP calls on init
  (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
});

const mockUser = {
  id: 'user-1',
  email: 'admin@test.com',
  role: 'ADMIN',
  isActive: true,
  emailVerified: true,
  lastLoginAt: '2026-01-01T00:00:00.000Z',
  profile: {
    id: 'profile-1',
    firstName: 'Admin',
    lastName: 'Test',
    phone: null,
    dateOfBirth: null,
    avatar: null,
  },
};

const loginSuccessMock = (
  email = 'admin@test.com',
  password = 'Password123!'
): MockedResponse => ({
  request: {
    query: LoginUserDocument,
    variables: { email, password },
  },
  result: {
    data: {
      loginUser: {
        success: true,
        message: 'Login exitoso',
        code: '200',
        timestamp: '2026-01-01T00:00:00.000Z',
        data: {
          user: mockUser,
          accessToken: 'mock-token',
          refreshToken: 'mock-refresh',
        },
        metadata: {
          requestId: 'req-1',
          traceId: 'trace-1',
          duration: 100,
          timestamp: '2026-01-01T00:00:00.000Z',
        },
      },
    },
  },
});

const loginFailureMock = (
  email = 'wrong@test.com',
  password = 'WrongPass1!'
): MockedResponse => ({
  request: {
    query: LoginUserDocument,
    variables: { email, password },
  },
  result: {
    data: {
      loginUser: {
        success: false,
        message: 'Credenciales inválidas',
        code: '401',
        timestamp: '2026-01-01T00:00:00.000Z',
        data: null,
        metadata: null,
      },
    },
  },
});

const renderLoginForm = (mocks: MockedResponse[] = []) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AuthProvider>
        <MemoryRouter>
          <LoginForm />
          <Toaster />
        </MemoryRouter>
      </AuthProvider>
    </MockedProvider>
  );

const fillAndSubmit = async (
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  password: string
) => {
  const emailInput = screen.getByPlaceholderText('admin@happybabystyle.com');
  const passwordInput = screen.getByPlaceholderText('••••••••');

  await user.click(emailInput);
  await user.type(emailInput, email);
  await user.tab();

  await user.click(passwordInput);
  await user.type(passwordInput, password);
  await user.tab();

  const submitBtn = screen.getByRole('button', { name: /iniciar sesión/i });
  await waitFor(() => expect(submitBtn).not.toBeDisabled());
  await user.click(submitBtn);
};

describe('LoginForm', () => {
  it('renderiza campos de email y contraseña', async () => {
    renderLoginForm();
    // Wait for AuthProvider to initialize
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('admin@happybabystyle.com')
      ).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });

  it('botón submit está deshabilitado con campos vacíos', async () => {
    renderLoginForm();
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /iniciar sesión/i })
      ).toBeDisabled();
    });
  });

  it('toggle de visibilidad de contraseña funciona', async () => {
    const user = userEvent.setup();
    renderLoginForm();
    await waitFor(() => screen.getByPlaceholderText('••••••••'));
    const passwordInput = screen.getByPlaceholderText('••••••••');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByLabelText(/mostrar contraseña/i));
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(screen.getByLabelText(/ocultar contraseña/i));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('navega al home tras login exitoso', async () => {
    const user = userEvent.setup();
    renderLoginForm([loginSuccessMock()]);
    await waitFor(() =>
      screen.getByPlaceholderText('admin@happybabystyle.com')
    );

    await fillAndSubmit(user, 'admin@test.com', 'Password123!');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('muestra alerta de error cuando las credenciales son inválidas', async () => {
    const user = userEvent.setup();
    renderLoginForm([loginFailureMock()]);
    await waitFor(() =>
      screen.getByPlaceholderText('admin@happybabystyle.com')
    );

    await fillAndSubmit(user, 'wrong@test.com', 'WrongPass1!');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('muestra alerta cuando el servidor devuelve error de red', async () => {
    const user = userEvent.setup();
    const errorMock: MockedResponse = {
      request: {
        query: LoginUserDocument,
        variables: { email: 'admin@test.com', password: 'Password123!' },
      },
      error: new Error('Network error'),
    };
    renderLoginForm([errorMock]);
    await waitFor(() =>
      screen.getByPlaceholderText('admin@happybabystyle.com')
    );

    await fillAndSubmit(user, 'admin@test.com', 'Password123!');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('muestra error de validación con email inválido', async () => {
    const user = userEvent.setup();
    renderLoginForm();
    await waitFor(() =>
      screen.getByPlaceholderText('admin@happybabystyle.com')
    );

    const emailInput = screen.getByPlaceholderText('admin@happybabystyle.com');
    await user.click(emailInput);
    await user.type(emailInput, 'notanemail');
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/correo electrónico válido/i)
      ).toBeInTheDocument();
    });
  });
});
