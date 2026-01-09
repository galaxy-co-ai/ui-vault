"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export interface MarqueeProps {
  children: React.ReactNode
  className?: string
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean
  /**
   * Whether to pause on hover
   * @default false
   */
  pauseOnHover?: boolean
  /**
   * Whether to scroll vertically instead of horizontally
   * @default false
   */
  vertical?: boolean
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number
  /**
   * Animation duration in seconds (CSS variable --duration)
   * @default 40
   */
  duration?: number
  /**
   * Gap between repeated items
   * @default "1rem"
   */
  gap?: string
}

/**
 * An infinite scrolling marquee component.
 * Smoothly scrolls content horizontally or vertically in a loop.
 *
 * @example
 * <Marquee>
 *   <img src="/logo1.png" />
 *   <img src="/logo2.png" />
 *   <img src="/logo3.png" />
 * </Marquee>
 *
 * @example
 * <Marquee reverse pauseOnHover duration={20}>
 *   {testimonials.map(t => <TestimonialCard key={t.id} {...t} />)}
 * </Marquee>
 */
export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  duration = 40,
  gap = "1rem",
}: MarqueeProps) {
  const shouldReduceMotion = useReducedMotion()

  // If user prefers reduced motion, show static content
  if (shouldReduceMotion) {
    return (
      <div
        className={cn(
          "flex",
          vertical ? "flex-col" : "flex-row",
          className
        )}
        style={{ gap }}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group flex overflow-hidden",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      style={
        {
          "--duration": `${duration}s`,
          "--gap": gap,
          gap: "var(--gap)",
        } as React.CSSProperties
      }
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0",
            vertical ? "flex-col" : "flex-row",
            vertical
              ? reverse
                ? "animate-marquee-vertical-reverse"
                : "animate-marquee-vertical"
              : reverse
                ? "animate-marquee-reverse"
                : "animate-marquee",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          style={{ gap: "var(--gap)" }}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

/**
 * CSS for the marquee animations.
 * Add this to your globals.css or tailwind.config.js
 *
 * @keyframes marquee {
 *   from { transform: translateX(0); }
 *   to { transform: translateX(calc(-100% - var(--gap))); }
 * }
 *
 * @keyframes marquee-reverse {
 *   from { transform: translateX(calc(-100% - var(--gap))); }
 *   to { transform: translateX(0); }
 * }
 *
 * @keyframes marquee-vertical {
 *   from { transform: translateY(0); }
 *   to { transform: translateY(calc(-100% - var(--gap))); }
 * }
 *
 * @keyframes marquee-vertical-reverse {
 *   from { transform: translateY(calc(-100% - var(--gap))); }
 *   to { transform: translateY(0); }
 * }
 *
 * .animate-marquee {
 *   animation: marquee var(--duration) linear infinite;
 * }
 *
 * .animate-marquee-reverse {
 *   animation: marquee-reverse var(--duration) linear infinite;
 * }
 *
 * .animate-marquee-vertical {
 *   animation: marquee-vertical var(--duration) linear infinite;
 * }
 *
 * .animate-marquee-vertical-reverse {
 *   animation: marquee-vertical-reverse var(--duration) linear infinite;
 * }
 */
