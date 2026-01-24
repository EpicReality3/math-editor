import { useLocalStorage } from './useLocalStorage';

export type ViewMode = 'visual' | 'split' | 'latex' | 'latex-to-visual';

export function useViewMode() {
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('view-mode', 'visual');
  return { viewMode, setViewMode };
}
