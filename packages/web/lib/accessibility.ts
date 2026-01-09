/**
 * WCAG Accessibility Utilities
 * Calculates color contrast ratios and provides accessibility guidance
 */

import { hexToRgb, adjustLightness, type RGB } from "./color-generator";

// Re-export for convenience
export { hexToRgb };

// ============================================
// Luminance Calculations
// ============================================

/**
 * Calculate the relative luminance of a color
 * Based on WCAG 2.1 formula
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getRelativeLuminance(rgb: RGB): number {
  const channels = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const sRGB = channel / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * (channels[0] ?? 0) + 0.7152 * (channels[1] ?? 0) + 0.0722 * (channels[2] ?? 0);
}

/**
 * Calculate the relative luminance from a hex color
 */
export function getLuminanceFromHex(hex: string): number {
  return getRelativeLuminance(hexToRgb(hex));
}

// ============================================
// Contrast Ratio Calculations
// ============================================

/**
 * Calculate the contrast ratio between two colors
 * @returns Contrast ratio from 1 to 21
 * @see https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function calculateContrastRatio(
  foreground: string,
  background: string
): number {
  const lum1 = getLuminanceFromHex(foreground);
  const lum2 = getLuminanceFromHex(background);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Format contrast ratio for display
 */
export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(1)}:1`;
}

// ============================================
// WCAG Level Evaluation
// ============================================

export type WCAGLevel = "AAA" | "AA" | "AA-Large" | "Fail";

export interface WCAGResult {
  level: WCAGLevel;
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
  passesAAALarge: boolean;
}

/**
 * WCAG 2.1 Contrast Requirements:
 * - AA Normal Text: 4.5:1
 * - AA Large Text: 3:1
 * - AAA Normal Text: 7:1
 * - AAA Large Text: 4.5:1
 *
 * Large text is defined as:
 * - 18pt (24px) or larger
 * - 14pt (18.66px) bold or larger
 */
export const WCAG_THRESHOLDS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
};

/**
 * Get the WCAG conformance level for a contrast ratio
 */
export function getWCAGLevel(ratio: number): WCAGLevel {
  if (ratio >= WCAG_THRESHOLDS.AAA_NORMAL) {
    return "AAA";
  }
  if (ratio >= WCAG_THRESHOLDS.AA_NORMAL) {
    return "AA";
  }
  if (ratio >= WCAG_THRESHOLDS.AA_LARGE) {
    return "AA-Large";
  }
  return "Fail";
}

/**
 * Get detailed WCAG evaluation results
 */
export function evaluateWCAG(
  foreground: string,
  background: string
): WCAGResult {
  const ratio = calculateContrastRatio(foreground, background);

  return {
    level: getWCAGLevel(ratio),
    ratio,
    passesAA: ratio >= WCAG_THRESHOLDS.AA_NORMAL,
    passesAAA: ratio >= WCAG_THRESHOLDS.AAA_NORMAL,
    passesAALarge: ratio >= WCAG_THRESHOLDS.AA_LARGE,
    passesAAALarge: ratio >= WCAG_THRESHOLDS.AAA_LARGE,
  };
}

// ============================================
// Color Suggestions
// ============================================

/**
 * Suggest an accessible alternative for a color that fails contrast requirements
 * @param foreground The text/foreground color
 * @param background The background color
 * @param targetLevel The minimum WCAG level to achieve
 */
export function suggestAccessibleAlternative(
  foreground: string,
  background: string,
  targetLevel: "AA" | "AAA" = "AA"
): string {
  const targetRatio =
    targetLevel === "AAA"
      ? WCAG_THRESHOLDS.AAA_NORMAL
      : WCAG_THRESHOLDS.AA_NORMAL;

  let currentRatio = calculateContrastRatio(foreground, background);

  if (currentRatio >= targetRatio) {
    return foreground; // Already passes
  }

  // Determine if we should lighten or darken
  const fgLuminance = getLuminanceFromHex(foreground);
  const bgLuminance = getLuminanceFromHex(background);
  const shouldDarken = fgLuminance > bgLuminance;

  // Iteratively adjust the color until it passes
  let adjustedColor = foreground;
  let adjustment = 0;
  const step = shouldDarken ? -5 : 5;
  const maxIterations = 20;

  for (let i = 0; i < maxIterations; i++) {
    adjustment += step;
    adjustedColor = adjustLightness(foreground, adjustment);
    currentRatio = calculateContrastRatio(adjustedColor, background);

    if (currentRatio >= targetRatio) {
      return adjustedColor;
    }
  }

  // If we couldn't find a good color, return black or white
  const whiteRatio = calculateContrastRatio("#FFFFFF", background);
  const blackRatio = calculateContrastRatio("#000000", background);

  return whiteRatio > blackRatio ? "#FFFFFF" : "#000000";
}

// ============================================
// Color Pair Analysis
// ============================================

export interface ColorPairAnalysis {
  foreground: string;
  background: string;
  ratio: number;
  level: WCAGLevel;
  suggestion?: string;
}

/**
 * Analyze multiple color pairs for accessibility
 */
export function analyzeColorPairs(
  pairs: Array<{ foreground: string; background: string; name?: string }>
): ColorPairAnalysis[] {
  return pairs.map(({ foreground, background }) => {
    const ratio = calculateContrastRatio(foreground, background);
    const level = getWCAGLevel(ratio);

    const analysis: ColorPairAnalysis = {
      foreground,
      background,
      ratio,
      level,
    };

    if (level === "Fail" || level === "AA-Large") {
      analysis.suggestion = suggestAccessibleAlternative(
        foreground,
        background,
        "AA"
      );
    }

    return analysis;
  });
}

// ============================================
// Palette Accessibility Audit
// ============================================

export interface AccessibilityIssue {
  id: string;
  type: "text-on-background" | "semantic" | "contrast";
  severity: "error" | "warning";
  foreground: string;
  background: string;
  ratio: number;
  message: string;
  suggestion?: string;
}

/**
 * Audit a color palette for accessibility issues
 */
export function auditPalette(
  palette: {
    gray: Record<string, string>;
    accent: Record<string, string>;
    semantic: Record<string, string>;
  },
  isDarkMode: boolean = false
): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Determine background colors based on mode
  const bgColor = isDarkMode ? (palette.gray["950"] ?? "#000000") : (palette.gray["50"] ?? "#FFFFFF");

  // Check text colors against backgrounds
  const textChecks: Array<{ fg: string; bg: string; name: string; id: string }> = [
    {
      fg: palette.gray["900"] ?? "#000000",
      bg: bgColor,
      name: "Dark text on background",
      id: "text-dark-on-bg",
    },
    {
      fg: palette.gray["700"] ?? "#333333",
      bg: bgColor,
      name: "Muted text on background",
      id: "text-muted-on-bg",
    },
    {
      fg: palette.accent.text ?? "#000000",
      bg: bgColor,
      name: "Accent text on background",
      id: "accent-text-on-bg",
    },
    {
      fg: palette.accent.text ?? "#000000",
      bg: palette.accent.subtle ?? "#FFFFFF",
      name: "Accent text on accent subtle",
      id: "accent-text-on-subtle",
    },
  ];

  if (isDarkMode) {
    // In dark mode, check light text on dark backgrounds
    textChecks.push(
      {
        fg: palette.gray["100"] ?? "#FFFFFF",
        bg: bgColor,
        name: "Light text on background",
        id: "text-light-on-bg",
      },
      {
        fg: palette.gray["300"] ?? "#CCCCCC",
        bg: bgColor,
        name: "Muted light text on background",
        id: "text-muted-light-on-bg",
      }
    );
  }

  for (const check of textChecks) {
    const ratio = calculateContrastRatio(check.fg, check.bg);
    const level = getWCAGLevel(ratio);

    if (level === "Fail") {
      issues.push({
        id: check.id,
        type: "text-on-background",
        severity: "error",
        foreground: check.fg,
        background: check.bg,
        ratio,
        message: `${check.name} fails WCAG AA (${formatContrastRatio(ratio)})`,
        suggestion: suggestAccessibleAlternative(check.fg, check.bg),
      });
    } else if (level === "AA-Large") {
      issues.push({
        id: check.id,
        type: "text-on-background",
        severity: "warning",
        foreground: check.fg,
        background: check.bg,
        ratio,
        message: `${check.name} only passes for large text (${formatContrastRatio(ratio)})`,
        suggestion: suggestAccessibleAlternative(check.fg, check.bg),
      });
    }
  }

  // Check semantic colors
  const semanticChecks: Array<{ color: string; name: string; id: string }> = [
    { color: palette.semantic.success ?? "#22C55E", name: "Success", id: "semantic-success" },
    { color: palette.semantic.warning ?? "#EAB308", name: "Warning", id: "semantic-warning" },
    { color: palette.semantic.error ?? "#EF4444", name: "Error", id: "semantic-error" },
    { color: palette.semantic.info ?? "#3B82F6", name: "Info", id: "semantic-info" },
  ];

  for (const check of semanticChecks) {
    // Check against white and dark backgrounds
    const ratioOnWhite = calculateContrastRatio(check.color, "#FFFFFF");
    const ratioOnDark = calculateContrastRatio(check.color, "#000000");

    const bestRatio = Math.max(ratioOnWhite, ratioOnDark);

    if (bestRatio < WCAG_THRESHOLDS.AA_LARGE) {
      issues.push({
        id: check.id,
        type: "semantic",
        severity: "warning",
        foreground: check.color,
        background: ratioOnWhite > ratioOnDark ? "#FFFFFF" : "#000000",
        ratio: bestRatio,
        message: `${check.name} color may be hard to see (${formatContrastRatio(bestRatio)})`,
      });
    }
  }

  return issues;
}

// ============================================
// Helpers
// ============================================

/**
 * Check if a color is considered "light"
 */
export function isLightColor(hex: string): boolean {
  return getLuminanceFromHex(hex) > 0.179;
}

/**
 * Get recommended text color for a background
 */
export function getTextColorForBackground(background: string): string {
  return isLightColor(background) ? "#000000" : "#FFFFFF";
}

/**
 * Get a badge color class based on WCAG level
 */
export function getWCAGBadgeClass(level: WCAGLevel): string {
  switch (level) {
    case "AAA":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "AA":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "AA-Large":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Fail":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  }
}
