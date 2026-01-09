# Spacing & Layout

> Consistent spatial relationships create visual rhythm and reduce cognitive load.

---

## Philosophy

Spacing in UI Vault follows three principles:
1. **Systematic** — All values derived from a base unit
2. **Intentional** — Spacing communicates relationships
3. **Consistent** — Same patterns across all screens

---

## Base Unit: 4px

Every spacing value is a multiple of 4px. This creates:
- Alignment to pixel grid (no sub-pixel rendering issues)
- Predictable rhythm throughout the interface
- Easy mental math (8, 12, 16, 24...)

---

## Spacing Scale

### Token Reference

| Token | Value | Common Use |
|-------|-------|------------|
| `space-0` | 0px | Reset, collapse |
| `space-0.5` | 2px | Tight inline spacing |
| `space-1` | 4px | Icon-to-text gap |
| `space-1.5` | 6px | Compact internal padding |
| `space-2` | 8px | Standard gap, tight padding |
| `space-2.5` | 10px | Slightly larger gap |
| `space-3` | 12px | Component internal padding |
| `space-4` | 16px | Standard padding, card internal |
| `space-5` | 20px | Comfortable padding |
| `space-6` | 24px | Section separation, modal padding |
| `space-8` | 32px | Large section gaps |
| `space-10` | 40px | Major section breaks |
| `space-12` | 48px | Page section spacing |
| `space-16` | 64px | Large whitespace areas |
| `space-20` | 80px | Hero spacing |
| `space-24` | 96px | Maximum spacing |

---

## Spacing Relationships

### Proximity Principle

Elements that are related should be closer together than elements that are unrelated.

```
┌─────────────────────────────┐
│  Card Title                 │  ← 8px gap (related)
│  Card description text      │
│                             │  ← 16px gap (less related)
│  ┌─────────┐ ┌─────────┐   │
│  │ Cancel  │ │  Save   │   │  ← 8px gap (equal importance)
│  └─────────┘ └─────────┘   │
└─────────────────────────────┘
```

### Standard Patterns

| Relationship | Spacing | Example |
|--------------|---------|---------|
| Tightly coupled | 4-8px | Icon + label, badge + text |
| Related elements | 8-12px | Form label + input, list items |
| Component internal | 12-16px | Card padding, button padding |
| Section separation | 24px | Between card groups |
| Major breaks | 32-48px | Between page sections |

---

## Layout Containers

### Page Layout

```
┌──────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░ Toolbar ░░░░░░░░░░░░░░░░░░░░░░░░░░ │  48px height
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│  Sidebar   │              Main                       │
│   260px    │           flex-grow                     │
│            │                                         │
│            │         24px padding                    │
│            │                                         │
└────────────┴─────────────────────────────────────────┘
```

### Container Widths

| Container | Width | Use |
|-----------|-------|-----|
| Sidebar | 260px | Fixed navigation |
| Content max | 1200px | Maximum readable width |
| Form max | 480px | Single-column forms |
| Modal sm | 400px | Confirmations |
| Modal md | 560px | Forms, editors |
| Modal lg | 720px | Complex content |

---

## Component Spacing

### Buttons

| Size | Height | Horizontal Padding | Gap (icon+text) |
|------|--------|-------------------|-----------------|
| sm | 28px | 12px | 6px |
| md | 32px | 16px | 8px |
| lg | 40px | 20px | 8px |

### Inputs

| Size | Height | Horizontal Padding |
|------|--------|-------------------|
| sm | 28px | 8px |
| md | 32px | 12px |
| lg | 40px | 16px |

### Cards

```
┌─────────────────────────────┐
│        16px padding         │
│  ┌─────────────────────┐   │
│  │      Content        │   │
│  └─────────────────────┘   │
│        16px padding         │
└─────────────────────────────┘
```

### Lists

```
┌─────────────────────────────┐
│  12px padding-y             │
│  List Item 1                │
│  12px padding-y             │
├─────────────────────────────┤  ← 1px border
│  12px padding-y             │
│  List Item 2                │
│  12px padding-y             │
└─────────────────────────────┘
```

---

## Implementation

### Tailwind Configuration

```typescript
// tailwind.config.ts
export default {
  theme: {
    spacing: {
      0: '0px',
      0.5: '2px',
      1: '4px',
      1.5: '6px',
      2: '8px',
      2.5: '10px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      24: '96px',
    },
  },
}
```

### CSS Variables

```css
:root {
  --space-0: 0px;
  --space-0-5: 2px;
  --space-1: 4px;
  --space-1-5: 6px;
  --space-2: 8px;
  --space-2-5: 10px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

---

## Border Radius

Subtle, not bubbly. Confidence over friendliness.

### Token Reference

| Token | Value | Use |
|-------|-------|-----|
| `rounded-none` | 0px | Sharp edges when needed |
| `rounded-sm` | 4px | Inputs, small buttons |
| `rounded-md` | 6px | Cards, standard buttons |
| `rounded-lg` | 8px | Modals, large containers |
| `rounded-full` | 9999px | Pills, avatars, indicators |

### Implementation

```typescript
// tailwind.config.ts
export default {
  theme: {
    borderRadius: {
      none: '0px',
      sm: '4px',
      DEFAULT: '6px',
      md: '6px',
      lg: '8px',
      full: '9999px',
    },
  },
}
```

---

## Responsive Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| `compact` | < 800px | Sidebar collapses |
| `default` | 800-1200px | Full layout |
| `wide` | > 1200px | Extended features |

### Implementation

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'compact': { max: '799px' },
      'default': '800px',
      'wide': '1200px',
    },
  },
}
```

---

## Do's and Don'ts

### Do
- Use spacing scale values exclusively
- Let proximity communicate relationships
- Maintain consistent padding within component types
- Test layouts at all breakpoints

### Don't
- Use arbitrary pixel values (17px, 23px)
- Mix spacing patterns within similar contexts
- Collapse spacing to fit more content (redesign instead)
- Forget mobile/compact considerations
