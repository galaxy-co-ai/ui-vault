"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStyleStore } from "@/stores";
import { createDefaultStyle } from "@/lib/schemas/defaults";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewStylePage() {
  const router = useRouter();
  const createStyle = useStyleStore((state) => state.createStyle);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      const defaultStyle = createDefaultStyle(name.trim());
      const newStyle = await createStyle({
        ...defaultStyle,
        description: description.trim() || undefined,
      });
      router.push(`/dashboard/styles/${newStyle.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create style");
      setIsCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="mb-6 text-2xl font-semibold">Create New Style</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Style Collection"
            maxLength={50}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description{" "}
            <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of this style collection..."
            maxLength={200}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!name.trim() || isCreating}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {isCreating ? "Creating..." : "Create Style"}
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
