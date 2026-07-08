import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "@/lib/shuttle-store";

const emptySnapshot = {
  stopStats: {} as Record<string, { totalMin: number; count: number }>,
  active: [],
  feed: [],
};

export function useShuttleStore() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => emptySnapshot as ReturnType<typeof getSnapshot>,
  );
}
