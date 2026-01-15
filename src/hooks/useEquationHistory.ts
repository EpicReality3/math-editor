import { useLocalStorage } from './useLocalStorage';
import { EquationHistoryItem } from '../types';

const MAX_HISTORY_ITEMS = 50;

export function useEquationHistory() {
  const [history, setHistory] = useLocalStorage<EquationHistoryItem[]>('equation-history', []);

  const addToHistory = (equation: string) => {
    if (!equation.trim()) return;

    const newItem: EquationHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      equation,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      // Remove duplicates and add new item at the beginning
      const filtered = prev.filter((item) => item.equation !== equation);
      const updated = [newItem, ...filtered];

      // Keep only the last MAX_HISTORY_ITEMS
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const removeFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
