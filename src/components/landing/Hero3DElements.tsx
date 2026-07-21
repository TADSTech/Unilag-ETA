import { useState, useEffect } from "react";
import { Bus, MapPin, Sparkles, Navigation, Zap, ShieldCheck } from "lucide-react";
import { PhoneMockup } from "./PhoneMockup";

export function Hero3DElements() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Gentle 3D tilt responsiveness
    setRotate({ x: -y * 14, y: x * 14 });
  }

  function handleMouseLeave() {
    setRotate({ x: 0, y: 0 });
  }

  return (
    <div
      className="perspective-1000 relative flex items-center justify-center p-4 py-8 lg:p-8"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Isometric Grid Floor (Zero-RAM CSS/SVG) */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden opacity-30 pointer-events-none">
        <div
          className="h-[500px] w-[500px] rounded-full border border-primary/20 bg-gradient-to-tr from-primary/10 via-accent/10 to-transparent transition-transform duration-700 ease-out"
          style={{
            transform: `rotateX(60deg) rotateZ(-25deg) translateZ(-40px) rotateY(${rotate.y * 0.2}deg)`,
          }}
        >
          {/* Isometric route lines */}
          <svg viewBox="0 0 500 500" className="h-full w-full stroke-primary/40">
            <ellipse cx="250" cy="250" rx="200" ry="200" fill="none" strokeWidth="2" strokeDasharray="8 8" />
            <ellipse cx="250" cy="250" rx="140" ry="140" fill="none" strokeWidth="1.5" />
            <circle cx="250" cy="50" r="8" fill="var(--color-primary)" />
            <circle cx="390" cy="250" r="8" fill="var(--color-accent)" />
            <circle cx="250" cy="450" r="8" fill="var(--color-primary)" />
            <circle cx="110" cy="250" r="8" fill="var(--color-accent)" />
          </svg>
        </div>
      </div>

      {/* Main 3D Interactive Container */}
      <div
        className="preserve-3d relative transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Central Phone Mockup with 3D Depth Shadow */}
        <div className="relative z-10 animate-pulse-glow rounded-[2.5rem]">
          <PhoneMockup />
        </div>

        {/* 3D Floating Component 1: Live Shuttle A Speed & Tracker Card (Top Right) */}
        <div
          className="animate-float-3d absolute -right-6 -top-6 z-20 hidden w-56 rounded-2xl border border-primary/30 bg-card/90 p-3.5 shadow-2xl backdrop-blur-md sm:block md:-right-12"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Bus className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-bold tracking-tight text-foreground">
                Shuttle A <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="text-[11px] font-medium text-primary">In transit to Faculty</div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-[11px]">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Zap className="h-3 w-3 text-amber-500" /> Rolling Avg
            </span>
            <span className="font-mono font-semibold text-foreground">12m 40s</span>
          </div>
        </div>

        {/* 3D Floating Component 2: Crowdsourced Tap Card (Bottom Left) */}
        <div
          className="animate-float-3d-reverse absolute -bottom-6 -left-6 z-20 hidden w-60 rounded-2xl border border-accent/40 bg-card/90 p-3.5 shadow-2xl backdrop-blur-md sm:block md:-left-14"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                <Navigation className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold leading-none text-foreground">Student Tap Network</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">No GPS Hardware Needed</div>
              </div>
            </div>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>

          <div className="mt-3 space-y-1.5 rounded-xl bg-muted/50 p-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Check-ins Today:</span>
              <span className="font-mono font-bold text-primary">142 taps</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Prediction Accuracy:</span>
              <span className="font-mono font-bold text-green-600 dark:text-green-400">92%</span>
            </div>
          </div>
        </div>

        {/* 3D Floating Pill Badge 3: Zero Cost Tag (Top Left Floating) */}
        <div
          className="absolute -left-4 top-16 z-20 hidden rounded-full border border-primary/20 bg-background/90 px-3.5 py-1.5 text-xs font-semibold shadow-lg backdrop-blur lg:flex items-center gap-1.5"
          style={{ transform: "translateZ(30px) rotateY(-10deg)" }}
        >
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>100% Software-Based</span>
        </div>
      </div>
    </div>
  );
}
