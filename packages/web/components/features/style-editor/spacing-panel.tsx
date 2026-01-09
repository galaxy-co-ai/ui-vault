"use client";

import type { StyleCollection } from "@/lib/schemas/style.schema";

interface SpacingPanelProps {
  spacing: StyleCollection["spacing"];
  onChange: (spacing: StyleCollection["spacing"]) => void;
}

const spacingKeys = [
  "0", "0.5", "1", "1.5", "2", "2.5", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24"
] as const;

export function SpacingPanel({ spacing, onChange }: SpacingPanelProps) {
  const updateSpacing = (key: keyof typeof spacing, value: string) => {
    onChange({
      ...spacing,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-sm font-medium">Spacing Scale</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Define the spacing scale used throughout your design system. Values should be in px, rem, or em.
        </p>

        <div className="space-y-3">
          {spacingKeys.map((key) => {
            const value = spacing[key as keyof typeof spacing];
            const numericValue = parseInt(value);
            const barWidth = Math.min(numericValue * 2, 200);

            return (
              <div key={key} className="flex items-center gap-4">
                <span className="w-12 text-right text-xs text-muted-foreground">
                  {key}
                </span>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    updateSpacing(key as keyof typeof spacing, e.target.value)
                  }
                  className="w-24 rounded-md border border-input bg-background px-2 py-1 text-sm"
                />
                <div className="flex-1">
                  <div
                    className="h-4 rounded bg-primary/50"
                    style={{ width: `${barWidth}px` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
