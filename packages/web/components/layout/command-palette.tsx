"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStyleStore, useUIStore } from "@/stores";
import {
  Plus,
  Search,
  Settings,
  FileDown,
  Copy,
  Trash2,
  Heart,
} from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const { styles, duplicateStyle, deleteStyle, toggleFavorite } = useStyleStore();
  const { commandPaletteOpen, closeCommandPalette, openExportDialog } = useUIStore();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useUIStore.getState().toggleCommandPalette();
      }
      if (e.key === "/" && !commandPaletteOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          useUIStore.getState().openCommandPalette();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen]);

  // Reset state when opening
  useEffect(() => {
    if (commandPaletteOpen) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const commands = [
    {
      id: "new-style",
      label: "Create New Style",
      icon: Plus,
      action: () => {
        closeCommandPalette();
        router.push("/dashboard/new");
      },
    },
    ...styles.slice(0, 5).map((style) => ({
      id: `style-${style.id}`,
      label: style.name,
      icon: Search,
      action: () => {
        closeCommandPalette();
        router.push(`/dashboard/styles/${style.id}`);
      },
    })),
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
    } else if (e.key === "Escape") {
      closeCommandPalette();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={closeCommandPalette}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className="relative w-full max-w-lg rounded-lg border border-border bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="h-12 flex-1 bg-transparent px-3 text-sm placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <kbd className="rounded border border-border bg-muted px-1.5 text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Commands list */}
        <div className="max-h-80 overflow-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  index === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent/50"
                }`}
              >
                <cmd.icon className="h-4 w-4 text-muted-foreground" />
                <span>{cmd.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
