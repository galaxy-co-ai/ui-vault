# Quality Checklist

> Every screen, component, and feature must pass these checks before shipping.

---

## Pre-Flight Checks

Run through this checklist before marking any work as complete. No exceptions.

---

## Visual Quality

### Layout & Spacing
- [ ] All spacing uses design system tokens (4px grid)
- [ ] No orphaned text (single words on new lines)
- [ ] Consistent alignment throughout the screen
- [ ] Proper visual hierarchy (one clear focal point)
- [ ] No layout shift on state changes
- [ ] Content doesn't overflow containers

### Typography
- [ ] Only design system font sizes used
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Text contrast meets WCAG AA (4.5:1 minimum)
- [ ] No widows/orphans in body text
- [ ] Monospace font used for all code/values

### Color
- [ ] Only design system colors used
- [ ] Semantic colors used correctly (error = red, etc.)
- [ ] Accent color reserved for interactive elements
- [ ] Sufficient contrast for all text
- [ ] Dark mode verified and functional

### Components
- [ ] All components match design specifications
- [ ] Consistent border radius per component type
- [ ] Icons are correctly sized and aligned
- [ ] Loading states implemented
- [ ] Empty states designed (not blank)
- [ ] Error states are helpful and clear

---

## Interaction Quality

### States
- [ ] Default state is visually clear
- [ ] Hover state provides feedback (100ms transition)
- [ ] Active/pressed state is distinct
- [ ] Focus state has visible ring (2px accent)
- [ ] Disabled state at 50% opacity
- [ ] Selected state clearly distinguished

### Animation
- [ ] All animations ≤ 200ms
- [ ] Animations use ease-out for entering
- [ ] Animations use ease-in for exiting
- [ ] No animation blocks user input
- [ ] `prefers-reduced-motion` respected

### Feedback
- [ ] Actions provide immediate visual feedback
- [ ] Success states confirmed (toast/indicator)
- [ ] Error messages are actionable
- [ ] Loading indicators for async operations > 300ms

---

## Accessibility

### Keyboard Navigation
- [ ] All interactive elements are focusable
- [ ] Tab order follows visual order
- [ ] Focus trap works correctly in modals
- [ ] Escape closes overlays
- [ ] Enter activates buttons/links
- [ ] Arrow keys navigate lists/menus
- [ ] No keyboard traps

### Screen Readers
- [ ] All images have alt text (or aria-hidden)
- [ ] Icon-only buttons have aria-label
- [ ] Form inputs have associated labels
- [ ] Error messages are announced
- [ ] Dynamic content changes are announced
- [ ] Headings properly structured

### WCAG Compliance
- [ ] Color contrast ratio ≥ 4.5:1 (text)
- [ ] Color contrast ratio ≥ 3:1 (large text, icons)
- [ ] Information not conveyed by color alone
- [ ] Touch targets ≥ 44px (mobile)
- [ ] Focus indicators clearly visible

---

## Functionality

### Data Handling
- [ ] Form validation works correctly
- [ ] Invalid input shows clear error
- [ ] Data persists after refresh
- [ ] Undo/cancel works where applicable
- [ ] Confirmation for destructive actions

### Error Handling
- [ ] Network errors handled gracefully
- [ ] Invalid data doesn't crash the app
- [ ] Error boundaries catch React errors
- [ ] Fallback UI displays on failure
- [ ] User can retry failed operations

### Edge Cases
- [ ] Empty states handled
- [ ] Very long content handled (truncation/scroll)
- [ ] Very short content doesn't break layout
- [ ] Special characters handled in inputs
- [ ] Concurrent operations handled safely

---

## Performance

### Rendering
- [ ] No unnecessary re-renders
- [ ] Lists virtualized if > 100 items
- [ ] Images lazy loaded
- [ ] Heavy computations memoized

### Loading
- [ ] Initial load < 2 seconds
- [ ] Interactions respond < 100ms
- [ ] No blocking operations on main thread
- [ ] Skeleton/loading states for async data

### Memory
- [ ] No memory leaks (check DevTools)
- [ ] Event listeners cleaned up
- [ ] Large data structures disposed when unused

---

## Code Quality

### TypeScript
- [ ] No `any` types (or justified exceptions)
- [ ] All props typed
- [ ] Zod schemas validate external data
- [ ] No type assertions without comment

### Components
- [ ] Single responsibility principle
- [ ] Props documented with JSDoc
- [ ] Variants use cva/variants pattern
- [ ] No inline styles (use Tailwind)

### Naming
- [ ] Component names are PascalCase
- [ ] Functions/variables are camelCase
- [ ] Constants are SCREAMING_SNAKE_CASE
- [ ] Files match default export name

### Structure
- [ ] File in correct directory
- [ ] Related files colocated
- [ ] No circular dependencies
- [ ] Exports from index files

---

## Testing

### Unit Tests
- [ ] Core logic has unit tests
- [ ] Edge cases covered
- [ ] Tests are independent (no shared state)

### Integration Tests
- [ ] Key user flows tested
- [ ] Data persistence verified
- [ ] Error handling tested

### Manual Testing
- [ ] Tested in development build
- [ ] Tested in production build
- [ ] Tested keyboard-only navigation
- [ ] Tested with screen reader (if available)

---

## Documentation

### Code Documentation
- [ ] Complex functions have JSDoc comments
- [ ] Non-obvious code has inline comments
- [ ] TODO comments have issue links

### User-Facing
- [ ] Tooltips added where needed
- [ ] Help text for complex features
- [ ] Keyboard shortcuts documented

---

## Sign-Off Questions

Before marking complete, answer honestly:

1. **Would I be proud to show this to a designer I respect?**
2. **Would I be proud to show this code to a senior engineer?**
3. **Does this feel fast and responsive?**
4. **Can a new user figure this out without instructions?**
5. **Does this match the quality bar of Linear, Figma, or Raycast?**

If any answer is "no," the work isn't done.

---

## Quick Reference

### Must-Have Before Every Commit
- [ ] No console errors/warnings
- [ ] No TypeScript errors
- [ ] Linter passes
- [ ] Manual smoke test passes

### Must-Have Before Every PR
- [ ] Full checklist completed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Screenshot/video of changes
