"use client"

import * as React from "react"
import { motion, useInView, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export interface GradualSpacingProps {
  /**
   * The text content to animate
   */
  text: string
  /**
   * Additional className for the container
   */
  className?: string
  /**
   * Initial letter spacing (can be negative for compressed start)
   * @default "-0.5em"
   */
  initialSpacing?: string
  /**
   * Final letter spacing
   * @default "normal"
   */
  finalSpacing?: string
  /**
   * Animation duration in seconds
   * @default 0.5
   */
  duration?: number
  /**
   * Delay before animation starts in seconds
   * @default 0
   */
  delay?: number
  /**
   * Stagger delay between each character
   * @default 0.04
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
  /**
   * Whether to also fade in opacity
   * @default true
   */
  fadeIn?: boolean
  /**
   * Whether to animate from blur
   * @default false
   */
  blur?: boolean
}

/**
 * Text animation that gradually expands letter spacing.
 * Creates an elegant reveal effect as characters spread out.
 *
 * @example
 * <GradualSpacing text="Welcome" />
 *
 * @example
 * <GradualSpacing
 *   text="EXPAND"
 *   initialSpacing="-1em"
 *   finalSpacing="0.5em"
 *   className="text-4xl font-bold tracking-tight"
 * />
 *
 * @example
 * // With blur effect
 * <GradualSpacing
 *   text="Elegant Typography"
 *   blur
 *   fadeIn
 *   duration={0.8}
 * />
 */
export function GradualSpacing({
  text,
  className,
  initialSpacing = "-0.5em",
  finalSpacing = "normal",
  duration = 0.5,
  delay = 0,
  staggerDelay = 0.04,
  inView = true,
  once = true,
  fadeIn = true,
  blur = false,
}: GradualSpacingProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })
  const shouldReduceMotion = useReducedMotion()

  const characters = React.useMemo(() => text.split(""), [text])

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  const characterVariants: Variants = {
    hidden: {
      opacity: fadeIn ? 0 : 1,
      letterSpacing: initialSpacing,
      ...(blur && { filter: "blur(10px)" }),
    },
    visible: {
      opacity: 1,
      letterSpacing: finalSpacing,
      ...(blur && { filter: "blur(0px)" }),
      transition: {
        duration,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  // Respect reduced motion preference
  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>
  }

  const shouldAnimate = inView ? isInView : true

  return (
    <motion.span
      ref={ref}
      className={cn("inline-flex", className)}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={characterVariants}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export interface GradualSpacingWordsProps {
  /**
   * The text content to animate
   */
  text: string
  /**
   * Additional className for the container
   */
  className?: string
  /**
   * Additional className for each word
   */
  wordClassName?: string
  /**
   * Initial letter spacing for each word
   * @default "-0.3em"
   */
  initialSpacing?: string
  /**
   * Final letter spacing
   * @default "normal"
   */
  finalSpacing?: string
  /**
   * Animation duration in seconds
   * @default 0.6
   */
  duration?: number
  /**
   * Delay before animation starts in seconds
   * @default 0
   */
  delay?: number
  /**
   * Stagger delay between each word
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
 * Word-by-word gradual spacing animation.
 * Each word expands its letter spacing sequentially.
 *
 * @example
 * <GradualSpacingWords text="Design with intention" />
 *
 * @example
 * <GradualSpacingWords
 *   text="Every word expands"
 *   initialSpacing="-0.5em"
 *   staggerDelay={0.15}
 *   className="text-2xl font-semibold"
 * />
 */
export function GradualSpacingWords({
  text,
  className,
  wordClassName,
  initialSpacing = "-0.3em",
  finalSpacing = "normal",
  duration = 0.6,
  delay = 0,
  staggerDelay = 0.1,
  inView = true,
  once = true,
}: GradualSpacingWordsProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })
  const shouldReduceMotion = useReducedMotion()

  const words = React.useMemo(() => text.split(" "), [text])

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      letterSpacing: initialSpacing,
    },
    visible: {
      opacity: 1,
      letterSpacing: finalSpacing,
      transition: {
        duration,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  // Respect reduced motion preference
  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>
  }

  const shouldAnimate = inView ? isInView : true

  return (
    <motion.span
      ref={ref}
      className={cn("inline-flex flex-wrap gap-x-2", className)}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className={cn("inline-block", wordClassName)}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
