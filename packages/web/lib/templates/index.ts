import type {
  ColorPalette,
  Typography,
  SpacingScale,
  BorderRadius,
  Shadows,
  Animation,
  StyleCollection,
} from "@/lib/schemas/style.schema";
import {
  DEFAULT_TYPOGRAPHY,
  DEFAULT_SPACING,
  DEFAULT_BORDER_RADIUS,
  DEFAULT_SHADOWS,
  DEFAULT_ANIMATION,
} from "@/lib/schemas/defaults";

// ============================================
// Template Interface
// ============================================

export interface StyleTemplate {
  id: string;
  name: string;
  description: string;
  preview: {
    accent: string;
    gray: string;
    background: string;
  };
  colors: {
    light: ColorPalette;
    dark: ColorPalette;
  };
  typography: Typography;
  spacing: SpacingScale;
  borderRadius: BorderRadius;
  shadows: Shadows;
  animation: Animation;
}

// ============================================
// Template: Minimal
// ============================================

const MINIMAL_TEMPLATE: StyleTemplate = {
  id: "minimal",
  name: "Minimal",
  description: "Clean and neutral, perfect for professional apps",
  preview: {
    accent: "#3B82F6",
    gray: "#6B778C",
    background: "#FFFFFF",
  },
  colors: {
    light: {
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
    },
    dark: {
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
    },
  },
  typography: DEFAULT_TYPOGRAPHY,
  spacing: DEFAULT_SPACING,
  borderRadius: DEFAULT_BORDER_RADIUS,
  shadows: DEFAULT_SHADOWS,
  animation: DEFAULT_ANIMATION,
};

// ============================================
// Template: Bold
// ============================================

const BOLD_TEMPLATE: StyleTemplate = {
  id: "bold",
  name: "Bold",
  description: "High contrast with vibrant accent colors",
  preview: {
    accent: "#8B5CF6",
    gray: "#1F2937",
    background: "#FFFFFF",
  },
  colors: {
    light: {
      gray: {
        50: "#F9FAFB",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D1D5DB",
        400: "#9CA3AF",
        500: "#6B7280",
        600: "#4B5563",
        700: "#374151",
        800: "#1F2937",
        900: "#111827",
        950: "#030712",
      },
      accent: {
        subtle: "#F5F3FF",
        muted: "#C4B5FD",
        default: "#8B5CF6",
        emphasis: "#7C3AED",
        text: "#6D28D9",
      },
      semantic: {
        success: "#10B981",
        successMuted: "#D1FAE5",
        warning: "#F59E0B",
        warningMuted: "#FEF3C7",
        error: "#EF4444",
        errorMuted: "#FEE2E2",
        info: "#6366F1",
        infoMuted: "#E0E7FF",
      },
    },
    dark: {
      gray: {
        50: "#F9FAFB",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D1D5DB",
        400: "#9CA3AF",
        500: "#6B7280",
        600: "#4B5563",
        700: "#374151",
        800: "#1F2937",
        900: "#111827",
        950: "#030712",
      },
      accent: {
        subtle: "#2E1065",
        muted: "#7C3AED",
        default: "#8B5CF6",
        emphasis: "#A78BFA",
        text: "#C4B5FD",
      },
      semantic: {
        success: "#10B981",
        successMuted: "#064E3B",
        warning: "#F59E0B",
        warningMuted: "#78350F",
        error: "#EF4444",
        errorMuted: "#7F1D1D",
        info: "#6366F1",
        infoMuted: "#312E81",
      },
    },
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontFamily: {
      sans: "DM Sans, system-ui, -apple-system, sans-serif",
      mono: "Fira Code, Menlo, Monaco, monospace",
    },
  },
  spacing: DEFAULT_SPACING,
  borderRadius: {
    none: "0px",
    sm: "4px",
    DEFAULT: "8px",
    md: "12px",
    lg: "16px",
    full: "9999px",
  },
  shadows: DEFAULT_SHADOWS,
  animation: DEFAULT_ANIMATION,
};

// ============================================
// Template: Soft
// ============================================

const SOFT_TEMPLATE: StyleTemplate = {
  id: "soft",
  name: "Soft",
  description: "Gentle pastels with rounded corners",
  preview: {
    accent: "#F472B6",
    gray: "#9CA3AF",
    background: "#FDF4FF",
  },
  colors: {
    light: {
      gray: {
        50: "#FEFEFE",
        100: "#FAFAFA",
        200: "#F4F4F5",
        300: "#E4E4E7",
        400: "#D4D4D8",
        500: "#A1A1AA",
        600: "#71717A",
        700: "#52525B",
        800: "#3F3F46",
        900: "#27272A",
        950: "#18181B",
      },
      accent: {
        subtle: "#FDF2F8",
        muted: "#FBCFE8",
        default: "#F472B6",
        emphasis: "#EC4899",
        text: "#DB2777",
      },
      semantic: {
        success: "#34D399",
        successMuted: "#D1FAE5",
        warning: "#FBBF24",
        warningMuted: "#FEF3C7",
        error: "#FB7185",
        errorMuted: "#FFE4E6",
        info: "#60A5FA",
        infoMuted: "#DBEAFE",
      },
    },
    dark: {
      gray: {
        50: "#FEFEFE",
        100: "#FAFAFA",
        200: "#F4F4F5",
        300: "#E4E4E7",
        400: "#A1A1AA",
        500: "#71717A",
        600: "#52525B",
        700: "#3F3F46",
        800: "#27272A",
        900: "#18181B",
        950: "#09090B",
      },
      accent: {
        subtle: "#500724",
        muted: "#DB2777",
        default: "#F472B6",
        emphasis: "#F9A8D4",
        text: "#FBCFE8",
      },
      semantic: {
        success: "#34D399",
        successMuted: "#064E3B",
        warning: "#FBBF24",
        warningMuted: "#78350F",
        error: "#FB7185",
        errorMuted: "#881337",
        info: "#60A5FA",
        infoMuted: "#1E3A8A",
      },
    },
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontFamily: {
      sans: "Nunito, system-ui, -apple-system, sans-serif",
      mono: "JetBrains Mono, Menlo, Monaco, monospace",
    },
  },
  spacing: DEFAULT_SPACING,
  borderRadius: {
    none: "0px",
    sm: "6px",
    DEFAULT: "12px",
    md: "16px",
    lg: "24px",
    full: "9999px",
  },
  shadows: {
    none: "none",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.04)",
    DEFAULT: "0 2px 8px 0 rgb(0 0 0 / 0.06)",
    md: "0 4px 12px 0 rgb(0 0 0 / 0.08)",
    lg: "0 8px 24px 0 rgb(0 0 0 / 0.1)",
    ring: "0 0 0 3px rgb(244 114 182 / 0.3)",
  },
  animation: DEFAULT_ANIMATION,
};

// ============================================
// Template: Enterprise
// ============================================

const ENTERPRISE_TEMPLATE: StyleTemplate = {
  id: "enterprise",
  name: "Enterprise",
  description: "Conservative and professional for business apps",
  preview: {
    accent: "#0EA5E9",
    gray: "#475569",
    background: "#F8FAFC",
  },
  colors: {
    light: {
      gray: {
        50: "#F8FAFC",
        100: "#F1F5F9",
        200: "#E2E8F0",
        300: "#CBD5E1",
        400: "#94A3B8",
        500: "#64748B",
        600: "#475569",
        700: "#334155",
        800: "#1E293B",
        900: "#0F172A",
        950: "#020617",
      },
      accent: {
        subtle: "#F0F9FF",
        muted: "#BAE6FD",
        default: "#0EA5E9",
        emphasis: "#0284C7",
        text: "#0369A1",
      },
      semantic: {
        success: "#16A34A",
        successMuted: "#DCFCE7",
        warning: "#CA8A04",
        warningMuted: "#FEF9C3",
        error: "#DC2626",
        errorMuted: "#FEE2E2",
        info: "#0EA5E9",
        infoMuted: "#E0F2FE",
      },
    },
    dark: {
      gray: {
        50: "#F8FAFC",
        100: "#F1F5F9",
        200: "#E2E8F0",
        300: "#CBD5E1",
        400: "#94A3B8",
        500: "#64748B",
        600: "#475569",
        700: "#334155",
        800: "#1E293B",
        900: "#0F172A",
        950: "#020617",
      },
      accent: {
        subtle: "#0C4A6E",
        muted: "#0284C7",
        default: "#0EA5E9",
        emphasis: "#38BDF8",
        text: "#7DD3FC",
      },
      semantic: {
        success: "#16A34A",
        successMuted: "#14532D",
        warning: "#CA8A04",
        warningMuted: "#713F12",
        error: "#DC2626",
        errorMuted: "#7F1D1D",
        info: "#0EA5E9",
        infoMuted: "#075985",
      },
    },
  },
  typography: {
    fontFamily: {
      sans: "IBM Plex Sans, system-ui, -apple-system, sans-serif",
      mono: "IBM Plex Mono, Menlo, Monaco, monospace",
    },
    fontSize: {
      xs: ["12px", { lineHeight: "16px" }],
      sm: ["13px", { lineHeight: "18px" }],
      base: ["14px", { lineHeight: "22px" }],
      md: ["15px", { lineHeight: "24px" }],
      lg: ["17px", { lineHeight: "26px" }],
      xl: ["21px", { lineHeight: "30px" }],
      "2xl": ["26px", { lineHeight: "34px" }],
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
    },
    letterSpacing: {
      tight: "-0.01em",
      normal: "0",
      wide: "0.01em",
    },
  },
  spacing: DEFAULT_SPACING,
  borderRadius: {
    none: "0px",
    sm: "2px",
    DEFAULT: "4px",
    md: "6px",
    lg: "8px",
    full: "9999px",
  },
  shadows: DEFAULT_SHADOWS,
  animation: {
    duration: {
      instant: "50ms",
      fast: "100ms",
      normal: "150ms",
      smooth: "200ms",
      slow: "250ms",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
  },
};

// ============================================
// Template: Dark Mode First
// ============================================

const DARK_FIRST_TEMPLATE: StyleTemplate = {
  id: "dark-first",
  name: "Dark Mode First",
  description: "Optimized for dark mode with vibrant accents",
  preview: {
    accent: "#22D3EE",
    gray: "#A1A1AA",
    background: "#18181B",
  },
  colors: {
    light: {
      gray: {
        50: "#FAFAFA",
        100: "#F4F4F5",
        200: "#E4E4E7",
        300: "#D4D4D8",
        400: "#A1A1AA",
        500: "#71717A",
        600: "#52525B",
        700: "#3F3F46",
        800: "#27272A",
        900: "#18181B",
        950: "#09090B",
      },
      accent: {
        subtle: "#ECFEFF",
        muted: "#A5F3FC",
        default: "#22D3EE",
        emphasis: "#06B6D4",
        text: "#0891B2",
      },
      semantic: {
        success: "#4ADE80",
        successMuted: "#DCFCE7",
        warning: "#FACC15",
        warningMuted: "#FEF9C3",
        error: "#F87171",
        errorMuted: "#FEE2E2",
        info: "#38BDF8",
        infoMuted: "#E0F2FE",
      },
    },
    dark: {
      gray: {
        50: "#FAFAFA",
        100: "#F4F4F5",
        200: "#E4E4E7",
        300: "#D4D4D8",
        400: "#A1A1AA",
        500: "#71717A",
        600: "#52525B",
        700: "#3F3F46",
        800: "#27272A",
        900: "#18181B",
        950: "#09090B",
      },
      accent: {
        subtle: "#164E63",
        muted: "#0891B2",
        default: "#22D3EE",
        emphasis: "#67E8F9",
        text: "#A5F3FC",
      },
      semantic: {
        success: "#4ADE80",
        successMuted: "#166534",
        warning: "#FACC15",
        warningMuted: "#854D0E",
        error: "#F87171",
        errorMuted: "#991B1B",
        info: "#38BDF8",
        infoMuted: "#0C4A6E",
      },
    },
  },
  typography: {
    fontFamily: {
      sans: "Space Grotesk, system-ui, -apple-system, sans-serif",
      mono: "JetBrains Mono, Fira Code, monospace",
    },
    fontSize: DEFAULT_TYPOGRAPHY.fontSize,
    fontWeight: DEFAULT_TYPOGRAPHY.fontWeight,
    letterSpacing: DEFAULT_TYPOGRAPHY.letterSpacing,
  },
  spacing: DEFAULT_SPACING,
  borderRadius: {
    none: "0px",
    sm: "4px",
    DEFAULT: "6px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
    DEFAULT: "0 2px 4px 0 rgb(0 0 0 / 0.4)",
    md: "0 4px 8px 0 rgb(0 0 0 / 0.4)",
    lg: "0 8px 16px 0 rgb(0 0 0 / 0.5)",
    ring: "0 0 0 2px rgb(34 211 238 / 0.5)",
  },
  animation: DEFAULT_ANIMATION,
};

// ============================================
// Template: Blank
// ============================================

const BLANK_TEMPLATE: StyleTemplate = {
  id: "blank",
  name: "Blank Canvas",
  description: "Start from scratch with neutral defaults",
  preview: {
    accent: "#6B7280",
    gray: "#9CA3AF",
    background: "#FFFFFF",
  },
  colors: {
    light: {
      gray: {
        50: "#FAFAFA",
        100: "#F5F5F5",
        200: "#E5E5E5",
        300: "#D4D4D4",
        400: "#A3A3A3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
        950: "#0A0A0A",
      },
      accent: {
        subtle: "#F5F5F5",
        muted: "#A3A3A3",
        default: "#737373",
        emphasis: "#525252",
        text: "#404040",
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
    },
    dark: {
      gray: {
        50: "#FAFAFA",
        100: "#F5F5F5",
        200: "#E5E5E5",
        300: "#D4D4D4",
        400: "#A3A3A3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
        950: "#0A0A0A",
      },
      accent: {
        subtle: "#262626",
        muted: "#525252",
        default: "#737373",
        emphasis: "#A3A3A3",
        text: "#D4D4D4",
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
    },
  },
  typography: DEFAULT_TYPOGRAPHY,
  spacing: DEFAULT_SPACING,
  borderRadius: DEFAULT_BORDER_RADIUS,
  shadows: DEFAULT_SHADOWS,
  animation: DEFAULT_ANIMATION,
};

// ============================================
// Export All Templates
// ============================================

export const TEMPLATES: StyleTemplate[] = [
  MINIMAL_TEMPLATE,
  BOLD_TEMPLATE,
  SOFT_TEMPLATE,
  ENTERPRISE_TEMPLATE,
  DARK_FIRST_TEMPLATE,
  BLANK_TEMPLATE,
];

export function getTemplateById(id: string): StyleTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function createStyleFromTemplate(
  template: StyleTemplate,
  name: string
): Omit<StyleCollection, "id" | "createdAt" | "updatedAt"> {
  return {
    name,
    tags: [],
    colors: template.colors,
    typography: template.typography,
    spacing: template.spacing,
    borderRadius: template.borderRadius,
    shadows: template.shadows,
    animation: template.animation,
    usageCount: 0,
    isFavorite: false,
  };
}
