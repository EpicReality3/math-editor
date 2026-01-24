import { useRef, useEffect } from 'react';
import type { ViewMode } from '../hooks/useViewMode';

interface SplitViewProps {
  equation: string;
  onEquationChange: (value: string) => void;
  viewMode: ViewMode;
}

export function SplitView({ equation, onEquationChange, viewMode }: SplitViewProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [equation]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onEquationChange(e.target.value);
  };

  // Mode LaTeX vers Visuel : entrée LaTeX en haut, rendu visuel en bas
  if (viewMode === 'latex-to-visual') {
    return (
      <div className="split-view split-view--latex-to-visual">
        {/* LaTeX Input */}
        <div className="split-pane latex-pane">
          <div className="pane-header">
            <span className="pane-label">Entrée LaTeX</span>
          </div>
          <textarea
            ref={textareaRef}
            className="latex-textarea"
            value={equation}
            onChange={handleTextChange}
            placeholder="Entrez votre code LaTeX ici... (ex: \frac{1}{2}, \sqrt{x}, \int_0^1)"
            spellCheck={false}
            aria-label="Entrée LaTeX"
          />
        </div>

        {/* Visual Output */}
        <div className="split-pane visual-output-pane">
          <div className="pane-header">
            <span className="pane-label">Rendu Visuel</span>
          </div>
          <div className="visual-output-content">
            {equation ? (
              <div
                className="visual-render"
                dangerouslySetInnerHTML={{
                  __html: `<math-field read-only style="font-size: 2rem; background: transparent; border: none; pointer-events: none;">${equation}</math-field>`,
                }}
              />
            ) : (
              <span className="placeholder">Le rendu visuel apparaîtra ici...</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`split-view split-view--${viewMode}`}>
      {/* LaTeX Editor */}
      <div className="split-pane latex-pane">
        <div className="pane-header">
          <span className="pane-label">LaTeX</span>
        </div>
        <textarea
          ref={textareaRef}
          className="latex-textarea"
          value={equation}
          onChange={handleTextChange}
          placeholder="Entrez votre code LaTeX ici..."
          spellCheck={false}
          aria-label="Éditeur LaTeX"
        />
      </div>

      {/* Preview (only in split mode) */}
      {viewMode === 'split' && (
        <div className="split-pane preview-pane">
          <div className="pane-header">
            <span className="pane-label">Aperçu</span>
          </div>
          <div className="preview-content">
            {equation ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: `<math-field read-only style="font-size: 1.5rem; background: transparent; border: none; pointer-events: none;">${equation}</math-field>`,
                }}
              />
            ) : (
              <span className="placeholder">L'aperçu apparaîtra ici...</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
