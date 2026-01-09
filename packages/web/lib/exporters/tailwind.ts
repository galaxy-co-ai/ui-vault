import type { StyleCollection } from "@/lib/schemas/style.schema";

export function generateTailwindConfig(style: StyleCollection): string {
  const { colors, typography, spacing, borderRadius, shadows, animation } =
    style;

  // Use dark mode colors as the primary theme (common for dev tools)
  const colorConfig = {
    gray: colors.dark.gray,
    accent: {
      subtle: colors.dark.accent.subtle,
      muted: colors.dark.accent.muted,
      DEFAULT: colors.dark.accent.default,
      emphasis: colors.dark.accent.emphasis,
      foreground: colors.dark.accent.text,
    },
    success: {
      DEFAULT: colors.dark.semantic.success,
      muted: colors.dark.semantic.successMuted,
    },
    warning: {
      DEFAULT: colors.dark.semantic.warning,
      muted: colors.dark.semantic.warningMuted,
    },
    error: {
      DEFAULT: colors.dark.semantic.error,
      muted: colors.dark.semantic.errorMuted,
    },
    info: {
      DEFAULT: colors.dark.semantic.info,
      muted: colors.dark.semantic.infoMuted,
    },
  };

  const config = {
    theme: {
      extend: {
        colors: colorConfig,
        fontFamily: {
          sans: typography.fontFamily.sans.split(", "),
          mono: typography.fontFamily.mono.split(", "),
          ...(typography.fontFamily.serif && {
            serif: typography.fontFamily.serif.split(", "),
          }),
        },
        fontSize: typography.fontSize,
        fontWeight: typography.fontWeight,
        letterSpacing: typography.letterSpacing,
        spacing,
        borderRadius: {
          none: borderRadius.none,
          sm: borderRadius.sm,
          DEFAULT: borderRadius.DEFAULT,
          md: borderRadius.md,
          lg: borderRadius.lg,
          full: borderRadius.full,
        },
        boxShadow: {
          none: shadows.none,
          sm: shadows.sm,
          DEFAULT: shadows.DEFAULT,
          md: shadows.md,
          lg: shadows.lg,
          ring: shadows.ring,
        },
        transitionDuration: {
          instant: animation.duration.instant,
          fast: animation.duration.fast,
          normal: animation.duration.normal,
          smooth: animation.duration.smooth,
          slow: animation.duration.slow,
        },
        transitionTimingFunction: {
          DEFAULT: animation.easing.default,
          in: animation.easing.in,
          out: animation.easing.out,
          bounce: animation.easing.bounce,
        },
      },
    },
  };

  return `import type { Config } from "tailwindcss";

/**
 * Tailwind CSS Configuration
 * Generated from UI Vault: ${style.name}
 * Created: ${new Date().toISOString()}
 */
const config: Config = ${JSON.stringify(config, null, 2)};

export default config;
`;
}
