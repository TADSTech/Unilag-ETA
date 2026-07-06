import { useEffect, useRef } from "react";

/**
 * WaterRipple — a single-canvas "rain on a pond" animation.
 *
 * Performance notes:
 * - One 2D canvas, stroke-only ellipses (cheap fill-rate), no shadows/blur.
 * - devicePixelRatio capped at 2 to avoid 3x/4x fill cost on mobile.
 * - Hard caps on live objects (drops + ripples) with array reuse.
 * - requestAnimationFrame is paused when the tab is hidden OR the hero
 *   scrolls out of view (IntersectionObserver).
 * - Delta-time based physics → identical speed on 60/90/120Hz screens.
 * - prefers-reduced-motion → renders one static frame, no loop.
 */

type Ripple = {
  x: number;
  y: number;
  r: number; // current radius
  max: number; // radius at which it fully fades
  speed: number; // px per second
  width: number; // starting line width
  alpha: number; // starting alpha
  hue: 0 | 1; // 0 = primary green, 1 = warm accent (rare)
};

type Drop = {
  x: number;
  y: number;
  ty: number; // target (impact) y
  vy: number; // px per second
  len: number; // streak length
};

const MAX_RIPPLES = 64;
const MAX_DROPS = 6;

export function WaterRipple({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let visible = true;
    let inView = true;
    let last = 0;
    let spawnTimer = 0;
    let pointerTimer = 0;

    const ripples: Ripple[] = [];
    const drops: Drop[] = [];

    // Theme-tinted strokes. oklch is supported by canvas in all evergreen
    // browsers; the rgba fallbacks below cover the rest.
    const GREEN = "oklch(0.55 0.14 150";
    const AMBER = "oklch(0.78 0.16 75";
    const supportsOklch =
      typeof CSS !== "undefined" && CSS.supports?.("color", "oklch(0.5 0.1 150)");
    const green = (a: number) =>
      supportsOklch ? `${GREEN} / ${a})` : `rgba(34,140,90,${a})`;
    const amber = (a: number) =>
      supportsOklch ? `${AMBER} / ${a})` : `rgba(214,158,46,${a})`;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) drawStaticFrame();
    };

    const addRipple = (x: number, y: number, big: boolean, hue: 0 | 1 = 0) => {
      // Splash = 2–3 staggered rings from one impact point.
      const rings = big ? 3 : 2;
      for (let i = 0; i < rings; i++) {
        if (ripples.length >= MAX_RIPPLES) ripples.shift();
        ripples.push({
          x,
          y,
          r: -i * (big ? 26 : 14), // negative radius = staggered start
          max: (big ? 150 : 70) * (0.8 + Math.random() * 0.5),
          speed: (big ? 90 : 60) * (0.85 + Math.random() * 0.3),
          width: big ? 2.6 - i * 0.5 : 1.8 - i * 0.35,
          alpha: (big ? 0.65 : 0.45) * (1 - i * 0.22),
          hue,
        });
      }
    };

    const addDrop = () => {
      if (drops.length >= MAX_DROPS) return;
      const x = Math.random() * w;
      const ty = h * (0.25 + Math.random() * 0.65);
      drops.push({
        x,
        y: ty - (140 + Math.random() * 200),
        ty,
        vy: 520 + Math.random() * 260,
        len: 14 + Math.random() * 12,
      });
    };

    const drawStaticFrame = () => {
      // Reduced motion: a calm set of concentric rings, drawn once.
      ctx.clearRect(0, 0, w, h);
      const spots = [
        [w * 0.22, h * 0.55],
        [w * 0.68, h * 0.35],
        [w * 0.85, h * 0.72],
      ] as const;
      for (const [x, y] of spots) {
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.ellipse(x, y, 24 + i * 22, (24 + i * 22) * 0.42, 0, 0, Math.PI * 2);
          ctx.strokeStyle = green(0.18 - i * 0.05);
          ctx.lineWidth = 1.5 - i * 0.4;
          ctx.stroke();
        }
      }
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((t - last) / 1000, 1 / 20); // clamp big gaps
      last = t;

      ctx.clearRect(0, 0, w, h);

      // Ambient rain: spawn cadence scales gently with width.
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        addDrop();
        spawnTimer = 0.4 + Math.random() * 0.7 - Math.min(w / 4000, 0.2);
      }

      // Falling drops (short vertical streaks).
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.y += d.vy * dt;
        if (d.y >= d.ty) {
          drops.splice(i, 1);
          addRipple(d.x, d.ty, Math.random() < 0.3, Math.random() < 0.07 ? 1 : 0);
          continue;
        }
        const grad = ctx.createLinearGradient(d.x, d.y - d.len, d.x, d.y);
        grad.addColorStop(0, green(0));
        grad.addColorStop(1, green(0.65));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.len);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
      }

      // Ripples (perspective-flattened ellipses).
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += rp.speed * dt;
        if (rp.r >= rp.max) {
          ripples.splice(i, 1);
          continue;
        }
        if (rp.r <= 0) continue; // staggered ring not born yet
        const p = rp.r / rp.max; // 0 → 1 life
        const fade = rp.alpha * (1 - p) * (1 - p);
        if (fade < 0.004) continue;
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.42, 0, 0, Math.PI * 2);
        ctx.strokeStyle = rp.hue === 1 ? amber(fade) : green(fade);
        ctx.lineWidth = Math.max(rp.width * (1 - p * 0.6), 0.4);
        ctx.stroke();
      }
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => (visible && inView ? start() : stop());

    // Pointer interaction — coordinates relative to canvas.
    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      const now = performance.now();
      if (now - pointerTimer < 90) return; // throttle trail ripples
      pointerTimer = now;
      const { x, y } = toLocal(e);
      if (x < 0 || y < 0 || x > w || y > h) return;
      addRipple(x, y, false);
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      const { x, y } = toLocal(e);
      if (x < 0 || y < 0 || x > w || y > h) return;
      addRipple(x, y, true, 1);
    };

    const onVis = () => {
      visible = document.visibilityState === "visible";
      sync();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // Listen on the hero section (parent) so text/buttons don't block ripples.
    const host = canvas.parentElement ?? canvas;
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    if (reduced) drawStaticFrame();
    else start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? "pointer-events-none absolute inset-0 h-full w-full"}
    />
  );
}
