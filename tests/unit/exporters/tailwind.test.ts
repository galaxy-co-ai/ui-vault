import { describe, it, expect } from "vitest";
import { generateTailwindConfig } from "../../../packages/web/lib/exporters/tailwind";
import type { StyleCollection } from "../../../packages/web/lib/schemas/style.schema";

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

const mockStyle: StyleCollection = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Test Theme",
  description: "A test design system",
  tags: ["test"],
  colors: {
    light: validColorPalette,
    dark: validColorPalette,
  },
  typography: {
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
  },
  spacing: {
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
  },
  borderRadius: {
    none: "0px",
    sm: "2px",
    DEFAULT: "4px",
    md: "6px",
    lg: "8px",
    full: "9999px",
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    ring: "0 0 0 2px rgba(59, 130, 246, 0.5)",
  },
  animation: {
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
  },
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  usageCount: 0,
  isFavorite: false,
};

// ============================================
// Tests
// ============================================

describe("generateTailwindConfig", () => {
  it("generates valid TypeScript output", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain('import type { Config } from "tailwindcss"');
    expect(result).toContain("const config: Config =");
    expect(result).toContain("export default config;");
  });

  it("includes the style name in the header comment", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain("Generated from UI Vault: Test Theme");
  });

  it("includes color configuration from dark mode", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain('"gray"');
    expect(result).toContain('"accent"');
    expect(result).toContain('"success"');
    expect(result).toContain('"warning"');
    expect(result).toContain('"error"');
    expect(result).toContain('"info"');
  });

  it("includes gray color scale values", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain('"50": "#FAFAFA"');
    expect(result).toContain('"900": "#18181B"');
    expect(result).toContain('"950": "#09090B"');
  });

  it("includes accent colors with correct mapping", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain('"DEFAULT": "#3B82F6"');
    expect(result).toContain('"emphasis": "#2563EB"');
    expect(result).toContain('"foreground": "#FFFFFF"');
  });

  it("includes font family configuration", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain('"fontFamily"');
    expect(result).toContain('"Inter"');
    expect(result).toContain('"JetBrains Mono"');
  });

  it("splits font family strings into arrays", () => {
    const result = generateTailwindConfig(mockStyle);
    const parsed = extractConfigFromOutput(result);

    expect(parsed.theme.extend.fontFamily.sans).toEqual([
      "Inter",
      "system-ui",
      "sans-serif",
    ]);
    expect(parsed.theme.extend.fontFamily.mono).toEqual([
      "JetBrains Mono",
      "monospace",
    ]);
  });

  it("includes fontSize configuration", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain('"fontSize"');
    expect(result).toContain('"xs"');
    expect(result).toContain('"2xl"');
  });

  it("includes fontWeight configuration", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain('"fontWeight"');
    expect(result).toContain('"normal": "400"');
    expect(result).toContain('"medium": "500"');
    expect(result).toContain('"semibold": "600"');
  });

  it("includes letterSpacing configuration", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain('"letterSpacing"');
    expect(result).toContain('"tight": "-0.01em"');
  });

  it("includes spacing configuration", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain('"spacing"');
    expect(result).toContain('"0": "0px"');
    expect(result).toContain('"4": "16px"');
  });

  it("includes borderRadius configuration", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain('"borderRadius"');
    expect(result).toContain('"none": "0px"');
    expect(result).toContain('"full": "9999px"');
  });

  it("includes boxShadow configuration", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain('"boxShadow"');
    expect(result).toContain('"none": "none"');
    expect(result).toContain('"ring"');
  });

  it("includes transitionDuration configuration", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain('"transitionDuration"');
    expect(result).toContain('"instant": "0ms"');
    expect(result).toContain('"fast": "100ms"');
    expect(result).toContain('"slow": "300ms"');
  });

  it("includes transitionTimingFunction configuration", () => {
    const result = generateTailwindConfig(mockStyle);

    expect(result).toContain('"transitionTimingFunction"');
    expect(result).toContain('"in"');
    expect(result).toContain('"out"');
    expect(result).toContain('"bounce"');
  });

  it("generates valid JSON structure", () => {
    const result = generateTailwindConfig(mockStyle);
    const parsed = extractConfigFromOutput(result);

    expect(parsed).toHaveProperty("theme");
    expect(parsed.theme).toHaveProperty("extend");
    expect(parsed.theme.extend).toHaveProperty("colors");
  });

  it("handles style with optional serif font", () => {
    const styleWithSerif: StyleCollection = {
      ...mockStyle,
      typography: {
        ...mockStyle.typography,
        fontFamily: {
          ...mockStyle.typography.fontFamily,
          serif: "Georgia, serif",
        },
      },
    };

    const result = generateTailwindConfig(styleWithSerif);

    expect(result).toContain('"serif"');
    expect(result).toContain("Georgia");
  });
});

// ============================================
// Helper Functions
// ============================================

function extractConfigFromOutput(output: string): {
  theme: { extend: Record<string, unknown> };
} {
  // Extract the JSON config from the generated TypeScript
  const match = output.match(/const config: Config = ({[\s\S]*?});/);
  if (!match) {
    throw new Error("Could not extract config from output");
  }
  return JSON.parse(match[1]);
}
