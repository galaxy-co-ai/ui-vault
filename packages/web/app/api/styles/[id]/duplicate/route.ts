import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/styles/[id]/duplicate - Duplicate a style
export async function POST(_request: NextRequest, { params }: RouteParams) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const { id } = await params;

    const original = await prisma.style.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
      },
    });

    if (!original) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    // Create duplicate with "(Copy)" suffix
    const duplicate = await prisma.style.create({
      data: {
        name: `${original.name} (Copy)`,
        description: original.description,
        colorsLight: original.colorsLight as object,
        colorsDark: original.colorsDark as object,
        typography: original.typography as object,
        spacing: original.spacing as object,
        borderRadius: original.borderRadius as object,
        shadows: original.shadows as object,
        animation: original.animation as object,
        thumbnail: original.thumbnail,
        isFavorite: false,
        usageCount: 0,
        tags: {
          create: original.tags.map((t: { tagId: string }) => ({
            tag: { connect: { id: t.tagId } },
          })),
        },
      },
      include: {
        tags: { include: { tag: true } },
      },
    });

    const transformed = {
      id: duplicate.id,
      name: duplicate.name,
      description: duplicate.description,
      tags: duplicate.tags.map((t: { tag: { name: string } }) => t.tag.name),
      colors: {
        light: duplicate.colorsLight,
        dark: duplicate.colorsDark,
      },
      typography: duplicate.typography,
      spacing: duplicate.spacing,
      borderRadius: duplicate.borderRadius,
      shadows: duplicate.shadows,
      animation: duplicate.animation,
      thumbnail: duplicate.thumbnail,
      isFavorite: duplicate.isFavorite,
      usageCount: duplicate.usageCount,
      createdAt: duplicate.createdAt.toISOString(),
      updatedAt: duplicate.updatedAt.toISOString(),
      lastUsedAt: duplicate.lastUsedAt?.toISOString(),
    };

    return NextResponse.json(transformed, { status: 201 });
  } catch (error) {
    console.error("Failed to duplicate style:", error);
    return NextResponse.json(
      { error: "Failed to duplicate style" },
      { status: 500 }
    );
  }
}
