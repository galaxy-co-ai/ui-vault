# Architecture Overview

> A clean separation of concerns enabling rapid iteration and reliable performance.

---

## System Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                    UI Vault Web Application                        │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                 Next.js 15 (App Router)                       │ │
│  │                                                               │ │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐   │ │
│  │  │ React Server  │  │ Client        │  │   API Routes    │   │ │
│  │  │ Components    │  │ Components    │  │   (REST API)    │   │ │
│  │  │ (app/)        │  │ ("use client")│  │   (app/api/)    │   │ │
│  │  └───────────────┘  └───────────────┘  └────────┬────────┘   │ │
│  │                                                  │            │ │
│  │  ┌───────────────┐  ┌───────────────┐           │            │ │
│  │  │   Zustand     │  │     Zod       │           │            │ │
│  │  │   Stores      │  │   Schemas     │           │            │ │
│  │  └───────────────┘  └───────────────┘           │            │ │
│  │                                                  │            │ │
│  └──────────────────────────────────────────────────┼────────────┘ │
│                                                     │              │
│  ┌──────────────────────────────────────────────────┼────────────┐ │
│  │                      Prisma ORM                  │            │ │
│  │                                                  ▼            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │   PostgreSQL (Neon)       │
                    │   Cloud Database          │
                    └───────────────────────────┘
```

---

## Monorepo Structure

UI Vault uses a pnpm workspace monorepo with Turborepo for build orchestration.

```
ui-vault/
├── packages/
│   ├── core/          # @ui-vault/core - Reusable component library
│   └── web/           # @ui-vault/web - Next.js application
├── docs/              # Documentation
├── tests/             # Test suites
└── turbo.json         # Turborepo configuration
```

---

## Layer Responsibilities

### 1. Component Library (@ui-vault/core)

**Location:** `packages/core/`

A publishable React component library with 46+ production-ready components.

| Directory | Responsibility |
|-----------|---------------|
| `/components/primitives` | Button, Input, Badge, Avatar, Switch, etc. |
| `/components/layout` | Card, Separator, ScrollArea |
| `/components/feedback` | Alert, Dialog, Toast, Tooltip, Progress |
| `/components/navigation` | Tabs, Accordion, Breadcrumb, Command |
| `/components/animations` | BlurFade, TextAnimate, Marquee, NumberTicker |
| `/components/effects` | AnimatedBorder, Confetti, Meteors, ShimmerButton |
| `/components/backgrounds` | DotPattern, GridPattern, Particles, Spotlight |
| `/hooks` | useReducedMotion, useScrollProgress, useAnimationState |
| `/lib` | Animation presets, utilities |

### 2. Web Application (@ui-vault/web)

**Location:** `packages/web/`

The Next.js application that consumes the component library.

| Directory | Responsibility |
|-----------|---------------|
| `/app` | Next.js App Router pages and layouts |
| `/app/api` | REST API endpoints (CRUD for styles) |
| `/components/features` | App-specific components (StyleEditor, ExportDialog) |
| `/components/layout` | Sidebar, Header, CommandPalette |
| `/components/providers` | Context providers (StoreProvider, ErrorBoundary) |
| `/stores` | Zustand state management |
| `/lib/schemas` | Zod validation schemas |
| `/lib/exporters` | Code generation (Tailwind, CSS, JSON) |
| `/lib/db` | Prisma client |
| `/prisma` | Database schema |

### 3. Data Layer

**Technology:** PostgreSQL via Prisma ORM, hosted on Neon

| Table | Purpose |
|-------|---------|
| `Style` | Style collection with design tokens (JSON columns) |
| `Tag` | Tag definitions |
| `StyleTag` | Many-to-many relationship |

---

## Data Flow

### Reading Style Collections

```
User Action          Frontend              API Route            Database
     │                   │                     │                    │
     │  Load Page    ────►                     │                    │
     │                   │                     │                    │
     │                   │  fetch('/api/styles')                    │
     │                   ├─────────────────────►                    │
     │                   │                     │                    │
     │                   │                     │  Prisma Query      │
     │                   │                     ├────────────────────►
     │                   │                     │                    │
     │                   │                     │◄── Result ─────────┤
     │                   │                     │                    │
     │                   │◄── JSON Response ───┤                    │
     │                   │                     │                    │
     │                   │  Update Zustand     │                    │
     │                   │  Store              │                    │
     │                   │                     │                    │
     │◄── Render List ───┤                     │                    │
     │                   │                     │                    │
```

### Exporting a Style

```
User Action          Frontend              API Route            Response
     │                   │                     │                    │
     │  Click Export ────►                     │                    │
     │                   │                     │                    │
     │                   │  POST /api/export   │                    │
     │                   │  { styleId, format }│                    │
     │                   ├─────────────────────►                    │
     │                   │                     │                    │
     │                   │                     │  Generate config   │
     │                   │                     │  (server-side)     │
     │                   │                     │                    │
     │                   │◄── File blob ───────┤                    │
     │                   │                     │                    │
     │                   │  Trigger download   │                    │
     │                   │                     │                    │
     │◄── Toast ─────────┤                     │                    │
```

---

## State Management

### Zustand Store Structure

```typescript
// stores/style-store.ts
interface StyleStore {
  // Data
  styles: StyleCollection[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;

  // UI State
  searchQuery: string;
  showFavoritesOnly: boolean;
  activeTag: string | null;

  // Actions
  loadStyles: () => Promise<void>;
  selectStyle: (id: string | null) => void;
  createStyle: (data: CreateStyleInput) => Promise<StyleCollection>;
  updateStyle: (id: string, data: Partial<StyleCollection>) => Promise<void>;
  deleteStyle: (id: string) => Promise<void>;
  duplicateStyle: (id: string) => Promise<StyleCollection>;
  toggleFavorite: (id: string) => Promise<void>;

  // Search & Filter
  setSearchQuery: (query: string) => void;
  setShowFavoritesOnly: (show: boolean) => void;
  setActiveTag: (tag: string | null) => void;
  clearFilters: () => void;
}
```

### Why Zustand?

- Minimal boilerplate
- No context providers needed
- Built-in devtools
- Easy persistence
- TypeScript-first

---

## API Routes

Frontend communicates with backend via Next.js API Routes (REST).

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/styles` | List all styles (with filtering) |
| POST | `/api/styles` | Create a new style |
| GET | `/api/styles/[id]` | Get a single style |
| PUT | `/api/styles/[id]` | Update a style |
| DELETE | `/api/styles/[id]` | Delete a style |
| POST | `/api/styles/[id]/duplicate` | Duplicate a style |
| PATCH | `/api/styles/[id]/favorite` | Toggle favorite status |
| POST | `/api/export` | Generate export file |

### Request/Response Pattern

```typescript
// API Route (packages/web/app/api/styles/route.ts)
export async function GET(request: NextRequest) {
  const styles = await prisma.style.findMany({
    include: { tags: { include: { tag: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(styles);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = CreateStyleInputSchema.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }
  
  const style = await prisma.style.create({ data: parsed.data });
  return NextResponse.json(style, { status: 201 });
}
```

---

## Database Schema

See [DATA-MODEL.md](./DATA-MODEL.md) for complete schema definitions.

### Prisma Schema Overview

```prisma
model Style {
  id          String   @id @default(uuid())
  name        String
  description String?

  // JSON columns for nested design token data
  colorsLight  Json
  colorsDark   Json
  typography   Json
  spacing      Json
  borderRadius Json
  shadows      Json
  animation    Json

  // Metadata
  isFavorite Boolean @default(false)
  usageCount Int     @default(0)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  // Relations
  tags StyleTag[]
}
```

---

## File Structure

```
ui-vault/
├── packages/
│   ├── core/                      # Component library
│   │   ├── components/            # 46+ UI components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Animation presets, utilities
│   │   ├── styles/                # Global CSS
│   │   ├── dist/                  # Compiled output
│   │   └── package.json
│   │
│   └── web/                       # Next.js application
│       ├── app/                   # App Router pages
│       │   ├── api/               # REST API endpoints
│       │   ├── dashboard/         # Dashboard pages
│       │   ├── layout.tsx         # Root layout
│       │   └── page.tsx           # Home page
│       ├── components/
│       │   ├── features/          # StyleEditor, ExportDialog, etc.
│       │   ├── layout/            # Sidebar, Header, CommandPalette
│       │   └── providers/         # ErrorBoundary, StoreProvider
│       ├── lib/
│       │   ├── db/                # Prisma client
│       │   ├── exporters/         # tailwind.ts, css.ts, json.ts
│       │   └── schemas/           # Zod schemas
│       ├── stores/                # Zustand stores
│       ├── prisma/                # Database schema
│       └── package.json
│
├── docs/                          # Documentation
│   ├── architecture/              # System design docs
│   ├── design-system/             # Design specifications
│   └── guides/                    # Development guides
│
├── tests/
│   ├── unit/                      # Unit tests
│   └── e2e/                       # End-to-end tests
│
├── turbo.json                     # Turborepo config
├── pnpm-workspace.yaml            # Workspace definition
└── package.json                   # Root package
```

---

## Security Considerations

### Data at Rest
- PostgreSQL database hosted on Neon (cloud)
- Connection secured via SSL
- Credentials stored in environment variables

### API Security
- All API routes validate input with Zod
- Prisma prevents SQL injection
- No authentication required (single-user app)

### Dependencies
- Minimal dependency tree
- Regular security audits via `pnpm audit`
- TypeScript strict mode enabled

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Cold start | < 2 seconds |
| Style list render | < 100ms |
| Export generation | < 500ms |
| Search filtering | < 50ms |
| Lighthouse score | > 90 |
| Bundle size (JS) | < 250KB gzipped |

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `packages/web`
4. Add `DATABASE_URL` environment variable
5. Deploy

### Environment Variables

```env
# PostgreSQL connection string (Neon)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```
