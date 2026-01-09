"use client";

import Link from "next/link";
import { useStyleStore, useUIStore } from "@/stores";
import { Heart, MoreVertical, Copy, Download, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { StyleCollection } from "@/lib/schemas/style.schema";

interface StyleCardProps {
  style: StyleCollection;
}

export function StyleCard({ style }: StyleCardProps) {
  const { duplicateStyle, deleteStyle, toggleFavorite } = useStyleStore();
  const { openExportDialog } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    await duplicateStyle(style.id);
  };

  const handleExport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    openExportDialog(style.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this style?")) {
      setMenuOpen(false);
      await deleteStyle(style.id);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(style.id);
  };

  // Generate color preview from the dark palette
  const colors = style.colors.dark;
  const previewColors = [
    colors.gray[900],
    colors.gray[700],
    colors.gray[500],
    colors.accent.default,
    colors.semantic.success,
  ];

  return (
    <Link
      href={`/dashboard/styles/${style.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-accent hover:shadow-md"
    >
      {/* Color preview */}
      <div className="flex h-24">
        {previewColors.map((color, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="truncate font-medium text-foreground">
              {style.name}
            </h3>
            {style.description && (
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {style.description}
              </p>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleToggleFavorite}
            className={`ml-2 shrink-0 rounded-md p-1 transition-colors ${
              style.isFavorite
                ? "text-red-500"
                : "text-muted-foreground opacity-0 group-hover:opacity-100"
            } hover:bg-accent`}
          >
            <Heart
              className={`h-4 w-4 ${style.isFavorite ? "fill-current" : ""}`}
            />
          </button>
        </div>

        {/* Tags */}
        {style.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {style.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {style.tags.length > 3 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                +{style.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span>
            {new Date(style.updatedAt).toLocaleDateString()}
          </span>

          {/* Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="rounded-md p-1 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute bottom-full right-0 mb-1 w-40 rounded-md border border-border bg-popover p-1 shadow-lg">
                <button
                  onClick={handleDuplicate}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </button>
                <button
                  onClick={handleExport}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <hr className="my-1 border-border" />
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
