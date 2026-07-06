import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Bus, MapPin, CheckCircle2, LogOut, Clock, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMockUser, signOutMock } from "@/lib/mock-auth";
import { STOPS, ETA_BY_STOP, type Stop } from "@/lib/mock-data";

export const Route = createFileRoute("/ride")({
  head: () => ({ meta: [{ title: "Shuttle ETA · Rider View" }] }),
  component: RiderPage,
});

type BoardState = "idle" | "onboard" | "alighted";

function RiderPage() {
  const navigate = useNavigate();
  const user = getMockUser();
  const [state, setState] = useState<BoardState>("idle");
  const [stop, setStop] = useState<Stop>("Main Gate");
  const [tick, setTick] = useState(0);
  const [tapTime, setTapTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!tapTime) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - tapTime.getTime()) / 1000)), 1000);
    return () => clearInterval(id);
  }, [tapTime]);

  function board() {
    setState("onboard");
    setTapTime(new Date());
    setElapsed(0);
  }
  function alight() {
    setState("alighted");
  }
  function reset() {
    setState("idle");
    setTapTime(null);
    setElapsed(0);
  }

  const eta = ((ETA_BY_STOP[stop].eta + tick) % 12) + 1;
  const riders = 12 + (tick * 3) % 22;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur">
        <div className="flex items-center gap-2 font-display text-base font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bus className="h-4 w-4" />
          </span>
          Shuttle ETA
        </div>
        <div className="flex items-center gap-2">
          {user && <span className="hidden text-sm text-muted-foreground sm:block">@{user.name}</span>}
          <Button variant="ghost" size="icon" onClick={() => { signOutMock(); navigate({ to: "/" }); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-4 py-6">
        {/* Stop selector */}
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">You're at</p>
          <div className="grid grid-cols-2 gap-2">
            {STOPS.map((s) => (
              <button
                key={s}
                onClick={() => setStop(s)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  stop === s
                    ? "border-primary bg-primary/8 text-primary shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                <MapPin className={`h-3.5 w-3.5 ${stop === s ? "text-primary" : "text-muted-foreground"}`} />
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ETA card */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Next shuttle → PESSA
            </div>
            <Badge variant="secondary" className="gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> live
            </Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-7xl font-bold tabular-nums text-primary">{eta}</span>
            <span className="text-xl text-muted-foreground">mins</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            based on {ETA_BY_STOP[stop].trips} recent trips
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{riders} on board</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Updates every 4s</span>
          </div>
        </div>

        {/* All stops ETA */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-4 py-3 text-sm font-semibold">All stops</div>
          {STOPS.map((s, i) => {
            const e = ((ETA_BY_STOP[s].eta + tick) % 12) + 1;
            const isHere = s === stop;
            return (
              <div key={s} className={`flex items-center justify-between px-4 py-3 ${i < STOPS.length - 1 ? "border-b border-border/50" : ""} ${isHere ? "bg-primary/5" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${isHere ? "bg-primary" : "bg-muted-foreground/30"}`} />
                  <span className={`text-sm ${isHere ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{s}</span>
                  {isHere && <Badge variant="outline" className="text-[10px] py-0 px-1.5">You</Badge>}
                </div>
                <span className={`font-display text-lg font-semibold tabular-nums ${isHere ? "text-primary" : "text-foreground"}`}>{e}m</span>
              </div>
            );
          })}
        </div>

        {/* Board / Alight CTA */}
        {state === "idle" && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <p className="text-sm font-medium text-foreground">Help improve predictions for everyone</p>
            <p className="mt-1 text-xs text-muted-foreground">Tap when you board so the system learns your real travel time.</p>
            <Button className="mt-4 w-full gap-2 text-base" size="lg" onClick={board}>
              <Bus className="h-5 w-5" /> I'm on Shuttle A
            </Button>
          </div>
        )}

        {state === "onboard" && (
          <div className="rounded-2xl border border-primary bg-primary/8 p-5">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              You're on board — riding from {stop}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Riding for {Math.floor(elapsed / 60)}m {elapsed % 60}s · tap when you get off.
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000"
                style={{ width: `${Math.min((elapsed / 900) * 100, 100)}%` }}
              />
            </div>
            <Button variant="outline" className="mt-4 w-full gap-2" size="lg" onClick={alight}>
              <ChevronRight className="h-5 w-5" /> I'm getting off
            </Button>
          </div>
        )}

        {state === "alighted" && (
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <p className="font-semibold text-foreground">Thanks! Trip recorded.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Rode for {Math.floor(elapsed / 60)}m {elapsed % 60}s — this improves the ETA for everyone.
            </p>
            <Button variant="outline" className="mt-4 w-full" onClick={reset}>Start again</Button>
          </div>
        )}
      </main>
    </div>
  );
}
