import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Aggressive 3D tilt card with VisionOS specular reflection & photon laser glare.
 * Multi-axis perspective tilt with dynamic z-space layer elevation.
 */
export function TiltCard({
  children,
  className,
  max = 16,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn(
        "glass-vision group relative rounded-2xl [transform-style:preserve-3d] transition-transform duration-300 ease-[var(--ease-out-expo)] will-change-transform hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.3)]",
        className,
      )}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * max * 2.2}deg) rotateX(${(0.5 - py) * max * 2.2}deg) translateZ(18px)`;
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
      }}
      onPointerLeave={() => {
        const el = ref.current;
        if (el)
          el.style.transform =
            "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
      }}
    >
      <div className="relative z-10 [transform:translateZ(20px)]">
        {children}
      </div>

      {/* Cinematic Laser Glare & Specular Reflection */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(550px circle at var(--mx,50%) var(--my,50%), rgba(246, 216, 96, 0.28) 0%, rgba(212, 175, 55, 0.1) 40%, transparent 75%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
