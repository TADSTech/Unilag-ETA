import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, Users, Target, TrendingUp, MapPin } from "lucide-react";
import {
  STOPS,
  ETA_BY_STOP,
  HEATMAP,
  DEMAND_BY_STOP,
  TRIPS,
  FEED_TEMPLATES,
  type Stop,
} from "@/lib/mock-data";
import { useShuttleStore } from "@/hooks/use-shuttle-store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export function KpiCards() {
  const store = useShuttleStore();
  const tripsCount = store.trips ? store.trips.length : 126;
  const activeCount = store.active ? store.active.length : 0;
  
  const kpis = [
    {
      label: "Active shuttles",
      value: String(Math.max(1, activeCount)),
      icon: Bus,
      delta: "+1 vs yesterday",
      tone: "text-primary",
    },
    { 
      label: "Riders on board", 
      value: String(activeCount * 12 + 15), 
      icon: Users, 
      delta: "peak: 82", 
      tone: "text-primary" 
    },
    { label: "ETA accuracy", value: "89%", icon: Target, delta: "+4% wk/wk", tone: "text-primary" },
    {
      label: "Trips today",
      value: String(tripsCount),
      icon: TrendingUp,
      delta: "of 140 target",
      tone: "text-primary",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <Card key={k.label}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{k.label}</div>
                <div className="mt-1 font-display text-3xl font-semibold">{k.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{k.delta}</div>
              </div>
              <k.icon className={`h-5 w-5 ${k.tone}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function LiveEtaPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live ETA by stop</CardTitle>
        <Badge variant="secondary" className="gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> live
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {STOPS.map((s) => {
          const base = ETA_BY_STOP[s].eta;
          const eta = ((base + tick) % 12) + 1;
          return (
            <div key={s} className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {s}
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-semibold tabular-nums text-primary">
                  {eta}
                </span>
                <span className="text-sm text-muted-foreground">mins</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                based on {ETA_BY_STOP[s].trips} trips
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function RouteMap() {
  const [pos, setPos] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPos((p) => (p + 0.02) % 1), 100);
    return () => clearInterval(id);
  }, []);
  const stops = [
    { x: 60, y: 200, name: "Main Gate" },
    { x: 180, y: 130, name: "New Hall" },
    { x: 300, y: 170, name: "Moremi" },
    { x: 440, y: 110, name: "Faculty" },
    { x: 560, y: 160, name: "PESSA" },
  ];
  const path = `M60 200 Q120 150 180 130 T300 170 T440 110 T560 160`;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Route map · Shuttle A</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/10 p-4">
          <svg viewBox="0 0 620 260" className="w-full">
            <path
              d={path}
              stroke="var(--color-primary)"
              strokeWidth="3"
              strokeDasharray="6 6"
              fill="none"
              opacity="0.4"
            />
            <path
              d={path}
              stroke="var(--color-primary)"
              strokeWidth="3"
              fill="none"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={1 - pos}
            />
            {stops.map((s) => (
              <g key={s.name}>
                <circle
                  cx={s.x}
                  cy={s.y}
                  r="8"
                  fill="var(--color-background)"
                  stroke="var(--color-primary)"
                  strokeWidth="3"
                />
                <text
                  x={s.x}
                  y={s.y - 16}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  {s.name}
                </text>
              </g>
            ))}
            {(() => {
              // approximate shuttle position along path
              const p = pos;
              const seg = Math.floor(p * (stops.length - 1));
              const t = (p * (stops.length - 1)) % 1;
              const a = stops[seg],
                b = stops[Math.min(seg + 1, stops.length - 1)];
              const x = a.x + (b.x - a.x) * t;
              const y = a.y + (b.y - a.y) * t;
              return (
                <g>
                  <circle cx={x} cy={y} r="14" fill="var(--color-accent)" opacity="0.3" />
                  <circle cx={x} cy={y} r="8" fill="var(--color-accent)" />
                </g>
              );
            })()}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}

export function HeatMap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Peak hours · last 7 days</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {HEATMAP.map((row, d) => (
            <div key={d} className="flex items-center gap-2">
              <span className="w-8 text-xs text-muted-foreground">{days[d]}</span>
              <div className="flex flex-1 gap-0.5">
                {row.map((v, h) => (
                  <div
                    key={h}
                    title={`${h}:00 · ${Math.round(v * 100)}%`}
                    className="h-4 flex-1 rounded-sm"
                    style={{
                      backgroundColor: `color-mix(in oklab, var(--color-primary) ${Math.round(v * 100)}%, var(--color-muted))`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DemandChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demand by stop</CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DEMAND_BY_STOP}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="stop" fontSize={12} stroke="var(--color-muted-foreground)" />
            <YAxis fontSize={12} stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
              }}
            />
            <Bar dataKey="riders" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TripsTable({ limit = 8 }: { limit?: number }) {
  const store = useShuttleStore();
  const displayTrips = store.trips || TRIPS;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent trips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-medium">Trip</th>
                <th className="py-2 pr-4 font-medium">Route</th>
                <th className="py-2 pr-4 font-medium">Duration</th>
                <th className="py-2 pr-4 font-medium">Riders</th>
                <th className="py-2 font-medium">Start</th>
              </tr>
            </thead>
            <tbody>
              {displayTrips.slice(0, limit).map((t) => (
                <tr key={t.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5 pr-4 font-mono text-xs">{t.id}</td>
                  <td className="py-2.5 pr-4">{t.route}</td>
                  <td className="py-2.5 pr-4">{t.durationMin} min</td>
                  <td className="py-2.5 pr-4">{t.riders}</td>
                  <td className="py-2.5 text-muted-foreground">
                    {new Date(t.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function CheckinFeed() {
  const [items, setItems] = useState<{ id: number; text: string; time: string }[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      text: FEED_TEMPLATES[i % FEED_TEMPLATES.length](STOPS[i % STOPS.length] as Stop),
      time: `${i * 3 + 1}s ago`,
    })),
  );
  useEffect(() => {
    let n = 100;
    const id = setInterval(() => {
      n += 1;
      const stop = STOPS[Math.floor(Math.random() * STOPS.length)] as Stop;
      const tpl = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)];
      setItems((prev) => [{ id: n, text: tpl(stop), time: "just now" }, ...prev.slice(0, 9)]);
    }, 2500);
    return () => clearInterval(id);
  }, []);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Check-in feed</CardTitle>
        <Badge variant="secondary" className="gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> live
        </Badge>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {items.map((i) => (
            <li
              key={i.id}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm"
            >
              <span>{i.text}</span>
              <span className="text-xs text-muted-foreground">{i.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function TripsOverTimeChart({
  data,
}: {
  data: { day: string; trips: number; accuracy: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trips & ETA accuracy · 14 days</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="day" fontSize={12} stroke="var(--color-muted-foreground)" />
            <YAxis fontSize={12} stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
              }}
            />
            <Line
              type="monotone"
              dataKey="trips"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="var(--color-accent)"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
