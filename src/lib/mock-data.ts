export const STOPS = ["Main Gate", "Faculty", "Moremi", "PESSA"] as const;
export type Stop = (typeof STOPS)[number];

export type Trip = {
  id: string;
  route: string;
  start: string;
  end: string;
  durationMin: number;
  riders: number;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);

export const TRIPS: Trip[] = Array.from({ length: 24 }, (_, i) => {
  const dur = Math.round(7 + rand() * 8);
  const startMinAgo = i * 17 + Math.round(rand() * 6);
  const start = new Date(Date.now() - startMinAgo * 60_000);
  const end = new Date(start.getTime() + dur * 60_000);
  return {
    id: `T-${1000 + i}`,
    route: "Gate → Faculty → PESSA",
    start: start.toISOString(),
    end: end.toISOString(),
    durationMin: dur,
    riders: 6 + Math.round(rand() * 22),
  };
});

export const ETA_BY_STOP: Record<Stop, { eta: number; trips: number }> = {
  "Main Gate": { eta: 3, trips: 42 },
  Faculty: { eta: 7, trips: 38 },
  Moremi: { eta: 11, trips: 29 },
  PESSA: { eta: 14, trips: 47 },
};

export const HEATMAP = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => {
    // Peaks around 7-9am and 4-6pm on weekdays
    const weekday = d < 5;
    const morning = Math.max(0, 1 - Math.abs(h - 8) / 3);
    const evening = Math.max(0, 1 - Math.abs(h - 17) / 3);
    const base = weekday ? morning + evening * 0.9 : (morning + evening) * 0.3;
    return Math.min(1, base + rand() * 0.15);
  }),
);

export const DEMAND_BY_STOP = STOPS.map((s) => ({
  stop: s,
  riders: 40 + Math.round(rand() * 120),
}));

export const TRIPS_OVER_TIME = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  trips: 18 + Math.round(rand() * 22),
  accuracy: 78 + Math.round(rand() * 18),
}));

export const RIDERS = Array.from({ length: 18 }, (_, i) => ({
  id: `R-${200 + i}`,
  handle: ["ada", "tunde", "chika", "kemi", "seyi", "zara", "emeka", "bola"][i % 8] + (i + 1),
  trips: 3 + Math.round(rand() * 40),
  lastSeen: `${1 + Math.round(rand() * 40)}m ago`,
}));

export const FEED_TEMPLATES = [
  (s: Stop) => `Student tapped "I'm on" at ${s}`,
  (s: Stop) => `Auto-checkout triggered near ${s}`,
  (s: Stop) => `Student tapped "I'm off" at ${s}`,
  (s: Stop) => `Shuttle A departed ${s}`,
];
