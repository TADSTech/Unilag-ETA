import { createFileRoute } from "@tanstack/react-router";
import { RouteMap, LiveEtaPanel } from "@/components/dashboard/widgets";

export const Route = createFileRoute("/dashboard/map")({
  component: MapPage,
});

function MapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Live Map</h1>
        <p className="text-muted-foreground">Real-time position of active shuttles.</p>
      </div>
      <RouteMap />
      <LiveEtaPanel />
    </div>
  );
}
