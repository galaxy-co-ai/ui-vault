import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { UpdateStyleInputSchema } from "@/lib/schemas/style.schema";
import { logger } from "@/lib/logger";

type RouteParams = { params: Promise<{ id: string }> };

const dbNotConfigured = () =>
  NextResponse.json({ error: "Database not configured" }, { status: 503 });

// GET /api/styles/[id] - Get a single style
export async function GET(_request: NextRequest, { params }: RouteParams) {
  if (!process.env.DATABASE_URL) return dbNotConfigured();

  try {
    const { id } = await params;

    const style = await prisma.style.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
      },
    });

    if (!style) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    // Increment usage count and update lastUsedAt
    await prisma.style.update({
      where: { id },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date(),
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
      usageCount: style.usageCount + 1,
      createdAt: style.createdAt.toISOString(),
      updatedAt: style.updatedAt.toISOString(),
      lastUsedAt: new Date().toISOString(),
    };

    return NextResponse.json(transformed);
  } catch (error) {
    logger.error("Failed to fetch style", error);
    return NextResponse.json(
      { error: "Failed to fetch style" },
      { status: 500 }
    );
  }
}

// PUT /api/styles/[id] - Update a style
export async function PUT(request: NextRequest, { params }: RouteParams) {
  if (!process.env.DATABASE_URL) return dbNotConfigured();

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateStyleInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.style.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    const { tags, colors, ...updateData } = parsed.data;

    // Build update object
    const data: Record<string, unknown> = { ...updateData };
    if (colors) {
      if (colors.light) data.colorsLight = colors.light;
      if (colors.dark) data.colorsDark = colors.dark;
    }

    // Update style
    await prisma.style.update({
      where: { id },
      data,
    });

    // Update tags if provided
    if (tags !== undefined) {
      // Remove existing tags
      await prisma.styleTag.deleteMany({ where: { styleId: id } });

      // Add new tags
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          create: { name: tagName },
          update: {},
        });
        await prisma.styleTag.create({
          data: { styleId: id, tagId: tag.id },
        });
      }
    }

    // Fetch updated style with tags
    const updated = await prisma.style.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });

    const transformed = {
      id: updated!.id,
      name: updated!.name,
      description: updated!.description,
      tags: updated!.tags.map((t: { tag: { name: string } }) => t.tag.name),
      colors: {
        light: updated!.colorsLight,
        dark: updated!.colorsDark,
      },
      typography: updated!.typography,
      spacing: updated!.spacing,
      borderRadius: updated!.borderRadius,
      shadows: updated!.shadows,
      animation: updated!.animation,
      thumbnail: updated!.thumbnail,
      isFavorite: updated!.isFavorite,
      usageCount: updated!.usageCount,
      createdAt: updated!.createdAt.toISOString(),
      updatedAt: updated!.updatedAt.toISOString(),
      lastUsedAt: updated!.lastUsedAt?.toISOString(),
    };

    return NextResponse.json(transformed);
  } catch (error) {
    logger.error("Failed to update style", error);
    return NextResponse.json(
      { error: "Failed to update style" },
      { status: 500 }
    );
  }
}

// DELETE /api/styles/[id] - Delete a style
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  if (!process.env.DATABASE_URL) return dbNotConfigured();

  try {
    const { id } = await params;

    const existing = await prisma.style.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    await prisma.style.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error("Failed to delete style", error);
    return NextResponse.json(
      { error: "Failed to delete style" },
      { status: 500 }
    );
  }
}
