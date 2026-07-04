import { createFileRoute } from "@tanstack/react-router";
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Overview</h1>
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
