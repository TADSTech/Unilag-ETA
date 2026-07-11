import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bus, MapPin, QrCode, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STOPS, type Stop } from "@/lib/mock-data";
import {
  AUTO_CHECKOUT_MIN,
  checkIn,
  checkOut,
  computeEta,
  getMyRideId,
  sweepStale,
} from "@/lib/shuttle-store";
import { useShuttleStore } from "@/hooks/use-shuttle-store";
import { useAuthModal, AuthModalProvider } from "@/hooks/use-auth-modal";
import { AuthModal } from "@/components/auth/AuthModal";
import { getMockUser, type MockUser } from "@/lib/mock-auth";

function isStop(v: unknown): v is Stop {
  return typeof v === "string" && (STOPS as readonly string[]).includes(v);
}

export const Route = createFileRoute("/ride")({
  validateSearch: (search: Record<string, unknown>): { stop?: Stop } =>
    isStop(search.stop) ? { stop: search.stop } : {},
  head: () => ({
    meta: [
      { title: "Rider check-in — Shuttle ETA" },
      {
        name: "description",
        content: "Scan the QR at your stop, tap when you board, tap when you're off.",
      },
    ],
  }),
  component: RidePage,
});

function RidePage() {
  return (
    <AuthModalProvider>
      <RiderView />
      <AuthModal />
      <Toaster position="top-center" />
    </AuthModalProvider>
  );
}

function relativeTime(ts: number) {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
}

function RiderView() {
  const { stop } = Route.useSearch();
  const { openModal } = useAuthModal();
  const [selectedStop, setSelectedStop] = useState<Stop>(stop ?? STOPS[0]);
  const [destinationStop, setDestinationStop] = useState<Stop>(
    STOPS[STOPS.indexOf(selectedStop) + 1] ?? STOPS[STOPS.length - 1]
  );
  const [tick, setTick] = useState(0);
  const [user, setUser] = useState<MockUser | null>(null);
  const store = useShuttleStore();

  useEffect(() => {
    const idx = STOPS.indexOf(selectedStop);
    const nextStop = STOPS[idx + 1] ?? STOPS[STOPS.length - 1];
    setDestinationStop(nextStop);
  }, [selectedStop]);

  useEffect(() => {
    setUser(getMockUser());
    const onAuth = () => setUser(getMockUser());
    window.addEventListener("shuttle-eta-auth", onAuth);
    return () => window.removeEventListener("shuttle-eta-auth", onAuth);
  }, []);

  useEffect(() => {
    sweepStale();
    const id = setInterval(() => {
      sweepStale();
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const myRideId = getMyRideId();
  const myRide = useMemo(
    () => store.active.find((r) => r.id === myRideId) ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store.active, myRideId, tick],
  );

  const eta = useMemo(
    () => computeEta(selectedStop),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedStop, store, tick],
  );

  const elapsedLabel = myRide
    ? (() => {
        const mins = Math.floor((Date.now() - myRide.boardTime) / 60000);
        const secs = Math.floor(((Date.now() - myRide.boardTime) % 60000) / 1000);
        return `${mins}m ${secs}s`;
      })()
    : null;

  function handleCheckIn() {
    checkIn(selectedStop, destinationStop);
    toast.success(`Boarded Shuttle A: ${selectedStop} → ${destinationStop}`);
  }

  function handleCheckOut() {
    const alight = myRide ? myRide.destinationStop : selectedStop;
    const result = checkOut(alight);
    if (result) {
      toast.success(
        `Trip logged: ${result.minutes} min from ${result.boardStop} to ${result.alightStop}. ETA data updated!`,
      );
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-display text-sm font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bus className="h-4 w-4" />
            </span>
            Shuttle ETA
          </Link>
          {user ? (
            <span className="text-xs text-muted-foreground">Signed in as {user.name}</span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => openModal("signin")}
            >
              <LogIn className="h-3.5 w-3.5" /> Sign in
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-xl space-y-6 px-4 py-8">
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
          <QrCode className="h-4 w-4 text-primary" />
          Simulating a QR scan — pick the stop printed on the code below.
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            You're at
          </label>
          <Select value={selectedStop} onValueChange={(v) => setSelectedStop(v as Stop)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STOPS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> Next shuttle → {selectedStop}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-6xl font-semibold tabular-nums text-primary">
              {eta.eta}
            </span>
            <span className="text-xl text-muted-foreground">mins</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            based on {eta.trips} trip{eta.trips === 1 ? "" : "s"}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          {myRide ? (
            <>
              <div className="text-sm text-muted-foreground">
                On Shuttle {myRide.shuttle} · boarded at{" "}
                <span className="font-medium text-foreground">{myRide.boardStop}</span> → going to{" "}
                <span className="font-medium text-foreground">{myRide.destinationStop}</span>
              </div>
              <div className="mt-1 font-display text-2xl font-semibold tabular-nums">
                {elapsedLabel}
              </div>
              <Button size="lg" className="mt-4 w-full gap-2" onClick={handleCheckOut}>
                <LogOut className="h-4 w-4" /> I'm off
              </Button>
              <div className="mt-2 text-[11px] text-muted-foreground">
                Forget to tap? Auto-checkout kicks in after {AUTO_CHECKOUT_MIN} minutes so the data
                stays clean.
              </div>
            </>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                Boarding at <span className="font-medium text-foreground">{selectedStop}</span>?
              </div>
              <div className="mt-3 text-left space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Where are you going?
                </label>
                <Select value={destinationStop} onValueChange={(v) => setDestinationStop(v as Stop)}>
                  <SelectTrigger className="w-full h-9 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STOPS.filter(s => STOPS.indexOf(s) > STOPS.indexOf(selectedStop)).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                    {STOPS.indexOf(selectedStop) === STOPS.length - 1 && (
                      <SelectItem value={selectedStop}>{selectedStop}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button size="lg" className="mt-4 w-full gap-2" onClick={handleCheckIn}>
                <Bus className="h-4 w-4" /> I'm on Shuttle A
              </Button>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent activity
          </div>
          <ul className="space-y-2">
            {store.feed.slice(0, 6).map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2 text-sm"
              >
                <span className="truncate">{f.text}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {relativeTime(f.time)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          No download, no sign-up required to use this. Sign in only if you want your ride history
          saved.
        </p>
      </main>
    </div>
  );
}
