"use client";

import { useState } from "react";
import { ColorPanel } from "./color-panel";
import { TypographyPanel } from "./typography-panel";
import { SpacingPanel } from "./spacing-panel";
import { EffectsPanel } from "./effects-panel";
import { PreviewPanel } from "./preview-panel";
import type { StyleCollection } from "@/lib/schemas/style.schema";

interface StyleEditorProps {
  style: StyleCollection;
  onChange: (updates: Partial<StyleCollection>) => void;
}

const tabs = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "effects", label: "Effects" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function StyleEditor({ style, onChange }: StyleEditorProps) {
  const [activeTab, setActiveTab] = useState<TabId>("colors");

  return (
    <div className="flex h-full">
      {/* Editor panel */}
      <div className="flex-1 overflow-auto border-r border-border">
        {/* Tabs */}
        <div className="sticky top-0 z-10 flex gap-1 border-b border-border bg-background p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
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
        </div>
      </div>

      {/* Preview panel */}
      <div className="w-96 overflow-auto bg-muted/30">
        <PreviewPanel style={style} />
      </div>
    </div>
  );
}

export { StyleEditor };
