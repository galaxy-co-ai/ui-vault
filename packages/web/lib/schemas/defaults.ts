import type {
  ColorPalette,
  Typography,
  SpacingScale,
  BorderRadius,
  Shadows,
  Animation,
  StyleCollection,
} from "./style.schema";

// ============================================
// Default Color Palettes
// ============================================

export const DEFAULT_COLORS_LIGHT: ColorPalette = {
  gray: {
    50: "#FAFBFC",
    100: "#F4F5F7",
    200: "#EBECF0",
    300: "#DFE1E6",
    400: "#C1C7D0",
    500: "#A5ADBA",
    600: "#8993A4",
    700: "#6B778C",
    800: "#505F79",
    900: "#344563",
    950: "#172B4D",
  },
  accent: {
    subtle: "#EFF6FF",
    muted: "#BFDBFE",
    default: "#3B82F6",
    emphasis: "#1D4ED8",
    text: "#1E40AF",
  },
  semantic: {
    success: "#22C55E",
    successMuted: "#DCFCE7",
    warning: "#EAB308",
    warningMuted: "#FEF9C3",
    error: "#EF4444",
    errorMuted: "#FEE2E2",
    info: "#3B82F6",
    infoMuted: "#DBEAFE",
  },
};

export const DEFAULT_COLORS_DARK: ColorPalette = {
  gray: {
    50: "#FAFBFC",
    100: "#F4F5F7",
    200: "#DFE1E6",
    300: "#C1C7D0",
    400: "#A5ADBA",
    500: "#8993A4",
    600: "#6B778C",
    700: "#505F79",
    800: "#344563",
    900: "#172B4D",
    950: "#0D1117",
  },
  accent: {
    subtle: "#1E3A5F",
    muted: "#2563EB",
    default: "#3B82F6",
    emphasis: "#60A5FA",
    text: "#93C5FD",
  },
  semantic: {
    success: "#22C55E",
    successMuted: "#166534",
    warning: "#EAB308",
    warningMuted: "#854D0E",
    error: "#EF4444",
    errorMuted: "#991B1B",
    info: "#3B82F6",
    infoMuted: "#1E40AF",
  },
};

// ============================================
// Default Typography
// ============================================

export const DEFAULT_TYPOGRAPHY: Typography = {
  fontFamily: {
    sans: "Inter, system-ui, -apple-system, sans-serif",
    mono: "JetBrains Mono, Menlo, Monaco, monospace",
  },
  fontSize: {
    xs: ["11px", { lineHeight: "16px" }],
    sm: ["12px", { lineHeight: "18px" }],
    base: ["13px", { lineHeight: "20px" }],
    md: ["14px", { lineHeight: "22px" }],
    lg: ["16px", { lineHeight: "24px" }],
    xl: ["20px", { lineHeight: "28px" }],
    "2xl": ["24px", { lineHeight: "32px" }],
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.02em",
  },
};

// ============================================
// Default Spacing
// ============================================

export const DEFAULT_SPACING: SpacingScale = {
  0: "0px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
};

// ============================================
// Default Border Radius
// ============================================

export const DEFAULT_BORDER_RADIUS: BorderRadius = {
  none: "0px",
  sm: "2px",
  DEFAULT: "4px",
  md: "6px",
  lg: "8px",
  full: "9999px",
};

// ============================================
// Default Shadows
// ============================================

export const DEFAULT_SHADOWS: Shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  ring: "0 0 0 2px rgb(59 130 246 / 0.5)",
};

// ============================================
// Default Animation
// ============================================

export const DEFAULT_ANIMATION: Animation = {
  duration: {
    instant: "50ms",
    fast: "100ms",
    normal: "150ms",
    smooth: "200ms",
    slow: "300ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
};

// ============================================
// Create Default Style
// ============================================

export function createDefaultStyle(name: string): Omit<StyleCollection, "id" | "createdAt" | "updatedAt"> {
  return {
    name,
    tags: [],
    colors: {
      light: DEFAULT_COLORS_LIGHT,
      dark: DEFAULT_COLORS_DARK,
    },
    typography: DEFAULT_TYPOGRAPHY,
    spacing: DEFAULT_SPACING,
    borderRadius: DEFAULT_BORDER_RADIUS,
    shadows: DEFAULT_SHADOWS,
    animation: DEFAULT_ANIMATION,
    usageCount: 0,
    isFavorite: false,
  };
}
