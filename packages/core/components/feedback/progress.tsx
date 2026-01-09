"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /**
   * The current progress value (0-100)
   */
  value?: number
  /**
   * Whether to show indeterminate loading state
   */
  indeterminate?: boolean
}

/**
 * Progress bar component for showing completion status.
 *
 * @example
 * <Progress value={60} />
 *
 * @example
 * <Progress indeterminate />
 */
const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indeterminate = false, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full bg-primary transition-all duration-300 ease-out",
        indeterminate && "animate-progress-indeterminate w-1/3"
      )}
      style={indeterminate ? undefined : { width: `${value || 0}%` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
