import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('should read existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('existing'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('existing');
  });

  it('should handle objects', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-obj', { name: 'test' })
    );

    act(() => {
      result.current[1]({ name: 'updated' });
    });

    expect(result.current[0]).toEqual({ name: 'updated' });
  });
});
