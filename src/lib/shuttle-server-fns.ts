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
  Faculty: { totalMin: 5 * 8, count: 8 },
  Moremi: { totalMin: 9 * 8, count: 8 },
  PESSA: { totalMin: 12 * 8, count: 8 },
};

// Server-side global in-memory state
let serverState: StoreState = {
  stopStats: structuredClone(BASELINE),
  active: [],
  feed: [{ id: "seed-1", text: "Baseline seeded from 8 manually timed trips", time: Date.now() }],
};

export const getServerState = createServerFn("GET", async () => {
  return serverState;
});

export const syncServerState = createServerFn(
  "POST",
  async (payload: { state: StoreState }) => {
    serverState = payload.state;
    return serverState;
  }
);

export const resetServerState = createServerFn("POST", async () => {
  serverState = {
    stopStats: structuredClone(BASELINE),
    active: [],
    feed: [{ id: "seed-reset", text: "Demo state reset to baseline", time: Date.now() }],
  };
  return serverState;
});
