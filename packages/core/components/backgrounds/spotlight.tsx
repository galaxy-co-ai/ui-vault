"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Spotlight color
   * @default "rgba(255, 255, 255, 0.15)"
   */
  color?: string
  /**
   * Spotlight size in pixels
   * @default 400
   */
  size?: number
  /**
   * Whether spotlight follows mouse movement
   * @default true
   */
  followMouse?: boolean
  /**
   * Initial X position (percentage from left)
   * @default 50
   */
  initialX?: number
  /**
   * Initial Y position (percentage from top)
   * @default 50
   */
  initialY?: number
  /**
   * Blur amount for the spotlight
   * @default 80
   */
  blur?: number
}

/**
 * A spotlight background effect that can follow mouse movement.
 * Creates a radial gradient glow that adds depth and visual interest.
 *
 * @example
 * <div className="relative h-96 overflow-hidden bg-black">
 *   <Spotlight />
 *   <div className="relative z-10">Content here</div>
 * </div>
 *
 * @example
 * <Spotlight
 *   color="rgba(120, 40, 202, 0.2)"
 *   size={600}
 *   followMouse={false}
 *   initialX={30}
 *   initialY={20}
 * />
 */
export function Spotlight({
  color = "rgba(255, 255, 255, 0.15)",
  size = 400,
  followMouse = true,
  initialX = 50,
  initialY = 50,
  blur = 80,
  className,
  ...props
}: SpotlightProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ x: initialX, y: initialY })
  const shouldReduceMotion = useReducedMotion()

  React.useEffect(() => {
    if (!followMouse || shouldReduceMotion) return

    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setPosition({ x, y })
    }

    container.addEventListener("mousemove", handleMouseMove)
    return () => container.removeEventListener("mousemove", handleMouseMove)
  }, [followMouse, shouldReduceMotion])

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      <div
        className={cn(
          "absolute rounded-full",
          !shouldReduceMotion && followMouse && "transition-all duration-200 ease-out"
        )}
        style={{
          width: size,
          height: size,
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: `blur(${blur}px)`,
        }}
      />
    </div>
  )
}

export interface MultiSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of spotlight configurations
   */
  spotlights?: Array<{
    color?: string
    size?: number
    x: number
    y: number
    blur?: number
  }>
}

/**
 * Multiple static spotlights for creating ambient lighting effects.
 *
 * @example
 * <MultiSpotlight
 *   spotlights={[
 *     { x: 20, y: 30, color: "rgba(255, 0, 128, 0.2)" },
 *     { x: 80, y: 70, color: "rgba(0, 112, 243, 0.2)" },
 *   ]}
 * />
 */
export function MultiSpotlight({
  spotlights = [
    { x: 25, y: 25, color: "rgba(255, 0, 128, 0.15)" },
    { x: 75, y: 75, color: "rgba(121, 40, 202, 0.15)" },
  ],
  className,
  ...props
}: MultiSpotlightProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      {spotlights.map((spot, index) => (
        <div
          key={index}
          className="absolute rounded-full"
          style={{
            width: spot.size ?? 400,
            height: spot.size ?? 400,
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${spot.color ?? "rgba(255, 255, 255, 0.15)"} 0%, transparent 70%)`,
            filter: `blur(${spot.blur ?? 80}px)`,
          }}
        />
      ))}
    </div>
  )
}
