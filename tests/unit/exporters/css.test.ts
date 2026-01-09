import { describe, it, expect } from "vitest";
import { generateCSSVariables } from "../../../packages/web/lib/exporters/css";
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

describe("generateCSSVariables", () => {
  it("generates valid CSS output", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain(":root {");
    expect(result).toContain("}");
  });

  it("includes the style name in the header comment", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain("Generated from UI Vault: Test Theme");
  });

  it("includes light mode color variables", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain("/* Light Mode Colors */");
    expect(result).toContain("--color-gray-50: #FAFAFA;");
    expect(result).toContain("--color-gray-950: #09090B;");
  });

  it("includes dark mode color variables in .dark selector", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain(".dark {");
    expect(result).toContain("/* Dark Mode Colors */");
  });

  it("includes accent color variables", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain("--color-accent-default:");
    expect(result).toContain("--color-accent-emphasis:");
    expect(result).toContain("--color-accent-subtle:");
    expect(result).toContain("--color-accent-muted:");
  });

  it("includes semantic color variables", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain("--color-semantic-success: #22C55E;");
    expect(result).toContain("--color-semantic-error: #EF4444;");
    expect(result).toContain("--color-semantic-warning: #EAB308;");
    expect(result).toContain("--color-semantic-info: #3B82F6;");
  });

  it("includes typography variables", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain("/* Typography */");
    expect(result).toContain("--font-fontFamily-sans: Inter, system-ui, sans-serif;");
    expect(result).toContain("--font-fontFamily-mono: JetBrains Mono, monospace;");
  });

  it("includes font size variables with line height", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain("--font-fontSize-xs: 11px;");
    expect(result).toContain("--font-fontSize-xs-line-height: 16px;");
    expect(result).toContain("--font-fontSize-base: 13px;");
    expect(result).toContain("--font-fontSize-base-line-height: 20px;");
  });

  it("includes font weight variables", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain("--font-fontWeight-normal: 400;");
    expect(result).toContain("--font-fontWeight-medium: 500;");
    expect(result).toContain("--font-fontWeight-semibold: 600;");
  });

  it("includes letter spacing variables", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain("--font-letterSpacing-tight: -0.01em;");
    expect(result).toContain("--font-letterSpacing-normal: 0;");
    expect(result).toContain("--font-letterSpacing-wide: 0.02em;");
  });

  it("includes spacing variables", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain("/* Spacing */");
    expect(result).toContain("--space-0: 0px;");
    expect(result).toContain("--space-4: 16px;");
    expect(result).toContain("--space-24: 96px;");
  });

  it("includes border radius variables", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain("/* Border Radius */");
    expect(result).toContain("--radius-none: 0px;");
    expect(result).toContain("--radius-DEFAULT: 4px;");
    expect(result).toContain("--radius-full: 9999px;");
  });

  it("includes shadow variables", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain("/* Shadows */");
    expect(result).toContain("--shadow-none: none;");
    expect(result).toContain("--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);");
    expect(result).toContain("--shadow-ring:");
  });

  it("includes animation variables", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain("/* Animation */");
    expect(result).toContain("--animation-duration-instant: 0ms;");
    expect(result).toContain("--animation-duration-fast: 100ms;");
    expect(result).toContain("--animation-duration-slow: 300ms;");
  });

  it("includes easing variables", () => {
    const result = generateCSSVariables(mockStyle);

    expect(result).toContain("--animation-easing-default: cubic-bezier(0.4, 0, 0.2, 1);");
    expect(result).toContain("--animation-easing-bounce:");
  });

  it("generates syntactically valid CSS", () => {
    const result = generateCSSVariables(mockStyle);

    // Check for balanced braces
    const openBraces = (result.match(/{/g) || []).length;
    const closeBraces = (result.match(/}/g) || []).length;
    expect(openBraces).toBe(closeBraces);

    // Check for proper line endings on CSS property lines (starting with --)
    const lines = result.split("\n").filter((line) => line.trim().startsWith("--"));
    for (const line of lines) {
      expect(line.trim()).toMatch(/;$/);
    }
  });

  it("properly nests color values", () => {
    const result = generateCSSVariables(mockStyle);

    // All color variables should follow the pattern --color-{category}-{shade/name}
    expect(result).toMatch(/--color-gray-\d+:/);
    expect(result).toMatch(/--color-accent-\w+:/);
    expect(result).toMatch(/--color-semantic-\w+:/);
  });
});
