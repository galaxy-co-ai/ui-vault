# Typography

> Clear hierarchy through intentional type choices. Every size earns its place.

---

## Philosophy

Typography in UI Vault prioritizes:
1. **Legibility** — Readable at all sizes, in all conditions
2. **Hierarchy** — Size and weight guide the eye
3. **Density** — Efficient use of space without cramping
4. **Consistency** — Predictable patterns breed familiarity

---

## Font Families

### Primary: Inter

The industry standard for UI typography.

**Why Inter:**
- Variable font (single file, infinite flexibility)
- Designed specifically for screens
- Excellent legibility at small sizes (11-14px)
- Tabular numbers for data alignment
- Comprehensive character set
- Active development and refinement

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Monospace: JetBrains Mono

For code, values, and technical content.

**Why JetBrains Mono:**
- Designed for extended reading of code
- Clear character differentiation (0/O, 1/l/I)
- Consistent width aids scanning
- Excellent at small sizes
- Ligatures available (optional)

```css
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
```

---

## Type Scale

Based on a 4px vertical rhythm. Every size aligns to the grid.

### Token Reference

| Token | Size | Line Height | Weight | Use Case |
|-------|------|-------------|--------|----------|
| `text-xs` | 11px | 16px | 400 | Labels, metadata, timestamps |
| `text-sm` | 12px | 16px | 400 | Secondary text, captions, helper text |
| `text-base` | 13px | 20px | 400 | Body text, UI labels, default |
| `text-md` | 14px | 20px | 500 | Emphasized body, navigation |
| `text-lg` | 16px | 24px | 500 | Section headers, card titles |
| `text-xl` | 18px | 28px | 600 | Page titles, modal headers |
| `text-2xl` | 24px | 32px | 600 | Hero text (use sparingly) |

### Why 13px Base?

Standard in professional tools:
- Linear: 13px
- Figma: 13px  
- VS Code: 13px
- Slack: 13px

14px feels too loose for information-dense interfaces. 12px is too small for sustained reading.

---

## Font Weights

### Token Reference

| Token | Weight | Use Case |
|-------|--------|----------|
| `font-normal` | 400 | Body text, default |
| `font-medium` | 500 | Labels, navigation, emphasis |
| `font-semibold` | 600 | Headings, important actions |

**Note:** We don't use 300 (too light for screens) or 700+ (too heavy for this aesthetic).

---

## Letter Spacing

### Token Reference

| Token | Value | Use Case |
|-------|-------|----------|
| `tracking-tight` | -0.01em | Headlines, large text |
| `tracking-normal` | 0 | Body text, default |
| `tracking-wide` | 0.02em | All-caps labels, small text |

### Guidelines

- Large text (18px+): Tighten slightly (`tracking-tight`)
- Body text: Leave alone (`tracking-normal`)
- Small caps/labels: Open up (`tracking-wide`)

---

## Line Height

Generous line heights improve readability without wasting space.

| Text Size | Line Height | Ratio |
|-----------|-------------|-------|
| 11px | 16px | 1.45 |
| 12px | 16px | 1.33 |
| 13px | 20px | 1.54 |
| 14px | 20px | 1.43 |
| 16px | 24px | 1.50 |
| 18px | 28px | 1.56 |
| 24px | 32px | 1.33 |

---

## Implementation

### Tailwind Configuration

```typescript
// tailwind.config.ts
export default {
  theme: {
    fontFamily: {
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: ['11px', { lineHeight: '16px' }],
      sm: ['12px', { lineHeight: '16px' }],
      base: ['13px', { lineHeight: '20px' }],
      md: ['14px', { lineHeight: '20px' }],
      lg: ['16px', { lineHeight: '24px' }],
      xl: ['18px', { lineHeight: '28px' }],
      '2xl': ['24px', { lineHeight: '32px' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
    },
    letterSpacing: {
      tight: '-0.01em',
      normal: '0',
      wide: '0.02em',
    },
  },
}
```

### CSS Variables

```css
:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;

  /* Font Sizes */
  --text-xs: 11px;
  --text-sm: 12px;
  --text-base: 13px;
  --text-md: 14px;
  --text-lg: 16px;
  --text-xl: 18px;
  --text-2xl: 24px;

  /* Line Heights */
  --leading-xs: 16px;
  --leading-sm: 16px;
  --leading-base: 20px;
  --leading-md: 20px;
  --leading-lg: 24px;
  --leading-xl: 28px;
  --leading-2xl: 32px;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;

  /* Letter Spacing */
  --tracking-tight: -0.01em;
  --tracking-normal: 0;
  --tracking-wide: 0.02em;
}
```

---

## Typography Patterns

### Page Title
```html
<h1 class="text-xl font-semibold tracking-tight text-gray-100">
  Page Title
</h1>
```

### Section Header
```html
<h2 class="text-lg font-medium text-gray-100">
  Section Header
</h2>
```

### Body Text
```html
<p class="text-base text-gray-400">
  Body text content goes here.
</p>
```

### Label
```html
<label class="text-xs font-medium tracking-wide uppercase text-gray-500">
  Field Label
</label>
```

### Code/Value
```html
<code class="font-mono text-sm text-gray-300">
  #3B82F6
</code>
```

### Metadata
```html
<span class="text-xs text-gray-500">
  Updated 2 hours ago
</span>
```

---

## Do's and Don'ts

### Do
- Use the type scale consistently
- Let hierarchy do the work (avoid bold for emphasis in body text)
- Use monospace for all code/values
- Test readability at actual rendering size

### Don't
- Create new sizes outside the scale
- Use font-weight 700+ (too heavy)
- Mix font families arbitrarily
- Rely solely on size for hierarchy (combine with color/weight)
- Use more than 2 font weights in a single component
