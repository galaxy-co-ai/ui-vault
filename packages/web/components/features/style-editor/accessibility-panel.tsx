"use client";

import { useState, useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Wand2,
  Eye,
  ChevronDown,
} from "lucide-react";
import type { StyleCollection } from "@/lib/schemas/style.schema";
import {
  auditPalette,
  formatContrastRatio,
  type AccessibilityIssue,
} from "@/lib/accessibility";
import { WCAGBadge } from "./wcag-badge";

interface AccessibilityPanelProps {
  colors: StyleCollection["colors"];
  onChange: (colors: StyleCollection["colors"]) => void;
}

export function AccessibilityPanel({
  colors,
  onChange,
}: AccessibilityPanelProps) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [showFixed, setShowFixed] = useState(false);

  const issues = useMemo(() => {
    return auditPalette(colors[mode], mode === "dark");
  }, [colors, mode]);

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  const handleApplySuggestion = (issue: AccessibilityIssue) => {
    if (!issue.suggestion) return;

    // Determine which color group and key to update based on issue id
    const [group, ...keyParts] = issue.id.split("-");
    const key = keyParts.join("-");

    // For now, we'll update the foreground color since that's what we're suggesting
    // A more sophisticated approach would determine which color needs changing
    const updatedColors = { ...colors };

    // Find and update the color based on the issue type
    if (issue.type === "text-on-background") {
      // Update gray scale colors based on context
      if (issue.id.includes("muted")) {
        updatedColors[mode] = {
          ...updatedColors[mode],
          gray: {
            ...updatedColors[mode].gray,
            [mode === "dark" ? "300" : "700"]: issue.suggestion,
          },
        };
      } else if (issue.id.includes("accent")) {
        updatedColors[mode] = {
          ...updatedColors[mode],
          accent: {
            ...updatedColors[mode].accent,
            text: issue.suggestion,
          },
        };
      }
    }

    onChange(updatedColors);
  };

  const handleFixAll = () => {
    let updatedColors = { ...colors };

    for (const issue of issues) {
      if (issue.suggestion) {
        // Apply each suggestion
        if (issue.type === "text-on-background" && issue.id.includes("accent")) {
          updatedColors[mode] = {
            ...updatedColors[mode],
            accent: {
              ...updatedColors[mode].accent,
              text: issue.suggestion,
            },
          };
        }
      }
    }

    onChange(updatedColors);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
            <Eye className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">Accessibility Audit</h2>
            <p className="text-sm text-muted-foreground">
              WCAG 2.1 contrast compliance check
            </p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("light")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "light"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setMode("dark")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "dark"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50"
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          label="Errors"
          count={errors.length}
          variant="error"
        />
        <SummaryCard
          icon={<Info className="h-5 w-5 text-yellow-500" />}
          label="Warnings"
          count={warnings.length}
          variant="warning"
        />
        <SummaryCard
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          label="Score"
          count={issues.length === 0 ? 100 : Math.max(0, 100 - errors.length * 15 - warnings.length * 5)}
          suffix="%"
          variant="success"
        />
      </div>

      {/* Fix All Button */}
      {issues.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div>
            <h3 className="font-medium">Quick Fix Available</h3>
            <p className="text-sm text-muted-foreground">
              Automatically adjust colors to meet WCAG AA requirements
            </p>
          </div>
          <button
            onClick={handleFixAll}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Wand2 className="h-4 w-4" />
            Fix All Issues
          </button>
        </div>
      )}

      {/* No Issues State */}
      {issues.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-green-200 bg-green-50 p-8 dark:border-green-800 dark:bg-green-900/20">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <h3 className="mt-3 font-semibold text-green-700 dark:text-green-300">
            Perfect Score!
          </h3>
          <p className="mt-1 text-center text-sm text-green-600 dark:text-green-400">
            All color combinations meet WCAG 2.1 AA requirements
          </p>
        </div>
      )}

      {/* Issues List */}
      {issues.length > 0 && (
        <div className="space-y-4">
          {/* Errors */}
          {errors.length > 0 && (
            <IssueSection
              title="Errors"
              subtitle="These color combinations fail WCAG AA requirements"
              issues={errors}
              variant="error"
              onApplySuggestion={handleApplySuggestion}
            />
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <IssueSection
              title="Warnings"
              subtitle="These may have accessibility concerns"
              issues={warnings}
              variant="warning"
              onApplySuggestion={handleApplySuggestion}
            />
          )}
        </div>
      )}

      {/* Color Pair Preview */}
      <div className="space-y-4">
        <button
          onClick={() => setShowFixed(!showFixed)}
          className="flex w-full items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/50"
        >
          <h3 className="font-medium">Preview Color Combinations</h3>
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform ${
              showFixed ? "rotate-180" : ""
            }`}
          />
        </button>

        {showFixed && (
          <div className="grid gap-4 rounded-lg border border-border bg-card p-4 md:grid-cols-2">
            <ColorPairPreview
              label="Text on Background"
              foreground={colors[mode].gray[mode === "dark" ? "100" : "900"]}
              background={colors[mode].gray[mode === "dark" ? "950" : "50"]}
            />
            <ColorPairPreview
              label="Muted Text"
              foreground={colors[mode].gray[mode === "dark" ? "400" : "600"]}
              background={colors[mode].gray[mode === "dark" ? "950" : "50"]}
            />
            <ColorPairPreview
              label="Accent on Background"
              foreground={colors[mode].accent.default}
              background={colors[mode].gray[mode === "dark" ? "950" : "50"]}
            />
            <ColorPairPreview
              label="Accent Text"
              foreground={colors[mode].accent.text}
              background={colors[mode].accent.subtle}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Summary Card Component
interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  suffix?: string;
  variant: "error" | "warning" | "success";
}

function SummaryCard({ icon, label, count, suffix, variant }: SummaryCardProps) {
  const borderClass = {
    error: "border-red-200 dark:border-red-800",
    warning: "border-yellow-200 dark:border-yellow-800",
    success: "border-green-200 dark:border-green-800",
  }[variant];

  return (
    <div className={`rounded-lg border bg-card p-4 ${borderClass}`}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="text-2xl font-bold">
            {count}
            {suffix}
          </div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}

// Issue Section Component
interface IssueSectionProps {
  title: string;
  subtitle: string;
  issues: AccessibilityIssue[];
  variant: "error" | "warning";
  onApplySuggestion: (issue: AccessibilityIssue) => void;
}

function IssueSection({
  title,
  subtitle,
  issues,
  variant,
  onApplySuggestion,
}: IssueSectionProps) {
  const bgClass =
    variant === "error"
      ? "bg-red-50 dark:bg-red-900/20"
      : "bg-yellow-50 dark:bg-yellow-900/20";
  const borderClass =
    variant === "error"
      ? "border-red-200 dark:border-red-800"
      : "border-yellow-200 dark:border-yellow-800";

  return (
    <div className={`rounded-lg border ${borderClass} ${bgClass}`}>
      <div className="border-b border-inherit p-4">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="divide-y divide-inherit">
        {issues.map((issue) => (
          <IssueRow
            key={issue.id}
            issue={issue}
            onApplySuggestion={() => onApplySuggestion(issue)}
          />
        ))}
      </div>
    </div>
  );
}

// Issue Row Component
interface IssueRowProps {
  issue: AccessibilityIssue;
  onApplySuggestion: () => void;
}

function IssueRow({ issue, onApplySuggestion }: IssueRowProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      {/* Color Preview */}
      <div className="flex items-center gap-1">
        <div
          className="h-8 w-8 rounded border border-border"
          style={{ backgroundColor: issue.foreground }}
        />
        <span className="text-muted-foreground">/</span>
        <div
          className="h-8 w-8 rounded border border-border"
          style={{ backgroundColor: issue.background }}
        />
      </div>

      {/* Message */}
      <div className="flex-1">
        <p className="text-sm">{issue.message}</p>
        <p className="text-xs text-muted-foreground">
          Ratio: {formatContrastRatio(issue.ratio)}
        </p>
      </div>

      {/* WCAG Badge */}
      <WCAGBadge
        foreground={issue.foreground}
        background={issue.background}
        showRatio={false}
      />

      {/* Fix Button */}
      {issue.suggestion && (
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded border border-border"
            style={{ backgroundColor: issue.suggestion }}
            title={`Suggested: ${issue.suggestion}`}
          />
          <button
            onClick={onApplySuggestion}
            className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            Fix
          </button>
        </div>
      )}
    </div>
  );
}

// Color Pair Preview Component
interface ColorPairPreviewProps {
  label: string;
  foreground: string;
  background: string;
}

function ColorPairPreview({
  label,
  foreground,
  background,
}: ColorPairPreviewProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <WCAGBadge foreground={foreground} background={background} />
      </div>
      <div
        className="rounded-md border border-border p-4"
        style={{ backgroundColor: background }}
      >
        <p style={{ color: foreground }} className="text-sm">
          The quick brown fox jumps over the lazy dog.
        </p>
        <p style={{ color: foreground }} className="mt-1 text-xs opacity-75">
          Sample text for accessibility preview
        </p>
      </div>
    </div>
  );
}
