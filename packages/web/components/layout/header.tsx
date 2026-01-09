"use client";

import { useStyleStore, useUIStore } from "@/stores";
import { Search, Command, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function Header() {
  const { searchQuery, setSearchQuery } = useStyleStore();
  const { openCommandPalette } = useUIStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search styles..."
          className="h-9 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 text-xs text-muted-foreground sm:flex">
          /
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={openCommandPalette}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Command className="h-4 w-4" />
          <span className="hidden sm:inline">Command</span>
          <kbd className="pointer-events-none ml-2 hidden select-none rounded border border-border bg-muted px-1.5 text-xs sm:inline">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
}
