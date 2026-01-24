import { Clock } from 'lucide-react';
import type { MathSymbol } from '../../types';

interface RecentSymbolsProps {
  symbols: MathSymbol[];
  onSymbolClick: (symbol: MathSymbol) => void;
}

export function RecentSymbols({ symbols, onSymbolClick }: RecentSymbolsProps) {
  if (symbols.length === 0) return null;

  return (
    <div className="recent-symbols">
      <div className="recent-header">
        <Clock size={14} />
        <span>Récents</span>
      </div>
      <div className="recent-grid">
        {symbols.map((symbol, index) => (
          <button
            key={`recent-${index}`}
            className="symbol-btn"
            onClick={() => onSymbolClick(symbol)}
            title={symbol.label}
            aria-label={`Insérer ${symbol.label}`}
          >
            {symbol.display}
          </button>
        ))}
      </div>
    </div>
  );
}
