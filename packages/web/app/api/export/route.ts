import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { generateTailwindConfig } from "@/lib/exporters/tailwind";
import { generateCSSVariables } from "@/lib/exporters/css";
import { generateJSONTokens } from "@/lib/exporters/json";
import type { StyleCollection } from "@/lib/schemas/style.schema";

const formatSchema = {
  tailwind: {
    generator: generateTailwindConfig,
    extension: "ts",
    contentType: "text/typescript",
    suffix: "tailwind.config",
  },
  css: {
    generator: generateCSSVariables,
    extension: "css",
    contentType: "text/css",
    suffix: "variables",
  },
  json: {
    generator: generateJSONTokens,
    extension: "json",
    contentType: "application/json",
    suffix: "tokens",
  },
} as const;

type ExportFormat = keyof typeof formatSchema;

// POST /api/export - Generate export file
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { styleId, format } = body as { styleId: string; format: string };

    if (!styleId || !format) {
      return NextResponse.json(
        { error: "styleId and format are required" },
        { status: 400 }
      );
    }

    if (!(format in formatSchema)) {
      return NextResponse.json(
        { error: `Invalid format. Must be one of: ${Object.keys(formatSchema).join(", ")}` },
        { status: 400 }
      );
    }

    const style = await prisma.style.findUnique({
      where: { id: styleId },
      include: { tags: { include: { tag: true } } },
    });

    if (!style) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    // Transform to StyleCollection format
    const styleCollection: StyleCollection = {
      id: style.id,
      name: style.name,
      description: style.description ?? undefined,
      tags: style.tags.map((t) => t.tag.name),
      colors: {
        light: style.colorsLight as StyleCollection["colors"]["light"],
        dark: style.colorsDark as StyleCollection["colors"]["dark"],
      },
      typography: style.typography as StyleCollection["typography"],
      spacing: style.spacing as StyleCollection["spacing"],
      borderRadius: style.borderRadius as StyleCollection["borderRadius"],
      shadows: style.shadows as StyleCollection["shadows"],
      animation: style.animation as StyleCollection["animation"],
      thumbnail: style.thumbnail ?? undefined,
      isFavorite: style.isFavorite,
      usageCount: style.usageCount,
      createdAt: style.createdAt.toISOString(),
      updatedAt: style.updatedAt.toISOString(),
      lastUsedAt: style.lastUsedAt?.toISOString(),
    };

    const formatConfig = formatSchema[format as ExportFormat];
    const content = formatConfig.generator(styleCollection);
    const slugName = style.name.toLowerCase().replace(/\s+/g, "-");
    const filename = `${slugName}-${formatConfig.suffix}.${formatConfig.extension}`;

    return new NextResponse(content, {
      headers: {
        "Content-Type": formatConfig.contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Failed to generate export:", error);
    return NextResponse.json(
      { error: "Failed to generate export" },
      { status: 500 }
    );
  }
}
