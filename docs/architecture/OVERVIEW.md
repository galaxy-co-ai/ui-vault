# Architecture Overview

> A clean separation of concerns enabling rapid iteration and reliable performance.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        UI Vault Desktop App                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    React Frontend (WebView)                 │ │
│  │                                                             │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │ │
│  │  │ Components  │  │   Stores    │  │    Lib/Utilities    │ │ │
│  │  │  (UI/Layout │  │  (Zustand)  │  │  (Tokens/Schemas/   │ │ │
│  │  │  /Features) │  │             │  │   Exporters/Utils)  │ │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘ │ │
│  │                           │                                 │ │
│  └───────────────────────────┼─────────────────────────────────┘ │
│                              │ Tauri Commands (IPC)              │
│  ┌───────────────────────────┼─────────────────────────────────┐ │
│  │                    Rust Backend (Tauri)                     │ │
│  │                           │                                 │ │
│  │  ┌─────────────┐  ┌──────┴──────┐  ┌─────────────────────┐ │ │
│  │  │   Commands  │  │   SQLite    │  │   File System       │ │ │
│  │  │   (API)     │  │  Database   │  │   Operations        │ │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘ │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │     Local Storage     │
                    │  ~/.ui-vault/data.db  │
                    └───────────────────────┘
```

---

## Layer Responsibilities

### 1. React Frontend

**Location:** `/src`

The presentation layer. Handles all user interaction, rendering, and client-side state.

| Directory | Responsibility |
|-----------|---------------|
| `/components/ui` | Primitive, reusable UI components |
| `/components/layout` | Page structure, navigation |
| `/components/features` | Feature-specific, composed components |
| `/hooks` | Custom React hooks |
| `/stores` | Zustand state stores |
| `/lib/tokens` | Design system tokens |
| `/lib/schemas` | Zod validation schemas |
| `/lib/exporters` | Code generation utilities |
| `/lib/utils` | Helper functions |
| `/types` | TypeScript type definitions |
| `/styles` | Global styles, Tailwind config |

### 2. Rust Backend

**Location:** `/src-tauri`

The system layer. Handles data persistence, file operations, and native functionality.

| Module | Responsibility |
|--------|---------------|
| `main.rs` | Application entry, window setup |
| `commands.rs` | Tauri command handlers (API) |
| `db.rs` | SQLite database operations |
| `export.rs` | File generation and saving |
| `models.rs` | Data structures |

### 3. Data Layer

**Location:** `~/.ui-vault/` (user's home directory)

| File | Contents |
|------|----------|
| `data.db` | SQLite database (styles, metadata) |
| `exports/` | Generated export files (temporary) |
| `backups/` | Automatic database backups |

---

## Data Flow

### Reading Style Collections

```
User Action          Frontend              Backend              Storage
     │                   │                    │                    │
     │  Click List   ────►                    │                    │
     │                   │                    │                    │
     │                   │  invoke('get_styles')                   │
     │                   ├────────────────────►                    │
     │                   │                    │                    │
     │                   │                    │  SELECT * FROM     │
     │                   │                    ├────────────────────►
     │                   │                    │                    │
     │                   │                    │◄── Result ─────────┤
     │                   │                    │                    │
     │                   │◄── StyleCollection[]                    │
     │                   │                    │                    │
     │                   │  Update Zustand    │                    │
     │                   │  Store             │                    │
     │                   │                    │                    │
     │◄── Render List ───┤                    │                    │
     │                   │                    │                    │
```

### Exporting a Style

```
User Action          Frontend              Backend              File System
     │                   │                    │                    │
     │  Click Export ────►                    │                    │
     │                   │                    │                    │
     │                   │  Generate config   │                    │
     │                   │  (client-side)     │                    │
     │                   │                    │                    │
     │                   │  invoke('save_file', config)            │
     │                   ├────────────────────►                    │
     │                   │                    │                    │
     │                   │                    │  Dialog → Write    │
     │                   │                    ├────────────────────►
     │                   │                    │                    │
     │                   │◄── Success/Path ───┤                    │
     │                   │                    │                    │
     │◄── Toast ─────────┤                    │                    │
```

---

## State Management

### Zustand Store Structure

```typescript
// stores/styleStore.ts
interface StyleStore {
  // Data
  styles: StyleCollection[];
  selectedId: string | null;
  
  // UI State
  isLoading: boolean;
  searchQuery: string;
  activeFilters: string[];
  
  // Actions
  loadStyles: () => Promise<void>;
  selectStyle: (id: string) => void;
  createStyle: (data: CreateStyleInput) => Promise<void>;
  updateStyle: (id: string, data: UpdateStyleInput) => Promise<void>;
  deleteStyle: (id: string) => Promise<void>;
  duplicateStyle: (id: string) => Promise<void>;
  
  // Search & Filter
  setSearchQuery: (query: string) => void;
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
  
  // Computed (via selectors)
  filteredStyles: () => StyleCollection[];
  selectedStyle: () => StyleCollection | null;
}
```

### Why Zustand?

- Minimal boilerplate
- No context providers needed
- Built-in devtools
- Easy persistence
- TypeScript-first

---

## Communication: Tauri Commands

Frontend communicates with backend via Tauri's invoke API.

### Command Pattern

```rust
// src-tauri/src/commands.rs
#[tauri::command]
async fn get_styles(db: State<'_, Database>) -> Result<Vec<StyleCollection>, String> {
    db.get_all_styles()
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn create_style(
    db: State<'_, Database>,
    input: CreateStyleInput
) -> Result<StyleCollection, String> {
    db.create_style(input)
        .map_err(|e| e.to_string())
}
```

```typescript
// Frontend usage
import { invoke } from '@tauri-apps/api/core';

const styles = await invoke<StyleCollection[]>('get_styles');
const newStyle = await invoke<StyleCollection>('create_style', { input: data });
```

---

## Database Schema

See [DATA-MODEL.md](./DATA-MODEL.md) for complete schema definitions.

### Tables Overview

| Table | Purpose |
|-------|---------|
| `styles` | Style collection metadata |
| `style_colors` | Color palette definitions |
| `style_typography` | Typography settings |
| `style_spacing` | Spacing scale values |
| `tags` | Tag definitions |
| `style_tags` | Many-to-many relationship |

---

## File Structure

```
ui-vault/
├── docs/                          # Documentation
│   ├── architecture/              # System design docs
│   ├── components/                # Component documentation
│   ├── design-system/             # Design specifications
│   └── guides/                    # Development guides
│
├── public/                        # Static assets
│   └── fonts/                     # Self-hosted fonts
│
├── src/                           # React frontend
│   ├── components/
│   │   ├── ui/                    # Button, Input, Card, etc.
│   │   ├── layout/                # Sidebar, Toolbar, etc.
│   │   └── features/              # StyleCard, PreviewPanel, etc.
│   │
│   ├── hooks/                     # useKeyboard, useSearch, etc.
│   ├── lib/
│   │   ├── tokens/                # colors.ts, typography.ts, etc.
│   │   ├── schemas/               # styleSchema.ts, etc.
│   │   ├── exporters/             # tailwind.ts, css.ts, json.ts
│   │   └── utils/                 # cn(), formatDate(), etc.
│   │
│   ├── stores/                    # styleStore.ts, uiStore.ts
│   ├── styles/                    # globals.css, tailwind.css
│   ├── types/                     # index.ts (re-exports)
│   │
│   ├── App.tsx                    # Root component
│   ├── main.tsx                   # Entry point
│   └── vite-env.d.ts             # Vite types
│
├── src-tauri/                     # Rust backend
│   ├── src/
│   │   ├── main.rs               # Entry point
│   │   ├── commands.rs           # Tauri commands
│   │   ├── db.rs                 # Database operations
│   │   ├── export.rs             # File operations
│   │   └── models.rs             # Data structures
│   │
│   ├── icons/                    # App icons
│   ├── Cargo.toml               # Rust dependencies
│   └── tauri.conf.json          # Tauri configuration
│
├── tests/
│   ├── unit/                     # Unit tests
│   └── e2e/                      # End-to-end tests
│
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## Security Considerations

### Data at Rest
- SQLite database stored in user's home directory
- No encryption by default (local-only app)
- No network requests except optional update checks

### IPC Security
- All Tauri commands validate input
- File operations restricted to safe directories
- No arbitrary code execution

### Dependencies
- Minimal dependency tree
- Regular security audits via `pnpm audit`
- Tauri's security model enforced

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Cold start | < 2 seconds |
| Style list render | < 100ms |
| Export generation | < 500ms |
| Search filtering | < 50ms |
| Memory usage | < 200MB |
| Bundle size | < 10MB |
