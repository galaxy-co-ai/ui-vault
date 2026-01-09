"use client"

import * as React from "react"
import { AnimatePresence, motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type AnimationType = "fadeUp" | "fadeDown" | "blur" | "flip" | "scale"

export interface WordRotateProps {
  /**
   * Array of words to rotate through
   */
  words: string[]
  /**
   * Additional className for the container
   */
  className?: string
  /**
   * Duration each word is shown in milliseconds
   * @default 3000
   */
  duration?: number
  /**
   * Animation duration in seconds
   * @default 0.5
   */
  animationDuration?: number
  /**
   * Animation type for transitions
   * @default "fadeUp"
   */
  animation?: AnimationType
  /**
   * Whether to loop through words
   * @default true
   */
  loop?: boolean
}

const animationVariants: Record<AnimationType, Variants> = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(10px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(10px)" },
  },
  flip: {
    initial: { opacity: 0, rotateX: 90 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: -90 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.5 },
  },
}

/**
 * A text animation component that rotates through different words.
 * Perfect for hero sections and dynamic headlines.
 *
 * @example
 * <WordRotate words={["websites", "apps", "products"]} />
 *
 * @example
 * <h1>
 *   Build <WordRotate words={["faster", "better", "smarter"]} animation="blur" /> today
 * </h1>
 */
export function WordRotate({
  words,
  className,
  duration = 3000,
  animationDuration = 0.5,
  animation = "fadeUp",
  loop = true,
}: WordRotateProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const shouldReduceMotion = useReducedMotion()

  React.useEffect(() => {
    if (words.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (!loop && prev === words.length - 1) {
          return prev
        }
        return (prev + 1) % words.length
      })
    }, duration)

    return () => clearInterval(interval)
  }, [words.length, duration, loop])

  // Respect reduced motion preference
  if (shouldReduceMotion) {
    return (
      <span className={cn("inline-block", className)}>
        {words[currentIndex]}
      </span>
    )
  }

  const variants = animationVariants[animation]

  return (
    <span
      className={cn("relative inline-flex overflow-hidden", className)}
      style={{ perspective: animation === "flip" ? "500px" : undefined }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{
            duration: animationDuration,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="inline-block"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
