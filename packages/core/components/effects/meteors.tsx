"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export interface MeteorsProps {
  /**
   * Number of meteors to render
   * @default 20
   */
  number?: number
  /**
   * Additional className for the container
   */
  className?: string
  /**
   * Minimum animation duration in seconds
   * @default 2
   */
  minDuration?: number
  /**
   * Maximum animation duration in seconds
   * @default 10
   */
  maxDuration?: number
  /**
   * Meteor color
   * @default "oklch(0.922 0 0)"
   */
  color?: string
}

/**
 * Animated meteor shower effect for backgrounds.
 * Creates a stunning falling stars/meteors animation.
 *
 * @example
 * <div className="relative h-[400px] w-full bg-black overflow-hidden">
 *   <Meteors number={30} />
 *   <div className="relative z-10">Content here</div>
 * </div>
 *
 * @example
 * // Custom styling
 * <Meteors
 *   number={50}
 *   minDuration={1}
 *   maxDuration={5}
 *   color="oklch(0.7 0.2 250)"
 * />
 */
export function Meteors({
  number = 20,
  className,
  minDuration = 2,
  maxDuration = 10,
  color = "oklch(0.922 0 0)",
}: MeteorsProps) {
  const shouldReduceMotion = useReducedMotion()

  const meteors = React.useMemo(() => {
    return Array.from({ length: number }, (_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * -50 - 10}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${Math.random() * (maxDuration - minDuration) + minDuration}s`,
      size: Math.random() * 2 + 1,
    }))
  }, [number, minDuration, maxDuration])

  // Respect reduced motion preference - show static stars instead
  if (shouldReduceMotion) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        {meteors.slice(0, Math.floor(number / 2)).map((meteor) => (
          <span
            key={meteor.id}
            className="absolute rounded-full"
            style={{
              left: meteor.left,
              top: `${Math.random() * 100}%`,
              width: `${meteor.size}px`,
              height: `${meteor.size}px`,
              backgroundColor: color,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="animate-meteor absolute h-0.5 w-0.5 rotate-[215deg] rounded-[9999px] shadow-[0_0_0_1px_#ffffff10]"
          style={
            {
              left: meteor.left,
              top: meteor.top,
              animationDelay: meteor.animationDelay,
              animationDuration: meteor.animationDuration,
              "--meteor-color": color,
            } as React.CSSProperties
          }
        >
          {/* Meteor trail */}
          <span
            className="absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2"
            style={{
              background: `linear-gradient(to right, ${color}, transparent)`,
            }}
          />
        </span>
      ))}
    </div>
  )
}
