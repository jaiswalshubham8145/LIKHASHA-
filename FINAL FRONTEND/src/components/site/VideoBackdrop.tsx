import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src?: string;
  /** 0..1 base opacity of the footage */
  intensity?: number;
  /** blur in px */
  blur?: number;
  className?: string;
  /** fixed = viewport-locked ambient layer, absolute = section bound */
  fixed?: boolean;
  playbackRate?: number;
};

const DEFAULT_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_031045_0e1165dd-ab48-46e3-ad3d-5fe77f217647.mp4";

/**
 * Atmospheric background video player using MotionSites AI liquid silk waves,
 * enveloped in the Forest Green × Brass — Old-Money Luxury palette.
 */
export function VideoBackdrop({
  src = DEFAULT_VIDEO,
  intensity = 0.42,
  blur = 0,
  className,
  fixed = false,
  playbackRate = 1,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playbackRate = playbackRate;
    const play = () => void v.play().catch(() => {});
    play();
    document.addEventListener("visibilitychange", play);
    return () => document.removeEventListener("visibilitychange", play);
  }, [playbackRate]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none overflow-hidden select-none",
        fixed ? "fixed inset-0" : "absolute inset-0",
        className,
      )}
    >
      {/* Deep obsidian glass base canvas */}
      <div className="absolute inset-0 bg-[#050508]" />

      {/* The Liquid Silk waves video from MotionSites - crisp, transparent & flowing */}
      <video
        ref={ref}
        src={src || DEFAULT_VIDEO}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className="h-full w-full scale-105 object-cover"
        style={{
          opacity: intensity ?? 0.65,
          filter: `blur(${blur}px) contrast(115%) brightness(0.92)`,
        }}
      />

      {/* Crystal liquid glass specular highlight (overhead soft light reflection) */}
      <div
        className="absolute inset-0 opacity-80 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% 10%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 45%, transparent 70%), radial-gradient(circle 600px at 80% 35%, rgba(255, 255, 255, 0.06) 0%, transparent 65%)",
        }}
      />

      {/* Transparent glass vignette preserving high text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 30%, rgba(5, 5, 8, 0.75) 92%, #050508 100%)",
        }}
      />

      {/* Bottom seamless fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none" />
    </div>
  );
}
