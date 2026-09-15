import { useEffect, useRef, useState } from "react";
import { soundEffects } from "@/hooks/useSoundEffects";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  {
    number: "I",
    title: "The Silence",
    subtitle: "Before the word",
    body: "Every verse begins inside the quiet space before the first syllable is spoken — where feelings exist without names.",
    tag: "Chapter 01 · Origin",
  },
  {
    number: "II",
    title: "The Emotion",
    subtitle: "The inner pulse",
    body: "An emotion gathers warmth, cadence, and weight — longing, courage, or quiet peace yearning for expression.",
    tag: "Chapter 02 · Feeling",
  },
  {
    number: "III",
    title: "The Craft",
    subtitle: "Rhyme & meter",
    body: "Raw vulnerability is sculpted into poetic symmetry, classical meter, and musical cadence across English, Hindi, and Urdu.",
    tag: "Chapter 03 · Alchemy",
  },
  {
    number: "IV",
    title: "The Verse",
    subtitle: "Timeless line",
    body: "The completed line steps out of the dark, catches the light in gold, and becomes an eternal memory you can carry.",
    tag: "Chapter 04 · Creation",
  },
];

export function HorizontalChapters() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    let ticking = false;

    const update = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();
        // Skip calculation if not anywhere near viewport
        if (bounds.bottom < -150 || bounds.top > window.innerHeight + 150) {
          ticking = false;
          return;
        }
        const travel = Math.max(element.offsetHeight - window.innerHeight, 1);
        const next = Math.min(Math.max(-bounds.top / travel, 0), 1);
        setProgress((prev) => (Math.abs(prev - next) > 0.003 ? next : prev));
        const rail = track.current;
        if (rail) {
          const maxScroll = Math.max(
            rail.scrollWidth - window.innerWidth + 56,
            0,
          );
          setOffset(next * maxScroll);
        }
        ticking = false;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const active = Math.min(
    CHAPTERS.length - 1,
    Math.floor(progress * CHAPTERS.length),
  );
  const prevActive = useRef(active);

  useEffect(() => {
    if (prevActive.current !== active) {
      prevActive.current = active;
      try {
        soundEffects.playCinematicWhoosh();
      } catch {
        // audio policy fallback
      }
    }
  }, [active]);

  const jumpToChapter = (index: number) => {
    soundEffects.playClick();
    const element = section.current;
    if (!element) return;
    const travel = Math.max(element.offsetHeight - window.innerHeight, 1);
    const targetScroll =
      element.offsetTop + (index / (CHAPTERS.length - 1)) * travel;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <section
      ref={section}
      className="relative z-10 h-[360vh] border-y border-border/60"
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[#050508]" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 70%), radial-gradient(circle 600px at 20% 70%, rgba(212, 175, 55, 0.04) 0%, transparent 60%)",
          }}
        />

        <div className="relative w-full">
          <div className="mx-auto mb-10 flex max-w-7xl flex-wrap items-end justify-between gap-6 px-6">
            <div data-reveal-rotate>
              <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.5em] text-gold">
                The Creative Journey
              </p>
              <h2 className="font-display text-[clamp(30px,5vw,72px)] font-light leading-[0.95] text-foreground">
                Four Chapters of Creation
              </h2>
            </div>

            {/* Interactive Chapter Jump Navigation */}
            <div data-reveal-left className="flex items-center gap-2">
              {CHAPTERS.map((c, i) => (
                <button
                  key={c.number}
                  onClick={() => jumpToChapter(i)}
                  className={cn(
                    "glass-pill rounded-full px-3.5 py-1.5 font-sans text-[10px] uppercase tracking-[0.2em] transition-all duration-300",
                    active === i
                      ? "bg-gold text-ink font-semibold border-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "text-white/60 hover:text-white",
                  )}
                >
                  {c.number} · {c.title.split(" ")[1] || c.title}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Cards Track */}
          <div
            data-reveal-zoom
            className="relative h-[min(54vw,520px)] min-h-[390px] w-full [perspective:1400px]"
          >
            <div
              ref={track}
              className="flex h-full gap-6 will-change-transform px-6"
              style={{
                transform: `translate3d(calc(-${offset}px + 7vw), 0, 0)`,
              }}
            >
              {CHAPTERS.map((chapter, index) => {
                const isActive = index === active;
                return (
                  <article
                    key={chapter.number}
                    className={cn(
                      "glass-vision relative h-full w-[76vw] shrink-0 overflow-hidden rounded-2xl p-7 transition-all duration-700 sm:w-[50vw] sm:p-12 lg:w-[36vw] border",
                      isActive
                        ? "border-gold/70 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.25)] scale-[1.02]"
                        : "border-white/10 opacity-60 hover:opacity-90",
                    )}
                    style={{
                      transform: `rotateY(${(index - active) * -4}deg) translateZ(${isActive ? 50 : 0}px)`,
                    }}
                  >
                    <span className="absolute -right-4 -top-8 font-display text-[12rem] leading-none text-gold/8 pointer-events-none select-none transition-transform duration-700">
                      {chapter.number}
                    </span>

                    <div className="relative flex h-full flex-col justify-between z-10">
                      <div className="flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.32em] text-gold">
                        <span>{chapter.tag}</span>
                        <span>0{index + 1} / 04</span>
                      </div>

                      <div>
                        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-faint">
                          {chapter.subtitle}
                        </p>
                        <h3 className="mt-3 font-display text-[clamp(36px,5.5vw,76px)] font-light leading-none text-foreground">
                          {chapter.title}
                        </h3>
                        <p className="mt-6 max-w-sm font-sans text-sm sm:text-base leading-relaxed text-mist font-light">
                          {chapter.body}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="h-px w-14 bg-gold" />
                        <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-faint">
                          Scroll to explore
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mx-auto mt-9 flex max-w-7xl items-center gap-4 px-6">
            <div className="h-px flex-1 bg-border/60">
              <div
                className="h-px bg-gold-sheet transition-[width] duration-150"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="font-sans text-[10px] tracking-[0.3em] text-faint">
              {String(Math.round(progress * 100)).padStart(3, "0")}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
