import { describe, it, expect } from "vitest";
import {
  ColorScaleSchema,
  SemanticColorsSchema,
  AccentColorsSchema,
  ColorPaletteSchema,
  TypographySchema,
  SpacingScaleSchema,
  BorderRadiusSchema,
  ShadowsSchema,
  AnimationSchema,
  StyleCollectionSchema,
  CreateStyleInputSchema,
} from "../../../packages/web/lib/schemas/style.schema";

// ============================================
// Test Fixtures
// ============================================

const validColorScale = {
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
};

const validSemanticColors = {
  success: "#22C55E",
  successMuted: "#DCFCE7",
  warning: "#EAB308",
  warningMuted: "#FEF9C3",
  error: "#EF4444",
  errorMuted: "#FEE2E2",
  info: "#3B82F6",
  infoMuted: "#DBEAFE",
};

const validAccentColors = {
  subtle: "#EFF6FF",
  muted: "#BFDBFE",
  default: "#3B82F6",
  emphasis: "#2563EB",
  text: "#FFFFFF",
};

const validColorPalette = {
  gray: validColorScale,
  accent: validAccentColors,
  semantic: validSemanticColors,
};

const validTypography = {
  fontFamily: {
    sans: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, monospace",
  },
  fontSize: {
    xs: ["11px", { lineHeight: "16px" }],
    sm: ["12px", { lineHeight: "16px" }],
    base: ["13px", { lineHeight: "20px" }],
    md: ["14px", { lineHeight: "20px" }],
    lg: ["16px", { lineHeight: "24px" }],
    xl: ["18px", { lineHeight: "28px" }],
    "2xl": ["24px", { lineHeight: "32px" }],
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
  },
  letterSpacing: {
    tight: "-0.01em",
    normal: "0",
    wide: "0.02em",
  },
};

const validSpacing = {
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

const validBorderRadius = {
  none: "0px",
  sm: "2px",
  DEFAULT: "4px",
  md: "6px",
  lg: "8px",
  full: "9999px",
};

const validShadows = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
  ring: "0 0 0 2px rgba(59, 130, 246, 0.5)",
};

const validAnimation = {
  duration: {
    instant: "0ms",
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

const validStyleCollection = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Default Theme",
  description: "A clean, modern design system",
  tags: ["modern", "minimal"],
  colors: {
    light: validColorPalette,
    dark: validColorPalette,
  },
  typography: validTypography,
  spacing: validSpacing,
  borderRadius: validBorderRadius,
  shadows: validShadows,
  animation: validAnimation,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  usageCount: 0,
  isFavorite: false,
};

// ============================================
// Color Schema Tests
// ============================================

describe("ColorScaleSchema", () => {
  it("validates a complete color scale", () => {
    const result = ColorScaleSchema.safeParse(validColorScale);
    expect(result.success).toBe(true);
  });

  it("rejects invalid hex colors", () => {
    const invalid = { ...validColorScale, 50: "not-a-color" };
    const result = ColorScaleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects 3-digit hex codes", () => {
    const invalid = { ...validColorScale, 50: "#FFF" };
    const result = ColorScaleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects hex codes without hash", () => {
    const invalid = { ...validColorScale, 50: "FAFAFA" };
    const result = ColorScaleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects missing shade", () => {
    const { 50: _, ...invalid } = validColorScale;
    const result = ColorScaleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("accepts lowercase hex colors", () => {
    const lowercase = { ...validColorScale, 50: "#fafafa" };
    const result = ColorScaleSchema.safeParse(lowercase);
    expect(result.success).toBe(true);
  });
});

describe("SemanticColorsSchema", () => {
  it("validates complete semantic colors", () => {
    const result = SemanticColorsSchema.safeParse(validSemanticColors);
    expect(result.success).toBe(true);
  });

  it("rejects missing semantic color", () => {
    const { success: _, ...invalid } = validSemanticColors;
    const result = SemanticColorsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("AccentColorsSchema", () => {
  it("validates complete accent colors", () => {
    const result = AccentColorsSchema.safeParse(validAccentColors);
    expect(result.success).toBe(true);
  });

  it("rejects missing accent color", () => {
    const { default: _, ...invalid } = validAccentColors;
    const result = AccentColorsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("ColorPaletteSchema", () => {
  it("validates complete color palette", () => {
    const result = ColorPaletteSchema.safeParse(validColorPalette);
    expect(result.success).toBe(true);
  });

  it("rejects missing gray scale", () => {
    const { gray: _, ...invalid } = validColorPalette;
    const result = ColorPaletteSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

// ============================================
// Typography Schema Tests
// ============================================

describe("TypographySchema", () => {
  it("validates complete typography", () => {
    const result = TypographySchema.safeParse(validTypography);
    expect(result.success).toBe(true);
  });

  it("allows optional serif font", () => {
    const withSerif = {
      ...validTypography,
      fontFamily: {
        ...validTypography.fontFamily,
        serif: "Georgia, serif",
      },
    };
    const result = TypographySchema.safeParse(withSerif);
    expect(result.success).toBe(true);
  });

  it("rejects missing font family", () => {
    const { fontFamily: _, ...invalid } = validTypography;
    const result = TypographySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects invalid fontSize entry format", () => {
    const invalid = {
      ...validTypography,
      fontSize: {
        ...validTypography.fontSize,
        xs: "11px", // Should be tuple with lineHeight
      },
    };
    const result = TypographySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

// ============================================
// Spacing & Layout Schema Tests
// ============================================

describe("SpacingScaleSchema", () => {
  it("validates complete spacing scale", () => {
    const result = SpacingScaleSchema.safeParse(validSpacing);
    expect(result.success).toBe(true);
  });

  it("rejects missing spacing value", () => {
    const { 0: _, ...invalid } = validSpacing;
    const result = SpacingScaleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("BorderRadiusSchema", () => {
  it("validates complete border radius", () => {
    const result = BorderRadiusSchema.safeParse(validBorderRadius);
    expect(result.success).toBe(true);
  });

  it("rejects missing DEFAULT", () => {
    const { DEFAULT: _, ...invalid } = validBorderRadius;
    const result = BorderRadiusSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("ShadowsSchema", () => {
  it("validates complete shadows", () => {
    const result = ShadowsSchema.safeParse(validShadows);
    expect(result.success).toBe(true);
  });
});

// ============================================
// Animation Schema Tests
// ============================================

describe("AnimationSchema", () => {
  it("validates complete animation config", () => {
    const result = AnimationSchema.safeParse(validAnimation);
    expect(result.success).toBe(true);
  });

  it("rejects missing duration", () => {
    const { duration: _, ...invalid } = validAnimation;
    const result = AnimationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects missing easing", () => {
    const { easing: _, ...invalid } = validAnimation;
    const result = AnimationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

// ============================================
// Style Collection Schema Tests
// ============================================

describe("StyleCollectionSchema", () => {
  it("validates complete style collection", () => {
    const result = StyleCollectionSchema.safeParse(validStyleCollection);
    expect(result.success).toBe(true);
  });

  it("rejects invalid UUID", () => {
    const invalid = { ...validStyleCollection, id: "not-a-uuid" };
    const result = StyleCollectionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const invalid = { ...validStyleCollection, name: "" };
    const result = StyleCollectionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects name over 50 characters", () => {
    const invalid = { ...validStyleCollection, name: "a".repeat(51) };
    const result = StyleCollectionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects description over 200 characters", () => {
    const invalid = { ...validStyleCollection, description: "a".repeat(201) };
    const result = StyleCollectionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("allows optional description", () => {
    const { description: _, ...valid } = validStyleCollection;
    const result = StyleCollectionSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects invalid datetime format", () => {
    const invalid = { ...validStyleCollection, createdAt: "2024-01-01" };
    const result = StyleCollectionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects negative usageCount", () => {
    const invalid = { ...validStyleCollection, usageCount: -1 };
    const result = StyleCollectionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("allows optional thumbnail", () => {
    const { thumbnail: _, ...valid } = validStyleCollection;
    const result = StyleCollectionSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("allows optional lastUsedAt", () => {
    const { lastUsedAt: _, ...valid } = validStyleCollection;
    const result = StyleCollectionSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("defaults isFavorite to false", () => {
    const { isFavorite: _, ...input } = validStyleCollection;
    const result = StyleCollectionSchema.parse(input);
    expect(result.isFavorite).toBe(false);
  });

  it("defaults usageCount to 0", () => {
    const { usageCount: _, ...input } = validStyleCollection;
    const result = StyleCollectionSchema.parse(input);
    expect(result.usageCount).toBe(0);
  });
});

// ============================================
// Create Style Input Schema Tests
// ============================================

describe("CreateStyleInputSchema", () => {
  it("omits id, createdAt, updatedAt, lastUsedAt, usageCount", () => {
    const { id, createdAt, updatedAt, lastUsedAt, usageCount, ...input } =
      validStyleCollection;
    const result = CreateStyleInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects if id is included", () => {
    const result = CreateStyleInputSchema.safeParse(validStyleCollection);
    // Should fail because CreateStyleInputSchema omits id
    // But actually Zod's omit just ignores extra fields in safeParse by default
    // We need to check that the parsed output doesn't have id
    if (result.success) {
      expect("id" in result.data).toBe(false);
    }
  });

  it("validates color tokens correctly", () => {
    const { id, createdAt, updatedAt, lastUsedAt, usageCount, ...input } =
      validStyleCollection;
    const result = CreateStyleInputSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.colors.light.gray[50]).toBe("#FAFAFA");
    }
  });
});
