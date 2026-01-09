import { z } from "zod";

// ============================================
// Color Schemas
// ============================================

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const ColorScaleSchema = z.object({
  50: z.string().regex(hexColorRegex),
  100: z.string().regex(hexColorRegex),
  200: z.string().regex(hexColorRegex),
  300: z.string().regex(hexColorRegex),
  400: z.string().regex(hexColorRegex),
  500: z.string().regex(hexColorRegex),
  600: z.string().regex(hexColorRegex),
  700: z.string().regex(hexColorRegex),
  800: z.string().regex(hexColorRegex),
  900: z.string().regex(hexColorRegex),
  950: z.string().regex(hexColorRegex),
});

export const SemanticColorsSchema = z.object({
  success: z.string().regex(hexColorRegex),
  successMuted: z.string().regex(hexColorRegex),
  warning: z.string().regex(hexColorRegex),
  warningMuted: z.string().regex(hexColorRegex),
  error: z.string().regex(hexColorRegex),
  errorMuted: z.string().regex(hexColorRegex),
  info: z.string().regex(hexColorRegex),
  infoMuted: z.string().regex(hexColorRegex),
});

export const AccentColorsSchema = z.object({
  subtle: z.string().regex(hexColorRegex),
  muted: z.string().regex(hexColorRegex),
  default: z.string().regex(hexColorRegex),
  emphasis: z.string().regex(hexColorRegex),
  text: z.string().regex(hexColorRegex),
});

export const ColorPaletteSchema = z.object({
  gray: ColorScaleSchema,
  accent: AccentColorsSchema,
  semantic: SemanticColorsSchema,
});

// ============================================
// Typography Schemas
// ============================================

export const FontSizeEntrySchema = z.tuple([
  z.string(), // size (e.g., "13px")
  z.object({
    lineHeight: z.string(), // e.g., "20px"
  }),
]);

export const TypographySchema = z.object({
  fontFamily: z.object({
    sans: z.string(),
    mono: z.string(),
    serif: z.string().optional(),
  }),
  fontSize: z.object({
    xs: FontSizeEntrySchema,
    sm: FontSizeEntrySchema,
    base: FontSizeEntrySchema,
    md: FontSizeEntrySchema,
    lg: FontSizeEntrySchema,
    xl: FontSizeEntrySchema,
    "2xl": FontSizeEntrySchema,
  }),
  fontWeight: z.object({
    normal: z.string(),
    medium: z.string(),
    semibold: z.string(),
  }),
  letterSpacing: z.object({
    tight: z.string(),
    normal: z.string(),
    wide: z.string(),
  }),
});

// ============================================
// Spacing & Layout Schemas
// ============================================

export const SpacingScaleSchema = z.object({
  0: z.string(),
  0.5: z.string(),
  1: z.string(),
  1.5: z.string(),
  2: z.string(),
  2.5: z.string(),
  3: z.string(),
  4: z.string(),
  5: z.string(),
  6: z.string(),
  8: z.string(),
  10: z.string(),
  12: z.string(),
  16: z.string(),
  20: z.string(),
  24: z.string(),
});

export const BorderRadiusSchema = z.object({
  none: z.string(),
  sm: z.string(),
  DEFAULT: z.string(),
  md: z.string(),
  lg: z.string(),
  full: z.string(),
});

export const ShadowsSchema = z.object({
  none: z.string(),
  sm: z.string(),
  DEFAULT: z.string(),
  md: z.string(),
  lg: z.string(),
  ring: z.string(),
});

// ============================================
// Animation Schemas
// ============================================

export const AnimationSchema = z.object({
  duration: z.object({
    instant: z.string(),
    fast: z.string(),
    normal: z.string(),
    smooth: z.string(),
    slow: z.string(),
  }),
  easing: z.object({
    default: z.string(),
    in: z.string(),
    out: z.string(),
    bounce: z.string(),
  }),
});

// ============================================
// Style Collection Schema
// ============================================

export const StyleCollectionSchema = z.object({
  // Identity
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  tags: z.array(z.string().min(1).max(20)),

  // Design Tokens
  colors: z.object({
    light: ColorPaletteSchema,
    dark: ColorPaletteSchema,
  }),
  typography: TypographySchema,
  spacing: SpacingScaleSchema,
  borderRadius: BorderRadiusSchema,
  shadows: ShadowsSchema,
  animation: AnimationSchema,

  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastUsedAt: z.string().datetime().optional(),
  usageCount: z.number().int().nonnegative().default(0),

  // Optional
  thumbnail: z.string().optional(),
  isFavorite: z.boolean().default(false),
});

// ============================================
// Derived Types
// ============================================

export type ColorScale = z.infer<typeof ColorScaleSchema>;
export type ColorPalette = z.infer<typeof ColorPaletteSchema>;
export type Typography = z.infer<typeof TypographySchema>;
export type SpacingScale = z.infer<typeof SpacingScaleSchema>;
export type BorderRadius = z.infer<typeof BorderRadiusSchema>;
export type Shadows = z.infer<typeof ShadowsSchema>;
export type Animation = z.infer<typeof AnimationSchema>;
export type StyleCollection = z.infer<typeof StyleCollectionSchema>;

// ============================================
// Input Schemas (for creation/updates)
// ============================================

export const CreateStyleInputSchema = StyleCollectionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastUsedAt: true,
  usageCount: true,
});

export const UpdateStyleInputSchema = StyleCollectionSchema.partial().omit({
  id: true,
  createdAt: true,
});

export type CreateStyleInput = z.infer<typeof CreateStyleInputSchema>;
export type UpdateStyleInput = z.infer<typeof UpdateStyleInputSchema>;
