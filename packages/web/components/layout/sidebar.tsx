"use client";

import Link from "next/link";
import { useStyleStore, useAllTags, useUIStore } from "@/stores";
import {
  LayoutGrid,
  Heart,
  Tag,
  Plus,
  ChevronLeft,
  ChevronRight,
  Palette,
} from "lucide-react";

export function Sidebar() {
  const { showFavoritesOnly, setShowFavoritesOnly, activeTag, setActiveTag, clearFilters } =
    useStyleStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const tags = useAllTags();

  const navItems = [
    {
      label: "All Styles",
      icon: LayoutGrid,
      href: "/dashboard",
      active: !showFavoritesOnly && !activeTag,
      onClick: () => clearFilters(),
    },
    {
      label: "Favorites",
      icon: Heart,
      href: "/dashboard",
      active: showFavoritesOnly,
      onClick: () => {
        setShowFavoritesOnly(!showFavoritesOnly);
        if (activeTag) setActiveTag(null);
      },
    },
  ];

  return (
    <aside
      className={`flex flex-col border-r border-border bg-card transition-all ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        {!sidebarCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <span className="font-semibold">UI Vault</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto p-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                item.active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Tags section */}
        {!sidebarCollapsed && tags.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 px-3 text-xs font-medium uppercase text-muted-foreground">
              Tags
            </h3>
            <div className="space-y-1">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setActiveTag(activeTag === tag ? null : tag);
                    if (showFavoritesOnly) setShowFavoritesOnly(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    activeTag === tag
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <Tag className="h-4 w-4 shrink-0" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Create button */}
      <div className="border-t border-border p-2">
        <Link
          href="/dashboard/new"
          className={`flex items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 ${
            sidebarCollapsed ? "px-2" : "px-4"
          }`}
        >
          <Plus className="h-4 w-4" />
          {!sidebarCollapsed && <span>New Style</span>}
        </Link>
      </div>
    </aside>
  );
}
