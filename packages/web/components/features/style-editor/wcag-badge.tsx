"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import {
  calculateContrastRatio,
  formatContrastRatio,
  getWCAGLevel,
  getWCAGBadgeClass,
  suggestAccessibleAlternative,
  type WCAGLevel,
} from "@/lib/accessibility";

interface WCAGBadgeProps {
  foreground: string;
  background: string;
  showRatio?: boolean;
  size?: "sm" | "md";
  onSuggestionApply?: (suggestedColor: string) => void;
}

export function WCAGBadge({
  foreground,
  background,
  showRatio = true,
  size = "sm",
  onSuggestionApply,
}: WCAGBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const ratio = calculateContrastRatio(foreground, background);
  const level = getWCAGLevel(ratio);

  const Icon = getLevelIcon(level);
  const badgeClass = getWCAGBadgeClass(level);

  const suggestion =
    level === "Fail" || level === "AA-Large"
      ? suggestAccessibleAlternative(foreground, background)
      : null;

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 gap-1",
    md: "text-sm px-2 py-1 gap-1.5",
  };

  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span
        className={`inline-flex items-center rounded font-medium ${sizeClasses[size]} ${badgeClass}`}
        role="status"
        aria-label={`WCAG contrast: ${level}, ratio ${formatContrastRatio(ratio)}`}
      >
        <Icon className={iconSize} />
        <span>{level}</span>
        {showRatio && (
          <span className="opacity-75">({formatContrastRatio(ratio)})</span>
        )}
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <WCAGTooltip
          level={level}
          ratio={ratio}
          foreground={foreground}
          background={background}
          suggestion={suggestion}
          onSuggestionApply={onSuggestionApply}
        />
      )}
    </div>
  );
}

// Compact version for inline use
interface WCAGIndicatorProps {
  foreground: string;
  background: string;
}

export function WCAGIndicator({ foreground, background }: WCAGIndicatorProps) {
  const ratio = calculateContrastRatio(foreground, background);
  const level = getWCAGLevel(ratio);

  const colorClass = {
    AAA: "bg-green-500",
    AA: "bg-blue-500",
    "AA-Large": "bg-yellow-500",
    Fail: "bg-red-500",
  }[level];

  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${colorClass}`}
      title={`${level} (${formatContrastRatio(ratio)})`}
      aria-label={`Contrast ${level}`}
    />
  );
}

// Tooltip component
interface WCAGTooltipProps {
  level: WCAGLevel;
  ratio: number;
  foreground: string;
  background: string;
  suggestion: string | null;
  onSuggestionApply?: (color: string) => void;
}

function WCAGTooltip({
  level,
  ratio,
  foreground,
  background,
  suggestion,
  onSuggestionApply,
}: WCAGTooltipProps) {
  return (
    <div className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-border bg-popover p-3 shadow-lg">
      {/* Arrow */}
      <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-border bg-popover" />

      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-foreground">
              Contrast: {formatContrastRatio(ratio)}
            </h4>
            <p className="text-sm text-muted-foreground">
              WCAG Level: {level}
            </p>
          </div>
          <span
            className={`rounded px-1.5 py-0.5 text-xs font-medium ${getWCAGBadgeClass(level)}`}
          >
            {level}
          </span>
        </div>

        {/* Color preview */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div
              className="h-6 w-6 rounded border border-border"
              style={{ backgroundColor: foreground }}
            />
            <span className="text-xs font-mono text-muted-foreground">
              Text
            </span>
          </div>
          <span className="text-muted-foreground">on</span>
          <div className="flex items-center gap-1">
            <div
              className="h-6 w-6 rounded border border-border"
              style={{ backgroundColor: background }}
            />
            <span className="text-xs font-mono text-muted-foreground">
              Bg
            </span>
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-1 text-xs">
          <RequirementRow
            label="AA Normal (≥4.5:1)"
            passed={ratio >= 4.5}
          />
          <RequirementRow
            label="AA Large (≥3:1)"
            passed={ratio >= 3.0}
          />
          <RequirementRow
            label="AAA Normal (≥7:1)"
            passed={ratio >= 7.0}
          />
        </div>

        {/* Suggestion */}
        {suggestion && onSuggestionApply && (
          <div className="border-t border-border pt-2">
            <p className="mb-2 text-xs text-muted-foreground">
              Suggested alternative:
            </p>
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-6 rounded border border-border"
                style={{ backgroundColor: suggestion }}
              />
              <span className="font-mono text-xs">{suggestion}</span>
              <button
                onClick={() => onSuggestionApply(suggestion)}
                className="ml-auto rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RequirementRow({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      {passed ? (
        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <CheckCircle className="h-3 w-3" />
          Pass
        </span>
      ) : (
        <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3" />
          Fail
        </span>
      )}
    </div>
  );
}

function getLevelIcon(level: WCAGLevel) {
  switch (level) {
    case "AAA":
    case "AA":
      return CheckCircle;
    case "AA-Large":
      return Info;
    case "Fail":
      return AlertCircle;
  }
}
