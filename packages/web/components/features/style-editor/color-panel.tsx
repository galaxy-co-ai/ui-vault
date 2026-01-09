"use client";

import { useState } from "react";
import type { StyleCollection } from "@/lib/schemas/style.schema";

interface ColorPanelProps {
  colors: StyleCollection["colors"];
  onChange: (colors: StyleCollection["colors"]) => void;
}

type ColorMode = "light" | "dark";

export function ColorPanel({ colors, onChange }: ColorPanelProps) {
  const [mode, setMode] = useState<ColorMode>("dark");
  const currentColors = colors[mode];

  const updateColor = (
    group: "gray" | "accent" | "semantic",
    key: string,
    value: string
  ) => {
    const updated = {
      ...colors,
      [mode]: {
        ...colors[mode],
        [group]: {
          ...colors[mode][group],
          [key]: value,
        },
      },
    };
    onChange(updated);
  };

  const grayKeys = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;
  const accentKeys = ["subtle", "muted", "default", "emphasis", "text"] as const;
  const semanticKeys = [
    "success", "successMuted",
    "warning", "warningMuted",
    "error", "errorMuted",
    "info", "infoMuted",
  ] as const;

  return (
    <div className="space-y-8">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("light")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "light"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/50"
          }`}
        >
          Light Mode
        </button>
        <button
          onClick={() => setMode("dark")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "dark"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/50"
          }`}
        >
          Dark Mode
        </button>
      </div>

      {/* Gray scale */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Gray Scale</h3>
        <div className="grid grid-cols-6 gap-3">
          {grayKeys.map((key) => (
            <div key={key} className="space-y-2">
              <div
                className="aspect-square rounded-md border border-border"
                style={{ backgroundColor: currentColors.gray[key] }}
              />
              <div className="text-center">
                <div className="text-xs text-muted-foreground">{key}</div>
                <input
                  type="color"
                  value={currentColors.gray[key]}
                  onChange={(e) => updateColor("gray", key, e.target.value)}
                  className="h-6 w-full cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accent colors */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Accent Colors</h3>
        <div className="grid grid-cols-5 gap-3">
          {accentKeys.map((key) => (
            <div key={key} className="space-y-2">
              <div
                className="aspect-square rounded-md border border-border"
                style={{ backgroundColor: currentColors.accent[key] }}
              />
              <div className="text-center">
                <div className="text-xs capitalize text-muted-foreground">
                  {key}
                </div>
                <input
                  type="color"
                  value={currentColors.accent[key]}
                  onChange={(e) => updateColor("accent", key, e.target.value)}
                  className="h-6 w-full cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Semantic colors */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Semantic Colors</h3>
        <div className="grid grid-cols-4 gap-3">
          {semanticKeys.map((key) => (
            <div key={key} className="space-y-2">
              <div
                className="aspect-square rounded-md border border-border"
                style={{ backgroundColor: currentColors.semantic[key] }}
              />
              <div className="text-center">
                <div className="truncate text-xs capitalize text-muted-foreground">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
                <input
                  type="color"
                  value={currentColors.semantic[key]}
                  onChange={(e) => updateColor("semantic", key, e.target.value)}
                  className="h-6 w-full cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
