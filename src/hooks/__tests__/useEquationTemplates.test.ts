import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEquationTemplates } from '../useEquationTemplates';

describe('useEquationTemplates', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should include default templates', () => {
    const { result } = renderHook(() => useEquationTemplates());

    // Should have default templates
    expect(result.current.templates.length).toBeGreaterThan(0);
    expect(result.current.templates.some(t => t.isDefault)).toBe(true);
  });

  it('should add user template', () => {
    const { result } = renderHook(() => useEquationTemplates());
    const initialCount = result.current.templates.length;

    act(() => {
      result.current.addTemplate('My Equation', 'x = y + z', 'Custom');
    });

    expect(result.current.templates.length).toBe(initialCount + 1);
    expect(result.current.userTemplates).toHaveLength(1);
    expect(result.current.userTemplates[0].name).toBe('My Equation');
    expect(result.current.userTemplates[0].latex).toBe('x = y + z');
    expect(result.current.userTemplates[0].category).toBe('Custom');
    expect(result.current.userTemplates[0].isDefault).toBe(false);
  });

  it('should not remove default templates', () => {
    const { result } = renderHook(() => useEquationTemplates());
    const defaultTemplate = result.current.templates.find(t => t.isDefault);
    const initialCount = result.current.templates.length;

    if (defaultTemplate) {
      act(() => {
        result.current.removeTemplate(defaultTemplate.id);
      });

      // Count should remain the same
      expect(result.current.templates.length).toBe(initialCount);
    }
  });

  it('should remove user template', () => {
    const { result } = renderHook(() => useEquationTemplates());

    act(() => {
      result.current.addTemplate('To Remove', 'a = b');
    });

    const userTemplate = result.current.userTemplates[0];
    expect(result.current.userTemplates).toHaveLength(1);

    act(() => {
      result.current.removeTemplate(userTemplate.id);
    });

    expect(result.current.userTemplates).toHaveLength(0);
  });

  it('should update user template', () => {
    const { result } = renderHook(() => useEquationTemplates());

    act(() => {
      result.current.addTemplate('Original', 'original', 'Test');
    });

    const templateId = result.current.userTemplates[0].id;

    act(() => {
      result.current.updateTemplate(templateId, { name: 'Updated', latex: 'updated' });
    });

    expect(result.current.userTemplates[0].name).toBe('Updated');
    expect(result.current.userTemplates[0].latex).toBe('updated');
  });

  it('should return categories', () => {
    const { result } = renderHook(() => useEquationTemplates());

    // Default templates have categories
    expect(result.current.categories.length).toBeGreaterThan(0);
    expect(result.current.categories).toContain('Algèbre');
  });

  it('should get templates by category', () => {
    const { result } = renderHook(() => useEquationTemplates());

    const algebraTemplates = result.current.getTemplatesByCategory('Algèbre');
    expect(algebraTemplates.length).toBeGreaterThan(0);
    expect(algebraTemplates.every(t => t.category === 'Algèbre')).toBe(true);
  });

  it('should clear user templates', () => {
    const { result } = renderHook(() => useEquationTemplates());

    act(() => {
      result.current.addTemplate('A', 'a');
    });
    act(() => {
      result.current.addTemplate('B', 'b');
    });
    act(() => {
      result.current.clearUserTemplates();
    });

    expect(result.current.userTemplates).toHaveLength(0);
    // Default templates should still exist
    expect(result.current.templates.some(t => t.isDefault)).toBe(true);
  });
});
