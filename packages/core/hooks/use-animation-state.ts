"use client"

import { useState, useCallback } from "react"

type AnimationState = "idle" | "animating" | "complete"

interface UseAnimationStateReturn {
  state: AnimationState
  isIdle: boolean
  isAnimating: boolean
  isComplete: boolean
  start: () => void
  complete: () => void
  reset: () => void
}

/**
 * Hook to manage animation lifecycle state.
 * Useful for coordinating complex multi-step animations.
 *
 * @returns Animation state object with state values and controls
 *
 * @example
 * const { state, isAnimating, start, complete } = useAnimationState()
 *
 * <motion.div
 *   onAnimationStart={start}
 *   onAnimationComplete={complete}
 * >
 *   {children}
 * </motion.div>
 */
export function useAnimationState(): UseAnimationStateReturn {
  const [state, setState] = useState<AnimationState>("idle")

  const start = useCallback(() => {
    setState("animating")
  }, [])

  const complete = useCallback(() => {
    setState("complete")
  }, [])

  const reset = useCallback(() => {
    setState("idle")
  }, [])

  return {
    state,
    isIdle: state === "idle",
    isAnimating: state === "animating",
    isComplete: state === "complete",
    start,
    complete,
    reset,
  }
}
