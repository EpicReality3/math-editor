import { useState } from 'react';
import { BookOpen, Trash2, ChevronDown, ChevronRight, Star } from 'lucide-react';
import type { EquationTemplate } from '../types';

interface EquationTemplatesProps {
  templates: EquationTemplate[];
  categories: string[];
  onSelect: (latex: string) => void;
  onDelete: (id: string) => void;
}

export function EquationTemplates({ templates, categories, onSelect, onDelete }: EquationTemplatesProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const getTemplatesForCategory = (category: string) => {
    return templates.filter((t) => t.category === category);
  };

  const uncategorizedTemplates = templates.filter((t) => !t.category);

  if (templates.length === 0) return null;

  return (
    <div className="templates-card">
      <div className="card-header">
        <span className="label" onClick={() => setShowAll(!showAll)} style={{ cursor: 'pointer' }}>
          <BookOpen size={14} />
          Modèles ({templates.length})
          {showAll ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </div>

      {showAll && (
        <div className="templates-content">
          {categories.map((category) => {
            const categoryTemplates = getTemplatesForCategory(category);
            if (categoryTemplates.length === 0) return null;

            const isExpanded = expandedCategories.has(category);

            return (
              <div key={category} className="template-category">
                <button
                  className="category-header"
                  onClick={() => toggleCategory(category)}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>{category}</span>
                  <span className="category-count">{categoryTemplates.length}</span>
                </button>

                {isExpanded && (
                  <div className="template-list">
                    {categoryTemplates.map((template) => (
                      <TemplateItem
                        key={template.id}
                        template={template}
                        onSelect={onSelect}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {uncategorizedTemplates.length > 0 && (
            <div className="template-category">
              <button
                className="category-header"
                onClick={() => toggleCategory('__uncategorized__')}
                aria-expanded={expandedCategories.has('__uncategorized__')}
              >
                {expandedCategories.has('__uncategorized__') ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
                <span>Sans catégorie</span>
                <span className="category-count">{uncategorizedTemplates.length}</span>
              </button>

              {expandedCategories.has('__uncategorized__') && (
                <div className="template-list">
                  {uncategorizedTemplates.map((template) => (
                    <TemplateItem
                      key={template.id}
                      template={template}
                      onSelect={onSelect}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface TemplateItemProps {
  template: EquationTemplate;
  onSelect: (latex: string) => void;
  onDelete: (id: string) => void;
}

function TemplateItem({ template, onSelect, onDelete }: TemplateItemProps) {
  return (
    <div className="template-item">
      <button
        className="template-select"
        onClick={() => onSelect(template.latex)}
        title={`Utiliser: ${template.name}`}
      >
        <div className="template-info">
          <span className="template-name">
            {template.isDefault && <Star size={12} className="default-icon" />}
            {template.name}
          </span>
        </div>
        <div
          className="template-preview-small"
          dangerouslySetInnerHTML={{
            __html: `<math-field read-only style="font-size: 0.9rem; background: transparent; border: none; pointer-events: none;">${template.latex}</math-field>`,
          }}
        />
      </button>

      {!template.isDefault && (
        <button
          className="template-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(template.id);
          }}
          title="Supprimer ce modèle"
          aria-label={`Supprimer ${template.name}`}
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
