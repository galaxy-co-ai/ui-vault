import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using clsx and tailwind-merge.
 * This utility combines the power of clsx for conditional classes
 * with tailwind-merge for resolving Tailwind CSS class conflicts.
 *
 * @example
 * cn("px-4 py-2", "px-6") // => "px-6 py-2"
 * cn("bg-red-500", condition && "bg-blue-500") // => conditionally applies bg-blue-500
 * cn("text-sm", ["font-bold", "italic"]) // => "text-sm font-bold italic"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
