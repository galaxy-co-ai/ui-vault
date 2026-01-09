import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { logger } from "@/lib/logger";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/styles/[id]/favorite - Toggle favorite status
export async function PATCH(_request: NextRequest, { params }: RouteParams) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const { id } = await params;

    const existing = await prisma.style.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    const updated = await prisma.style.update({
      where: { id },
      data: { isFavorite: !existing.isFavorite },
      include: {
        tags: { include: { tag: true } },
      },
    });

    const transformed = {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      tags: updated.tags.map((t: { tag: { name: string } }) => t.tag.name),
      colors: {
        light: updated.colorsLight,
        dark: updated.colorsDark,
      },
      typography: updated.typography,
      spacing: updated.spacing,
      borderRadius: updated.borderRadius,
      shadows: updated.shadows,
      animation: updated.animation,
      thumbnail: updated.thumbnail,
      isFavorite: updated.isFavorite,
      usageCount: updated.usageCount,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      lastUsedAt: updated.lastUsedAt?.toISOString(),
    };

    return NextResponse.json(transformed);
  } catch (error) {
    logger.error("Failed to toggle favorite", error);
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}
