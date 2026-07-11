import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bus, MapPin } from "lucide-react";

export function PhoneMockup() {
  const [eta, setEta] = useState(9);
  useEffect(() => {
    const id = setInterval(() => setEta((e) => (e <= 1 ? 12 : e - 1)), 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <Link
      to="/ride"
      className="relative block h-[560px] w-[280px] rounded-[2.5rem] border-[10px] border-foreground/90 bg-background shadow-2xl transition hover:-translate-y-1"
      title="Open the real rider view"
    >
      <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/90" />
      <div className="flex h-full flex-col overflow-hidden rounded-[1.8rem] bg-gradient-to-b from-primary/10 via-background to-background p-5 pt-10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> You're at{" "}
          <span className="font-semibold text-foreground">Faculty</span>
        </div>
        <div className="mt-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Next shuttle → PESSA
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-6xl font-semibold text-primary tabular-nums">
              {eta}
            </span>
            <span className="text-xl text-muted-foreground">mins</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">based on 14 recent trips</div>
        </div>
        <div className="mt-6 space-y-2 rounded-xl border border-border bg-card p-3">
          {["Main Gate", "New Hall", "Moremi", "Faculty", "PESSA"].map((s, i) => (
            <div key={s} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${i === 3 ? "bg-primary animate-pulse" : "bg-muted-foreground/40"}`}
                />
                <span className={i === 3 ? "font-medium text-foreground" : "text-muted-foreground"}>
                  {s}
                </span>
              </div>
              <span className="tabular-nums text-muted-foreground">{[3, 6, 9, 12, 15][i]}m</span>
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
          <Bus className="h-4 w-4" />
          I'm on Shuttle A
        </div>
      </div>
    </Link>
  );
}
