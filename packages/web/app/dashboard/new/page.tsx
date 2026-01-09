"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStyleStore } from "@/stores";
import { DEFAULT_TEMPLATE, createStyleFromTemplate, type StyleTemplate } from "@/lib/templates";
import { TemplatePicker, TemplatePreview } from "@/components/features";
import { ArrowLeft, Palette, Sparkles } from "lucide-react";
import Link from "next/link";

type Step = "template" | "customize";

export default function NewStylePage() {
  const router = useRouter();
  const createStyle = useStyleStore((state) => state.createStyle);
  
  const [step, setStep] = useState<Step>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<StyleTemplate>(DEFAULT_TEMPLATE);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [seedColor, setSeedColor] = useState(DEFAULT_TEMPLATE.preview.accent);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTemplateSelect = (template: StyleTemplate) => {
    setSelectedTemplate(template);
    setSeedColor(template.preview.accent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      const styleData = createStyleFromTemplate(selectedTemplate, name.trim());
      const newStyle = await createStyle({
        ...styleData,
        description: description.trim() || undefined,
      });
      router.push(`/dashboard/styles/${newStyle.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create style");
      setIsCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Create New Style</h1>
        <p className="mt-1 text-muted-foreground">
          Choose a template to get started, then customize it to match your brand.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center gap-4">
        <StepIndicator
          number={1}
          label="Choose Template"
          isActive={step === "template"}
          isComplete={step === "customize"}
        />
        <div className="h-px flex-1 bg-border" />
        <StepIndicator
          number={2}
          label="Name & Details"
          isActive={step === "customize"}
          isComplete={false}
        />
      </div>

      {step === "template" && (
        <div className="space-y-6">
          {/* Template Grid */}
          <div>
            <h2 className="mb-4 text-lg font-medium">Select a Template</h2>
            <TemplatePicker
              selectedId={selectedTemplate.id}
              onSelect={handleTemplateSelect}
            />
          </div>

          {/* Preview */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Preview
              </h3>
              <TemplatePreview template={selectedTemplate} />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Template Details
              </h3>
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: selectedTemplate.preview.accent }}
                  >
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedTemplate.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplate.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <DetailRow
                    label="Font Family"
                    value={selectedTemplate.typography.fontFamily.sans.split(",")[0] ?? "System"}
                  />
                  <DetailRow
                    label="Border Radius"
                    value={selectedTemplate.borderRadius.DEFAULT}
                  />
                  <DetailRow
                    label="Accent Color"
                    value={selectedTemplate.preview.accent}
                    color={selectedTemplate.preview.accent}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seed Color Picker */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Customize Starting Color</h3>
              <span className="text-xs text-muted-foreground">(optional)</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a seed color to customize the accent palette. You can fine-tune all colors after creation.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <input
                type="color"
                value={seedColor}
                onChange={(e) => setSeedColor(e.target.value)}
                className="h-10 w-20 cursor-pointer rounded border border-border bg-transparent"
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
                className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                aria-label="Seed color hex value"
              />
              <button
                type="button"
                onClick={() => setSeedColor(selectedTemplate.preview.accent)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Reset to template default
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep("customize")}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Continue
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {step === "customize" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selected Template Summary */}
          <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex gap-1">
              {[
                selectedTemplate.preview.gray,
                selectedTemplate.preview.accent,
                selectedTemplate.colors.light.semantic.success,
              ].map((color, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex-1">
              <p className="font-medium">{selectedTemplate.name} Template</p>
              <p className="text-sm text-muted-foreground">
                {seedColor !== selectedTemplate.preview.accent
                  ? `Custom accent: ${seedColor}`
                  : "Default colors"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep("template")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Change template
            </button>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Style Name <span className="text-destructive">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Design System"
              maxLength={50}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              {name.length}/50 characters
            </p>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of this design system..."
              maxLength={200}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/200 characters
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("template")}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isCreating}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Create Style
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// Helper Components

interface StepIndicatorProps {
  number: number;
  label: string;
  isActive: boolean;
  isComplete: boolean;
}

function StepIndicator({ number, label, isActive, isComplete }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
          isComplete
            ? "bg-primary text-primary-foreground"
            : isActive
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {isComplete ? "✓" : number}
      </div>
      <span
        className={`text-sm ${
          isActive || isComplete ? "font-medium text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  color?: string;
}

function DetailRow({ label, value, color }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {color && (
          <div
            className="h-4 w-4 rounded"
            style={{ backgroundColor: color }}
          />
        )}
        <span className="font-mono">{value}</span>
      </div>
    </div>
  );
}
