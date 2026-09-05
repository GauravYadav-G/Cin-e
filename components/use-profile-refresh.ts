"use client";
import { useEffect } from "react";
export function useProfileRefresh(refresh: () => Promise<void>) {
  useEffect(() => {
    const focus = () => {
      void refresh();
    };
    const changed = (event: StorageEvent) => {
      if (event.key === "cine-auth-change") window.location.reload();
    };
    window.addEventListener("focus", focus);
    window.addEventListener("storage", changed);
    return () => {
      window.removeEventListener("focus", focus);
      window.removeEventListener("storage", changed);
    };
  }, [refresh]);
}
