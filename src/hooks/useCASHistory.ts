import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { CASHistoryItem, CASOperation } from '../types';

const MAX_HISTORY_ITEMS = 50;

export function useCASHistory() {
  const [history, setHistory] = useLocalStorage<CASHistoryItem[]>('cas-history', []);

  const addToHistory = useCallback(
    (operation: CASOperation, inputLatex: string, outputLatex: string) => {
      const newItem: CASHistoryItem = {
        id: `cas-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        operation,
        inputLatex,
        outputLatex,
        timestamp: Date.now(),
      };

      setHistory(prev => {
        // Add new item at the beginning
        const updated = [newItem, ...prev];
        // Keep only the last MAX_HISTORY_ITEMS
        return updated.slice(0, MAX_HISTORY_ITEMS);
      });
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const removeFromHistory = useCallback(
    (id: string) => {
      setHistory(prev => prev.filter(item => item.id !== id));
    },
    [setHistory]
  );

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
}
