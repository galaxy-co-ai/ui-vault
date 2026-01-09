import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";
type ExportFormat = "tailwind" | "css" | "json";

interface UIStore {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Command palette
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;

  // Export dialog
  exportDialogOpen: boolean;
  exportStyleId: string | null;
  exportFormat: ExportFormat;
  openExportDialog: (styleId: string) => void;
  closeExportDialog: () => void;
  setExportFormat: (format: ExportFormat) => void;

  // Preview mode
  previewMode: "light" | "dark" | "split";
  setPreviewMode: (mode: "light" | "dark" | "split") => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        // Theme
        theme: "dark",
        setTheme: (theme) => set({ theme }),

        // Sidebar
        sidebarCollapsed: false,
        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        setSidebarCollapsed: (collapsed) =>
          set({ sidebarCollapsed: collapsed }),

        // Command palette
        commandPaletteOpen: false,
        openCommandPalette: () => set({ commandPaletteOpen: true }),
        closeCommandPalette: () => set({ commandPaletteOpen: false }),
        toggleCommandPalette: () =>
          set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

        // Export dialog
        exportDialogOpen: false,
        exportStyleId: null,
        exportFormat: "tailwind",
        openExportDialog: (styleId) =>
          set({ exportDialogOpen: true, exportStyleId: styleId }),
        closeExportDialog: () =>
          set({ exportDialogOpen: false, exportStyleId: null }),
        setExportFormat: (format) => set({ exportFormat: format }),

        // Preview mode
        previewMode: "dark",
        setPreviewMode: (mode) => set({ previewMode: mode }),
      }),
      {
        name: "ui-vault-ui-store",
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          previewMode: state.previewMode,
          exportFormat: state.exportFormat,
        }),
      }
    ),
    { name: "ui-store" }
  )
);
