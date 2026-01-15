import { useState, useRef, useEffect, useCallback } from 'react';
import MathEditor from './components/MathEditor';
import MathToolbar from './components/MathToolbar';
import EquationHistory from './components/EquationHistory';
import { Copy, Check, Calculator, FileOutput, Keyboard, Sun, Moon, Sparkles, Download, Image as ImageIcon } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useEquationHistory } from './hooks/useEquationHistory';
import { exportAsPNG, downloadBlob, copyImageToClipboard } from './utils/export';
import type { MathEditorRef, Theme } from './types';
import './App.css';

function App() {
  const [equation, setEquation] = useState('');
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [exportingImage, setExportingImage] = useState(false);
  const editorRef = useRef<MathEditorRef>(null);

  const { history, addToHistory, removeFromHistory, clearHistory } = useEquationHistory();

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light' : '';
  }, [theme]);

  // Save to history when equation changes (debounced)
  useEffect(() => {
    if (!equation) return;

    const timeoutId = setTimeout(() => {
      addToHistory(equation);
    }, 2000); // Wait 2 seconds after user stops typing

    return () => clearTimeout(timeoutId);
  }, [equation, addToHistory]);

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const handleCopy = async () => {
    if (!equation) return;
    try {
      await navigator.clipboard.writeText(equation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleClear = () => {
    setEquation('');
    editorRef.current?.focus();
  };

  const handleInsert = (latex: string) => {
    editorRef.current?.insert(latex);
  };

  const handleHistorySelect = (selectedEquation: string) => {
    setEquation(selectedEquation);
    editorRef.current?.focus();
  };

  const handleExportPNG = async () => {
    if (!equation) return;

    setExportingImage(true);
    try {
      const blob = await exportAsPNG(equation, {
        scale: 3,
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      });

      if (blob) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        downloadBlob(blob, `equation-${timestamp}.png`);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportingImage(false);
    }
  };

  const handleCopyAsImage = async () => {
    if (!equation) return;

    setExportingImage(true);
    try {
      const blob = await exportAsPNG(equation, {
        scale: 3,
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      });

      if (blob) {
        const success = await copyImageToClipboard(blob);
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    } catch (error) {
      console.error('Copy as image failed:', error);
    } finally {
      setExportingImage(false);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Cmd/Ctrl + C when not in input - copy LaTeX
    if ((e.metaKey || e.ctrlKey) && e.key === 'c' && !equation) return;

    // Cmd/Ctrl + Shift + C - copy LaTeX
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      handleCopy();
    }

    // Cmd/Ctrl + Backspace - clear
    if ((e.metaKey || e.ctrlKey) && e.key === 'Backspace') {
      e.preventDefault();
      handleClear();
    }

    // Escape - close shortcuts modal
    if (e.key === 'Escape') {
      setShowShortcuts(false);
    }

    // Cmd/Ctrl + / - show shortcuts
    if ((e.metaKey || e.ctrlKey) && e.key === '/') {
      e.preventDefault();
      setShowShortcuts(prev => !prev);
    }
  }, [equation]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="container">
      <header className="header">
        <div className="header-brand">
          <div className="logo-wrapper">
            <Calculator className="logo-icon" size={28} />
            <Sparkles className="sparkle" size={14} />
          </div>
          <div className="brand-text">
            <h1>Math Editor</h1>
            <p className="tagline">Visual Math to LaTeX</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="icon-btn"
            onClick={() => setShowShortcuts(true)}
            title="Raccourcis (⌘/)"
            aria-label="Afficher les raccourcis clavier"
          >
            <Keyboard size={20} />
          </button>
          <button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            title="Changer le thème"
            aria-label={`Passer au thème ${theme === 'dark' ? 'clair' : 'sombre'}`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main>
        <MathToolbar onInsert={handleInsert} />

        <div className="editor-card">
          <div className="card-header">
            <span className="label">Éditeur visuel</span>
            <button
              onClick={handleClear}
              className="clear-btn"
              disabled={!equation}
              aria-label="Effacer l'équation"
            >
              Effacer
            </button>
          </div>
          <MathEditor ref={editorRef} value={equation} onChange={setEquation} />
        </div>

        {equation && (
          <div className="preview-card">
            <div className="card-header">
              <span className="label">
                <Sparkles size={14} />
                Prévisualisation
              </span>
            </div>
            <div className="preview-content" dangerouslySetInnerHTML={{
              __html: `<math-field read-only style="font-size: 1.8rem; background: transparent; border: none; pointer-events: none;">${equation}</math-field>`
            }} />
          </div>
        )}

        <div className="output-card">
          <div className="card-header">
            <span className="label">
              <FileOutput size={14} />
              Sortie LaTeX
            </span>
            <div className="output-actions">
              <button
                onClick={handleCopyAsImage}
                disabled={!equation || exportingImage}
                className="copy-image-btn"
                title="Copier comme image"
                aria-label="Copier l'équation comme image"
              >
                <ImageIcon size={16} />
              </button>
              <button
                onClick={handleExportPNG}
                disabled={!equation || exportingImage}
                className="export-btn"
                title="Télécharger PNG"
                aria-label="Télécharger l'équation en PNG"
              >
                <Download size={16} />
              </button>
              <button
                onClick={handleCopy}
                disabled={!equation}
                className={`copy-btn ${copied ? 'copied' : ''}`}
                aria-label="Copier le code LaTeX"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
          </div>
          <div className="output-content">
            {equation ? (
              <code className="latex-code">{equation}</code>
            ) : (
              <span className="placeholder">Commencez à taper ci-dessus...</span>
            )}
          </div>
        </div>

        <EquationHistory
          history={history}
          onSelect={handleHistorySelect}
          onDelete={removeFromHistory}
          onClear={clearHistory}
        />
      </main>

      <footer className="footer">
        <span>⌘⇧C copier • ⌘⌫ effacer • ⌘/ raccourcis</span>
      </footer>

      {showShortcuts && (
        <div className="modal-overlay" onClick={() => setShowShortcuts(false)} role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="shortcuts-title">Raccourcis clavier</h2>
              <button className="close-btn" onClick={() => setShowShortcuts(false)} aria-label="Fermer">×</button>
            </div>
            <div className="shortcuts-grid">
              <div className="shortcut">
                <kbd>⌘</kbd><kbd>⇧</kbd><kbd>C</kbd>
                <span>Copier LaTeX</span>
              </div>
              <div className="shortcut">
                <kbd>⌘</kbd><kbd>⌫</kbd>
                <span>Effacer</span>
              </div>
              <div className="shortcut">
                <kbd>⌘</kbd><kbd>/</kbd>
                <span>Afficher/masquer raccourcis</span>
              </div>
              <div className="shortcut">
                <kbd>Esc</kbd>
                <span>Fermer les fenêtres</span>
              </div>
              <div className="shortcut-divider">Dans l'éditeur MathLive :</div>
              <div className="shortcut">
                <kbd>/</kbd>
                <span>Fraction</span>
              </div>
              <div className="shortcut">
                <kbd>^</kbd>
                <span>Exposant</span>
              </div>
              <div className="shortcut">
                <kbd>_</kbd>
                <span>Indice</span>
              </div>
              <div className="shortcut">
                <kbd>\\</kbd><span className="inline">sqrt</span>
                <span>Racine carrée</span>
              </div>
              <div className="shortcut">
                <kbd>\\</kbd><span className="inline">int</span>
                <span>Intégrale</span>
              </div>
              <div className="shortcut">
                <kbd>\\</kbd><span className="inline">sum</span>
                <span>Somme</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
