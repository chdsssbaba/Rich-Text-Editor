# Rich Text Editor

A feature-rich, highly accessible rich text editor component built with React, TypeScript, and Tailwind CSS. The project demonstrates advanced local state management with `useReducer` and the Context API, full keyboard navigation support, and comprehensive unit and integration testing.

## Key Features

- **Rich Text Formatting**: Bold, italic, underline, and multiple heading levels (H1-H3).
- **Undo/Redo System**: Full history stack tracking with custom limit management.
- **Collaborator Presence**: Simulated real-time collaboration displays.
- **Keyboard Shortcuts**: Native support for standard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y).
- **Accessibility (WCAG 2.1 AA)**: Proper ARIA roles, states, and keyboard focus management.
- **Docker Support**: Containerized build and local environment setups.
- **Testing**: Over 90% coverage with Unit and Integration tests using Vitest and React Testing Library.

## Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chdsssbaba/Rich-Text-Editor.git
   cd Rich-Text-Editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The editor will run locally at `http://localhost:5173`.

## Docker Deployment

To build and run in a production-like environment:

```bash
docker-compose up --build
```
Access the application at `http://localhost:3000`.

## Testing

Run tests and verification:

```bash
# Run tests
npm test

# Run lint checks
npm run lint

# Build production bundle
npm run build
```

## Architecture & Implementation

### Component Structure

- `src/components/RichTextEditor/`
  - `RichTextEditor.tsx`: Main entrypoint wrapper.
  - `EditorToolbar.tsx`: Top bar containing format buttons and undo/redo triggers.
  - `EditorContent.tsx`: contentEditable area with custom command listener.
  - `PresenceIndicators.tsx`: Collaboration avatars and count.
  - `LoadingState.tsx`: UI loader fallback.
  - `contexts/EditorContext.tsx`: Wraps context provider to avoid prop drilling.
  - `hooks/useEditorReducer.ts`: Handles state transitions (history, content, styles).
  - `utils/editorUtils.ts`: Sanitization and debounce/throttle utilities.

### State Management
- **useReducer**: Coordinates editor content edits, history tracking, and loading actions.
- **Context API**: Distributes editor state and actions cleanly across toolbar, editable area, and indicator sub-components.
- **Optimized updates**: Features custom debounced history-pushing and throttled change triggers to keep UI updates smooth.

## Accessibility Details

- **Semantic Roles**: Proper toolbar and textbox ARIA definitions.
- **Interaction**: Focus indicators and toggle states represent visual operations.
- **Key bindings**: Custom keyboard capturing maps shortcuts directly to corresponding execCommand calls.
