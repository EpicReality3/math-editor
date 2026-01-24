import React from 'react';
import {
  Calculator,
  Sparkles,
  Grid3X3,
  Expand,
  Variable,
  TrendingUp,
  Sigma,
} from 'lucide-react';
import type { CASOperation } from '../../types';

interface CASOperationsProps {
  onOperation: (operation: CASOperation) => void;
  isProcessing: boolean;
  operationLabels: Record<CASOperation, string>;
}

interface OperationButton {
  operation: CASOperation;
  icon: React.ReactNode;
  description: string;
}

const OPERATIONS: OperationButton[] = [
  {
    operation: 'evaluate',
    icon: <Calculator size={18} />,
    description: 'Calculer la valeur numérique',
  },
  {
    operation: 'simplify',
    icon: <Sparkles size={18} />,
    description: 'Simplifier l\'expression',
  },
  {
    operation: 'solve',
    icon: <Variable size={18} />,
    description: 'Résoudre l\'équation',
  },
  {
    operation: 'derivative',
    icon: <TrendingUp size={18} />,
    description: 'Calculer la dérivée',
  },
  {
    operation: 'integrate',
    icon: <Sigma size={18} />,
    description: 'Calculer l\'intégrale',
  },
  {
    operation: 'factor',
    icon: <Grid3X3 size={18} />,
    description: 'Factoriser l\'expression',
  },
  {
    operation: 'expand',
    icon: <Expand size={18} />,
    description: 'Développer l\'expression',
  },
];

export function CASOperations({
  onOperation,
  isProcessing,
  operationLabels,
}: CASOperationsProps) {
  return (
    <div className="cas-operations">
      <div className="cas-operations__grid">
        {OPERATIONS.map(({ operation, icon, description }) => (
          <button
            key={operation}
            className="cas-operations__btn"
            onClick={() => onOperation(operation)}
            disabled={isProcessing}
            title={description}
          >
            {icon}
            <span>{operationLabels[operation]}</span>
          </button>
        ))}
      </div>
      {isProcessing && (
        <div className="cas-operations__loading">
          <div className="cas-operations__spinner" />
          <span>Calcul en cours...</span>
        </div>
      )}
    </div>
  );
}
