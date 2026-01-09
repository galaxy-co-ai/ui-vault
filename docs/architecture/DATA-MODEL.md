# Data Model

> Type-safe schemas defining every data structure in UI Vault.

---

## Overview

All data structures are defined with Zod schemas, providing:
- Runtime validation
- TypeScript type inference
- Consistent serialization
- Clear documentation

---

## Core Schemas

### StyleCollection

The primary entity. A complete UI foundation package.

```typescript
// src/lib/schemas/style.schema.ts
import { z } from 'zod';

// ============================================
// Color Schemas
// ============================================

export const ColorScaleSchema = z.object({
  50: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  100: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  200: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  300: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  400: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  500: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  600: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  700: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  800: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  900: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  950: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const SemanticColorsSchema = z.object({
  success: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  successMuted: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  warning: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  warningMuted: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  error: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  errorMuted: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  info: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  infoMuted: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const AccentColorsSchema = z.object({
  subtle: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  muted: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  default: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  emphasis: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  text: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const ColorPaletteSchema = z.object({
  gray: ColorScaleSchema,
  accent: AccentColorsSchema,
  semantic: SemanticColorsSchema,
});

// ============================================
// Typography Schemas
// ============================================

export const FontSizeEntrySchema = z.tuple([
  z.string(), // size (e.g., "13px")
  z.object({
    lineHeight: z.string(), // e.g., "20px"
  }),
]);

export const TypographySchema = z.object({
  fontFamily: z.object({
    sans: z.string(),
    mono: z.string(),
    serif: z.string().optional(),
  }),
  fontSize: z.object({
    xs: FontSizeEntrySchema,
    sm: FontSizeEntrySchema,
    base: FontSizeEntrySchema,
    md: FontSizeEntrySchema,
    lg: FontSizeEntrySchema,
    xl: FontSizeEntrySchema,
    '2xl': FontSizeEntrySchema,
  }),
  fontWeight: z.object({
    normal: z.string(),
    medium: z.string(),
    semibold: z.string(),
  }),
  letterSpacing: z.object({
    tight: z.string(),
    normal: z.string(),
    wide: z.string(),
  }),
});

// ============================================
// Spacing & Layout Schemas
// ============================================

export const SpacingScaleSchema = z.object({
  0: z.string(),
  0.5: z.string(),
  1: z.string(),
  1.5: z.string(),
  2: z.string(),
  2.5: z.string(),
  3: z.string(),
  4: z.string(),
  5: z.string(),
  6: z.string(),
  8: z.string(),
  10: z.string(),
  12: z.string(),
  16: z.string(),
  20: z.string(),
  24: z.string(),
});

export const BorderRadiusSchema = z.object({
  none: z.string(),
  sm: z.string(),
  DEFAULT: z.string(),
  md: z.string(),
  lg: z.string(),
  full: z.string(),
});

export const ShadowsSchema = z.object({
  none: z.string(),
  sm: z.string(),
  DEFAULT: z.string(),
  md: z.string(),
  lg: z.string(),
  ring: z.string(),
});

// ============================================
// Animation Schemas
// ============================================

export const AnimationSchema = z.object({
  duration: z.object({
    instant: z.string(),
    fast: z.string(),
    normal: z.string(),
    smooth: z.string(),
    slow: z.string(),
  }),
  easing: z.object({
    default: z.string(),
    in: z.string(),
    out: z.string(),
    bounce: z.string(),
  }),
});

// ============================================
// Style Collection Schema
// ============================================

export const StyleCollectionSchema = z.object({
  // Identity
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  tags: z.array(z.string().min(1).max(20)),
  
  // Design Tokens
  colors: z.object({
    light: ColorPaletteSchema,
    dark: ColorPaletteSchema,
  }),
  typography: TypographySchema,
  spacing: SpacingScaleSchema,
  borderRadius: BorderRadiusSchema,
  shadows: ShadowsSchema,
  animation: AnimationSchema,
  
  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastUsedAt: z.string().datetime().optional(),
  usageCount: z.number().int().nonnegative().default(0),
  
  // Optional
  thumbnail: z.string().optional(), // base64 or file path
  isFavorite: z.boolean().default(false),
});

// ============================================
// Derived Types
// ============================================

export type ColorScale = z.infer<typeof ColorScaleSchema>;
export type ColorPalette = z.infer<typeof ColorPaletteSchema>;
export type Typography = z.infer<typeof TypographySchema>;
export type SpacingScale = z.infer<typeof SpacingScaleSchema>;
export type BorderRadius = z.infer<typeof BorderRadiusSchema>;
export type Shadows = z.infer<typeof ShadowsSchema>;
export type Animation = z.infer<typeof AnimationSchema>;
export type StyleCollection = z.infer<typeof StyleCollectionSchema>;

// ============================================
// Input Schemas (for creation/updates)
// ============================================

export const CreateStyleInputSchema = StyleCollectionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastUsedAt: true,
  usageCount: true,
});

export const UpdateStyleInputSchema = StyleCollectionSchema.partial().omit({
  id: true,
  createdAt: true,
});

export type CreateStyleInput = z.infer<typeof CreateStyleInputSchema>;
export type UpdateStyleInput = z.infer<typeof UpdateStyleInputSchema>;
```

---

## Database Schema (SQLite)

### Tables

```sql
-- styles: Core style collection data
CREATE TABLE styles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_used_at TEXT,
    usage_count INTEGER DEFAULT 0,
    thumbnail TEXT,
    is_favorite INTEGER DEFAULT 0,
    
    -- JSON columns for complex nested data
    colors_light TEXT NOT NULL,    -- JSON
    colors_dark TEXT NOT NULL,     -- JSON
    typography TEXT NOT NULL,      -- JSON
    spacing TEXT NOT NULL,         -- JSON
    border_radius TEXT NOT NULL,   -- JSON
    shadows TEXT NOT NULL,         -- JSON
    animation TEXT NOT NULL        -- JSON
);

-- tags: Tag definitions
CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL
);

-- style_tags: Many-to-many relationship
CREATE TABLE style_tags (
    style_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (style_id, tag_id),
    FOREIGN KEY (style_id) REFERENCES styles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Indexes for common queries
CREATE INDEX idx_styles_name ON styles(name);
CREATE INDEX idx_styles_updated ON styles(updated_at DESC);
CREATE INDEX idx_styles_favorite ON styles(is_favorite);
CREATE INDEX idx_tags_name ON tags(name);
```

---

## Export Formats

### Tailwind Configuration

```typescript
// src/lib/exporters/tailwind.ts
export interface TailwindExport {
  theme: {
    colors: Record<string, Record<string, string>>;
    fontFamily: Record<string, string[]>;
    fontSize: Record<string, [string, { lineHeight: string }]>;
    fontWeight: Record<string, string>;
    letterSpacing: Record<string, string>;
    spacing: Record<string, string>;
    borderRadius: Record<string, string>;
    boxShadow: Record<string, string>;
    transitionDuration: Record<string, string>;
    transitionTimingFunction: Record<string, string>;
  };
}
```

### CSS Variables

```typescript
// src/lib/exporters/css.ts
export interface CSSExport {
  content: string; // Complete :root block
  variables: Record<string, string>; // Parsed variables
}
```

### JSON Tokens

```typescript
// src/lib/exporters/json.ts
export interface JSONExport {
  $schema: string;
  name: string;
  tokens: {
    colors: Record<string, unknown>;
    typography: Record<string, unknown>;
    spacing: Record<string, unknown>;
    // ... etc
  };
}
```

---

## Validation Helpers

```typescript
// src/lib/schemas/validators.ts
import { StyleCollectionSchema, CreateStyleInputSchema } from './style.schema';

export function validateStyle(data: unknown): StyleCollection {
  return StyleCollectionSchema.parse(data);
}

export function validateCreateInput(data: unknown): CreateStyleInput {
  return CreateStyleInputSchema.parse(data);
}

export function isValidHex(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

export function isValidStyle(data: unknown): data is StyleCollection {
  return StyleCollectionSchema.safeParse(data).success;
}
```

---

## Default Values

```typescript
// src/lib/schemas/defaults.ts
import { v4 as uuid } from 'uuid';
import type { StyleCollection } from './style.schema';

export const DEFAULT_COLORS_DARK: ColorPalette = {
  gray: {
    50: '#FAFBFC',
    100: '#F4F5F7',
    200: '#DFE1E6',
    300: '#C1C7D0',
    400: '#A5ADBA',
    500: '#8993A4',
    600: '#6B778C',
    700: '#505F79',
    800: '#344563',
    900: '#172B4D',
    950: '#0D1117',
  },
  accent: {
    subtle: '#1E3A5F',
    muted: '#2563EB',
    default: '#3B82F6',
    emphasis: '#60A5FA',
    text: '#93C5FD',
  },
  semantic: {
    success: '#22C55E',
    successMuted: '#166534',
    warning: '#EAB308',
    warningMuted: '#854D0E',
    error: '#EF4444',
    errorMuted: '#991B1B',
    info: '#3B82F6',
    infoMuted: '#1E40AF',
  },
};

export function createDefaultStyle(name: string): StyleCollection {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    name,
    tags: [],
    colors: {
      light: DEFAULT_COLORS_LIGHT,
      dark: DEFAULT_COLORS_DARK,
    },
    typography: DEFAULT_TYPOGRAPHY,
    spacing: DEFAULT_SPACING,
    borderRadius: DEFAULT_BORDER_RADIUS,
    shadows: DEFAULT_SHADOWS,
    animation: DEFAULT_ANIMATION,
    createdAt: now,
    updatedAt: now,
    usageCount: 0,
    isFavorite: false,
  };
}
```

---

## Type Exports

```typescript
// src/types/index.ts
export type {
  StyleCollection,
  CreateStyleInput,
  UpdateStyleInput,
  ColorScale,
  ColorPalette,
  Typography,
  SpacingScale,
  BorderRadius,
  Shadows,
  Animation,
} from '@/lib/schemas/style.schema';

export type {
  TailwindExport,
  CSSExport,
  JSONExport,
} from '@/lib/exporters';
```
