import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Calculator, ArrowLeftRight } from 'lucide-react';
import { CASInput, CASInputRef } from './CASInput';
import { CASOutput } from './CASOutput';
import { CASOperations } from './CASOperations';
import { CASHistory } from './CASHistory';
import { useCASEngine } from '../../hooks/useCASEngine';
import { useCASHistory } from '../../hooks/useCASHistory';
import type { CASOperation, CASHistoryItem, MathEditorRef } from '../../types';
import './CASCalculator.css';

interface CASCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  editorRef?: React.RefObject<MathEditorRef>;
  onInsertToEditor?: (latex: string) => void;
}

export function CASCalculator({
  isOpen,
  onClose,
  editorRef,
  onInsertToEditor,
}: CASCalculatorProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<CASInputRef>(null);

  const { performOperation, isProcessing, lastResult, operationLabels } =
    useCASEngine();
  const { history, addToHistory, clearHistory, removeFromHistory } =
    useCASHistory();

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle keyboard shortcut to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleOperation = useCallback(
    async (operation: CASOperation) => {
      // Get value directly from MathLive component as fallback
      const currentValue = inputValue || inputRef.current?.getValue() || '';

      if (!currentValue.trim()) {
        console.log('CAS: No input value');
        return;
      }

      console.log('CAS: Performing operation', operation, 'on', currentValue);
      const result = await performOperation(operation, currentValue);

      if (result.success) {
        addToHistory(operation, result.inputLatex, result.outputLatex);
      } else {
        console.log('CAS: Operation failed', result.error);
      }
    },
    [inputValue, performOperation, addToHistory]
  );

  const handleCopyResult = useCallback(() => {
    if (lastResult?.outputLatex) {
      navigator.clipboard.writeText(lastResult.outputLatex);
    }
  }, [lastResult]);

  const handleInsertToEditor = useCallback(() => {
    if (lastResult?.outputLatex) {
      if (onInsertToEditor) {
        onInsertToEditor(lastResult.outputLatex);
      } else if (editorRef?.current) {
        editorRef.current.insert(lastResult.outputLatex);
        editorRef.current.focus();
      }
    }
  }, [lastResult, onInsertToEditor, editorRef]);

  const handleReuseHistoryItem = useCallback((item: CASHistoryItem) => {
    setInputValue(item.inputLatex);
    inputRef.current?.setValue(item.inputLatex);
    inputRef.current?.focus();
  }, []);

  const handleImportFromEditor = useCallback(() => {
    if (editorRef?.current) {
      const value = editorRef.current.getValue();
      if (value) {
        setInputValue(value);
        inputRef.current?.setValue(value);
      }
    }
  }, [editorRef]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="cas-backdrop" onClick={onClose} />

      {/* Panel */}
      <div className="cas-panel">
        {/* Header */}
        <div className="cas-panel__header">
          <div className="cas-panel__title">
            <Calculator size={20} />
            <span>Calculatrice CAS</span>
          </div>
          <button
            className="cas-panel__close-btn"
            onClick={onClose}
            title="Fermer (Échap)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="cas-panel__content">
          {/* Input section */}
          <div className="cas-section">
            <div className="cas-section__header">
              <label className="cas-section__label">Expression</label>
              {editorRef && (
                <button
                  className="cas-import-btn"
                  onClick={handleImportFromEditor}
                  title="Importer depuis l'éditeur"
                >
                  <ArrowLeftRight size={14} />
                  <span>Importer</span>
                </button>
              )}
            </div>
            <CASInput
              ref={inputRef}
              value={inputValue}
              onChange={setInputValue}
              onSubmit={() => handleOperation('evaluate')}
              placeholder="Entrez une expression..."
            />
          </div>

          {/* Operations */}
          <div className="cas-section">
            <CASOperations
              onOperation={handleOperation}
              isProcessing={isProcessing}
              operationLabels={operationLabels}
            />
          </div>

          {/* Output */}
          <div className="cas-section">
            <CASOutput
              result={lastResult}
              onCopy={handleCopyResult}
              onInsertToEditor={handleInsertToEditor}
              operationLabels={operationLabels}
            />
          </div>

          {/* History */}
          <div className="cas-section cas-section--history">
            <CASHistory
              history={history}
              onReuse={handleReuseHistoryItem}
              onRemove={removeFromHistory}
              onClear={clearHistory}
              operationLabels={operationLabels}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CASCalculator;
