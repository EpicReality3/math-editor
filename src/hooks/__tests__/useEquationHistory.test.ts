import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEquationHistory } from '../useEquationHistory';

describe('useEquationHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with empty history', () => {
    const { result } = renderHook(() => useEquationHistory());
    expect(result.current.history).toEqual([]);
  });

  it('should add equation to history', () => {
    const { result } = renderHook(() => useEquationHistory());

    act(() => {
      result.current.addToHistory('x^2 + y^2 = r^2');
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].equation).toBe('x^2 + y^2 = r^2');
  });

  it('should not add empty equations', () => {
    const { result } = renderHook(() => useEquationHistory());

    act(() => {
      result.current.addToHistory('');
    });
    act(() => {
      result.current.addToHistory('   ');
    });

    expect(result.current.history).toHaveLength(0);
  });

  it('should move duplicate to front instead of adding', () => {
    const { result } = renderHook(() => useEquationHistory());

    act(() => {
      result.current.addToHistory('a');
    });
    act(() => {
      result.current.addToHistory('b');
    });
    act(() => {
      result.current.addToHistory('a'); // Duplicate
    });

    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0].equation).toBe('a');
    expect(result.current.history[1].equation).toBe('b');
  });

  it('should limit history to 50 items', () => {
    const { result } = renderHook(() => useEquationHistory());

    for (let i = 0; i < 60; i++) {
      act(() => {
        result.current.addToHistory(`equation-${i}`);
      });
    }

    expect(result.current.history).toHaveLength(50);
    expect(result.current.history[0].equation).toBe('equation-59');
  });

  it('should remove item from history', () => {
    const { result } = renderHook(() => useEquationHistory());

    act(() => {
      result.current.addToHistory('a');
    });
    act(() => {
      result.current.addToHistory('b');
    });

    const idToRemove = result.current.history[0].id;

    act(() => {
      result.current.removeFromHistory(idToRemove);
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].equation).toBe('a');
  });

  it('should clear all history', () => {
    const { result } = renderHook(() => useEquationHistory());

    act(() => {
      result.current.addToHistory('a');
    });
    act(() => {
      result.current.addToHistory('b');
    });
    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toHaveLength(0);
  });
});
