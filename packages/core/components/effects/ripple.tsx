"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface RippleItem {
  id: number
  x: number
  y: number
  size: number
}

export interface RippleProps {
  /**
   * Additional className for the container
   */
  className?: string
  /**
   * Ripple color
   * @default "currentColor"
   */
  color?: string
  /**
   * Ripple animation duration in seconds
   * @default 0.6
   */
  duration?: number
  /**
   * Maximum opacity of the ripple
   * @default 0.3
   */
  opacity?: number
}

/**
 * Hook to add ripple effect to any interactive element.
 * Returns props to spread on the container and the Ripple component to render.
 *
 * @example
 * function MyButton({ children }) {
 *   const { containerProps, ripples, onRipple } = useRipple()
 *
 *   return (
 *     <button {...containerProps} onClick={(e) => { onRipple(e); handleClick(); }}>
 *       {children}
 *       {ripples}
 *     </button>
 *   )
 * }
 */
export function useRipple(options: RippleProps = {}) {
  const {
    color = "currentColor",
    duration = 0.6,
    opacity = 0.3,
  } = options

  const [ripples, setRipples] = React.useState<RippleItem[]>([])
  const containerRef = React.useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const onRipple = React.useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (shouldReduceMotion) return

      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      let x: number
      let y: number

      if ("touches" in event && event.touches[0]) {
        x = event.touches[0].clientX - rect.left
        y = event.touches[0].clientY - rect.top
      } else if ("clientX" in event) {
        x = event.clientX - rect.left
        y = event.clientY - rect.top
      } else {
        // Fallback to center if coordinates can't be determined
        x = rect.width / 2
        y = rect.height / 2
      }

      const size = Math.max(rect.width, rect.height) * 2

      const newRipple: RippleItem = {
        id: Date.now(),
        x,
        y,
        size,
      }

      setRipples((prev) => [...prev, newRipple])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, duration * 1000)
    },
    [duration, shouldReduceMotion]
  )

  const ripplesElement = (
    <AnimatePresence>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity }}
          animate={{ scale: 1, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration, ease: "easeOut" }}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
          }}
        />
      ))}
    </AnimatePresence>
  )

  return {
    containerRef,
    containerProps: {
      ref: containerRef,
      className: "relative overflow-hidden",
    },
    ripples: ripplesElement,
    onRipple,
  }
}

export interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    RippleProps {
  children: React.ReactNode
}

/**
 * A button component with built-in ripple effect.
 * Material Design-style click ripple animation.
 *
 * @example
 * <RippleButton onClick={() => console.log("clicked")}>
 *   Click Me
 * </RippleButton>
 *
 * @example
 * // Custom ripple color
 * <RippleButton color="rgba(255, 255, 255, 0.5)" duration={0.8}>
 *   Submit
 * </RippleButton>
 */
const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, children, color, duration, opacity, onClick, ...props }, ref) => {
    const { containerRef, ripples, onRipple } = useRipple({
      color,
      duration,
      opacity,
    })

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onRipple(event)
        onClick?.(event)
      },
      [onRipple, onClick]
    )

    // Merge refs
    const mergedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        (containerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [containerRef, ref]
    )

    return (
      <button
        ref={mergedRef}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
        {ripples}
      </button>
    )
  }
)
RippleButton.displayName = "RippleButton"

/**
 * Standalone ripple effect component.
 * Use this to add ripple effects to custom elements.
 *
 * @example
 * <div className="relative overflow-hidden" onClick={handleRipple}>
 *   <Ripple active={showRipple} x={rippleX} y={rippleY} />
 *   Content
 * </div>
 */
export interface StandaloneRippleProps {
  /**
   * Whether the ripple is active
   */
  active: boolean
  /**
   * X coordinate of ripple origin
   */
  x: number
  /**
   * Y coordinate of ripple origin
   */
  y: number
  /**
   * Ripple color
   * @default "currentColor"
   */
  color?: string
  /**
   * Animation duration in seconds
   * @default 0.6
   */
  duration?: number
  /**
   * Maximum size of the ripple
   * @default 200
   */
  size?: number
}

const Ripple = React.forwardRef<HTMLSpanElement, StandaloneRippleProps>(
  ({ active, x, y, color = "currentColor", duration = 0.6, size = 200 }, ref) => {
    const shouldReduceMotion = useReducedMotion()

    if (shouldReduceMotion || !active) return null

    return (
      <motion.span
        ref={ref}
        initial={{ scale: 0, opacity: 0.3 }}
        animate={{ scale: 1, opacity: 0 }}
        transition={{ duration, ease: "easeOut" }}
        className="pointer-events-none absolute rounded-full"
        style={{
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          backgroundColor: color,
        }}
      />
    )
  }
)
Ripple.displayName = "Ripple"

export { Ripple, RippleButton }
