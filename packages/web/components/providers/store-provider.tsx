"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Manually rehydrate the persisted store on the client
    useUIStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
