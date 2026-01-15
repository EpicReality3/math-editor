# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-15

### Added

#### TypeScript Migration ✨
- Migrated entire codebase from JavaScript to TypeScript
- Added comprehensive type definitions in `src/types.ts`
- Configured tsconfig.json with strict mode enabled
- Full type safety across all components and hooks

#### Theme Persistence 💾
- Theme preference now persists in localStorage
- Automatic theme restoration on app startup
- Smooth transitions between light and dark modes

#### Equation History 📚
- Automatic saving of all equations (up to 50)
- History card with all saved equations
- Click to load previous equations
- Individual delete and clear all functionality
- Relative timestamps (e.g., "Il y a 5 min")
- LocalStorage persistence across sessions

#### Enhanced Export Functionality 📤
- Export equations as PNG images (3x resolution)
- Copy equation as image to clipboard
- Download PNG files with timestamps
- Theme-aware background colors
- High-quality rendering using html2canvas

#### Symbol Search 🔍
- Real-time search in symbol toolbar
- Filter symbols by name or display character
- Clear search button
- "No results" message when nothing matches
- Maintains category context during search

#### Improved Accessibility ♿
- ARIA labels on all interactive elements
- Proper button roles and states (aria-pressed, aria-label)
- Modal dialog with role="dialog" and aria-modal
- Enhanced keyboard navigation
- Screen reader friendly announcements

#### Testing Infrastructure 🧪
- Vitest configuration for unit testing
- React Testing Library setup
- Test coverage reporting (v8)
- Example tests for hooks and components
- npm scripts: `test`, `test:ui`, `test:coverage`
- Test setup with automatic cleanup

#### Documentation 📖
- Comprehensive README.md with:
  - Feature overview with emojis
  - Installation instructions
  - Development guides
  - Testing documentation
  - Project structure
  - Technology stack
  - Customization examples
  - Contribution guidelines
  - Roadmap
- IMPROVEMENTS.md with detailed future enhancements
- Inline code documentation
- This CHANGELOG

### Changed

#### Architecture
- Reorganized project structure with dedicated folders:
  - `/components` - React components
  - `/hooks` - Custom React hooks
  - `/utils` - Utility functions
  - `/test` - Test configuration
- Component organization with `__tests__` folders
- Cleaner imports with absolute types

#### Components
- **App.tsx**:
  - Now uses custom hooks (useLocalStorage, useEquationHistory)
  - Integrated all new features
  - Better state management
  - Enhanced keyboard shortcuts handler

- **MathToolbar.tsx**:
  - Added search functionality
  - Improved palette UI with actions section
  - Better responsive design
  - Memoized filtered symbols for performance

- **MathEditor.tsx**:
  - TypeScript types for better safety
  - Improved ref handling

- **EquationHistory.tsx** (NEW):
  - Complete history management UI
  - Elegant card design
  - Timestamp formatting

#### Styling
- Added CSS for search box
- New history card styles
- Export button styles
- Improved responsive design
- Better hover effects and animations
- Consistent spacing and colors

#### Developer Experience
- Hot module replacement (HMR) with TypeScript
- Better IDE autocomplete
- Type checking in build process
- Comprehensive test coverage
- Clear error messages

### Technical Details

#### New Dependencies
- `typescript` (5.9.3)
- `@types/node` (25.0.8)
- `html2canvas` (1.4.1)
- `vitest` (4.0.17)
- `@testing-library/react` (16.3.1)
- `@testing-library/jest-dom` (6.9.1)
- `@testing-library/user-event` (14.6.1)
- `@vitest/ui` (4.0.17)
- `jsdom` (27.4.0)

#### Custom Hooks
- `useLocalStorage<T>`: Generic localStorage hook with JSON serialization
- `useEquationHistory`: Complete equation history management

#### Utilities
- `export.ts`:
  - `exportAsPNG()` - Render equation to PNG blob
  - `exportAsSVG()` - Render equation to SVG string
  - `downloadBlob()` - Download file helper
  - `copyImageToClipboard()` - Clipboard API helper

#### Configuration Files
- `tsconfig.json` - TypeScript compiler config
- `tsconfig.node.json` - Node-specific TS config
- `vitest.config.ts` - Test runner configuration
- `src/test/setup.ts` - Test environment setup

### Performance
- Memoized symbol filtering with `useMemo`
- Debounced history saving (2 seconds)
- Lazy rendering of history items
- Optimized re-renders with proper dependencies

### Security
- No dangerous `eval()` or `Function()` usage
- Safe HTML sanitization with MathLive
- Secure localStorage access with try-catch
- Proper CORS handling for exports

---

## [1.0.0] - Initial Release

### Added
- Basic math editor with MathLive
- LaTeX code output
- Symbol toolbar with 8 categories
- Dark/Light theme toggle
- Copy LaTeX to clipboard
- Keyboard shortcuts
- Preview rendering
- Modern glassmorphism UI
- Tauri desktop app integration

---

## Future Releases

See [IMPROVEMENTS.md](IMPROVEMENTS.md) for planned features in upcoming versions.
