"use client";

import { useState } from "react";
import { Sun, Moon, Columns } from "lucide-react";
import type { StyleCollection } from "@/lib/schemas/style.schema";

interface PreviewPanelProps {
  style: StyleCollection;
}

type PreviewMode = "light" | "dark" | "split";

export function PreviewPanel({ style }: PreviewPanelProps) {
  const [mode, setMode] = useState<PreviewMode>("dark");

  const renderPreview = (colorMode: "light" | "dark") => {
    const colors = style.colors[colorMode];
    const { typography, borderRadius, shadows } = style;

    return (
      <div
        className="space-y-4 p-4"
        style={{
          backgroundColor: colors.gray[colorMode === "dark" ? 950 : 50],
          color: colors.gray[colorMode === "dark" ? 100 : 900],
          fontFamily: typography.fontFamily.sans,
        }}
      >
        {/* Typography preview */}
        <div className="space-y-2">
          <h4
            style={{
              fontSize: typography.fontSize.lg[0],
              fontWeight: typography.fontWeight.semibold,
              lineHeight: typography.fontSize.lg[1].lineHeight,
            }}
          >
            Heading Text
          </h4>
          <p
            style={{
              fontSize: typography.fontSize.base[0],
              lineHeight: typography.fontSize.base[1].lineHeight,
              color: colors.gray[colorMode === "dark" ? 400 : 600],
            }}
          >
            This is body text using the base font size and color from your design system.
          </p>
        </div>

        {/* Button preview */}
        <div className="flex gap-2">
          <button
            style={{
              backgroundColor: colors.accent.default,
              color: colors.gray[50],
              borderRadius: borderRadius.md,
              padding: "8px 16px",
              fontSize: typography.fontSize.sm[0],
              fontWeight: typography.fontWeight.medium,
              boxShadow: shadows.sm,
            }}
          >
            Primary
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              color: colors.gray[colorMode === "dark" ? 300 : 700],
              border: `1px solid ${colors.gray[colorMode === "dark" ? 700 : 300]}`,
              borderRadius: borderRadius.md,
              padding: "8px 16px",
              fontSize: typography.fontSize.sm[0],
              fontWeight: typography.fontWeight.medium,
            }}
          >
            Secondary
          </button>
        </div>

        {/* Card preview */}
        <div
          style={{
            backgroundColor: colors.gray[colorMode === "dark" ? 900 : 100],
            borderRadius: borderRadius.lg,
            padding: "16px",
            boxShadow: shadows.md,
          }}
        >
          <h5
            style={{
              fontSize: typography.fontSize.md[0],
              fontWeight: typography.fontWeight.medium,
              marginBottom: "8px",
            }}
          >
            Card Title
          </h5>
          <p
            style={{
              fontSize: typography.fontSize.sm[0],
              color: colors.gray[colorMode === "dark" ? 400 : 600],
            }}
          >
            Card content with muted text color.
          </p>
        </div>

        {/* Semantic colors preview */}
        <div className="flex gap-2">
          {(["success", "warning", "error", "info"] as const).map((type) => (
            <div
              key={type}
              style={{
                backgroundColor: colors.semantic[`${type}Muted`],
                color: colors.semantic[type],
                borderRadius: borderRadius.DEFAULT,
                padding: "4px 8px",
                fontSize: typography.fontSize.xs[0],
                fontWeight: typography.fontWeight.medium,
              }}
            >
              {type}
            </div>
          ))}
        </div>

        {/* Input preview */}
        <div>
          <input
            type="text"
            placeholder="Input field"
            style={{
              width: "100%",
              backgroundColor: colors.gray[colorMode === "dark" ? 900 : 100],
              border: `1px solid ${colors.gray[colorMode === "dark" ? 700 : 300]}`,
              borderRadius: borderRadius.md,
              padding: "8px 12px",
              fontSize: typography.fontSize.sm[0],
              color: colors.gray[colorMode === "dark" ? 100 : 900],
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {/* Mode toggle */}
      <div className="sticky top-0 z-10 flex justify-center gap-1 border-b border-border bg-muted/50 p-2">
        <button
          onClick={() => setMode("light")}
          className={`rounded-md p-2 ${
            mode === "light" ? "bg-background shadow-sm" : "text-muted-foreground"
          }`}
          title="Light mode"
        >
          <Sun className="h-4 w-4" />
        </button>
        <button
          onClick={() => setMode("dark")}
          className={`rounded-md p-2 ${
            mode === "dark" ? "bg-background shadow-sm" : "text-muted-foreground"
          }`}
          title="Dark mode"
        >
          <Moon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setMode("split")}
          className={`rounded-md p-2 ${
            mode === "split" ? "bg-background shadow-sm" : "text-muted-foreground"
          }`}
          title="Split view"
        >
          <Columns className="h-4 w-4" />
        </button>
      </div>

      {/* Preview content */}
      {mode === "split" ? (
        <div className="grid grid-cols-2">
          <div className="border-r border-border">
            <div className="px-2 py-1 text-center text-xs text-muted-foreground">
              Light
            </div>
            {renderPreview("light")}
          </div>
          <div>
            <div className="px-2 py-1 text-center text-xs text-muted-foreground">
              Dark
            </div>
            {renderPreview("dark")}
          </div>
        </div>
      ) : (
        renderPreview(mode)
      )}
    </div>
  );
}
