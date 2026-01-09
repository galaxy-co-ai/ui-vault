import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { CreateStyleInputSchema } from "@/lib/schemas/style.schema";
import { logger } from "@/lib/logger";

// GET /api/styles - List all styles with optional filtering
export async function GET(request: NextRequest) {
  // Return empty array if database is not configured
  if (!process.env.DATABASE_URL) {
    return NextResponse.json([]);
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const favorite = searchParams.get("favorite");
    const tag = searchParams.get("tag");

    const styles = await prisma.style.findMany({
      where: {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(favorite === "true" && { isFavorite: true }),
        ...(tag && { tags: { some: { tag: { name: tag } } } }),
      },
      include: {
        tags: {
          include: { tag: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Transform to match frontend schema
    const transformed = styles.map((style: (typeof styles)[number]) => ({
      id: style.id,
      name: style.name,
      description: style.description,
      tags: style.tags.map((t: { tag: { name: string } }) => t.tag.name),
      colors: {
        light: style.colorsLight,
        dark: style.colorsDark,
      },
      typography: style.typography,
      spacing: style.spacing,
      borderRadius: style.borderRadius,
      shadows: style.shadows,
      animation: style.animation,
      thumbnail: style.thumbnail,
      isFavorite: style.isFavorite,
      usageCount: style.usageCount,
      createdAt: style.createdAt.toISOString(),
      updatedAt: style.updatedAt.toISOString(),
      lastUsedAt: style.lastUsedAt?.toISOString(),
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    logger.error("Failed to fetch styles", error);
    return NextResponse.json(
      { error: "Failed to fetch styles" },
      { status: 500 }
    );
  }
}

// POST /api/styles - Create a new style
export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = CreateStyleInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { tags, colors, ...styleData } = parsed.data;

    const style = await prisma.style.create({
      data: {
        ...styleData,
        colorsLight: colors.light,
        colorsDark: colors.dark,
        tags: {
          create: tags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
      include: {
        tags: { include: { tag: true } },
      },
    });

    const transformed = {
      id: style.id,
      name: style.name,
      description: style.description,
      tags: style.tags.map((t: { tag: { name: string } }) => t.tag.name),
      colors: {
        light: style.colorsLight,
        dark: style.colorsDark,
      },
      typography: style.typography,
      spacing: style.spacing,
      borderRadius: style.borderRadius,
      shadows: style.shadows,
      animation: style.animation,
      thumbnail: style.thumbnail,
      isFavorite: style.isFavorite,
      usageCount: style.usageCount,
      createdAt: style.createdAt.toISOString(),
      updatedAt: style.updatedAt.toISOString(),
      lastUsedAt: style.lastUsedAt?.toISOString(),
    };

    return NextResponse.json(transformed, { status: 201 });
  } catch (error) {
    logger.error("Failed to create style", error);
    return NextResponse.json(
      { error: "Failed to create style" },
      { status: 500 }
    );
  }
}
