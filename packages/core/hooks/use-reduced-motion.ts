"use client"

import { useEffect, useState } from "react"

/**
 * Hook to detect if the user prefers reduced motion.
 * Respects the prefers-reduced-motion media query for accessibility.
 *
 * @returns boolean indicating if reduced motion is preferred
 *
 * @example
 * const shouldReduceMotion = useReducedMotion()
 *
 * if (shouldReduceMotion) {
 *   return <div>{children}</div> // No animation
 * }
 *
 * return <motion.div animate={...}>{children}</motion.div>
 */
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    // Set initial value
    setShouldReduceMotion(mediaQuery.matches)

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return shouldReduceMotion
}
