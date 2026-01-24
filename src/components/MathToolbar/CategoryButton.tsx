import type { SymbolCategory } from '../../types';

interface CategoryButtonProps {
  categoryKey: string;
  category: SymbolCategory;
  isActive: boolean;
  onToggle: (key: string) => void;
}

export function CategoryButton({ categoryKey, category, isActive, onToggle }: CategoryButtonProps) {
  return (
    <button
      className={`category-btn ${isActive ? 'active' : ''}`}
      onClick={() => onToggle(categoryKey)}
      title={category.label}
      aria-label={`Catégorie ${category.label}`}
      aria-pressed={isActive}
    >
      <span className="category-icon">{category.icon}</span>
      <span className="category-label">{category.label}</span>
    </button>
  );
}
