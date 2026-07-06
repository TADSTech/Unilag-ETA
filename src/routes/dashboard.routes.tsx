import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/routes")({
  component: Routes,
});

const routes = [
  { id: "A", name: "Gate → Faculty → PESSA", stops: 4, active: true, shuttles: 2 },
  { id: "B", name: "Gate → Moremi → New Hall", stops: 5, active: true, shuttles: 1 },
  { id: "C", name: "Sports Centre Loop", stops: 3, active: false, shuttles: 0 },
];

function Routes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Routes</h1>
        <p className="text-muted-foreground">Configure shuttle routes and stops.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routes.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Route {r.id}</CardTitle>
              <Badge variant={r.active ? "default" : "secondary"}>
                {r.active ? "Active" : "Paused"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-foreground">{r.name}</div>
              <div className="text-muted-foreground">
                {r.stops} stops · {r.shuttles} shuttle{r.shuttles !== 1 && "s"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
