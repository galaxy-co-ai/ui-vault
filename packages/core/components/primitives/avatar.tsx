"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {}

/**
 * Avatar container component.
 * Use with AvatarImage and AvatarFallback.
 *
 * @example
 * <Avatar>
 *   <AvatarImage src="/avatar.png" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 */
const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(avatarVariants({ size, className }))}
      {...props}
    />
  )
)
Avatar.displayName = "Avatar"

export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void
}

/**
 * Avatar image component with automatic error handling.
 */
const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, onLoadingStatusChange, ...props }, ref) => {
    const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
      "loading"
    )

    React.useEffect(() => {
      if (!src) {
        setStatus("error")
        return
      }
      setStatus("loading")
    }, [src])

    React.useEffect(() => {
      onLoadingStatusChange?.(status)
    }, [status, onLoadingStatusChange])

    if (status === "error") {
      return null
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn("aspect-square h-full w-full object-cover", className)}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        {...props}
      />
    )
  }
)
AvatarImage.displayName = "AvatarImage"

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  delayMs?: number
}

/**
 * Fallback content shown when the image fails to load or is loading.
 * Typically shows initials or an icon.
 *
 * @example
 * <AvatarFallback>JD</AvatarFallback>
 * <AvatarFallback delayMs={600}>JD</AvatarFallback>
 */
const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, delayMs, children, ...props }, ref) => {
    const [canRender, setCanRender] = React.useState(!delayMs)

    React.useEffect(() => {
      if (!delayMs) {
        return
      }
      const timer = setTimeout(() => setCanRender(true), delayMs)
      return () => clearTimeout(timer)
    }, [delayMs])

    if (!canRender) {
      return null
    }

    return (
      <span
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium",
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
AvatarFallback.displayName = "AvatarFallback"

/**
 * Utility function to generate initials from a name.
 *
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("Alice") // "A"
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) {
    return ""
  }
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  const first = parts[0]?.charAt(0) ?? ""
  const last = parts[parts.length - 1]?.charAt(0) ?? ""
  return (first + last).toUpperCase()
}

export { Avatar, AvatarImage, AvatarFallback, avatarVariants }
