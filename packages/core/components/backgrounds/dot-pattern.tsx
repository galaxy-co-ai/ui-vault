import * as React from "react"
import { cn } from "@/lib/utils"

export interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Horizontal spacing between dots
   * @default 16
   */
  width?: number
  /**
   * Vertical spacing between dots
   * @default 16
   */
  height?: number
  /**
   * X offset for the pattern
   * @default 0
   */
  x?: number
  /**
   * Y offset for the pattern
   * @default 0
   */
  y?: number
  /**
   * Dot radius
   * @default 1
   */
  cr?: number
  /**
   * Center x position of dots within pattern
   * @default 1
   */
  cx?: number
  /**
   * Center y position of dots within pattern
   * @default 1
   */
  cy?: number
}

/**
 * SVG dot pattern background component.
 *
 * @example
 * <div className="relative h-96 w-full overflow-hidden">
 *   <DotPattern className="absolute inset-0 text-muted-foreground/30" />
 * </div>
 *
 * @example
 * <DotPattern
 *   width={24}
 *   height={24}
 *   cr={1.5}
 *   className="text-primary/20"
 * />
 */
const DotPattern = React.forwardRef<SVGSVGElement, DotPatternProps>(
  (
    {
      width = 16,
      height = 16,
      x = 0,
      y = 0,
      cx = 1,
      cy = 1,
      cr = 1,
      className,
      ...props
    },
    ref
  ) => {
    const id = React.useId()

    return (
      <svg
        ref={ref}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full fill-current",
          className
        )}
        {...props}
      >
        <defs>
          <pattern
            id={id}
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
            patternContentUnits="userSpaceOnUse"
            x={x}
            y={y}
          >
            <circle cx={cx} cy={cy} r={cr} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    )
  }
)
DotPattern.displayName = "DotPattern"

export { DotPattern }
