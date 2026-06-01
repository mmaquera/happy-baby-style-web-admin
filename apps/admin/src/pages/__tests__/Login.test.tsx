import { render, screen } from '@testing-library/react';
import { Login } from '../Login';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null, pathname: '/login' }),
}));

vi.mock('@happy-baby/infrastructure-monitoring', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  sentryAdapter: { init: vi.fn(), captureException: vi.fn() },
}));

vi.mock('lucide-react/dist/esm/icons/check-circle', () => ({
  default: () => <svg data-testid='check-circle-icon' />,
}));

const mockUseAuth = vi.fn();

vi.mock('@happy-baby/feature-auth', () => ({
  LoginLogo: ({ size }: { size?: string }) => (
    <div data-testid={`login-logo-${size ?? 'md'}`} />
  ),
  LoginForm: () => <div data-testid='login-form' />,
  useAuth: () => mockUseAuth(),
}));

describe('Login', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('renderiza el split layout con hero, logos y form cuando inicializado', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false,
    });
    render(<Login />);

    // Form panel: logo md + login form
    expect(screen.getByTestId('login-logo-md')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();

    // Hero panel: logo lg (DOM renderizado, oculto vía CSS en mobile)
    expect(screen.getByTestId('login-logo-lg')).toBeInTheDocument();

    // Copyright
    expect(
      screen.getByText(/todos los derechos reservados/i)
    ).toBeInTheDocument();
  });

  it('muestra estado inicializando cuando loading y no inicializado', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: false,
      isLoading: true,
    });
    render(<Login />);
    expect(screen.getByText('Inicializando...')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('redirige a "/" cuando ya está autenticado e inicializado', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isInitialized: true,
      isLoading: false,
    });
    render(<Login />);
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
