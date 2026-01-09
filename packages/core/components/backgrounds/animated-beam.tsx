"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export interface AnimatedBeamProps {
  /**
   * Additional className for the SVG container
   */
  className?: string
  /**
   * Ref to the container element
   */
  containerRef: React.RefObject<HTMLElement | null>
  /**
   * Ref to the starting element
   */
  fromRef: React.RefObject<HTMLElement | null>
  /**
   * Ref to the ending element
   */
  toRef: React.RefObject<HTMLElement | null>
  /**
   * Curvature of the beam (0 = straight line)
   * @default 0
   */
  curvature?: number
  /**
   * Reverse the animation direction
   * @default false
   */
  reverse?: boolean
  /**
   * Animation duration in seconds
   * @default 3
   */
  duration?: number
  /**
   * Delay before animation starts
   * @default 0
   */
  delay?: number
  /**
   * Path color
   * @default "gray"
   */
  pathColor?: string
  /**
   * Width of the path stroke
   * @default 2
   */
  pathWidth?: number
  /**
   * Opacity of the path
   * @default 0.2
   */
  pathOpacity?: number
  /**
   * Gradient start color
   * @default "#ff0080"
   */
  gradientStartColor?: string
  /**
   * Gradient end color
   * @default "#7928ca"
   */
  gradientStopColor?: string
  /**
   * Start position offset from center (0-1)
   * @default 0.5
   */
  startXOffset?: number
  /**
   * Start position offset from center (0-1)
   * @default 0.5
   */
  startYOffset?: number
  /**
   * End position offset from center (0-1)
   * @default 0.5
   */
  endXOffset?: number
  /**
   * End position offset from center (0-1)
   * @default 0.5
   */
  endYOffset?: number
}

/**
 * An animated beam that connects two elements with a flowing gradient effect.
 * Perfect for showing data flow, connections between components, or visual hierarchy.
 *
 * @example
 * const containerRef = useRef(null)
 * const fromRef = useRef(null)
 * const toRef = useRef(null)
 *
 * <div ref={containerRef} className="relative">
 *   <div ref={fromRef}>Start</div>
 *   <div ref={toRef}>End</div>
 *   <AnimatedBeam
 *     containerRef={containerRef}
 *     fromRef={fromRef}
 *     toRef={toRef}
 *   />
 * </div>
 */
export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 3,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ff0080",
  gradientStopColor = "#7928ca",
  startXOffset = 0.5,
  startYOffset = 0.5,
  endXOffset = 0.5,
  endYOffset = 0.5,
}: AnimatedBeamProps) {
  const id = React.useId()
  const [pathD, setPathD] = React.useState("")
  const [svgDimensions, setSvgDimensions] = React.useState({ width: 0, height: 0 })
  const shouldReduceMotion = useReducedMotion()

  const updatePath = React.useCallback(() => {
    if (!containerRef.current || !fromRef.current || !toRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const fromRect = fromRef.current.getBoundingClientRect()
    const toRect = toRef.current.getBoundingClientRect()

    const startX = fromRect.left - containerRect.left + fromRect.width * startXOffset
    const startY = fromRect.top - containerRect.top + fromRect.height * startYOffset
    const endX = toRect.left - containerRect.left + toRect.width * endXOffset
    const endY = toRect.top - containerRect.top + toRect.height * endYOffset

    const controlX = (startX + endX) / 2 + curvature
    const controlY = (startY + endY) / 2 - curvature

    const d = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`
    setPathD(d)
    setSvgDimensions({
      width: containerRect.width,
      height: containerRect.height,
    })
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset])

  React.useEffect(() => {
    updatePath()

    const resizeObserver = new ResizeObserver(updatePath)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener("resize", updatePath)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updatePath)
    }
  }, [updatePath, containerRef])

  if (!pathD) return null

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none absolute left-0 top-0", className)}
    >
      <defs>
        <linearGradient
          id={`gradient-${id}`}
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="50%" stopColor={gradientStartColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background path */}
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />

      {/* Animated gradient path */}
      {!shouldReduceMotion && (
        <motion.path
          d={pathD}
          stroke={`url(#gradient-${id})`}
          strokeWidth={pathWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0, pathOffset: reverse ? -1 : 1 }}
          animate={{ pathLength: 1, pathOffset: 0 }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        />
      )}
    </svg>
  )
}
