import { useState, useEffect, useRef } from 'react';
import { RotateCcw, AlertCircle } from 'lucide-react';
import type { KeyboardShortcut, ShortcutModifier } from '../types';
import { formatShortcut, defaultShortcuts } from '../data/defaultShortcuts';

interface ShortcutEditorProps {
  shortcuts: KeyboardShortcut[];
  onUpdate: (id: string, key: string, modifiers: ShortcutModifier[]) => void;
  onReset: (id: string) => void;
  onResetAll: () => void;
  hasConflict: (id: string, key: string, modifiers: ShortcutModifier[]) => boolean;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

export function ShortcutEditor({ shortcuts, onUpdate, onReset, onResetAll, hasConflict }: ShortcutEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [pendingModifiers, setPendingModifiers] = useState<ShortcutModifier[]>([]);
  const [conflict, setConflict] = useState(false);
  const inputRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const handleKeyDown = (e: React.KeyboardEvent, shortcut: KeyboardShortcut) => {
    if (!editingId) return;

    e.preventDefault();
    e.stopPropagation();

    // Cancel on Escape
    if (e.key === 'Escape') {
      setEditingId(null);
      setPendingKey(null);
      setPendingModifiers([]);
      setConflict(false);
      return;
    }

    // Collect modifiers
    const modifiers: ShortcutModifier[] = [];
    if (e.metaKey) modifiers.push('meta');
    if (e.ctrlKey && !e.metaKey) modifiers.push('ctrl');
    if (e.shiftKey) modifiers.push('shift');
    if (e.altKey) modifiers.push('alt');

    // Get the key (not a modifier)
    const isModifierKey = ['Control', 'Shift', 'Alt', 'Meta'].includes(e.key);
    if (isModifierKey) {
      setPendingModifiers(modifiers);
      return;
    }

    const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;

    // Check for conflict
    const hasConflictNow = hasConflict(shortcut.id, key, modifiers);
    setConflict(hasConflictNow);

    if (!hasConflictNow) {
      onUpdate(shortcut.id, key, modifiers);
      setEditingId(null);
      setPendingKey(null);
      setPendingModifiers([]);
    } else {
      setPendingKey(key);
      setPendingModifiers(modifiers);
    }
  };

  const startEditing = (id: string) => {
    setEditingId(id);
    setPendingKey(null);
    setPendingModifiers([]);
    setConflict(false);
  };

  const isDefault = (shortcut: KeyboardShortcut) => {
    const def = defaultShortcuts.find((s) => s.id === shortcut.id);
    return def && def.key === shortcut.key &&
           def.modifiers.length === shortcut.modifiers.length &&
           def.modifiers.every((m) => shortcut.modifiers.includes(m));
  };

  return (
    <div className="shortcut-editor">
      <div className="shortcut-editor-header">
        <h3>Personnaliser les raccourcis</h3>
        <button className="reset-all-btn" onClick={onResetAll} title="Réinitialiser tous les raccourcis">
          <RotateCcw size={14} />
          Réinitialiser tout
        </button>
      </div>

      <div className="shortcut-list">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.id} className={`shortcut-row ${editingId === shortcut.id ? 'editing' : ''}`}>
            <span className="shortcut-action">{shortcut.action}</span>
            <div className="shortcut-key-area">
              {editingId === shortcut.id ? (
                <button
                  ref={inputRef}
                  className={`shortcut-capture ${conflict ? 'conflict' : ''}`}
                  onKeyDown={(e) => handleKeyDown(e, shortcut)}
                  onBlur={() => {
                    setEditingId(null);
                    setPendingKey(null);
                    setPendingModifiers([]);
                    setConflict(false);
                  }}
                >
                  {pendingKey
                    ? formatShortcut({ ...shortcut, key: pendingKey, modifiers: pendingModifiers }, isMac)
                    : 'Appuyez sur une touche...'}
                  {conflict && (
                    <span className="conflict-warning">
                      <AlertCircle size={12} />
                      Conflit
                    </span>
                  )}
                </button>
              ) : (
                <button className="shortcut-display" onClick={() => startEditing(shortcut.id)}>
                  {formatShortcut(shortcut, isMac)}
                </button>
              )}
              {!isDefault(shortcut) && (
                <button
                  className="reset-shortcut-btn"
                  onClick={() => onReset(shortcut.id)}
                  title="Réinitialiser ce raccourci"
                >
                  <RotateCcw size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="shortcut-hint">
        Cliquez sur un raccourci pour le modifier. Appuyez sur Échap pour annuler.
      </p>
    </div>
  );
}
