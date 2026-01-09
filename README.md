# UI Vault

> Create, manage, and export professional UI design systems with one click.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

UI Vault is a web application for building reusable design system foundations. Create your style tokens once, export them as Tailwind configs, CSS variables, or JSON tokens—ready to use in any project.

## Features

- **Style Collections** — Complete UI foundation packages with colors, typography, spacing, shadows, and animations
- **Live Preview** — See your design system in action with real-time component previews
- **Dark/Light Mode** — Full support for dual-theme design systems out of the box
- **One-Click Export** — Generate Tailwind configs, CSS variables, or JSON design tokens instantly
- **Keyboard-First** — Command palette (`⌘K`) and shortcuts for power users

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | [TypeScript 5.7](https://www.typescriptlang.org/) |
| Database | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) |
| ORM | [Prisma 6](https://www.prisma.io/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| State | [Zustand](https://zustand-demo.pmnd.rs/) |
| Validation | [Zod](https://zod.dev/) |
| Components | [Radix UI](https://www.radix-ui.com/) + [Framer Motion](https://www.framer.com/motion/) |

## Project Structure

```
ui-vault/
├── packages/
│   ├── core/              # Reusable UI component library (46+ components)
│   │   ├── components/    # Button, Input, Dialog, Animations, Effects...
│   │   ├── hooks/         # useReducedMotion, useScrollLock...
│   │   └── lib/           # Animation presets, utilities
│   │
│   └── web/               # Next.js application
│       ├── app/           # Pages and API routes
│       │   ├── api/       # REST API endpoints
│       │   └── dashboard/ # App pages
│       ├── components/    # App-specific components
│       ├── lib/           # Schemas, exporters, utilities
│       ├── stores/        # Zustand state management
│       └── prisma/        # Database schema
│
└── docs/                  # Architecture & design documentation
    ├── architecture/      # System design, data models
    └── design-system/     # Design tokens & principles
```

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- PostgreSQL database (we recommend [Neon](https://neon.tech/) — free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ui-vault.git
cd ui-vault

# Install dependencies
pnpm install

# Set up environment variables
cp packages/web/.env.example packages/web/.env
# Edit packages/web/.env with your DATABASE_URL

# Initialize the database
pnpm --filter @ui-vault/web db:generate
pnpm --filter @ui-vault/web db:push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

Create `packages/web/.env`:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm --filter @ui-vault/web db:studio` | Open Prisma Studio |
| `pnpm --filter @ui-vault/web db:push` | Push schema to database |

## Export Formats

UI Vault exports your design system in three formats:

**Tailwind Config** — Drop-in configuration for Tailwind CSS projects
```typescript
export default {
  theme: {
    extend: {
      colors: { gray: {...}, accent: {...} },
      fontFamily: { sans: [...], mono: [...] },
      spacing: { 0: "0px", 1: "4px", ... }
    }
  }
}
```

**CSS Variables** — Framework-agnostic custom properties
```css
:root {
  --color-gray-50: #FAFBFC;
  --color-accent-default: #3B82F6;
  --font-family-sans: Inter, system-ui;
  --space-4: 16px;
}
```

**JSON Tokens** — Standard design tokens format
```json
{
  "$schema": "https://design-tokens.github.io/...",
  "tokens": { "colors": {...}, "typography": {...} }
}
```

## Component Library

The `@ui-vault/core` package includes 46+ production-ready components:

| Category | Components |
|----------|------------|
| **Primitives** | Button, Input, Badge, Avatar, Switch, Checkbox, Label |
| **Layout** | Card, Separator, ScrollArea, Tabs |
| **Feedback** | Alert, Dialog, Popover, Toast, Tooltip |
| **Animations** | BlurFade, TextAnimate, Marquee, NumberTicker, WordRotate |
| **Effects** | AnimatedBorder, Confetti, Meteors, RainbowButton, ShimmerButton |
| **Backgrounds** | DotPattern, GridPattern, Particles, Spotlight, AnimatedBeam |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Set the root directory to `packages/web`
4. Add your `DATABASE_URL` environment variable
5. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture Overview](./docs/architecture/OVERVIEW.md) | System design and data flow |
| [Data Model](./docs/architecture/DATA-MODEL.md) | Schemas and database structure |
| [Design Principles](./docs/design-system/00-PRINCIPLES.md) | Core design philosophy |
| [Color System](./docs/design-system/01-COLORS.md) | Color tokens and usage |
| [Typography](./docs/design-system/02-TYPOGRAPHY.md) | Type scale and fonts |
| [Quality Checklist](./docs/guides/QUALITY-CHECKLIST.md) | Pre-ship verification |

## License

MIT License — see [LICENSE](./LICENSE) for details.
