"use client";

import { use, useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStyleStore, useUIStore } from "@/stores";
import { StyleEditor } from "@/components/features/style-editor";
import { ExportDialog } from "@/components/features/export-dialog";
import { logger } from "@/lib/logger";
import { toast } from "@/lib/hooks/use-toast";
import { ArrowLeft, Download, Copy, Trash2, Heart, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import type { StyleCollection } from "@/lib/schemas/style.schema";

// Auto-save delay in milliseconds
const AUTO_SAVE_DELAY = 2000;

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
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Refs for auto-save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingStyleRef = useRef<StyleCollection | null>(null);

  // Find the style from store and redirect if not found
  useEffect(() => {
    const found = styles.find((s) => s.id === id);
    if (found) {
      setStyle(found);
    } else if (styles.length > 0) {
      // Style not found in a populated store, redirect
      router.push("/dashboard");
    }
  }, [styles, id, router]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Auto-save function
  const performSave = useCallback(async (styleToSave: StyleCollection) => {
    setSaveStatus("saving");
    try {
      await updateStyle(id, styleToSave);
      setHasUnsavedChanges(false);
      setSaveStatus("saved");
      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      logger.error("Auto-save failed", error);
      setSaveStatus("error");
      toast.error("Save failed", "Your changes couldn't be saved. Please try again.");
    }
  }, [id, updateStyle]);

  // Schedule auto-save
  const scheduleAutoSave = useCallback((updatedStyle: StyleCollection) => {
    pendingStyleRef.current = updatedStyle;
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Schedule new save
    saveTimeoutRef.current = setTimeout(() => {
      if (pendingStyleRef.current) {
        performSave(pendingStyleRef.current);
        pendingStyleRef.current = null;
      }
    }, AUTO_SAVE_DELAY);
  }, [performSave]);

  const handleSaveNow = async () => {
    if (!style || !hasUnsavedChanges) return;
    
    // Cancel any pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    
    await performSave(style);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this style?")) return;

    setIsDeleting(true);
    try {
      await deleteStyle(id);
      toast.success("Style deleted", "The style has been permanently removed.");
      router.push("/dashboard");
    } catch (error) {
      logger.error("Failed to delete", error);
      toast.error("Delete failed", "Something went wrong. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const duplicate = await duplicateStyle(id);
      toast.success("Style duplicated", `Created "${duplicate.name}"`);
      router.push(`/dashboard/styles/${duplicate.id}`);
    } catch (error) {
      logger.error("Failed to duplicate", error);
      toast.error("Duplicate failed", "Something went wrong. Please try again.");
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(id);
      if (style) {
        toast.success(
          style.isFavorite ? "Removed from favorites" : "Added to favorites"
        );
      }
    } catch (error) {
      logger.error("Failed to toggle favorite", error);
    }
  };

  const handleStyleChange = (updates: Partial<StyleCollection>) => {
    if (!style) return;
    const updatedStyle = { ...style, ...updates };
    setStyle(updatedStyle);
    setHasUnsavedChanges(true);
    setSaveStatus("idle");
    scheduleAutoSave(updatedStyle);
  };

  const handleVersionRestore = () => {
    toast.success("Version restored", "The style has been restored to the selected version.");
    // Reload the page to fetch the restored version
    window.location.reload();
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
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={style.name}
              onChange={(e) => handleStyleChange({ name: e.target.value })}
              className="bg-transparent text-lg font-semibold focus:outline-none"
            />
            {/* Save Status Indicator */}
            <SaveStatusIndicator status={saveStatus} hasUnsavedChanges={hasUnsavedChanges} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFavorite}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent ${
              style.isFavorite ? "text-red-500" : "text-muted-foreground"
            }`}
            title={style.isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={style.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-4 w-4 ${style.isFavorite ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleDuplicate}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="Duplicate"
            aria-label="Duplicate style"
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
            aria-label="Delete style"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            onClick={handleSaveNow}
            disabled={!hasUnsavedChanges || saveStatus === "saving"}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Now"
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <StyleEditor
          style={style}
          onChange={handleStyleChange}
          onVersionRestore={handleVersionRestore}
        />
      </div>

      {/* Export Dialog */}
      {exportDialogOpen && exportStyleId === id && (
        <ExportDialog styleId={id} onClose={closeExportDialog} />
      )}
    </div>
  );
}

// Save Status Indicator Component
interface SaveStatusIndicatorProps {
  status: "idle" | "saving" | "saved" | "error";
  hasUnsavedChanges: boolean;
}

function SaveStatusIndicator({ status, hasUnsavedChanges }: SaveStatusIndicatorProps) {
  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving...
      </span>
    );
  }

  if (status === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
        <Check className="h-3 w-3" />
        Saved
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="text-xs text-red-600 dark:text-red-400">
        Save failed - click Save Now to retry
      </span>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <span className="text-xs text-muted-foreground">
        Auto-saving...
      </span>
    );
  }

  return null;
}