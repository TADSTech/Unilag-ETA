import { createFileRoute } from "@tanstack/react-router";
import { TripsTable } from "@/components/dashboard/widgets";

export const Route = createFileRoute("/dashboard/trips")({
  component: Trips,
});

function Trips() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Trips</h1>
        <p className="text-muted-foreground">Every completed trip, seeded from student taps.</p>
      </div>
      <TripsTable limit={24} />
    </div>
  );
}
