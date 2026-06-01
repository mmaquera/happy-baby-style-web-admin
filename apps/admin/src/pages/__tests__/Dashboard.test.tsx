import React from 'react';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';

function Icon() {
  return null;
}

vi.mock('lucide-react/dist/esm/icons/package', () => ({ default: Icon }));
vi.mock('lucide-react/dist/esm/icons/shopping-cart', () => ({
  default: Icon,
}));
vi.mock('lucide-react/dist/esm/icons/users', () => ({ default: Icon }));
vi.mock('lucide-react/dist/esm/icons/trending-up', () => ({ default: Icon }));
vi.mock('lucide-react/dist/esm/icons/dollar-sign', () => ({ default: Icon }));
vi.mock('lucide-react/dist/esm/icons/alert-triangle', () => ({
  default: Icon,
}));

vi.mock('@happy-baby/shared-utils', () => ({
  cn: (...classes: unknown[]) =>
    (classes as string[]).filter(Boolean).join(' '),
}));

vi.mock('@happy-baby/shared-ui', async () => {
  function Card({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return React.createElement('div', { className }, children);
  }
  Card.Header = function Header({ children }: { children: React.ReactNode }) {
    return React.createElement('div', null, children);
  };
  Card.Title = function Title({ children }: { children: React.ReactNode }) {
    return React.createElement('div', null, children);
  };
  return { Card };
});

vi.mock('@happy-baby/feature-auth', () => ({
  SessionInfo: function SessionInfo() {
    return React.createElement('div', { 'data-testid': 'session-info' });
  },
}));

describe('Dashboard', () => {
  it('renders the dashboard heading', () => {
    render(<Dashboard />);
    expect(
      screen.getByRole('heading', { name: /dashboard/i })
    ).toBeInTheDocument();
  });

  it('renders stats cards', () => {
    render(<Dashboard />);
    expect(screen.getByText('Total Productos')).toBeInTheDocument();
    expect(screen.getByText('Pedidos Activos')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Ingresos')).toBeInTheDocument();
  });

  it('renders recent orders section', () => {
    render(<Dashboard />);
    expect(screen.getByText(/pedidos recientes/i)).toBeInTheDocument();
  });

  it('renders SessionInfo component', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('session-info')).toBeInTheDocument();
  });
});
