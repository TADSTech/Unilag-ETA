import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RIDERS } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/riders")({
  component: Riders,
});

function Riders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Riders</h1>
        <p className="text-muted-foreground">
          Anonymous handles for students contributing check-ins.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Top contributors</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {RIDERS.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                      {r.handle.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">@{r.handle}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.id} · last seen {r.lastSeen}
                    </div>
                  </div>
                </div>
                <div className="text-sm tabular-nums text-muted-foreground">{r.trips} taps</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
