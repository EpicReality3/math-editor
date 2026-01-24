import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecentSymbols } from '../useRecentSymbols';
import type { MathSymbol } from '../../types';

const createSymbol = (latex: string, display: string, label: string): MathSymbol => ({
  latex,
  display,
  label,
});

describe('useRecentSymbols', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with empty recent symbols', () => {
    const { result } = renderHook(() => useRecentSymbols());
    expect(result.current.recentSymbols).toEqual([]);
  });

  it('should add symbol to recent', () => {
    const { result } = renderHook(() => useRecentSymbols());
    const symbol = createSymbol('\\alpha', 'α', 'alpha');

    act(() => {
      result.current.addRecentSymbol(symbol);
    });

    expect(result.current.recentSymbols).toHaveLength(1);
    expect(result.current.recentSymbols[0].latex).toBe('\\alpha');
  });

  it('should move duplicate symbol to front', () => {
    const { result } = renderHook(() => useRecentSymbols());
    const alpha = createSymbol('\\alpha', 'α', 'alpha');
    const beta = createSymbol('\\beta', 'β', 'beta');

    act(() => {
      result.current.addRecentSymbol(alpha);
    });
    act(() => {
      result.current.addRecentSymbol(beta);
    });
    act(() => {
      result.current.addRecentSymbol(alpha); // Duplicate
    });

    expect(result.current.recentSymbols).toHaveLength(2);
    expect(result.current.recentSymbols[0].latex).toBe('\\alpha');
    expect(result.current.recentSymbols[1].latex).toBe('\\beta');
  });

  it('should limit to 10 recent symbols', () => {
    const { result } = renderHook(() => useRecentSymbols());

    for (let i = 0; i < 15; i++) {
      act(() => {
        result.current.addRecentSymbol(createSymbol(`\\symbol${i}`, `s${i}`, `symbol${i}`));
      });
    }

    expect(result.current.recentSymbols).toHaveLength(10);
    expect(result.current.recentSymbols[0].latex).toBe('\\symbol14');
  });

  it('should clear recent symbols', () => {
    const { result } = renderHook(() => useRecentSymbols());
    const alpha = createSymbol('\\alpha', 'α', 'alpha');

    act(() => {
      result.current.addRecentSymbol(alpha);
    });
    act(() => {
      result.current.clearRecentSymbols();
    });

    expect(result.current.recentSymbols).toHaveLength(0);
  });
});
