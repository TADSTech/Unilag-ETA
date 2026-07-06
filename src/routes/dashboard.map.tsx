import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LiveEtaPanel } from "@/components/dashboard/widgets";
import { Bus } from "lucide-react";

export const Route = createFileRoute("/dashboard/map")({
  component: MapPage,
});

// Real UNILAG stop coordinates (lat/lng)
const STOPS = [
  { name: "Main Gate (Jaja)", lat: 6.5167, lng: 3.3842, eta: 3 },
  { name: "Faculty of Science", lat: 6.5198, lng: 3.3891, eta: 7 },
  { name: "Moremi Hall", lat: 6.5224, lng: 3.3935, eta: 11 },
  { name: "PESSA", lat: 6.5176, lng: 3.3965, eta: 14 },
];

// Shuttle positions (animated between stops)
const SHUTTLE_ROUTE = STOPS.map((s) => [s.lat, s.lng]);

function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<unknown>(null);
  const shuttleMarker = useRef<unknown>(null);
  const [pos, setPos] = useState(0);
  const [tick, setTick] = useState(0);

  // Animate shuttle along route
  useEffect(() => {
    const id = setInterval(() => {
      setPos((p) => (p + 0.008) % 1);
      setTick((t) => t + 1);
    }, 100);
    return () => clearInterval(id);
  }, []);

  // Init Leaflet
  useEffect(() => {
    if (typeof window === "undefined" || leafletMap.current) return;
    import("leaflet").then((L) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const map = L.map(mapRef.current!, {
        center: [6.5198, 3.3905],
        zoom: 16,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Draw route line
      const latlngs = STOPS.map((s) => [s.lat, s.lng] as [number, number]);
      L.polyline(latlngs, { color: "oklch(0.38 0.09 155)", weight: 4, dashArray: "8 6", opacity: 0.7 }).addTo(map);

      // Stop markers
      STOPS.forEach((s) => {
        const icon = L.divIcon({
          html: `<div style="width:14px;height:14px;background:white;border:3px solid oklch(0.38 0.09 155);border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
          className: "", iconAnchor: [7, 7],
        });
        L.marker([s.lat, s.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${s.name}</b><br>ETA: ~${s.eta} min`);
      });

      // Shuttle marker
      const sIcon = L.divIcon({
        html: `<div style="width:28px;height:28px;background:oklch(0.78 0.16 75);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.35);border:2px solid white;font-size:14px">🚌</div>`,
        className: "", iconAnchor: [14, 14],
      });
      shuttleMarker.current = L.marker([STOPS[0].lat, STOPS[0].lng], { icon: sIcon }).addTo(map);
      leafletMap.current = map;
    });
    return () => {
      if (leafletMap.current) {
        (leafletMap.current as { remove: () => void }).remove();
        leafletMap.current = null;
        shuttleMarker.current = null;
      }
    };
  }, []);

  // Move shuttle marker
  useEffect(() => {
    if (!shuttleMarker.current) return;
    const pts = SHUTTLE_ROUTE;
    const total = pts.length - 1;
    const seg = Math.floor(pos * total);
    const t = (pos * total) % 1;
    const a = pts[Math.min(seg, pts.length - 1)];
    const b = pts[Math.min(seg + 1, pts.length - 1)];
    const lat = a[0] + (b[0] - a[0]) * t;
    const lng = a[1] + (b[1] - a[1]) * t;
    (shuttleMarker.current as { setLatLng: (ll: [number, number]) => void }).setLatLng([lat, lng]);
  }, [pos]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Live Map</h1>
        <p className="text-muted-foreground">Real-time shuttle position on UNILAG campus.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-4 w-4 text-primary" /> Shuttle A · Gate → PESSA
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> live
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div ref={mapRef} className="h-[480px] w-full rounded-b-2xl overflow-hidden" />
        </CardContent>
      </Card>

      <LiveEtaPanel />
    </div>
  );
}
