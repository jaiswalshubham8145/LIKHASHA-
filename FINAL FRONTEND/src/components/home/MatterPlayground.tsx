import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { soundEffects } from "@/hooks/useSoundEffects";

interface PillData {
  id: string;
  label: string;
  color: string;
  bg: string;
}

const PILL_TOKENS: PillData[] = [
  { id: "love", label: "Love / Ishq", color: "#ff7597", bg: "#200a18" },
  { id: "sad", label: "Heartbreak", color: "#60a5fa", bg: "#091326" },
  { id: "fire", label: "Fire / Josh", color: "#f97316", bg: "#220e06" },
  { id: "peace", label: "Inner Peace", color: "#c084fc", bg: "#160a28" },
  { id: "dark", label: "Midnight", color: "#94a3b8", bg: "#10131c" },
  { id: "joy", label: "Joy / Anand", color: "#facc15", bg: "#201a06" },
  { id: "wisdom", label: "Wisdom", color: "#eab308", bg: "#1c1505" },
  { id: "hope", label: "Hope / Noor", color: "#34d399", bg: "#061f16" },
];

const STICKERS = [
  { id: "wah", text: "Wah Wah! ✦", color: "#facc15" },
  { id: "sher", text: "100% Sher", color: "#ff7597" },
  { id: "jaan", text: "Dil Se ❤️", color: "#f97316" },
  { id: "ghalib", text: "Ghalib 🌙", color: "#60a5fa" },
];

interface MatterPlaygroundProps {
  onSelectMood: (id: string) => void;
  activeMood: string;
}

export function MatterPlayground({
  onSelectMood,
  activeMood,
}: MatterPlaygroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = 360;

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
      Events,
    } = Matter;

    const engine = Engine.create();
    engine.gravity.y = 0.85;
    engineRef.current = engine;

    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio || 1,
      },
    });

    // Boundaries
    const wallOptions = { isStatic: true, render: { visible: false } };
    const ground = Bodies.rectangle(
      width / 2,
      height + 25,
      width * 2,
      50,
      wallOptions,
    );
    const leftWall = Bodies.rectangle(
      -25,
      height / 2,
      50,
      height * 2,
      wallOptions,
    );
    const rightWall = Bodies.rectangle(
      width + 25,
      height / 2,
      50,
      height * 2,
      wallOptions,
    );

    // Pill Bodies
    const pillWidth = Math.min(130, width / 5);
    const pillHeight = 44;

    const pills = PILL_TOKENS.map((token, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const startX = 100 + col * (pillWidth + 24);
      const startY = 50 + row * 60;

      const body = Bodies.rectangle(startX, startY, pillWidth, pillHeight, {
        chamfer: { radius: 22 },
        restitution: 0.72,
        friction: 0.15,
        density: 0.002,
        label: token.id,
        render: {
          fillStyle: token.bg,
          strokeStyle: token.color,
          lineWidth: 2,
        },
      });
      return body;
    });

    Composite.add(engine.world, [ground, leftWall, rightWall, ...pills]);

    // Mouse Controls
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.22,
        render: { visible: false },
      },
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Click / drag event to select mood and trigger tactile sound
    Events.on(mouseConstraint, "startdrag", (e: any) => {
      soundEffects.playClick();
      if (e.body && e.body.label) {
        onSelectMood(e.body.label);
      }
    });

    Events.on(engine, "collisionStart", (event) => {
      if (event.pairs.length > 0 && Math.random() > 0.4) {
        soundEffects.playClick();
      }
    });

    // Custom Label Renderer on afterRender
    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      if (!ctx) return;

      pills.forEach((p, idx) => {
        const token = PILL_TOKENS[idx];
        if (!token) return;

        ctx.save();
        ctx.translate(p.position.x, p.position.y);
        ctx.rotate(p.angle);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Dot indicator
        ctx.fillStyle = token.color;
        ctx.beginPath();
        ctx.arc(-pillWidth / 2 + 20, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label text
        ctx.font = "bold 11px system-ui, sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(token.label, 8, 1);

        ctx.restore();
      });
    });

    render.canvas.style.touchAction = "pan-y";
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!runner.enabled) Runner.start(runner, engine);
        } else {
          Runner.stop(runner);
        }
      },
      { threshold: 0.05 },
    );
    io.observe(container);

    return () => {
      io.disconnect();
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl glass-vision border border-white/12 overflow-hidden shadow-2xl p-4 sm:p-6"
    >
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 z-10 relative">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
          <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-gold font-medium">
            2D Matter.js Gravity Physics Sandbox
          </span>
        </div>
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-mist/80">
          Grab, toss &amp; collide tokens
        </span>
      </div>

      {/* Physics Canvas */}
      <div
        ref={canvasContainerRef}
        className="w-full h-[360px] cursor-grab active:cursor-grabbing"
      />

      {/* Draggable Sticker Bomb Badges (Igloo style) */}
      <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
        <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-faint">
          Reaction Stamps:
        </span>
        <div className="flex flex-wrap gap-2">
          {STICKERS.map((s) => (
            <button
              key={s.id}
              onClick={() => soundEffects.playClick()}
              className="glass-pill rounded-full px-3.5 py-1 text-[11px] font-sans text-white hover:scale-110 active:scale-95 transition-transform border"
              style={{ borderColor: `${s.color}40`, color: s.color }}
            >
              {s.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
