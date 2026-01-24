import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, category?: string) => void;
  categories: string[];
  equation: string;
}

export function SaveTemplateModal({ isOpen, onClose, onSave, categories, equation }: SaveTemplateModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [useNewCategory, setUseNewCategory] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setCategory(categories[0] || '');
      setNewCategory('');
      setUseNewCategory(false);
    }
  }, [isOpen, categories]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalCategory = useNewCategory ? newCategory.trim() : category;
    onSave(name.trim(), finalCategory || undefined);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-template-title"
    >
      <div className="modal save-template-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="save-template-title">Sauvegarder comme modèle</h2>
          <button className="close-btn" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="save-template-form">
          <div className="form-group">
            <label htmlFor="template-name">Nom du modèle</label>
            <input
              id="template-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Formule de Newton"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label>Catégorie</label>
            <div className="category-options">
              {categories.length > 0 && (
                <label className="radio-label">
                  <input
                    type="radio"
                    name="category-type"
                    checked={!useNewCategory}
                    onChange={() => setUseNewCategory(false)}
                  />
                  <span>Existante</span>
                </label>
              )}
              <label className="radio-label">
                <input
                  type="radio"
                  name="category-type"
                  checked={useNewCategory || categories.length === 0}
                  onChange={() => setUseNewCategory(true)}
                />
                <span>Nouvelle</span>
              </label>
            </div>

            {!useNewCategory && categories.length > 0 ? (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ex: Physique"
                className="category-input"
              />
            )}
          </div>

          <div className="form-group">
            <label>Aperçu</label>
            <div
              className="template-preview"
              dangerouslySetInnerHTML={{
                __html: `<math-field read-only style="font-size: 1.2rem; background: transparent; border: none; pointer-events: none;">${equation}</math-field>`,
              }}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={!name.trim()}>
              <Save size={16} />
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
