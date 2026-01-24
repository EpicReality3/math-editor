import { useState } from 'react';
import type { MathSymbol } from '../../types';
import { useRecentSymbols } from '../../hooks/useRecentSymbols';
import { symbolCategories } from '../../data';
import { CategoryButton } from './CategoryButton';
import { RecentSymbols } from './RecentSymbols';
import { SymbolPalette } from './SymbolPalette';

interface MathToolbarProps {
  onInsert: (latex: string) => void;
  onSymbolUsed?: (symbol: MathSymbol, category: string) => void;
  onPinSymbol?: (symbol: MathSymbol, categoryKey: string) => void;
}

const MathToolbar = ({ onInsert, onSymbolUsed, onPinSymbol }: MathToolbarProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { recentSymbols, addRecentSymbol } = useRecentSymbols();

  const handleSymbolClick = (symbol: MathSymbol, categoryKey?: string) => {
    onInsert(symbol.latex);
    addRecentSymbol(symbol);
    if (onSymbolUsed && categoryKey) {
      onSymbolUsed(symbol, categoryKey);
    }
  };

  const toggleCategory = (categoryKey: string) => {
    setActiveCategory(activeCategory === categoryKey ? null : categoryKey);
  };

  return (
    <div className="math-toolbar">
      <RecentSymbols symbols={recentSymbols} onSymbolClick={(symbol) => handleSymbolClick(symbol)} />

      <div className="toolbar-categories">
        {Object.entries(symbolCategories).map(([key, category]) => (
          <CategoryButton
            key={key}
            categoryKey={key}
            category={category}
            isActive={activeCategory === key}
            onToggle={toggleCategory}
          />
        ))}
      </div>

      {activeCategory && (
        <SymbolPalette
          category={symbolCategories[activeCategory]}
          categoryKey={activeCategory}
          onSymbolClick={(symbol) => handleSymbolClick(symbol, activeCategory)}
          onPinSymbol={onPinSymbol}
          onClose={() => setActiveCategory(null)}
        />
      )}
    </div>
  );
};

export default MathToolbar;
