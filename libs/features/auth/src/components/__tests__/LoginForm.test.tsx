import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';

vi.mock('lucide-react/dist/esm/icons/eye', () => ({ default: () => <svg /> }));
vi.mock('lucide-react/dist/esm/icons/eye-off', () => ({
  default: () => <svg />,
}));
vi.mock('lucide-react/dist/esm/icons/lock', () => ({ default: () => <svg /> }));
vi.mock('lucide-react/dist/esm/icons/mail', () => ({ default: () => <svg /> }));
vi.mock('lucide-react/dist/esm/icons/alert-circle', () => ({
  default: () => <svg />,
}));
vi.mock('lucide-react/dist/esm/icons/refresh-cw', () => ({
  default: () => <svg />,
}));

vi.mock('@happy-baby/shared-ui', () => ({
  Button: ({
    children,
    onClick,
    type,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'submit' | 'button' | 'reset';
    disabled?: boolean;
  }) => (
    <button type={type ?? 'button'} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Input: ({
    label,
    error,
    rightIconClickable,
    onRightIconClick,
    rightIconAriaLabel,
    rightIcon,
    name,
    ...props
  }: {
    label?: string;
    error?: string;
    name?: string;
    rightIcon?: React.ReactNode;
    rightIconClickable?: boolean;
    onRightIconClick?: () => void;
    rightIconAriaLabel?: string;
    [key: string]: unknown;
  }) => (
    <div>
      {label ? <label htmlFor={name}>{label}</label> : null}
      <input id={name} aria-label={label} name={name} {...props} />
      {rightIconClickable && onRightIconClick ? (
        <button
          type='button'
          aria-label={rightIconAriaLabel}
          onClick={onRightIconClick}
        >
          {rightIcon}
        </button>
      ) : null}
      {error ? <span role='alert'>{error}</span> : null}
    </div>
  ),
}));

const mockOnSubmit = vi.fn();
const mockTogglePasswordVisibility = vi.fn();
const mockClearError = vi.fn();

const mockUseLoginForm = vi.fn();

vi.mock('../../hooks/useLoginForm', () => ({
  useLoginForm: () => mockUseLoginForm(),
}));

vi.mock('../ForgotPasswordModal', () => ({
  ForgotPasswordModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid='forgot-modal' /> : null,
}));

const buildForm = () => ({
  register: vi.fn((name: string) => ({ name })),
  handleSubmit: vi.fn(fn => (e: React.FormEvent) => {
    e.preventDefault();
    return fn({ email: 'test@test.com', password: '123456' });
  }),
  formState: {
    errors: {},
    isValid: true,
  },
  watch: vi.fn(() => ''),
  clearErrors: vi.fn(),
});

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLoginForm.mockReturnValue({
      form: buildForm(),
      isLoading: false,
      error: null,
      showPassword: false,
      onSubmit: mockOnSubmit,
      togglePasswordVisibility: mockTogglePasswordVisibility,
      clearError: mockClearError,
    });
  });

  it('renderiza el título como heading y el subtítulo', () => {
    render(<LoginForm />);
    expect(
      screen.getByRole('heading', { name: 'Iniciar Sesión' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Ingresa tus credenciales para acceder al panel.')
    ).toBeInTheDocument();
  });

  it('muestra los campos de email y contraseña', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
  });

  it('muestra el error del servidor cuando existe', () => {
    mockUseLoginForm.mockReturnValue({
      form: buildForm(),
      isLoading: false,
      error: 'Credenciales incorrectas',
      showPassword: false,
      onSubmit: mockOnSubmit,
      togglePasswordVisibility: mockTogglePasswordVisibility,
      clearError: mockClearError,
    });
    render(<LoginForm />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
  });

  it('el botón Reintentar invoca clearError', async () => {
    const user = userEvent.setup();
    mockUseLoginForm.mockReturnValue({
      form: buildForm(),
      isLoading: false,
      error: 'Error de autenticación',
      showPassword: false,
      onSubmit: mockOnSubmit,
      togglePasswordVisibility: mockTogglePasswordVisibility,
      clearError: mockClearError,
    });
    render(<LoginForm />);
    await user.click(screen.getByText('Reintentar'));
    expect(mockClearError).toHaveBeenCalled();
  });

  it('el botón de toggle de contraseña invoca togglePasswordVisibility', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(
      screen.getByRole('button', { name: 'Mostrar contraseña' })
    );
    expect(mockTogglePasswordVisibility).toHaveBeenCalled();
  });
});
