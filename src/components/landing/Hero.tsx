import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { QrCode, ArrowRight, MapPin } from "lucide-react";
import { PhoneMockup } from "./PhoneMockup";
import { WaterRipple } from "./WaterRipple";

export function Hero() {
  const { openModal } = useAuthModal();
  return (
    <section id="top" className="hero-water relative isolate overflow-hidden">
      {/* Layered water atmosphere (pure CSS, GPU-composited) */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary-glow)_0%,_transparent_55%)] opacity-25" />
      <div className="absolute inset-x-0 bottom-0 -z-20 h-2/3 bg-[linear-gradient(to_top,_oklch(0.55_0.14_150_/_0.08),_transparent)]" />
      {/* Rain + ripple canvas */}
      <WaterRipple className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pt-28 pb-20 lg:grid-cols-2 lg:pt-36 lg:pb-28">
        <div className="flex flex-col justify-center">
          <span className="hero-rise inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary backdrop-blur-[2px]">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            PESSA Innovation Challenge 2026
          </span>
          <h1 className="hero-rise [animation-delay:90ms] mt-6 font-display text-6xl font-bold leading-[0.92] tracking-tight text-foreground sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]">
            Know when the
            <br />
            shuttle is{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              actually
            </span>
            <br />
            coming.
          </h1>
          <p className="hero-rise [animation-delay:180ms] mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground">
            You're at Jaja Gate at 7:40am. Is the shuttle 2 minutes or 40 minutes away? No GPS. No
            app to download. Students tap when they board — the system learns real travel times and
            predicts arrivals.
          </p>
          <div className="hero-rise [animation-delay:270ms] mt-9 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => openModal("signup")} className="gap-2 text-base">
              Try the demo <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-base">
              <QrCode className="h-4 w-4" /> Scan QR at a stop
            </Button>
          </div>
          <div className="hero-rise [animation-delay:360ms] mt-12 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Gate → Faculty → PESSA
            </div>
            <div>
              Seeded with <span className="font-semibold text-foreground">14 real trips</span>
            </div>
          </div>
        </div>
        <div className="hero-rise [animation-delay:240ms] flex items-center justify-center">
          <div className="hero-float">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
