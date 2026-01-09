"use client";

import { Check } from "lucide-react";
import { TEMPLATES, type StyleTemplate } from "@/lib/templates";

interface TemplatePickerProps {
  selectedId: string;
  onSelect: (template: StyleTemplate) => void;
}

export function TemplatePicker({ selectedId, onSelect }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {TEMPLATES.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isSelected={selectedId === template.id}
          onSelect={() => onSelect(template)}
        />
      ))}
    </div>
  );
}

interface TemplateCardProps {
  template: StyleTemplate;
  isSelected: boolean;
  onSelect: () => void;
}

function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col overflow-hidden rounded-lg border-2 bg-card text-left transition-all ${
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/50"
      }`}
      aria-label={`Select ${template.name} template`}
    >
      {/* Color Preview */}
      <div
        className="relative h-20 transition-transform duration-200"
        style={{ backgroundColor: template.preview.background }}
      >
        {/* Color swatches */}
        <div className="absolute inset-2 flex items-center justify-center gap-2">
          <div
            className="h-10 w-10 rounded-lg shadow-sm transition-transform group-hover:scale-110"
            style={{ backgroundColor: template.preview.gray }}
          />
          <div
            className="h-12 w-12 rounded-lg shadow-md transition-transform group-hover:scale-110"
            style={{ backgroundColor: template.preview.accent }}
          />
          <div
            className="h-10 w-10 rounded-lg shadow-sm transition-transform group-hover:scale-110"
            style={{ backgroundColor: template.colors.light.semantic.success }}
          />
        </div>

        {/* Selected checkmark */}
        {isSelected && (
          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col p-3">
        <span className="font-medium text-foreground">{template.name}</span>
        <span className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
          {template.description}
        </span>
      </div>
    </button>
  );
}

// Preview component for showing what the template looks like
interface TemplatePreviewProps {
  template: StyleTemplate;
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  const colors = template.colors.light;

  return (
    <div
      className="rounded-lg border border-border p-4"
      style={{ backgroundColor: colors.gray[50] }}
    >
      {/* Mini preview of the design system */}
      <div className="space-y-3">
        {/* Header preview */}
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded"
            style={{
              backgroundColor: colors.accent.default,
              borderRadius: template.borderRadius.DEFAULT,
            }}
          />
          <div
            className="h-3 w-20 rounded"
            style={{ backgroundColor: colors.gray[300] }}
          />
        </div>

        {/* Text preview */}
        <div className="space-y-1.5">
          <div
            className="h-3 w-full rounded"
            style={{ backgroundColor: colors.gray[900] }}
          />
          <div
            className="h-2 w-3/4 rounded"
            style={{ backgroundColor: colors.gray[500] }}
          />
          <div
            className="h-2 w-1/2 rounded"
            style={{ backgroundColor: colors.gray[400] }}
          />
        </div>

        {/* Buttons preview */}
        <div className="flex gap-2">
          <div
            className="h-6 w-16 rounded"
            style={{
              backgroundColor: colors.accent.default,
              borderRadius: template.borderRadius.DEFAULT,
            }}
          />
          <div
            className="h-6 w-16 rounded border"
            style={{
              backgroundColor: "transparent",
              borderColor: colors.gray[300],
              borderRadius: template.borderRadius.DEFAULT,
            }}
          />
        </div>

        {/* Semantic colors */}
        <div className="flex gap-1.5">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: colors.semantic.success }}
          />
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: colors.semantic.warning }}
          />
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: colors.semantic.error }}
          />
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: colors.semantic.info }}
          />
        </div>
      </div>
    </div>
  );
}
