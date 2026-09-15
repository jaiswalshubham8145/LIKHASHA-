import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseR: number;
  alpha: number;
  color: string;
  glowColor: string;
  glowBlur: number;
  phase: number;
  swaySpeed: number;
};

const EMBER_COLORS = [
  { color: "rgba(255, 240, 180, ", glow: "rgba(246, 216, 96, 0.9)" }, // Laser Gold
  { color: "rgba(212, 175, 55, ", glow: "rgba(212, 175, 55, 0.85)" }, // Imperial Gold
  { color: "rgba(249, 115, 22, ", glow: "rgba(249, 115, 22, 0.75)" }, // Fiery Amber
  { color: "rgba(255, 255, 255, ", glow: "rgba(255, 255, 255, 0.95)" }, // Celestial Starlight
];

/**
 * Cinematic High-Atmosphere Golden Ember & Stardust Storm (Movie-grade VFX).
 * Simulates fluid embers drifting upward with ambient turbulence, glowing halos,
 * and high-velocity cursor repulsion + explosive click shockwaves.
 */
export function InkParticles({
  count = 110,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let time = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pts: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      pts.length = 0;
      for (let i = 0; i < count; i++) {
        const palette =
          EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)]!;
        const radius = Math.random() * 2.6 + 0.6;
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -Math.random() * 0.55 - 0.15, // Upward drifting embers
          r: radius,
          baseR: radius,
          alpha: Math.random() * 0.6 + 0.2,
          color: palette.color,
          glowColor: palette.glow,
          glowBlur: Math.random() * 16 + 6,
          phase: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.02 + 0.008,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      time += 0.015;

      for (const p of pts) {
        // Ambient wind turbulence
        p.x += Math.sin(time * p.swaySpeed * 100 + p.phase) * 0.45;
        p.y += p.vy;

        // Cursor repulsion vortex
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 36000) {
          const f = (36000 - d2) / 36000;
          const dist = Math.sqrt(d2 + 1);
          p.vx += (dx / dist) * f * 1.4 - dy * 0.001 * f;
          p.vy += (dy / dist) * f * 1.4 + dx * 0.001 * f;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy = p.vy * 0.94 + -0.015; // Natural upward buoyancy

        // Wrap around boundaries
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Draw glowing ember
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = p.glowBlur;
        ctx.shadowColor = p.glowColor;
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };

    const onPointerDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const clickX = e.clientX - r.left;
      const clickY = e.clientY - r.top;
      // Shockwave burst on click
      for (const p of pts) {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 260) {
          const force = (260 - dist) / 260;
          p.vx += (dx / dist) * force * 10;
          p.vy += (dy / dist) * force * 10;
        }
      }
    };

    resize();
    seed();
    draw();

    window.addEventListener("resize", () => {
      resize();
      seed();
    });
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [count]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
