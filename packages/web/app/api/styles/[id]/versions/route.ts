import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { logger } from "@/lib/logger";

// GET /api/styles/[id]/versions - Get version history for a style
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // Check if style exists
    const style = await prisma.style.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!style) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    // Get versions ordered by creation date (newest first)
    const versions = await prisma.styleVersion.findMany({
      where: { styleId: id },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        versionNumber: true,
        name: true,
        changeNote: true,
        createdAt: true,
      },
    });

    return NextResponse.json(versions);
  } catch (error) {
    logger.error("Error fetching versions:", error);
    return NextResponse.json(
      { error: "Failed to fetch versions" },
      { status: 500 }
    );
  }
}

// POST /api/styles/[id]/versions - Create a new version snapshot
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { changeNote } = body;

    // Get the current style
    const style = await prisma.style.findUnique({
      where: { id },
    });

    if (!style) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    // Get the next version number
    const lastVersion = await prisma.styleVersion.findFirst({
      where: { styleId: id },
      orderBy: { versionNumber: "desc" },
      select: { versionNumber: true },
    });

    const nextVersionNumber = (lastVersion?.versionNumber || 0) + 1;

    // Create the version snapshot
    const version = await prisma.styleVersion.create({
      data: {
        styleId: id,
        versionNumber: nextVersionNumber,
        name: style.name,
        colorsLight: style.colorsLight,
        colorsDark: style.colorsDark,
        typography: style.typography,
        spacing: style.spacing,
        borderRadius: style.borderRadius,
        shadows: style.shadows,
        animation: style.animation,
        changeNote: changeNote || null,
      },
      select: {
        id: true,
        versionNumber: true,
        name: true,
        changeNote: true,
        createdAt: true,
      },
    });

    // Clean up old versions (keep only last 20)
    const versionsToDelete = await prisma.styleVersion.findMany({
      where: { styleId: id },
      orderBy: { createdAt: "desc" },
      skip: 20,
      select: { id: true },
    });

    if (versionsToDelete.length > 0) {
      await prisma.styleVersion.deleteMany({
        where: {
          id: { in: versionsToDelete.map((v) => v.id) },
        },
      });
    }

    return NextResponse.json(version, { status: 201 });
  } catch (error) {
    logger.error("Error creating version:", error);
    return NextResponse.json(
      { error: "Failed to create version" },
      { status: 500 }
    );
  }
}
