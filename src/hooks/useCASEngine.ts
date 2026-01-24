import { useCallback, useState } from 'react';
import * as math from 'mathjs';
import type { CASOperation, CASResult } from '../types';
import { latexToCAS, extractVariable } from '../utils/latexToCAS';
import { casToLatex, formatNumericResult } from '../utils/casToLatex';

// Import nerdamer and its extensions
import nerdamer from 'nerdamer';
import 'nerdamer/Calculus';
import 'nerdamer/Algebra';
import 'nerdamer/Solve';

const OPERATION_LABELS: Record<CASOperation, string> = {
  evaluate: 'Calculer',
  simplify: 'Simplifier',
  factor: 'Factoriser',
  expand: 'Développer',
  solve: 'Résoudre',
  derivative: 'Dériver',
  integrate: 'Intégrer',
};

export function useCASEngine() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<CASResult | null>(null);

  const performOperation = useCallback(
    async (operation: CASOperation, inputLatex: string): Promise<CASResult> => {
      setIsProcessing(true);

      try {
        // Convert LaTeX to CAS-compatible format
        const casExpression = latexToCAS(inputLatex);
        let outputLatex: string;

        switch (operation) {
          case 'evaluate': {
            try {
              // Try math.js first for numerical evaluation
              const result = math.evaluate(casExpression);
              if (typeof result === 'number') {
                outputLatex = formatNumericResult(result);
              } else if (result && typeof result.toString === 'function') {
                outputLatex = casToLatex(result.toString());
              } else {
                outputLatex = casToLatex(String(result));
              }
            } catch {
              // Fall back to nerdamer for symbolic evaluation
              const result = nerdamer(casExpression).evaluate();
              outputLatex = casToLatex(result.text());
            }
            break;
          }

          case 'simplify': {
            try {
              // Try math.js simplify first
              const result = math.simplify(casExpression);
              outputLatex = casToLatex(result.toString());
            } catch {
              // Fall back to nerdamer
              const result = nerdamer.simplify(casExpression);
              outputLatex = casToLatex(result.text());
            }
            break;
          }

          case 'factor': {
            const result = nerdamer.factor(casExpression);
            outputLatex = casToLatex(result.text());
            break;
          }

          case 'expand': {
            const result = nerdamer.expand(casExpression);
            outputLatex = casToLatex(result.text());
            break;
          }

          case 'solve': {
            const variable = extractVariable(casExpression);
            // Handle equations with = sign
            let expr = casExpression;
            if (casExpression.includes('=')) {
              // Move everything to one side: a = b becomes a - (b)
              const [left, right] = casExpression.split('=').map(s => s.trim());
              expr = `(${left})-(${right})`;
            }
            const result = nerdamer.solve(expr, variable);
            const solutions = result.text();
            // Format solutions array
            if (solutions.startsWith('[') && solutions.endsWith(']')) {
              const items = solutions.slice(1, -1).split(',').map(s => s.trim());
              outputLatex = items.map(item => `${variable} = ${casToLatex(item)}`).join(', \\; ');
            } else {
              outputLatex = `${variable} = ${casToLatex(solutions)}`;
            }
            break;
          }

          case 'derivative': {
            const variable = extractVariable(casExpression);
            const result = nerdamer.diff(casExpression, variable);
            outputLatex = casToLatex(result.text());
            break;
          }

          case 'integrate': {
            const variable = extractVariable(casExpression);
            const result = nerdamer.integrate(casExpression, variable);
            // Add constant of integration
            outputLatex = casToLatex(result.text()) + ' + C';
            break;
          }

          default:
            throw new Error(`Opération non supportée: ${operation}`);
        }

        const casResult: CASResult = {
          success: true,
          inputLatex,
          outputLatex,
          operation,
        };

        setLastResult(casResult);
        setIsProcessing(false);
        return casResult;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erreur inconnue';

        const casResult: CASResult = {
          success: false,
          inputLatex,
          outputLatex: '',
          operation,
          error: translateError(errorMessage),
        };

        setLastResult(casResult);
        setIsProcessing(false);
        return casResult;
      }
    },
    []
  );

  return {
    performOperation,
    isProcessing,
    lastResult,
    operationLabels: OPERATION_LABELS,
  };
}

/**
 * Translate common error messages to French
 */
function translateError(error: string): string {
  const errorMap: Record<string, string> = {
    'Undefined symbol': 'Symbole non défini',
    'Unexpected end of expression': 'Expression incomplète',
    'Unexpected operator': 'Opérateur inattendu',
    'Parenthesis mismatch': 'Parenthèses non équilibrées',
    'Division by zero': 'Division par zéro',
    'Unknown function': 'Fonction inconnue',
    'Invalid syntax': 'Syntaxe invalide',
  };

  for (const [eng, fr] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(eng.toLowerCase())) {
      return fr;
    }
  }

  // If no translation found, return a generic message with the original error
  if (error.length > 100) {
    return 'Erreur de calcul. Vérifiez votre expression.';
  }

  return `Erreur: ${error}`;
}
