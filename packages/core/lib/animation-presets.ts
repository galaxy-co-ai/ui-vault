import type { Transition, Variants } from "framer-motion"

/**
 * Animation duration tokens (in seconds)
 * Used for consistent timing across all animations
 */
export const durations = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const

export type Duration = keyof typeof durations

/**
 * Easing functions for animations
 * Array format: [x1, y1, x2, y2] for cubic-bezier
 */
export const easings = {
  // Standard easings
  easeOut: [0, 0, 0.2, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,

  // Spring configurations for Framer Motion
  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
  },
  springBouncy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 10,
  },
  springSmooth: {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
  },
  springGentle: {
    type: "spring" as const,
    stiffness: 150,
    damping: 15,
  },
} as const

/**
 * Pre-defined animation variants for common patterns
 * Use with Framer Motion's variants prop
 */
export const variants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeOut: {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  scaleOut: {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.95 },
  },
  blurIn: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  blurInUp: {
    hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
} as const satisfies Record<string, Variants>

/**
 * Container variants for staggered children animations
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const satisfies Variants

/**
 * Pre-configured transitions for common UI patterns
 */
export const transitions = {
  // Micro-interactions (buttons, toggles)
  buttonPress: {
    type: "spring",
    stiffness: 400,
    damping: 17,
  } as const satisfies Transition,

  // Card hover effects
  cardHover: {
    type: "spring",
    stiffness: 300,
    damping: 20,
  } as const satisfies Transition,

  // Modal/dialog enter
  modalEnter: {
    type: "spring",
    stiffness: 300,
    damping: 25,
  } as const satisfies Transition,

  // Modal/dialog exit
  modalExit: {
    duration: 0.15,
    ease: [0, 0, 0.2, 1],
  } as const satisfies Transition,

  // Tab switch indicator
  tabSwitch: {
    type: "spring",
    stiffness: 400,
    damping: 30,
  } as const satisfies Transition,

  // Dropdown animations
  dropdown: {
    duration: 0.2,
    ease: [0, 0, 0.2, 1],
  } as const satisfies Transition,

  // Toast notifications
  toast: {
    type: "spring",
    stiffness: 300,
    damping: 20,
  } as const satisfies Transition,

  // Default smooth transition
  smooth: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  } as const satisfies Transition,
} as const

/**
 * Animation recipes for common patterns
 * Copy-paste ready configurations
 */
export const recipes = {
  // Button press effect
  buttonTap: {
    whileTap: { scale: 0.98 },
    transition: transitions.buttonPress,
  },

  // Card lift on hover
  cardLift: {
    whileHover: { y: -8 },
    transition: transitions.cardHover,
  },

  // Scale up on hover (icons, avatars)
  scaleHover: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  },

  // Fade in on mount
  fadeOnMount: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transitions.smooth,
  },

  // Slide up on mount
  slideUpOnMount: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: transitions.smooth,
  },
} as const
