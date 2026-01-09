# Animation & Motion

> Speed communicates respect. Every animation confirms, guides, or smooths—never decorates.

---

## Philosophy

Animation in UI Vault serves exactly three purposes:
1. **Confirm actions** — Visual feedback that something happened
2. **Guide attention** — Direct focus to what changed
3. **Smooth transitions** — Reduce jarring state changes

If an animation doesn't serve one of these, remove it.

---

## Core Principles

### 1. Fast by Default

Users notice lag before they notice beauty. Our baseline:
- **Micro-interactions**: 50-100ms
- **State changes**: 150ms
- **Panel transitions**: 200ms
- **Page transitions**: 250-300ms (rare)

### 2. Never Blocking

Animations must never prevent user input. If a user clicks during an animation, their action takes precedence.

### 3. Meaningful Easing

- **Ease-out** for elements entering (decelerates into place)
- **Ease-in** for elements leaving (accelerates away)
- **Ease-in-out** only for looping animations

### 4. Reduce Motion Respect

Honor `prefers-reduced-motion`. When enabled:
- Remove all non-essential animations
- Keep only instant state changes
- Maintain functionality without motion

---

## Duration Tokens

| Token | Duration | Use Case |
|-------|----------|----------|
| `duration-instant` | 50ms | Color changes, opacity shifts |
| `duration-fast` | 100ms | Hover states, small feedback |
| `duration-normal` | 150ms | Dropdowns, tooltips, toggles |
| `duration-smooth` | 200ms | Modals, panels, cards |
| `duration-slow` | 300ms | Page transitions (use sparingly) |

### Implementation

```typescript
// tailwind.config.ts
export default {
  theme: {
    transitionDuration: {
      instant: '50ms',
      fast: '100ms',
      normal: '150ms',
      smooth: '200ms',
      slow: '300ms',
    },
  },
}
```

```css
:root {
  --duration-instant: 50ms;
  --duration-fast: 100ms;
  --duration-normal: 150ms;
  --duration-smooth: 200ms;
  --duration-slow: 300ms;
}
```

---

## Easing Functions

| Token | Value | Use Case |
|-------|-------|----------|
| `ease-default` | cubic-bezier(0.4, 0, 0.2, 1) | General purpose |
| `ease-in` | cubic-bezier(0.4, 0, 1, 1) | Elements exiting |
| `ease-out` | cubic-bezier(0, 0, 0.2, 1) | Elements entering |
| `ease-bounce` | cubic-bezier(0.34, 1.56, 0.64, 1) | Success only |

### Implementation

```typescript
// tailwind.config.ts
export default {
  theme: {
    transitionTimingFunction: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
}
```

---

## Animation Patterns

### Hover States

Quick, subtle feedback.

```css
.button {
  transition: background-color 100ms ease-out,
              transform 50ms ease-out;
}

.button:hover {
  /* Lighter background */
}

.button:active {
  transform: scale(0.98);
}
```

### Focus Rings

Instant appearance, no animation needed.

```css
.interactive:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
```

### Dropdowns & Tooltips

Enter from origin point.

```css
.dropdown {
  transform-origin: top;
  transition: opacity 150ms ease-out,
              transform 150ms ease-out;
}

.dropdown[data-state="closed"] {
  opacity: 0;
  transform: scaleY(0.95);
}

.dropdown[data-state="open"] {
  opacity: 1;
  transform: scaleY(1);
}
```

### Modals

Scale and fade for focus.

```css
.modal-backdrop {
  transition: opacity 150ms ease-out;
}

.modal-content {
  transition: opacity 150ms ease-out,
              transform 150ms ease-out;
}

.modal-content[data-state="closed"] {
  opacity: 0;
  transform: scale(0.95);
}

.modal-content[data-state="open"] {
  opacity: 1;
  transform: scale(1);
}
```

### Sidebar Collapse

Smooth width transition.

```css
.sidebar {
  transition: width 200ms ease-out;
}

.sidebar[data-collapsed="true"] {
  width: 60px;
}

.sidebar[data-collapsed="false"] {
  width: 260px;
}
```

### Loading States

Subtle pulse, not spinning chaos.

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading {
  animation: pulse 1.5s ease-in-out infinite;
}
```

### Toast Notifications

Enter from edge, auto-dismiss.

```css
.toast {
  transition: opacity 150ms ease-out,
              transform 150ms ease-out;
}

.toast[data-state="entering"] {
  opacity: 0;
  transform: translateX(100%);
}

.toast[data-state="visible"] {
  opacity: 1;
  transform: translateX(0);
}

.toast[data-state="exiting"] {
  opacity: 0;
  transform: translateX(100%);
}
```

---

## Reduced Motion

Always provide a reduced motion alternative.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Or use Tailwind's `motion-safe` and `motion-reduce` variants:

```html
<div class="motion-safe:transition-all motion-safe:duration-normal">
  Animates only when motion is OK
</div>
```

---

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Bounce animations | Feels playful, not professional |
| Delays > 100ms | Users perceive lag |
| Parallax effects | Distracting, accessibility issues |
| Animations > 300ms | Feels slow |
| Animation on every hover | Overwhelming |
| Transform origin mismatches | Feels unnatural |
| Animating layout properties | Performance hit (use transform/opacity) |

---

## Performance Guidelines

### Use Transform & Opacity

These are GPU-accelerated and don't trigger layout recalculation:
- `transform` (translate, scale, rotate)
- `opacity`

### Avoid Animating

These trigger expensive reflows:
- `width`, `height`
- `margin`, `padding`
- `top`, `left`, `right`, `bottom`
- `font-size`

### Use `will-change` Sparingly

Only for elements that will definitely animate:

```css
.will-animate {
  will-change: transform, opacity;
}
```

Remove after animation completes to free GPU memory.

---

## Animation Checklist

Before shipping any animation:

- [ ] Duration ≤ 200ms for interactions
- [ ] Uses ease-out for entering elements
- [ ] Uses ease-in for exiting elements
- [ ] Respects `prefers-reduced-motion`
- [ ] Doesn't block user input
- [ ] Uses transform/opacity only
- [ ] Has clear purpose (confirm, guide, or smooth)
