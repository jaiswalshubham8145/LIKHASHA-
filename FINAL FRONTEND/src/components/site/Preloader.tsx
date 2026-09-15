import { useEffect, useState } from "react";
import { VIDEOS } from "@/lib/media";

const LETTERS = "LIKHASHA".split("");

/** Cinematic intro: letter slam, shockwave, gold laser, liquid curtain wipe. */
export function Preloader() {
  const [phase, setPhase] = useState<"in" | "wipe" | "done">("in");

  useEffect(() => {
    if (sessionStorage.getItem("likhasha-intro") === "1") {
      setPhase("done");
      return;
    }
    document.body.style.overflow = "hidden";
    const t1 = window.setTimeout(() => setPhase("wipe"), 2600);
    const t2 = window.setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("likhasha-intro", "1");
      document.body.style.overflow = "";
    }, 3700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-[oklch(0_0_0)] transition-[clip-path,opacity] duration-1000 ease-[var(--ease-out-expo)]"
      style={{
        clipPath: phase === "wipe" ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)",
      }}
    >
      {/* Liquid glass obsidian & crystal preloader glow */}
      <div aria-hidden className="absolute inset-0 bg-[#050508]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle 500px at 50% 50%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.03) 45%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="absolute h-40 w-40 rounded-full border border-gold/40"
        style={{ animation: "shockwave 1.4s var(--ease-out-expo) 1.5s both" }}
      />
      <div className="cinematic-glow relative flex gap-[0.04em] font-monument text-[clamp(40px,8vw,128px)] font-light text-gold">
        {LETTERS.map((l, i) => (
          <span
            key={i}
            style={{
              animation: `rise-in 0.9s var(--ease-spring) ${i * 0.07}s both`,
            }}
          >
            {l}
          </span>
        ))}
      </div>
      <p
        className="mt-4 font-sans text-[11px] uppercase text-gold"
        style={{
          animation: "rise-in 1s var(--ease-out-expo) 1.1s both",
          letterSpacing: "0.42em",
        }}
      >
        Har lafz ek nasha 🌙
      </p>
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-gold-sheet"
        style={{ animation: "laser 1.6s var(--ease-out-expo) 0.6s both" }}
      />
    </div>
  );
}
