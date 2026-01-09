"use client";

import { useState } from "react";
import { ColorPanel } from "./color-panel";
import { TypographyPanel } from "./typography-panel";
import { SpacingPanel } from "./spacing-panel";
import { EffectsPanel } from "./effects-panel";
import { PreviewPanel } from "./preview-panel";
import { AccessibilityPanel } from "./accessibility-panel";
import { VersionHistory } from "../version-history";
import type { StyleCollection } from "@/lib/schemas/style.schema";
import { Eye, Palette, Type, Ruler, Sparkles } from "lucide-react";

interface StyleEditorProps {
  style: StyleCollection;
  onChange: (updates: Partial<StyleCollection>) => void;
  onVersionRestore?: () => void;
}

const tabs = [
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "spacing", label: "Spacing", icon: Ruler },
  { id: "effects", label: "Effects", icon: Sparkles },
  { id: "accessibility", label: "Accessibility", icon: Eye },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function StyleEditor({ style, onChange, onVersionRestore }: StyleEditorProps) {
  const [activeTab, setActiveTab] = useState<TabId>("colors");

  return (
    <div className="flex h-full">
      {/* Editor panel */}
      <div className="flex-1 overflow-auto border-r border-border">
        {/* Tabs */}
        <div className="sticky top-0 z-10 flex gap-1 border-b border-border bg-background p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Panel content */}
        <div className="p-6">
          {activeTab === "colors" && (
            <ColorPanel
              colors={style.colors}
              onChange={(colors) => onChange({ colors })}
            />
          )}
          {activeTab === "typography" && (
            <TypographyPanel
              typography={style.typography}
              onChange={(typography) => onChange({ typography })}
            />
          )}
          {activeTab === "spacing" && (
            <SpacingPanel
              spacing={style.spacing}
              onChange={(spacing) => onChange({ spacing })}
            />
          )}
          {activeTab === "effects" && (
            <EffectsPanel
              borderRadius={style.borderRadius}
              shadows={style.shadows}
              animation={style.animation}
              onChange={onChange}
            />
          )}
          {activeTab === "accessibility" && (
            <AccessibilityPanel
              colors={style.colors}
              onChange={(colors) => onChange({ colors })}
            />
          )}
        </div>
      </div>

      {/* Preview panel */}
      <div className="flex w-96 flex-col overflow-auto bg-muted/30">
        <div className="flex-1">
          <PreviewPanel style={style} />
        </div>
        {/* Version History at bottom of preview panel */}
        <VersionHistory
          styleId={style.id}
          onRestore={onVersionRestore || (() => window.location.reload())}
        />
      </div>
    </div>
  );
}
