"use client";

import { useState, useEffect } from "react";
import {
  History,
  RotateCcw,
  ChevronRight,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { logger } from "@/lib/logger";

interface StyleVersion {
  id: string;
  versionNumber: number;
  name: string;
  changeNote: string | null;
  createdAt: string;
}

interface VersionHistoryProps {
  styleId: string;
  onRestore: () => void;
}

export function VersionHistory({ styleId, onRestore }: VersionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [versions, setVersions] = useState<StyleVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchVersions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/styles/${styleId}/versions`);
      if (!response.ok) throw new Error("Failed to fetch versions");
      const data = await response.json();
      setVersions(data);
    } catch (err) {
      logger.error("Error fetching versions:", err);
      setError("Failed to load version history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen, styleId]);

  const handleRestore = async (versionId: string) => {
    if (!confirm("Are you sure you want to restore this version? Your current changes will be backed up.")) {
      return;
    }

    setRestoringId(versionId);
    try {
      const response = await fetch(
        `/api/styles/${styleId}/versions/${versionId}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("Failed to restore version");

      // Refresh the page to show restored content
      onRestore();
    } catch (err) {
      logger.error("Error restoring version:", err);
      setError("Failed to restore version");
    } finally {
      setRestoringId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="border-t border-border">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 hover:bg-accent/50"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-muted-foreground" />
          <div className="text-left">
            <h3 className="font-medium">Version History</h3>
            <p className="text-sm text-muted-foreground">
              {versions.length > 0
                ? `${versions.length} saved version${versions.length !== 1 ? "s" : ""}`
                : "View and restore previous versions"}
            </p>
          </div>
        </div>
        <ChevronRight
          className={`h-5 w-5 text-muted-foreground transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Version List */}
      {isOpen && (
        <div className="border-t border-border">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {!isLoading && !error && versions.length === 0 && (
            <div className="p-8 text-center">
              <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No versions saved yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Versions are created automatically when you save
              </p>
            </div>
          )}

          {!isLoading && !error && versions.length > 0 && (
            <div className="max-h-80 overflow-auto">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between border-b border-border p-4 last:border-b-0 hover:bg-accent/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      v{version.versionNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{version.name}</span>
                        {index === 0 && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(version.createdAt)}
                        {version.changeNote && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[200px]">
                              {version.changeNote}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Restore button - don't show for latest version */}
                  {index > 0 && (
                    <button
                      onClick={() => handleRestore(version.id)}
                      disabled={restoringId !== null}
                      className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-50"
                    >
                      {restoringId === version.id ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Restoring...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-3 w-3" />
                          Restore
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Create Version Button */}
          <div className="border-t border-border p-4">
            <CreateVersionButton
              styleId={styleId}
              onCreated={fetchVersions}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Create Version Button
interface CreateVersionButtonProps {
  styleId: string;
  onCreated: () => void;
}

function CreateVersionButton({ styleId, onCreated }: CreateVersionButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const response = await fetch(`/api/styles/${styleId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changeNote: note || undefined }),
      });

      if (!response.ok) throw new Error("Failed to create version");

      setNote("");
      setShowNoteInput(false);
      onCreated();
    } catch (err) {
      logger.error("Error creating version:", err);
    } finally {
      setIsCreating(false);
    }
  };

  if (showNoteInput) {
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Version note (optional)"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Snapshot"
            )}
          </button>
          <button
            onClick={() => setShowNoteInput(false)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowNoteInput(true)}
      className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-dashed border-muted-foreground/50 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <History className="h-4 w-4" />
      Create Version Snapshot
    </button>
  );
}
