import { render, screen } from '@testing-library/react';
import { LoginLogo } from '../LoginLogo';

describe('LoginLogo', () => {
  it('renderiza el badge con texto "HB" y wordmark "Happy Baby"', () => {
    render(<LoginLogo />);
    expect(screen.getByText('HB')).toBeInTheDocument();
    expect(screen.getByText('Happy Baby')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('size="lg" aplica clase de badge grande (w-16 h-16)', () => {
    const { container } = render(<LoginLogo size='lg' />);
    const badge = container.querySelector('.w-16.h-16');
    expect(badge).toBeInTheDocument();
  });

  it('size="md" aplica clase de badge mediano (w-12 h-12)', () => {
    const { container } = render(<LoginLogo size='md' />);
    const badge = container.querySelector('.w-12.h-12');
    expect(badge).toBeInTheDocument();
  });

  it('sin prop size usa "md" por defecto', () => {
    const { container } = render(<LoginLogo />);
    const badge = container.querySelector('.w-12.h-12');
    expect(badge).toBeInTheDocument();
  });

  it('el badge tiene aria-hidden para no duplicar contenido semántico', () => {
    const { container } = render(<LoginLogo />);
    const badge = container.querySelector('[aria-hidden="true"]');
    expect(badge).toBeInTheDocument();
  });
});
