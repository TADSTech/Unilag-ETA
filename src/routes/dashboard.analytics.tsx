import { createFileRoute } from "@tanstack/react-router";
import { TripsOverTimeChart, HeatMap, DemandChart } from "@/components/dashboard/widgets";
import { TRIPS_OVER_TIME } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/analytics")({
  component: Analytics,
});

function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Analytics</h1>
        <p className="text-muted-foreground">Trends across trips, ETA accuracy, and demand.</p>
      </div>
      <TripsOverTimeChart data={TRIPS_OVER_TIME} />
      <div className="grid gap-6 lg:grid-cols-2">
        <HeatMap />
        <DemandChart />
      </div>
    </div>
  );
}
