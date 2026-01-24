import type { KeyboardShortcut } from '../types';

export const defaultShortcuts: KeyboardShortcut[] = [
  { id: 'copy-latex', action: 'Copier LaTeX', key: 'C', modifiers: ['meta', 'shift'] },
  { id: 'export-png', action: 'Export PNG', key: 'E', modifiers: ['meta', 'shift'] },
  { id: 'export-svg', action: 'Export SVG', key: 'S', modifiers: ['meta', 'shift'] },
  { id: 'clear', action: 'Effacer', key: 'Backspace', modifiers: ['meta'] },
  { id: 'show-shortcuts', action: 'Afficher raccourcis', key: '/', modifiers: ['meta'] },
];

export function formatShortcut(shortcut: KeyboardShortcut, isMac: boolean): string {
  const modSymbols: Record<string, string> = isMac
    ? { meta: '⌘', ctrl: '⌃', alt: '⌥', shift: '⇧' }
    : { meta: 'Win', ctrl: 'Ctrl', alt: 'Alt', shift: 'Shift' };

  const keySymbols: Record<string, string> = {
    Backspace: isMac ? '⌫' : 'Backspace',
    Enter: isMac ? '⏎' : 'Enter',
    Escape: 'Esc',
    ArrowUp: '↑',
    ArrowDown: '↓',
    ArrowLeft: '←',
    ArrowRight: '→',
  };

  const parts = shortcut.modifiers.map((mod) => modSymbols[mod] || mod);
  const key = keySymbols[shortcut.key] || shortcut.key;
  parts.push(key);

  return isMac ? parts.join('') : parts.join('+');
}

export function matchesShortcut(e: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;

  if (key !== shortcut.key) return false;

  const hasMeta = shortcut.modifiers.includes('meta');
  const hasCtrl = shortcut.modifiers.includes('ctrl');
  const hasShift = shortcut.modifiers.includes('shift');
  const hasAlt = shortcut.modifiers.includes('alt');

  // On Mac, meta is Command. On Windows/Linux, use Ctrl as a fallback for meta
  const metaOrCtrl = e.metaKey || e.ctrlKey;

  if (hasMeta && !metaOrCtrl) return false;
  if (hasCtrl && !e.ctrlKey) return false;
  if (hasShift !== e.shiftKey) return false;
  if (hasAlt !== e.altKey) return false;

  return true;
}
