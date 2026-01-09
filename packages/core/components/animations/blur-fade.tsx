"use client"

import * as React from "react"
import { motion, useInView, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  /**
   * Animation duration in seconds
   * @default 0.4
   */
  duration?: number
  /**
   * Delay before animation starts in seconds
   * @default 0
   */
  delay?: number
  /**
   * Distance to travel in pixels
   * @default 6
   */
  offset?: number
  /**
   * Direction of the animation
   * @default "down"
   */
  direction?: "up" | "down" | "left" | "right"
  /**
   * Whether to trigger animation when element enters viewport
   * @default true
   */
  inView?: boolean
  /**
   * Margin for viewport intersection (e.g., "-50px" or "-10% 0px")
   * @default "-50px"
   */
  inViewMargin?: `${number}${"px" | "%"}` | `${number}${"px" | "%"} ${number}${"px" | "%"}` | `${number}${"px" | "%"} ${number}${"px" | "%"} ${number}${"px" | "%"}` | `${number}${"px" | "%"} ${number}${"px" | "%"} ${number}${"px" | "%"} ${number}${"px" | "%"}`
  /**
   * Blur amount for the initial state
   * @default "6px"
   */
  blur?: string
  /**
   * Whether to only animate once
   * @default true
   */
  once?: boolean
}

/**
 * A scroll-triggered fade animation with blur effect.
 * Animates children with opacity, blur, and directional movement.
 *
 * @example
 * <BlurFade>
 *   <h1>Hello World</h1>
 * </BlurFade>
 *
 * @example
 * <BlurFade delay={0.2} direction="up" inView>
 *   <Card>Content</Card>
 * </BlurFade>
 */
export function BlurFade({
  children,
  className,
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = "down",
  inView = true,
  inViewMargin = "-50px" as const,
  blur = "6px",
  once = true,
}: BlurFadeProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: inViewMargin })
  const shouldReduceMotion = useReducedMotion()

  // Respect reduced motion preference
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

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
