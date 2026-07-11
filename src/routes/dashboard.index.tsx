import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { getMockUser, type MockUser } from "@/lib/mock-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STOPS, type Stop } from "@/lib/mock-data";
import { checkIn } from "@/lib/shuttle-store";
import {
  Bus,
  Clock,
  Navigation,
  CheckCircle,
  Leaf,
  History,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  KpiCards,
  LiveEtaPanel,
  RouteMap,
  HeatMap,
  DemandChart,
  TripsTable,
  CheckinFeed,
} from "@/components/dashboard/widgets";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function Overview() {
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    setUser(getMockUser());
    const onChange = () => setUser(getMockUser());
    window.addEventListener("shuttle-eta-auth", onChange);
    return () => window.removeEventListener("shuttle-eta-auth", onChange);
  }, []);

  if (!user) return null;

  if (user.role === "student") {
    return <StudentDashboard user={user} />;
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Admin Overview</h1>
        <p className="text-muted-foreground">Live pulse of the UNILAG shuttle network.</p>
      </div>
      <KpiCards />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RouteMap />
          <HeatMap />
          <TripsTable />
        </div>
        <div className="space-y-6">
          <LiveEtaPanel />
          <DemandChart />
          <CheckinFeed />
        </div>
      </div>
    </div>
  );
}

function StudentDashboard({ user }: { user: MockUser }) {
  const navigate = useNavigate();
  const [boardStop, setBoardStop] = useState<Stop>("Main Gate");
  const [alightStop, setAlightStop] = useState<Stop>("Faculty");

  useEffect(() => {
    const idx = STOPS.indexOf(boardStop);
    const nextStop = STOPS[idx + 1] ?? STOPS[STOPS.length - 1];
    setAlightStop(nextStop);
  }, [boardStop]);

  function handleBoard() {
    checkIn(boardStop, alightStop);
    toast.success(`Trip started: ${boardStop} → ${alightStop}. Tapping board successful!`);
    navigate({ to: "/ride" });
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl font-semibold">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">Ready to board? Avoid waiting at stops with live campus ETAs.</p>
      </div>

      {/* Student Personal Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Trips Take</div>
                <div className="mt-1 font-display text-3xl font-semibold">14</div>
                <div className="mt-1 text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +3 this week
                </div>
              </div>
              <Bus className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Time Saved</div>
                <div className="mt-1 font-display text-3xl font-semibold">112m</div>
                <div className="mt-1 text-xs text-muted-foreground">vs waiting in queues</div>
              </div>
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Eco Savings</div>
                <div className="mt-1 font-display text-3xl font-semibold">5.6kg</div>
                <div className="mt-1 text-xs text-green-500 flex items-center gap-1">
                  <Leaf className="h-3 w-3" /> CO2 Offset
                </div>
              </div>
              <Leaf className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Boarding Widget */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Quick Boarding
            </CardTitle>
            <CardDescription>Skip scanning the QR code and board directly from your dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Boarding stop</label>
                <Select value={boardStop} onValueChange={(v) => setBoardStop(v as Stop)}>
                  <SelectTrigger>
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
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Destination stop</label>
                <Select value={alightStop} onValueChange={(v) => setAlightStop(v as Stop)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STOPS.filter(s => STOPS.indexOf(s) > STOPS.indexOf(boardStop)).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                    {STOPS.indexOf(boardStop) === STOPS.length - 1 && (
                      <SelectItem value={boardStop}>{boardStop}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full gap-2 h-10 mt-2" onClick={handleBoard}>
              <Bus className="h-4 w-4" /> Tap to Board Shuttle A
            </Button>
          </CardContent>
        </Card>

        {/* Live Shuttle ETAs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              Live Shuttle ETAs
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {STOPS.map((stop) => (
              <div key={stop} className="flex justify-between items-center text-sm border-b border-border pb-2 last:border-0 last:pb-0">
                <span className="text-muted-foreground">{stop}</span>
                <span className="font-semibold text-primary font-mono">
                  {stop === "Main Gate" ? "3m" : stop === "New Hall" ? "6m" : stop === "Moremi" ? "9m" : stop === "Faculty" ? "12m" : "Arrived"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Student Personal Trip History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            My Recent Trips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-2 pr-4 font-medium">Route</th>
                  <th className="py-2 pr-4 font-medium">Boarding stop</th>
                  <th className="py-2 pr-4 font-medium">Destination stop</th>
                  <th className="py-2 pr-4 font-medium">Duration</th>
                  <th className="py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { route: "Shuttle A", from: "Main Gate", to: "Faculty", duration: "9 mins", date: "Yesterday, 8:12 AM" },
                  { route: "Shuttle A", from: "Faculty", to: "PESSA", duration: "4 mins", date: "9 Jul, 4:45 PM" },
                  { route: "Shuttle A", from: "New Hall", to: "Faculty", duration: "6 mins", date: "8 Jul, 9:02 AM" },
                  { route: "Shuttle A", from: "Main Gate", to: "New Hall", duration: "3 mins", date: "6 Jul, 7:55 AM" },
                ].map((t, idx) => (
                  <tr key={idx} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 pr-4 font-medium text-foreground">{t.route}</td>
                    <td className="py-2.5 pr-4">{t.from}</td>
                    <td className="py-2.5 pr-4">{t.to}</td>
                    <td className="py-2.5 pr-4">{t.duration}</td>
                    <td className="py-2.5 text-muted-foreground">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
