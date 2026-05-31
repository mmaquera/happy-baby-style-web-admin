import { renderHook, act } from '@testing-library/react';
import { useSidebarTooltip } from '@happy-baby/shared-hooks';

describe('useSidebarTooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with isVisible=false', () => {
    const { result } = renderHook(() => useSidebarTooltip());
    expect(result.current.isVisible).toBe(false);
  });

  it('shows tooltip after default delay (500ms)', async () => {
    const { result } = renderHook(() => useSidebarTooltip());

    act(() => result.current.showTooltip());
    expect(result.current.isVisible).toBe(false);

    act(() => vi.advanceTimersByTime(500));
    expect(result.current.isVisible).toBe(true);
  });

  it('shows tooltip after custom delay', () => {
    const { result } = renderHook(() => useSidebarTooltip(200));

    act(() => result.current.showTooltip());
    act(() => vi.advanceTimersByTime(199));
    expect(result.current.isVisible).toBe(false);

    act(() => vi.advanceTimersByTime(1));
    expect(result.current.isVisible).toBe(true);
  });

  it('hideTooltip cancels pending show and hides tooltip', () => {
    const { result } = renderHook(() => useSidebarTooltip());

    act(() => result.current.showTooltip());
    act(() => result.current.hideTooltip());
    act(() => vi.advanceTimersByTime(500));

    expect(result.current.isVisible).toBe(false);
  });

  it('hideTooltip hides a visible tooltip', () => {
    const { result } = renderHook(() => useSidebarTooltip());

    act(() => result.current.showTooltip());
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.isVisible).toBe(true);

    act(() => result.current.hideTooltip());
    expect(result.current.isVisible).toBe(false);
  });

  it('rapid show-show resets the timer', () => {
    const { result } = renderHook(() => useSidebarTooltip(500));

    act(() => result.current.showTooltip());
    act(() => vi.advanceTimersByTime(300));
    act(() => result.current.showTooltip());
    act(() => vi.advanceTimersByTime(300));
    expect(result.current.isVisible).toBe(false);

    act(() => vi.advanceTimersByTime(200));
    expect(result.current.isVisible).toBe(true);
  });
});
