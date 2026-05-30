import { renderHook, act } from '@testing-library/react';
import { useOrderActions } from '../useOrderActions';
import { ok, err, DomainError } from '@/core/shared/Result';
import type { Order } from '@/core/domain/order/Order';

vi.mock('react-hot-toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  success: vi.fn(),
  error: vi.fn(),
}));

const mockListExecute = vi.fn();
const mockUpdateStatusExecute = vi.fn();
const mockCancelExecute = vi.fn();
const mockGetExecute = vi.fn();

vi.mock('@/app/di/orders', () => ({
  useOrderUseCases: () => ({
    list: { execute: mockListExecute },
    updateStatus: { execute: mockUpdateStatusExecute },
    cancel: { execute: mockCancelExecute },
    get: { execute: mockGetExecute },
  }),
}));

import { toast } from 'react-hot-toast';

const makeOrder = (
  id = 'order-1',
  status: Order['status'] = 'pending'
): Order => ({
  id,
  orderNumber: `ORD-${id}`,
  status,
  subtotal: 100,
  taxAmount: 18,
  shippingAmount: 10,
  totalAmount: 128,
  notes: null,
  customer: null,
  items: [],
  shippingAddress: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
});

describe('useOrderActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListExecute.mockResolvedValue(
      ok({ items: [], total: 0, hasMore: false })
    );
    mockUpdateStatusExecute.mockResolvedValue(
      ok(makeOrder('order-1', 'confirmed'))
    );
    mockCancelExecute.mockResolvedValue(ok(makeOrder('order-1', 'cancelled')));
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useOrderActions());
    expect(result.current.orders).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe('loadOrders', () => {
    it('loads orders and updates state', async () => {
      const order = makeOrder();
      mockListExecute.mockResolvedValueOnce(
        ok({ items: [order], total: 1, hasMore: false })
      );
      const { result } = renderHook(() => useOrderActions());

      await act(async () => {
        await result.current.loadOrders();
      });

      expect(result.current.orders).toEqual([order]);
      expect(result.current.total).toBe(1);
    });

    it('uses default limit=20, offset=0', async () => {
      const { result } = renderHook(() => useOrderActions());

      await act(async () => {
        await result.current.loadOrders();
      });

      expect(mockListExecute).toHaveBeenCalledWith({ limit: 20, offset: 0 });
    });

    it('passes filter when provided', async () => {
      const { result } = renderHook(() => useOrderActions());

      await act(async () => {
        await result.current.loadOrders({ status: 'pending' }, 10, 5);
      });

      expect(mockListExecute).toHaveBeenCalledWith({
        filter: { status: 'pending' },
        limit: 10,
        offset: 5,
      });
    });

    it('sets error on failure', async () => {
      mockListExecute.mockResolvedValueOnce(
        err(new DomainError('Error carga', 'ERR'))
      );
      const { result } = renderHook(() => useOrderActions());

      await act(async () => {
        await result.current.loadOrders();
      });

      expect(result.current.error).toBe('Error carga');
    });
  });

  describe('clearError', () => {
    it('clears error state', async () => {
      mockListExecute.mockResolvedValueOnce(
        err(new DomainError('fail', 'ERR'))
      );
      const { result } = renderHook(() => useOrderActions());

      await act(async () => {
        await result.current.loadOrders();
      });
      act(() => result.current.clearError());

      expect(result.current.error).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('updates order status in list', async () => {
      const order = makeOrder('order-1', 'pending');
      mockListExecute.mockResolvedValueOnce(
        ok({ items: [order], total: 1, hasMore: false })
      );
      const updated = makeOrder('order-1', 'confirmed');
      mockUpdateStatusExecute.mockResolvedValueOnce(ok(updated));

      const { result } = renderHook(() => useOrderActions());
      await act(async () => {
        await result.current.loadOrders();
      });
      await act(async () => {
        await result.current.updateStatus('order-1', 'confirmed');
      });

      expect(result.current.orders[0].status).toBe('confirmed');
    });

    it('shows success toast', async () => {
      const { result } = renderHook(() => useOrderActions());

      await act(async () => {
        const success = await result.current.updateStatus(
          'order-1',
          'confirmed'
        );
        expect(success).toBe(true);
      });

      expect(toast.success).toHaveBeenCalledWith(
        'Estado del pedido actualizado'
      );
    });

    it('shows error toast on failure', async () => {
      mockUpdateStatusExecute.mockResolvedValueOnce(
        err(new DomainError('Error estado', 'ERR'))
      );
      const { result } = renderHook(() => useOrderActions());

      await act(async () => {
        const success = await result.current.updateStatus(
          'order-1',
          'confirmed'
        );
        expect(success).toBe(false);
      });

      expect(toast.error).toHaveBeenCalledWith('Error estado');
    });
  });

  describe('cancelOrder', () => {
    it('updates order to cancelled status', async () => {
      const order = makeOrder('order-1', 'pending');
      mockListExecute.mockResolvedValueOnce(
        ok({ items: [order], total: 1, hasMore: false })
      );

      const { result } = renderHook(() => useOrderActions());
      await act(async () => {
        await result.current.loadOrders();
      });
      await act(async () => {
        await result.current.cancelOrder('order-1');
      });

      expect(result.current.orders[0].status).toBe('cancelled');
    });

    it('shows success toast', async () => {
      const { result } = renderHook(() => useOrderActions());

      await act(async () => {
        const success = await result.current.cancelOrder('order-1');
        expect(success).toBe(true);
      });

      expect(toast.success).toHaveBeenCalledWith(
        'Pedido cancelado exitosamente'
      );
    });

    it('shows error toast on failure', async () => {
      mockCancelExecute.mockResolvedValueOnce(
        err(new DomainError('No se puede cancelar', 'ERR'))
      );
      const { result } = renderHook(() => useOrderActions());

      await act(async () => {
        const success = await result.current.cancelOrder('order-1');
        expect(success).toBe(false);
      });

      expect(toast.error).toHaveBeenCalledWith('No se puede cancelar');
    });
  });
});
