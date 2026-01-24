import { useEffect, useState } from 'react';
import { X, Settings } from 'lucide-react';
import { ShortcutEditor } from './ShortcutEditor';
import { formatShortcut } from '../data/defaultShortcuts';
import type { KeyboardShortcut, ShortcutModifier } from '../types';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
  onUpdateShortcut: (id: string, key: string, modifiers: ShortcutModifier[]) => void;
  onResetShortcut: (id: string) => void;
  onResetAllShortcuts: () => void;
  hasConflict: (id: string, key: string, modifiers: ShortcutModifier[]) => boolean;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

interface StaticShortcut {
  action: string;
  mac: string[];
  windows: string[];
}

const mathliveShortcuts: StaticShortcut[] = [
  { action: 'Fraction', mac: ['/'], windows: ['/'] },
  { action: 'Exposant', mac: ['^'], windows: ['^'] },
  { action: 'Indice', mac: ['_'], windows: ['_'] },
  { action: 'Racine carrée', mac: ['\\sqrt'], windows: ['\\sqrt'] },
  { action: 'Intégrale', mac: ['\\int'], windows: ['\\int'] },
  { action: 'Somme', mac: ['\\sum'], windows: ['\\sum'] },
];

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
  shortcuts,
  onUpdateShortcut,
  onResetShortcut,
  onResetAllShortcuts,
  hasConflict,
}: KeyboardShortcutsModalProps) {
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (showEditor) {
          setShowEditor(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, showEditor]);

  useEffect(() => {
    if (!isOpen) {
      setShowEditor(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div className="modal shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="shortcuts-title">Raccourcis clavier</h2>
          <div className="modal-header-actions">
            <button
              className={`customize-btn ${showEditor ? 'active' : ''}`}
              onClick={() => setShowEditor(!showEditor)}
              title="Personnaliser"
            >
              <Settings size={16} />
            </button>
            <div className="platform-toggle">
              <span className={isMac ? 'active' : ''}>Mac</span>
              <span className={!isMac ? 'active' : ''}>Windows</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        {showEditor ? (
          <ShortcutEditor
            shortcuts={shortcuts}
            onUpdate={onUpdateShortcut}
            onReset={onResetShortcut}
            onResetAll={onResetAllShortcuts}
            hasConflict={hasConflict}
          />
        ) : (
          <div className="shortcuts-grid">
            <div>
              <div className="shortcut-divider">Raccourcis personnalisés</div>
              {shortcuts.map((shortcut) => (
                <div key={shortcut.id} className="shortcut">
                  <div className="shortcut-keys">
                    <kbd>{formatShortcut(shortcut, isMac)}</kbd>
                  </div>
                  <span className="shortcut-action">{shortcut.action}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="shortcut-divider">Navigation</div>
              <div className="shortcut">
                <div className="shortcut-keys">
                  <kbd>?</kbd>
                </div>
                <span className="shortcut-action">Aide</span>
              </div>
              <div className="shortcut">
                <div className="shortcut-keys">
                  <kbd>Esc</kbd>
                </div>
                <span className="shortcut-action">Fermer les fenêtres</span>
              </div>
            </div>

            <div>
              <div className="shortcut-divider">Dans l'éditeur MathLive</div>
              {mathliveShortcuts.map(({ action, mac, windows }) => {
                const keys = isMac ? mac : windows;
                return (
                  <div key={action} className="shortcut">
                    <div className="shortcut-keys">
                      {keys.map((key, index) => (
                        <kbd key={index} className={key.startsWith('\\') ? 'kbd-command' : ''}>
                          {key}
                        </kbd>
                      ))}
                    </div>
                    <span className="shortcut-action">{action}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
