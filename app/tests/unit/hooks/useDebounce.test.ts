import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce, useDebouncedCallback } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    expect(result.current).toBe('a');

    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('a');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('b');
  });

  it('coalesces rapid changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });
    rerender({ value: 'b' });
    rerender({ value: 'c' });
    rerender({ value: 'd' });

    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('d');
  });

  it('cancels pending updates on unmount', () => {
    const { result, rerender, unmount } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });
    rerender({ value: 'b' });
    unmount();
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('a');
  });
});

describe('useDebouncedCallback', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('delays invocation', () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(cb, 200));
    result.current('a');
    result.current('b');
    result.current('c');

    act(() => vi.advanceTimersByTime(199));
    expect(cb).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('c');
  });

  it('flush invokes immediately', () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(cb, 200));
    result.current('a');
    act(() => result.current.flush());
    expect(cb).toHaveBeenCalledWith('a');
  });

  it('cancel aborts pending invocation', () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(cb, 200));
    result.current('a');
    act(() => result.current.cancel());
    act(() => vi.advanceTimersByTime(200));
    expect(cb).not.toHaveBeenCalled();
  });
});
