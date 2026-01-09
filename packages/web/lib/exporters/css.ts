import type { StyleCollection } from "@/lib/schemas/style.schema";

function flattenObject(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else if (Array.isArray(value)) {
      // Handle fontSize tuples: ["13px", { lineHeight: "20px" }]
      result[newKey] = value[0] as string;
      if (value[1] && typeof value[1] === "object") {
        const lineHeight = (value[1] as { lineHeight: string }).lineHeight;
        result[`${newKey}-line-height`] = lineHeight;
      }
    } else {
      result[newKey] = String(value);
    }
  }

  return result;
}

export function generateCSSVariables(style: StyleCollection): string {
  const { colors, typography, spacing, borderRadius, shadows, animation } =
    style;

  const lightVars = flattenObject(colors.light, "color");
  const darkVars = flattenObject(colors.dark, "color");
  const typographyVars = flattenObject(typography, "font");
  const spacingVars = flattenObject(spacing, "space");
  const radiusVars = flattenObject(borderRadius, "radius");
  const shadowVars = flattenObject(shadows, "shadow");
  const animationVars = flattenObject(animation, "animation");

  const formatVars = (vars: Record<string, string>, indent = "  ") =>
    Object.entries(vars)
      .map(([key, value]) => `${indent}--${key}: ${value};`)
      .join("\n");

  return `/**
 * CSS Custom Properties
 * Generated from UI Vault: ${style.name}
 * Created: ${new Date().toISOString()}
 */

:root {
  /* Light Mode Colors */
${formatVars(lightVars)}

  /* Typography */
${formatVars(typographyVars)}

  /* Spacing */
${formatVars(spacingVars)}

  /* Border Radius */
${formatVars(radiusVars)}

  /* Shadows */
${formatVars(shadowVars)}

  /* Animation */
${formatVars(animationVars)}
}

.dark {
  /* Dark Mode Colors */
${formatVars(darkVars)}
}
`;
}
