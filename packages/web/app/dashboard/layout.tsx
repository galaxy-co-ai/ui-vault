"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CommandPalette } from "@/components/layout/command-palette";
import { ClientOnly } from "@/components/providers/client-only";
import { ErrorBoundary } from "@/components/providers/error-boundary";
import { useStyleStore } from "@/stores";

function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar skeleton */}
      <div className="w-64 border-r border-border bg-card" />
      {/* Main content skeleton */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="h-14 border-b border-border" />
        <div className="flex-1 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useStyleStore.getState().loadStyles();
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientOnly fallback={<DashboardSkeleton />}>
      <DashboardContent>{children}</DashboardContent>
    </ClientOnly>
  );
}
