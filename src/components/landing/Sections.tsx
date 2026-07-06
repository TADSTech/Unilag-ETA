import { QrCode, MousePointerClick, Brain, Wifi, WifiOff, Coins, Users, ArrowRight } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/hooks/use-auth-modal";

/* ── Scroll-reveal wrapper ─────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.style.transition = `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        io.disconnect();
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}

/* ── Problem Strip ─────────────────────────────────────── */
export function ProblemStrip() {
  const items = [
    { k: "7:40 am", v: "You're at Jaja Gate. No info. No sign. Just waiting." },
    { k: "8:05 am", v: "You choose: risk missing lab, or leave and miss the shuttle." },
    { k: "+ 15 min", v: "A shuttle shows up unannounced. A queue forms in seconds." },
  ];
  return (
    <section id="problem" className="border-y border-border bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="mb-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            The problem isn't a lack of buses.
          </h2>
          <p className="mb-10 max-w-xl text-lg text-muted-foreground">It's zero visibility.</p>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.k} delay={i * 80}>
              <div className="group rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                <div className="font-display text-3xl font-semibold text-primary">{item.k}</div>
                <div className="mt-3 text-muted-foreground">{item.v}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ─────────────────────────────────────── */
export function HowItWorks() {
  const steps = [
    { icon: QrCode, t: "Scan a QR code", d: "Printed at every stop. Opens the ETA page instantly — no download, no login." },
    { icon: MousePointerClick, t: "Tap when you board", d: "One button: 'I'm on Shuttle A'. Tap again when you get off." },
    { icon: Brain, t: "System learns", d: "Rolling average across student taps. Every ride sharpens the next prediction." },
  ];
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <div className="mb-14 max-w-2xl">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">How it works</div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Three taps. No hardware.<br />No cost to the school.
          </h2>
        </div>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.t} delay={i * 100}>
            <div className="relative rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                Step {i + 1}
              </div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="font-display text-xl font-semibold">{s.t}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.d}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Why It Works ─────────────────────────────────────── */
export function WhyItWorks() {
  const items = [
    { icon: WifiOff, t: "No GPS needed", d: "Students are the tracking network." },
    { icon: Wifi, t: "Web only", d: "No app store, no download, no permissions." },
    { icon: Users, t: "Every tap improves it", d: "Predictions sharpen as usage grows." },
    { icon: Coins, t: "Free to run", d: "Static frontend + free-tier backend." },
  ];
  return (
    <section className="bg-primary py-24 text-primary-foreground">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="mb-12 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Why this works.</h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.t} delay={i * 80}>
              <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 backdrop-blur transition-colors hover:bg-primary-foreground/10">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <div className="font-display text-lg font-semibold">{item.t}</div>
                <div className="mt-1 text-sm opacity-75">{item.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Live Demo Widget ─────────────────────────────────── */
export function LiveDemoWidget() {
  const { openModal } = useAuthModal();
  return (
    <section id="demo" className="border-y border-border bg-muted/40 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Live demo</div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            One working loop beats five described features.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sign in as a student, pick your stop, and tap 'I'm on Shuttle A'. Watch your trip feed the prediction engine in real time.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => openModal("signup")} className="gap-2">
              Try the rider view <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex flex-col gap-3">
              {[
                { stop: "Main Gate", eta: "3m", active: false },
                { stop: "Faculty of Science", eta: "7m", active: true },
                { stop: "Moremi Hall", eta: "11m", active: false },
                { stop: "PESSA", eta: "14m", active: false },
              ].map((row) => (
                <div key={row.stop} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${row.active ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border text-muted-foreground"}`}>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${row.active ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
                    {row.stop}
                  </div>
                  <span className="font-display text-lg font-bold">{row.eta}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-xs text-muted-foreground">based on 14 recent trips · updates live</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Roadmap ──────────────────────────────────────────── */
export function Roadmap() {
  const items = [
    { when: "MVP (48h)", what: "Gate → Faculty → PESSA, one route, live ETA", live: true },
    { when: "Week 2", what: "Add all UNILAG routes + stops" },
    { when: "Month 1", what: "Live map view for riders" },
    { when: "Month 2", what: "PESSA admin dashboard: peak hours, demand heatmap" },
    { when: "Semester", what: "Port to FUTA, OAU, ABU, UI" },
  ];
  return (
    <section id="roadmap" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Roadmap</div>
        <h2 className="mb-14 text-4xl font-bold tracking-tight sm:text-5xl">
          What ships after the hackathon.
        </h2>
      </Reveal>
      <ol className="relative border-l-2 border-primary/20 pl-8 space-y-8">
        {items.map((item, i) => (
          <Reveal key={item.when} delay={i * 60}>
            <li>
              <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-background" />
              <div className="text-sm font-semibold uppercase tracking-wider text-primary">{item.when}</div>
              <div className="mt-1 text-lg text-foreground">{item.what}</div>
              {item.live && (
                <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  ✓ Live now
                </span>
              )}
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────── */
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
