import { createServerFn } from "@tanstack/react-start";
import { STOPS, type Stop, type Trip, TRIPS } from "./mock-data";

export type StopStat = { totalMin: number; count: number };
export type ActiveRide = {
  id: string;
  shuttle: string;
  boardStop: Stop;
  destinationStop: Stop;
  boardTime: number;
};
export type FeedEvent = { id: string; text: string; time: number };

export type StoreState = {
  stopStats: Record<Stop, StopStat>;
  active: ActiveRide[];
  feed: FeedEvent[];
  trips: Trip[];
};

const BASELINE: Record<Stop, StopStat> = {
  "Main Gate": { totalMin: 6 * 8, count: 8 },
  "New Hall": { totalMin: 4 * 8, count: 8 },
  Moremi: { totalMin: 8 * 8, count: 8 },
  Faculty: { totalMin: 11 * 8, count: 8 },
  PESSA: { totalMin: 14 * 8, count: 8 },
};

const INITIAL_STATE: StoreState = {
  stopStats: BASELINE,
  active: [],
  feed: [{ id: "seed-1", text: "Baseline seeded from 8 manually timed trips", time: Date.now() }],
  trips: TRIPS,
};

const KV_ENDPOINT = "https://kvdb.io/Kx9YmZ8p2qRtS8b5MhG67D/state";

// Helper to get Node modules safely only when running on the server
async function getFsAndPath() {
  if (typeof window === "undefined") {
    const fs = await import("node:fs");
    const path = await import("node:path");
    return { fs: fs.default || fs, path: path.default || path };
  }
  return { fs: null, path: null };
}

async function fetchState(): Promise<StoreState> {
  // 1. Try reading local JSON file on the Server
  if (typeof window === "undefined") {
    try {
      const { fs, path } = await getFsAndPath();
      if (fs && path && typeof process !== "undefined" && process.cwd) {
        const stateFile = path.join(process.cwd(), "state.json");
        if (fs.existsSync(stateFile)) {
          const raw = fs.readFileSync(stateFile, "utf-8");
          const parsed = JSON.parse(raw);
          if (parsed && parsed.stopStats) return parsed as StoreState;
        }
      }
    } catch (e) {
      // Ignore filesystem read errors
    }
  }

  // 2. Fall back to KV store
  try {
    const res = await fetch(KV_ENDPOINT);
    if (res.ok) {
      const data = await res.json();
      if (data && data.stopStats) return data as StoreState;
    }
  } catch (e) {
    console.error("KV fetch failed", e);
  }

  return INITIAL_STATE;
}

async function saveState(state: StoreState): Promise<void> {
  // 1. Try writing local JSON file on the Server
  if (typeof window === "undefined") {
    try {
      const { fs, path } = await getFsAndPath();
      if (fs && path && typeof process !== "undefined" && process.cwd) {
        const stateFile = path.join(process.cwd(), "state.json");
        fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), "utf-8");
      }
    } catch (e) {
      // Fall back to /tmp on serverless environments
      try {
        const { fs, path } = await getFsAndPath();
        if (fs && path) {
          const tempFile = path.join("/tmp", "state.json");
          fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), "utf-8");
        }
      } catch (err) {
        // Ignore write errors
      }
    }
  }

  // 2. Write to KV store for cloud deployments
  try {
    await fetch(KV_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(state),
    });
  } catch (e) {
    console.error("KV save failed", e);
  }
}

export const getServerState = createServerFn("GET", async () => {
  return await fetchState();
});

export const syncServerState = createServerFn(
  "POST",
  async (payload: { state: StoreState }) => {
    await saveState(payload.state);
    return payload.state;
  }
);

export const resetServerState = createServerFn("POST", async () => {
  const fresh: StoreState = {
    stopStats: structuredClone(BASELINE),
    active: [],
    feed: [{ id: "seed-reset", text: "Demo state reset to baseline", time: Date.now() }],
    trips: TRIPS,
  };
  await saveState(fresh);
  return fresh;
});
