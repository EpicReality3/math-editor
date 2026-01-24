import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { defaultShortcuts } from '../data/defaultShortcuts';
import type { KeyboardShortcut, ShortcutModifier } from '../types';

const STORAGE_KEY = 'keyboard-shortcuts';

export function useKeyboardShortcuts() {
  const [customShortcuts, setCustomShortcuts] = useLocalStorage<Partial<Record<string, KeyboardShortcut>>>(
    STORAGE_KEY,
    {}
  );

  // Merge defaults with custom shortcuts
  const shortcuts = useMemo(() => {
    return defaultShortcuts.map((defaultShortcut) => {
      const custom = customShortcuts[defaultShortcut.id];
      return custom ? { ...defaultShortcut, ...custom } : defaultShortcut;
    });
  }, [customShortcuts]);

  const updateShortcut = useCallback(
    (id: string, key: string, modifiers: ShortcutModifier[]) => {
      setCustomShortcuts((prev) => ({
        ...prev,
        [id]: { id, action: defaultShortcuts.find((s) => s.id === id)?.action || '', key, modifiers },
      }));
    },
    [setCustomShortcuts]
  );

  const resetShortcut = useCallback(
    (id: string) => {
      setCustomShortcuts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [setCustomShortcuts]
  );

  const resetAllShortcuts = useCallback(() => {
    setCustomShortcuts({});
  }, [setCustomShortcuts]);

  const getShortcut = useCallback(
    (id: string) => {
      return shortcuts.find((s) => s.id === id);
    },
    [shortcuts]
  );

  const hasConflict = useCallback(
    (id: string, key: string, modifiers: ShortcutModifier[]) => {
      return shortcuts.some(
        (s) =>
          s.id !== id &&
          s.key === key &&
          s.modifiers.length === modifiers.length &&
          s.modifiers.every((m) => modifiers.includes(m))
      );
    },
    [shortcuts]
  );

  return {
    shortcuts,
    updateShortcut,
    resetShortcut,
    resetAllShortcuts,
    getShortcut,
    hasConflict,
  };
}
