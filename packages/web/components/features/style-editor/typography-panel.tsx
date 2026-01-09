"use client";

import type { StyleCollection } from "@/lib/schemas/style.schema";

interface TypographyPanelProps {
  typography: StyleCollection["typography"];
  onChange: (typography: StyleCollection["typography"]) => void;
}

export function TypographyPanel({ typography, onChange }: TypographyPanelProps) {
  const updateFontFamily = (key: "sans" | "mono" | "serif", value: string) => {
    onChange({
      ...typography,
      fontFamily: {
        ...typography.fontFamily,
        [key]: value,
      },
    });
  };

  const updateFontSize = (
    key: keyof typeof typography.fontSize,
    size: string,
    lineHeight: string
  ) => {
    onChange({
      ...typography,
      fontSize: {
        ...typography.fontSize,
        [key]: [size, { lineHeight }],
      },
    });
  };

  const updateFontWeight = (key: "normal" | "medium" | "semibold", value: string) => {
    onChange({
      ...typography,
      fontWeight: {
        ...typography.fontWeight,
        [key]: value,
      },
    });
  };

  const fontSizeKeys = ["xs", "sm", "base", "md", "lg", "xl", "2xl"] as const;

  return (
    <div className="space-y-8">
      {/* Font Families */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Font Families</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              Sans-serif
            </label>
            <input
              type="text"
              value={typography.fontFamily.sans}
              onChange={(e) => updateFontFamily("sans", e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <p
              className="mt-2 text-lg"
              style={{ fontFamily: typography.fontFamily.sans }}
            >
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              Monospace
            </label>
            <input
              type="text"
              value={typography.fontFamily.mono}
              onChange={(e) => updateFontFamily("mono", e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <p
              className="mt-2 text-lg"
              style={{ fontFamily: typography.fontFamily.mono }}
            >
              const hello = &quot;world&quot;;
            </p>
          </div>
        </div>
      </div>

      {/* Font Sizes */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Font Sizes</h3>
        <div className="space-y-3">
          {fontSizeKeys.map((key) => {
            const [size, { lineHeight }] = typography.fontSize[key];
            return (
              <div key={key} className="flex items-center gap-4">
                <span className="w-12 text-xs text-muted-foreground">{key}</span>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => updateFontSize(key, e.target.value, lineHeight)}
                  className="w-20 rounded-md border border-input bg-background px-2 py-1 text-sm"
                  placeholder="Size"
                />
                <input
                  type="text"
                  value={lineHeight}
                  onChange={(e) => updateFontSize(key, size, e.target.value)}
                  className="w-20 rounded-md border border-input bg-background px-2 py-1 text-sm"
                  placeholder="Line Height"
                />
                <span
                  className="flex-1 truncate"
                  style={{ fontSize: size, lineHeight }}
                >
                  Sample text
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Font Weights */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Font Weights</h3>
        <div className="space-y-3">
          {(["normal", "medium", "semibold"] as const).map((key) => (
            <div key={key} className="flex items-center gap-4">
              <span className="w-20 text-xs capitalize text-muted-foreground">
                {key}
              </span>
              <input
                type="text"
                value={typography.fontWeight[key]}
                onChange={(e) => updateFontWeight(key, e.target.value)}
                className="w-20 rounded-md border border-input bg-background px-2 py-1 text-sm"
              />
              <span
                className="flex-1"
                style={{ fontWeight: typography.fontWeight[key] }}
              >
                The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
