import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/settings")({
  component: Settings,
});

function Settings() {
  const [poll, setPoll] = useState([8]);
  const [autoOut, setAutoOut] = useState([15]);
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Tune the estimation loop and notifications.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Estimation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Poll interval</Label>
              <span className="text-sm text-muted-foreground">{poll[0]}s</span>
            </div>
            <Slider value={poll} onValueChange={setPoll} min={2} max={30} step={1} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Auto-checkout after</Label>
              <span className="text-sm text-muted-foreground">{autoOut[0]} min</span>
            </div>
            <Slider value={autoOut} onValueChange={setAutoOut} min={5} max={30} step={1} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { l: "Send peak-hour alerts to PESSA admins", d: "When >80% of shuttles are occupied" },
            { l: "Notify on route pause", d: "Slack + email digest" },
            { l: "Weekly analytics email", d: "Every Monday 8am" },
          ].map((n) => (
            <div key={n.l} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{n.l}</div>
                <div className="text-xs text-muted-foreground">{n.d}</div>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
