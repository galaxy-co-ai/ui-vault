/**
 * Color Generator - Algorithmic palette generation using HSL color math
 * Generates harmonious color palettes from a single seed color
 */

import type { ColorPalette, ColorScale } from "@/lib/schemas/style.schema";

// ============================================
// Color Conversion Utilities
// ============================================

interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(result[1] ?? "0", 16),
    g: parseInt(result[2] ?? "0", 16),
    b: parseInt(result[3] ?? "0", 16),
  };
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: l * 100 };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

/**
 * Convert hex to HSL
 */
export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

/**
 * Convert HSL to hex
 */
export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

// ============================================
// Color Manipulation
// ============================================

/**
 * Adjust lightness of a color
 */
export function adjustLightness(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  hsl.l = Math.max(0, Math.min(100, hsl.l + amount));
  return hslToHex(hsl);
}

/**
 * Adjust saturation of a color
 */
export function adjustSaturation(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  hsl.s = Math.max(0, Math.min(100, hsl.s + amount));
  return hslToHex(hsl);
}

/**
 * Rotate hue
 */
export function rotateHue(hex: string, degrees: number): string {
  const hsl = hexToHsl(hex);
  hsl.h = (hsl.h + degrees + 360) % 360;
  return hslToHex(hsl);
}

/**
 * Mix two colors
 */
export function mixColors(color1: string, color2: string, weight: number = 0.5): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  return rgbToHex({
    r: rgb1.r * weight + rgb2.r * (1 - weight),
    g: rgb1.g * weight + rgb2.g * (1 - weight),
    b: rgb1.b * weight + rgb2.b * (1 - weight),
  });
}

// ============================================
// Palette Generation
// ============================================

/**
 * Generate a gray scale from a seed gray color
 */
export function generateGrayScale(seedGray?: string): ColorScale {
  // Default to a neutral gray if no seed provided
  const baseHsl = seedGray ? hexToHsl(seedGray) : { h: 220, s: 10, l: 50 };

  // Keep subtle hue and low saturation for grays
  const hue = baseHsl.h;
  const baseSat = Math.min(baseHsl.s, 15); // Cap saturation for grays

  return {
    50: hslToHex({ h: hue, s: baseSat * 0.3, l: 98 }),
    100: hslToHex({ h: hue, s: baseSat * 0.4, l: 96 }),
    200: hslToHex({ h: hue, s: baseSat * 0.5, l: 91 }),
    300: hslToHex({ h: hue, s: baseSat * 0.6, l: 85 }),
    400: hslToHex({ h: hue, s: baseSat * 0.7, l: 70 }),
    500: hslToHex({ h: hue, s: baseSat * 0.8, l: 55 }),
    600: hslToHex({ h: hue, s: baseSat * 0.9, l: 45 }),
    700: hslToHex({ h: hue, s: baseSat, l: 35 }),
    800: hslToHex({ h: hue, s: baseSat, l: 25 }),
    900: hslToHex({ h: hue, s: baseSat, l: 15 }),
    950: hslToHex({ h: hue, s: baseSat, l: 8 }),
  };
}

/**
 * Generate accent color shades from a seed color
 */
export function generateAccentShades(seedColor: string): {
  subtle: string;
  muted: string;
  default: string;
  emphasis: string;
  text: string;
} {
  const hsl = hexToHsl(seedColor);

  return {
    subtle: hslToHex({ h: hsl.h, s: Math.min(hsl.s, 30), l: 97 }),
    muted: hslToHex({ h: hsl.h, s: hsl.s * 0.9, l: 80 }),
    default: seedColor.toUpperCase(),
    emphasis: hslToHex({ h: hsl.h, s: hsl.s * 1.1, l: Math.max(hsl.l - 10, 30) }),
    text: hslToHex({ h: hsl.h, s: hsl.s * 1.2, l: Math.max(hsl.l - 20, 25) }),
  };
}

/**
 * Generate dark mode accent shades
 */
export function generateDarkAccentShades(seedColor: string): {
  subtle: string;
  muted: string;
  default: string;
  emphasis: string;
  text: string;
} {
  const hsl = hexToHsl(seedColor);

  return {
    subtle: hslToHex({ h: hsl.h, s: hsl.s * 0.8, l: 20 }),
    muted: hslToHex({ h: hsl.h, s: hsl.s * 0.9, l: 40 }),
    default: seedColor.toUpperCase(),
    emphasis: hslToHex({ h: hsl.h, s: hsl.s * 0.9, l: Math.min(hsl.l + 15, 75) }),
    text: hslToHex({ h: hsl.h, s: hsl.s * 0.7, l: Math.min(hsl.l + 30, 85) }),
  };
}

/**
 * Generate semantic colors based on a seed accent
 */
export function generateSemanticColors(seedAccent: string): {
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  error: string;
  errorMuted: string;
  info: string;
  infoMuted: string;
} {
  // Standard semantic hues
  const successHue = 142; // Green
  const warningHue = 45; // Yellow/Orange
  const errorHue = 0; // Red
  const accentHsl = hexToHsl(seedAccent);

  return {
    success: hslToHex({ h: successHue, s: 72, l: 50 }),
    successMuted: hslToHex({ h: successHue, s: 55, l: 92 }),
    warning: hslToHex({ h: warningHue, s: 92, l: 55 }),
    warningMuted: hslToHex({ h: warningHue, s: 80, l: 92 }),
    error: hslToHex({ h: errorHue, s: 84, l: 60 }),
    errorMuted: hslToHex({ h: errorHue, s: 80, l: 93 }),
    info: seedAccent.toUpperCase(),
    infoMuted: hslToHex({ h: accentHsl.h, s: accentHsl.s * 0.6, l: 92 }),
  };
}

/**
 * Generate dark mode semantic colors
 */
export function generateDarkSemanticColors(seedAccent: string): {
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  error: string;
  errorMuted: string;
  info: string;
  infoMuted: string;
} {
  const successHue = 142;
  const warningHue = 45;
  const errorHue = 0;
  const accentHsl = hexToHsl(seedAccent);

  return {
    success: hslToHex({ h: successHue, s: 72, l: 50 }),
    successMuted: hslToHex({ h: successHue, s: 60, l: 25 }),
    warning: hslToHex({ h: warningHue, s: 92, l: 55 }),
    warningMuted: hslToHex({ h: warningHue, s: 70, l: 25 }),
    error: hslToHex({ h: errorHue, s: 84, l: 60 }),
    errorMuted: hslToHex({ h: errorHue, s: 70, l: 30 }),
    info: seedAccent.toUpperCase(),
    infoMuted: hslToHex({ h: accentHsl.h, s: accentHsl.s * 0.7, l: 30 }),
  };
}

/**
 * Generate a complete color palette from a seed accent color
 */
export function generatePaletteFromSeed(seedColor: string): {
  light: ColorPalette;
  dark: ColorPalette;
} {
  const accentHsl = hexToHsl(seedColor);

  // Generate gray scale with a hint of the accent hue
  const grayScale = generateGrayScale(hslToHex({ h: accentHsl.h, s: 10, l: 50 }));

  return {
    light: {
      gray: grayScale,
      accent: generateAccentShades(seedColor),
      semantic: generateSemanticColors(seedColor),
    },
    dark: {
      gray: {
        ...grayScale,
        // Invert the scale for dark mode (darker colors become background)
        50: grayScale[50],
        100: grayScale[100],
        200: grayScale[200],
        300: grayScale[300],
        400: grayScale[400],
        500: grayScale[500],
        600: grayScale[600],
        700: grayScale[700],
        800: grayScale[800],
        900: grayScale[900],
        950: grayScale[950],
      },
      accent: generateDarkAccentShades(seedColor),
      semantic: generateDarkSemanticColors(seedColor),
    },
  };
}

// ============================================
// Color Harmony Generation
// ============================================

/**
 * Generate complementary color (opposite on color wheel)
 */
export function getComplementary(hex: string): string {
  return rotateHue(hex, 180);
}

/**
 * Generate analogous colors (adjacent on color wheel)
 */
export function getAnalogous(hex: string): [string, string] {
  return [rotateHue(hex, -30), rotateHue(hex, 30)];
}

/**
 * Generate triadic colors (evenly spaced on color wheel)
 */
export function getTriadic(hex: string): [string, string] {
  return [rotateHue(hex, -120), rotateHue(hex, 120)];
}

/**
 * Generate split-complementary colors
 */
export function getSplitComplementary(hex: string): [string, string] {
  return [rotateHue(hex, 150), rotateHue(hex, 210)];
}

// ============================================
// Preset Palettes
// ============================================

export type PalettePreset =
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "cyan";

export const PALETTE_PRESETS: Record<PalettePreset, string> = {
  blue: "#3B82F6",
  purple: "#8B5CF6",
  pink: "#EC4899",
  red: "#EF4444",
  orange: "#F97316",
  yellow: "#EAB308",
  green: "#22C55E",
  teal: "#14B8A6",
  cyan: "#06B6D4",
};

/**
 * Get a preset palette by name
 */
export function getPresetPalette(preset: PalettePreset): {
  light: ColorPalette;
  dark: ColorPalette;
} {
  return generatePaletteFromSeed(PALETTE_PRESETS[preset]);
}
