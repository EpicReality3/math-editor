import { History, Trash2, Clock } from 'lucide-react';
import type { EquationHistoryItem } from '../types';

interface EquationHistoryProps {
  history: EquationHistoryItem[];
  onSelect: (equation: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const EquationHistory = ({ history, onSelect, onDelete, onClear }: EquationHistoryProps) => {
  if (history.length === 0) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="history-card">
      <div className="card-header">
        <span className="label">
          <History size={14} />
          Historique ({history.length})
        </span>
        <button
          onClick={onClear}
          className="clear-history-btn"
          title="Effacer tout l'historique"
          aria-label="Effacer tout l'historique"
        >
          <Trash2 size={14} />
          Tout effacer
        </button>
      </div>
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <button
              className="history-item-content"
              onClick={() => onSelect(item.equation)}
              title="Cliquer pour charger cette équation"
              aria-label={`Charger l'équation: ${item.equation}`}
            >
              <div className="history-equation">
                <code>{item.equation}</code>
              </div>
              <div className="history-meta">
                <Clock size={12} />
                <span>{formatDate(item.timestamp)}</span>
              </div>
            </button>
            <button
              className="delete-history-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              title="Supprimer cet élément"
              aria-label="Supprimer cet élément de l'historique"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquationHistory;
