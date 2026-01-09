"use client"

import { motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type AnimationType =
  | "fadeIn"
  | "blurIn"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "blurInUp"
  | "blurInDown"

type SegmentType = "word" | "character" | "line"

export interface TextAnimateProps {
  /**
   * The text to animate
   */
  children: string
  className?: string
  /**
   * Delay before animation starts in seconds
   * @default 0
   */
  delay?: number
  /**
   * Duration of each segment animation in seconds
   * @default 0.3
   */
  duration?: number
  /**
   * How to split the text for animation
   * @default "word"
   */
  by?: SegmentType
  /**
   * The animation type to apply
   * @default "fadeIn"
   */
  animation?: AnimationType
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
   * Custom stagger delay between segments in seconds
   * @default 0.05
   */
  staggerDelay?: number
}

const animationVariants: Record<AnimationType, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  blurIn: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  blurInUp: {
    hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
  blurInDown: {
    hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
}

function splitText(text: string, by: SegmentType): string[] {
  switch (by) {
    case "word":
      return text.split(/(\s+)/)
    case "character":
      return text.split("")
    case "line":
      return text.split("\n")
  }
}

/**
 * Animated text component with staggered reveal effects.
 * Splits text by word, character, or line and animates each segment.
 *
 * @example
 * <TextAnimate animation="blurInUp">
 *   Hello World
 * </TextAnimate>
 *
 * @example
 * <TextAnimate by="character" animation="fadeIn" staggerDelay={0.02}>
 *   Type this out
 * </TextAnimate>
 */
export function TextAnimate({
  children,
  className,
  delay = 0,
  duration = 0.3,
  by = "word",
  animation = "fadeIn",
  startOnView = true,
  once = true,
  staggerDelay = 0.05,
}: TextAnimateProps) {
  const shouldReduceMotion = useReducedMotion()

  // Respect reduced motion preference
  if (shouldReduceMotion) {
    return <span className={className}>{children}</span>
  }

  const segments = splitText(children, by)

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  const itemVariants = animationVariants[animation]

  return (
    <motion.span
      className={cn("inline-flex flex-wrap", className)}
      variants={containerVariants}
      initial="hidden"
      whileInView={startOnView ? "visible" : undefined}
      animate={!startOnView ? "visible" : undefined}
      viewport={{ once }}
    >
      {segments.map((segment, i) => {
        // Preserve whitespace
        if (/^\s+$/.test(segment)) {
          return (
            <span key={i} className="whitespace-pre">
              {segment}
            </span>
          )
        }

        return (
          <motion.span
            key={i}
            variants={itemVariants}
            transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
            className="inline-block"
          >
            {segment}
          </motion.span>
        )
      })}
    </motion.span>
  )
}
