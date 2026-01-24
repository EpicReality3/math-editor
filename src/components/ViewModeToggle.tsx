import { Eye, Columns, Code, ArrowRight } from 'lucide-react';
import type { ViewMode } from '../hooks/useViewMode';

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  showLabels?: boolean;
}

const modes: { id: ViewMode; icon: typeof Eye; label: string; shortLabel: string; description: string }[] = [
  { id: 'visual', icon: Eye, label: 'Visuel', shortLabel: '1', description: 'Éditeur WYSIWYG' },
  { id: 'split', icon: Columns, label: 'Divisé', shortLabel: '2', description: 'LaTeX + Aperçu' },
  { id: 'latex', icon: Code, label: 'LaTeX', shortLabel: '3', description: 'Code LaTeX seul' },
  { id: 'latex-to-visual', icon: ArrowRight, label: 'L→V', shortLabel: '4', description: 'Entrée LaTeX → Rendu' },
];

export function ViewModeToggle({ mode, onChange, showLabels = false }: ViewModeToggleProps) {
  return (
    <div className="view-mode-toggle" role="radiogroup" aria-label="Mode d'affichage">
      {modes.map(({ id, icon: Icon, label, shortLabel, description }) => (
        <button
          key={id}
          className={`view-mode-btn ${mode === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
          title={`${label} (${shortLabel}) - ${description}`}
          aria-label={`${label} - ${description}`}
          aria-pressed={mode === id}
          data-mode={id}
        >
          <Icon size={16} />
          {showLabels && <span className="view-mode-label">{label}</span>}
        </button>
      ))}
    </div>
  );
}
