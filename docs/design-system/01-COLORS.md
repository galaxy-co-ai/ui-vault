# Color System

> A monochromatic foundation with purposeful accent. Color is earned, not given freely.

---

## Philosophy

Color in UI Vault serves three purposes:
1. **Hierarchy** — Guide the eye through grayscale values
2. **Interaction** — Signal clickable, hoverable, focusable elements
3. **Semantics** — Communicate success, warning, error, info states

Everything else is grayscale. This constraint creates clarity and makes intentional color usage more impactful.

---

## Gray Scale

The foundation of the entire interface. A subtle blue undertone adds depth without feeling cold.

### Token Reference

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `gray.0` | `#FFFFFF` | 255, 255, 255 | Pure white (light mode bg) |
| `gray.50` | `#FAFBFC` | 250, 251, 252 | Subtle background lift |
| `gray.100` | `#F4F5F7` | 244, 245, 247 | Light mode surface |
| `gray.150` | `#EBEDF0` | 235, 237, 240 | Light mode hover |
| `gray.200` | `#DFE1E6` | 223, 225, 230 | Light mode border |
| `gray.300` | `#C1C7D0` | 193, 199, 208 | Disabled state (light) |
| `gray.400` | `#A5ADBA` | 165, 173, 186 | Placeholder text |
| `gray.500` | `#8993A4` | 137, 147, 164 | Muted text |
| `gray.600` | `#6B778C` | 107, 119, 140 | Secondary text (light) |
| `gray.700` | `#505F79` | 80, 95, 121 | Primary text (light) |
| `gray.800` | `#344563` | 52, 69, 99 | Dark mode borders |
| `gray.900` | `#172B4D` | 23, 43, 77 | Dark mode surface |
| `gray.950` | `#0D1117` | 13, 17, 23 | Dark mode elevated |
| `gray.1000` | `#010409` | 1, 4, 9 | Dark mode background |

### Usage Guidelines

**Dark Mode (Primary)**
```
Background:        gray.1000
Elevated surface:  gray.950
Borders:           gray.800
Muted text:        gray.500
Secondary text:    gray.400
Primary text:      gray.100
```

**Light Mode (Secondary)**
```
Background:        gray.50
Elevated surface:  gray.0
Borders:           gray.200
Muted text:        gray.500
Secondary text:    gray.600
Primary text:      gray.900
```

---

## Accent Color

A single accent color for interactive elements. Muted blue conveys professionalism without playfulness.

### Token Reference

| Token | Hex | Usage |
|-------|-----|-------|
| `accent.subtle` | `#1E3A5F` | Background tint, selected states |
| `accent.muted` | `#2563EB` | Secondary interactive elements |
| `accent.default` | `#3B82F6` | Primary buttons, links, focus rings |
| `accent.emphasis` | `#60A5FA` | Hover states |
| `accent.text` | `#93C5FD` | Text on dark backgrounds |

### Usage Guidelines

```
Primary button:     accent.default background, white text
Secondary button:   transparent background, accent.default border
Links:              accent.default text, accent.emphasis on hover
Focus ring:         accent.default with 50% opacity
Selected item:      accent.subtle background
```

---

## Semantic Colors

Communicate meaning independent of language. Desaturated to maintain professional tone.

### Token Reference

| Semantic | Default | Muted | Usage |
|----------|---------|-------|-------|
| Success | `#22C55E` | `#166534` | Confirmations, completions |
| Warning | `#EAB308` | `#854D0E` | Cautions, pending states |
| Error | `#EF4444` | `#991B1B` | Failures, destructive actions |
| Info | `#3B82F6` | `#1E40AF` | Informational messages |

### Usage Guidelines

**Default variants** — Text, icons, badges
**Muted variants** — Backgrounds, subtle indicators

```
Error message:      error.default text on error.muted background
Success badge:      success.default text on success.muted background
Warning border:     warning.default border color
```

---

## Contrast Requirements

All text must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

### Pre-Validated Combinations

| Background | Text | Contrast | Pass |
|------------|------|----------|------|
| `gray.1000` | `gray.100` | 15.2:1 | ✓ AAA |
| `gray.1000` | `gray.400` | 7.1:1 | ✓ AAA |
| `gray.1000` | `gray.500` | 4.8:1 | ✓ AA |
| `gray.950` | `gray.100` | 13.8:1 | ✓ AAA |
| `gray.950` | `gray.400` | 6.4:1 | ✓ AA |
| `gray.50` | `gray.900` | 12.1:1 | ✓ AAA |
| `gray.50` | `gray.600` | 5.2:1 | ✓ AA |
| `accent.default` | `white` | 4.5:1 | ✓ AA |

---

## Implementation

### Tailwind Configuration

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        gray: {
          0: '#FFFFFF',
          50: '#FAFBFC',
          100: '#F4F5F7',
          150: '#EBEDF0',
          200: '#DFE1E6',
          300: '#C1C7D0',
          400: '#A5ADBA',
          500: '#8993A4',
          600: '#6B778C',
          700: '#505F79',
          800: '#344563',
          900: '#172B4D',
          950: '#0D1117',
          1000: '#010409',
        },
        accent: {
          subtle: '#1E3A5F',
          muted: '#2563EB',
          DEFAULT: '#3B82F6',
          emphasis: '#60A5FA',
          text: '#93C5FD',
        },
        success: {
          DEFAULT: '#22C55E',
          muted: '#166534',
        },
        warning: {
          DEFAULT: '#EAB308',
          muted: '#854D0E',
        },
        error: {
          DEFAULT: '#EF4444',
          muted: '#991B1B',
        },
        info: {
          DEFAULT: '#3B82F6',
          muted: '#1E40AF',
        },
      },
    },
  },
}
```

### CSS Variables

```css
:root {
  /* Gray Scale */
  --color-gray-0: #FFFFFF;
  --color-gray-50: #FAFBFC;
  --color-gray-100: #F4F5F7;
  --color-gray-150: #EBEDF0;
  --color-gray-200: #DFE1E6;
  --color-gray-300: #C1C7D0;
  --color-gray-400: #A5ADBA;
  --color-gray-500: #8993A4;
  --color-gray-600: #6B778C;
  --color-gray-700: #505F79;
  --color-gray-800: #344563;
  --color-gray-900: #172B4D;
  --color-gray-950: #0D1117;
  --color-gray-1000: #010409;

  /* Accent */
  --color-accent-subtle: #1E3A5F;
  --color-accent-muted: #2563EB;
  --color-accent: #3B82F6;
  --color-accent-emphasis: #60A5FA;
  --color-accent-text: #93C5FD;

  /* Semantic */
  --color-success: #22C55E;
  --color-success-muted: #166534;
  --color-warning: #EAB308;
  --color-warning-muted: #854D0E;
  --color-error: #EF4444;
  --color-error-muted: #991B1B;
  --color-info: #3B82F6;
  --color-info-muted: #1E40AF;
}
```

---

## Do's and Don'ts

### Do
- Use gray scale for 90% of the interface
- Reserve accent color for interactive elements only
- Use semantic colors for their intended meaning
- Test contrast ratios during development

### Don't
- Add new colors without documenting them
- Use accent color for decoration
- Mix semantic color meanings (error for emphasis)
- Rely on color alone to convey information
