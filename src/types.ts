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

export interface EquationTemplate {
  id: string;
  name: string;
  latex: string;
  category?: string;
  createdAt: number;
  isDefault?: boolean;
}

export interface ExportOptions {
  format: 'png' | 'svg' | 'clipboard';
  scale?: number;
  backgroundColor?: string;
}

export type ShortcutModifier = 'ctrl' | 'shift' | 'alt' | 'meta';

export interface KeyboardShortcut {
  id: string;
  action: string;
  key: string;
  modifiers: ShortcutModifier[];
}

// CAS Calculator Types
export type CASOperation =
  | 'evaluate'
  | 'simplify'
  | 'factor'
  | 'expand'
  | 'solve'
  | 'derivative'
  | 'integrate';

export interface CASResult {
  success: boolean;
  inputLatex: string;
  outputLatex: string;
  operation: CASOperation;
  error?: string;
}

export interface CASHistoryItem {
  id: string;
  operation: CASOperation;
  inputLatex: string;
  outputLatex: string;
  timestamp: number;
}
