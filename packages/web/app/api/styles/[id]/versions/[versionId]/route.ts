import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { logger } from "@/lib/logger";

// GET /api/styles/[id]/versions/[versionId] - Get a specific version
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const { id, versionId } = await params;

    const version = await prisma.styleVersion.findUnique({
      where: { id: versionId },
    });

    if (!version || version.styleId !== id) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    return NextResponse.json(version);
  } catch (error) {
    logger.error("Error fetching version:", error);
    return NextResponse.json(
      { error: "Failed to fetch version" },
      { status: 500 }
    );
  }
}

// POST /api/styles/[id]/versions/[versionId]/restore - Restore a version
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const { id, versionId } = await params;

    // Get the version to restore
    const version = await prisma.styleVersion.findUnique({
      where: { id: versionId },
    });

    if (!version || version.styleId !== id) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    // First, create a snapshot of the current state before restoring
    const currentStyle = await prisma.style.findUnique({
      where: { id },
    });

    if (!currentStyle) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    // Get the next version number for the backup
    const lastVersion = await prisma.styleVersion.findFirst({
      where: { styleId: id },
      orderBy: { versionNumber: "desc" },
      select: { versionNumber: true },
    });

    const nextVersionNumber = (lastVersion?.versionNumber || 0) + 1;

    // Create a backup of current state
    await prisma.styleVersion.create({
      data: {
        styleId: id,
        versionNumber: nextVersionNumber,
        name: currentStyle.name,
        colorsLight: currentStyle.colorsLight,
        colorsDark: currentStyle.colorsDark,
        typography: currentStyle.typography,
        spacing: currentStyle.spacing,
        borderRadius: currentStyle.borderRadius,
        shadows: currentStyle.shadows,
        animation: currentStyle.animation,
        changeNote: `Backup before restoring to v${version.versionNumber}`,
      },
    });

    // Restore the style to the selected version
    const restoredStyle = await prisma.style.update({
      where: { id },
      data: {
        name: version.name,
        colorsLight: version.colorsLight,
        colorsDark: version.colorsDark,
        typography: version.typography,
        spacing: version.spacing,
        borderRadius: version.borderRadius,
        shadows: version.shadows,
        animation: version.animation,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: `Restored to version ${version.versionNumber}`,
      style: restoredStyle,
    });
  } catch (error) {
    logger.error("Error restoring version:", error);
    return NextResponse.json(
      { error: "Failed to restore version" },
      { status: 500 }
    );
  }
}

// DELETE /api/styles/[id]/versions/[versionId] - Delete a specific version
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const { id, versionId } = await params;

    const version = await prisma.styleVersion.findUnique({
      where: { id: versionId },
      select: { id: true, styleId: true },
    });

    if (!version || version.styleId !== id) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    await prisma.styleVersion.delete({
      where: { id: versionId },
    });

    return NextResponse.json({ message: "Version deleted" });
  } catch (error) {
    logger.error("Error deleting version:", error);
    return NextResponse.json(
      { error: "Failed to delete version" },
      { status: 500 }
    );
  }
}
