import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { defaultTemplates } from '../data/defaultTemplates';
import type { EquationTemplate } from '../types';

const MAX_TEMPLATES = 100;
const STORAGE_KEY = 'equation-templates';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function useEquationTemplates() {
  const [userTemplates, setUserTemplates] = useLocalStorage<EquationTemplate[]>(STORAGE_KEY, []);

  // Combine default templates with user templates
  const templates = useMemo(() => {
    const defaults: EquationTemplate[] = defaultTemplates.map((t, index) => ({
      ...t,
      id: `default-${index}`,
      createdAt: 0,
    }));
    return [...defaults, ...userTemplates];
  }, [userTemplates]);

  const addTemplate = useCallback((name: string, latex: string, category?: string) => {
    setUserTemplates((prev) => {
      // Check if we're at the limit
      if (prev.length >= MAX_TEMPLATES) {
        return prev;
      }

      const newTemplate: EquationTemplate = {
        id: generateId(),
        name,
        latex,
        category,
        createdAt: Date.now(),
        isDefault: false,
      };

      return [newTemplate, ...prev];
    });
  }, [setUserTemplates]);

  const removeTemplate = useCallback((id: string) => {
    // Can't remove default templates
    if (id.startsWith('default-')) return;

    setUserTemplates((prev) => prev.filter((t) => t.id !== id));
  }, [setUserTemplates]);

  const updateTemplate = useCallback((id: string, updates: Partial<Omit<EquationTemplate, 'id' | 'createdAt' | 'isDefault'>>) => {
    // Can't update default templates
    if (id.startsWith('default-')) return;

    setUserTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, [setUserTemplates]);

  const getTemplatesByCategory = useCallback((category: string) => {
    return templates.filter((t) => t.category === category);
  }, [templates]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    templates.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats).sort();
  }, [templates]);

  const clearUserTemplates = useCallback(() => {
    setUserTemplates([]);
  }, [setUserTemplates]);

  return {
    templates,
    userTemplates,
    categories,
    addTemplate,
    removeTemplate,
    updateTemplate,
    getTemplatesByCategory,
    clearUserTemplates,
  };
}
