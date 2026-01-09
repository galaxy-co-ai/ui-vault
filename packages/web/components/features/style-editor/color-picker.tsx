"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Pipette, Copy, Check, ChevronDown } from "lucide-react";
import {
  hexToHsl,
  hslToHex,
  hexToRgb,
  rgbToHex,
} from "@/lib/color-generator";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [copied, setCopied] = useState(false);
  const [inputMode, setInputMode] = useState<"hex" | "rgb" | "hsl">("hex");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync local value with prop
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleColorChange = useCallback((newColor: string) => {
    const upperColor = newColor.toUpperCase();
    setLocalValue(upperColor);
    if (/^#[0-9A-Fa-f]{6}$/.test(upperColor)) {
      onChange(upperColor);
    }
  }, [onChange]);

  const handleHexChange = (hex: string) => {
    const formatted = hex.startsWith("#") ? hex : `#${hex}`;
    handleColorChange(formatted);
  };

  const handleRgbChange = (r: number, g: number, b: number) => {
    const hex = rgbToHex({ r, g, b });
    handleColorChange(hex);
  };

  const handleHslChange = (h: number, s: number, l: number) => {
    const hex = hslToHex({ h, s, l });
    handleColorChange(hex);
  };

  const handleEyedropper = async () => {
    try {
      // Check if EyeDropper API is available
      if ("EyeDropper" in window) {
        const eyeDropper = new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper();
        const result = await eyeDropper.open();
        handleColorChange(result.sRGBHex);
      } else {
        // Fallback: show alert
        alert("Eyedropper not supported in this browser");
      }
    } catch {
      // User cancelled or error
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(localValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access failed
    }
  };

  const rgb = hexToRgb(localValue);
  const hsl = hexToHsl(localValue);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-accent/50"
        aria-label={label || "Choose color"}
      >
        <div
          className="h-5 w-5 rounded border border-border"
          style={{ backgroundColor: localValue }}
        />
        <span className="font-mono">{localValue}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-border bg-popover p-4 shadow-lg">
          {/* Native color picker */}
          <div className="mb-4">
            <input
              type="color"
              value={localValue}
              onChange={(e) => handleColorChange(e.target.value)}
              className="h-32 w-full cursor-pointer rounded-lg border-0"
              aria-label="Color picker"
            />
          </div>

          {/* Action buttons */}
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={handleEyedropper}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-accent"
              title="Pick color from screen"
            >
              <Pipette className="h-4 w-4" />
              Eyedropper
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-accent"
              title="Copy color"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Input mode tabs */}
          <div className="mb-3 flex gap-1 rounded-md bg-muted p-1">
            {(["hex", "rgb", "hsl"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setInputMode(mode)}
                className={`flex-1 rounded px-2 py-1 text-xs font-medium uppercase transition-colors ${
                  inputMode === mode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Input fields based on mode */}
          {inputMode === "hex" && (
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Hex
              </label>
              <input
                type="text"
                value={localValue}
                onChange={(e) => handleHexChange(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
                placeholder="#000000"
              />
            </div>
          )}

          {inputMode === "rgb" && (
            <div className="grid grid-cols-3 gap-2">
              {(["r", "g", "b"] as const).map((channel) => (
                <div key={channel}>
                  <label className="mb-1 block text-xs uppercase text-muted-foreground">
                    {channel}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[channel]}
                    onChange={(e) => {
                      const val = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                      handleRgbChange(
                        channel === "r" ? val : rgb.r,
                        channel === "g" ? val : rgb.g,
                        channel === "b" ? val : rgb.b
                      );
                    }}
                    className="w-full rounded-md border border-input bg-background px-2 py-2 text-center text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {inputMode === "hsl" && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  H
                </label>
                <input
                  type="number"
                  min={0}
                  max={360}
                  value={Math.round(hsl.h)}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(360, parseInt(e.target.value) || 0));
                    handleHslChange(val, hsl.s, hsl.l);
                  }}
                  className="w-full rounded-md border border-input bg-background px-2 py-2 text-center text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  S%
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round(hsl.s)}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                    handleHslChange(hsl.h, val, hsl.l);
                  }}
                  className="w-full rounded-md border border-input bg-background px-2 py-2 text-center text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  L%
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round(hsl.l)}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                    handleHslChange(hsl.h, hsl.s, val);
                  }}
                  className="w-full rounded-md border border-input bg-background px-2 py-2 text-center text-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Inline color swatch with popover picker
interface InlineColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

export function InlineColorPicker({ value, onChange, label }: InlineColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleChange = (color: string) => {
    const upper = color.toUpperCase();
    setLocalValue(upper);
    if (/^#[0-9A-Fa-f]{6}$/.test(upper)) {
      onChange(upper);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex h-8 w-8 items-center justify-center rounded-md border border-border transition-all hover:ring-2 hover:ring-primary/50"
        style={{ backgroundColor: localValue }}
        title={`${label}: ${localValue}`}
        aria-label={`${label} color picker`}
      >
        <span className="sr-only">{label}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 rounded-lg border border-border bg-popover p-3 shadow-lg">
          <input
            type="color"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            className="h-24 w-24 cursor-pointer rounded border-0"
          />
          <input
            type="text"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-2 w-24 rounded border border-input bg-background px-2 py-1 text-center font-mono text-xs"
          />
        </div>
      )}
    </div>
  );
}
