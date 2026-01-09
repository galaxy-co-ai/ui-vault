import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"]
type ButtonSize = VariantProps<typeof buttonVariants>["size"]

/**
 * Base button props shared between icon and standard buttons.
 */
interface ButtonBaseProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  /**
   * If true, the button will render as a Slot component,
   * allowing you to pass a custom element (like a Link).
   */
  asChild?: boolean
  /** Visual style variant */
  variant?: ButtonVariant
}

/**
 * Props for icon-only buttons.
 * Requires aria-label for accessibility.
 */
interface IconButtonProps extends ButtonBaseProps {
  /** Icon size - when used, aria-label is required */
  size: "icon"
  /**
   * Required for icon-only buttons to provide accessible name.
   * @example "Close dialog", "Open menu", "Delete item"
   */
  "aria-label": string
}

/**
 * Props for standard buttons with text content.
 * aria-label is optional since text content provides accessibility.
 */
interface StandardButtonProps extends ButtonBaseProps {
  /** Button size variant */
  size?: Exclude<ButtonSize, "icon">
  /** Optional aria-label for additional context */
  "aria-label"?: string
}

/**
 * Button props - enforces aria-label for icon buttons.
 *
 * When `size="icon"`, the `aria-label` prop becomes required.
 * This ensures icon-only buttons are accessible to screen readers.
 */
export type ButtonProps = IconButtonProps | StandardButtonProps

/**
 * A clickable button component with multiple variants and sizes.
 *
 * When using `size="icon"`, you must provide an `aria-label` for accessibility.
 *
 * @example
 * // Standard button
 * <Button variant="default">Click me</Button>
 *
 * @example
 * // Icon button (aria-label required)
 * <Button size="icon" aria-label="Close dialog">
 *   <X className="h-4 w-4" />
 * </Button>
 *
 * @example
 * // As child (for Link components)
 * <Button asChild>
 *   <a href="/login">Login</a>
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
