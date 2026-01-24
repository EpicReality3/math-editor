import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { MathSymbol } from '../types';

const MAX_RECENT_SYMBOLS = 10;
const STORAGE_KEY = 'recent-symbols';

export function useRecentSymbols() {
  const [recentSymbols, setRecentSymbols] = useLocalStorage<MathSymbol[]>(STORAGE_KEY, []);

  const addRecentSymbol = useCallback((symbol: MathSymbol) => {
    setRecentSymbols(prev => {
      // Remove if already exists (will be moved to front)
      const filtered = prev.filter(s => s.latex !== symbol.latex);
      // Add to front and limit to MAX_RECENT_SYMBOLS
      return [symbol, ...filtered].slice(0, MAX_RECENT_SYMBOLS);
    });
  }, [setRecentSymbols]);

  const clearRecentSymbols = useCallback(() => {
    setRecentSymbols([]);
  }, [setRecentSymbols]);

  return { recentSymbols, addRecentSymbol, clearRecentSymbols };
}
