import type { EquationTemplate } from '../types';

export const defaultTemplates: Omit<EquationTemplate, 'id' | 'createdAt'>[] = [
  // Algèbre
  {
    name: 'Formule quadratique',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
    category: 'Algèbre',
    isDefault: true,
  },
  {
    name: 'Identité remarquable (a+b)²',
    latex: '(a+b)^2 = a^2 + 2ab + b^2',
    category: 'Algèbre',
    isDefault: true,
  },
  {
    name: 'Identité remarquable (a-b)²',
    latex: '(a-b)^2 = a^2 - 2ab + b^2',
    category: 'Algèbre',
    isDefault: true,
  },

  // Calcul
  {
    name: 'Définition de la dérivée',
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
    category: 'Calcul',
    isDefault: true,
  },
  {
    name: 'Intégrale définie',
    latex: '\\int_{a}^{b} f(x) \\, dx',
    category: 'Calcul',
    isDefault: true,
  },
  {
    name: 'Série de Taylor',
    latex: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n',
    category: 'Calcul',
    isDefault: true,
  },

  // Trigonométrie
  {
    name: 'Identité de Pythagore',
    latex: '\\sin^2(x) + \\cos^2(x) = 1',
    category: 'Trigonométrie',
    isDefault: true,
  },
  {
    name: 'Formule d\'Euler',
    latex: 'e^{i\\theta} = \\cos(\\theta) + i\\sin(\\theta)',
    category: 'Trigonométrie',
    isDefault: true,
  },

  // Matrices
  {
    name: 'Matrice 2×2',
    latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
    category: 'Matrices',
    isDefault: true,
  },
  {
    name: 'Déterminant 2×2',
    latex: '\\det(A) = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc',
    category: 'Matrices',
    isDefault: true,
  },

  // Statistiques
  {
    name: 'Moyenne',
    latex: '\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i',
    category: 'Statistiques',
    isDefault: true,
  },
  {
    name: 'Écart-type',
    latex: '\\sigma = \\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2}',
    category: 'Statistiques',
    isDefault: true,
  },
];
