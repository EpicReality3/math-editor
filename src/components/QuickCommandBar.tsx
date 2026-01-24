import { useState, useRef } from 'react';
import { Pin, PinOff, X, Clock, Star, Trash2, GripVertical } from 'lucide-react';
import type { QuickCommand } from '../hooks/useQuickCommands';

interface QuickCommandBarProps {
  pinnedCommands: QuickCommand[];
  recentCommands: QuickCommand[];
  frequentCommands: QuickCommand[];
  onInsert: (latex: string) => void;
  onTogglePin: (id: string) => void;
  onRemove: (id: string) => void;
  onClearRecent: () => void;
  onReorder?: (draggedId: string, targetId: string, section: 'pinned' | 'recent') => void;
}

export function QuickCommandBar({
  pinnedCommands,
  recentCommands,
  frequentCommands,
  onInsert,
  onTogglePin,
  onRemove,
  onClearRecent,
  onReorder,
}: QuickCommandBarProps) {
  const hasCommands = pinnedCommands.length > 0 || recentCommands.length > 0;
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<'pinned' | 'recent' | null>(null);

  if (!hasCommands) {
    return (
      <div className="quick-command-bar quick-command-bar--empty">
        <span className="quick-command-hint">
          Les commandes que vous utilisez apparaîtront ici pour un accès rapide
        </span>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, id: string, section: 'pinned' | 'recent') => {
    setDraggedId(id);
    setCurrentSection(section);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);

    // Add dragging class after a small delay for visual feedback
    const target = e.currentTarget as HTMLElement;
    setTimeout(() => {
      target.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('dragging');
    setDraggedId(null);
    setDragOverId(null);
    setCurrentSection(null);
  };

  const handleDragOver = (e: React.DragEvent, id: string, section: 'pinned' | 'recent') => {
    e.preventDefault();
    // Only allow dropping in the same section
    if (currentSection === section && id !== draggedId) {
      setDragOverId(id);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string, section: 'pinned' | 'recent') => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId && currentSection === section && onReorder) {
      onReorder(draggedId, targetId, section);
    }
    setDraggedId(null);
    setDragOverId(null);
    setCurrentSection(null);
  };

  return (
    <div className="quick-command-bar">
      {/* Pinned Commands Section */}
      {pinnedCommands.length > 0 && (
        <div className="command-section pinned-section">
          <div className="section-label">
            <Pin size={12} />
            <span>Épinglés</span>
          </div>
          <div className="command-list">
            {pinnedCommands.map((cmd) => (
              <CommandButton
                key={cmd.id}
                command={cmd}
                section="pinned"
                isDragging={draggedId === cmd.id}
                isDragOver={dragOverId === cmd.id}
                onInsert={onInsert}
                onTogglePin={onTogglePin}
                onRemove={onRemove}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                draggable={!!onReorder}
              />
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      {pinnedCommands.length > 0 && recentCommands.length > 0 && (
        <div className="command-divider" />
      )}

      {/* Recent Commands Section */}
      {recentCommands.length > 0 && (
        <div className="command-section recent-section">
          <div className="section-header">
            <div className="section-label">
              <Clock size={12} />
              <span>Récents</span>
            </div>
            <button
              className="clear-recent-btn"
              onClick={onClearRecent}
              title="Effacer les récents"
            >
              <Trash2 size={12} />
            </button>
          </div>
          <div className="command-list">
            {recentCommands.slice(0, 8).map((cmd) => (
              <CommandButton
                key={cmd.id}
                command={cmd}
                section="recent"
                isDragging={draggedId === cmd.id}
                isDragOver={dragOverId === cmd.id}
                onInsert={onInsert}
                onTogglePin={onTogglePin}
                onRemove={onRemove}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                draggable={!!onReorder}
              />
            ))}
          </div>
        </div>
      )}

      {/* Frequent Commands (shown as suggestions) */}
      {frequentCommands.length > 0 && recentCommands.length === 0 && (
        <div className="command-section frequent-section">
          <div className="section-label">
            <Star size={12} />
            <span>Fréquents</span>
          </div>
          <div className="command-list">
            {frequentCommands.slice(0, 6).map((cmd) => (
              <CommandButton
                key={cmd.id}
                command={cmd}
                section="recent"
                isDragging={false}
                isDragOver={false}
                onInsert={onInsert}
                onTogglePin={onTogglePin}
                onRemove={onRemove}
                draggable={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface CommandButtonProps {
  command: QuickCommand;
  section: 'pinned' | 'recent';
  isDragging: boolean;
  isDragOver: boolean;
  onInsert: (latex: string) => void;
  onTogglePin: (id: string) => void;
  onRemove: (id: string) => void;
  onDragStart?: (e: React.DragEvent, id: string, section: 'pinned' | 'recent') => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent, id: string, section: 'pinned' | 'recent') => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent, id: string, section: 'pinned' | 'recent') => void;
  draggable: boolean;
}

function CommandButton({
  command,
  section,
  isDragging,
  isDragOver,
  onInsert,
  onTogglePin,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  draggable,
}: CommandButtonProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={itemRef}
      className={`command-item ${command.isPinned ? 'pinned' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, command.id, section)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver?.(e, command.id, section)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop?.(e, command.id, section)}
    >
      {draggable && (
        <div className="drag-handle" title="Glisser pour réorganiser">
          <GripVertical size={12} />
        </div>
      )}
      <button
        className="command-btn"
        onClick={() => onInsert(command.latex)}
        title={`${command.label} (${command.latex})`}
      >
        <span className="command-label">{command.label}</span>
        {command.usageCount > 1 && (
          <span className="usage-count">{command.usageCount}</span>
        )}
      </button>
      <div className="command-actions">
        <button
          className="action-btn pin-btn"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(command.id);
          }}
          title={command.isPinned ? 'Désépingler' : 'Épingler'}
        >
          {command.isPinned ? <PinOff size={12} /> : <Pin size={12} />}
        </button>
        <button
          className="action-btn remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(command.id);
          }}
          title="Supprimer"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
