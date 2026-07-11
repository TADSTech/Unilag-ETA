import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STOPS, type Stop } from "@/lib/mock-data";
import { checkIn, checkOut, getSnapshot } from "@/lib/shuttle-store";
import { resetServerState, syncServerState } from "@/lib/shuttle-server-fns";
import { Sliders, RotateCcw, Bus, LogOut, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export function PresenterConsole() {
  const [open, setOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState<Stop>("Faculty");
  const [activeRidesCount, setActiveRidesCount] = useState(0);

  useEffect(() => {
    // Keep track of active rides to show simulate arrival button
    const updateActiveRides = () => {
      const snap = getSnapshot();
      setActiveRidesCount(snap.active.length);
    };

    updateActiveRides();
    window.addEventListener("shuttle-eta-store-change", updateActiveRides);
    return () => window.removeEventListener("shuttle-eta-store-change", updateActiveRides);
  }, []);

  async function handleReset() {
    try {
      await resetServerState();
      // Wiping local storage
      window.localStorage.removeItem("shuttle-eta-store-v1");
      window.localStorage.removeItem("shuttle-eta-my-ride-v1");
      window.dispatchEvent(new Event("shuttle-eta-store-change"));
      toast.success("Demo environment reset to baseline!");
    } catch {
      toast.error("Failed to reset server state");
    }
  }

  function handleSimulateBoarding() {
    const idx = STOPS.indexOf(selectedStop);
    const destination = idx < STOPS.length - 1 ? STOPS[idx + 1] : STOPS[STOPS.length - 1];
    checkIn(selectedStop, destination, "A");
    toast.success(`Boarding simulated: ${selectedStop} → ${destination}`);
  }

  function handleSimulateArrival() {
    const snap = getSnapshot();
    if (snap.active.length === 0) {
      toast.error("No active rides to simulate arrival");
      return;
    }
    // Check out using the active ride
    const result = checkOut(selectedStop);
    if (result) {
      toast.success(`Arrival simulated at ${selectedStop} (${result.minutes}m trip)`);
    } else {
      toast.error("Failed to simulate checkout");
    }
  }

  function handleSimulateTraffic() {
    const state = getSnapshot();
    // Add 15 mock rides/trips
    const newStats = { ...state.stopStats };
    // Add some random data to stats to boost the averages
    for (const stop of STOPS) {
      newStats[stop] = {
        totalMin: newStats[stop].totalMin + Math.floor(Math.random() * 80) + 20,
        count: newStats[stop].count + 5,
      };
    }
    const updatedState = {
      ...state,
      stopStats: newStats,
    };
    // Append to feed
    updatedState.feed = [
      { id: `traffic-${Date.now()}`, text: "Simulated rush hour traffic pattern", time: Date.now() },
      ...updatedState.feed,
    ].slice(0, 20);

    // Save and sync
    const raw = JSON.stringify(updatedState);
    window.localStorage.setItem("shuttle-eta-store-v1", raw);
    window.dispatchEvent(new Event("shuttle-eta-store-change"));
    syncServerState({ state: updatedState }).catch(() => {});
    toast.success("Simulated active peak traffic! Heatmap & charts updated.");
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {!open ? (
        <Button
          onClick={() => setOpen(true)}
          className="flex h-11 items-center gap-2 rounded-full shadow-lg border border-primary/20 bg-primary/95 text-primary-foreground hover:bg-primary px-4"
        >
          <Sliders className="h-4 w-4" />
          <span>Presenter Console</span>
        </Button>
      ) : (
        <Card className="w-80 border-border bg-card/95 p-4 shadow-2xl backdrop-blur relative animate-in slide-in-from-bottom-5">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 border-b border-border pb-2 mb-3">
            <Sliders className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold tracking-tight">Presenter Console</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Simulation controls */}
            <div className="space-y-2">
              <label className="font-medium text-muted-foreground">Select Stop for Simulation</label>
              <Select value={selectedStop} onValueChange={(v) => setSelectedStop(v as Stop)}>
                <SelectTrigger className="h-8">
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

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={handleSimulateBoarding}
              >
                <Bus className="h-3 w-3 text-primary" /> Board Shuttle A
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={handleSimulateArrival}
                disabled={activeRidesCount === 0}
              >
                <LogOut className="h-3 w-3 text-destructive" /> Arrive / Off
              </Button>
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Active Rides on Server:</span>
                <span className="font-mono font-bold text-foreground">{activeRidesCount}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 gap-1"
                onClick={handleSimulateTraffic}
              >
                <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" /> Simulate Rush Hour
              </Button>
            </div>

            {/* Reset controls */}
            <div className="border-t border-border pt-3">
              <Button
                variant="destructive"
                size="sm"
                className="w-full h-8 gap-1 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleReset}
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Demo Environment
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
