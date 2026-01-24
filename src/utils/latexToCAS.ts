/**
 * Converts LaTeX notation to CAS-compatible format (math.js / Nerdamer)
 */

export function latexToCAS(latex: string): string {
  let result = latex.trim();

  // Remove display math delimiters
  result = result.replace(/^\$\$?|\$\$?$/g, '');
  result = result.replace(/^\\\[|\\\]$/g, '');
  result = result.replace(/^\\begin\{[^}]+\}|\\end\{[^}]+\}$/g, '');

  // Handle fractions: \frac{a}{b} → (a)/(b)
  result = result.replace(/\\frac\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, '(($1)/($2))');

  // Handle nth roots first: \sqrt[n]{x} → nthRoot(x, n)
  result = result.replace(/\\sqrt\s*\[([^\]]+)\]\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, 'nthRoot($2, $1)');
  result = result.replace(/\\sqrt\s*\[([^\]]+)\]\s*([0-9a-zA-Z])/g, 'nthRoot($2, $1)');

  // Handle square roots: \sqrt{x} → sqrt(x)
  result = result.replace(/\\sqrt\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, 'sqrt($1)');
  // Handle \sqrt followed by single character without braces: \sqrt2 → sqrt(2)
  result = result.replace(/\\sqrt\s*([0-9a-zA-Z])/g, 'sqrt($1)');

  // Handle powers: x^{2} → x^(2), also x^2 → x^(2)
  result = result.replace(/\^{([^{}]*)}/g, '^($1)');
  result = result.replace(/\^([0-9])/g, '^($1)');

  // Handle subscripts (remove them for CAS, or convert to variable names)
  result = result.replace(/_{([^{}]*)}/g, '_$1');
  result = result.replace(/_([0-9a-zA-Z])/g, '_$1');

  // Trigonometric functions
  result = result.replace(/\\sin\s*/g, 'sin');
  result = result.replace(/\\cos\s*/g, 'cos');
  result = result.replace(/\\tan\s*/g, 'tan');
  result = result.replace(/\\cot\s*/g, 'cot');
  result = result.replace(/\\sec\s*/g, 'sec');
  result = result.replace(/\\csc\s*/g, 'csc');
  result = result.replace(/\\arcsin\s*/g, 'asin');
  result = result.replace(/\\arccos\s*/g, 'acos');
  result = result.replace(/\\arctan\s*/g, 'atan');
  result = result.replace(/\\sinh\s*/g, 'sinh');
  result = result.replace(/\\cosh\s*/g, 'cosh');
  result = result.replace(/\\tanh\s*/g, 'tanh');

  // Logarithms
  result = result.replace(/\\ln\s*/g, 'log');
  result = result.replace(/\\log\s*/g, 'log10');
  result = result.replace(/\\exp\s*/g, 'exp');

  // Handle \log_{base}(x) → log(x, base)
  result = result.replace(/log10_([0-9]+)\s*\(([^)]+)\)/g, 'log($2, $1)');
  result = result.replace(/log10_{([^}]+)}\s*\(([^)]+)\)/g, 'log($2, $1)');

  // Constants
  result = result.replace(/\\pi/g, 'pi');
  result = result.replace(/\\e(?![a-zA-Z])/g, 'e');
  result = result.replace(/\\infty/g, 'Infinity');

  // Greek letters
  result = result.replace(/\\alpha/g, 'alpha');
  result = result.replace(/\\beta/g, 'beta');
  result = result.replace(/\\gamma/g, 'gamma');
  result = result.replace(/\\delta/g, 'delta');
  result = result.replace(/\\epsilon/g, 'epsilon');
  result = result.replace(/\\theta/g, 'theta');
  result = result.replace(/\\lambda/g, 'lambda');
  result = result.replace(/\\mu/g, 'mu');
  result = result.replace(/\\sigma/g, 'sigma');
  result = result.replace(/\\phi/g, 'phi');
  result = result.replace(/\\omega/g, 'omega');

  // Operators
  result = result.replace(/\\cdot/g, '*');
  result = result.replace(/\\times/g, '*');
  result = result.replace(/\\div/g, '/');
  result = result.replace(/\\pm/g, '+/-');

  // Absolute value: |x| → abs(x)
  result = result.replace(/\\left\|([^|]+)\\right\|/g, 'abs($1)');
  result = result.replace(/\|([^|]+)\|/g, 'abs($1)');

  // Parentheses
  result = result.replace(/\\left\(/g, '(');
  result = result.replace(/\\right\)/g, ')');
  result = result.replace(/\\left\[/g, '[');
  result = result.replace(/\\right\]/g, ']');
  result = result.replace(/\\left\\{/g, '{');
  result = result.replace(/\\right\\}/g, '}');
  result = result.replace(/\\left\./g, '');
  result = result.replace(/\\right\./g, '');

  // Factorial: n! is already valid
  // Keep as is

  // Remove remaining LaTeX commands (like \, \; \quad etc.)
  result = result.replace(/\\[,;:!]\s*/g, '');
  result = result.replace(/\\quad\s*/g, ' ');
  result = result.replace(/\\qquad\s*/g, ' ');
  result = result.replace(/\\text\{[^}]*\}/g, '');

  // Handle implicit multiplication: 2x → 2*x, xy → x*y
  // Be careful not to break function names
  result = result.replace(/(\d)([a-zA-Z])/g, '$1*$2');
  result = result.replace(/([a-zA-Z])(\d)/g, '$1*$2');

  // Fix function names that got broken by implicit multiplication
  result = result.replace(/s\*i\*n/g, 'sin');
  result = result.replace(/c\*o\*s/g, 'cos');
  result = result.replace(/t\*a\*n/g, 'tan');
  result = result.replace(/l\*o\*g/g, 'log');
  result = result.replace(/s\*q\*r\*t/g, 'sqrt');
  result = result.replace(/a\*b\*s/g, 'abs');
  result = result.replace(/e\*x\*p/g, 'exp');
  result = result.replace(/a\*s\*i\*n/g, 'asin');
  result = result.replace(/a\*c\*o\*s/g, 'acos');
  result = result.replace(/a\*t\*a\*n/g, 'atan');
  result = result.replace(/s\*i\*n\*h/g, 'sinh');
  result = result.replace(/c\*o\*s\*h/g, 'cosh');
  result = result.replace(/t\*a\*n\*h/g, 'tanh');
  result = result.replace(/n\*t\*h\*R\*o\*o\*t/g, 'nthRoot');
  result = result.replace(/l\*o\*g\*1\*0/g, 'log10');
  result = result.replace(/p\*i/g, 'pi');
  result = result.replace(/I\*n\*f\*i\*n\*i\*t\*y/g, 'Infinity');
  result = result.replace(/a\*l\*p\*h\*a/g, 'alpha');
  result = result.replace(/b\*e\*t\*a/g, 'beta');
  result = result.replace(/g\*a\*m\*m\*a/g, 'gamma');
  result = result.replace(/d\*e\*l\*t\*a/g, 'delta');
  result = result.replace(/e\*p\*s\*i\*l\*o\*n/g, 'epsilon');
  result = result.replace(/t\*h\*e\*t\*a/g, 'theta');
  result = result.replace(/l\*a\*m\*b\*d\*a/g, 'lambda');
  result = result.replace(/s\*i\*g\*m\*a/g, 'sigma');
  result = result.replace(/o\*m\*e\*g\*a/g, 'omega');
  result = result.replace(/m\*u/g, 'mu');
  result = result.replace(/p\*h\*i/g, 'phi');

  // Clean up spaces
  result = result.replace(/\s+/g, '');

  // Remove empty braces
  result = result.replace(/\{\}/g, '');

  return result;
}

/**
 * Extract variable from expression (for solve, derivative, integrate)
 */
export function extractVariable(latex: string): string {
  // Common single-letter variables
  const match = latex.match(/[a-zA-Z](?![a-zA-Z])/);
  if (match) {
    // Prefer x, then y, then z, then any other variable
    if (latex.includes('x')) return 'x';
    if (latex.includes('y')) return 'y';
    if (latex.includes('z')) return 'z';
    if (latex.includes('t')) return 't';
    return match[0];
  }
  return 'x'; // default
}
