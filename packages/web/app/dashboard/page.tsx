"use client";

import { useStyleStore } from "@/stores";
import { StyleCard } from "@/components/features/style-card";
import { EmptyState } from "@/components/features/empty-state";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { styles, isLoading, error } = useStyleStore();

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <button
            onClick={() => useStyleStore.getState().loadStyles()}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && styles.length === 0) {
    return (
      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  if (styles.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          title="No styles yet"
          description="Create your first style collection to get started."
          action={
            <Link
              href="/dashboard/new"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Style
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {styles.map((style) => (
          <StyleCard key={style.id} style={style} />
        ))}
      </div>
    </div>
  );
}
