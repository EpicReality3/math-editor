import React from 'react';
import { Trash2, RotateCcw, Clock } from 'lucide-react';
import type { CASHistoryItem, CASOperation } from '../../types';

interface CASHistoryProps {
  history: CASHistoryItem[];
  onReuse: (item: CASHistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  operationLabels: Record<CASOperation, string>;
}

export function CASHistory({
  history,
  onReuse,
  onRemove,
  onClear,
  operationLabels,
}: CASHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="cas-history cas-history--empty">
        <Clock size={24} className="cas-history__empty-icon" />
        <p>L'historique est vide</p>
        <p className="cas-history__hint">
          Vos calculs apparaîtront ici
        </p>
      </div>
    );
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Less than 1 minute
    if (diff < 60000) {
      return 'À l\'instant';
    }

    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `Il y a ${minutes} min`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `Il y a ${hours}h`;
    }

    // Otherwise show date
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="cas-history">
      <div className="cas-history__header">
        <h4 className="cas-history__title">
          <Clock size={16} />
          Historique
        </h4>
        <button
          className="cas-history__clear-btn"
          onClick={onClear}
          title="Effacer l'historique"
        >
          <Trash2 size={14} />
          <span>Effacer</span>
        </button>
      </div>

      <div className="cas-history__list">
        {history.map(item => (
          <div key={item.id} className="cas-history__item">
            <div className="cas-history__item-header">
              <span className="cas-history__operation">
                {operationLabels[item.operation]}
              </span>
              <span className="cas-history__time">
                {formatTime(item.timestamp)}
              </span>
            </div>

            <div className="cas-history__item-content">
              <div className="cas-history__expression">
                <math-field
                  read-only
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {item.inputLatex}
                </math-field>
              </div>
              <span className="cas-history__arrow">→</span>
              <div className="cas-history__result">
                <math-field
                  read-only
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  {item.outputLatex}
                </math-field>
              </div>
            </div>

            <div className="cas-history__item-actions">
              <button
                className="cas-history__action-btn"
                onClick={() => onReuse(item)}
                title="Réutiliser cette expression"
              >
                <RotateCcw size={14} />
              </button>
              <button
                className="cas-history__action-btn cas-history__action-btn--delete"
                onClick={() => onRemove(item.id)}
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
