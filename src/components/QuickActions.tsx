import { Copy, Download, FileCode, ImageIcon, Trash2 } from 'lucide-react';
import type { ViewMode } from '../hooks/useViewMode';

interface QuickActionsProps {
  equation: string;
  viewMode: ViewMode;
  onCopy: () => void;
  onCopyImage: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onClear: () => void;
  isExporting: boolean;
  copied: boolean;
}

const modeLabels: Record<ViewMode, string> = {
  visual: 'Visuel',
  split: 'Divisé',
  latex: 'LaTeX',
  'latex-to-visual': 'L→V',
};

export function QuickActions({
  equation,
  viewMode,
  onCopy,
  onCopyImage,
  onExportPNG,
  onExportSVG,
  onClear,
  isExporting,
  copied,
}: QuickActionsProps) {
  if (!equation) return null;

  return (
    <div className="quick-actions">
      <div className="mode-indicator">
        {modeLabels[viewMode]}
      </div>

      <div className="divider" />

      <button
        className={`quick-btn ${copied ? 'primary' : ''}`}
        onClick={onCopy}
        title="Copier LaTeX (⌘⇧C)"
      >
        <Copy size={16} />
        {copied ? 'Copié!' : 'Copier'}
      </button>

      <button
        className="quick-btn"
        onClick={onCopyImage}
        disabled={isExporting}
        title="Copier comme image"
      >
        <ImageIcon size={16} />
      </button>

      <button
        className="quick-btn"
        onClick={onExportPNG}
        disabled={isExporting}
        title="Télécharger PNG (⌘⇧E)"
      >
        <Download size={16} />
      </button>

      <button
        className="quick-btn"
        onClick={onExportSVG}
        disabled={isExporting}
        title="Télécharger SVG (⌘⇧S)"
      >
        <FileCode size={16} />
      </button>

      <div className="divider" />

      <button
        className="quick-btn"
        onClick={onClear}
        title="Effacer (⌘⌫)"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
