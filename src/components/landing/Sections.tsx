import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { QrCode, MousePointerClick, Brain, Wifi, WifiOff, Coins, Users } from "lucide-react";

export function ProblemStrip() {
  const items = [
    { k: "7:40am", v: "You're at Jaja Gate with zero info" },
    { k: "8:00am", v: "You either leave early or miss lab" },
    { k: "+15 min", v: "Queues form the second a shuttle appears" },
  ];
  return (
    <section id="problem" className="border-y border-border bg-muted/40 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-8 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          The problem isn't a lack of buses. It's zero visibility.
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((i) => (
            <div key={i.k} className="rounded-2xl border border-border bg-card p-6">
              <div className="font-display text-3xl font-semibold text-primary">{i.k}</div>
              <div className="mt-2 text-sm text-muted-foreground">{i.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      icon: QrCode,
      t: "Scan a QR code",
      d: "Printed at every stop. Opens straight to the ETA page — no download.",
    },
    {
      icon: MousePointerClick,
      t: "Tap when you board",
      d: "One button: 'I'm on Shuttle A'. Tap again when you leave.",
    },
    {
      icon: Brain,
      t: "System learns",
      d: "Rolling average across student taps. Every ride sharpens the next prediction.",
    },
  ];
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 max-w-2xl">
        <div className="text-sm font-medium uppercase tracking-wider text-primary">
          How it works
        </div>
        <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Three taps. No hardware. No cost to the school.
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.t} className="relative rounded-2xl border border-border bg-card p-6">
            <div className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
              Step {i + 1}
            </div>
            <s.icon className="h-8 w-8 text-primary" />
            <div className="mt-4 font-display text-xl font-semibold">{s.t}</div>
            <div className="mt-2 text-sm text-muted-foreground">{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WhyItWorks() {
  const items = [
    { icon: WifiOff, t: "No GPS needed", d: "Students are the tracking network." },
    { icon: Wifi, t: "Web only", d: "No app store, no download, no permissions." },
    { icon: Users, t: "Every tap improves it", d: "Predictions get sharper as usage grows." },
    { icon: Coins, t: "Free to run", d: "Static frontend + free-tier backend." },
  ];
  return (
    <section className="bg-primary text-primary-foreground py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-10 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Why this works.
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <div
              key={i.t}
              className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 backdrop-blur"
            >
              <i.icon className="h-6 w-6 text-accent" />
              <div className="mt-3 font-display text-lg font-semibold">{i.t}</div>
              <div className="mt-1 text-sm opacity-80">{i.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Roadmap() {
  const items = [
    { when: "MVP (48h)", what: "Gate → Faculty → PESSA, one route, live ETA" },
    { when: "Week 2", what: "Add all UNILAG routes + stops" },
    { when: "Month 1", what: "Live map view for riders" },
    { when: "Month 2", what: "PESSA admin dashboard: peak hours, demand heatmap" },
    { when: "Semester", what: "Port to FUTA, OAU, ABU, UI" },
  ];
  return (
    <section id="roadmap" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 max-w-2xl">
        <div className="text-sm font-medium uppercase tracking-wider text-primary">Roadmap</div>
        <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          What ships after the hackathon.
        </h2>
      </div>
      <ol className="relative border-l-2 border-primary/20 pl-8">
        {items.map((i, idx) => (
          <li key={i.when} className="mb-8 last:mb-0">
            <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-background" />
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">
              {i.when}
            </div>
            <div className="mt-1 text-lg text-foreground">{i.what}</div>
            {idx === 0 && (
              <div className="mt-1 text-xs text-accent-foreground/70 bg-accent/30 inline-block rounded-full px-2 py-0.5">
                Live now
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function LiveDemoWidget() {
  const [qrUrl, setQrUrl] = useState("");
  const [displayUrl, setDisplayUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = window.location.origin + "/ride?stop=Faculty";
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`);
      setDisplayUrl(window.location.host + "/ride?stop=Faculty");
    }
  }, []);

  return (
    <section id="demo" className="border-y border-border bg-muted/40 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="text-sm font-medium uppercase tracking-wider text-primary">Live demo</div>
          <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            One real, working loop beats five described features.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Scan the QR code with your phone to simulate boarding, tap "I'm on Shuttle A", and watch the dashboard update in real time. We seeded the baseline by walking the route ourselves — the app works from tap #1.
          </p>
          {displayUrl && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-card px-3 py-1.5 text-xs border border-border">
              <span className="font-semibold text-primary">Direct Link:</span>
              <span className="font-mono text-muted-foreground select-all">{displayUrl}</span>
            </div>
          )}
        </div>
        <Link
          to="/ride"
          search={{ stop: "Faculty" }}
          className="block rounded-2xl border border-border bg-card p-8 text-center transition hover:border-primary/50 hover:bg-primary/5"
        >
          <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed border-primary/40 bg-card p-2 shadow-sm">
            {qrUrl ? (
              <img src={qrUrl} alt="Scan QR Code" className="h-full w-full object-contain" />
            ) : (
              <QrCode className="h-24 w-24 text-primary animate-pulse" />
            )}
          </div>
          <div className="mt-4 text-sm font-medium text-primary">Scan QR on phone or Click to try rider view →</div>
        </Link>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted-foreground md:flex-row">
        <div>© 2026 Shuttle ETA — PESSA Innovation Challenge</div>
        <div>Built for UNILAG. Ported anywhere.</div>
      </div>
    </footer>
  );
}
