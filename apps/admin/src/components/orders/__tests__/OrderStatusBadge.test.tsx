import { render, screen } from '@testing-library/react';
import { OrderStatusBadge, STATUS_CONFIG } from '@happy-baby/feature-orders';

describe('OrderStatusBadge', () => {
  const statuses = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ] as const;

  it.each(statuses)('renders label for status "%s"', status => {
    render(<OrderStatusBadge status={status} />);
    expect(screen.getByText(STATUS_CONFIG[status].label)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <OrderStatusBadge status='pending' className='my-custom-class' />
    );
    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('falls back to pending config for unknown status', () => {
    render(
      // @ts-expect-error — testing unknown status fallback
      <OrderStatusBadge status='unknown' />
    );
    expect(screen.getByText(STATUS_CONFIG.pending.label)).toBeInTheDocument();
  });

  it('has the displayName set', () => {
    expect(OrderStatusBadge.displayName).toBe('OrderStatusBadge');
  });

  it('exports STATUS_CONFIG with all 7 statuses', () => {
    expect(Object.keys(STATUS_CONFIG)).toHaveLength(7);
    expect(STATUS_CONFIG.pending.label).toBe('Pendiente');
    expect(STATUS_CONFIG.delivered.label).toBe('Entregado');
  });
});
