declare module 'nerdamer' {
  interface NerdamerExpression {
    text(format?: 'latex' | 'fractions' | 'decimals'): string;
    toTeX(): string;
    evaluate(): NerdamerExpression;
    toString(): string;
    symbol: {
      multiplier: { num: number };
    };
  }

  interface Nerdamer {
    (expression: string, substitutions?: Record<string, string | number>, option?: string[]): NerdamerExpression;
    setVar(name: string, value: string | number): void;
    clearVars(): void;
    factor(expression: string): NerdamerExpression;
    expand(expression: string): NerdamerExpression;
    simplify(expression: string): NerdamerExpression;
    diff(expression: string, variable?: string, times?: number): NerdamerExpression;
    integrate(expression: string, variable?: string): NerdamerExpression;
    solve(expression: string, variable?: string): NerdamerExpression;
  }

  const nerdamer: Nerdamer;
  export = nerdamer;
}

declare module 'nerdamer/Calculus' {
  // Calculus extension - loaded for side effects
}

declare module 'nerdamer/Algebra' {
  // Algebra extension - loaded for side effects
}

declare module 'nerdamer/Solve' {
  // Solve extension - loaded for side effects
}
