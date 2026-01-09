"use client"

import * as React from "react"
import { motion, useSpring, useTransform, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export interface NumberTickerProps {
  /**
   * The target number to animate to
   */
  value: number
  className?: string
  /**
   * Starting value for the animation
   * @default 0
   */
  from?: number
  /**
   * Duration of the animation in seconds
   * @default 2
   */
  duration?: number
  /**
   * Delay before animation starts in seconds
   * @default 0
   */
  delay?: number
  /**
   * Number of decimal places to display
   * @default 0
   */
  decimalPlaces?: number
  /**
   * Whether to start animation when element enters viewport
   * @default true
   */
  startOnView?: boolean
  /**
   * Whether to only animate once
   * @default true
   */
  once?: boolean
  /**
   * Direction of the count animation
   * @default "up"
   */
  direction?: "up" | "down"
  /**
   * Locale for number formatting
   * @default "en-US"
   */
  locale?: string
}

/**
 * Animated number counter component with spring physics.
 * Smoothly animates from one number to another.
 *
 * @example
 * <NumberTicker value={1000} />
 *
 * @example
 * <NumberTicker value={99.99} decimalPlaces={2} duration={3} />
 *
 * @example
 * <NumberTicker value={0} from={100} direction="down" />
 */
export function NumberTicker({
  value,
  className,
  from = 0,
  duration = 2,
  delay = 0,
  decimalPlaces = 0,
  startOnView = true,
  once = true,
  direction = "up",
  locale = "en-US",
}: NumberTickerProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once })
  const shouldReduceMotion = useReducedMotion()

  const startValue = direction === "up" ? from : value
  const endValue = direction === "up" ? value : from

  const spring = useSpring(startValue, {
    damping: 30,
    stiffness: 100,
    duration: duration * 1000,
  })

  const display = useTransform(spring, (current) =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(current)
  )

  React.useEffect(() => {
    if (shouldReduceMotion) {
      spring.set(endValue)
      return
    }

    if (!startOnView || isInView) {
      const timeoutId = setTimeout(() => {
        spring.set(endValue)
      }, delay * 1000)

      return () => clearTimeout(timeoutId)
    }

    return undefined
  }, [spring, endValue, delay, startOnView, isInView, shouldReduceMotion])

  // If reduced motion, just show the final value
  if (shouldReduceMotion) {
    return (
      <span className={className}>
        {new Intl.NumberFormat(locale, {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(value)}
      </span>
    )
  }

  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  )
}
