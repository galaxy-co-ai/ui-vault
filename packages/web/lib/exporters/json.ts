import type { StyleCollection } from "@/lib/schemas/style.schema";

export function generateJSONTokens(style: StyleCollection): string {
  const tokens = {
    $schema: "https://design-tokens.github.io/community-group/format/",
    name: style.name,
    description: style.description,
    generatedAt: new Date().toISOString(),
    tokens: {
      colors: {
        light: style.colors.light,
        dark: style.colors.dark,
      },
      typography: style.typography,
      spacing: style.spacing,
      borderRadius: style.borderRadius,
      shadows: style.shadows,
      animation: style.animation,
    },
  };

  return JSON.stringify(tokens, null, 2);
}
