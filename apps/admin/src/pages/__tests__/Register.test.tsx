import { render, screen, fireEvent } from '@testing-library/react';
import { Register } from '../Register';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null, pathname: '/register' }),
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
  RegisterForm: ({ onSuccess }: { onSuccess?: () => void }) => (
    <div data-testid='register-form'>
      <button onClick={onSuccess}>Submit</button>
    </div>
  ),
  useAuth: () => mockUseAuth(),
}));

describe('Register', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders register form when initialized', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false,
    });
    render(<Register />);
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(screen.getByTestId('login-logo')).toBeInTheDocument();
  });

  it('shows initializing state when loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: false,
      isLoading: true,
    });
    render(<Register />);
    expect(screen.getByText('Inicializando...')).toBeInTheDocument();
    expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
  });

  it('redirects to "/" when already authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isInitialized: true,
      isLoading: false,
    });
    render(<Register />);
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('navigates to /login on registration success', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false,
    });
    render(<Register />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/login',
      expect.objectContaining({
        state: expect.objectContaining({ message: expect.any(String) }),
      })
    );
  });

  it('navigates to /login on "ya tienes cuenta" click', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false,
    });
    render(<Register />);
    fireEvent.click(screen.getByText(/¿Ya tienes una cuenta\? Inicia sesión/));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
