"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export interface AnimatedBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Border width in pixels
   * @default 2
   */
  borderWidth?: number
  /**
   * Border radius
   * @default "0.5rem"
   */
  borderRadius?: string
  /**
   * Gradient colors for the animated border
   * @default ["#ff0080", "#7928ca", "#0070f3"]
   */
  colors?: string[]
  /**
   * Animation duration
   * @default "3s"
   */
  duration?: string
  /**
   * Background color inside the border
   * @default "hsl(var(--background))"
   */
  background?: string
  /**
   * Content inside the animated border
   */
  children: React.ReactNode
}

/**
 * A container with an animated gradient border effect.
 * Perfect for highlighting cards, sections, or interactive elements.
 *
 * @example
 * <AnimatedBorder>
 *   <div className="p-6">Content here</div>
 * </AnimatedBorder>
 *
 * @example
 * <AnimatedBorder
 *   colors={["#f97316", "#eab308", "#22c55e"]}
 *   borderWidth={3}
 *   duration="2s"
 * >
 *   <Card>Premium Feature</Card>
 * </AnimatedBorder>
 */
const AnimatedBorder = React.forwardRef<HTMLDivElement, AnimatedBorderProps>(
  (
    {
      borderWidth = 2,
      borderRadius = "0.5rem",
      colors = ["#ff0080", "#7928ca", "#0070f3"],
      duration = "3s",
      background = "hsl(var(--background))",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()

    const gradientColors = colors.join(", ")

    return (
      <div
        ref={ref}
        style={
          {
            "--border-width": `${borderWidth}px`,
            "--border-radius": borderRadius,
            "--gradient-colors": gradientColors,
            "--animation-duration": duration,
            "--background": background,
          } as React.CSSProperties
        }
        className={cn("relative p-[var(--border-width)]", className)}
        {...props}
      >
        {/* Animated gradient border */}
        <div
          className={cn(
            "absolute inset-0 rounded-[var(--border-radius)]",
            shouldReduceMotion
              ? "bg-gradient-to-r"
              : "animate-border-spin bg-[length:300%_300%]"
          )}
          style={{
            background: `linear-gradient(90deg, ${gradientColors}, ${colors[0]})`,
            backgroundSize: shouldReduceMotion ? "100% 100%" : "300% 300%",
          }}
        />

        {/* Inner content container */}
        <div
          className="relative rounded-[calc(var(--border-radius)-var(--border-width))]"
          style={{ background }}
        >
          {children}
        </div>
      </div>
    )
  }
)
AnimatedBorder.displayName = "AnimatedBorder"

export { AnimatedBorder }
