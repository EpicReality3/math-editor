# Math Editor

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.9-FFC131.svg)](https://tauri.app/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> Un éditeur mathématique visuel moderne qui convertit vos équations en code LaTeX en temps réel.

## ✨ Fonctionnalités

### 🎯 Fonctionnalités Principales

- **Éditeur Visuel Intuitif** - Créez des équations mathématiques avec une interface WYSIWYG alimentée par [MathLive](https://cortexjs.io/mathlive/)
- **Conversion LaTeX en Temps Réel** - Voyez instantanément votre équation convertie en code LaTeX
- **Prévisualisation en Direct** - Visualisez le rendu final de votre équation
- **Copie Rapide** - Copiez le code LaTeX ou l'équation en tant qu'image en un clic

### 🎨 Interface & UX

- **Thèmes Clair/Sombre** - Basculez entre les thèmes avec persistance automatique
- **Design Moderne** - Interface élégante avec effets de verre (glassmorphism) et animations fluides
- **Responsive** - Fonctionne parfaitement sur desktop et mobile

### 🔧 Outils Avancés

- **Toolbar de Symboles** - Plus de 100 symboles mathématiques organisés par catégories :
  - Opérations (fractions, racines, exposants, etc.)
  - Calcul (intégrales, sommes, limites, etc.)
  - Lettres grecques (α, β, γ, etc.)
  - Relations (≤, ≥, ≈, etc.)
  - Ensembles (∈, ∪, ∩, etc.)
  - Flèches et implications
  - Matrices et vecteurs
  - Fonctions trigonométriques

- **Recherche de Symboles** - Trouvez rapidement les symboles dont vous avez besoin
- **Historique des Équations** - Toutes vos équations sont sauvegardées automatiquement (jusqu'à 50)
- **Export Multi-formats** :
  - PNG haute résolution (téléchargement)
  - Copie en tant qu'image (presse-papiers)
  - Code LaTeX (presse-papiers)

### ⌨️ Raccourcis Clavier

- `⌘/Ctrl + ⇧ + C` - Copier le code LaTeX
- `⌘/Ctrl + ⌫` - Effacer l'équation
- `⌘/Ctrl + /` - Afficher/masquer les raccourcis
- `Esc` - Fermer les fenêtres modales

**Dans l'éditeur MathLive :**
- `/` - Créer une fraction
- `^` - Exposant
- `_` - Indice
- `\sqrt` - Racine carrée
- `\int` - Intégrale
- `\sum` - Somme

### ♿ Accessibilité

- Labels ARIA sur tous les éléments interactifs
- Navigation au clavier complète
- Support des lecteurs d'écran
- Contraste élevé en mode clair et sombre

## 🚀 Installation

### Prérequis

- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Rust](https://www.rust-lang.org/) (pour la compilation Tauri)

### Installation des dépendances

```bash
npm install
```

## 💻 Développement

### Mode développement web

Lance l'application en mode développement web uniquement :

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Mode développement Tauri

Lance l'application desktop avec rechargement automatique :

```bash
npm run tauri:dev
```

### Build de production

```bash
# Build web uniquement
npm run build

# Build application desktop
npm run tauri:build
```

Les applications compilées seront disponibles dans `src-tauri/target/release/bundle/`

## 🧪 Tests

Le projet utilise [Vitest](https://vitest.dev/) et [React Testing Library](https://testing-library.com/react).

```bash
# Lancer les tests
npm test

# Interface UI pour les tests
npm run test:ui

# Couverture de code
npm run test:coverage
```

## 📁 Structure du Projet

```
math-editor/
├── src/
│   ├── components/          # Composants React
│   │   ├── MathEditor.tsx   # Éditeur MathLive
│   │   ├── MathToolbar.tsx  # Toolbar de symboles
│   │   ├── EquationHistory.tsx  # Historique
│   │   └── __tests__/       # Tests des composants
│   ├── hooks/               # Custom hooks React
│   │   ├── useLocalStorage.ts
│   │   ├── useEquationHistory.ts
│   │   └── __tests__/       # Tests des hooks
│   ├── utils/               # Utilitaires
│   │   └── export.ts        # Fonctions d'export
│   ├── types.ts             # Types TypeScript
│   ├── App.tsx              # Composant principal
│   ├── main.tsx             # Point d'entrée
│   └── index.css            # Styles globaux
├── src-tauri/               # Configuration Tauri
├── public/                  # Assets statiques
├── IMPROVEMENTS.md          # Roadmap et améliorations proposées
└── README.md                # Ce fichier
```

## 🛠️ Technologies

### Frontend
- **[React](https://reactjs.org/)** 19.2 - Bibliothèque UI
- **[TypeScript](https://www.typescriptlang.org/)** 5.9 - Typage statique
- **[Vite](https://vitejs.dev/)** 7.2 - Build tool ultra-rapide
- **[MathLive](https://cortexjs.io/mathlive/)** 0.108 - Éditeur d'équations mathématiques
- **[Lucide React](https://lucide.dev/)** - Icônes modernes
- **[html2canvas](https://html2canvas.hertzen.com/)** - Export en image

### Desktop
- **[Tauri](https://tauri.app/)** 2.9 - Framework pour applications desktop

### Tests
- **[Vitest](https://vitest.dev/)** - Framework de tests
- **[React Testing Library](https://testing-library.com/react)** - Tests de composants

## 🎨 Personnalisation

### Thèmes

Les thèmes sont définis dans `src/index.css` avec des variables CSS :

```css
:root {
  --accent: #6366f1;
  --bg-primary: #0a0a0f;
  /* ... */
}

.light {
  --accent: #4f46e5;
  --bg-primary: #fafafa;
  /* ... */
}
```

### Symboles

Ajoutez de nouveaux symboles dans `src/components/MathToolbar.tsx` :

```typescript
const symbolCategories = {
  myCategory: {
    label: 'Ma Catégorie',
    icon: '∑',
    symbols: [
      { latex: '\\mycommand', display: '∑', label: 'Mon symbole' },
    ]
  }
}
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez [IMPROVEMENTS.md](IMPROVEMENTS.md) pour voir les améliorations planifiées.

### Processus de contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Guidelines

- Écrivez des tests pour les nouvelles fonctionnalités
- Suivez le style de code existant
- Mettez à jour la documentation si nécessaire
- Assurez-vous que tous les tests passent (`npm test`)

## 📝 Roadmap

Consultez [IMPROVEMENTS.md](IMPROVEMENTS.md) pour la liste complète des améliorations planifiées.

### Court terme (Phase 2)
- [ ] Context API pour la gestion d'état
- [ ] Error Boundaries
- [ ] Templates d'équations
- [ ] Raccourcis personnalisables
- [ ] Mode split LaTeX/Rendu

### Moyen terme (Phase 3)
- [ ] Support multilingue (i18n)
- [ ] Thèmes personnalisés
- [ ] CI/CD
- [ ] Bibliothèque de macros
- [ ] Drag & Drop

### Long terme (Phase 4)
- [ ] OCR Math (reconnaissance d'équations manuscrites)
- [ ] Calculatrice intégrée
- [ ] Système de plugins
- [ ] Collaboration temps réel

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [MathLive](https://cortexjs.io/mathlive/) pour l'excellent éditeur d'équations
- [Tauri](https://tauri.app/) pour le framework desktop moderne
- [Lucide](https://lucide.dev/) pour les icônes élégantes

---

Fait avec ❤️ pour la communauté mathématique et scientifique
