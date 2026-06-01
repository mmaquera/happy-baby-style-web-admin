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

vi.mock('@happy-baby/shared-ui', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockUseAuth = vi.fn();

vi.mock('@happy-baby/feature-auth', () => ({
  LoginLogo: () => <div data-testid='login-logo' />,
  LoginForm: () => <div data-testid='login-form' />,
  useAuth: () => mockUseAuth(),
}));

describe('Login', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('renders login form when initialized and not loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false,
    });
    render(<Login />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('login-logo')).toBeInTheDocument();
  });

  it('shows initializing state when not initialized and loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: false,
      isLoading: true,
    });
    render(<Login />);
    expect(screen.getByText('Inicializando...')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('redirects to "/" when already authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isInitialized: true,
      isLoading: false,
    });
    render(<Login />);
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('removes invalid token (no dots) from localStorage on mount', () => {
    vi.mocked(localStorage.getItem).mockReturnValueOnce('invalid-no-dots');
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false,
    });
    render(<Login />);
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
  });

  it('does not remove valid JWT format token', () => {
    vi.mocked(localStorage.getItem).mockReturnValueOnce(
      'header.payload.signature'
    );
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false,
    });
    render(<Login />);
    expect(localStorage.removeItem).not.toHaveBeenCalledWith('authToken');
  });
});
