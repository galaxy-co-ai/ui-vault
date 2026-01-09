"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, Palette, Copy, ChevronDown } from "lucide-react";
import type { StyleCollection } from "@/lib/schemas/style.schema";
import {
  generatePaletteFromSeed,
  generateAccentShades,
  generateDarkAccentShades,
  generateGrayScale,
  PALETTE_PRESETS,
  type PalettePreset,
} from "@/lib/color-generator";

interface ColorPanelProps {
  colors: StyleCollection["colors"];
  onChange: (colors: StyleCollection["colors"]) => void;
}

type ColorMode = "light" | "dark";

export function ColorPanel({ colors, onChange }: ColorPanelProps) {
  const [mode, setMode] = useState<ColorMode>("dark");
  const [showGenerator, setShowGenerator] = useState(false);
  const [seedColor, setSeedColor] = useState(colors.light.accent.default);
  const [applyToDarkMode, setApplyToDarkMode] = useState(true);
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
          [key]: value.toUpperCase(),
        },
      },
    };
    onChange(updated);
  };

  const handleGeneratePalette = () => {
    const generated = generatePaletteFromSeed(seedColor);

    if (applyToDarkMode) {
      onChange({
        light: generated.light,
        dark: generated.dark,
      });
    } else {
      onChange({
        ...colors,
        [mode]: generated[mode],
      });
    }
  };

  const handleGenerateFromAccent = () => {
    const newAccent =
      mode === "light"
        ? generateAccentShades(seedColor)
        : generateDarkAccentShades(seedColor);

    onChange({
      ...colors,
      [mode]: {
        ...colors[mode],
        accent: newAccent,
      },
    });
  };

  const handleApplyPreset = (preset: PalettePreset) => {
    setSeedColor(PALETTE_PRESETS[preset]);
    const generated = generatePaletteFromSeed(PALETTE_PRESETS[preset]);
    onChange({
      light: generated.light,
      dark: generated.dark,
    });
    setShowGenerator(false);
  };

  const grayKeys = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "950",
  ] as const;
  const accentKeys = ["subtle", "muted", "default", "emphasis", "text"] as const;
  const semanticKeys = [
    "success",
    "successMuted",
    "warning",
    "warningMuted",
    "error",
    "errorMuted",
    "info",
    "infoMuted",
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

      {/* AI Generator Panel */}
      <div className="rounded-lg border border-border bg-card">
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="flex w-full items-center justify-between p-4 text-left hover:bg-accent/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-pink-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium">AI Color Generator</h3>
              <p className="text-sm text-muted-foreground">
                Generate harmonious palettes from a seed color
              </p>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform ${
              showGenerator ? "rotate-180" : ""
            }`}
          />
        </button>

        {showGenerator && (
          <div className="border-t border-border p-4">
            {/* Seed Color Picker */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Seed Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={seedColor}
                  onChange={(e) => setSeedColor(e.target.value)}
                  className="h-10 w-16 cursor-pointer rounded border border-border bg-transparent"
                  aria-label="Seed color picker"
                />
                <input
                  type="text"
                  value={seedColor.toUpperCase()}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      setSeedColor(val);
                    }
                  }}
                  className="w-24 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
                  aria-label="Seed color hex value"
                />
                <button
                  onClick={() => setSeedColor(currentColors.accent.default)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Use current accent
                </button>
              </div>
            </div>

            {/* Preset Colors */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PALETTE_PRESETS) as PalettePreset[]).map(
                  (preset) => (
                    <button
                      key={preset}
                      onClick={() => handleApplyPreset(preset)}
                      className="group relative h-8 w-8 rounded-full border-2 border-transparent transition-all hover:scale-110 hover:border-foreground"
                      style={{ backgroundColor: PALETTE_PRESETS[preset] }}
                      title={preset.charAt(0).toUpperCase() + preset.slice(1)}
                      aria-label={`Apply ${preset} preset`}
                    >
                      <span className="sr-only">{preset}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Options */}
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={applyToDarkMode}
                  onChange={(e) => setApplyToDarkMode(e.target.checked)}
                  className="rounded border-input"
                />
                <span className="text-sm">
                  Apply to both light and dark modes
                </span>
              </label>
            </div>

            {/* Generate Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleGeneratePalette}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Sparkles className="h-4 w-4" />
                Generate Full Palette
              </button>
              <button
                onClick={handleGenerateFromAccent}
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                <Palette className="h-4 w-4" />
                Generate Accent Only
              </button>
              <button
                onClick={() => {
                  // Randomize the hue
                  const randomHue = Math.floor(Math.random() * 360);
                  const randomColor = `hsl(${randomHue}, 70%, 50%)`;
                  // Convert HSL to hex (simple approximation)
                  const canvas = document.createElement("canvas");
                  const ctx = canvas.getContext("2d");
                  if (ctx) {
                    ctx.fillStyle = randomColor;
                    const hex = ctx.fillStyle;
                    setSeedColor(hex);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                <RefreshCw className="h-4 w-4" />
                Random
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gray scale */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Gray Scale</h3>
        <div className="grid grid-cols-6 gap-3">
          {grayKeys.map((key) => (
            <ColorSwatch
              key={key}
              label={key}
              color={currentColors.gray[key]}
              onChange={(value) => updateColor("gray", key, value)}
            />
          ))}
        </div>
      </div>

      {/* Accent colors */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Accent Colors</h3>
        <div className="grid grid-cols-5 gap-3">
          {accentKeys.map((key) => (
            <ColorSwatch
              key={key}
              label={key}
              color={currentColors.accent[key]}
              onChange={(value) => updateColor("accent", key, value)}
            />
          ))}
        </div>
      </div>

      {/* Semantic colors */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Semantic Colors</h3>
        <div className="grid grid-cols-4 gap-3">
          {semanticKeys.map((key) => (
            <ColorSwatch
              key={key}
              label={key.replace(/([A-Z])/g, " $1").trim()}
              color={currentColors.semantic[key]}
              onChange={(value) => updateColor("semantic", key, value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Improved Color Swatch Component
interface ColorSwatchProps {
  label: string;
  color: string;
  onChange: (value: string) => void;
}

function ColorSwatch({ label, color, onChange }: ColorSwatchProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(color);

  const handleBlur = () => {
    setIsEditing(false);
    if (/^#[0-9A-Fa-f]{6}$/.test(localValue)) {
      onChange(localValue);
    } else {
      setLocalValue(color);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(color);
    } catch {
      // Fallback for older browsers
    }
  };

  return (
    <div className="group space-y-2">
      <div
        className="relative aspect-square overflow-hidden rounded-md border border-border"
        style={{ backgroundColor: color }}
      >
        <button
          onClick={handleCopy}
          className="absolute right-1 top-1 rounded bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100"
          title="Copy color"
          aria-label={`Copy ${label} color`}
        >
          <Copy className="h-3 w-3 text-white" />
        </button>
      </div>
      <div className="text-center">
        <div className="truncate text-xs capitalize text-muted-foreground">
          {label}
        </div>
        {isEditing ? (
          <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value.toUpperCase())}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === "Enter" && handleBlur()}
            className="w-full rounded border border-input bg-background px-1 py-0.5 text-center font-mono text-xs"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-1">
            <input
              type="color"
              value={color}
              onChange={(e) => {
                onChange(e.target.value.toUpperCase());
                setLocalValue(e.target.value.toUpperCase());
              }}
              className="h-5 w-5 cursor-pointer rounded border-0"
              aria-label={`${label} color picker`}
            />
            <button
              onClick={() => {
                setLocalValue(color);
                setIsEditing(true);
              }}
              className="flex-1 truncate font-mono text-xs hover:text-foreground"
            >
              {color}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
