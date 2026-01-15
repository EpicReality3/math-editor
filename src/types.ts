export interface MathSymbol {
  latex: string;
  display: string;
  label: string;
}

export interface SymbolCategory {
  label: string;
  icon: string;
  symbols: MathSymbol[];
}

export interface SymbolCategories {
  [key: string]: SymbolCategory;
}

export interface MathEditorRef {
  insert: (latex: string) => void;
  focus: () => void;
  getValue: () => string;
}

export interface EquationHistoryItem {
  id: string;
  equation: string;
  timestamp: number;
  preview?: string;
}

export type Theme = 'light' | 'dark';

export interface ExportOptions {
  format: 'png' | 'svg' | 'clipboard';
  scale?: number;
  backgroundColor?: string;
}
