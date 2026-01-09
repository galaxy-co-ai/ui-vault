# Icons & Shadows

> Visual depth through restraint. Icons communicate, shadows elevate.

---

# Part 1: Icons

## Philosophy

Icons in UI Vault are functional, not decorative. Every icon must:
1. **Communicate clearly** — Meaning is obvious without labels
2. **Support, not replace** — Accompany text labels for important actions
3. **Scale consistently** — Work at all specified sizes
4. **Match the aesthetic** — Consistent stroke weight and style

---

## Icon Library: Lucide

We use [Lucide Icons](https://lucide.dev/) exclusively.

**Why Lucide:**
- Open source, MIT licensed
- Consistent 24px grid, 1.5px stroke
- 1000+ icons, actively maintained
- Tree-shakeable (only import what you use)
- Perfect visual match with Inter typeface

### Installation

```bash
pnpm add lucide-react
```

### Usage

```tsx
import { Search, Plus, Settings, X } from 'lucide-react';

<Search size={16} strokeWidth={1.5} />
<Plus size={20} strokeWidth={1.5} />
```

---

## Icon Sizes

| Context | Size | Stroke | Use Case |
|---------|------|--------|----------|
| Inline | 14px | 1.5px | Within text, badges |
| Button | 16px | 1.5px | Icon buttons, button icons |
| Navigation | 20px | 1.5px | Sidebar, toolbar |
| Empty State | 48px | 1px | Illustration placeholders |
| Hero | 64px | 1px | Large decorative (rare) |

### Size Tokens

```typescript
const iconSizes = {
  inline: 14,
  button: 16,
  nav: 20,
  empty: 48,
  hero: 64,
} as const;
```

---

## Icon Colors

Icons inherit text color by default. Override only for semantic meaning.

| Context | Color Token |
|---------|-------------|
| Default | `currentColor` (inherit) |
| Muted | `gray.500` |
| Disabled | `gray.600` |
| Interactive (hover) | `gray.200` |
| Accent | `accent.default` |
| Success | `success.default` |
| Warning | `warning.default` |
| Error | `error.default` |

---

## Common Icon Mappings

| Action | Icon | Lucide Name |
|--------|------|-------------|
| Add/Create | + | `Plus` |
| Remove/Delete | × | `X` |
| Edit | ✎ | `Pencil` |
| Search | 🔍 | `Search` |
| Settings | ⚙ | `Settings` |
| Menu | ☰ | `Menu` |
| Close | × | `X` |
| Chevron | › | `ChevronRight` |
| Check | ✓ | `Check` |
| Copy | ⧉ | `Copy` |
| Download | ↓ | `Download` |
| Upload | ↑ | `Upload` |
| External Link | ↗ | `ExternalLink` |
| Info | ℹ | `Info` |
| Warning | ⚠ | `AlertTriangle` |
| Error | ⊗ | `AlertCircle` |
| Success | ✓ | `CheckCircle` |
| Filter | ≡ | `SlidersHorizontal` |
| Sort | ↕ | `ArrowUpDown` |
| Grid View | ⊞ | `Grid` |
| List View | ☰ | `List` |
| Expand | ↔ | `Maximize2` |
| Collapse | ↙ | `Minimize2` |
| Refresh | ↻ | `RefreshCw` |
| Undo | ↶ | `Undo` |
| Redo | ↷ | `Redo` |
| Home | ⌂ | `Home` |
| Folder | 📁 | `Folder` |
| File | 📄 | `File` |
| Code | </> | `Code` |
| Eye (View) | 👁 | `Eye` |
| Eye Off | 👁‍🗨 | `EyeOff` |
| Moon (Dark) | ☾ | `Moon` |
| Sun (Light) | ☀ | `Sun` |
| Keyboard | ⌨ | `Keyboard` |

---

## Icon Guidelines

### Do
- Use icons to reinforce meaning, not replace text
- Maintain consistent sizes within contexts
- Ensure adequate touch targets (44px minimum)
- Use `aria-label` for icon-only buttons

### Don't
- Mix icon libraries
- Use icons purely for decoration
- Scale icons outside defined sizes
- Use different stroke weights

---

# Part 2: Shadows

## Philosophy

Shadows communicate elevation in the z-axis. Use them to:
1. **Separate layers** — Floating elements from the base
2. **Focus attention** — Modals, dropdowns
3. **Create depth** — Cards above background

Never use shadows for decoration.

---

## Shadow Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle lift, buttons |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.4)` | Cards, dropdowns |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.5)` | Modals, overlays |
| `shadow-ring` | `0 0 0 2px rgba(59,130,246,0.5)` | Focus indicators |

---

## Implementation

### Tailwind Configuration

```typescript
// tailwind.config.ts
export default {
  theme: {
    boxShadow: {
      none: 'none',
      sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
      DEFAULT: '0 4px 12px rgba(0, 0, 0, 0.4)',
      md: '0 4px 12px rgba(0, 0, 0, 0.4)',
      lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
      ring: '0 0 0 2px rgba(59, 130, 246, 0.5)',
    },
  },
}
```

### CSS Variables

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-ring: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
```

---

## Elevation Hierarchy

| Level | Shadow | Elements |
|-------|--------|----------|
| 0 | none | Background, inline elements |
| 1 | shadow-sm | Buttons (hover), subtle lifts |
| 2 | shadow-md | Cards, dropdowns, popovers |
| 3 | shadow-lg | Modals, command palette |

---

## Focus Rings

Accessibility-critical. Every interactive element needs a visible focus state.

```css
.interactive:focus-visible {
  outline: none;
  box-shadow: var(--shadow-ring);
}
```

Or combine with existing shadows:

```css
.card:focus-visible {
  box-shadow: var(--shadow-md), var(--shadow-ring);
}
```

---

## Shadow Guidelines

### Do
- Use shadows to indicate elevation hierarchy
- Keep shadow opacity high for dark mode (light leaks look bad)
- Combine focus rings with existing shadows

### Don't
- Use colored shadows (except focus rings)
- Apply shadows to inline elements
- Use shadows for borders
- Create more than 3 elevation levels

---

## Dark Mode Considerations

In dark mode, shadows are less visible but still necessary. Our shadow values use higher opacity (0.3-0.5) to remain visible against dark backgrounds.

Alternative approach for very dark themes: use subtle light borders instead of shadows:

```css
.card-dark-alt {
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```
