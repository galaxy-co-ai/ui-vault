"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStyleStore, useUIStore } from "@/stores";
import { StyleEditor } from "@/components/features/style-editor";
import { ExportDialog } from "@/components/features/export-dialog";
import { ArrowLeft, Download, Copy, Trash2, Heart } from "lucide-react";
import Link from "next/link";
import type { StyleCollection } from "@/lib/schemas/style.schema";

export default function StyleEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { styles, updateStyle, deleteStyle, duplicateStyle, toggleFavorite } =
    useStyleStore();
  const { openExportDialog, exportDialogOpen, closeExportDialog, exportStyleId } =
    useUIStore();

  const [style, setStyle] = useState<StyleCollection | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Find the style from store
  useEffect(() => {
    const found = styles.find((s) => s.id === id);
    if (found) {
      setStyle(found);
    }
  }, [styles, id]);

  // Fetch if not in store
  useEffect(() => {
    if (!style && styles.length > 0) {
      // Style not found, redirect
      router.push("/dashboard");
    }
  }, [style, styles, router]);

  const handleSave = async () => {
    if (!style || !hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      await updateStyle(id, style);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this style?")) return;

    setIsDeleting(true);
    try {
      await deleteStyle(id);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete:", error);
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const duplicate = await duplicateStyle(id);
      router.push(`/dashboard/styles/${duplicate.id}`);
    } catch (error) {
      console.error("Failed to duplicate:", error);
    }
  };

  const handleStyleChange = (updates: Partial<StyleCollection>) => {
    if (!style) return;
    setStyle({ ...style, ...updates });
    setHasUnsavedChanges(true);
  };

  if (!style) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <input
              type="text"
              value={style.name}
              onChange={(e) => handleStyleChange({ name: e.target.value })}
              className="bg-transparent text-lg font-semibold focus:outline-none"
            />
            {hasUnsavedChanges && (
              <span className="ml-2 text-xs text-muted-foreground">
                (unsaved changes)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(id)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent ${
              style.isFavorite ? "text-red-500" : "text-muted-foreground"
            }`}
            title={style.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-4 w-4 ${style.isFavorite ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleDuplicate}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </button>

          <button
            onClick={() => openExportDialog(id)}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Download className="h-4 w-4" />
            Export
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <StyleEditor style={style} onChange={handleStyleChange} />
      </div>

      {/* Export Dialog */}
      {exportDialogOpen && exportStyleId === id && (
        <ExportDialog styleId={id} onClose={closeExportDialog} />
      )}
    </div>
  );
}
