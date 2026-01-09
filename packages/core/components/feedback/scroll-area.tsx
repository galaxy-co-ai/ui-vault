"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"

/**
 * A custom scrollable area with styled scrollbars.
 * Provides consistent scrollbar appearance across browsers.
 *
 * @example
 * <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
 *   <div className="space-y-4">
 *     {items.map((item) => (
 *       <div key={item.id}>{item.content}</div>
 *     ))}
 *   </div>
 * </ScrollArea>
 *
 * @example
 * // Horizontal scrolling
 * <ScrollArea className="w-96 whitespace-nowrap" orientation="horizontal">
 *   <div className="flex space-x-4">
 *     {items.map((item) => (
 *       <div key={item.id} className="w-40">{item.content}</div>
 *     ))}
 *   </div>
 * </ScrollArea>
 */
const ScrollArea = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    /**
     * The scrollbar orientation
     * @default "vertical"
     */
    orientation?: "vertical" | "horizontal" | "both"
  }
>(({ className, children, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    {(orientation === "vertical" || orientation === "both") && (
      <ScrollBar orientation="vertical" />
    )}
    {(orientation === "horizontal" || orientation === "both") && (
      <ScrollBar orientation="horizontal" />
    )}
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

/**
 * Scrollbar component for the ScrollArea.
 */
const ScrollBar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
