/**
 * Converts CAS output back to LaTeX notation for display
 */

export function casToLatex(casOutput: string): string {
  let result = casOutput.trim();

  // Handle array results from solve (e.g., "[x = 2, x = -2]")
  if (result.startsWith('[') && result.endsWith(']')) {
    const items = result.slice(1, -1).split(',').map(s => s.trim());
    return items.map(item => casToLatex(item)).join(', \\; ');
  }

  // Handle fractions: (a)/(b) → \frac{a}{b}
  result = convertFractions(result);

  // Handle square roots: sqrt(x) → \sqrt{x}
  result = result.replace(/sqrt\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, '\\sqrt{$1}');

  // Handle nth roots: nthRoot(x, n) → \sqrt[n]{x}
  result = result.replace(/nthRoot\(([^,]+),\s*([^)]+)\)/g, '\\sqrt[$2]{$1}');

  // Handle powers: x^(2) → x^{2}
  result = result.replace(/\^\(([^()]*)\)/g, '^{$1}');

  // Trigonometric functions
  result = result.replace(/\basin\b/g, '\\sin');
  result = result.replace(/\bacos\b/g, '\\cos');
  result = result.replace(/\batan\b/g, '\\tan');
  result = result.replace(/\bsin\b/g, '\\sin');
  result = result.replace(/\bcos\b/g, '\\cos');
  result = result.replace(/\btan\b/g, '\\tan');
  result = result.replace(/\bcot\b/g, '\\cot');
  result = result.replace(/\bsec\b/g, '\\sec');
  result = result.replace(/\bcsc\b/g, '\\csc');
  result = result.replace(/\bsinh\b/g, '\\sinh');
  result = result.replace(/\bcosh\b/g, '\\cosh');
  result = result.replace(/\btanh\b/g, '\\tanh');

  // Logarithms
  result = result.replace(/\blog\b(?!\d)/g, '\\ln');
  result = result.replace(/\blog10\b/g, '\\log');
  result = result.replace(/\bexp\b/g, '\\exp');

  // Constants
  result = result.replace(/\bpi\b/g, '\\pi');
  result = result.replace(/\bInfinity\b/g, '\\infty');

  // Greek letters
  result = result.replace(/\balpha\b/g, '\\alpha');
  result = result.replace(/\bbeta\b/g, '\\beta');
  result = result.replace(/\bgamma\b/g, '\\gamma');
  result = result.replace(/\bdelta\b/g, '\\delta');
  result = result.replace(/\bepsilon\b/g, '\\epsilon');
  result = result.replace(/\btheta\b/g, '\\theta');
  result = result.replace(/\blambda\b/g, '\\lambda');
  result = result.replace(/\bmu\b/g, '\\mu');
  result = result.replace(/\bsigma\b/g, '\\sigma');
  result = result.replace(/\bphi\b/g, '\\phi');
  result = result.replace(/\bomega\b/g, '\\omega');

  // Operators
  result = result.replace(/\*/g, ' \\cdot ');
  result = result.replace(/\+\/-/g, '\\pm');

  // Absolute value: abs(x) → |x|
  result = result.replace(/abs\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, '\\left|$1\\right|');

  // Clean up multiple spaces
  result = result.replace(/\s+/g, ' ');
  result = result.trim();

  return result;
}

/**
 * Convert simple fractions in the expression
 */
function convertFractions(expr: string): string {
  // Simple case: (a)/(b) where a and b don't contain nested parentheses
  let result = expr;

  // Pattern for simple fractions
  const fractionPattern = /\(([^()]+)\)\/\(([^()]+)\)/g;

  // Keep replacing until no more matches
  let prevResult = '';
  while (prevResult !== result) {
    prevResult = result;
    result = result.replace(fractionPattern, '\\frac{$1}{$2}');
  }

  // Also handle simple number/number fractions like 3/4
  result = result.replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}');

  return result;
}

/**
 * Format a numeric result for display
 */
export function formatNumericResult(value: number): string {
  // Check if it's essentially an integer
  if (Math.abs(value - Math.round(value)) < 1e-10) {
    return Math.round(value).toString();
  }

  // Check for common irrational numbers
  const piMultiple = value / Math.PI;
  if (Math.abs(piMultiple - Math.round(piMultiple)) < 1e-10) {
    const mult = Math.round(piMultiple);
    if (mult === 1) return '\\pi';
    if (mult === -1) return '-\\pi';
    return `${mult}\\pi`;
  }

  // Format with reasonable precision
  if (Math.abs(value) < 0.0001 || Math.abs(value) > 100000) {
    return value.toExponential(4);
  }

  // Round to 6 significant figures
  const rounded = parseFloat(value.toPrecision(6));
  return rounded.toString();
}
