import React from 'react';
import { Copy, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import type { CASResult, CASOperation } from '../../types';

interface CASOutputProps {
  result: CASResult | null;
  onCopy: () => void;
  onInsertToEditor: () => void;
  operationLabels: Record<CASOperation, string>;
}

export function CASOutput({
  result,
  onCopy,
  onInsertToEditor,
  operationLabels,
}: CASOutputProps) {
  if (!result) {
    return (
      <div className="cas-output cas-output--empty">
        <p className="cas-output__hint">
          Entrez une expression et choisissez une opération
        </p>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="cas-output cas-output--error">
        <div className="cas-output__header">
          <AlertCircle size={18} />
          <span>Erreur</span>
        </div>
        <div className="cas-output__content">
          <p className="cas-output__error-message">{result.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cas-output cas-output--success">
      <div className="cas-output__header">
        <CheckCircle size={18} />
        <span>{operationLabels[result.operation]}</span>
      </div>

      <div className="cas-output__content">
        <div className="cas-output__row">
          <span className="cas-output__label">Entrée:</span>
          <div className="cas-output__math">
            <math-field
              read-only
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
              }}
            >
              {result.inputLatex}
            </math-field>
          </div>
        </div>

        <div className="cas-output__row cas-output__row--result">
          <span className="cas-output__label">Résultat:</span>
          <div className="cas-output__math cas-output__math--result">
            <math-field
              read-only
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.25rem',
                color: 'var(--text-primary)',
                fontWeight: 500,
              }}
            >
              {result.outputLatex}
            </math-field>
          </div>
        </div>
      </div>

      <div className="cas-output__actions">
        <button
          className="cas-output__action-btn"
          onClick={onCopy}
          title="Copier le résultat"
        >
          <Copy size={16} />
          <span>Copier</span>
        </button>
        <button
          className="cas-output__action-btn cas-output__action-btn--primary"
          onClick={onInsertToEditor}
          title="Insérer dans l'éditeur"
        >
          <ArrowRight size={16} />
          <span>Vers l'éditeur</span>
        </button>
      </div>
    </div>
  );
}
