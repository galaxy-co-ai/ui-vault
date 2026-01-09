# Architecting a Production-Ready UI Library: Comprehensive Research Report

**Bottom Line**: Build a component library using React 18+, TypeScript, Tailwind CSS, and Framer Motion with a **copy-paste distribution model** via CLI. The winning formula combines Shadcn's architecture philosophy, Magic UI's animation patterns, and Aceternity's visual innovation—all wrapped in a robust design system with **OKLCH colors**, **semantic CSS variables**, and **CVA-based variants**. Target **12-16 weeks** for a production-ready v1.0 with 40-50 core components.

---

## Part 1: Executive Summary

### The landscape has converged on a new paradigm

The era of monolithic npm component libraries is ending. Shadcn UI's **104,000+ GitHub stars** proved that developers want **code ownership over dependency management**. Magic UI and Aceternity have extended this model to animation-rich components, creating a new category: **copy-paste animated component libraries**.

Three architectural principles now dominate the space:

1. **Two-layer separation**: Headless primitives (Radix UI) handle behavior; Tailwind CSS handles styling
2. **Registry-based distribution**: JSON schemas + CLI tooling replace npm packages
3. **CSS variable theming**: OKLCH/HSL color systems enable runtime theme switching without rebuilds

The technology stack is effectively standardized: **React + TypeScript + Tailwind CSS + Framer Motion**. Differentiation now comes from animation quality, design polish, and developer experience.

### Key findings from competitive analysis

**Magic UI** leads in community adoption with **19,600+ stars** and **150+ components** spanning text animations, backgrounds, special effects, and device mocks. Their strength is breadth and documentation quality. Components follow consistent patterns: `className` prop for customization, CSS variables for runtime configuration (e.g., `[--duration:20s]`), and sensible animation defaults (**0.3-0.4s duration**, spring animations with **damping: 8-12**, **stiffness: 150-300**).

**Aceternity UI** excels at visual impact with **70+ free components** focused on backgrounds, 3D effects, and cursor-following interactions. Their Lamp Effect, Macbook Scroll, and Google Gemini Effect demonstrate techniques neither competitor offers. They've proven the market for premium templates at **$169 lifetime pricing**.

**Shadcn UI** provides the architectural blueprint. Their CVA (Class Variance Authority) pattern for type-safe variants, the `cn()` utility combining clsx + tailwind-merge, and the compound component pattern (Dialog → DialogTrigger → DialogContent) are industry standards. Their CLI implementation—fetching from a JSON registry, resolving dependencies, transforming import paths—is the gold standard.

### Strategic recommendations

Build with the **freemium model**: open-source core components (60-80) plus premium templates (landing pages, dashboards, marketing sections). Focus differentiation on three gaps in the market:

- **Accessibility-first animations**: Neither competitor prioritizes `useReducedMotion` or ARIA
- **Server Component compatibility**: React Server Components are underserved
- **Performance profiling**: No library offers animation performance debugging tools

Target **modern web developers building SaaS, marketing sites, and web apps** who value sophisticated animations but need production reliability. Price premium templates at **$149-199 lifetime** to match market expectations.

---

## Part 2: Technical Architecture Document

### Recommended technology stack

| Layer | Technology | Version | Justification |
|-------|------------|---------|---------------|
| Framework | React | 18.3+ / 19 | Hooks, Suspense, Server Components |
| Type System | TypeScript | 5.x | Strict mode, satisfies operator, const assertions |
| Styling | Tailwind CSS | 4.x | OKLCH colors, @theme directive, improved dark mode |
| Animations | Framer Motion | 12.x | Industry standard, layout animations, gestures |
| Primitives | Radix UI | Latest | Accessible headless components |
| Variants | CVA | 0.7+ | Type-safe variant management |
| Utilities | clsx + tailwind-merge | Latest | Class composition and conflict resolution |
| Icons | Lucide React | Latest | Tree-shakeable, consistent design |
| CLI | Commander.js | Latest | Standard for Node CLIs |

### Component hierarchy and organization

```
ui-library/
├── packages/
│   ├── core/                    # Core component source
│   │   ├── components/
│   │   │   ├── primitives/      # Button, Input, Badge, Avatar
│   │   │   ├── layout/          # Card, Container, Grid, Stack
│   │   │   ├── feedback/        # Toast, Dialog, Alert, Progress
│   │   │   ├── navigation/      # Tabs, Menu, Breadcrumb, Dock
│   │   │   ├── data-display/    # Table, List, Accordion, Timeline
│   │   │   ├── animations/      # BlurFade, TextAnimate, Marquee
│   │   │   ├── backgrounds/     # Particles, Grid, Spotlight, Beam
│   │   │   └── effects/         # Shimmer, Confetti, Meteors
│   │   ├── hooks/
│   │   │   ├── use-animation-state.ts
│   │   │   ├── use-reduced-motion.ts
│   │   │   └── use-scroll-progress.ts
│   │   └── lib/
│   │       ├── utils.ts         # cn() function
│   │       ├── animation-presets.ts
│   │       └── tokens.ts
│   ├── cli/                     # CLI package
│   │   ├── commands/
│   │   │   ├── init.ts
│   │   │   ├── add.ts
│   │   │   └── diff.ts
│   │   └── registry/
│   │       └── registry.json
│   └── docs/                    # Documentation site
├── templates/                   # Premium templates
│   ├── saas/
│   ├── ai-agent/
│   └── portfolio/
└── registry/                    # Built component registry
    └── r/
        ├── button.json
        ├── dialog.json
        └── ...
```

### Animation system architecture

The animation system follows a **three-tier pattern**:

**Tier 1 - Animation Tokens** (design system level):
```typescript
// lib/animation-presets.ts
export const durations = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const

export const easings = {
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: { type: "spring", stiffness: 300, damping: 20 },
  springBouncy: { type: "spring", stiffness: 400, damping: 10 },
  springSmooth: { type: "spring", stiffness: 200, damping: 25 },
} as const

export const variants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
} as const
```

**Tier 2 - Animation Components** (reusable primitives):
```typescript
// components/animations/blur-fade.tsx
interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  blur?: string
  inView?: boolean
  once?: boolean
}
```

**Tier 3 - Composed Animations** (complex orchestrations):
```typescript
// Staggered list with orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}
```

### Theme system design

Adopt Shadcn's CSS variable pattern with **OKLCH colors** for perceptual uniformity:

```css
/* globals.css */
@layer base {
  :root {
    --radius: 0.5rem;
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
  }

  .dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.145 0 0);
    --card-foreground: oklch(0.985 0 0);
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --border: oklch(0.269 0 0);
    --input: oklch(0.269 0 0);
    --ring: oklch(0.439 0 0);
  }
}
```

### Build and distribution strategy

**Registry JSON Schema** (per component):
```json
{
  "$schema": "https://yourlib.dev/schema/registry-item.json",
  "name": "button",
  "type": "registry:component",
  "title": "Button",
  "description": "A clickable button with variants",
  "dependencies": ["class-variance-authority", "@radix-ui/react-slot"],
  "registryDependencies": [],
  "files": [
    {
      "path": "registry/components/button.tsx",
      "type": "registry:component",
      "target": "components/ui/button.tsx"
    }
  ],
  "cssVars": {},
  "css": {}
}
```

**CLI `add` Command Flow**:
1. Parse `components.json` configuration
2. Fetch component JSON from registry
3. Resolve npm dependencies (install if missing)
4. Resolve registry dependencies (recursively add)
5. Transform import paths based on aliases
6. Write files to configured directories
7. Update CSS if component has cssVars/css

---

## Part 3: Component Patterns Catalog

### Core component patterns with code examples

**Pattern 1: Variant-Based Component (Button)**
```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**Pattern 2: Animated Entrance Component (BlurFade)**
```typescript
"use client"

import { motion, useInView, type Variants } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
  offset?: number
  direction?: "up" | "down" | "left" | "right"
  inView?: boolean
  inViewMargin?: string
  blur?: string
  once?: boolean
}

export function BlurFade({
  children,
  className,
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = "down",
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
  once = true,
}: BlurFadeProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: inViewMargin })
  const shouldAnimate = inView ? isInView : true

  const directionOffset = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
  }

  const variants: Variants = {
    hidden: {
      opacity: 0,
      filter: `blur(${blur})`,
      ...directionOffset[direction],
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
```

**Pattern 3: Text Animation Component**
```typescript
"use client"

import { motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

type AnimationType = "fadeIn" | "blurIn" | "slideUp" | "scaleUp" | "blurInUp"

interface TextAnimateProps {
  children: string
  className?: string
  delay?: number
  duration?: number
  by?: "word" | "character" | "line"
  animation?: AnimationType
  startOnView?: boolean
  once?: boolean
}

const animationVariants: Record<AnimationType, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  blurIn: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  blurInUp: {
    hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
}

export function TextAnimate({
  children,
  className,
  delay = 0,
  duration = 0.3,
  by = "word",
  animation = "fadeIn",
  startOnView = true,
  once = true,
}: TextAnimateProps) {
  const segments = by === "word" 
    ? children.split(" ") 
    : by === "character" 
    ? children.split("") 
    : children.split("\n")

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  }

  return (
    <motion.span
      className={cn("inline-flex flex-wrap", className)}
      variants={containerVariants}
      initial="hidden"
      whileInView={startOnView ? "visible" : undefined}
      animate={!startOnView ? "visible" : undefined}
      viewport={{ once }}
    >
      {segments.map((segment, i) => (
        <motion.span
          key={i}
          variants={animationVariants[animation]}
          transition={{ duration }}
          className="inline-block"
        >
          {segment}
          {by === "word" && i < segments.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </motion.span>
  )
}
```

**Pattern 4: Compound Component (Dialog)**
```typescript
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogTitle }
```

**Pattern 5: Background Effect Component (Particles)**
```typescript
"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface ParticlesProps {
  className?: string
  quantity?: number
  ease?: number
  color?: string
  refresh?: boolean
}

export function Particles({
  className,
  quantity = 100,
  ease = 80,
  color,
  refresh = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const [particleColor, setParticleColor] = useState(color)

  useEffect(() => {
    if (!color) {
      setParticleColor(resolvedTheme === "dark" ? "#ffffff" : "#000000")
    }
  }, [color, resolvedTheme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      for (let i = 0; i < quantity; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = particleColor || "#000"

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    resize()
    createParticles()
    animate()

    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [quantity, particleColor, refresh])

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none fixed inset-0 -z-10", className)}
    />
  )
}
```

### Animation recipes for common UI patterns

| Pattern | Duration | Easing | Code |
|---------|----------|--------|------|
| Button Press | 100ms | spring(400, 17) | `whileTap={{ scale: 0.98 }}` |
| Card Hover | 200ms | spring(300, 20) | `whileHover={{ y: -8, shadow: "lg" }}` |
| Modal Enter | 300ms | spring(300, 25) | `animate={{ opacity: 1, scale: 1 }}` |
| Modal Exit | 150ms | easeOut | `exit={{ opacity: 0, scale: 0.95 }}` |
| Tab Switch | 200ms | easeInOut | `layout layoutId="tab-indicator"` |
| Dropdown | 200ms | easeOut | `animate={{ opacity: 1, y: 0 }}` |
| Toast Enter | 300ms | spring(300, 20) | `initial={{ opacity: 0, y: 50 }}` |
| Skeleton Shimmer | 1.5s | linear | `animate={{ backgroundPosition }}` |
| Stagger List | 80ms gap | default | `staggerChildren: 0.08` |
| Accordion | 300ms | easeInOut | `animate={{ height: "auto" }}` |

---

## Part 4: Design System Specification

### Color palette (OKLCH-based)

**Light Mode Core Colors:**
```css
--background: oklch(1 0 0);           /* Pure white */
--foreground: oklch(0.145 0 0);       /* Near black */
--primary: oklch(0.205 0 0);          /* Deep gray */
--primary-foreground: oklch(0.985 0 0);
--secondary: oklch(0.97 0 0);         /* Light gray */
--secondary-foreground: oklch(0.205 0 0);
--muted: oklch(0.97 0 0);
--muted-foreground: oklch(0.556 0 0);
--accent: oklch(0.97 0 0);
--destructive: oklch(0.577 0.245 27);  /* Red */
--border: oklch(0.922 0 0);
--ring: oklch(0.708 0 0);
```

**Dark Mode Core Colors:**
```css
--background: oklch(0.145 0 0);       /* Near black */
--foreground: oklch(0.985 0 0);       /* Near white */
--primary: oklch(0.922 0 0);
--primary-foreground: oklch(0.205 0 0);
--secondary: oklch(0.269 0 0);
--secondary-foreground: oklch(0.985 0 0);
--muted: oklch(0.269 0 0);
--muted-foreground: oklch(0.708 0 0);
--accent: oklch(0.269 0 0);
--border: oklch(0.269 0 0);
--ring: oklch(0.439 0 0);
```

### Typography scale

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| text-xs | 12px / 0.75rem | 16px | Labels, captions |
| text-sm | 14px / 0.875rem | 20px | Secondary text |
| text-base | 16px / 1rem | 24px | Body text |
| text-lg | 18px / 1.125rem | 28px | Lead paragraphs |
| text-xl | 20px / 1.25rem | 28px | Section headers |
| text-2xl | 24px / 1.5rem | 32px | Card titles |
| text-3xl | 30px / 1.875rem | 36px | Page headers |
| text-4xl | 36px / 2.25rem | 40px | Hero subheads |
| text-5xl | 48px / 3rem | 1 | Hero headlines |
| text-6xl | 60px / 3.75rem | 1 | Display text |

**Font Weights:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing system

Based on **4px base unit** (Tailwind default):

| Token | Value | Usage |
|-------|-------|-------|
| 1 | 4px | Icon padding |
| 2 | 8px | Tight spacing, badges |
| 3 | 12px | Button padding-y |
| 4 | 16px | Card padding, form gaps |
| 6 | 24px | Section padding |
| 8 | 32px | Component gaps |
| 12 | 48px | Section margins |
| 16 | 64px | Page sections |
| 20 | 80px | Hero spacing |
| 24 | 96px | Major section breaks |

### Shadow/elevation system

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | `0 1px 2px rgba(0,0,0,0.05)` | Subtle cards |
| shadow | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)` | Default cards |
| shadow-md | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)` | Elevated cards |
| shadow-lg | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)` | Modals, dropdowns |
| shadow-xl | `0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.1)` | Popovers |
| shadow-2xl | `0 25px 50px rgba(0,0,0,0.25)` | Focus states |

### Border radius scale

| Token | Value | Usage |
|-------|-------|-------|
| rounded-sm | 2px | Subtle rounding |
| rounded | 4px | Badges, small elements |
| rounded-md | 6px | Buttons, inputs |
| rounded-lg | 8px | Cards (default) |
| rounded-xl | 12px | Large cards |
| rounded-2xl | 16px | Modals |
| rounded-full | 9999px | Pills, avatars |

---

## Part 5: Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

**Week 1-2: Core Infrastructure**
- [ ] Initialize monorepo with Turborepo
- [ ] Set up TypeScript configuration (strict mode)
- [ ] Configure Tailwind CSS 4 with OKLCH theme
- [ ] Create `cn()` utility with clsx + tailwind-merge
- [ ] Set up animation tokens and presets
- [ ] Build documentation site scaffolding

**Week 3-4: CLI Foundation**
- [ ] Build CLI with Commander.js
- [ ] Create component registry JSON schema
- [ ] Implement `init` command
- [ ] Implement `add` command with dependency resolution
- [ ] Create `components.json` configuration system
- [ ] Set up registry hosting

**Milestone 1**: Working CLI that can add components to a project

### Phase 2: Core Components (Weeks 5-8)

**Week 5-6: Primitives**
- [ ] Button (6 variants, 4 sizes)
- [ ] Input, Textarea, Select
- [ ] Checkbox, Radio, Switch
- [ ] Badge, Avatar
- [ ] Card (compound component)
- [ ] Label

**Week 7-8: Feedback & Navigation**
- [ ] Dialog/Modal
- [ ] Toast (with Sonner integration)
- [ ] Alert
- [ ] Progress
- [ ] Tabs
- [ ] Dropdown Menu
- [ ] Accordion

**Milestone 2**: 20 production-ready primitive components

### Phase 3: Animation Components (Weeks 9-11)

**Week 9: Text Animations**
- [ ] TextAnimate (6 animation types)
- [ ] TypingAnimation
- [ ] NumberTicker
- [ ] BlurFade
- [ ] WordRotate

**Week 10: Special Effects**
- [ ] Marquee (horizontal/vertical)
- [ ] Shimmer Button
- [ ] Rainbow Button
- [ ] Confetti
- [ ] Animated Border

**Week 11: Backgrounds**
- [ ] Particles
- [ ] Grid Pattern
- [ ] Dot Pattern
- [ ] Spotlight
- [ ] Animated Beam

**Milestone 3**: 15 animation components, 10 effect components

### Phase 4: Polish & Launch (Weeks 12-14)

**Week 12: Documentation**
- [ ] Component documentation with live examples
- [ ] Installation guide
- [ ] Theming documentation
- [ ] Animation cookbook

**Week 13: Testing & Accessibility**
- [ ] Add accessibility attributes to all components
- [ ] Implement `useReducedMotion` across animations
- [ ] Browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing

**Week 14: Launch Prep**
- [ ] Performance optimization audit
- [ ] Bundle size analysis
- [ ] SEO for documentation site
- [ ] Launch blog post

**Milestone 4**: v1.0 launch with 40-50 components

### Phase 5: Premium Templates (Weeks 15-16)

**Week 15-16: Template Development**
- [ ] SaaS landing page template (14 sections)
- [ ] AI/Agent template (9 sections)
- [ ] Pricing and licensing setup
- [ ] Template documentation

**Milestone 5**: 2 premium templates ready for sale

---

## Part 6: Best Practices Guide

### Do's

1. **Always use `cn()` for className merging** - Ensures Tailwind class conflicts are resolved and conditional classes work correctly

2. **Provide sensible defaults** - Every animation prop should have a default that works well out of the box
   ```typescript
   duration = 0.3,  // Not undefined
   delay = 0,       // Explicit zero
   ```

3. **Support `className` on every component** - Users expect to customize with Tailwind classes

4. **Use `forwardRef` for DOM components** - Enables refs for forms, focus management, and third-party integrations

5. **Implement `asChild` pattern with Radix Slot** - Allows rendering as different elements
   ```tsx
   <Button asChild>
     <Link href="/login">Login</Link>
   </Button>
   ```

6. **Use CSS variables for runtime theming** - Enables dark mode toggle without rebuild

7. **Prefer GPU-accelerated properties** - `transform`, `opacity`, `filter` instead of `width`, `height`, `left`

8. **Support `inView` and `once` props for scroll animations** - Standard pattern users expect

### Don'ts

1. **Don't use `@apply` excessively** - Extract to React components instead

2. **Don't hard-code colors** - Always use CSS variables (`bg-primary`, not `bg-blue-500`)

3. **Don't forget exit animations** - Users notice when modals disappear abruptly
   ```tsx
   // Bad
   {isOpen && <Modal />}
   
   // Good
   <AnimatePresence>
     {isOpen && <Modal />}
   </AnimatePresence>
   ```

4. **Don't use long animation durations for micro-interactions** - Keep button/hover at 100-200ms

5. **Don't ignore `prefers-reduced-motion`** - Always implement accessibility
   ```typescript
   const shouldReduceMotion = useReducedMotion()
   ```

6. **Don't create wrapper div soup** - Use fragments and semantic HTML

7. **Don't skip TypeScript generics** - `VariantProps<typeof buttonVariants>` provides autocomplete

### Performance optimization checklist

- [ ] Use `LazyMotion` with `domAnimation` to reduce bundle size (~8kb vs ~16kb)
- [ ] Prefer `transform` and `opacity` animations (GPU-accelerated)
- [ ] Add `layoutDependency` prop to reduce layout measurements
- [ ] Use `will-change` sparingly and remove after animation
- [ ] Virtualize lists over 50 items
- [ ] Memoize variant objects with `useMemo`
- [ ] Keep exit animations under 200ms
- [ ] Test on mobile devices (animations are more expensive)

### Accessibility requirements

- [ ] All interactive elements have focus styles (`focus-visible:ring-2`)
- [ ] Dialogs trap focus and return focus on close
- [ ] Proper ARIA attributes (`aria-label`, `aria-describedby`)
- [ ] Support `prefers-reduced-motion` media query
- [ ] Keyboard navigation for all components
- [ ] Sufficient color contrast (WCAG AA minimum)
- [ ] Screen reader announcements for dynamic content

---

## Part 7: Code Starter Templates

### Base component template

```typescript
// components/ui/[component-name].tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-classes-here", // Base styles applied to all variants
  {
    variants: {
      variant: {
        default: "variant-default-classes",
        secondary: "variant-secondary-classes",
      },
      size: {
        default: "size-default-classes",
        sm: "size-sm-classes",
        lg: "size-lg-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Component.displayName = "Component"

export { Component, componentVariants }
```

### Animated component template

```typescript
// components/ui/[animated-component].tsx
"use client"

import * as React from "react"
import { motion, useInView, type Variants } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedComponentProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
}

const defaultVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

export function AnimatedComponent({
  children,
  className,
  delay = 0,
  duration = 0.4,
  once = true,
}: AnimatedComponentProps) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once })
  const shouldReduceMotion = useReducedMotion()

  // Respect reduced motion preference
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={defaultVariants}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
```

### Complex composition template

```typescript
// components/ui/[compound-component].tsx
"use client"

import * as React from "react"
import * as PrimitiveName from "@radix-ui/react-primitive"
import { cn } from "@/lib/utils"

// Root context for compound component
interface CompoundContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CompoundContext = React.createContext<CompoundContextValue | undefined>(undefined)

function useCompoundContext() {
  const context = React.useContext(CompoundContext)
  if (!context) {
    throw new Error("Compound components must be used within CompoundRoot")
  }
  return context
}

// Root component
interface CompoundRootProps {
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function CompoundRoot({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: CompoundRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  
  const isOpen = controlledOpen ?? uncontrolledOpen
  const setIsOpen = React.useCallback(
    (open: boolean) => {
      setUncontrolledOpen(open)
      onOpenChange?.(open)
    },
    [onOpenChange]
  )

  return (
    <CompoundContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </CompoundContext.Provider>
  )
}

// Trigger component
const CompoundTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const { setIsOpen, isOpen } = useCompoundContext()

  return (
    <button
      ref={ref}
      onClick={(e) => {
        setIsOpen(!isOpen)
        onClick?.(e)
      }}
      className={cn("trigger-styles", className)}
      {...props}
    />
  )
})
CompoundTrigger.displayName = "CompoundTrigger"

// Content component
const CompoundContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen } = useCompoundContext()

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={cn("content-styles", className)}
      {...props}
    />
  )
})
CompoundContent.displayName = "CompoundContent"

export {
  CompoundRoot,
  CompoundTrigger,
  CompoundContent,
}
```

### Documentation page template

```tsx
// docs/components/[component].mdx
---
title: Component Name
description: Brief description of the component and its purpose.
---

import { ComponentPreview } from "@/components/docs/component-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

## Installation

\`\`\`bash
npx yourlib@latest add component-name
\`\`\`

## Usage

\`\`\`tsx
import { Component } from "@/components/ui/component"

export default function Example() {
  return (
    <Component variant="default" size="md">
      Content here
    </Component>
  )
}
\`\`\`

<ComponentPreview name="component-demo" />

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `"default" \| "secondary"` | `"default"` | Visual variant |
| size | `"sm" \| "default" \| "lg"` | `"default"` | Size variant |
| className | `string` | - | Additional CSS classes |

## Examples

### Default

<ComponentPreview name="component-default" />

### With Animation

<ComponentPreview name="component-animated" />

## Accessibility

This component follows WAI-ARIA guidelines:
- Keyboard navigable with Tab and Enter
- Proper focus management
- Screen reader announcements
```

---

## Conclusion

This research provides a complete blueprint for building a production-ready UI library. The key architectural decisions—**copy-paste distribution**, **CVA variants**, **OKLCH theming**, and **Framer Motion animations**—are proven patterns from libraries with **100,000+ combined GitHub stars**.

The differentiation opportunity lies in three areas competitors underserve: **accessibility-first animations**, **Server Component compatibility**, and **performance profiling tools**. Combined with the freemium model (open-source core + premium templates at $149-199), this positions the library for both adoption and revenue.

Execute the 16-week roadmap to deliver v1.0 with **40-50 components**, comprehensive documentation, and two premium templates. The technology stack (React 18+, TypeScript 5, Tailwind CSS 4, Framer Motion 12) ensures longevity, while the registry-based CLI enables sustainable distribution without npm dependency management overhead.
