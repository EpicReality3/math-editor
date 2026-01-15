import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MathToolbar from '../MathToolbar';

describe('MathToolbar', () => {
  it('should render all category buttons', () => {
    const mockOnInsert = vi.fn();
    render(<MathToolbar onInsert={mockOnInsert} />);

    expect(screen.getByTitle('Opérations')).toBeInTheDocument();
    expect(screen.getByTitle('Calcul')).toBeInTheDocument();
    expect(screen.getByTitle('Grec')).toBeInTheDocument();
    expect(screen.getByTitle('Relations')).toBeInTheDocument();
  });

  it('should open symbol palette when category is clicked', () => {
    const mockOnInsert = vi.fn();
    render(<MathToolbar onInsert={mockOnInsert} />);

    const operationsBtn = screen.getByTitle('Opérations');
    fireEvent.click(operationsBtn);

    // Check if palette is visible by looking for a symbol from the operations category
    expect(screen.getByTitle('Fraction')).toBeInTheDocument();
  });

  it('should call onInsert when symbol is clicked', () => {
    const mockOnInsert = vi.fn();
    render(<MathToolbar onInsert={mockOnInsert} />);

    // Open operations category
    const operationsBtn = screen.getByTitle('Opérations');
    fireEvent.click(operationsBtn);

    // Click on fraction symbol
    const fractionBtn = screen.getByTitle('Fraction');
    fireEvent.click(fractionBtn);

    expect(mockOnInsert).toHaveBeenCalledWith('\\frac{#0}{#1}');
  });
});
