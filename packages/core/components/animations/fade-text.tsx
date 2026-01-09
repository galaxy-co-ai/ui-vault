"use client"

import * as React from "react"
import { motion, useInView, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type FadeDirection = "up" | "down" | "left" | "right" | "none"

export interface FadeTextProps {
  /**
   * The text content to animate
   */
  text: string
  /**
   * Additional className for the container
   */
  className?: string
  /**
   * Direction the text fades from
   * @default "up"
   */
  direction?: FadeDirection
  /**
   * Animation duration in seconds per character/word
   * @default 0.3
   */
  duration?: number
  /**
   * Delay before animation starts in seconds
   * @default 0
   */
  delay?: number
  /**
   * Stagger delay between each segment
   * @default 0.04
   */
  staggerDelay?: number
  /**
   * Whether to split by words or characters
   * @default "word"
   */
  by?: "word" | "character"
  /**
   * Whether to trigger animation when in view
   * @default true
   */
  inView?: boolean
  /**
   * Whether to only animate once
   * @default true
   */
  once?: boolean
  /**
   * The element type to render
   * @default "p"
   */
  as?: keyof JSX.IntrinsicElements
  /**
   * Offset distance for the fade animation
   * @default 20
   */
  offset?: number
}

const getDirectionOffset = (direction: FadeDirection, offset: number) => {
  switch (direction) {
    case "up":
      return { y: offset }
    case "down":
      return { y: -offset }
    case "left":
      return { x: offset }
    case "right":
      return { x: -offset }
    default:
      return {}
  }
}

/**
 * Text component that fades in with staggered animation.
 * Splits text into words or characters and animates each segment.
 *
 * @example
 * <FadeText text="Hello, World!" />
 *
 * @example
 * <FadeText
 *   text="Character by character"
 *   by="character"
 *   direction="left"
 *   staggerDelay={0.02}
 * />
 *
 * @example
 * // As a heading
 * <FadeText
 *   as="h1"
 *   text="Welcome to the Future"
 *   className="text-4xl font-bold"
 *   direction="up"
 * />
 */
export function FadeText({
  text,
  className,
  direction = "up",
  duration = 0.3,
  delay = 0,
  staggerDelay = 0.04,
  by = "word",
  inView = true,
  once = true,
  as: Component = "p",
  offset = 20,
}: FadeTextProps) {
  const ref = React.useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })
  const shouldReduceMotion = useReducedMotion()

  const segments = React.useMemo(() => {
    if (by === "word") {
      return text.split(" ")
    }
    return text.split("")
  }, [text, by])

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      ...getDirectionOffset(direction, offset),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  // Respect reduced motion preference
  if (shouldReduceMotion) {
    const MotionComponent = Component as React.ElementType
    return <MotionComponent className={className}>{text}</MotionComponent>
  }

  const MotionComponent = motion(Component as React.ElementType)

  return (
    <MotionComponent
      ref={ref}
      className={cn("inline-flex flex-wrap", className)}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? (isInView ? "visible" : "hidden") : "visible"}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block"
        >
          {segment}
          {by === "word" && index < segments.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </MotionComponent>
  )
}

export interface FadeTextLineProps {
  /**
   * Lines of text to animate
   */
  lines: string[]
  /**
   * Additional className for the container
   */
  className?: string
  /**
   * Additional className for each line
   */
  lineClassName?: string
  /**
   * Direction the text fades from
   * @default "up"
   */
  direction?: FadeDirection
  /**
   * Animation duration per line
   * @default 0.4
   */
  duration?: number
  /**
   * Stagger delay between lines
   * @default 0.1
   */
  staggerDelay?: number
  /**
   * Whether to trigger animation when in view
   * @default true
   */
  inView?: boolean
  /**
   * Whether to only animate once
   * @default true
   */
  once?: boolean
}

/**
 * Multi-line text fade animation component.
 * Animates each line sequentially with a stagger effect.
 *
 * @example
 * <FadeTextLines
 *   lines={[
 *     "First line appears",
 *     "Then the second",
 *     "Finally the third"
 *   ]}
 * />
 */
export function FadeTextLines({
  lines,
  className,
  lineClassName,
  direction = "up",
  duration = 0.4,
  staggerDelay = 0.1,
  inView = true,
  once = true,
}: FadeTextLineProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })
  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      ...getDirectionOffset(direction, 20),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  // Respect reduced motion preference
  if (shouldReduceMotion) {
    return (
      <div className={className}>
        {lines.map((line, index) => (
          <p key={index} className={lineClassName}>
            {line}
          </p>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? (isInView ? "visible" : "hidden") : "visible"}
    >
      {lines.map((line, index) => (
        <motion.p key={index} variants={itemVariants} className={lineClassName}>
          {line}
        </motion.p>
      ))}
    </motion.div>
  )
}
