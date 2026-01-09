import * as React from "react"
import { cn } from "@/lib/utils"

export interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Width of each grid cell
   * @default 40
   */
  width?: number
  /**
   * Height of each grid cell
   * @default 40
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
   * Stroke dash array for dashed lines
   */
  strokeDasharray?: string
  /**
   * Squares to highlight (array of [x, y] coordinates)
   */
  squares?: Array<[number, number]>
}

/**
 * SVG grid pattern background component.
 *
 * @example
 * <div className="relative h-96 w-full overflow-hidden">
 *   <GridPattern className="absolute inset-0 text-muted-foreground/20" />
 * </div>
 *
 * @example
 * <GridPattern
 *   width={30}
 *   height={30}
 *   squares={[[1, 1], [3, 2], [5, 4]]}
 *   className="text-primary/10"
 * />
 */
const GridPattern = React.forwardRef<SVGSVGElement, GridPatternProps>(
  (
    {
      width = 40,
      height = 40,
      x = 0,
      y = 0,
      strokeDasharray,
      squares,
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
          "pointer-events-none absolute inset-0 h-full w-full fill-current stroke-current",
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
            x={x}
            y={y}
          >
            <path
              d={`M.5 ${height}V.5H${width}`}
              fill="none"
              strokeWidth="1"
              strokeDasharray={strokeDasharray}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
        {squares && (
          <svg x={x} y={y} className="overflow-visible">
            {squares.map(([squareX, squareY], index) => (
              <rect
                key={`${squareX}-${squareY}-${index}`}
                width={width - 1}
                height={height - 1}
                x={squareX * width + 1}
                y={squareY * height + 1}
                strokeWidth="0"
              />
            ))}
          </svg>
        )}
      </svg>
    )
  }
)
GridPattern.displayName = "GridPattern"

export { GridPattern }
