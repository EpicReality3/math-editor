import type { SymbolCategories } from '../types';

export const symbolCategories: SymbolCategories = {
  operations: {
    label: 'Opérations',
    icon: '±',
    symbols: [
      { latex: '\\frac{#0}{#1}', display: '⁄', label: 'Fraction' },
      { latex: '\\sqrt{#0}', display: '√', label: 'Racine carrée' },
      { latex: '\\sqrt[#0]{#1}', display: 'ⁿ√', label: 'Racine n-ième' },
      { latex: '^{#0}', display: 'xⁿ', label: 'Exposant' },
      { latex: '_{#0}', display: 'xₙ', label: 'Indice' },
      { latex: '\\pm', display: '±', label: 'Plus ou moins' },
      { latex: '\\mp', display: '∓', label: 'Moins ou plus' },
      { latex: '\\times', display: '×', label: 'Multiplication' },
      { latex: '\\div', display: '÷', label: 'Division' },
      { latex: '\\cdot', display: '·', label: 'Point' },
    ]
  },
  calculus: {
    label: 'Calcul',
    icon: '∫',
    symbols: [
      { latex: '\\int_{#0}^{#1}', display: '∫', label: 'Intégrale' },
      { latex: '\\iint', display: '∬', label: 'Intégrale double' },
      { latex: '\\iiint', display: '∭', label: 'Intégrale triple' },
      { latex: '\\oint', display: '∮', label: 'Intégrale de contour' },
      { latex: '\\sum_{#0}^{#1}', display: '∑', label: 'Somme' },
      { latex: '\\prod_{#0}^{#1}', display: '∏', label: 'Produit' },
      { latex: '\\lim_{#0}', display: 'lim', label: 'Limite' },
      { latex: '\\partial', display: '∂', label: 'Dérivée partielle' },
      { latex: '\\nabla', display: '∇', label: 'Nabla' },
      { latex: '\\infty', display: '∞', label: 'Infini' },
    ]
  },
  greek: {
    label: 'Grec',
    icon: 'α',
    symbols: [
      { latex: '\\alpha', display: 'α', label: 'alpha' },
      { latex: '\\beta', display: 'β', label: 'beta' },
      { latex: '\\gamma', display: 'γ', label: 'gamma' },
      { latex: '\\delta', display: 'δ', label: 'delta' },
      { latex: '\\epsilon', display: 'ε', label: 'epsilon' },
      { latex: '\\theta', display: 'θ', label: 'theta' },
      { latex: '\\lambda', display: 'λ', label: 'lambda' },
      { latex: '\\mu', display: 'μ', label: 'mu' },
      { latex: '\\pi', display: 'π', label: 'pi' },
      { latex: '\\sigma', display: 'σ', label: 'sigma' },
      { latex: '\\phi', display: 'φ', label: 'phi' },
      { latex: '\\omega', display: 'ω', label: 'omega' },
      { latex: '\\Gamma', display: 'Γ', label: 'Gamma' },
      { latex: '\\Delta', display: 'Δ', label: 'Delta' },
      { latex: '\\Theta', display: 'Θ', label: 'Theta' },
      { latex: '\\Omega', display: 'Ω', label: 'Omega' },
    ]
  },
  relations: {
    label: 'Relations',
    icon: '≤',
    symbols: [
      { latex: '\\leq', display: '≤', label: 'Inférieur ou égal' },
      { latex: '\\geq', display: '≥', label: 'Supérieur ou égal' },
      { latex: '\\neq', display: '≠', label: 'Différent' },
      { latex: '\\approx', display: '≈', label: 'Approximativement' },
      { latex: '\\equiv', display: '≡', label: 'Équivalent' },
      { latex: '\\sim', display: '∼', label: 'Similaire' },
      { latex: '\\propto', display: '∝', label: 'Proportionnel' },
      { latex: '\\ll', display: '≪', label: 'Très inférieur' },
      { latex: '\\gg', display: '≫', label: 'Très supérieur' },
      { latex: '\\perp', display: '⊥', label: 'Perpendiculaire' },
      { latex: '\\parallel', display: '∥', label: 'Parallèle' },
    ]
  },
  sets: {
    label: 'Ensembles',
    icon: '∈',
    symbols: [
      { latex: '\\in', display: '∈', label: 'Appartient' },
      { latex: '\\notin', display: '∉', label: 'N\'appartient pas' },
      { latex: '\\subset', display: '⊂', label: 'Sous-ensemble' },
      { latex: '\\subseteq', display: '⊆', label: 'Sous-ensemble ou égal' },
      { latex: '\\supset', display: '⊃', label: 'Sur-ensemble' },
      { latex: '\\cup', display: '∪', label: 'Union' },
      { latex: '\\cap', display: '∩', label: 'Intersection' },
      { latex: '\\emptyset', display: '∅', label: 'Ensemble vide' },
      { latex: '\\forall', display: '∀', label: 'Pour tout' },
      { latex: '\\exists', display: '∃', label: 'Il existe' },
      { latex: '\\mathbb{R}', display: 'ℝ', label: 'Réels' },
      { latex: '\\mathbb{N}', display: 'ℕ', label: 'Naturels' },
      { latex: '\\mathbb{Z}', display: 'ℤ', label: 'Entiers' },
      { latex: '\\mathbb{C}', display: 'ℂ', label: 'Complexes' },
    ]
  },
  arrows: {
    label: 'Flèches',
    icon: '→',
    symbols: [
      { latex: '\\rightarrow', display: '→', label: 'Flèche droite' },
      { latex: '\\leftarrow', display: '←', label: 'Flèche gauche' },
      { latex: '\\leftrightarrow', display: '↔', label: 'Double flèche' },
      { latex: '\\Rightarrow', display: '⇒', label: 'Implique' },
      { latex: '\\Leftarrow', display: '⇐', label: 'Est impliqué par' },
      { latex: '\\Leftrightarrow', display: '⇔', label: 'Équivalent' },
      { latex: '\\mapsto', display: '↦', label: 'Correspond à' },
      { latex: '\\uparrow', display: '↑', label: 'Flèche haut' },
      { latex: '\\downarrow', display: '↓', label: 'Flèche bas' },
    ]
  },
  matrices: {
    label: 'Matrices',
    icon: '[ ]',
    symbols: [
      { latex: '\\begin{pmatrix} #0 & #1 \\\\ #2 & #3 \\end{pmatrix}', display: '(  )', label: 'Matrice 2×2 ronde' },
      { latex: '\\begin{bmatrix} #0 & #1 \\\\ #2 & #3 \\end{bmatrix}', display: '[  ]', label: 'Matrice 2×2 carrée' },
      { latex: '\\begin{vmatrix} #0 & #1 \\\\ #2 & #3 \\end{vmatrix}', display: '|  |', label: 'Déterminant 2×2' },
      { latex: '\\vec{#0}', display: 'v⃗', label: 'Vecteur' },
      { latex: '\\hat{#0}', display: 'v̂', label: 'Chapeau' },
      { latex: '\\bar{#0}', display: 'v̄', label: 'Barre' },
      { latex: '\\dot{#0}', display: 'v̇', label: 'Point' },
      { latex: '\\ddot{#0}', display: 'v̈', label: 'Double point' },
    ]
  },
  functions: {
    label: 'Fonctions',
    icon: 'sin',
    symbols: [
      { latex: '\\sin', display: 'sin', label: 'Sinus' },
      { latex: '\\cos', display: 'cos', label: 'Cosinus' },
      { latex: '\\tan', display: 'tan', label: 'Tangente' },
      { latex: '\\arcsin', display: 'arcsin', label: 'Arc sinus' },
      { latex: '\\arccos', display: 'arccos', label: 'Arc cosinus' },
      { latex: '\\arctan', display: 'arctan', label: 'Arc tangente' },
      { latex: '\\ln', display: 'ln', label: 'Log naturel' },
      { latex: '\\log', display: 'log', label: 'Logarithme' },
      { latex: '\\exp', display: 'exp', label: 'Exponentielle' },
      { latex: 'e^{#0}', display: 'eˣ', label: 'e puissance' },
    ]
  },
};
