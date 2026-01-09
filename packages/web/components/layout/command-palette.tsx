"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStyleStore, useUIStore } from "@/stores";
import { toast } from "@/lib/hooks/use-toast";
import {
  Plus,
  Search,
  Download,
  Copy,
  Trash2,
  Heart,
  Save,
  Moon,
  Sun,
  Keyboard,
  Home,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "next-themes";

interface Command {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ElementType;
  category?: string;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const { styles, duplicateStyle, deleteStyle, toggleFavorite } = useStyleStore();
  const { commandPaletteOpen, closeCommandPalette, openExportDialog } = useUIStore();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Get current style ID from pathname if on style editor page
  const styleIdMatch = pathname?.match(/\/dashboard\/styles\/([^/]+)/);
  const currentStyleId = styleIdMatch?.[1];
  const currentStyle = currentStyleId
    ? styles.find((s) => s.id === currentStyleId)
    : null;

  // Build commands list
  const commands: Command[] = [
    // Navigation
    {
      id: "go-home",
      label: "Go to Dashboard",
      shortcut: "G D",
      icon: Home,
      category: "Navigation",
      action: () => {
        closeCommandPalette();
        router.push("/dashboard");
      },
    },
    {
      id: "go-back",
      label: "Go Back",
      shortcut: "⌫",
      icon: ArrowLeft,
      category: "Navigation",
      action: () => {
        closeCommandPalette();
        router.back();
      },
    },
    {
      id: "new-style",
      label: "Create New Style",
      shortcut: "⌘ N",
      icon: Plus,
      category: "Actions",
      action: () => {
        closeCommandPalette();
        router.push("/dashboard/new");
      },
    },

    // Style-specific commands (only show when viewing a style)
    ...(currentStyle
      ? [
          {
            id: "save-style",
            label: "Save Style",
            shortcut: "⌘ S",
            icon: Save,
            category: "Current Style",
            action: () => {
              closeCommandPalette();
              // Trigger save via keyboard event
              document.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "s",
                  metaKey: true,
                  ctrlKey: true,
                })
              );
              toast.success("Saving...");
            },
          },
          {
            id: "export-style",
            label: "Export Style",
            shortcut: "⌘ E",
            icon: Download,
            category: "Current Style",
            action: () => {
              closeCommandPalette();
              openExportDialog(currentStyleId!);
            },
          },
          {
            id: "duplicate-style",
            label: "Duplicate Style",
            shortcut: "⌘ D",
            icon: Copy,
            category: "Current Style",
            action: async () => {
              closeCommandPalette();
              try {
                const duplicate = await duplicateStyle(currentStyleId!);
                toast.success("Style duplicated", `Created "${duplicate.name}"`);
                router.push(`/dashboard/styles/${duplicate.id}`);
              } catch {
                toast.error("Failed to duplicate style");
              }
            },
          },
          {
            id: "toggle-favorite",
            label: currentStyle.isFavorite
              ? "Remove from Favorites"
              : "Add to Favorites",
            shortcut: "⌘ F",
            icon: Heart,
            category: "Current Style",
            action: async () => {
              closeCommandPalette();
              await toggleFavorite(currentStyleId!);
              toast.success(
                currentStyle.isFavorite
                  ? "Removed from favorites"
                  : "Added to favorites"
              );
            },
          },
          {
            id: "delete-style",
            label: "Delete Style",
            shortcut: "⌘ ⌫",
            icon: Trash2,
            category: "Current Style",
            action: async () => {
              closeCommandPalette();
              if (confirm("Are you sure you want to delete this style?")) {
                try {
                  await deleteStyle(currentStyleId!);
                  toast.success("Style deleted");
                  router.push("/dashboard");
                } catch {
                  toast.error("Failed to delete style");
                }
              }
            },
          },
        ]
      : []),

    // Theme
    {
      id: "toggle-theme",
      label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      shortcut: "⌘ T",
      icon: theme === "dark" ? Sun : Moon,
      category: "Preferences",
      action: () => {
        setTheme(theme === "dark" ? "light" : "dark");
        closeCommandPalette();
        toast.success(`Switched to ${theme === "dark" ? "light" : "dark"} mode`);
      },
    },
    {
      id: "keyboard-shortcuts",
      label: "Show Keyboard Shortcuts",
      shortcut: "?",
      icon: Keyboard,
      category: "Help",
      action: () => {
        closeCommandPalette();
        // Show shortcuts modal (future feature)
        toast.info("Keyboard Shortcuts", "⌘K - Command Palette, ⌘N - New Style, ⌘S - Save");
      },
    },

    // Recent styles
    ...styles.slice(0, 5).map((style) => ({
      id: `style-${style.id}`,
      label: style.name,
      icon: Search,
      category: "Recent Styles",
      action: () => {
        closeCommandPalette();
        router.push(`/dashboard/styles/${style.id}`);
      },
    })),
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  // Group commands by category
  const groupedCommands = filteredCommands.reduce<Record<string, Command[]>>(
    (acc, cmd) => {
      const category = cmd.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(cmd);
      return acc;
    },
    {}
  );

  // Flatten for keyboard navigation
  const flatCommands = Object.values(groupedCommands).flat();

  // Global keyboard shortcuts
  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;

      // Command palette toggle
      if (isMeta && e.key === "k") {
        e.preventDefault();
        useUIStore.getState().toggleCommandPalette();
        return;
      }

      // "/" to open command palette (when not in input)
      if (e.key === "/" && !commandPaletteOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          useUIStore.getState().openCommandPalette();
        }
        return;
      }

      // Don't process other shortcuts if command palette is open
      if (commandPaletteOpen) return;

      // Global shortcuts (only when not in input)
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      // ⌘ + N = New Style
      if (isMeta && e.key === "n") {
        e.preventDefault();
        router.push("/dashboard/new");
        return;
      }

      // ⌘ + T = Toggle theme
      if (isMeta && e.key === "t") {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
        toast.success(`Switched to ${theme === "dark" ? "light" : "dark"} mode`);
        return;
      }

      // Style-specific shortcuts
      if (currentStyleId) {
        // ⌘ + E = Export
        if (isMeta && e.key === "e") {
          e.preventDefault();
          openExportDialog(currentStyleId);
          return;
        }

        // ⌘ + D = Duplicate
        if (isMeta && e.key === "d") {
          e.preventDefault();
          duplicateStyle(currentStyleId)
            .then((dup) => {
              toast.success("Style duplicated", `Created "${dup.name}"`);
              router.push(`/dashboard/styles/${dup.id}`);
            })
            .catch(() => {
              toast.error("Duplicate failed", "Something went wrong. Please try again.");
            });
          return;
        }
      }
    },
    [
      commandPaletteOpen,
      currentStyleId,
      duplicateStyle,
      openExportDialog,
      router,
      setTheme,
      theme,
    ]
  );

  // Register global shortcuts
  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  // Reset state when opening
  useEffect(() => {
    if (commandPaletteOpen) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatCommands.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flatCommands[selectedIndex]) {
      e.preventDefault();
      flatCommands[selectedIndex].action();
    } else if (e.key === "Escape") {
      closeCommandPalette();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={closeCommandPalette}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
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
          {flatCommands.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category}>
                <div className="mb-1 mt-2 px-3 text-xs font-medium text-muted-foreground first:mt-0">
                  {category}
                </div>
                {cmds.map((cmd) => {
                  const globalIndex = flatCommands.indexOf(cmd);
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                        globalIndex === selectedIndex
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <cmd.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 text-left">{cmd.label}</span>
                      {cmd.shortcut && (
                        <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer with hints */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <div className="flex gap-2">
            <span>
              <kbd className="rounded bg-muted px-1">↑</kbd>
              <kbd className="ml-0.5 rounded bg-muted px-1">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="rounded bg-muted px-1">↵</kbd> to select
            </span>
          </div>
          <span>
            <kbd className="rounded bg-muted px-1">esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}