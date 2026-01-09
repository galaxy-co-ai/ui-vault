"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The shimmer color
   * @default "#ffffff"
   */
  shimmerColor?: string
  /**
   * The shimmer size in pixels
   * @default "0.05em"
   */
  shimmerSize?: string
  /**
   * The border radius
   * @default "100px"
   */
  borderRadius?: string
  /**
   * The shimmer animation duration
   * @default "3s"
   */
  shimmerDuration?: string
  /**
   * The background color
   * @default "rgba(0, 0, 0, 1)"
   */
  background?: string
}

/**
 * A button with a shimmering border effect.
 *
 * @example
 * <ShimmerButton>Get Started</ShimmerButton>
 *
 * @example
 * <ShimmerButton shimmerColor="#ff0080" shimmerDuration="2s">
 *   Subscribe
 * </ShimmerButton>
 */
const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()

    return (
      <button
        ref={ref}
        style={
          {
            "--shimmer-color": shimmerColor,
            "--shimmer-size": shimmerSize,
            "--shimmer-duration": shimmerDuration,
            "--border-radius": borderRadius,
            "--background": background,
          } as React.CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white",
          "[background:var(--background)] [border-radius:var(--border-radius)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          className
        )}
        {...props}
      >
        {/* Shimmer effect */}
        {!shouldReduceMotion && (
          <div
            className={cn(
              "absolute inset-0 overflow-hidden [border-radius:var(--border-radius)]",
              "before:absolute before:inset-[-100%] before:animate-shimmer-slide",
              "before:[background:conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--shimmer-color)_10%,transparent_20%)]",
              "before:[aspect-ratio:1] before:[width:auto]"
            )}
            style={
              {
                "--shimmer-slide-duration": shimmerDuration,
              } as React.CSSProperties
            }
          />
        )}

        {/* Spark container */}
        {!shouldReduceMotion && (
          <div
            className={cn(
              "absolute inset-[1px] [border-radius:var(--border-radius)]",
              "[background:var(--background)]"
            )}
          />
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2 text-sm font-medium">
          {children}
        </span>

        {/* Highlight */}
        <div
          className={cn(
            "absolute inset-0 [border-radius:var(--border-radius)]",
            "opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            "[background:radial-gradient(circle_at_50%_50%,var(--shimmer-color)_0%,transparent_50%)]",
            "pointer-events-none blur-xl"
          )}
          style={{ opacity: 0.1 }}
        />
      </button>
    )
  }
)
ShimmerButton.displayName = "ShimmerButton"

export { ShimmerButton }
