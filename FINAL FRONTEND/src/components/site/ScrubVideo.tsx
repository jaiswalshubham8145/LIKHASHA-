import { useEffect, useRef } from "react";

/**
 * Pure CSS ambient lighting reactive to scroll progress.
 * Replaces video with a zero-bandwidth Forest Green × Brass atmosphere.
 */
export function ScrubVideo({
  progressRef,
  intensity = 0.5,
}: {
  src?: string;
  progressRef: React.MutableRefObject<number>;
  intensity?: number;
}) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = glowRef.current;
      if (el) {
        const p = Math.min(Math.max(progressRef.current, 0), 1);
        el.style.transform = `scale(${1 + p * 0.25}) rotate(${p * 20}deg)`;
        el.style.opacity = String(0.35 + p * 0.45);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Deep Obsidian base */}
      <div className="absolute inset-0 bg-[#050508]" />

      {/* Crystal glass ambient sheen */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle 800px at 30% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 80%)",
        }}
      />

      {/* Dynamic Scroll-reactive crystal aura */}
      <div
        ref={glowRef}
        className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
        style={{
          opacity: intensity,
          background:
            "radial-gradient(circle 600px at 70% 35%, rgba(255, 255, 255, 0.1) 0%, transparent 70%), radial-gradient(circle 450px at 20% 70%, rgba(255, 255, 255, 0.06) 0%, transparent 60%)",
        }}
      />

      {/* Deep vignette into #050508 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 30%, #050508 98%)",
        }}
      />
    </div>
  );
}
