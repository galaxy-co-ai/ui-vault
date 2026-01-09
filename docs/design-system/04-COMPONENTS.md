# Components

> Precise specifications for every UI building block.

---

## Component Philosophy

Every component follows these principles:
1. **Single responsibility** — One component, one job
2. **Composable** — Combine primitives to build complex UIs
3. **Accessible** — Keyboard navigable, screen reader friendly
4. **Stateless by default** — State lives in stores, not components

---

## Buttons

The primary interactive element. Every button clearly communicates its purpose and state.

### Variants

| Variant | Background | Text | Border | Use Case |
|---------|------------|------|--------|----------|
| `primary` | accent.default | white | none | Main CTA, primary actions |
| `secondary` | transparent | gray.200 | 1px gray.700 | Secondary actions |
| `ghost` | transparent | gray.400 | none | Tertiary actions, icon buttons |
| `danger` | error.muted | error.default | none | Destructive actions |

### Sizes

| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| `sm` | 28px | 8px 12px | 12px | 14px |
| `md` | 32px | 8px 16px | 13px | 16px |
| `lg` | 40px | 12px 20px | 14px | 18px |

### States

| State | Visual Change | Transition |
|-------|---------------|------------|
| Default | Base styles | — |
| Hover | +10% lightness | 100ms ease-out |
| Active | -5% lightness, scale 0.98 | 50ms |
| Focus | 2px accent ring | instant |
| Disabled | 50% opacity | — |
| Loading | Spinner replaces text | 150ms fade |

### Anatomy

```
┌──────────────────────────────────┐
│  [icon]  8px  Label Text         │
│     ↑                 ↑          │
│  Optional          Required      │
└──────────────────────────────────┘
     └── 12-20px padding ──┘
```

### Specifications

```tsx
// Button.tsx structure
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
  onClick?: () => void;
}
```

---

## Inputs

Text entry components with clear states and feedback.

### Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 28px | 6px 8px | 12px |
| `md` | 32px | 8px 12px | 13px |
| `lg` | 40px | 12px 16px | 14px |

### States

| State | Border | Background | Text |
|-------|--------|------------|------|
| Default | gray.800 | gray.950 | gray.100 |
| Hover | gray.700 | gray.950 | gray.100 |
| Focus | accent.default | gray.950 | gray.100 |
| Disabled | gray.800 | gray.900 | gray.500 |
| Error | error.default | gray.950 | gray.100 |

### Anatomy

```
┌─────────────────────────────────────┐
│ Label (optional)                    │  text-xs, gray.400
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [icon]  Placeholder/Value       │ │  text-base, 1px border
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Helper text or error message        │  text-xs, gray.500 or error
└─────────────────────────────────────┘
```

### Specifications

```tsx
// Input.tsx structure
interface InputProps {
  size: 'sm' | 'md' | 'lg';
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  icon?: ReactNode;
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  value: string;
  onChange: (value: string) => void;
}
```

---

## Cards

Container components for grouped content.

### Variants

| Variant | Background | Border | Shadow | Use Case |
|---------|------------|--------|--------|----------|
| `default` | gray.950 | 1px gray.800 | none | Standard container |
| `elevated` | gray.950 | none | shadow-md | Floating content |
| `interactive` | gray.950 | 1px gray.800 | none | Clickable cards |

### States (Interactive only)

| State | Visual Change |
|-------|---------------|
| Default | Base styles |
| Hover | border gray.700, translate-y -1px |
| Active | translate-y 0 |
| Selected | border accent.default |
| Focus | 2px accent ring |

### Specifications

```
┌─────────────────────────────────┐
│                                 │
│         16px padding            │
│                                 │
│    Card content area            │
│                                 │
│         16px padding            │
│                                 │
└─────────────────────────────────┘
         └── 6px radius ──┘
```

```tsx
// Card.tsx structure
interface CardProps {
  variant: 'default' | 'elevated' | 'interactive';
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}
```

---

## Dropdown / Select

Selection from a list of options.

### Anatomy

```
Trigger (closed):
┌─────────────────────────────────┐
│  Selected value           ▼    │
└─────────────────────────────────┘

Dropdown (open):
┌─────────────────────────────────┐
│  Selected value           ▲    │
├─────────────────────────────────┤
│  Option 1                  ✓   │  ← selected
│  Option 2                      │
│  Option 3                      │
│  Option 4                      │
└─────────────────────────────────┘
```

### Specifications

- Trigger: Same as Input (md size by default)
- Dropdown: gray.950 background, 1px gray.800 border, shadow-lg
- Option height: 32px
- Option padding: 8px 12px
- Max height: 240px (scrollable)
- Selected: accent.subtle background, accent.text text

---

## Modal / Dialog

Focused content overlays.

### Sizes

| Size | Width | Use Case |
|------|-------|----------|
| `sm` | 400px | Confirmations, simple prompts |
| `md` | 560px | Forms, editors |
| `lg` | 720px | Complex content, previews |

### Anatomy

```
┌─────────────────────────────────────┐
│  Title                         ✕   │  ← Header: 16px padding
├─────────────────────────────────────┤
│                                     │
│  Modal content area                 │  ← Body: 24px padding
│                                     │
├─────────────────────────────────────┤
│              [Cancel] [Confirm]     │  ← Footer: 16px padding
└─────────────────────────────────────┘
```

### Specifications

- Background: gray.950
- Border radius: 8px
- Shadow: shadow-lg
- Backdrop: black 60% opacity
- Animation: fade in 150ms, scale from 0.95

---

## Tooltip

Contextual information on hover/focus.

### Specifications

- Background: gray.900
- Text: gray.200, text-xs
- Padding: 6px 8px
- Border radius: 4px
- Max width: 200px
- Delay: 500ms before show
- Animation: fade 100ms

### Positions

- `top` (default)
- `bottom`
- `left`
- `right`

---

## Badge

Status indicators and counts.

### Variants

| Variant | Background | Text |
|---------|------------|------|
| `default` | gray.800 | gray.300 |
| `accent` | accent.subtle | accent.text |
| `success` | success.muted | success.default |
| `warning` | warning.muted | warning.default |
| `error` | error.muted | error.default |

### Specifications

- Height: 20px
- Padding: 0 6px
- Font: text-xs, font-medium
- Border radius: full (pill shape)

---

## Toggle / Switch

Binary state controls.

### Specifications

- Track width: 36px
- Track height: 20px
- Thumb size: 16px
- Off: gray.700 track, gray.400 thumb
- On: accent.default track, white thumb
- Animation: 150ms ease-out

---

## Tabs

Navigation between related views.

### Anatomy

```
┌────────┐ ┌────────┐ ┌────────┐
│ Tab 1  │ │ Tab 2  │ │ Tab 3  │
├────────┴─┴────────┴─┴────────┴────────┐
│                                        │
│            Tab content                 │
│                                        │
└────────────────────────────────────────┘
```

### Specifications

- Tab height: 36px
- Tab padding: 12px 16px
- Active indicator: 2px accent.default bottom border
- Text: text-sm, font-medium
- Inactive: gray.500, Active: gray.100

---

## Component Checklist

Before any component ships:

- [ ] All variants documented
- [ ] All sizes implemented
- [ ] All states handled (hover, active, focus, disabled)
- [ ] Keyboard navigation works
- [ ] Screen reader accessible
- [ ] Animation timing matches spec
- [ ] Dark mode verified
- [ ] Touch targets ≥ 44px (mobile)
