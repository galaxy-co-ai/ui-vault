"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export interface TypingAnimationProps {
  /**
   * The text to animate with typing effect
   */
  children: string
  className?: string
  /**
   * Duration of the complete typing animation in seconds
   * @default 1
   */
  duration?: number
  /**
   * Delay before animation starts in seconds
   * @default 0
   */
  delay?: number
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
   * Whether to show a blinking cursor
   * @default true
   */
  cursor?: boolean
  /**
   * Custom cursor character
   * @default "|"
   */
  cursorChar?: string
}

/**
 * Typewriter-style text animation component.
 * Reveals text character by character with an optional blinking cursor.
 *
 * @example
 * <TypingAnimation duration={2}>
 *   Hello, World!
 * </TypingAnimation>
 *
 * @example
 * <TypingAnimation cursor={false} delay={0.5}>
 *   No cursor here
 * </TypingAnimation>
 */
export function TypingAnimation({
  children,
  className,
  duration = 1,
  delay = 0,
  startOnView = true,
  once = true,
  cursor = true,
  cursorChar = "|",
}: TypingAnimationProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once })
  const shouldReduceMotion = useReducedMotion()
  const [displayedText, setDisplayedText] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)

  const shouldAnimate = startOnView ? isInView : true

  React.useEffect(() => {
    if (!shouldAnimate || shouldReduceMotion) {
      setDisplayedText(children)
      return
    }

    setIsTyping(true)
    const text = children
    const charDuration = (duration * 1000) / text.length

    let currentIndex = 0
    let timeoutId: ReturnType<typeof setTimeout>

    const startTyping = () => {
      const typeChar = () => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex))
          currentIndex++
          timeoutId = setTimeout(typeChar, charDuration)
        } else {
          setIsTyping(false)
        }
      }
      typeChar()
    }

    const delayTimeoutId = setTimeout(startTyping, delay * 1000)

    return () => {
      clearTimeout(delayTimeoutId)
      clearTimeout(timeoutId)
    }
  }, [children, duration, delay, shouldAnimate, shouldReduceMotion])

  // If reduced motion, just show the text
  if (shouldReduceMotion) {
    return <span className={className}>{children}</span>
  }

  return (
    <span ref={ref} className={cn("inline-flex", className)}>
      <span>{displayedText}</span>
      {cursor && (
        <motion.span
          animate={{ opacity: isTyping ? 1 : [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: isTyping ? 0 : Infinity,
            repeatType: "reverse",
          }}
          className="ml-0.5"
        >
          {cursorChar}
        </motion.span>
      )}
    </span>
  )
}
