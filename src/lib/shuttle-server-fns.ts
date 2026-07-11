import { createServerFn } from "@tanstack/react-start";
import { STOPS, type Stop } from "./mock-data";

export type StopStat = { totalMin: number; count: number };
export type ActiveRide = {
  id: string;
  shuttle: string;
  boardStop: Stop;
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

// Use a free public KV store to persist state across stateless Vercel edge/serverless requests.
const KV_ENDPOINT = "https://kvdb.io/Kx9YmZ8p2qRtS8b5MhG67D/state";

async function fetchFromKv(): Promise<StoreState> {
  try {
    const res = await fetch(KV_ENDPOINT);
    if (res.ok) {
      const data = await res.json();
      if (data && data.stopStats) {
        return data as StoreState;
      }
    }
  } catch (e) {
    console.error("KV fetch failed, using local fallback", e);
  }
  return INITIAL_STATE;
}

async function saveToKv(state: StoreState): Promise<void> {
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
  return await fetchFromKv();
});

export const syncServerState = createServerFn(
  "POST",
  async (payload: { state: StoreState }) => {
    await saveToKv(payload.state);
    return payload.state;
  }
);

export const resetServerState = createServerFn("POST", async () => {
  const fresh: StoreState = {
    stopStats: structuredClone(BASELINE),
    active: [],
    feed: [{ id: "seed-reset", text: "Demo state reset to baseline", time: Date.now() }],
  };
  await saveToKv(fresh);
  return fresh;
});
