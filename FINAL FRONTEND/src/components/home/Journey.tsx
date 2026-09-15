import { useEffect, useRef, useState } from "react";
import { ScrubVideo } from "@/components/site/ScrubVideo";
import { VIDEOS } from "@/lib/media";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    k: "01",
    title: "Whisper your emotion",
    body: "Type a feeling, a memory, or half a line. English, Hindi, or Urdu — the engine listens for the pulse beneath your thought.",
    demo: "Teri yaad mein beete lamhe...",
    translation: "Moments spent in your memory...",
  },
  {
    k: "02",
    title: "Neural mood extraction",
    body: "Sentiment, cadence, and meter are analyzed in real time. Emotion detected · Melodic rhythm · 99% resonance.",
    demo: "Analyzing emotion · Love & longing · English & Urdu",
    translation: "Mapping poetic meter and classical rhyme...",
  },
  {
    k: "03",
    title: "Words materialize",
    body: "Golden ink condenses into a finished verse or quote — ready to copy, share on social stories, or export as a museum-grade poster.",
    demo: "Tere aane se mukammal hui zindagi...",
    translation: "With your arrival life became complete...",
  },
];

export function Journey() {
  const section = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [stage, setStage] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let ticking = false;

    const update = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        // If far from viewport, don't recalculate
        if (r.bottom < -100 || r.top > window.innerHeight + 100) {
          ticking = false;
          return;
        }
        const total = r.height - window.innerHeight;
        const p = total > 0 ? Math.min(Math.max(-r.top / total, 0), 1) : 0;
        progress.current = p;
        const nextStage = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
        setPct((prev) => (Math.abs(prev - p) > 0.005 ? p : prev));
        setStage((prev) => (prev !== nextStage ? nextStage : prev));
        ticking = false;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <section ref={section} className="relative z-10 h-[320vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <ScrubVideo
          src={VIDEOS.journey}
          progressRef={progress}
          intensity={0.55}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-6 font-sans text-[10px] uppercase tracking-[0.5em] text-gold">
              How it works
            </p>

            {STAGES.map((s, i) => (
              <div
                key={s.k}
                className={cn(
                  "transition-all duration-700 ease-[var(--ease-out-expo)]",
                  stage === i
                    ? "opacity-100 blur-0"
                    : "pointer-events-none absolute opacity-0 blur-md",
                )}
              >
                <h2 className="font-display text-[clamp(34px,5.6vw,74px)] font-light leading-[0.95] tracking-[-0.03em]">
                  <span className="text-gold">{s.k}.</span> {s.title}
                </h2>
                <p className="mt-6 max-w-md font-sans text-sm sm:text-base leading-relaxed text-mist font-light">
                  {s.body}
                </p>
              </div>
            ))}

            <div className="mt-12 flex items-center gap-4">
              <div className="h-px w-48 bg-border">
                <div
                  className="h-px bg-gold-sheet transition-[width] duration-200"
                  style={{ width: `${pct * 100}%` }}
                />
              </div>
              <span className="font-sans text-[10px] tracking-[0.3em] text-faint">
                {String(Math.round(pct * 100)).padStart(3, "0")}%
              </span>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div
              className="glass-gold w-full max-w-md rounded-2xl p-8 animate-float-slow shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-gold/30"
              style={{ transform: `translateZ(0) scale(${0.94 + pct * 0.12})` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
                    Likhasha AI Studio
                  </span>
                </div>
                <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-faint">
                  Stage 0{stage + 1}
                </span>
              </div>

              <p className="mt-8 min-h-16 font-display text-2xl italic leading-snug text-gold transition-all duration-700">
                &ldquo;{STAGES[stage]?.demo}&rdquo;
              </p>
              <p className="mt-2 font-sans text-xs text-white/70 leading-relaxed">
                {STAGES[stage]?.translation}
              </p>

              <div className="mt-8 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 rounded-full flex-1 transition-all duration-500",
                      i <= stage
                        ? "bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                        : "bg-white/10",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
