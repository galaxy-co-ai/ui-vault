"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Animation speed for the rainbow effect
   * @default "3s"
   */
  speed?: string
  /**
   * Border radius of the button
   * @default "0.5rem"
   */
  borderRadius?: string
}

/**
 * A button with an animated rainbow gradient border effect.
 * Perfect for CTAs and primary actions that need visual emphasis.
 *
 * @example
 * <RainbowButton>Get Started</RainbowButton>
 *
 * @example
 * <RainbowButton speed="2s" borderRadius="100px">
 *   Subscribe Now
 * </RainbowButton>
 */
const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  (
    {
      speed = "3s",
      borderRadius = "0.5rem",
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
            "--rainbow-speed": speed,
            "--border-radius": borderRadius,
          } as React.CSSProperties
        }
        className={cn(
          "group relative cursor-pointer overflow-hidden p-[2px] transition-all duration-300",
          "[border-radius:var(--border-radius)]",
          "hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        {...props}
      >
        {/* Rainbow gradient background */}
        <span
          className={cn(
            "absolute inset-0 [border-radius:var(--border-radius)]",
            shouldReduceMotion
              ? "bg-gradient-to-r from-[#ff0080] via-[#7928ca] to-[#ff0080]"
              : "animate-rainbow-border bg-[length:400%_100%] bg-gradient-to-r from-[#ff0080] via-[#7928ca] via-[#0070f3] via-[#38bdf8] via-[#a855f7] to-[#ff0080]"
          )}
        />

        {/* Inner content with background */}
        <span
          className={cn(
            "relative flex items-center justify-center gap-2 px-6 py-3",
            "[border-radius:calc(var(--border-radius)-2px)]",
            "bg-background text-foreground",
            "text-sm font-medium",
            "transition-colors duration-300",
            "group-hover:bg-background/90"
          )}
        >
          {children}
        </span>

        {/* Glow effect on hover */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 [border-radius:var(--border-radius)]",
            "opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30",
            shouldReduceMotion
              ? "bg-gradient-to-r from-[#ff0080] via-[#7928ca] to-[#ff0080]"
              : "animate-rainbow-border bg-[length:400%_100%] bg-gradient-to-r from-[#ff0080] via-[#7928ca] via-[#0070f3] via-[#38bdf8] via-[#a855f7] to-[#ff0080]"
          )}
        />
      </button>
    )
  }
)
RainbowButton.displayName = "RainbowButton"

export { RainbowButton }
