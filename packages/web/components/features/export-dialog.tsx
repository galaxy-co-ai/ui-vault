"use client";

import { useState } from "react";
import { useUIStore, useStyleById } from "@/stores";
import { X, Download, FileCode, FileJson, FileText, Check } from "lucide-react";

interface ExportDialogProps {
  styleId: string;
  onClose: () => void;
}

const formats = [
  {
    id: "tailwind",
    label: "Tailwind Config",
    description: "TypeScript configuration file for Tailwind CSS",
    icon: FileCode,
    extension: ".ts",
  },
  {
    id: "css",
    label: "CSS Variables",
    description: "CSS custom properties for use in any project",
    icon: FileText,
    extension: ".css",
  },
  {
    id: "json",
    label: "JSON Tokens",
    description: "Design tokens in standard JSON format",
    icon: FileJson,
    extension: ".json",
  },
] as const;

export function ExportDialog({ styleId, onClose }: ExportDialogProps) {
  const style = useStyleById(styleId);
  const { exportFormat, setExportFormat } = useUIStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ styleId, format: exportFormat }),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] ?? `export.${exportFormat}`;

      // Download the file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExported(true);
      setTimeout(() => setExported(false), 2000);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!style) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-lg border border-border bg-card shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">Export Style</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="mb-4 text-sm text-muted-foreground">
            Export <span className="font-medium text-foreground">{style.name}</span> as:
          </p>

          {/* Format options */}
          <div className="space-y-2">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setExportFormat(format.id)}
                className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                  exportFormat === format.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-accent"
                }`}
              >
                <format.icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{format.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {format.extension}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {format.description}
                  </p>
                </div>
                {exportFormat === format.id && (
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {exported ? (
              <>
                <Check className="h-4 w-4" />
                Downloaded!
              </>
            ) : isExporting ? (
              "Exporting..."
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
