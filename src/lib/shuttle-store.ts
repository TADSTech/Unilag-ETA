import { STOPS, type Stop } from "@/lib/mock-data";
import { getServerState, syncServerState } from "./shuttle-server-fns";

export type ShuttleId = "A";

type StopStat = { totalMin: number; count: number };

type ActiveRide = {
  id: string;
  shuttle: ShuttleId;
  boardStop: Stop;
  boardTime: number;
};

type FeedEvent = { id: string; text: string; time: number };

type StoreState = {
  stopStats: Record<Stop, StopStat>;
  active: ActiveRide[];
  feed: FeedEvent[];
};

const STORE_KEY = "shuttle-eta-store-v1";
const MY_RIDE_KEY = "shuttle-eta-my-ride-v1";
const CHANGE_EVENT = "shuttle-eta-store-change";
export const AUTO_CHECKOUT_MIN = 45;
const FEED_LIMIT = 20;

// Seeded from the eight manual timings the team walked (Gate -> Faculty -> Moremi -> PESSA)
// before writing any code, so the app has a real baseline from tap #1.
const BASELINE: Record<Stop, StopStat> = {
  "Main Gate": { totalMin: 6 * 8, count: 8 },
  Faculty: { totalMin: 5 * 8, count: 8 },
  Moremi: { totalMin: 9 * 8, count: 8 },
  PESSA: { totalMin: 12 * 8, count: 8 },
};

function freshState(): StoreState {
  return {
    stopStats: structuredClone(BASELINE),
    active: [],
    feed: [{ id: "seed-1", text: "Baseline seeded from 8 manually timed trips", time: Date.now() }],
  };
}

function isBrowser() {
  return typeof window !== "undefined";
}

// Always parses a brand-new object — safe to mutate before calling save().
function loadFresh(): StoreState {
  if (!isBrowser()) return freshState();
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as StoreState;
    for (const s of STOPS) {
      if (!parsed.stopStats[s]) parsed.stopStats[s] = { ...BASELINE[s] };
    }
    return parsed;
  } catch {
    return freshState();
  }
}

// useSyncExternalStore requires getSnapshot to return a referentially stable
// value when nothing changed, so this caches by the raw localStorage string.
let cachedRaw: string | null | undefined = undefined;
let cachedState: StoreState = freshState();

export function getSnapshot(): StoreState {
  const raw = isBrowser() ? window.localStorage.getItem(STORE_KEY) : null;
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  cachedState = loadFresh();
  return cachedState;
}

function save(state: StoreState) {
  if (!isBrowser()) return;
  const raw = JSON.stringify(state);
  window.localStorage.setItem(STORE_KEY, raw);
  cachedRaw = raw;
  cachedState = state;
  window.dispatchEvent(new Event(CHANGE_EVENT));
  syncServerState({ state }).catch(() => {});
}

// client polling loop to get live updates from server memory
if (isBrowser()) {
  setInterval(async () => {
    try {
      const serverState = await getServerState();
      if (!serverState) return;
      const localRaw = window.localStorage.getItem(STORE_KEY);
      const serverRaw = JSON.stringify(serverState);
      if (localRaw !== serverRaw) {
        window.localStorage.setItem(STORE_KEY, serverRaw);
        cachedRaw = serverRaw;
        cachedState = serverState;
        window.dispatchEvent(new Event(CHANGE_EVENT));
      }
    } catch {
      // Offline/unreachable fallback
    }
  }, 2500);
}

export function subscribe(cb: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener("storage", cb);
  window.addEventListener(CHANGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(CHANGE_EVENT, cb);
  };
}

export function getMyRideId(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(MY_RIDE_KEY);
}

function setMyRideId(id: string | null) {
  if (!isBrowser()) return;
  if (id) window.localStorage.setItem(MY_RIDE_KEY, id);
  else window.localStorage.removeItem(MY_RIDE_KEY);
}

export function getMyActiveRide(): ActiveRide | null {
  const id = getMyRideId();
  if (!id) return null;
  const state = loadFresh();
  return state.active.find((r) => r.id === id) ?? null;
}

function pushFeed(state: StoreState, text: string) {
  state.feed = [
    { id: `${Date.now()}-${Math.random()}`, text, time: Date.now() },
    ...state.feed,
  ].slice(0, FEED_LIMIT);
}

export function checkIn(stop: Stop, shuttle: ShuttleId = "A"): ActiveRide {
  const state = loadFresh();
  sweepStaleIn(state);
  const ride: ActiveRide = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    shuttle,
    boardStop: stop,
    boardTime: Date.now(),
  };
  state.active.push(ride);
  pushFeed(state, `Student tapped "I'm on Shuttle ${shuttle}" at ${stop}`);
  save(state);
  setMyRideId(ride.id);
  return ride;
}

export function checkOut(
  alightStop: Stop,
): { boardStop: Stop; alightStop: Stop; minutes: number } | null {
  const myId = getMyRideId();
  if (!myId) return null;
  const state = loadFresh();
  const ride = state.active.find((r) => r.id === myId);
  setMyRideId(null);
  if (!ride) return null;
  state.active = state.active.filter((r) => r.id !== myId);

  const minutes = Math.max(0.5, (Date.now() - ride.boardTime) / 60000);

  // estimate total elapsed-from-gate for the alight stop's rolling average,
  // accounting for however much of the route the rider had already covered
  // before they boarded.
  const priorEstimate = state.stopStats[ride.boardStop]
    ? state.stopStats[ride.boardStop].totalMin / state.stopStats[ride.boardStop].count
    : 0;
  const totalEstimate = ride.boardStop === STOPS[0] ? minutes : priorEstimate + minutes;

  const stat = state.stopStats[alightStop];
  state.stopStats[alightStop] = { totalMin: stat.totalMin + totalEstimate, count: stat.count + 1 };

  pushFeed(state, `Student tapped "I'm off" at ${alightStop}`);
  save(state);
  return { boardStop: ride.boardStop, alightStop, minutes: Math.round(minutes * 10) / 10 };
}

function sweepStaleIn(state: StoreState) {
  const cutoff = Date.now() - AUTO_CHECKOUT_MIN * 60_000;
  const stale = state.active.filter((r) => r.boardTime < cutoff);
  if (stale.length === 0) return;
  state.active = state.active.filter((r) => r.boardTime >= cutoff);
  for (const r of stale) {
    if (r.id === getMyRideId()) setMyRideId(null);
    pushFeed(state, `Auto-checkout: no "I'm off" tap from a rider on Shuttle ${r.shuttle}`);
  }
}

export function sweepStale(): void {
  const state = loadFresh();
  const before = state.active.length;
  sweepStaleIn(state);
  if (state.active.length !== before) save(state);
}

export function computeEta(stop: Stop): { eta: number; trips: number } {
  const state = loadFresh();
  const stat = state.stopStats[stop];
  const avg = stat.totalMin / Math.max(1, stat.count);

  if (state.active.length === 0) {
    return { eta: Math.max(1, Math.round(avg)), trips: stat.count };
  }

  // use the ride that has been running longest — closest to arriving next
  const oldest = [...state.active].sort((a, b) => a.boardTime - b.boardTime)[0];
  const boardStat = state.stopStats[oldest.boardStop];
  const boardAvg = boardStat.totalMin / Math.max(1, boardStat.count);
  const elapsedSinceBoard = (Date.now() - oldest.boardTime) / 60000;
  const estimatedPosition =
    oldest.boardStop === STOPS[0] ? elapsedSinceBoard : boardAvg + elapsedSinceBoard;

  const remaining = avg - estimatedPosition;
  if (remaining > 0.4) {
    return { eta: Math.max(1, Math.round(remaining)), trips: stat.count };
  }
  // shuttle has likely already passed this stop — predict the next one
  return { eta: Math.max(1, Math.round(avg)), trips: stat.count };
}

export function getFeed(): FeedEvent[] {
  return loadFresh().feed;
}
