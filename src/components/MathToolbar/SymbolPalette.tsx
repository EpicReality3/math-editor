import { useState, useMemo } from 'react';
import { Search, X, Pin } from 'lucide-react';
import type { MathSymbol, SymbolCategory } from '../../types';

interface SymbolPaletteProps {
  category: SymbolCategory;
  categoryKey: string;
  onSymbolClick: (symbol: MathSymbol) => void;
  onPinSymbol?: (symbol: MathSymbol, categoryKey: string) => void;
  onClose: () => void;
}

export function SymbolPalette({ category, categoryKey, onSymbolClick, onPinSymbol, onClose }: SymbolPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSymbols = useMemo(() => {
    if (!searchQuery) return category.symbols;

    const query = searchQuery.toLowerCase();
    return category.symbols.filter(
      (symbol) =>
        symbol.label.toLowerCase().includes(query) ||
        symbol.display.includes(query)
    );
  }, [category.symbols, searchQuery]);

  return (
    <div className="symbol-palette">
      <div className="palette-header">
        <span>{category.label}</span>
        <div className="palette-actions">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher des symboles"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery('')}
                aria-label="Effacer la recherche"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            className="close-palette"
            onClick={onClose}
            aria-label="Fermer la palette"
          >
            ×
          </button>
        </div>
      </div>
      <div className="symbol-grid">
        {filteredSymbols.length > 0 ? (
          filteredSymbols.map((symbol, index) => (
            <div key={index} className="symbol-item">
              <button
                className="symbol-btn"
                onClick={() => onSymbolClick(symbol)}
                title={symbol.label}
                aria-label={`Insérer ${symbol.label}`}
              >
                {symbol.display}
              </button>
              {onPinSymbol && (
                <button
                  className="pin-symbol-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPinSymbol(symbol, categoryKey);
                  }}
                  title="Épingler pour accès rapide"
                  aria-label={`Épingler ${symbol.label}`}
                >
                  <Pin size={12} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">Aucun symbole trouvé</div>
        )}
      </div>
    </div>
  );
}
