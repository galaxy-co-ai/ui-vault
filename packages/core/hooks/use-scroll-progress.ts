"use client"

import { useScroll, useTransform, type MotionValue } from "framer-motion"
import { useRef, type RefObject } from "react"

interface UseScrollProgressOptions {
  /**
   * The offset at which the element starts being tracked.
   * Default: ["start end", "end start"]
   */
  offset?: ["start end" | "start start" | "end end" | "end start", "start end" | "start start" | "end end" | "end start"]
}

interface UseScrollProgressReturn<T extends HTMLElement> {
  ref: RefObject<T | null>
  scrollYProgress: MotionValue<number>
  scrollY: MotionValue<number>
}

/**
 * Hook to track scroll progress of an element within the viewport.
 * Returns values between 0 and 1 based on element's position.
 *
 * @param options Configuration options for scroll tracking
 * @returns Ref to attach to element, scroll progress (0-1), and raw scroll position
 *
 * @example
 * const { ref, scrollYProgress } = useScrollProgress()
 *
 * <motion.div ref={ref} style={{ opacity: scrollYProgress }}>
 *   Fades in as you scroll
 * </motion.div>
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollProgressOptions = {}
): UseScrollProgressReturn<T> {
  const { offset = ["start end", "end start"] } = options
  const ref = useRef<T>(null)

  const { scrollYProgress, scrollY } = useScroll({
    target: ref,
    offset,
  })

  return {
    ref,
    scrollYProgress,
    scrollY,
  }
}

/**
 * Creates a parallax effect based on scroll position.
 *
 * @param scrollProgress The scroll progress motion value (0-1)
 * @param distance The distance to move in pixels (positive = down, negative = up)
 * @returns A motion value for the y transform
 *
 * @example
 * const { ref, scrollYProgress } = useScrollProgress()
 * const y = useParallax(scrollYProgress, -50)
 *
 * <motion.div ref={ref} style={{ y }}>
 *   Moves up as you scroll down
 * </motion.div>
 */
export function useParallax(
  scrollProgress: MotionValue<number>,
  distance: number
): MotionValue<number> {
  return useTransform(scrollProgress, [0, 1], [0, distance])
}
