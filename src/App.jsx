import { useState, useRef, useEffect, useCallback } from 'react'
import MathEditor from './components/MathEditor'
import MathToolbar from './components/MathToolbar'
import { Copy, Check, Calculator, FileOutput, Keyboard, Sun, Moon, Sparkles } from 'lucide-react'

function App() {
  const [equation, setEquation] = useState('')
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const editorRef = useRef(null)

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme === 'light' ? 'light' : '';
  }

  const handleCopy = async () => {
    if (!equation) return;
    try {
      await navigator.clipboard.writeText(equation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  }

  const handleClear = () => {
    setEquation('');
    editorRef.current?.focus();
  }

  const handleInsert = (latex) => {
    editorRef.current?.insert(latex);
  }

  const handleKeyDown = useCallback((e) => {
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
          >
            <Keyboard size={20} />
          </button>
          <button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            title="Changer le thème"
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
            <button
              onClick={handleCopy}
              disabled={!equation}
              className={`copy-btn ${copied ? 'copied' : ''}`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
          <div className="output-content">
            {equation ? (
              <code className="latex-code">{equation}</code>
            ) : (
              <span className="placeholder">Commencez à taper ci-dessus...</span>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <span>⌘⇧C copier • ⌘⌫ effacer • ⌘/ raccourcis</span>
      </footer>

      {showShortcuts && (
        <div className="modal-overlay" onClick={() => setShowShortcuts(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Raccourcis clavier</h2>
              <button className="close-btn" onClick={() => setShowShortcuts(false)}>×</button>
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
  )
}

export default App
