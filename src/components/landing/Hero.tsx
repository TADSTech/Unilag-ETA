import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowRight, MapPin } from "lucide-react";
import { PhoneMockup } from "./PhoneMockup";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary-glow)_0%,_transparent_55%)] opacity-25" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pt-28 pb-20 lg:grid-cols-2 lg:pt-36 lg:pb-28">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            PESSA Innovation Challenge 2026
          </span>
          <h1 className="mt-6 font-display text-6xl font-bold leading-[0.92] tracking-tight text-foreground sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]">
            Know when the
            <br />
            shuttle is{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              actually
            </span>
            <br />
            coming.
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground">
            You're at Jaja Gate at 7:40am. Is the shuttle 2 minutes or 40 minutes away? No GPS. No
            app to download. Every UNILAG student taps when they board — the system learns real
            travel times and predicts arrivals, stop by stop, across campus.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" className="gap-2 text-base" asChild>
              <Link to="/ride">
                Try the demo <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-base" asChild>
              <Link to="/ride" search={{ stop: "Faculty" }}>
                <QrCode className="h-4 w-4" /> Scan QR at a stop
              </Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Pilot route: Gate → Faculty → PESSA
            </div>
            <div>
              Seeded with <span className="font-semibold text-foreground">14 real trips</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Built for every UNILAG student — this corridor is the pilot, campus-wide routes are
            next.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
