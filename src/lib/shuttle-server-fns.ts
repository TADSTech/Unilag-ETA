import { createServerFn } from "@tanstack/react-start";
import { STOPS, type Stop } from "./mock-data";
import fs from "node:fs";
import path from "node:path";

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
};

const KV_ENDPOINT = "https://kvdb.io/Kx9YmZ8p2qRtS8b5MhG67D/state";
const STATE_FILE = path.join(process.cwd(), "state.json");

// Persistent storage: tries local filesystem first (perfect for local running), falls back to KV store & in-memory.
async function fetchState(): Promise<StoreState> {
  // 1. Try reading local JSON file
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.stopStats) return parsed as StoreState;
    }
  } catch (e) {
    // Ignore local filesystem read errors on read-only hosting
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
  // 1. Try writing local JSON file
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (e) {
    // Fall back to /tmp on serverless environments
    try {
      const tempFile = path.join("/tmp", "state.json");
      fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), "utf-8");
    } catch (err) {
      // Ignore write errors
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
  };
  await saveState(fresh);
  return fresh;
});
