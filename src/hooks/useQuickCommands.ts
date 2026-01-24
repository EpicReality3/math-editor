import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface QuickCommand {
  id: string;
  latex: string;
  label: string;
  category: string;
  usageCount: number;
  lastUsed: number;
  isPinned: boolean;
  order?: number; // For custom ordering when pinned
}

const MAX_RECENT_COMMANDS = 12;

export function useQuickCommands() {
  const [commands, setCommands] = useLocalStorage<QuickCommand[]>('quick-commands', []);

  const trackCommand = useCallback((latex: string, label: string, category: string) => {
    setCommands((prev) => {
      const id = `${category}-${latex}`;
      const existingIndex = prev.findIndex((cmd) => cmd.id === id);

      if (existingIndex >= 0) {
        // Update existing command
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          usageCount: updated[existingIndex].usageCount + 1,
          lastUsed: Date.now(),
        };
        return updated;
      }

      // Add new command
      const newCommand: QuickCommand = {
        id,
        latex,
        label,
        category,
        usageCount: 1,
        lastUsed: Date.now(),
        isPinned: false,
      };

      // Keep only recent non-pinned commands + all pinned
      const pinned = prev.filter((cmd) => cmd.isPinned);
      const recent = prev
        .filter((cmd) => !cmd.isPinned)
        .sort((a, b) => b.lastUsed - a.lastUsed)
        .slice(0, MAX_RECENT_COMMANDS - 1);

      return [...pinned, newCommand, ...recent];
    });
  }, [setCommands]);

  const togglePin = useCallback((id: string) => {
    setCommands((prev) => {
      const maxOrder = Math.max(0, ...prev.filter(c => c.isPinned).map(c => c.order ?? 0));
      return prev.map((cmd) =>
        cmd.id === id
          ? { ...cmd, isPinned: !cmd.isPinned, order: !cmd.isPinned ? maxOrder + 1 : undefined }
          : cmd
      );
    });
  }, [setCommands]);

  const removeCommand = useCallback((id: string) => {
    setCommands((prev) => prev.filter((cmd) => cmd.id !== id));
  }, [setCommands]);

  const clearRecent = useCallback(() => {
    setCommands((prev) => prev.filter((cmd) => cmd.isPinned));
  }, [setCommands]);

  const pinSymbol = useCallback((latex: string, label: string, category: string) => {
    setCommands((prev) => {
      const id = `${category}-${latex}`;
      const existing = prev.find((cmd) => cmd.id === id);

      // If already exists, just ensure it's pinned
      if (existing) {
        if (existing.isPinned) return prev; // Already pinned
        const maxOrder = Math.max(0, ...prev.filter(c => c.isPinned).map(c => c.order ?? 0));
        return prev.map((cmd) =>
          cmd.id === id ? { ...cmd, isPinned: true, order: maxOrder + 1 } : cmd
        );
      }

      // Create new pinned command
      const maxOrder = Math.max(0, ...prev.filter(c => c.isPinned).map(c => c.order ?? 0));
      const newCommand: QuickCommand = {
        id,
        latex,
        label,
        category,
        usageCount: 0,
        lastUsed: Date.now(),
        isPinned: true,
        order: maxOrder + 1,
      };

      return [...prev, newCommand];
    });
  }, [setCommands]);

  const reorderCommands = useCallback((draggedId: string, targetId: string, section: 'pinned' | 'recent') => {
    setCommands((prev) => {
      const updated = [...prev];
      const draggedIndex = updated.findIndex((cmd) => cmd.id === draggedId);
      const targetIndex = updated.findIndex((cmd) => cmd.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      // For pinned commands, we reorder by updating the order field
      if (section === 'pinned') {
        const pinnedCmds = updated.filter(c => c.isPinned).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const draggedCmd = pinnedCmds.find(c => c.id === draggedId);
        const targetCmd = pinnedCmds.find(c => c.id === targetId);

        if (!draggedCmd || !targetCmd) return prev;

        const draggedOrder = draggedCmd.order ?? 0;
        const targetOrder = targetCmd.order ?? 0;

        // Swap orders
        return updated.map(cmd => {
          if (cmd.id === draggedId) {
            return { ...cmd, order: targetOrder };
          }
          if (cmd.id === targetId) {
            return { ...cmd, order: draggedOrder };
          }
          return cmd;
        });
      }

      // For recent commands, we just swap positions in the array
      const [draggedItem] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, draggedItem);

      return updated;
    });
  }, [setCommands]);

  // Get pinned commands (sorted by order, then by label)
  const pinnedCommands = commands
    .filter((cmd) => cmd.isPinned)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Get recent commands (sorted by last used, excluding pinned)
  const recentCommands = commands
    .filter((cmd) => !cmd.isPinned)
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .slice(0, MAX_RECENT_COMMANDS);

  // Get frequently used commands (sorted by usage count)
  const frequentCommands = commands
    .filter((cmd) => !cmd.isPinned && cmd.usageCount > 1)
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 6);

  return {
    pinnedCommands,
    recentCommands,
    frequentCommands,
    trackCommand,
    togglePin,
    pinSymbol,
    removeCommand,
    clearRecent,
    reorderCommands,
  };
}
