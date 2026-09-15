import { useRef, useState } from "react";
import { RevealText } from "@/components/site/RevealText";
import { soundEffects } from "@/hooks/useSoundEffects";

const ROWS = [
  {
    n: "01",
    title: "Shayari",
    meta: "Couplets · Urdu & Hindi Poetics",
    line: "Tere aane se mukammal hui zindagi, warna hum to bas saans le rahe the.",
    en: "With your arrival life became whole, before that I was merely breathing.",
  },
  {
    n: "02",
    title: "Two-Line Sher",
    meta: "Philosophical & Romantic Gems",
    line: "Hazaaron khwahishein aisi ke har khwahish pe dam nikle.",
    en: "Thousands of desires, and each desire worthy of dying for.",
  },
  {
    n: "03",
    title: "Ghazal & Poems",
    meta: "Melodic Cadence & Rhythm",
    line: "Rafta rafta wo meri hasti ka saamaan ho gaye.",
    en: "Slowly, quietly, you became the very essence of my existence.",
  },
  {
    n: "04",
    title: "Motivational Quotes",
    meta: "Fire · Grit · Resilience",
    line: "Girkar sambhalna hi to zindagani hai, hausle se aage badhna nishani hai.",
    en: "To fall and rise again is what life is made of; courage is the only compass.",
  },
  {
    n: "05",
    title: "Love & Romance",
    meta: "Devotion & Tender Longing",
    line: "Tum paas hote ho to har lamha sukoon ban jaata hai.",
    en: "When you are near, every fleeting second turns into stillness and peace.",
  },
  {
    n: "06",
    title: "Melancholy & Dark",
    meta: "Midnight Silence & Solitude",
    line: "Kuch baatein sirf tanhaayi hi samajh sakti hai.",
    en: "Some things can only be understood by the company of midnight silence.",
  },
];

export function Catalog() {
  const [active, setActive] = useState<number | null>(null);
  const capsule = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (i: number) => {
    try {
      soundEffects.playMoodTone(320 + i * 45);
    } catch {
      // audio policy fallback
    }
    setActive(i);
  };

  return (
    <section
      className="relative z-10 px-6 py-32"
      onPointerMove={(e) => {
        const el = capsule.current;
        if (el)
          el.style.transform = `translate3d(${e.clientX + 24}px, ${e.clientY - 40}px, 0)`;
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div
          data-reveal
          className="mb-16 flex flex-wrap items-end justify-between gap-8"
        >
          <div>
            <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.45em] text-gold">
              What it creates
            </p>
            <h2 className="font-display text-[length:var(--text-section-title)] font-light tracking-[-0.03em] text-foreground">
              <RevealText
                text="Six Poetic Engines"
                effect="flow-cinema"
                delay={100}
              />
            </h2>
          </div>
          <p className="max-w-sm font-sans text-xs sm:text-sm leading-relaxed text-mist">
            <RevealText
              text="From two-line shers to melodic ghazals and quotes — crafted with natural sentiment, rhythm, and timeless emotional weight."
              effect="flow-cinema"
              delay={200}
              stagger={25}
            />
          </p>
        </div>

        <div className="border-t border-border/70">
          {ROWS.map((r, i) => (
            <div
              key={r.n}
              {...{
                [i % 2 === 0 ? "data-reveal-left" : "data-reveal-right"]: "",
              }}
              style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}
              onPointerEnter={() => handleMouseEnter(i)}
              onPointerLeave={() => setActive(null)}
              className="group relative flex cursor-pointer items-center gap-6 overflow-hidden border-b border-border/70 py-8 transition-[padding] duration-500 ease-[var(--ease-out-expo)] hover:py-14"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 -z-10 w-0 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent transition-[width] duration-700 ease-[var(--ease-out-expo)] group-hover:w-full"
              />
              {/* Laser flare underline */}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-700 group-hover:w-full shadow-[0_0_14px_#f6d860]"
              />
              <span className="w-14 font-sans text-xs tracking-[0.3em] text-faint transition-colors duration-500 group-hover:text-gold">
                {r.n}
              </span>
              <h3 className="font-display text-[clamp(28px,5vw,64px)] font-light leading-none transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-6 group-hover:text-gold">
                <RevealText
                  text={r.title}
                  effect="flow-cinema"
                  delay={i * 40}
                />
              </h3>
              <span className="ml-auto hidden font-sans text-[11px] uppercase tracking-[0.25em] text-faint md:block transition-colors group-hover:text-mist">
                <RevealText
                  text={r.meta}
                  effect="flow-cinema"
                  delay={i * 40 + 100}
                  stagger={30}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Live Preview Capsule */}
      <div
        ref={capsule}
        aria-hidden
        className="glass-gold pointer-events-none fixed left-0 top-0 z-40 hidden max-w-sm rounded-2xl p-6 transition-opacity duration-300 md:block shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.3)] border border-gold/50 backdrop-blur-2xl"
        style={{ opacity: active === null ? 0 : 1 }}
      >
        <div className="flex items-center gap-2 mb-2 font-sans text-[9px] uppercase tracking-[0.3em] text-gold/80">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-ping" />
          <span>Live Engine Output</span>
        </div>
        <p className="font-display text-lg italic text-gold leading-snug">
          &ldquo;{active !== null ? (ROWS[active]?.line ?? "") : ""}&rdquo;
        </p>
        <p className="mt-2 font-sans text-xs text-white/80 leading-relaxed font-light">
          {active !== null ? (ROWS[active]?.en ?? "") : ""}
        </p>
      </div>
    </section>
  );
}
