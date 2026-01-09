import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { StyleCollection, CreateStyleInput } from "@/lib/schemas/style.schema";

interface StyleStore {
  // Data
  styles: StyleCollection[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;

  // UI State
  searchQuery: string;
  showFavoritesOnly: boolean;
  activeTag: string | null;

  // Actions
  loadStyles: () => Promise<void>;
  selectStyle: (id: string | null) => void;
  createStyle: (data: CreateStyleInput) => Promise<StyleCollection>;
  updateStyle: (id: string, data: Partial<StyleCollection>) => Promise<void>;
  deleteStyle: (id: string) => Promise<void>;
  duplicateStyle: (id: string) => Promise<StyleCollection>;
  toggleFavorite: (id: string) => Promise<void>;

  // Search & Filter
  setSearchQuery: (query: string) => void;
  setShowFavoritesOnly: (show: boolean) => void;
  setActiveTag: (tag: string | null) => void;
  clearFilters: () => void;
}

export const useStyleStore = create<StyleStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      styles: [],
      selectedId: null,
      isLoading: false,
      error: null,
      searchQuery: "",
      showFavoritesOnly: false,
      activeTag: null,

      // Actions
      loadStyles: async () => {
        set({ isLoading: true, error: null });
        try {
          const params = new URLSearchParams();
          const { searchQuery, showFavoritesOnly, activeTag } = get();

          if (searchQuery) params.set("search", searchQuery);
          if (showFavoritesOnly) params.set("favorite", "true");
          if (activeTag) params.set("tag", activeTag);

          const url = `/api/styles${params.toString() ? `?${params}` : ""}`;
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error("Failed to load styles");
          }

          const styles = await response.json();
          set({ styles, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            isLoading: false,
          });
        }
      },

      selectStyle: (id) => set({ selectedId: id }),

      createStyle: async (data) => {
        const response = await fetch("/api/styles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create style");
        }

        const newStyle = await response.json();
        set((state) => ({ styles: [newStyle, ...state.styles] }));
        return newStyle;
      },

      updateStyle: async (id, data) => {
        const response = await fetch(`/api/styles/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update style");
        }

        const updated = await response.json();
        set((state) => ({
          styles: state.styles.map((s) => (s.id === id ? updated : s)),
        }));
      },

      deleteStyle: async (id) => {
        const response = await fetch(`/api/styles/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to delete style");
        }

        set((state) => ({
          styles: state.styles.filter((s) => s.id !== id),
          selectedId: state.selectedId === id ? null : state.selectedId,
        }));
      },

      duplicateStyle: async (id) => {
        const response = await fetch(`/api/styles/${id}/duplicate`, {
          method: "POST",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to duplicate style");
        }

        const duplicate = await response.json();
        set((state) => ({ styles: [duplicate, ...state.styles] }));
        return duplicate;
      },

      toggleFavorite: async (id) => {
        const response = await fetch(`/api/styles/${id}/favorite`, {
          method: "PATCH",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to toggle favorite");
        }

        const updated = await response.json();
        set((state) => ({
          styles: state.styles.map((s) => (s.id === id ? updated : s)),
        }));
      },

      // Search & Filter
      setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().loadStyles();
      },

      setShowFavoritesOnly: (show) => {
        set({ showFavoritesOnly: show });
        get().loadStyles();
      },

      setActiveTag: (tag) => {
        set({ activeTag: tag });
        get().loadStyles();
      },

      clearFilters: () => {
        set({ searchQuery: "", showFavoritesOnly: false, activeTag: null });
        get().loadStyles();
      },
    }),
    { name: "style-store" }
  )
);

// Selectors
export const useSelectedStyle = () =>
  useStyleStore((state) =>
    state.styles.find((s) => s.id === state.selectedId)
  );

export const useStyleById = (id: string) =>
  useStyleStore((state) => state.styles.find((s) => s.id === id));

export const useAllTags = () =>
  useStyleStore((state) => {
    const tagSet = new Set<string>();
    state.styles.forEach((style) => {
      style.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  });
