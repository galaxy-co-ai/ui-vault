"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const avatarGroupVariants = cva("flex -space-x-2", {
  variants: {
    size: {
      sm: "-space-x-1.5",
      default: "-space-x-2",
      lg: "-space-x-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const avatarItemVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-background bg-muted font-medium text-muted-foreground ring-0 transition-transform hover:z-10 hover:scale-110",
  {
    variants: {
      size: {
        sm: "h-7 w-7 text-xs",
        default: "h-9 w-9 text-sm",
        lg: "h-11 w-11 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface AvatarGroupItem {
  /** Source URL for the avatar image */
  src?: string
  /** Alt text for the avatar image */
  alt?: string
  /** Fallback text (initials) when no image is provided */
  fallback?: string
}

export interface AvatarGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarGroupVariants> {
  /**
   * Array of avatar items to display
   */
  items: AvatarGroupItem[]
  /**
   * Maximum number of avatars to show before truncating
   * @default 5
   */
  max?: number
  /**
   * Custom render function for individual avatars
   */
  renderAvatar?: (item: AvatarGroupItem, index: number) => React.ReactNode
}

/**
 * A group of overlapping avatar images with overflow indicator.
 * Perfect for showing team members, participants, or contributors.
 *
 * @example
 * <AvatarGroup
 *   items={[
 *     { src: "/user1.jpg", alt: "User 1" },
 *     { src: "/user2.jpg", alt: "User 2" },
 *     { fallback: "JD" },
 *   ]}
 * />
 *
 * @example
 * // With max limit
 * <AvatarGroup
 *   items={users}
 *   max={3}
 *   size="lg"
 * />
 */
const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    { className, items, max = 5, size, renderAvatar, ...props },
    ref
  ) => {
    const visibleItems = items.slice(0, max)
    const remainingCount = items.length - max

    return (
      <div
        ref={ref}
        className={cn(avatarGroupVariants({ size }), className)}
        {...props}
      >
        {visibleItems.map((item, index) =>
          renderAvatar ? (
            renderAvatar(item, index)
          ) : (
            <AvatarGroupItem key={index} item={item} size={size} />
          )
        )}
        {remainingCount > 0 && (
          <div
            className={cn(
              avatarItemVariants({ size }),
              "bg-muted text-muted-foreground"
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"

interface AvatarGroupItemProps extends VariantProps<typeof avatarItemVariants> {
  item: AvatarGroupItem
}

/**
 * Individual avatar within the AvatarGroup.
 */
const AvatarGroupItem = React.forwardRef<HTMLDivElement, AvatarGroupItemProps>(
  ({ item, size }, ref) => {
    const [hasError, setHasError] = React.useState(false)

    return (
      <div ref={ref} className={cn(avatarItemVariants({ size }))}>
        {item.src && !hasError ? (
          <img
            src={item.src}
            alt={item.alt || ""}
            className="h-full w-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <span>{item.fallback || item.alt?.charAt(0) || "?"}</span>
        )}
      </div>
    )
  }
)
AvatarGroupItem.displayName = "AvatarGroupItem"

export { AvatarGroup, avatarGroupVariants, avatarItemVariants }
