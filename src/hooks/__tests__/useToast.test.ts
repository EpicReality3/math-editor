import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start with no toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('should show toast with message and type', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message', 'success');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Test message');
    expect(result.current.toasts[0].type).toBe('success');
  });

  it('should show toast with default type success', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Success message');
    });

    expect(result.current.toasts[0].type).toBe('success');
  });

  it('should dismiss toast manually', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message', 'success');
    });

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.dismissToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should auto-dismiss toast after duration', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message', 'success', 1000);
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should handle multiple toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('First', 'success');
      result.current.showToast('Second', 'error');
      result.current.showToast('Third', 'info');
    });

    expect(result.current.toasts).toHaveLength(3);
  });

  it('should generate unique IDs for each toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('First', 'success');
      result.current.showToast('Second', 'error');
    });

    const ids = result.current.toasts.map((t) => t.id);
    expect(new Set(ids).size).toBe(2);
  });
});
