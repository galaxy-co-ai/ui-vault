"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to show the shimmer animation
   * @default true
   */
  animate?: boolean
  /**
   * The shape of the skeleton
   * @default "rectangle"
   */
  variant?: "rectangle" | "circle" | "text"
  /**
   * Width of the skeleton (CSS value)
   */
  width?: string | number
  /**
   * Height of the skeleton (CSS value)
   */
  height?: string | number
}

/**
 * A loading placeholder that mimics the shape of content.
 * Provides a smooth shimmer animation to indicate loading state.
 *
 * @example
 * // Basic skeleton
 * <Skeleton className="h-4 w-[200px]" />
 *
 * @example
 * // Circle avatar skeleton
 * <Skeleton variant="circle" className="h-12 w-12" />
 *
 * @example
 * // Multiple text lines
 * <div className="space-y-2">
 *   <Skeleton className="h-4 w-[250px]" />
 *   <Skeleton className="h-4 w-[200px]" />
 *   <Skeleton className="h-4 w-[150px]" />
 * </div>
 *
 * @example
 * // Card skeleton
 * <div className="flex items-center space-x-4">
 *   <Skeleton variant="circle" className="h-12 w-12" />
 *   <div className="space-y-2">
 *     <Skeleton className="h-4 w-[250px]" />
 *     <Skeleton className="h-4 w-[200px]" />
 *   </div>
 * </div>
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      animate = true,
      variant = "rectangle",
      width,
      height,
      style,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()
    const shouldAnimate = animate && !shouldReduceMotion

    return (
      <div
        ref={ref}
        className={cn(
          "bg-muted",
          variant === "circle" && "rounded-full",
          variant === "rectangle" && "rounded-md",
          variant === "text" && "rounded-sm",
          shouldAnimate && "animate-skeleton-shimmer",
          className
        )}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          ...style,
        }}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

export interface SkeletonTextProps {
  /**
   * Number of lines to render
   * @default 3
   */
  lines?: number
  /**
   * Additional className for the container
   */
  className?: string
  /**
   * Additional className for each line
   */
  lineClassName?: string
  /**
   * Whether to show the shimmer animation
   * @default true
   */
  animate?: boolean
}

/**
 * A skeleton component that renders multiple text lines.
 * Automatically varies line widths for a natural look.
 *
 * @example
 * <SkeletonText lines={4} />
 */
const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, className, lineClassName, animate = true }, ref) => {
    // Generate varying widths for natural text appearance
    const widths = React.useMemo(() => {
      const baseWidths = ["100%", "80%", "90%", "70%", "85%", "75%", "95%"]
      return Array.from({ length: lines }, (_, i) => baseWidths[i % baseWidths.length])
    }, [lines])

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {widths.map((width, index) => (
          <Skeleton
            key={index}
            variant="text"
            animate={animate}
            className={cn("h-4", lineClassName)}
            style={{ width }}
          />
        ))}
      </div>
    )
  }
)
SkeletonText.displayName = "SkeletonText"

export interface SkeletonCardProps {
  /**
   * Whether to show avatar
   * @default true
   */
  showAvatar?: boolean
  /**
   * Number of text lines
   * @default 2
   */
  lines?: number
  /**
   * Additional className
   */
  className?: string
  /**
   * Whether to show the shimmer animation
   * @default true
   */
  animate?: boolean
}

/**
 * A pre-composed skeleton for card layouts with avatar and text.
 *
 * @example
 * <SkeletonCard />
 *
 * @example
 * <SkeletonCard showAvatar={false} lines={3} />
 */
const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ showAvatar = true, lines = 2, className, animate = true }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center space-x-4", className)}>
        {showAvatar && (
          <Skeleton variant="circle" animate={animate} className="h-12 w-12" />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton animate={animate} className="h-4 w-3/4" />
          {Array.from({ length: lines - 1 }).map((_, i) => (
            <Skeleton
              key={i}
              animate={animate}
              className="h-4"
              style={{ width: `${60 - i * 10}%` }}
            />
          ))}
        </div>
      </div>
    )
  }
)
SkeletonCard.displayName = "SkeletonCard"

export { Skeleton, SkeletonText, SkeletonCard }
