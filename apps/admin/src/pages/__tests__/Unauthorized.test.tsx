import { render, screen, fireEvent } from '@testing-library/react';
import { Unauthorized } from '../Unauthorized';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('lucide-react/dist/esm/icons/shield', () => ({
  default: () => <svg data-testid='shield-icon' />,
}));
vi.mock('lucide-react/dist/esm/icons/arrow-left', () => ({
  default: () => <svg data-testid='arrow-left-icon' />,
}));
vi.mock('lucide-react/dist/esm/icons/home', () => ({
  default: () => <svg data-testid='home-icon' />,
}));

vi.mock('@happy-baby/shared-ui', () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    size?: string;
    icon?: React.ReactNode;
  }) => <button onClick={onClick}>{children}</button>,
}));

describe('Unauthorized', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders 403 heading', () => {
    render(<Unauthorized />);
    expect(screen.getByText('403')).toBeInTheDocument();
  });

  it('renders access denied message', () => {
    render(<Unauthorized />);
    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
  });

  it('renders both navigation buttons', () => {
    render(<Unauthorized />);
    expect(screen.getByRole('button', { name: /volver/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /ir al inicio/i })
    ).toBeInTheDocument();
  });

  it('calls navigate(-1) when Volver is clicked', () => {
    render(<Unauthorized />);
    fireEvent.click(screen.getByRole('button', { name: /volver/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('calls navigate("/") when Ir al Inicio is clicked', () => {
    render(<Unauthorized />);
    fireEvent.click(screen.getByRole('button', { name: /ir al inicio/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('displays current path in error info', () => {
    render(<Unauthorized />);
    expect(screen.getByText(/Error: 403 Forbidden/)).toBeInTheDocument();
  });
});
