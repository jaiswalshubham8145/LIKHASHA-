import { useRef, useState, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
}

/**
 * Apple VisionOS-inspired Liquid Glass Spotlight Card.
 * Illumination follows pointer location, casting soft interior caustics
 * and highlighting the glass specular border.
 */
export function GlassSpotlightCard({
  children,
  className,
  spotlightColor = "rgba(255, 255, 255, 0.12)",
  spotlightSize = 450,
  ...props
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={cn(
        "glass-vision relative overflow-hidden rounded-2xl transition-all duration-500",
        className,
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Caustic (Interior Glass Radiance) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${spotlightSize}px circle at ${pos.x}px ${pos.y}px, ${spotlightColor} 0%, rgba(255, 255, 255, 0.02) 45%, transparent 75%)`,
        }}
      />

      {/* Dynamic Border Glow (Catches light at pointer coordinates) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] transition-opacity duration-500 ease-out"
        style={{
          opacity: isHovered ? 1 : 0,
          padding: "1px",
          background: `radial-gradient(240px circle at ${pos.x}px ${pos.y}px, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 80%)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
