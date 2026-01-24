// Math Editor - Updated
import { useState, useRef, useEffect, useCallback } from 'react';
import MathEditor from './components/MathEditor';
import MathToolbar from './components/MathToolbar';
import EquationHistory from './components/EquationHistory';
import { EquationTemplates } from './components/EquationTemplates';
import { SaveTemplateModal } from './components/SaveTemplateModal';
import { ToastContainer } from './components/Toast';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ViewModeToggle } from './components/ViewModeToggle';
import { SplitView } from './components/SplitView';
import { QuickActions } from './components/QuickActions';
import { QuickCommandBar } from './components/QuickCommandBar';
import { CASCalculator } from './components/CASCalculator';
import { Copy, Check, Calculator, FileOutput, Keyboard, Sun, Moon, Sparkles, Download, Image as ImageIcon, HelpCircle, FileCode, BookmarkPlus, Radical } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useEquationHistory } from './hooks/useEquationHistory';
import { useEquationTemplates } from './hooks/useEquationTemplates';
import { useViewMode } from './hooks/useViewMode';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useToast } from './hooks/useToast';
import { useQuickCommands } from './hooks/useQuickCommands';
import { useCASPanel } from './hooks/useCASPanel';
import { matchesShortcut } from './data/defaultShortcuts';
import { exportAsPNG, exportAsSVG, downloadBlob, downloadSVG, copyImageToClipboard } from './utils/export';
import type { MathEditorRef, Theme } from './types';
import './App.css';

function App() {
  const [equation, setEquation] = useState('');
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [exportingImage, setExportingImage] = useState(false);
  const editorRef = useRef<MathEditorRef>(null);

  const { history, addToHistory, removeFromHistory, clearHistory } = useEquationHistory();
  const { templates, categories, addTemplate, removeTemplate } = useEquationTemplates();
  const { viewMode, setViewMode } = useViewMode();
  const { shortcuts, updateShortcut, resetShortcut, resetAllShortcuts, getShortcut, hasConflict } = useKeyboardShortcuts();
  const { toasts, showToast, dismissToast } = useToast();
  const {
    pinnedCommands,
    recentCommands,
    frequentCommands,
    trackCommand,
    togglePin,
    pinSymbol,
    removeCommand,
    clearRecent,
    reorderCommands
  } = useQuickCommands();
  const { isOpen: isCASOpen, open: openCAS, close: closeCAS, toggle: toggleCAS } = useCASPanel();

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
      showToast('LaTeX copié !', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Erreur lors de la copie', 'error');
    }
  };

  const handleClear = () => {
    setEquation('');
    editorRef.current?.focus();
  };

  const handleInsert = (latex: string) => {
    if (viewMode === 'visual') {
      editorRef.current?.insert(latex);
    } else {
      // In split or latex mode, append to the equation
      setEquation((prev) => prev + latex);
    }
  };

  const handleSymbolUsed = (symbol: { latex: string; label: string }, category: string) => {
    trackCommand(symbol.latex, symbol.label, category);
  };

  const handlePinSymbol = (symbol: { latex: string; label: string }, category: string) => {
    pinSymbol(symbol.latex, symbol.label, category);
    showToast(`${symbol.label} épinglé !`, 'success');
  };

  const handleQuickInsert = (latex: string) => {
    handleInsert(latex);
  };

  const handleHistorySelect = (selectedEquation: string) => {
    setEquation(selectedEquation);
    editorRef.current?.focus();
  };

  const handleTemplateSelect = (latex: string) => {
    setEquation(latex);
    editorRef.current?.focus();
  };

  const handleSaveTemplate = (name: string, category?: string) => {
    addTemplate(name, equation, category);
    showToast('Modèle sauvegardé !', 'success');
  };

  const handleDeleteTemplate = (id: string) => {
    removeTemplate(id);
    showToast('Modèle supprimé', 'info');
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
        showToast('Image exportée !', 'success');
      }
    } catch (error) {
      showToast('Erreur lors de l\'export', 'error');
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
          showToast('Image copiée !', 'success');
          setTimeout(() => setCopied(false), 2000);
        }
      }
    } catch (error) {
      showToast('Erreur lors de la copie de l\'image', 'error');
    } finally {
      setExportingImage(false);
    }
  };

  const handleExportSVG = async () => {
    if (!equation) return;

    setExportingImage(true);
    try {
      const svgString = await exportAsSVG(equation);

      if (svgString) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        downloadSVG(svgString, `equation-${timestamp}.svg`);
        showToast('SVG exporté !', 'success');
      } else {
        showToast('Erreur: SVG non disponible', 'error');
      }
    } catch (error) {
      showToast('Erreur lors de l\'export SVG', 'error');
    } finally {
      setExportingImage(false);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const copyLatexShortcut = getShortcut('copy-latex');
    const exportPngShortcut = getShortcut('export-png');
    const exportSvgShortcut = getShortcut('export-svg');
    const clearShortcut = getShortcut('clear');
    const showShortcutsShortcut = getShortcut('show-shortcuts');

    // Copy LaTeX
    if (copyLatexShortcut && matchesShortcut(e, copyLatexShortcut)) {
      e.preventDefault();
      handleCopy();
      return;
    }

    // Export PNG
    if (exportPngShortcut && matchesShortcut(e, exportPngShortcut)) {
      e.preventDefault();
      handleExportPNG();
      return;
    }

    // Export SVG
    if (exportSvgShortcut && matchesShortcut(e, exportSvgShortcut)) {
      e.preventDefault();
      handleExportSVG();
      return;
    }

    // Clear
    if (clearShortcut && matchesShortcut(e, clearShortcut)) {
      e.preventDefault();
      handleClear();
      return;
    }

    // Show shortcuts
    if (showShortcutsShortcut && matchesShortcut(e, showShortcutsShortcut)) {
      e.preventDefault();
      setShowShortcuts(prev => !prev);
      return;
    }

    // Escape - close modals
    if (e.key === 'Escape') {
      setShowShortcuts(false);
      setShowSaveTemplate(false);
      closeCAS();
    }

    // Cmd/Ctrl + K - open CAS Calculator
    if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      toggleCAS();
      return;
    }

    // ? - show help (shortcuts)
    if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
      // Only trigger if not typing in an input/mathfield
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.closest('math-field')) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    }

    // Quick mode switching with Cmd/Ctrl + 1-4
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
      const modeMap: Record<string, 'visual' | 'split' | 'latex' | 'latex-to-visual'> = {
        '1': 'visual',
        '2': 'split',
        '3': 'latex',
        '4': 'latex-to-visual',
      };
      if (modeMap[e.key]) {
        e.preventDefault();
        setViewMode(modeMap[e.key]);
        showToast(`Mode: ${modeMap[e.key] === 'visual' ? 'Visuel' : modeMap[e.key] === 'split' ? 'Divisé' : modeMap[e.key] === 'latex' ? 'LaTeX' : 'LaTeX → Visuel'}`, 'info');
      }
    }
  }, [getShortcut, setViewMode, showToast, closeCAS, toggleCAS]);

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
            className={`icon-btn cas-btn ${isCASOpen ? 'active' : ''}`}
            onClick={toggleCAS}
            title="Calculatrice CAS (⌘K)"
            aria-label="Ouvrir la calculatrice CAS"
          >
            <Radical size={20} />
          </button>
          <button
            className="icon-btn help-btn"
            onClick={() => setShowShortcuts(true)}
            title="Aide (?)"
            aria-label="Afficher l'aide et les raccourcis"
          >
            <HelpCircle size={20} />
          </button>
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
        <MathToolbar onInsert={handleInsert} onSymbolUsed={handleSymbolUsed} onPinSymbol={handlePinSymbol} />

        <div className="editor-card">
          <div className="card-header">
            <span className="label">
              {viewMode === 'visual' ? 'Éditeur visuel' : viewMode === 'split' ? 'Mode divisé' : viewMode === 'latex-to-visual' ? 'LaTeX → Visuel' : 'Éditeur LaTeX'}
            </span>
            <div className="editor-actions">
              <ViewModeToggle mode={viewMode} onChange={setViewMode} />
              <button
                onClick={handleClear}
                className="clear-btn"
                disabled={!equation}
                aria-label="Effacer l'équation"
              >
                Effacer
              </button>
            </div>
          </div>

          {viewMode === 'visual' ? (
            <MathEditor ref={editorRef} value={equation} onChange={setEquation} />
          ) : (
            <SplitView
              equation={equation}
              onEquationChange={setEquation}
              viewMode={viewMode}
            />
          )}

          {viewMode === 'latex-to-visual' && equation && (
            <div className="latex-help-hint">
              Exemples : \frac{'{a}{b}'} • \sqrt{'{x}'} • \int_0^1 • \sum_{'{n=1}'}^{'{\\infty}'} • \alpha \beta \gamma
            </div>
          )}
        </div>

        <QuickCommandBar
          pinnedCommands={pinnedCommands}
          recentCommands={recentCommands}
          frequentCommands={frequentCommands}
          onInsert={handleQuickInsert}
          onTogglePin={togglePin}
          onRemove={removeCommand}
          onClearRecent={clearRecent}
          onReorder={reorderCommands}
        />

        {viewMode === 'visual' && equation && (
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
                title="Télécharger PNG (⌘⇧E)"
                aria-label="Télécharger l'équation en PNG"
              >
                <Download size={16} />
              </button>
              <button
                onClick={handleExportSVG}
                disabled={!equation || exportingImage}
                className="export-btn"
                title="Télécharger SVG (⌘⇧S)"
                aria-label="Télécharger l'équation en SVG"
              >
                <FileCode size={16} />
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
              <button
                onClick={() => setShowSaveTemplate(true)}
                disabled={!equation}
                className="save-template-btn"
                title="Sauvegarder comme modèle"
                aria-label="Sauvegarder l'équation comme modèle"
              >
                <BookmarkPlus size={16} />
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

        <EquationTemplates
          templates={templates}
          categories={categories}
          onSelect={handleTemplateSelect}
          onDelete={handleDeleteTemplate}
        />

        <EquationHistory
          history={history}
          onSelect={handleHistorySelect}
          onDelete={removeFromHistory}
          onClear={clearHistory}
        />
      </main>

      <footer className="footer">
        <span>⌘1-4 modes • ⌘K calculatrice • ⌘⇧C copier • ⌘⇧E png • ⌘⇧S svg • ⌘⌫ effacer • ? aide</span>
      </footer>

      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        shortcuts={shortcuts}
        onUpdateShortcut={updateShortcut}
        onResetShortcut={resetShortcut}
        onResetAllShortcuts={resetAllShortcuts}
        hasConflict={hasConflict}
      />
      <SaveTemplateModal
        isOpen={showSaveTemplate}
        onClose={() => setShowSaveTemplate(false)}
        onSave={handleSaveTemplate}
        categories={categories}
        equation={equation}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <QuickActions
        equation={equation}
        viewMode={viewMode}
        onCopy={handleCopy}
        onCopyImage={handleCopyAsImage}
        onExportPNG={handleExportPNG}
        onExportSVG={handleExportSVG}
        onClear={handleClear}
        isExporting={exportingImage}
        copied={copied}
      />
      <CASCalculator
        isOpen={isCASOpen}
        onClose={closeCAS}
        editorRef={editorRef}
      />
    </div>
  );
}

export default App;
