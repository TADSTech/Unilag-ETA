import { useEffect, useRef } from "react";

/**
 * WaterRipple — high-visibility rain-on-a-pond canvas animation.
 * Compositor-only (transform/opacity), pauses off-screen & hidden tab.
 */

type Ripple = {
  x: number;
  y: number;
  r: number;
  max: number;
  speed: number;
  width: number;
  alpha: number;
  accent: boolean;
};

type Drop = {
  x: number;
  y: number;
  ty: number;
  vy: number;
  len: number;
  angle: number; // slight diagonal
};

const MAX_RIPPLES = 80;
const MAX_DROPS = 12;

export function WaterRipple({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = 1;
    let raf = 0, running = false, visible = true, inView = true;
    let last = 0, spawnTimer = 0, pointerTimer = 0;

    const ripples: Ripple[] = [];
    const drops: Drop[] = [];

    // Strong, visible colors — these are the greens from the design system
    const G1 = "rgba(28,110,68,";   // dark primary green
    const G2 = "rgba(52,168,106,";  // lighter primary-glow green
    const AM = "rgba(200,145,30,";  // warm amber accent

    const col = (base: string, a: number) => `${base}${a.toFixed(3)})`;

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

    const addRipple = (x: number, y: number, big: boolean, accent = false) => {
      const rings = big ? 4 : 3;
      const baseMax = big ? 220 : 110;
      const baseAlpha = big ? 0.75 : 0.55;
      const baseSpeed = big ? 120 : 80;
      for (let i = 0; i < rings; i++) {
        if (ripples.length >= MAX_RIPPLES) ripples.shift();
        const variance = 0.8 + Math.random() * 0.4;
        ripples.push({
          x,
          y,
          r: -i * (big ? 32 : 18),
          max: baseMax * variance,
          speed: baseSpeed * (0.9 + Math.random() * 0.2),
          width: big ? 2.8 - i * 0.5 : 2.0 - i * 0.4,
          alpha: baseAlpha * (1 - i * 0.2),
          accent: accent && i === 0,
        });
      }
    };

    const addDrop = () => {
      if (drops.length >= MAX_DROPS) return;
      const x = w * (0.05 + Math.random() * 0.9);
      const ty = h * (0.15 + Math.random() * 0.75);
      const angle = (Math.random() - 0.5) * 0.18; // subtle lean
      drops.push({
        x, y: ty - (180 + Math.random() * 250),
        ty, vy: 600 + Math.random() * 300,
        len: 18 + Math.random() * 14,
        angle,
      });
    };

    const drawStaticFrame = () => {
      ctx.clearRect(0, 0, w, h);
      [[w * 0.18, h * 0.5], [w * 0.55, h * 0.35], [w * 0.82, h * 0.68]].forEach(([x, y]) => {
        [60, 95, 130].forEach((r, i) => {
          ctx.beginPath();
          ctx.ellipse(x, y, r, r * 0.38, 0, 0, Math.PI * 2);
          ctx.strokeStyle = col(G1, 0.22 - i * 0.06);
          ctx.lineWidth = 2.0 - i * 0.5;
          ctx.stroke();
        });
      });
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);

      // Spawn rain drops — denser
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        const burst = Math.random() < 0.25 ? 2 : 1;
        for (let b = 0; b < burst; b++) addDrop();
        spawnTimer = 0.28 + Math.random() * 0.55;
      }

      // Falling drops with angled streak
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.y += d.vy * dt;
        if (d.y >= d.ty) {
          drops.splice(i, 1);
          const big = Math.random() < 0.35;
          const accent = Math.random() < 0.08;
          addRipple(d.x, d.ty, big, accent);
          // Micro-splash: 2–3 tiny satellite drops
          if (big) {
            for (let s = 0; s < 2; s++) {
              const sx = d.x + (Math.random() - 0.5) * 40;
              const sy = d.ty + (Math.random() - 0.5) * 16;
              addRipple(sx, sy, false);
            }
          }
          continue;
        }
        const dx = Math.sin(d.angle) * d.len;
        const grad = ctx.createLinearGradient(d.x - dx * 0.5, d.y - d.len, d.x + dx * 0.5, d.y);
        grad.addColorStop(0, col(G2, 0));
        grad.addColorStop(0.6, col(G2, 0.35));
        grad.addColorStop(1, col(G1, 0.72));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(d.x - dx * 0.5, d.y - d.len);
        ctx.lineTo(d.x + dx * 0.5, d.y);
        ctx.stroke();
      }

      // Ripple rings — perspective-foreshortened ellipses
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += rp.speed * dt;
        if (rp.r >= rp.max) { ripples.splice(i, 1); continue; }
        if (rp.r <= 0) continue;

        const p = rp.r / rp.max;
        // Ease: strong early, long fade tail
        const fade = rp.alpha * Math.pow(1 - p, 1.6);
        if (fade < 0.006) continue;

        const base = rp.accent ? AM : (p < 0.5 ? G1 : G2);
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.38, 0, 0, Math.PI * 2);
        ctx.strokeStyle = col(base, fade);
        ctx.lineWidth = Math.max(rp.width * (1 - p * 0.65), 0.5);
        ctx.stroke();
      }
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const sync = () => (visible && inView ? start() : stop());

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      const now = performance.now();
      if (now - pointerTimer < 80) return;
      pointerTimer = now;
      const { x, y } = toLocal(e);
      if (x < 0 || y < 0 || x > w || y > h) return;
      addRipple(x, y, false);
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      const { x, y } = toLocal(e);
      if (x < 0 || y < 0 || x > w || y > h) return;
      addRipple(x, y, true, true);
    };

    const onVis = () => { visible = document.visibilityState === "visible"; sync(); };

    const io = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0 });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const host = canvas.parentElement ?? canvas;
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    if (reduced) drawStaticFrame(); else start();

    return () => {
      stop(); io.disconnect(); ro.disconnect();
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
