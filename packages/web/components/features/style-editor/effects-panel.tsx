"use client";

import type { StyleCollection } from "@/lib/schemas/style.schema";

interface EffectsPanelProps {
  borderRadius: StyleCollection["borderRadius"];
  shadows: StyleCollection["shadows"];
  animation: StyleCollection["animation"];
  onChange: (updates: Partial<StyleCollection>) => void;
}

const radiusKeys = ["none", "sm", "DEFAULT", "md", "lg", "full"] as const;
const shadowKeys = ["none", "sm", "DEFAULT", "md", "lg", "ring"] as const;
const durationKeys = ["instant", "fast", "normal", "smooth", "slow"] as const;
const easingKeys = ["default", "in", "out", "bounce"] as const;

export function EffectsPanel({
  borderRadius,
  shadows,
  animation,
  onChange,
}: EffectsPanelProps) {
  const updateRadius = (key: keyof typeof borderRadius, value: string) => {
    onChange({
      borderRadius: {
        ...borderRadius,
        [key]: value,
      },
    });
  };

  const updateShadow = (key: keyof typeof shadows, value: string) => {
    onChange({
      shadows: {
        ...shadows,
        [key]: value,
      },
    });
  };

  const updateDuration = (key: keyof typeof animation.duration, value: string) => {
    onChange({
      animation: {
        ...animation,
        duration: {
          ...animation.duration,
          [key]: value,
        },
      },
    });
  };

  const updateEasing = (key: keyof typeof animation.easing, value: string) => {
    onChange({
      animation: {
        ...animation,
        easing: {
          ...animation.easing,
          [key]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Border Radius */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Border Radius</h3>
        <div className="grid grid-cols-3 gap-4">
          {radiusKeys.map((key) => (
            <div key={key} className="space-y-2">
              <div
                className="flex h-16 w-16 items-center justify-center border border-border bg-muted"
                style={{ borderRadius: borderRadius[key] }}
              >
                <span className="text-xs text-muted-foreground">{key}</span>
              </div>
              <input
                type="text"
                value={borderRadius[key]}
                onChange={(e) => updateRadius(key, e.target.value)}
                className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Shadows */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Shadows</h3>
        <div className="space-y-4">
          {shadowKeys.map((key) => (
            <div key={key} className="flex items-start gap-4">
              <div
                className="h-12 w-12 shrink-0 rounded-md bg-card"
                style={{ boxShadow: shadows[key] }}
              />
              <div className="flex-1 space-y-1">
                <label className="text-xs capitalize text-muted-foreground">
                  {key}
                </label>
                <input
                  type="text"
                  value={shadows[key]}
                  onChange={(e) => updateShadow(key, e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation Duration */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Animation Duration</h3>
        <div className="space-y-3">
          {durationKeys.map((key) => (
            <div key={key} className="flex items-center gap-4">
              <span className="w-16 text-xs capitalize text-muted-foreground">
                {key}
              </span>
              <input
                type="text"
                value={animation.duration[key]}
                onChange={(e) => updateDuration(key, e.target.value)}
                className="w-24 rounded-md border border-input bg-background px-2 py-1 text-xs"
              />
              <div
                className="h-4 w-4 animate-pulse rounded-full bg-primary"
                style={{ animationDuration: animation.duration[key] }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Animation Easing */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Animation Easing</h3>
        <div className="space-y-3">
          {easingKeys.map((key) => (
            <div key={key} className="flex items-center gap-4">
              <span className="w-16 text-xs capitalize text-muted-foreground">
                {key}
              </span>
              <input
                type="text"
                value={animation.easing[key]}
                onChange={(e) => updateEasing(key, e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs font-mono"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
