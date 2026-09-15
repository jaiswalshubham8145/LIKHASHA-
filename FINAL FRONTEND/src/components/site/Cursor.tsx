import { useEffect, useRef } from "react";

interface StardustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

/**
 * 5-State Magnetic Spring Cursor with Golden Stardust Trail (PRD 7.1 & DESIGN.md 5.4).
 * Combines zero-latency laser dot, lerping specular gold ring,
 * and high-performance canvas particle trail.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let scale = 1;
    let targetScale = 1;
    let mode: "default" | "button" | "text" | "click" = "default";
    let isClicking = false;
    let raf = 0;

    const particles: StardustParticle[] = [];
    const colors = ["#d4af37", "#f6d860", "#ffe885", "#fae69e"];

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastX = mx;
    let lastY = my;

    const onPointerMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;

      const dx = mx - lastX;
      const dy = my - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      lastX = mx;
      lastY = my;

      // Spawn stardust particles along path proportional to speed
      if (speed > 1.2 && particles.length < 50) {
        const count = Math.min(3, Math.floor(speed / 4) + 1);
        for (let i = 0; i < count; i++) {
          particles.push({
            x: mx + (Math.random() - 0.5) * 6,
            y: my + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 0.8 - dx * 0.04,
            vy: (Math.random() - 0.5) * 0.8 - dy * 0.04 - 0.3,
            alpha: 0.85,
            size: Math.random() * 2.2 + 0.8,
            color:
              colors[Math.floor(Math.random() * colors.length)] ?? "#d4af37",
          });
        }
      }

      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          "a, button, [role='button'], [data-magnetic], input, textarea, select",
        )
      ) {
        mode = "button";
        targetScale = 2.2;
      } else if (
        target?.closest("h1, h2, h3, p, span, .cinematic-title, .reveal-copy")
      ) {
        mode = "text";
        targetScale = 1.6;
      } else {
        mode = "default";
        targetScale = 1;
      }
    };

    const onPointerDown = () => {
      isClicking = true;
      targetScale = 0.75;
      // Spawn small radial burst on click
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const speed = Math.random() * 2.2 + 1.2;
        particles.push({
          x: mx,
          y: my,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 0.95,
          size: Math.random() * 2.8 + 1.2,
          color: "#ffe885",
        });
      }
    };

    const onPointerUp = () => {
      isClicking = false;
      targetScale = mode === "button" ? 2.2 : mode === "text" ? 1.6 : 1;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    const render = () => {
      // Lerp ring towards mouse with spring easing
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      scale += (targetScale - scale) * 0.14;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        if (mode === "button") {
          ringRef.current.style.borderColor = "rgba(246, 216, 96, 0.85)";
          ringRef.current.style.backgroundColor = "rgba(212, 175, 55, 0.12)";
          ringRef.current.style.boxShadow = "0 0 24px rgba(212, 175, 55, 0.35)";
        } else if (mode === "text") {
          ringRef.current.style.borderColor = "rgba(255, 255, 255, 0.5)";
          ringRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
          ringRef.current.style.boxShadow = "none";
        } else {
          ringRef.current.style.borderColor = "rgba(212, 175, 55, 0.45)";
          ringRef.current.style.backgroundColor = "transparent";
          ringRef.current.style.boxShadow = "none";
        }
      }

      // Render stardust particles
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]!;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.024;
          p.size *= 0.98;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(render);
    };

    document.documentElement.style.cursor = "none";
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[68] hidden md:block"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_#ffe885] md:block will-change-transform"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[69] hidden h-9 w-9 rounded-full border border-gold/45 transition-[background-color,border-color,box-shadow] duration-200 md:block will-change-transform"
      />
    </>
  );
}
